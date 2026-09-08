"use client";

import { useState } from "react";
import Image from "next/image";
import { youTubeEmbedUrl, youTubeThumbnailUrl } from "@/lib/youtube/url";

/**
 * Click-to-load YouTube player. Renders a static poster until the visitor
 * presses play, at which point the privacy-enhanced iframe swaps in. Saves
 * ~500KB of JS + network on the first paint and keeps youtube-nocookie out
 * of the page until the visitor has actually asked for it (child-safety).
 */
export function SermonPlayer({
  videoId,
  posterUrl,
  title,
}: {
  videoId: string;
  posterUrl: string | null;
  title: string;
}) {
  const [active, setActive] = useState(false);
  const poster = posterUrl ?? youTubeThumbnailUrl(videoId);

  if (active) {
    return (
      <div className="bg-ink relative aspect-video overflow-hidden rounded-[var(--radius-lg)]">
        <iframe
          src={youTubeEmbedUrl(videoId, { autoplay: true })}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Play sermon: ${title}`}
      className="group bg-ink relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] text-left"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 960px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--nh-ink)]/75 via-[color:var(--nh-ink)]/10 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--nh-gold)] text-[color:var(--nh-ink)] shadow-[0_12px_40px_-10px_rgba(201,162,39,0.7)] transition-transform duration-200 group-hover:scale-105 md:h-24 md:w-24">
          <PlayGlyph />
        </span>
      </div>

      <span className="u-eyebrow text-cream/90 absolute bottom-4 left-4">
        Press play · YouTube
      </span>
    </button>
  );
}

function PlayGlyph() {
  return (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
    </svg>
  );
}
