# Changelog

## 0.1.0

- Add web scraping command (`scrape` / `sc`) with markdown, JSON, text, and HTML output
- Migrate build tooling from Bun to pnpm + tsup + tsx
- Add YouTube playlist support
- Fix TypeScript errors and improve error handling with `Promise.allSettled`
- Bundle `youtube-dl-exec` as external dependency (requires `yt-dlp` on system)
- Add `engines`, `files`, and `prepublishOnly` to package.json
- Remove unused `debug` dependency

## 0.0.4 (deprecated)

- Broken release — stale Bun build, missing scrape command, wrong bundler output
- **Do not use.** Install `>=0.1.0` instead.

## 0.0.3

- Add scrape command for fetching web page content
- YouTube playlist resolution via yt-dlp

## 0.0.2

- Initial YouTube download functionality
- CLI setup with commander
