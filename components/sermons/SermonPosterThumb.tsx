import Image from "next/image";
import { CHURCH } from "@/lib/constants/church";
import { youTubeThumbnailUrl } from "@/lib/youtube/url";
import type { PillarTag } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

const PILLAR_STYLE: Record<PillarTag, { dot: string; label: string }> = {
  harvest: {
    dot: "bg-[color:var(--nh-scarlet)]",
    label: "text-[color:var(--nh-scarlet-ink)]",
  },
  bride: {
    dot: "bg-[color:var(--nh-purple)]",
    label: "text-[color:var(--nh-purple-ink)]",
  },
  habitation: {
    dot: "bg-[color:var(--nh-blue)]",
    label: "text-[color:var(--nh-blue-ink)]",
  },
};

/**
 * Sermon poster — the 16:9 image block used on cards and the detail hero.
 * Falls back to the YouTube-hosted thumbnail when we haven't cut a custom
 * poster, and to a typographic placeholder when there's no video id yet.
 *
 * Any pillar tag is rendered as a small chip pinned bottom-left — keeps
 * the three-pillar language visible at a glance across the library.
 */
export function SermonPosterThumb({
  title,
  youtubeId,
  posterUrl,
  pillar,
  priority,
  sizes = "(max-width: 768px) 100vw, 640px",
  className,
}: {
  title: string;
  youtubeId: string | null;
  posterUrl: string | null;
  pillar: PillarTag | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const src = posterUrl ?? (youtubeId ? youTubeThumbnailUrl(youtubeId) : null);

  return (
    <div
      className={cn(
        "bg-ink relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={`${title} — sermon poster`}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
          unoptimized={!posterUrl}
        />
      ) : (
        <TypographicFallback title={title} />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--nh-ink)]/70 via-transparent to-transparent" />

      {pillar ? (
        // Pillar spine — a colored edge instead of a text chip, so the longer
        // pillar names never clip on a small thumbnail. Screen readers still
        // get the label.
        <span
          className={cn("absolute inset-y-0 left-0 w-1.5", PILLAR_STYLE[pillar].dot)}
          title={CHURCH.pillars.find((p) => p.key === pillar)?.label ?? pillar}
        >
          <span className="sr-only">
            {CHURCH.pillars.find((p) => p.key === pillar)?.label ?? pillar}
          </span>
        </span>
      ) : null}
    </div>
  );
}

function TypographicFallback({ title }: { title: string }) {
  const first = title.split(/[\s—-]+/)[0]?.slice(0, 10) ?? "NHC";
  return (
    <div
      className="absolute inset-0 flex items-end p-5"
      style={{
        background:
          "radial-gradient(60% 50% at 30% 30%, color-mix(in oklab, var(--nh-gold) 28%, transparent), transparent 60%)," +
          "radial-gradient(40% 60% at 85% 85%, color-mix(in oklab, var(--nh-blue) 40%, transparent), transparent 55%)",
      }}
    >
      <span
        className="text-cream font-display text-3xl leading-none md:text-4xl"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        {first}
      </span>
    </div>
  );
}
