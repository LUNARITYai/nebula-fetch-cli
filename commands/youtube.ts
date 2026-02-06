import path from "path";
import chalk from "chalk";
import youtubeDl from "youtube-dl-exec";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const info: any = await youtubeDl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      skipDownload: true,
    } as any);

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

    const downloadFlags: any = {
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
