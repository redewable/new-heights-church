import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { CHURCH } from "@/lib/constants/church";
import { PODCASTS, type PodcastShow } from "@/lib/constants/podcasts";

export const metadata: Metadata = buildMetadata({
  title: "Podcasts",
  description:
    "Listen to New Heights Sermons and The Brian Hallam Podcast — available on Apple Podcasts, Spotify, and RSS.",
  path: "/podcasts",
});

export default function PodcastsPage() {
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

      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">Listen any time</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[16ch] text-[clamp(2.75rem,6.5vw,6rem)]">
            Podcasts.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            The Sunday word and the longer-form conversations — on the platforms you
            already use.
          </p>
        </Container>
      </section>

      <section className="py-10 md:py-14">
        <Container size="xl">
          <div className="divide-y divide-[color:var(--nh-border)]">
            {PODCASTS.map((p) => (
              <ShowBlock key={p.slug} show={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function ShowBlock({ show }: { show: PodcastShow }) {
  const platforms = [
    { label: "Apple Podcasts", href: show.appleUrl },
    { label: "Spotify", href: show.spotifyUrl },
    { label: "RSS feed", href: show.rssUrl },
    { label: "YouTube", href: show.youtubeUrl },
  ];
  const live = platforms.filter((p): p is { label: string; href: string } =>
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
        <p className="text-ink mt-6 text-lg leading-relaxed">{show.blurb}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {live.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink bg-paper inline-flex h-11 items-center rounded-[var(--radius-sm)] border border-[color:var(--nh-border)] px-4 text-sm font-semibold hover:border-[color:var(--nh-ink)]"
            >
              {p.label}
              <span aria-hidden="true" className="ml-2">
                ↗
              </span>
            </a>
          ))}
        </div>
        {pending.length > 0 ? (
          <p className="text-fog mt-4 text-sm">{joinList(pending)} coming soon.</p>
        ) : null}
      </div>

      <aside className="flex flex-col gap-3">
        {show.appleShowId ? (
          <div className="bg-paper overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--nh-border)]">
            <iframe
              allow="autoplay *; encrypted-media *; fullscreen *"
              height={175}
              title={`${show.title} · latest episode`}
              src={`https://embed.podcasts.apple.com/us/podcast/id${show.appleShowId}?itsct=podcast_box&itscg=30200&theme=light`}
              className="h-[175px] w-full"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            />
          </div>
        ) : (
          <div className="motif-altar-glow rounded-[var(--radius-lg)] border border-dashed border-[color:var(--nh-border)] bg-[color:var(--nh-bone)] p-8 text-center md:p-10">
            <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Latest episode</p>
            <p className="text-ink u-display-soft mt-4 text-xl leading-snug">
              The player lands here once the show is live on Apple Podcasts.
            </p>
            <p className="text-fog mt-4 text-sm">
              Until then, every episode is on the platforms above.
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

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
