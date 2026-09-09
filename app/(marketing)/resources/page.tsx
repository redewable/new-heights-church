import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { BookFeature } from "@/components/sections/BookFeature";
import { CHURCH } from "@/lib/constants/church";
import { BHM, BOOK } from "@/lib/constants/bhm";

export const metadata: Metadata = buildMetadata({
  title: "Resources",
  description: `${BOOK.title} by ${BOOK.author}, the sermon archive, and Brian Hallam Ministries — books, teaching, and partner resources from New Heights Church.`,
  path: "/resources",
});

/**
 * Resource Room. Leads with Apostle Brian's current book (with two honest
 * ways to buy — direct from the ministry, or Kindle), then the four doors
 * that orbit this house: Brian Hallam Ministries, its YouTube channel, the
 * sermon archive, and the Church's own channel. On-origin e-commerce is
 * deliberately out of scope — outbound links only.
 */

interface ResourceItem {
  title: string;
  kicker: string;
  blurb: string;
  href: string;
  external?: boolean;
  tag?: string;
}

const DOORS: ReadonlyArray<ResourceItem> = [
  {
    title: BHM.name,
    kicker: "Teaching · itinerary · books",
    blurb: BHM.blurb,
    href: BHM.url,
    external: true,
    tag: "brianhallam.com",
  },
  {
    title: `YouTube · ${BHM.youtubeHandle}`,
    kicker: "Brian Hallam Ministries channel",
    blurb:
      "Teaching drops, conference sessions, and the podcast on video — Apostle Brian beyond the Sunday pulpit.",
    href: BHM.youtube,
    external: true,
    tag: "youtube.com",
  },
  {
    title: "New Heights Sermon Archive",
    kicker: "Every word preached",
    blurb:
      "The full library of New Heights sermons, filterable by series, scripture, speaker, and the three pillars. Audio, video, and notes where available.",
    href: "/sermons",
    tag: "On this site",
  },
  {
    title: `YouTube · ${CHURCH.urls.youtubeHandle}`,
    kicker: "Livestream + video archive",
    blurb:
      "Sunday and Wednesday livestreams and the complete video archive. Subscribe for notifications when we go live.",
    href: CHURCH.urls.youtube,
    external: true,
    tag: "youtube.com",
  },
];

export default function ResourcesPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Resources", href: "/resources" },
  ]);

  const bookLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: BOOK.title,
    author: { "@type": "Person", name: "Brian Hallam", url: BHM.url },
    description: BOOK.summary,
    image: BOOK.cover.src,
    url: `${CHURCH.urls.site}/resources#book`,
    offers: [
      {
        "@type": "Offer",
        url: BOOK.buy.direct,
        seller: { "@type": "Organization", name: BHM.name },
      },
      {
        "@type": "Offer",
        url: BOOK.buy.amazon,
        seller: { "@type": "Organization", name: "Amazon" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bookLd) }}
      />

      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">Resource room</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.75rem,6.5vw,6rem)]">
            Resources.
          </h1>
          <p className="text-cream/85 mt-6 hidden max-w-[44ch] text-lg leading-relaxed md:block md:text-xl">
            Books, teaching, and the partner brands that orbit this house. Everything here
            is vetted by leadership — no random affiliate links, no &ldquo;recommended for
            you.&rdquo;
          </p>
          <p className="text-cream/85 mt-5 max-w-[26ch] text-lg leading-snug md:hidden">
            Books, teaching, and the ministries around this house.
          </p>
        </Container>
      </section>

      {/* ---- The book ---- */}
      <BookFeature tone="cream" full id="book" />

      {/* ---- Four doors ---- */}
      <section className="py-20 md:py-28">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">Start here</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[20ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            The house + the teaching around it.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {DOORS.map((r) => (
              <ResourceCard key={r.title} item={r} />
            ))}
          </div>

          <p className="text-fog mt-12 hidden text-sm italic md:block">
            Want a specific recommendation for where you are right now? Drop a note via
            the{" "}
            <Link
              href="/connect"
              className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
            >
              Connect Card
            </Link>{" "}
            and tell us what you&rsquo;re walking through.
          </p>
        </Container>
      </section>
    </>
  );
}

function ResourceCard({ item }: { item: ResourceItem }) {
  const inner = (
    <>
      <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">{item.kicker}</p>
      <h3 className="font-display text-ink mt-3 text-2xl leading-tight">{item.title}</h3>
      <p className="text-stone mt-4 hidden flex-1 leading-relaxed md:block">
        {item.blurb}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]">
        <span
          aria-hidden="true"
          className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
        />
        {item.external ? "Open site ↗" : "Open →"}
      </span>
      {item.tag ? <p className="u-eyebrow text-fog mt-3">{item.tag}</p> : null}
    </>
  );
  const cls =
    "group bg-paper flex flex-col rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-20px_rgba(11,27,43,0.25)] md:p-7";
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={item.href} className={cls}>
      {inner}
    </Link>
  );
}
