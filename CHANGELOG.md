# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.5] - 2026-01-23

### Added
- Initial CLI scaffolding using `commander` and `chalk`.
- **YouTube Support**:
    - Download standard videos (`.mp4`) and extract audio (`.mp3`) using `@ybd-project/ytdl-core`.
    - Batch processing support for multiple URLs in a single command.
    - URL validation for YouTube links.
- Output control: Option to specify custom output filenames or directories.
- Built-in validation logic in `utils/validators.ts`.
- Build configuration using Bun.
