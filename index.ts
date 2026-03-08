#!/usr/bin/env node

import { Command } from "commander";
import { version } from "@/package.json";

import chalk from "chalk";

import { downloadYoutube, resolvePlaylistUrls } from "@/commands/youtube";
import { scrapeWebPage } from "@/commands/scrape";
import { isValidYoutubeUrl, isValidHttpUrl, isYoutubePlaylistUrl } from "@/utils/validators";

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
      // Validate all input URLs first
      const invalidUrls = urls.filter((url) => !isValidYoutubeUrl(url));

      if (invalidUrls.length > 0) {
        console.error(chalk.red("Error: The following URLs are invalid:"));
        invalidUrls.forEach((url) => console.error(chalk.yellow(`- ${url}`)));
        process.exit(1);
      }

      // Separate playlist URLs from single video URLs
      const playlistUrls = urls.filter((url) => isYoutubePlaylistUrl(url));
      const videoUrls = urls.filter((url) => !isYoutubePlaylistUrl(url));

      // Resolve playlists into individual video URLs
      for (const playlistUrl of playlistUrls) {
        try {
          console.log(chalk.cyan("📋 Resolving playlist..."));
          const playlist = await resolvePlaylistUrls(playlistUrl);
          console.log(
            chalk.cyan(
              `📋 Playlist: ${playlist.title} (${playlist.urls.length} videos)`
            )
          );
          videoUrls.push(...playlist.urls);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          console.error(
            chalk.red(`❌ Failed to resolve playlist: ${msg}`)
          );
          process.exit(1);
        }
      }

      if (videoUrls.length === 0) {
        console.error(chalk.red("Error: No videos found to download."));
        process.exit(1);
      }

      console.log(
        chalk.blue(
          `🚀 Starting concurrent download for ${videoUrls.length} ${
            options.audio ? "audio tracks" : "videos"
          }...`
        )
      );

      const results = await Promise.allSettled(
        videoUrls.map((url) =>
          downloadYoutube({
            url,
            audioOnly: options.audio,
            outputPath: options.output,
            verbose: options.verbose,
          })
        )
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length === results.length) {
        console.error(chalk.red.bold("\n❌ All downloads failed."));
        process.exit(1);
      } else if (failed.length > 0) {
        console.log(chalk.yellow.bold(`\n⚠️  ${results.length - failed.length}/${results.length} downloads completed, ${failed.length} failed.`));
      } else {
        console.log(chalk.green.bold("\n✨ All downloads completed!"));
      }
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

      const results = await Promise.allSettled(
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

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length === results.length) {
        console.error(chalk.red.bold("\n❌ All scraping failed."));
        process.exit(1);
      } else if (failed.length > 0) {
        console.log(chalk.yellow.bold(`\n⚠️  ${results.length - failed.length}/${results.length} scrapes completed, ${failed.length} failed.`));
      } else {
        console.log(chalk.green.bold("\n✨ All scraping completed!"));
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parseAsync().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});
