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
    const ytdl = new YtdlCore({
      clients: ["web", "android", "ios"],
    });
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
      ...(audioOnly ? {} : { quality: "highest" }),
    });

    const fileName = `${videoTitle}.${audioOnly ? "mp3" : "mp4"}`;
    let outputFilePath: string;

    if (outputPath) {
      const isDirectory =
        (fs.existsSync(outputPath) && fs.statSync(outputPath).isDirectory()) ||
        outputPath.endsWith(path.sep) ||
        outputPath.endsWith("/");

      if (isDirectory) {
        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath, { recursive: true });
        }
        outputFilePath = path.join(outputPath, fileName);
      } else {
        outputFilePath = outputPath;
      }
    } else {
      outputFilePath = path.join(process.cwd(), fileName);
    }

    toPipeableStream(stream).pipe(fs.createWriteStream(outputFilePath));

    console.log(chalk.green.bold(`✅ Download finished: ${outputFilePath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red.bold("❌ Error:", error.message));
    }
  }
}
