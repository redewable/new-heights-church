import "server-only";

/**
 * Newest upload on a YouTube channel, read from the channel's public Atom
 * feed — no API key, no quota. Cached for half an hour through Next's fetch
 * cache. Returns null on any failure so the caller can fall back to the
 * show's art instead of an empty slot.
 */
export interface LatestUpload {
  videoId: string;
  title: string;
  /** ISO timestamp from the feed. */
  publishedAt: string;
}

const REVALIDATE_SECONDS = 1800;

export async function getLatestUpload(channelId: string): Promise<LatestUpload | null> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return parseLatest(await res.text());
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[youtube] latest upload for ${channelId} unavailable — ${reason}`);
    return null;
  }
}

/** Exported for tests. Chooses the newest entry by `published`, whatever the feed order. */
export function parseLatest(xml: string): LatestUpload | null {
  let best: LatestUpload | null = null;
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entry = match[1];
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim();
    if (!videoId || !title || !publishedAt) continue;
    const at = Date.parse(publishedAt);
    if (Number.isNaN(at)) continue;
    if (!best || at > Date.parse(best.publishedAt)) {
      best = { videoId, title: decodeEntities(title.trim()), publishedAt };
    }
  }
  return best;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}
