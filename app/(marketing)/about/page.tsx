import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { CHURCH, PILLAR_STRIP } from "@/lib/constants/church";
import { BHM } from "@/lib/constants/bhm";
import { MEDIA } from "@/lib/constants/media";
import { PURPOSE } from "@/lib/constants/values";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `New Heights Church — a Spirit-filled, apostolic-prophetic house in College Station, Texas, planted in ${CHURCH.founded} under ${CHURCH.leadership.seniorPastor} and ${CHURCH.leadership.firstLady}.`,
  path: "/about",
});

const LINKS = [
  {
    title: "What we believe",
    href: "/about/beliefs",
    blurb:
      "The doctrinal backbone — the Word of God, the Father, the Son, the Spirit, the Church, and the end of the story.",
  },
  {
    title: "Our leadership",
    href: "/about/leadership",
    blurb: `${CHURCH.leadership.seniorPastor} and ${CHURCH.leadership.firstLady}, and the prophets, pastors, and teachers who carry the house alongside them.`,
  },
  {
    title: BHM.name,
    href: "/about/brian-hallam-ministries",
    blurb: `${CHURCH.leadership.seniorPastor}'s parallel ministry — the podcast, the YouTube channel, the book, and where to follow him.`,
  },
  {
    title: "Plan a visit",
    href: "/about/visit",
    blurb:
      "What a Sunday looks like, where to park, where the children go, and what to expect when you walk in.",
  },
] as const;

export default function AboutHubPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      <PageHero
        eyebrow="About the house"
        title="Who we are, plainly."
        lead={
          <>
            New Heights is a Spirit-filled, apostolic-prophetic house in College Station,
            planted in {CHURCH.founded} under the leadership of{" "}
            {CHURCH.leadership.seniorPastor} and {CHURCH.leadership.firstLady}. We preach
            the whole counsel of God, we make room for the altar, and we expect the Lord
            to move when His people gather.
          </>
        }
        leadShort={`A Spirit-filled, apostolic-prophetic house in College Station, planted ${CHURCH.founded}.`}
      />

      {/* ---- Story + mission ---- */}
      <section className="py-24 md:py-32">
        <Container size="xl">
          <div className="grid items-start gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-16 lg:gap-24">
            <div className="min-w-0">
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">The story</p>
              <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(2rem,5vw,3.5rem)]">
                Planted for this region, by this region.
              </h2>
              <p className="text-ink mt-6 text-lg leading-snug md:hidden">
                Planted in {CHURCH.founded} with a burden for souls. Worship lifts, the
                Word lands, the altar stays open — this is a move of God.
              </p>
              <div className="text-ink mt-10 max-w-[60ch] space-y-6 text-lg leading-relaxed md:text-xl">
                <p className="hidden md:block">
                  {CHURCH.leadership.seniorPastor} and {CHURCH.leadership.firstLady}{" "}
                  planted New Heights in the Brazos Valley in {CHURCH.founded} with a
                  burden for souls and an unshakable conviction that the Word of God still
                  works and the Holy Spirit still moves. From the first service until now
                  the pattern has held: worship lifts, the Word lands, the altar stays
                  open.
                </p>
                <p className="hidden md:block">
                  Today the house gathers Sundays and Wednesdays, hosts conferences and
                  worship nights, sends the Youth Army to camp, and disciples every
                  planted member through the Foundations of Faith path. In this season it
                  is about three things: {PILLAR_STRIP}. We are not a platform with an
                  audience. We are a family with an altar — and this is a move of God.
                </p>
                <p className="text-stone italic">{CHURCH.mission}</p>
              </div>
              <div className="mt-12">
                <Button variant="primary" href="/grow">
                  Walk the discipleship path →
                </Button>
              </div>
            </div>

            <figure className="u-frame-gold relative order-first mx-auto aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-[var(--radius-lg)] md:sticky md:top-32 md:order-none md:max-w-none">
              <Image
                src={MEDIA.pastors.src}
                alt={MEDIA.pastors.alt}
                fill
                sizes="(min-width: 768px) 36vw, 22rem"
                className="object-cover object-[50%_20%]"
              />
              <figcaption className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[color:var(--nh-ink)]/85 to-transparent p-5 pt-14">
                <p className="font-display text-cream text-xl leading-tight">
                  {CHURCH.leadership.seniorPastor}
                  <br />
                  <span className="text-cream/80">and {CHURCH.leadership.firstLady}</span>
                </p>
                <p className="u-eyebrow mt-2 text-[color:var(--nh-gold)]">
                  Founders · Senior Pastors · {CHURCH.founded}
                </p>
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* ---- Purpose ---- */}
      <section className="bg-cream border-y border-[color:var(--nh-border)] py-20 md:py-24">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">Our purpose</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,3.25rem)]">
            {PURPOSE.headline}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="border-t border-[color:var(--nh-gold)] pt-5">
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">You</p>
              <p className="u-display-soft text-ink mt-3 text-xl leading-snug md:text-2xl">
                {PURPOSE.you}
              </p>
            </div>
            <div className="border-t border-[color:var(--nh-gold)] pt-5">
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Us</p>
              <p className="u-display-soft text-ink mt-3 text-xl leading-snug md:text-2xl">
                {PURPOSE.us}
              </p>
            </div>
          </div>
          <Link
            href="/about/beliefs"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]"
          >
            <span
              aria-hidden="true"
              className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
            />
            All twenty-one of our values →
          </Link>
        </Container>
      </section>

      {/* ---- Sub-page grid ---- */}
      <section className="bg-[color:var(--nh-bone)] py-20 md:py-24">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">Four rooms to explore</span>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group bg-paper block rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-20px_rgba(11,27,43,0.25)] md:p-8"
              >
                <h3 className="font-display text-ink text-2xl leading-tight md:text-3xl">
                  {l.title}
                </h3>
                <p className="text-stone mt-4 hidden leading-relaxed md:block">
                  {l.blurb}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]">
                  <span
                    aria-hidden="true"
                    className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
                  />
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
