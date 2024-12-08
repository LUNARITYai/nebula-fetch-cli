import fs from "fs";
import path from "path";

import { YtdlCore, toPipeableStream } from "@ybd-project/ytdl-core";
import chalk from "chalk";

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
    const ytdl = new YtdlCore({});
    let videoTitle = "";

    await ytdl.getBasicInfo(url).then((info) => {
      console.log(chalk.cyan(`🎬 Video title: ${info.videoDetails.title}`));
      console.log(
        chalk.cyan(
          `🎬 Video author: ${info.videoDetails.author?.name || "Unknown"}`
        )
      );
      if (verbose) {
        console.log(JSON.stringify(info.videoDetails, null, 2));
      }
      videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "_");
    });

    const stream = await ytdl.download(url, {
      filter: audioOnly ? "audioonly" : "videoandaudio",
      quality: "highest",
    });

    const outputFilePath =
      outputPath ||
      path.join(process.cwd(), `${videoTitle}.${audioOnly ? "mp3" : "mp4"}`);
    toPipeableStream(stream).pipe(fs.createWriteStream(outputFilePath));

    console.log(chalk.green.bold(`✅ Download finished: ${outputFilePath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red.bold("❌ Error:", error.message));
    }
  }
}
