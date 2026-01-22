# Nebula Fetch CLI - Project Overview

**Nebula Fetch CLI** is a command-line interface tool designed for downloading media from various platforms. Currently, it supports YouTube, with planned expansion to Spotify and other services.

## 🛠 Tech Stack

- **Runtime/Bundler**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **CLI Framework**: [Commander.js](https://github.com/tj/commander.js)
- **Styling**: [Chalk](https://github.com/chalk/chalk)
- **YouTube Downloader**: [@ybd-project/ytdl-core](https://github.com/ybd-project/node-ytdl-core)

## 📂 Project Structure

- **`index.ts`**: The main entry point. Sets up the CLI program, defines top-level commands, handles argument parsing, and manages the execution flow.
- **`commands/`**: Contains the implementation logic for specific platforms.
    - `youtube.ts`: Handles YouTube video and audio downloads, including file naming and stream processing.
- **`utils/`**: Helper functions and shared logic.
    - `validators.ts`: Contains regex-based validation for URLs (currently specifically for YouTube).
- **`dist/`**: The output directory for the compiled production build.

## 🌟 Current Features

- **YouTube Support**:
    - Download standard videos (`.mp4`).
    - Extract audio only (`.mp3`).
    - **Batch Processing**: Accepts multiple URLs in a single command.
    - **Validation**: Checks for valid YouTube URLs before attempting download.
    - **Output Control**: Supports specifying a custom output filename or directory.

## 📏 Coding Conventions

- **TypeScript**:
    - strict type checking enabled (`"strict": true`).
    - Avoid `any`.
    - Use path aliases (`@/*` maps to `./*`).
- **CLI Design**:
    - Use `commander` for defining commands and options.
    - Use `chalk` for colorful and user-friendly terminal output (Green for success, Red for errors, Blue/Cyan for info).
    - Provide verbose output options (`-v`) for debugging.
- **File Handling**:
    - Check if output paths are directories or files.
    - Sanitize filenames (remove special characters) derived from video titles.

## 🗺 Roadmap

1.  **Spotify Support**: Implement a new command (e.g., `nebula-fetch spotify`) to download tracks/playlists.
2.  **Platform Expansion**: Add support for other media platforms as requirements arise.
3.  **Refactoring**: As new platforms are added, abstract common downloading/file-saving logic into shared utilities to maintain a clean codebase.
