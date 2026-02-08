import path from "path";
import { mkdir, stat, writeFile } from "fs/promises";
import chalk from "chalk";

import { extractMainContent, extractFullContent } from "@/utils/scrapers";
import { convertToFormat, type OutputFormat } from "@/utils/converters";

export interface ScrapeOptions {
  url: string;
  format?: OutputFormat;
  fullMode?: boolean;
  verbose?: boolean;
  outputPath?: string;
}

export async function scrapeWebPage(options: ScrapeOptions): Promise<void> {
  const {
    url,
    format = "md",
    fullMode = false,
    verbose = false,
    outputPath,
  } = options;

  try {
    console.log(chalk.cyan(`🔍 Fetching ${url}...`));

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; nebula-fetch/1.0; +https://github.com/LUNARITYai/nebula-fetch-cli)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log(chalk.cyan(`📄 Received ${html.length} bytes`));

    const content = fullMode
      ? extractFullContent(html, url)
      : extractMainContent(html, url);

    console.log(chalk.cyan(`🎯 Extracted: "${content.title}"`));

    if (verbose) {
      console.log(chalk.gray("\n--- Scraped Content Debug ---"));
      console.log(JSON.stringify(content, null, 2));
      console.log(chalk.gray("--- End Debug ---\n"));
    }

    const output = convertToFormat(content, format, fullMode);

    // Generate filename from page title
    const safeTitle = content.title
      .replace(/[^\w\s-]/g, "_")
      .replace(/\s+/g, "_")
      .substring(0, 100);
    const filename = `${safeTitle}.${format}`;

    let finalOutputPath: string;
    if (outputPath) {
      try {
        const stats = await stat(outputPath);
        if (stats.isDirectory()) {
          finalOutputPath = path.join(outputPath, filename);
        } else {
          finalOutputPath = outputPath;
        }
      } catch {
        // Path doesn't exist - check if it looks like a directory (ends with /)
        if (outputPath.endsWith("/") || outputPath.endsWith(path.sep)) {
          await mkdir(outputPath, { recursive: true });
          finalOutputPath = path.join(outputPath, filename);
        } else {
          // Ensure parent directory exists
          await mkdir(path.dirname(outputPath), { recursive: true });
          finalOutputPath = outputPath;
        }
      }
    } else {
      finalOutputPath = path.join(process.cwd(), filename);
    }

    await writeFile(finalOutputPath, output, "utf-8");

    console.log(
      chalk.green.bold(`✅ Saved to: ${finalOutputPath}`)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red.bold(`❌ Error scraping ${url}: ${error.message}`));
    } else {
      console.error(chalk.red.bold(`❌ An unknown error occurred scraping ${url}`));
    }
  }
}
