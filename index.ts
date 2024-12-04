import fs from "fs";
import path from "path";

import chalk from "chalk";
import { YtdlCore, toPipeableStream } from "@ybd-project/ytdl-core";

const DIRECTORIES = {
  audio: "./audio",
};

async function downloadYoutubeAudio(url: string): Promise<void> {
  try {
    if (!url) {
      throw new Error("Please provide a YouTube URL");
    }

    console.log(chalk.cyan("🔍 Fetching video information..."));

    const ytdl = new YtdlCore({});

    let videoTitle = "";

    ytdl.getBasicInfo(url).then((info) => {
      videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "_");
    });

    const stream = await ytdl.download(url, {
      filter: "audioonly",
    });

    const outputFilePath = path.join(DIRECTORIES.audio, `${videoTitle}.mp3`);

    toPipeableStream(stream).pipe(fs.createWriteStream(outputFilePath));

    console.log(chalk.green(`✅ Download finished: ${outputFilePath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("Error:", error.message));
    }
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const urlArg = args.find((arg) => arg.startsWith("--url="));

if (!urlArg) {
  console.error(
    chalk.red("Please provide a YouTube URL using --url=<youtube_url>")
  );
  process.exit(1);
}

const url = urlArg.split("--url=")[1];
downloadYoutubeAudio(url).catch((error) => {
  console.error(chalk.red("Fatal error:", error));
  process.exit(1);
});
