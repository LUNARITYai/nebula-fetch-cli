# Nebula Fetch CLI

A command-line interface tool for downloading media from different platforms.

## 🚀 Installation

```bash
npm install -g @lunarity/nebula-fetch-cli
```

## 📖 Usage

### 📺 YouTube Downloads

Download videos or audio from YouTube using the following commands:

```bash
# Download video (default)
nebula-fetch youtube <url>
# or using alias
nebula-fetch yt <url>

# Download multiple videos simultaneously
nebula-fetch yt <url1> <url2> <url3> ...

# Download audio only
nebula-fetch youtube <url> --audio
# or
nebula-fetch yt <url> -a

# Specify output file path (for single file)
nebula-fetch youtube <url> --output path/to/file.mp4
# or
nebula-fetch yt <url> -o path/to/file.mp4

# Specify output directory (for single or multiple files)
nebula-fetch yt <url1> <url2> -o path/to/directory/
```

### ⚙️ Options

- `-o, --output <path>` - Specify the output path (filename for single download, or directory for multiple)
- `-a, --audio` - Download audio only (saves as .mp3)
- `-v, --verbose` - Show detailed information during download
- `--version` - Show version number
- `--help` - Show help information

## ✨ Features

- YouTube video downloads
- **Batch downloading** (multiple URLs support)
- Audio-only extraction option
- Custom output path or directory
- Verbose mode for detailed information

## 📄 License

MIT
