# Nebula Fetch CLI

A command-line interface tool for downloading media and scraping web content from different platforms.

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

#### ⚙️ YouTube Options

- `-o, --output <path>` - Specify the output path for the downloaded file
- `-a, --audio` - Download audio only (saves as .mp3)
- `-v, --verbose` - Show detailed information during download

### 🌐 Web Scraping

Scrape and save web page content in multiple formats:

```bash
# Scrape to Markdown (default)
nebula-fetch scrape <url>
# or using alias
nebula-fetch sc <url>

# Choose output format
nebula-fetch scrape <url> -f md      # Markdown
nebula-fetch scrape <url> -f json    # JSON
nebula-fetch scrape <url> -f txt     # Plain text
nebula-fetch scrape <url> -f html    # Cleaned HTML

# Extract full metadata (meta tags, headings, links, images)
nebula-fetch scrape <url> --full

# Scrape multiple URLs
nebula-fetch scrape <url1> <url2> <url3>

# Specify output directory
nebula-fetch scrape <url> -o ./scraped

# Combine options
nebula-fetch sc <url> --full -f json -o ./output -v
```

#### ⚙️ Scrape Options

- `-o, --output <path>` - Output path (folder or file)
- `-f, --format <format>` - Output format: `md`, `json`, `txt`, `html` (default: `md`)
- `--full` - Extract full metadata (meta tags, headings, links, images)
- `-v, --verbose` - Show verbose output

### 🔧 Global Options

- `--version` - Show version number
- `--help` - Show help information

## ✨ Features

- YouTube video downloads
- Audio-only extraction option
- Web page scraping with multiple output formats (Markdown, JSON, text, HTML)
- Full metadata extraction (OG tags, Twitter cards, headings, links, images)
- Concurrent multi-URL processing
- Custom output path
- Verbose mode for detailed information

## 📄 License

MIT
