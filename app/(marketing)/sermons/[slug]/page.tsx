import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { SermonPlayer } from "@/components/sermons/SermonPlayer";
import { SermonListRow } from "@/components/sermons/SermonListRow";
import { getSeriesById, getSeriesSiblings, getSermonBySlug } from "@/lib/sermons/queries";
import { CHURCH } from "@/lib/constants/church";
import { formatDate, formatDuration, sermonTitleParts } from "@/lib/utils/format";
import { youTubeThumbnailUrl } from "@/lib/youtube/url";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  if (!sermon) {
    return buildMetadata({
      title: "Sermon not found",
      description: "That sermon has moved on. Browse the full library.",
      path: `/sermons/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: sermon.title,
    description:
      sermon.description ??
      `A sermon from ${sermon.speaker} on ${formatDate(sermon.service_date)}.`,
    path: `/sermons/${sermon.slug}`,
    ogImage: sermon.poster_url
      ? undefined
      : sermon.youtube_id
        ? youTubeThumbnailUrl(sermon.youtube_id)
        : undefined,
  });
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  if (!sermon) notFound();

  const [series, siblings] = await Promise.all([
    getSeriesById(sermon.series_id),
    getSeriesSiblings(sermon.series_id, sermon.id),
  ]);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Sermons", href: "/sermons" },
    ...(series ? [{ name: series.title, href: `/sermons/series/${series.slug}` }] : []),
    { name: sermon.title, href: `/sermons/${sermon.slug}` },
  ]);

  const videoObject = sermon.youtube_id
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: sermon.title,
        description:
          sermon.description ?? `A sermon from ${sermon.speaker} at ${CHURCH.name}.`,
        thumbnailUrl: sermon.poster_url ?? youTubeThumbnailUrl(sermon.youtube_id),
        uploadDate: sermon.published_at ?? sermon.service_date,
        duration: sermon.duration_seconds
          ? isoDuration(sermon.duration_seconds)
          : undefined,
        contentUrl: `https://www.youtube.com/watch?v=${sermon.youtube_id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${sermon.youtube_id}`,
        publisher: {
          "@type": "Organization",
          name: CHURCH.name,
          logo: { "@type": "ImageObject", url: `${CHURCH.urls.site}/brand/logo.png` },
        },
        author: {
          "@type": "Person",
          name: sermon.speaker,
          jobTitle:
            sermon.speaker === CHURCH.leadership.seniorPastor
              ? "Senior Pastor"
              : undefined,
        },
        keywords: [...sermon.topics, ...sermon.scripture_refs].join(", "),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbs) }}
      />
      {videoObject ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(videoObject) }}
        />
      ) : null}

      {/* ---- Hero ---- */}
      <section className="bg-cream relative pt-14 pb-12 md:pt-20 md:pb-16">
        <Container size="xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm">
            <ol className="text-fog flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/sermons" className="hover:text-ink">
                  Sermons
                </Link>
              </li>
              {series ? (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/sermons/series/${series.slug}`}
                      className="hover:text-ink"
                    >
                      {series.title}
                    </Link>
                  </li>
                </>
              ) : null}
              <li aria-hidden="true">/</li>
              <li className="text-ink truncate" aria-current="page">
                {sermon.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div className="order-2 lg:order-1">
              {sermon.youtube_id ? (
                <SermonPlayer
                  videoId={sermon.youtube_id}
                  posterUrl={sermon.poster_url}
                  title={sermon.title}
                />
              ) : (
                <div className="bg-bone text-ink flex aspect-video flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-8 text-center">
                  <AscendingBars
                    size={28}
                    aria-label=""
                    className="text-[color:var(--nh-gold)]"
                  />
                  <p className="u-eyebrow text-fog mt-5">Video coming</p>
                  <p className="font-display mt-3 text-xl">
                    We&rsquo;re still publishing this one. The audio arrives first — check
                    back after Sunday.
                  </p>
                </div>
              )}
            </div>

            <aside className="order-1 lg:order-2">
              {series ? (
                <Link
                  href={`/sermons/series/${series.slug}`}
                  className="u-eyebrow inline-flex items-center gap-2 text-[color:var(--nh-gold-ink)] hover:underline"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-[color:var(--nh-gold)]"
                  />
                  Series · {series.title}
                </Link>
              ) : (
                <span className="u-eyebrow text-fog">Stand-alone word</span>
              )}

              <h1 className="u-display-dramatic text-ink mt-4 text-[clamp(2rem,5vw,4rem)] leading-[1.02]">
                {sermonTitleParts(sermon.title).map((part, i) => (
                  <span key={part} className={i === 0 ? "block" : "text-cream/80 block"}>
                    {part}
                  </span>
                ))}
              </h1>

              <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-[color:var(--nh-border)] pt-6 text-sm">
                <Field label="Preached" value={formatDate(sermon.service_date)} />
                <Field label="Length" value={formatDuration(sermon.duration_seconds)} />
                <Field label="By" value={sermon.speaker} />
                {sermon.pillar ? (
                  <Field label="Pillar" value={titleCase(sermon.pillar)} />
                ) : null}
              </dl>

              {sermon.scripture_refs.length > 0 ? (
                <div className="mt-7">
                  <h2 className="u-eyebrow text-fog">Scripture</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {sermon.scripture_refs.map((ref) => (
                      <li key={ref}>
                        <a
                          href={bibleLink(ref)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink hover:bg-ink hover:text-cream inline-flex items-center gap-1 rounded-full border border-[color:var(--nh-border)] bg-[color:var(--nh-paper)] px-3 py-1.5 text-sm transition-colors"
                        >
                          {ref}
                          <span aria-hidden="true" className="text-fog text-xs">
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {sermon.topics.length > 0 ? (
                <div className="mt-7">
                  <h2 className="u-eyebrow text-fog">Topics</h2>
                  <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                    {sermon.topics.map((t) => (
                      <li
                        key={t}
                        className="text-stone rounded-full bg-[color:var(--nh-bone)] px-3 py-1"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {sermon.notes_url ? (
                <div className="mt-8">
                  <Button
                    variant="secondary"
                    href={sermon.notes_url}
                    external
                    aria-label={`Download sermon notes for ${sermon.title} (opens in a new tab)`}
                  >
                    Download notes
                  </Button>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </section>

      {/* ---- Description + transcript ---- */}
      {sermon.description || sermon.transcript ? (
        <section className="py-16 md:py-24">
          <Container size="prose">
            {sermon.description ? (
              <p className="u-display-soft text-ink max-w-[34ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug">
                {sermon.description}
              </p>
            ) : null}

            {sermon.transcript ? (
              <details className="mt-10 border-t border-[color:var(--nh-border)] pt-6">
                <summary className="u-eyebrow cursor-pointer text-[color:var(--nh-gold-ink)]">
                  Read the transcript
                </summary>
                <div className="text-ink prose prose-neutral mt-6 max-w-none leading-relaxed whitespace-pre-line">
                  {sermon.transcript}
                </div>
              </details>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* ---- Next in series ---- */}
      {series && siblings.length > 0 ? (
        <section className="bg-bone py-20 md:py-28">
          <Container size="xl">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
                  Next in the series
                </p>
                <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                  {series.title}
                </h2>
              </div>
              <Link
                href={`/sermons/series/${series.slug}`}
                className="hidden text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline sm:inline-flex"
              >
                Full series →
              </Link>
            </div>
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-10">
              {siblings.slice(0, 4).map((s) => (
                <SermonListRow key={s.id} sermon={s} size="sm" />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="u-eyebrow text-fog">{label}</dt>
      <dd className="text-ink mt-1 text-base">{value}</dd>
    </div>
  );
}

function bibleLink(ref: string): string {
  // Bible.com can parse natural-language refs via its URL. Example:
  //   "John 2:1-11" -> "https://www.bible.com/bible/59/JHN.2.1-11.ESV"
  // is too specific without a book map. Use the search URL instead — it
  // redirects to the canonical passage.
  return `https://www.bible.com/search/bible?q=${encodeURIComponent(ref)}`;
}

function titleCase(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}

/**
 * Serialize seconds into an ISO 8601 duration (`PT1H23M4S`) for VideoObject
 * schema. `null` returns undefined so the caller can omit the field.
 */
function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  let out = "PT";
  if (h) out += `${h}H`;
  if (m) out += `${m}M`;
  if (s || (!h && !m)) out += `${s}S`;
  return out;
}
