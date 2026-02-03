## Project Overview

This is a command-line interface (CLI) tool for downloading media from various platforms. It is written in TypeScript and uses the `youtube-dl-exec` library to handle downloads. The CLI is built with `commander.js` and styled with `chalk`.

### Key Features:
- Download videos and audio from YouTube.
- Concurrent downloads for multiple URLs.
- Specify output path for downloads.
- Verbose mode for detailed logging.

## Building and Running

The project uses `bun` as the package manager and runtime.

### Prerequisites
- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/)

### Installation

```bash
npm install -g @lunarity/nebula-fetch-cli
```

### Development

To run the CLI in development mode:

```bash
bun dev
```

To build the project:

```bash
bun run build
```

This will create an executable file in the `dist/` directory.

## Usage

### YouTube Downloads

```bash
# Download a video
nebula-fetch youtube <url>

# Download audio only
nebula-fetch youtube <url> --audio

# Specify output path
nebula-fetch youtube <url> --output /path/to/directory

# Show verbose output
nebula-fetch youtube <url> --verbose
```

## Project Structure

- `index.ts`: The main entry point of the application. It defines the CLI commands and options using `commander`.
- `commands/youtube.ts`: Contains the core logic for downloading YouTube videos using `youtube-dl-exec`.
- `utils/validators.ts`: Provides utility functions for validating input, such as YouTube URLs.
- `package.json`: Defines the project's metadata, dependencies, and scripts.
- `tsconfig.json`: Configuration file for the TypeScript compiler.
