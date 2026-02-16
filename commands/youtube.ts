import path from "path";
import chalk from "chalk";
import youtubeDl from "youtube-dl-exec";

interface YoutubeDlOptions {
  flatPlaylist?: boolean;
  dumpSingleJson?: boolean;
  noWarnings?: boolean;
  skipDownload?: boolean;
  output?: string;
  extractAudio?: boolean;
  audioFormat?: string;
  format?: string;
}

interface YoutubeDlInfo {
  title?: string;
  uploader?: string;
  entries?: Array<{ id: string }>;
}

interface PlaylistInfo {
  title: string;
  urls: string[];
}

export async function resolvePlaylistUrls(url: string): Promise<PlaylistInfo> {
  const options: YoutubeDlOptions = {
    flatPlaylist: true,
    dumpSingleJson: true,
    noWarnings: true,
  };

  const info = await youtubeDl(url, options) as YoutubeDlInfo;

  const title: string = info.title || "Unknown Playlist";
  const urls: string[] = (info.entries || []).map(
    (entry) => `https://www.youtube.com/watch?v=${entry.id}`
  );

  return { title, urls };
}

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

    const infoOptions: YoutubeDlOptions = {
      dumpSingleJson: true,
      noWarnings: true,
      skipDownload: true,
    };

    const info = await youtubeDl(url, infoOptions) as YoutubeDlInfo;

    const title = info.title;
    const author = info.uploader;

    console.log(chalk.cyan(`🎬 Video title: ${title}`));
    console.log(chalk.cyan(`🎬 Video author: ${author || "Unknown"}`));

    if (verbose) {
      console.log(JSON.stringify(info, null, 2));
    }

    const safeTitle = title.replace(/[^\w\s]/gi, "_");
    const ext = audioOnly ? "mp3" : "mp4";
    
    let finalOutputPath: string;
    if (outputPath) {
      // If outputPath is an existing directory, put the file inside it
      // Otherwise, treat it as a file path
      try {
        const stats = await import("fs/promises").then(fs => fs.stat(outputPath));
        if (stats.isDirectory()) {
          finalOutputPath = path.join(outputPath, `${safeTitle}.${ext}`);
        } else {
          finalOutputPath = outputPath;
        }
      } catch {
        finalOutputPath = outputPath;
      }
    } else {
      finalOutputPath = path.join(process.cwd(), `${safeTitle}.${ext}`);
    }

    console.log(chalk.blue(`⬇️  Downloading to: ${finalOutputPath}`));

    const downloadFlags: YoutubeDlOptions = {
      output: finalOutputPath,
      noWarnings: true,
    };

    if (audioOnly) {
      downloadFlags.extractAudio = true;
      downloadFlags.audioFormat = "mp3";
    } else {
      downloadFlags.format = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best";
    }

    await youtubeDl(url, downloadFlags);

    console.log(chalk.green.bold(`✅ Download finished: ${finalOutputPath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red.bold("❌ Error:", error.message));
    } else {
      console.error(chalk.red.bold("❌ An unknown error occurred"));
    }
  }
}
