import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { PlatformPill } from "@/components/ui/PlatformPill";
import { LatestEpisode } from "@/components/podcast/LatestEpisode";
import { BookFeature } from "@/components/sections/BookFeature";
import { CHURCH } from "@/lib/constants/church";
import { BHM, BOOK } from "@/lib/constants/bhm";
import { MEDIA, type Photo } from "@/lib/constants/media";
import { getLatestUpload } from "@/lib/youtube/latest";
import { getLatestEpisode } from "@/lib/podcast/feed";

const PATH = "/about/brian-hallam-ministries";

export const metadata: Metadata = buildMetadata({
  title: BHM.name,
  description: `${BHM.name} — the apostolic teaching ministry of ${CHURCH.leadership.seniorPastor}: preaching beyond the Sunday pulpit, ${BHM.podcast.title}, the YouTube channel, and ${BOOK.title}.`,
  path: PATH,
});

interface Room {
  kind: "preaching" | "podcast" | "book";
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string; external?: boolean };
  /**
   * Phones lead each room with its picture. The podcast room leads with
   * the latest episode instead — its art already fronts /podcasts, and the
   * episode is the thing worth seeing.
   */
  photo?: Photo;
  photoPosition?: string;
}

const ROOMS: ReadonlyArray<Room> = [
  {
    kind: "preaching",
    eyebrow: "Preaching & teaching",
    title: "The word, beyond the Sunday pulpit.",
    body: "Apostle Brian's itinerary, conference sessions, and teaching drops — the same apostolic word carried to other houses and other cities.",
    cta: { label: "brianhallam.com", href: BHM.url, external: true },
    photo: MEDIA.pulpit,
    photoPosition: "70% 30%",
  },
  {
    kind: "podcast",
    eyebrow: "The podcast",
    title: `${BHM.podcast.title}.`,
    body: "Longer-form conversations, teaching drops, and prophetic dialogue — on Apple Podcasts, Spotify, YouTube, and RSS.",
    cta: { label: "Every episode", href: "/podcasts#brian-hallam-podcast" },
  },
  {
    kind: "book",
    eyebrow: "The book",
    title: `${BOOK.title}.`,
    body: BOOK.summary,
    cta: { label: "Order the book", href: BOOK.buy.direct, external: true },
    photo: BOOK.cover,
    photoPosition: "50% 22%",
  },
];

/**
 * Brian Hallam Ministries — the parallel ministry around Apostle Brian
 * Hallam. One page that gathers everything the footer only hinted at: the
 * itinerary site, the podcast, the channel, the book, and his own accounts.
 */
export default async function BrianHallamMinistriesPage() {
  const [video, audio] = await Promise.all([
    getLatestUpload(BHM.youtubeChannelId),
    getLatestEpisode(BHM.podcast.rss),
  ]);

  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: BHM.name, href: PATH },
  ]);
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BHM.name,
    url: BHM.url,
    founder: { "@type": "Person", name: "Brian Hallam" },
    sameAs: [
      BHM.youtube,
      BHM.facebook,
      BHM.instagram,
      BHM.podcast.apple,
      BHM.podcast.spotify,
    ],
  };

  const pills = (
    <>
      <PlatformPill platform="apple" label="Apple Podcasts" href={BHM.podcast.apple} />
      <PlatformPill platform="spotify" label="Spotify" href={BHM.podcast.spotify} />
      <PlatformPill platform="youtube" label="YouTube" href={BHM.youtube} />
      <PlatformPill platform="rss" label="RSS feed" href={BHM.podcast.rss} />
    </>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(org) }}
      />

      <PageHero
        eyebrow={
          <>
            A parallel ministry
            <span className="hidden sm:inline"> · {CHURCH.leadership.seniorPastor}</span>
          </>
        }
        title="Brian Hallam Ministries."
        titleMaxCh={14}
        lead={BHM.blurb}
        leadShort="Preaching, the podcast, and the book — beyond Sunday morning."
        photo={MEDIA.altar}
        photoPosition="50% 18%"
        actions={
          <>
            <Button variant="gold" size="lg" href={BHM.url} external>
              brianhallam.com <span aria-hidden="true">↗</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href={BHM.youtube}
              external
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              YouTube {BHM.youtubeHandle} <span aria-hidden="true">↗</span>
            </Button>
          </>
        }
      />

      {/* ---- What the ministry carries ---- */}
      <section className="py-20 md:py-28">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">What the ministry carries</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-10">
            <h2 className="u-display-dramatic text-ink max-w-[16ch] text-[clamp(2.25rem,4.5vw,3.5rem)]">
              Fire that travels.
            </h2>
            <p className="text-stone hidden max-w-[40rem] text-lg md:block">
              {BHM.name} is the apostolic teaching ministry of{" "}
              {CHURCH.leadership.seniorPastor} — everything that orbits the pulpit of New
              Heights and carries beyond it, laboring for the endtime harvest of souls.
            </p>
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3 lg:gap-x-10">
            {ROOMS.map((room) => (
              <li
                key={room.kind}
                className="border-t border-[color:var(--nh-gold)] pt-5 md:pt-6"
              >
                {room.kind === "podcast" ? (
                  <div className="mb-5 md:hidden">
                    <LatestEpisode video={video} audio={audio} youtubeUrl={BHM.youtube} />
                    <div className="mt-4 flex flex-wrap gap-2">{pills}</div>
                  </div>
                ) : room.photo ? (
                  <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[var(--radius)] md:hidden">
                    <Image
                      src={room.photo.src}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                      style={{ objectPosition: room.photoPosition }}
                    />
                  </div>
                ) : null}
                <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
                  {room.eyebrow}
                </p>
                <h3 className="u-display-soft text-ink mt-3 text-2xl leading-snug md:text-[1.75rem]">
                  {room.title}
                </h3>
                <p className="text-stone mt-3 hidden leading-relaxed md:block md:text-lg">
                  {room.body}
                </p>
                {room.cta.external ? (
                  <a
                    href={room.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
                    />
                    {room.cta.label} ↗
                  </a>
                ) : (
                  <Link
                    href={room.cta.href}
                    className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
                    />
                    {room.cta.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- Latest from the channel (desktop; phones have it in the podcast room) ---- */}
      <section className="hidden bg-[color:var(--nh-bone)] py-20 md:block md:py-24">
        <Container size="xl">
          <div className="grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div className="min-w-0">
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
                Latest from the channel
              </p>
              <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                Fresh from Apostle Brian.
              </h2>
              <p className="text-stone mt-5 text-lg leading-relaxed">
                New teaching lands on YouTube through the week, and the podcast is on
                whichever app you already use.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">{pills}</div>
              <Link
                href="/podcasts#brian-hallam-podcast"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]"
              >
                <span
                  aria-hidden="true"
                  className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
                />
                The podcast page →
              </Link>
            </div>

            <LatestEpisode video={video} audio={audio} youtubeUrl={BHM.youtube} />
          </div>
        </Container>
      </section>

      <BookFeature tone="ink" />

      {/* ---- Follow ---- */}
      <section className="py-20 md:py-24">
        <Container size="md" className="text-center">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
            Follow Apostle Brian
          </p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            Stay close to the word.
          </h2>
          <p className="text-stone mx-auto mt-5 hidden max-w-[46ch] text-lg leading-relaxed md:block">
            Announcements, itinerary, and teaching clips — where Apostle Brian posts them.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PlatformPill platform="facebook" label="Facebook" href={BHM.facebook} />
            <PlatformPill platform="instagram" label="Instagram" href={BHM.instagram} />
            <PlatformPill platform="youtube" label="YouTube" href={BHM.youtube} />
          </div>
          <p className="text-fog mt-8 text-sm">
            Everything else lives at{" "}
            <a
              href={BHM.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink font-semibold underline-offset-4 hover:underline"
            >
              brianhallam.com ↗
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
