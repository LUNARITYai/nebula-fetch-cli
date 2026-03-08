const VALID_YOUTUBE_DOMAINS = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
];

/**
 * Checks if a URL is a YouTube playlist URL (contains `list=` parameter).
 * Handles both standalone playlist URLs and video URLs with a playlist parameter.
 */
export function isYoutubePlaylistUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    if (!VALID_YOUTUBE_DOMAINS.includes(urlObj.hostname)) {
      return false;
    }
    return urlObj.searchParams.has("list");
  } catch {
    return false;
  }
}

/**
 * Validates YouTube URLs in various formats:
 * - Standard: https://www.youtube.com/watch?v=VIDEO_ID
 * - Short: https://youtu.be/VIDEO_ID
 * - Embedded: https://www.youtube.com/embed/VIDEO_ID
 * - Mobile: https://m.youtube.com/watch?v=VIDEO_ID
 * - With timestamps: https://www.youtube.com/watch?v=VIDEO_ID&t=123s
 * - Playlist: https://www.youtube.com/playlist?list=PLxxx
 */
export function isValidYoutubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    if (!VALID_YOUTUBE_DOMAINS.includes(urlObj.hostname)) {
      return false;
    }

    // Handle youtu.be format
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.length > 1; // Must have video ID after /
    }

    // Handle playlist URLs
    if (urlObj.pathname === "/playlist") {
      return urlObj.searchParams.has("list");
    }

    // Handle standard YouTube URLs
    if (urlObj.pathname === "/watch") {
      const videoId = urlObj.searchParams.get("v");
      return !!videoId && videoId.length === 11;
    }

    // Handle embedded format
    if (urlObj.pathname.startsWith("/embed/")) {
      const videoId = urlObj.pathname.split("/")[2];
      return !!videoId && videoId.length === 11;
    }

    return false;
  } catch {
    return false;
  }
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}
