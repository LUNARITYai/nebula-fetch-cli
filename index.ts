#!/usr/bin/env node

import { Command } from "commander";
import { version } from "@/package.json";

import chalk from "chalk";

import { downloadYoutube } from "@/commands/youtube";
import { scrapeWebPage } from "@/commands/scrape";
import { isValidYoutubeUrl, isValidHttpUrl } from "@/utils/validators";

const program = new Command();

program
  .name("nebula-fetch")
  .description("CLI tool for downloading media from different platforms")
  .version(version);

program
  .command("youtube")
  .alias("yt")
  .description("Download a video from YouTube")
  .argument("<urls...>", "URLs of the videos to download")
  .option("-o, --output <path>", "Output path (folder) for the videos")
  .option("-a, --audio", "Download only the audio", false)
  .option("-v, --verbose", "Show verbose output", false)
  .action(async (urls: string[], options) => {
    try {
      const invalidUrls = urls.filter((url) => !isValidYoutubeUrl(url));

      if (invalidUrls.length > 0) {
        console.error(chalk.red("Error: The following URLs are invalid:"));
        invalidUrls.forEach((url) => console.error(chalk.yellow(`- ${url}`)));
        process.exit(1);
      }

      console.log(
        chalk.blue(
          `🚀 Starting concurrent download for ${urls.length} ${
            options.audio ? "audio tracks" : "videos"
          }...`
        )
      );

      await Promise.all(
        urls.map((url) =>
          downloadYoutube({
            url,
            audioOnly: options.audio,
            outputPath: options.output, // Note: If multiple files, this should probably be treated as a dir, but for now passing as is.
            verbose: options.verbose,
          })
        )
      );
      
      console.log(chalk.green.bold("\n✨ All downloads completed!"));
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program
  .command("scrape")
  .alias("sc")
  .description("Scrape and save web page content")
  .argument("<urls...>", "URLs of the pages to scrape")
  .option("-o, --output <path>", "Output path (folder or file)")
  .option("-f, --format <format>", "Output format (md, json, txt, html)", "md")
  .option("--full", "Extract full metadata (meta tags, headings, links, images)", false)
  .option("-v, --verbose", "Show verbose output", false)
  .action(async (urls: string[], options) => {
    try {
      const validFormats = ["md", "json", "txt", "html"];
      if (!validFormats.includes(options.format)) {
        console.error(
          chalk.red(
            `Error: Invalid format "${options.format}". Choose from: ${validFormats.join(", ")}`
          )
        );
        process.exit(1);
      }

      const invalidUrls = urls.filter((url) => !isValidHttpUrl(url));

      if (invalidUrls.length > 0) {
        console.error(chalk.red("Error: The following URLs are invalid:"));
        invalidUrls.forEach((url) => console.error(chalk.yellow(`- ${url}`)));
        process.exit(1);
      }

      console.log(
        chalk.blue(
          `🚀 Starting scrape for ${urls.length} URL${urls.length > 1 ? "s" : ""}...`
        )
      );

      await Promise.all(
        urls.map((url) =>
          scrapeWebPage({
            url,
            format: options.format,
            fullMode: options.full,
            verbose: options.verbose,
            outputPath: options.output,
          })
        )
      );

      console.log(chalk.green.bold("\n✨ All scraping completed!"));
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parseAsync().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});
