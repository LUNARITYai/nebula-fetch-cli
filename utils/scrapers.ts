import * as cheerio from "cheerio";

export interface ScrapedContent {
  title: string;
  content: string;
  metadata?: {
    description?: string;
    author?: string;
    ogTags: Record<string, string>;
    twitterTags: Record<string, string>;
    headings: { level: number; text: string }[];
    links: { href: string; text: string }[];
    images: { src: string; alt: string }[];
  };
}

function cleanHtml($: cheerio.CheerioAPI) {
  $(
    "script, style, nav, footer, header, aside, noscript, iframe, " +
      '[class*="ad-"], [class*="ads-"], [class*="advert"], ' +
      '[id*="ad-"], [id*="ads-"], [id*="advert"], ' +
      '[class*="sidebar"], [class*="cookie"], [class*="popup"], ' +
      '[role="banner"], [role="navigation"], [role="complementary"]'
  ).remove();
}

function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

export function extractMainContent(
  html: string,
  baseUrl: string
): ScrapedContent {
  const $ = cheerio.load(html);
  cleanHtml($);

  const title =
    $("title").first().text().trim() ||
    $("h1").first().text().trim() ||
    "Untitled";

  // Resolve relative URLs in remaining content
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (href) $(el).attr("href", resolveUrl(href, baseUrl));
  });
  $("img[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src) $(el).attr("src", resolveUrl(src, baseUrl));
  });

  // Try to find main content area
  const mainContent =
    $("main").html() ||
    $("article").html() ||
    $('[role="main"]').html() ||
    $(".content").html() ||
    $(".post").html() ||
    $("body").html() ||
    "";

  return { title, content: mainContent };
}

export function extractFullContent(
  html: string,
  baseUrl: string
): ScrapedContent {
  const base = extractMainContent(html, baseUrl);
  const $ = cheerio.load(html);

  const ogTags: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property")?.replace("og:", "") || "";
    const content = $(el).attr("content") || "";
    if (prop) ogTags[prop] = content;
  });

  const twitterTags: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr("name")?.replace("twitter:", "") || "";
    const content = $(el).attr("content") || "";
    if (name) twitterTags[name] = content;
  });

  const headings: { level: number; text: string }[] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag = (el as unknown as { tagName: string }).tagName;
    headings.push({
      level: parseInt(tag[1]),
      text: $(el).text().trim(),
    });
  });

  const links: { href: string; text: string }[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().trim();
    if (href && text) {
      links.push({ href: resolveUrl(href, baseUrl), text });
    }
  });

  const images: { src: string; alt: string }[] = [];
  $("img[src]").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    if (src) {
      images.push({ src: resolveUrl(src, baseUrl), alt });
    }
  });

  return {
    ...base,
    metadata: {
      description:
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content"),
      author:
        $('meta[name="author"]').attr("content") ||
        $('meta[property="article:author"]').attr("content"),
      ogTags,
      twitterTags,
      headings,
      links,
      images,
    },
  };
}
