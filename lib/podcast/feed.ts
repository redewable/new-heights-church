import "server-only";

/**
 * Newest episode from a podcast RSS feed (Buzzsprout for The Brian Hallam
 * Podcast). This is the dependable source: YouTube's channel Atom feed
 * answers 404 for stretches at a time, and when it does the page still
 * needs a real latest episode — title, date, and the audio itself.
 */
export interface PodcastEpisode {
  title: string;
  /** ISO timestamp. */
  publishedAt: string;
  /** Direct audio URL from the enclosure. */
  audioUrl: string;
  /** Episode page on the host, if the feed gives one. */
  link: string | null;
}

const REVALIDATE_SECONDS = 1800;

export async function getLatestEpisode(rssUrl: string): Promise<PodcastEpisode | null> {
  try {
    const res = await fetch(rssUrl, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return parseLatestEpisode(await res.text());
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[podcast] feed unavailable — ${reason}`);
    return null;
  }
}

/** Exported for tests. Newest by pubDate, whatever the feed order. */
export function parseLatestEpisode(xml: string): PodcastEpisode | null {
  let best: PodcastEpisode | null = null;
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = match[1];
    const title = text(item, "title");
    const pub = text(item, "pubDate");
    const audioUrl = item.match(/<enclosure[^>]*\surl="([^"]+)"/)?.[1] ?? null;
    if (!title || !pub || !audioUrl) continue;
    const at = Date.parse(pub);
    if (Number.isNaN(at)) continue;
    if (!best || at > Date.parse(best.publishedAt)) {
      best = {
        title: decodeEntities(title),
        publishedAt: new Date(at).toISOString(),
        audioUrl,
        link: text(item, "link"),
      };
    }
  }
  return best;
}

function text(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!m) return null;
  return m[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim() || null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}
