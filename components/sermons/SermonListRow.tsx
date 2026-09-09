import Link from "next/link";
import type { SermonRow } from "@/lib/supabase/types";
import { formatDateShort, formatDuration, sermonTitleParts } from "@/lib/utils/format";
import { SermonPosterThumb } from "./SermonPosterThumb";

/**
 * Editorial row treatment for a sermon — poster on the left, stacked
 * metadata on the right. Used by the /sermons library grid and the
 * "next in series" rail on the detail page.
 *
 * Deliberately not a card. Hover reveals a scarlet accent on the title
 * and extends the gold hairline — subtle motion that respects
 * prefers-reduced-motion globally via globals.css.
 */
export function SermonListRow({
  sermon,
  size = "md",
  priority,
}: {
  sermon: SermonRow;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  const href = `/sermons/${sermon.slug}`;
  const date = formatDateShort(sermon.service_date);
  const duration = formatDuration(sermon.duration_seconds);
  const cls =
    size === "lg"
      ? "md:grid-cols-[0.55fr_1fr] md:gap-10"
      : size === "sm"
        ? "md:grid-cols-[0.35fr_1fr] md:gap-5"
        : "md:grid-cols-[0.42fr_1fr] md:gap-7";

  return (
    <article className={`grid gap-5 ${cls}`}>
      <Link href={href} className="group block" aria-label={sermon.title}>
        <SermonPosterThumb
          title={sermon.title}
          youtubeId={sermon.youtube_id}
          posterUrl={sermon.poster_url}
          pillar={sermon.pillar}
          priority={priority}
        />
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="u-eyebrow text-fog flex flex-wrap items-center gap-2">
          <span>{date}</span>
          {sermon.duration_seconds ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{duration}</span>
            </>
          ) : null}
          {sermon.scripture_refs.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{sermon.scripture_refs[0]}</span>
            </>
          ) : null}
        </div>

        <h3
          className={
            size === "lg"
              ? "u-display-soft text-ink mt-3 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05]"
              : "u-display-soft text-ink mt-3 text-2xl leading-tight md:text-3xl"
          }
        >
          <Link
            href={href}
            className="decoration-[color:var(--nh-gold)] decoration-2 underline-offset-[6px] hover:underline"
          >
            {sermonTitleParts(sermon.title).map((part, i) => (
              <span key={part} className={i === 0 ? "block" : "text-stone block"}>
                {part}
              </span>
            ))}
          </Link>
        </h3>

        {sermon.description ? (
          <p className="text-stone mt-3 hidden max-w-[58ch] leading-relaxed md:block">
            {sermon.description}
          </p>
        ) : null}

        <div className="text-stone mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span>
            <span className="text-fog">By </span>
            <span className="text-ink font-medium">{sermon.speaker}</span>
          </span>
          {sermon.topics.slice(0, 2).map((t) => (
            <span key={t} className="u-eyebrow text-[color:var(--nh-bronze-ink)]">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]"
          >
            <span
              aria-hidden="true"
              className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
            />
            Watch &amp; listen
          </Link>
        </div>
      </div>
    </article>
  );
}
