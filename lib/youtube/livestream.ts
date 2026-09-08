import "server-only";

import { getYouTubeEnv } from "./env";

/**
 * Livestream detection against YouTube Data API v3. Cached 60s via Next's
 * fetch cache to stay inside the 10,000-unit daily quota (search.list is 100
 * units per call → ~96 calls/day at 60s cadence; well under).
 *
 * Degrades to `{ live: false }` when the API key or channel id aren't
 * configured or the API returns an error — the site keeps working; it just
 * can't tell you we're live.
 */

export interface LivestreamStatus {
  live: boolean;
  /** Video id of the active live broadcast, if live. */
  videoId?: string;
  title?: string;
  /** When the next service is likely — populated from service schedule, not YT. */
  nextService?: { day: string; time: string };
  /** Epoch ms of the status check; useful for client-side "stale" detection. */
  checkedAt: number;
  /** The source — "youtube" (live), "offline" (we checked, nobody home), or "no-env" (couldn't check). */
  source: "youtube" | "offline" | "no-env" | "error";
}

const CACHE_SECONDS = 60;

export async function getLivestreamStatus(): Promise<LivestreamStatus> {
  const env = getYouTubeEnv();
  if (!env) {
    return {
      live: false,
      checkedAt: Date.now(),
      source: "no-env",
    };
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", env.channelId);
  url.searchParams.set("eventType", "live");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("key", env.apiKey);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: CACHE_SECONDS, tags: ["livestream"] },
    });
    if (!res.ok) {
      return { live: false, checkedAt: Date.now(), source: "error" };
    }
    const data = (await res.json()) as YouTubeSearchResponse;
    const item = data.items?.[0];
    if (!item) {
      return { live: false, checkedAt: Date.now(), source: "offline" };
    }
    return {
      live: true,
      videoId: item.id.videoId,
      title: item.snippet.title,
      checkedAt: Date.now(),
      source: "youtube",
    };
  } catch {
    return { live: false, checkedAt: Date.now(), source: "error" };
  }
}

// ---------- YouTube Data API v3 response shape (partial) ----------
interface YouTubeSearchResponse {
  items?: Array<{
    id: { videoId: string };
    snippet: { title: string; publishedAt: string };
  }>;
}
