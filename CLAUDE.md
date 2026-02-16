# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nebula-fetch-cli** is a command-line tool for downloading YouTube videos/audio and scraping web pages. It wraps `youtube-dl-exec` (requires `yt-dlp` installed on the system) and uses `cheerio`/`turndown` for web scraping.

## Prerequisites

- Node.js 18+
- pnpm
- `yt-dlp` must be installed on the system (`youtube-dl-exec` wraps it)

## Commands

```bash
pnpm dev              # Run CLI directly via tsx
pnpm run build        # Bundle to dist/index.cjs via tsup

# Run built CLI
./dist/index.cjs youtube <url> [options]
./dist/index.cjs scrape <url> [options]
```

No test or lint scripts are currently configured.

## Architecture

```
index.ts                    # CLI entry point - commander setup, URL validation, command routing
commands/
  youtube.ts                # YouTube download (single videos + playlist resolution via yt-dlp)
  scrape.ts                 # Web scraping - fetch HTML, extract content, write to file
utils/
  validators.ts             # URL validation (YouTube formats, playlist detection, generic HTTP)
  scrapers.ts               # HTML content extraction with cheerio (main content + full metadata mode)
  converters.ts             # Output format conversion (md, json, txt, html) using turndown
```

**Key flows:**
1. `youtube` (alias `yt`): Validates URLs → separates playlists from single videos → resolves playlists via `resolvePlaylistUrls()` → downloads all videos concurrently with `Promise.all()`
2. `scrape` (alias `sc`): Validates URLs → fetches HTML → extracts content via cheerio → converts to output format → writes to file

**CLI options:**
- `youtube`: `--output` (directory or file path), `--audio` (MP3 extraction), `--verbose`
- `scrape`: `--output` (directory or file path), `--format` (md/json/txt/html, default: md), `--full` (extract metadata, headings, links, images), `--verbose`

## Path Aliases

`tsconfig.json` defines `@/*` mapping to the project root. All imports use this alias (e.g., `import { downloadYoutube } from "@/commands/youtube"`). This includes `import { version } from "@/package.json"` which works via `resolveJsonModule: true`.

## Build & Module System

- Source is ESM TypeScript with `verbatimModuleSyntax: true` — use `import type` for type-only imports
- tsup bundles everything into a single CJS file (`dist/index.cjs`) — CJS output is used because `commander` is a CJS package and causes "Dynamic require" errors in ESM bundles
- `noExternal: [/.*/]` bundles all dependencies into the output (CLI tool, not a library)
- `index.ts` contains the shebang (`#!/usr/bin/env node`) which tsup preserves in the output

## Key Patterns

- **Concurrent operations**: Multiple URLs are processed via `Promise.all()` — errors on one don't stop others
- **Options as interfaces**: Commands accept a single typed options object (`DownloadOptions`, `ScrapeOptions`)
- **Smart output path handling**: Checks if path is existing directory, ends with `/`, or is a file path — creates parent dirs as needed
- **Metadata-first downloads**: YouTube fetches metadata with `skipDownload: true` before the actual download
- **Two-mode scraping**: Basic mode (title + main content) vs full mode (`--full` flag adds OG tags, headings, links, images)
- **youtube-dl-exec returns `unknown`**: Cast to `YoutubeDlInfo` interface — be defensive as yt-dlp output varies

## Technology Stack

- **Runtime:** Node.js
- **Package Manager:** pnpm
- **Language:** TypeScript (strict mode, ESNext target)
- **Bundler:** tsup (esbuild-based)
- **Dev Runner:** tsx
- **CLI Framework:** commander
- **Download Engine:** youtube-dl-exec (wraps yt-dlp)
- **Scraping:** cheerio (HTML parsing), turndown (HTML→Markdown)
- **Styling:** chalk
- **Logging:** debug

## Git Workflow

- `main` - stable releases
- `develop` - active development
- Feature branches merged via pull requests
