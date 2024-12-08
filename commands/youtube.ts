import fs from "fs";
import path from "path";

import { YtdlCore, toPipeableStream } from "@ybd-project/ytdl-core";
import chalk from "chalk";

export async function downloadYoutube(
  url: string,
  onlyAudio: boolean = false,
  outputPath?: string
): Promise<void> {
  try {
    if (!url) {
      throw new Error("Please provide a YouTube URL");
    }

    console.log(chalk.cyan("🔍 Fetching video information..."));
    const ytdl = new YtdlCore({});
    let videoTitle = "";

    await ytdl.getBasicInfo(url).then((info) => {
      videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "_");
    });

    const stream = await ytdl.download(url, {
      filter: onlyAudio ? "audioonly" : undefined,
    });

    const outputFilePath =
      outputPath ||
      path.join(process.cwd(), `${videoTitle}.${onlyAudio ? "mp3" : "mp4"}`);
    toPipeableStream(stream).pipe(fs.createWriteStream(outputFilePath));

    console.log(chalk.cyan(`✅ Download finished: ${outputFilePath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("❌ Error:", error.message));
    }
    throw error;
  }
}
