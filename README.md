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

# Download audio only
nebula-fetch youtube <url> --audio
# or
nebula-fetch yt <url> -a

# Specify output path
nebula-fetch youtube <url> --output path/to/file
# or
nebula-fetch yt <url> -o path/to/file

# Show verbose output
nebula-fetch youtube <url> --verbose
# or
nebula-fetch yt <url> -v
```

### ⚙️ Options

- `-o, --output <path>` - Specify the output path for the downloaded file
- `-a, --audio` - Download audio only (saves as .mp3)
- `-v, --verbose` - Show detailed information during download
- `--version` - Show version number
- `--help` - Show help information

## ✨ Features

- YouTube video downloads
- Audio-only extraction option
- Custom output path
- Verbose mode for detailed information

## 📄 License

MIT
