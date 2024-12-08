#!/usr/bin/env node

import { Command } from "commander";
import { version } from "@/package.json";

import chalk from "chalk";

import { downloadYoutube } from "@/commands/youtube";
import { isValidYoutubeUrl } from "./utils/validators";

const program = new Command();

program
  .name("nebula-fetch")
  .description("CLI tool for downloading media from different platforms")
  .version(version);

program
  .command("youtube")
  .alias("yt")
  .description("Download a video from YouTube")
  .argument("<url>", "URL of the video")
  .option("-o, --output <path>", "Output path for the video")
  .option("-a, --audio", "Download only the audio", false)
  .option("-v, --verbose", "Show verbose output", false)
  .action(async (url, options) => {
    try {
      if (!isValidYoutubeUrl(url)) {
        console.error(
          chalk.red(
            "Error: Invalid YouTube URL. Please provide a valid YouTube video URL"
          )
        );
        process.exit(1);
      }

      console.log(
        chalk.blue(
          `🚀 Downloading ${options.audio ? "audio" : "video"} from: ${url}`
        )
      );
      await downloadYoutube({
        url,
        audioOnly: options.audio,
        outputPath: options.output,
        verbose: options.verbose,
      });
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parseAsync().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});
