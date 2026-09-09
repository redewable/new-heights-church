import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import type { Platform } from "@/components/brand/PlatformIcon";
import { PlatformPill } from "@/components/ui/PlatformPill";
import { LatestEpisode } from "@/components/podcast/LatestEpisode";
import { CHURCH } from "@/lib/constants/church";
import { MEDIA } from "@/lib/constants/media";
import { PODCASTS, type PodcastShow } from "@/lib/constants/podcasts";
import { getLatestUpload, type LatestUpload } from "@/lib/youtube/latest";
import { getLatestEpisode, type PodcastEpisode } from "@/lib/podcast/feed";

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

  // Newest episode per show: the channel's newest upload when YouTube's feed
  // answers, the podcast RSS (title, date, audio) when it doesn't.
  const latest = await Promise.all(
    PODCASTS.map(async (p) => {
      const [video, audio] = await Promise.all([
        p.youtubeChannelId ? getLatestUpload(p.youtubeChannelId) : null,
        p.rssUrl ? getLatestEpisode(p.rssUrl) : null,
      ]);
      return { video, audio };
    }),
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
              <ShowBlock
                key={p.slug}
                show={p}
                video={latest[i]?.video ?? null}
                audio={latest[i]?.audio ?? null}
              />
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

function ShowBlock({
  show,
  video,
  audio,
}: {
  show: PodcastShow;
  video: LatestUpload | null;
  audio: PodcastEpisode | null;
}) {
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

      {/* The episode leads on phones; the hero above already carries the art. */}
      <aside className="order-first flex flex-col gap-4 md:order-none">
        <LatestEpisode video={video} audio={audio} youtubeUrl={show.youtubeUrl} />
        <p className="text-fog text-xs">
          Subscribe on whichever app you already use — the feed stays the same.
        </p>
      </aside>
    </article>
  );
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
