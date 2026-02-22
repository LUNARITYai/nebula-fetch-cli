# GEMINI.md

This file provides guidance and context for when you (Gemini/Antigravity) are working with code in this repository.

## Project Overview

**nebula-fetch-cli** is a command-line interface (CLI) tool for downloading media from YouTube and scraping web pages. It is written in ESM TypeScript and uses `youtube-dl-exec` (which wraps `yt-dlp`) to handle video downloads, and `cheerio`/`turndown` for web scraping. The CLI is built with `commander.js` and styled with `chalk`.

### Key Features:
- **YouTube**: Download videos and audio from YouTube. Handles single videos and playlist resolution.
- **Scraping**: Fetch HTML from web pages, extract content, and convert to multiple formats (Markdown, JSON, TXT, HTML).
- **Concurrent Execution**: Concurrent downloads/scraping for multiple URLs using `Promise.all()`.
- **Flexible Output**: Smart output path handling (directories or files).
- **Metadata**: Two-mode scraping (basic vs. full with metadata, OG tags, headings, links) and metadata-first YouTube downloads.

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)
- `yt-dlp` must be installed on your system system-wide.

## Building and Running

The project relies on `pnpm` as the package manager and `tsx` for development execution, bundled with `tsup`.

### Development

To run the CLI in development mode:

```bash
pnpm dev [command] [options]
# Example: pnpm dev yt <url>
```

### Build

To bundle the project:

```bash
pnpm run build
```

The output will be created in `dist/index.cjs`. CJS output is used because `commander` requires it to avoid dynamic require errors.

### Using the Compiled CLI

```bash
./dist/index.cjs youtube <url>
./dist/index.cjs scrape <url>
```

## Usage

### YouTube Downloads (`youtube` or `yt`)

```bash
# Download a video
./dist/index.cjs youtube <url>

# Download audio only
./dist/index.cjs yt <url> --audio

# Specify output path
./dist/index.cjs yt <url> --output /path/to/directory/

# Show verbose output
./dist/index.cjs yt <url> --verbose
```

### Web Scraping (`scrape` or `sc`)

```bash
# Scrape a website to Markdown (default)
./dist/index.cjs scrape <url>

# Scrape and save as JSON
./dist/index.cjs sc <url> --format json

# Scrape with full metadata extraction (OG tags, images, headings, nested links)
./dist/index.cjs sc <url> --full

# Specify output
./dist/index.cjs sc <url> --output /path/to/file.md
```

## Architecture & Project Structure

- `index.ts`: The main entry point. Sets up `commander`, validates URLs, and routes commands.
- `commands/youtube.ts`: Contains the logic for downloading YouTube videos. Differentiates playlists from single videos.
- `commands/scrape.ts`: Contains logic for web scraping, fetching HTML, extracting targeted content, format conversion, and writing to file.
- `utils/validators.ts`: Validates input URLs (matches YouTube formats, detects playlists, and generic HTTP links).
- `utils/scrapers.ts`: HTML content extraction using `cheerio` (handles main content and full metadata mode).
- `utils/converters.ts`: Output format conversion (md, json, txt, html) powered by `turndown`.

## Path Aliases & Build Settings
- `tsconfig.json` defines `@/*` mapping to the project root. Use this alias for all imports (e.g., `import { downloadYoutube } from "@/commands/youtube"`). This includes importing package.json via `resolveJsonModule: true`.
- Source is ESM TypeScript with `verbatimModuleSyntax: true` (use `import type` for type-only imports).
- Bundling via `tsup` bundles all dependencies into the CJS output `dist/index.cjs` (`noExternal: [/.*/]`).
