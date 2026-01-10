import fs from "fs";
import path from "path";
import { YtdlCore } from "@ybd-project/ytdl-core";
import chalk from "chalk";
import { Readable } from "stream";

interface DownloadOptions {
  url: string;
  audioOnly?: boolean;
  verbose?: boolean;
  outputPath?: string;
}

export async function downloadYoutube(options: DownloadOptions): Promise<void> {
  const { url, audioOnly = false, verbose = false, outputPath } = options;

  try {
    console.log(chalk.cyan("🔍 Fetching video information..."));
    // Use all clients to maximize chances of finding a working one
    const ytdl = new YtdlCore({
      clients: ["web", "android", "ios", "tv", "mweb"],
    });
    
    const info = await ytdl.getFullInfo(url);
    
    console.log(chalk.cyan(`🎬 Video title: ${info.videoDetails.title}`));
    console.log(
      chalk.cyan(
        `🎬 Video author: ${info.videoDetails.author?.name || "Unknown"}`
      )
    );

    if (verbose) {
      console.log(JSON.stringify(info.videoDetails, null, 2));
    }
    
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "_");

    // Filter to only valid (deciphered) formats
    let validFormats = info.formats.filter(f => f.url);

    if (validFormats.length === 0) {
       throw new Error("No downloadable formats found (signatures could not be deciphered).");
    }

    if (verbose) {
        console.log(`Found ${info.formats.length} total formats, ${validFormats.length} valid (deciphered).`);
    }

    // Sort based on preference to try best ones first
    validFormats.sort((a, b) => {
        if (audioOnly) {
            const aAudio = a.hasAudio && !a.hasVideo;
            const bAudio = b.hasAudio && !b.hasVideo;
            if (aAudio && !bAudio) return -1;
            if (!aAudio && bAudio) return 1;
            return (b.audioBitrate || 0) - (a.audioBitrate || 0);
        } else {
             const aMuxed = a.hasAudio && a.hasVideo;
             const bMuxed = b.hasAudio && b.hasVideo;
             if (aMuxed && !bMuxed) return -1;
             if (!aMuxed && bMuxed) return 1;
             return (b.bitrate || 0) - (a.bitrate || 0);
        }
    });

    let workingFormat = null;
    let workingUrl = "";
    let finalUserAgent = "";

    console.log(chalk.yellow("🔄 Testing formats to find a valid one..."));

    for (const format of validFormats) {
        let downloadUrl = format.url;
        if (info.poToken && !downloadUrl.includes('pot=')) {
            downloadUrl += `&pot=${encodeURIComponent(info.poToken)}`;
        }

        // Determine User-Agent
        let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';
        if (format.sourceClientName === 'ios') {
            userAgent = 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X; en_US)';
        } else if (format.sourceClientName === 'android') {
            userAgent = 'com.google.android.youtube/19.29.35 (Linux; U; Android 14; en_US) gzip';
        } else if (format.sourceClientName === 'tv') {
            userAgent = 'Mozilla/5.0 (ChromiumNet/53.0.2785.124) Cobalt/53.0.2785.124-devel-000000-000 Star/1.0';
        }

        try {
            const response = await fetch(downloadUrl, {
                method: 'HEAD',
                headers: {
                    'User-Agent': userAgent,
                    'Referer': 'https://www.youtube.com/',
                }
            });

            if (response.ok) {
                workingFormat = format;
                workingUrl = downloadUrl;
                finalUserAgent = userAgent;
                if (verbose) console.log(chalk.green(`  ✅ Found working format: ${format.itag} (${format.sourceClientName})`));
                break;
            } else {
                if (verbose) console.log(chalk.red(`  ❌ Format ${format.itag} (${format.sourceClientName}) failed: ${response.status}`));
            }
        } catch (e) {
            if (verbose) console.log(chalk.red(`  ❌ Format ${format.itag} error: ${e}`));
        }
    }

    if (!workingFormat || !workingUrl) {
        throw new Error("Could not find any valid downloadable format (all returned 403/Error).");
    }

    console.log(chalk.blue(`⬇️ Downloading format: ${workingFormat.container} | ${workingFormat.qualityLabel || 'Audio'} | ${workingFormat.audioBitrate || '?'}kbps | Client: ${workingFormat.sourceClientName}`));

    // Direct download bypass
    const response = await fetch(workingUrl, {
        headers: {
            'User-Agent': finalUserAgent,
            'Referer': 'https://www.youtube.com/',
        }
    });

    if (!response.ok || !response.body) {
        throw new Error(`Failed to download video stream: ${response.status} ${response.statusText}`);
    }

    const outputFilePath =
      outputPath ||
      path.join(process.cwd(), `${videoTitle}.${audioOnly ? "mp3" : "mp4"}`);
    
    const fileStream = fs.createWriteStream(outputFilePath);
    
    // Convert Web ReadableStream to Node Readable Stream
    // @ts-ignore
    const nodeStream = Readable.fromWeb(response.body);
    
    await new Promise<void>((resolve, reject) => {
        nodeStream.pipe(fileStream);
        nodeStream.on('error', reject);
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
    });

    console.log(chalk.green.bold(`✅ Download finished: ${outputFilePath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red.bold("❌ Error:", error.message));
      if (verbose && error.stack) {
        console.error(error.stack);
      }
    }
  }
}