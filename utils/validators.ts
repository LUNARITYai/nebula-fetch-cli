/**
 * Validates YouTube URLs in various formats:
 * - Standard: https://www.youtube.com/watch?v=VIDEO_ID
 * - Short: https://youtu.be/VIDEO_ID
 * - Embedded: https://www.youtube.com/embed/VIDEO_ID
 * - Mobile: https://m.youtube.com/watch?v=VIDEO_ID
 * - With timestamps: https://www.youtube.com/watch?v=VIDEO_ID&t=123s
 */
export function isValidYoutubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Check for valid YouTube domains
    const validDomains = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
    ];
    if (!validDomains.includes(urlObj.hostname)) {
      return false;
    }

    // Handle youtu.be format
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.length > 1; // Must have video ID after /
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
