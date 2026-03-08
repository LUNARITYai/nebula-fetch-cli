import TurndownService from "turndown";
import type { ScrapedContent } from "@/utils/scrapers";

export type OutputFormat = "md" | "json" | "txt" | "html";

function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "  - ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<h([1-6])[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function metadataToYamlFrontmatter(content: ScrapedContent): string {
  const meta = content.metadata;
  if (!meta) return "";

  const lines = ["---"];
  lines.push(`title: "${content.title.replace(/"/g, '\\"')}"`);
  if (meta.description)
    lines.push(`description: "${meta.description.replace(/"/g, '\\"')}"`);
  if (meta.author) lines.push(`author: "${meta.author.replace(/"/g, '\\"')}"`);

  if (Object.keys(meta.ogTags).length > 0) {
    lines.push("og:");
    for (const [key, value] of Object.entries(meta.ogTags)) {
      lines.push(`  ${key}: "${value.replace(/"/g, '\\"')}"`);
    }
  }

  if (Object.keys(meta.twitterTags).length > 0) {
    lines.push("twitter:");
    for (const [key, value] of Object.entries(meta.twitterTags)) {
      lines.push(`  ${key}: "${value.replace(/"/g, '\\"')}"`);
    }
  }

  lines.push("---\n");
  return lines.join("\n");
}

function metadataToTextHeader(content: ScrapedContent): string {
  const meta = content.metadata;
  if (!meta) return "";

  const lines = [`Title: ${content.title}`];
  if (meta.description) lines.push(`Description: ${meta.description}`);
  if (meta.author) lines.push(`Author: ${meta.author}`);
  lines.push(`Headings: ${meta.headings.length}`);
  lines.push(`Links: ${meta.links.length}`);
  lines.push(`Images: ${meta.images.length}`);
  lines.push("=".repeat(60) + "\n");
  return lines.join("\n");
}

function metadataMarkdownSections(content: ScrapedContent): string {
  const meta = content.metadata;
  if (!meta) return "";

  const sections: string[] = [];

  if (meta.headings.length > 0) {
    sections.push("\n## Document Structure\n");
    for (const h of meta.headings) {
      sections.push(`${"  ".repeat(h.level - 1)}- H${h.level}: ${h.text}`);
    }
  }

  if (meta.links.length > 0) {
    sections.push("\n## Links\n");
    for (const link of meta.links) {
      sections.push(`- [${link.text}](${link.href})`);
    }
  }

  if (meta.images.length > 0) {
    sections.push("\n## Images\n");
    for (const img of meta.images) {
      sections.push(`- ![${img.alt}](${img.src})`);
    }
  }

  return sections.join("\n");
}

export function convertToFormat(
  content: ScrapedContent,
  format: OutputFormat,
  fullMode: boolean
): string {
  switch (format) {
    case "md": {
      const turndown = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
      });
      const markdown = turndown.turndown(content.content);

      if (fullMode && content.metadata) {
        return (
          metadataToYamlFrontmatter(content) +
          `# ${content.title}\n\n` +
          markdown +
          metadataMarkdownSections(content)
        );
      }

      return `# ${content.title}\n\n${markdown}`;
    }

    case "json": {
      const base: Record<string, unknown> = {
        title: content.title,
        content: stripHtmlTags(content.content),
      };

      if (fullMode && content.metadata) {
        base.metadata = content.metadata;
      }

      return JSON.stringify(base, null, 2);
    }

    case "txt": {
      const text = stripHtmlTags(content.content);

      if (fullMode && content.metadata) {
        return metadataToTextHeader(content) + text;
      }

      return `${content.title}\n${"=".repeat(content.title.length)}\n\n${text}`;
    }

    case "html": {
      if (fullMode && content.metadata) {
        const meta = content.metadata;
        const metaComment = [
          `<!-- Scraped Metadata`,
          `  Title: ${content.title}`,
          meta.description ? `  Description: ${meta.description}` : null,
          meta.author ? `  Author: ${meta.author}` : null,
          `  Headings: ${meta.headings.length}`,
          `  Links: ${meta.links.length}`,
          `  Images: ${meta.images.length}`,
          `-->`,
        ]
          .filter(Boolean)
          .join("\n");

        return `${metaComment}\n${content.content}`;
      }

      return content.content;
    }
  }
}
