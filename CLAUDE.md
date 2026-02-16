# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nebula-fetch-cli** is a command-line tool for downloading YouTube videos/audio and scraping web pages, built with Bun. It wraps `youtube-dl-exec` (requires `yt-dlp` installed on the system) and uses `cheerio`/`turndown` for web scraping.

## Prerequisites

`yt-dlp` must be installed on the system (`youtube-dl-exec` wraps it).

## Commands

```bash
# Development - run CLI directly
bun dev

# Build executable to dist/ (targets Node)
bun run build

# Run built CLI
./dist/index.js youtube <url> [options]
./dist/index.js scrape <url> [options]
```

No test or lint scripts are currently configured.

## Architecture

```
index.ts                    # CLI entry point - commander.js setup, URL validation, command routing
    ↓
commands/
  youtube.ts                # YouTube download logic (single videos + playlist resolution)
  scrape.ts                 # Web scraping - fetches HTML, extracts content, writes to file
    ↓
utils/
  validators.ts             # URL validation (YouTube formats, playlist detection, generic HTTP)
  scrapers.ts               # HTML content extraction with cheerio (main content + full metadata mode)
  converters.ts             # Output format conversion (md, json, txt, html) using turndown
```

**Key flows:**
1. `youtube` (alias `yt`): Validates URLs → separates playlists from single videos → resolves playlists via `resolvePlaylistUrls()` (uses `flatPlaylist` + `dumpSingleJson`) → downloads all videos concurrently with `Promise.all()`
2. `scrape` (alias `sc`): Validates URLs → fetches HTML → extracts content via cheerio (`extractMainContent` or `extractFullContent` for `--full` mode) → converts to output format → writes to file

**CLI options:**
- `youtube`: `--output` (directory or file path), `--audio` (MP3 extraction), `--verbose`
- `scrape`: `--output` (directory or file path), `--format` (md/json/txt/html, default: md), `--full` (extract metadata, headings, links, images), `--verbose`

## Path Aliases

`tsconfig.json` defines `@/*` mapping to the project root. All imports use this alias (e.g., `import { downloadYoutube } from "@/commands/youtube"`).

## Technology Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode, ESNext target)
- **CLI Framework:** commander
- **Download Engine:** youtube-dl-exec (wraps yt-dlp)
- **Scraping:** cheerio (HTML parsing), turndown (HTML→Markdown)
- **Styling:** chalk
- **Logging:** debug

## Git Workflow

- `main` - stable releases
- `develop` - active development
- Feature branches merged via pull requests
