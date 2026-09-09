import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PlatformIcon, type Platform } from "@/components/brand/PlatformIcon";
import { PlatformPill } from "@/components/ui/PlatformPill";
import { SermonPlayer } from "@/components/sermons/SermonPlayer";
import { CHURCH } from "@/lib/constants/church";
import { MEDIA, type Photo } from "@/lib/constants/media";
import { PODCASTS, type PodcastShow } from "@/lib/constants/podcasts";
import { getLatestUpload, type LatestUpload } from "@/lib/youtube/latest";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = buildMetadata({
  title: "Podcasts",
  description:
    "The Brian Hallam Podcast — Apostle Brian Hallam's conversations on what God is doing, on Apple Podcasts, Spotify, YouTube, and RSS.",
  path: "/podcasts",
});

export default async function PodcastsPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Podcasts", href: "/podcasts" },
  ]);

  const series = PODCASTS.map((p) => ({
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: p.title,
    description: p.blurb,
    author: { "@type": "Person", name: p.hostedBy },
    publisher: { "@type": "Organization", name: CHURCH.name, url: CHURCH.urls.site },
    webFeed: p.rssUrl ?? undefined,
    url: `${CHURCH.urls.site}/podcasts#${p.slug}`,
  }));

  // Newest upload per show, from each channel's public feed. Null on failure;
  // the block falls back to the show's art.
  const latest = await Promise.all(
    PODCASTS.map((p) =>
      p.youtubeChannelId ? getLatestUpload(p.youtubeChannelId) : Promise.resolve(null),
    ),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      {series.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(s) }}
        />
      ))}

      <PageHero
        eyebrow="Listen any time"
        title="Podcasts."
        lead="The longer-form conversations with Apostle Brian Hallam — on the platforms you already use."
        leadShort="Apostle Brian Hallam, on the platforms you already use."
        photo={MEDIA.podcast}
        photoPosition="70% 24%"
        size="lg"
      />

      <section className="py-10 md:py-14">
        <Container size="xl">
          <div className="divide-y divide-[color:var(--nh-border)]">
            {PODCASTS.map((p, i) => (
              <ShowBlock key={p.slug} show={p} latest={latest[i] ?? null} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

interface PlatformLink {
  platform: Platform;
  label: string;
  href: string | null;
}

function ShowBlock({ show, latest }: { show: PodcastShow; latest: LatestUpload | null }) {
  const platforms: PlatformLink[] = [
    { platform: "apple", label: "Apple Podcasts", href: show.appleUrl },
    { platform: "spotify", label: "Spotify", href: show.spotifyUrl },
    { platform: "youtube", label: "YouTube", href: show.youtubeUrl },
    { platform: "rss", label: "RSS feed", href: show.rssUrl },
  ];
  const live = platforms.filter((p): p is PlatformLink & { href: string } =>
    Boolean(p.href),
  );
  const pending = platforms.filter((p) => !p.href).map((p) => p.label);

  return (
    <article
      id={show.slug}
      className="grid scroll-mt-24 gap-10 py-14 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:py-20"
    >
      <div className="min-w-0">
        <p className="u-eyebrow text-fog">Hosted by {show.hostedBy}</p>
        <h2 className="u-display-dramatic text-ink mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-tight">
          {show.title}
        </h2>
        <p className="u-display-soft text-stone mt-4 text-lg md:text-xl">
          {show.tagline}
        </p>
        <p className="text-ink mt-6 hidden text-lg leading-relaxed md:block">
          {show.blurb}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {live.map((p) => (
            <PlatformPill
              key={p.platform}
              platform={p.platform}
              label={p.label}
              href={p.href}
            />
          ))}
        </div>
        {pending.length > 0 ? (
          <p className="text-fog mt-4 text-sm">{joinList(pending)} coming soon.</p>
        ) : null}

        {show.follow.length > 0 ? (
          <div className="mt-8 border-t border-[color:var(--nh-border)] pt-6">
            <p className="u-eyebrow text-fog">Follow {show.followLabel ?? "the host"}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {show.follow.map((f) => (
                <PlatformPill
                  key={f.platform}
                  platform={f.platform}
                  label={f.label}
                  href={f.href}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="order-first flex flex-col gap-4 md:order-none">
        {latest ? (
          <LatestEpisode latest={latest} />
        ) : show.cover ? (
          <CoverCard show={show} cover={show.cover} />
        ) : (
          <div className="motif-altar-glow rounded-[var(--radius-lg)] border border-dashed border-[color:var(--nh-border)] bg-[color:var(--nh-bone)] p-8 text-center md:p-10">
            <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Latest episode</p>
            <p className="text-ink u-display-soft mt-4 text-xl leading-snug">
              The latest episode lands here once the show is on YouTube.
            </p>
          </div>
        )}

        <p className="text-fog text-xs">
          Subscribe on whichever app you already use — the feed stays the same.
        </p>
      </aside>
    </article>
  );
}

/** Newest upload from the show's channel: date, click-to-load player, title. */
function LatestEpisode({ latest }: { latest: LatestUpload }) {
  const watchUrl = `https://www.youtube.com/watch?v=${latest.videoId}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Latest on YouTube</p>
        <p className="text-fog text-sm whitespace-nowrap">
          {formatDate(latest.publishedAt.slice(0, 10))}
        </p>
      </div>
      <div className="mt-4">
        <SermonPlayer
          videoId={latest.videoId}
          posterUrl={null}
          title={latest.title}
          kind="episode"
        />
      </div>
      <h3 className="u-display-soft text-ink mt-4 text-lg leading-snug md:text-xl">
        {latest.title}
      </h3>
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink mt-2 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
      >
        <PlatformIcon platform="youtube" size={16} />
        Open on YouTube
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

/** Fallback when the channel feed can't be reached: the show's art, linked to YouTube. */
function CoverCard({ show, cover }: { show: PodcastShow; cover: Photo }) {
  const frame =
    "group bg-ink block overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--nh-border)]";
  const body = (
    <>
      <div className="aspect-video overflow-hidden">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          sizes="(min-width: 768px) 52vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="bg-paper flex items-center justify-between gap-4 border-t border-[color:var(--nh-border)] px-5 py-3.5">
        <span className="u-eyebrow text-[color:var(--nh-gold-ink)]">Latest episodes</span>
        {show.youtubeUrl ? (
          <span className="text-ink text-sm font-semibold whitespace-nowrap">
            Watch on YouTube <span aria-hidden="true">↗</span>
          </span>
        ) : null}
      </div>
    </>
  );

  return show.youtubeUrl ? (
    <a
      href={show.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${show.title} on YouTube`}
      className={frame}
    >
      {body}
    </a>
  ) : (
    <div className={frame}>{body}</div>
  );
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
