#!/usr/bin/env node

import { Command } from "commander";
import { version } from "@/package.json";

import chalk from "chalk";

import { downloadYoutube } from "@/commands/youtube";
import { isValidYoutubeUrl } from "@/utils/validators";

const program = new Command();

program
  .name("nebula-fetch")
  .description("CLI tool for downloading media from different platforms")
  .version(version);

program
  .command("youtube")
  .alias("yt")
  .description("Download a video from YouTube")
  .argument("<urls...>", "URLs of the videos")
  .option("-o, --output <path>", "Output path for the video")
  .option("-a, --audio", "Download only the audio", false)
  .option("-v, --verbose", "Show verbose output", false)
  .action(async (urls: string[], options) => {
    try {
      const invalidUrls = urls.filter((url) => !isValidYoutubeUrl(url));

      if (invalidUrls.length > 0) {
        console.error(
          chalk.red(
            `Error: The following URLs are invalid:\n${invalidUrls.join(
              "\n"
            )}\nPlease provide valid YouTube video URLs`
          )
        );
        process.exit(1);
      }

      console.log(
        chalk.blue(
          `🚀 Starting download for ${urls.length} ${
            urls.length === 1 ? "video" : "videos"
          }...`
        )
      );

      const downloadPromises = urls.map((url) =>
        downloadYoutube({
          url,
          audioOnly: options.audio,
          outputPath: options.output,
          verbose: options.verbose,
        }).catch((err) => {
          console.error(chalk.red(`Failed to download ${url}:`), err);
        })
      );

      await Promise.all(downloadPromises);
      console.log(chalk.green.bold("\n✨ All downloads processed!"));
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parseAsync().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});
