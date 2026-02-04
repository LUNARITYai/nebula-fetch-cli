# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nebula-fetch-cli** is a command-line tool for downloading YouTube videos and audio using Bun runtime. It wraps `youtube-dl-exec` and provides a simple interface with concurrent download support.

## Commands

```bash
# Development - run CLI directly
bun dev

# Build executable to dist/
bun run build

# Run built CLI
./dist/index.js youtube <url> [options]
```

No test or lint scripts are currently configured.

## Architecture

```
index.ts                    # CLI entry point - commander.js setup, URL validation
    ↓
commands/youtube.ts         # Download logic using youtube-dl-exec
    ↓
utils/validators.ts         # YouTube URL validation (supports standard, short, embed, mobile formats)
```

**Key flow:**
1. `index.ts` registers the "youtube" (alias "yt") command with commander
2. URLs are validated via `isValidYoutubeUrl()` before processing
3. Multiple URLs are downloaded concurrently with `Promise.all()`
4. `downloadYoutube()` fetches metadata first, then downloads to output path

**CLI options:** `--output`, `--audio` (MP3 extraction), `--verbose`

## Technology Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode, ESNext target)
- **CLI Framework:** commander
- **Download Engine:** youtube-dl-exec
- **Styling:** chalk

## Git Workflow

- `main` - stable releases
- `develop` - active development
- Feature branches merged via pull requests
