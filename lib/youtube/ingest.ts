import "server-only";

import { getYouTubeApiKey } from "./env";
import { parseYouTubeId } from "./url";

/**
 * Fetch a video's public metadata from YouTube so the admin can import a
 * sermon from a URL with a single paste. Returns null when the URL is
 * malformed, the key isn't configured, or YouTube can't find the video.
 *
 * The caller (admin import action) writes this into `sermons` as a DRAFT
 * (published = false) for staff to edit before going live.
 */

export interface YouTubeMetadata {
  youtubeId: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string; // ISO
  durationSeconds: number;
  thumbnailUrl: string;
  tags: string[];
}

export async function fetchYouTubeMetadata(
  inputUrlOrId: string,
): Promise<YouTubeMetadata | null> {
  const id = parseYouTubeId(inputUrlOrId);
  if (!id) return null;

  const apiKey = getYouTubeApiKey();
  if (!apiKey) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("id", id);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as YouTubeVideosResponse;
  const item = data.items?.[0];
  if (!item) return null;

  const thumb =
    item.snippet.thumbnails.maxres?.url ??
    item.snippet.thumbnails.standard?.url ??
    item.snippet.thumbnails.high?.url ??
    item.snippet.thumbnails.default?.url ??
    "";

  return {
    youtubeId: id,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    durationSeconds: iso8601DurationToSeconds(item.contentDetails.duration),
    thumbnailUrl: thumb,
    tags: item.snippet.tags ?? [],
  };
}

/**
 * Convert an ISO 8601 duration (e.g. `PT1H23M4S`, `PT42M`, `PT15S`) into
 * a total number of seconds. Handles the subset YouTube actually emits —
 * never days or weeks.
 */
export function iso8601DurationToSeconds(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const [, h, mm, s] = m;
  return (
    (h ? parseInt(h, 10) * 3600 : 0) +
    (mm ? parseInt(mm, 10) * 60 : 0) +
    (s ? parseInt(s, 10) : 0)
  );
}

// ---------- Response shape (partial) ----------
interface YouTubeVideosResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
        standard?: { url: string };
        maxres?: { url: string };
      };
      tags?: string[];
    };
    contentDetails: { duration: string };
  }>;
}
