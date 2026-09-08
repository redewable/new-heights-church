/**
 * Parse a YouTube URL (watch page, short, embed, live, shortened) into its
 * 11-character video id. Accepts bare ids too. Returns null if the input
 * doesn't look like a YouTube video.
 *
 * Tested cases:
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *   https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s
 *   https://m.youtube.com/watch?v=dQw4w9WgXcQ
 *   https://youtu.be/dQw4w9WgXcQ?si=abc
 *   https://www.youtube.com/embed/dQw4w9WgXcQ
 *   https://www.youtube.com/live/dQw4w9WgXcQ
 *   https://www.youtube.com/shorts/dQw4w9WgXcQ
 *   dQw4w9WgXcQ
 */

const ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (s.length === 0) return null;

  if (ID_RE.test(s)) return s;

  let url: URL;
  try {
    url = new URL(s.startsWith("http") ? s : `https://${s}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID_RE.test(id) ? id : null;
  }

  if (host === "youtube.com" || host.endsWith(".youtube.com")) {
    const v = url.searchParams.get("v");
    if (v && ID_RE.test(v)) return v;
    // /embed/<id>, /live/<id>, /shorts/<id>, /v/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && ["embed", "live", "shorts", "v"].includes(parts[0])) {
      return ID_RE.test(parts[1]) ? parts[1] : null;
    }
  }

  return null;
}

/**
 * Build the privacy-enhanced embed URL. We ALWAYS use youtube-nocookie.com
 * per RFP §1 (child-safe) and §8.2 (privacy-enhanced embeds). `origin` lets
 * YouTube verify the embed is ours.
 */
export function youTubeEmbedUrl(
  videoId: string,
  opts: { origin?: string; start?: number; autoplay?: boolean } = {},
): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (opts.origin) params.set("origin", opts.origin);
  if (opts.start) params.set("start", String(opts.start));
  if (opts.autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function youTubeThumbnailUrl(videoId: string): string {
  // maxresdefault is not guaranteed; hqdefault exists for every video.
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}
