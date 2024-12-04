#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { downloadYoutubeAudio } from "./commands/youtube";

const program = new Command();

program
  .name("nebula-fetch")
  .description("CLI tool for downloading media from different platforms")
  .version("1.0.0");

program
  .command("youtube")
  .description("Download a video from YouTube")
  .argument("<url>", "URL of the video")
  .option("-o, --output <path>", "Output path for the video")
  .action(async (url, options) => {
    try {
      console.log(chalk.blue(`Downloading video from: ${url}`));
      await downloadYoutubeAudio(url, options.output);
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parse();
