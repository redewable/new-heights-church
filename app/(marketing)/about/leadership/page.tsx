import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CHURCH, OFFICE_LABEL, leaderName } from "@/lib/constants/church";
import { BHM, BOOK } from "@/lib/constants/bhm";
import { MEDIA, type Photo } from "@/lib/constants/media";

export const metadata: Metadata = buildMetadata({
  title: "Leadership",
  description: `${CHURCH.leadership.seniorPastor} and ${CHURCH.leadership.firstLady}, and the prophets, pastors, and teachers who carry New Heights Church alongside them.`,
  path: "/about/leadership",
});

/**
 * Leadership. The office carries honor here — "worthy of double honor,
 * especially those who labor in the word and doctrine" (1 Timothy 5:17).
 * The Hallams lead; the ministry team roster is `CHURCH.leadership.team`,
 * rendered in the order the Church gave it, every name with its office.
 */
interface LeaderLink {
  label: string;
  href: string;
  external?: boolean;
}

interface LeaderCard {
  name: string;
  role: string;
  blurb: string;
  photo: Photo;
  photoPosition: string;
  links?: ReadonlyArray<LeaderLink>;
}

const LEADERS: ReadonlyArray<LeaderCard> = [
  {
    name: CHURCH.leadership.seniorPastor,
    role: "Senior Pastor · Apostolic Office",
    blurb: `${CHURCH.leadership.seniorPastor} co-founded New Heights Church in ${CHURCH.founded} with ${CHURCH.leadership.firstLady} and carries the apostolic office of the house. He preaches the Word of God every Sunday and Wednesday, leads ${BHM.name} — an apostolic teaching ministry laboring for the endtime harvest of souls — and is the author of ${BOOK.title}.`,
    photo: MEDIA.altar,
    photoPosition: "50% 15%",
    links: [
      { label: BHM.name, href: BHM.url, external: true },
      { label: `YouTube ${BHM.youtubeHandle}`, href: BHM.youtube, external: true },
      { label: BOOK.title, href: "/resources#book" },
    ],
  },
  {
    name: CHURCH.leadership.firstLady,
    role: "Senior Pastor · Co-Founder",
    blurb: `${CHURCH.leadership.firstLady} co-founded New Heights with ${CHURCH.leadership.seniorPastor} and pastors the house alongside him — carrying women's ministry, standing with the pastoral team, and shepherding the family with wisdom, warmth, and honor.`,
    photo: MEDIA.pastors,
    photoPosition: "82% 22%",
  },
];

export default function LeadershipPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Leadership", href: "/about/leadership" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      <PageHero
        eyebrow="Who carries the house"
        title="Leadership."
        photo={MEDIA.pulpit}
        photoPosition="72% 30%"
        lead={
          <>
            {CHURCH.leadership.seniorPastor} and {CHURCH.leadership.firstLady} planted
            this house in {CHURCH.founded} and lead it today. Alongside them, a team of
            prophets, pastors, and teachers keeps the altar open and the house in order.
          </>
        }
      />

      {/* ---- Double honor ---- */}
      <section className="border-b border-[color:var(--nh-border)] py-16 md:py-20">
        <Container size="md" className="text-center">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">1 Timothy 5:17</p>
          <blockquote className="u-display-soft text-ink mt-5 text-[clamp(1.5rem,3.4vw,2.5rem)] leading-snug text-balance">
            &ldquo;Let the elders that rule well be counted worthy of double honour,
            especially they who labour in the word and doctrine.&rdquo;
          </blockquote>
        </Container>
      </section>

      {/* ---- The pastors ---- */}
      <section className="py-20 md:py-28">
        <Container size="xl">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {LEADERS.map((leader) => (
              <article key={leader.name} className="flex flex-col">
                <figure className="u-frame-gold relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src={leader.photo.src}
                    alt={leader.name}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: leader.photoPosition }}
                  />
                </figure>
                <p className="u-eyebrow mt-8 text-[color:var(--nh-gold-ink)]">
                  {leader.role}
                </p>
                <h2 className="font-display text-ink mt-3 text-3xl md:text-4xl">
                  {leader.name}
                </h2>
                <p className="text-stone mt-4 text-lg leading-relaxed">{leader.blurb}</p>
                {leader.links?.length ? (
                  <ul className="mt-6 space-y-2">
                    {leader.links.map((l) => (
                      <li key={l.href}>
                        {l.external ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline"
                          >
                            <span
                              aria-hidden="true"
                              className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
                            />
                            {l.label} ↗
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline"
                          >
                            <span
                              aria-hidden="true"
                              className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
                            />
                            {l.label} →
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- The ministry team ---- */}
      <section className="bg-[color:var(--nh-bone)] py-20 md:py-24">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">The ministry team</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[18ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            Set in the house.
          </h2>
          <p className="text-stone mt-6 max-w-[60ch] text-lg leading-relaxed md:text-xl">
            The prophets, pastors, and teachers who labor in the Word of God and at the
            altar alongside {CHURCH.leadership.seniorPastor} and{" "}
            {CHURCH.leadership.firstLady}.
          </p>

          <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {CHURCH.leadership.team.map((m) => (
              <li
                key={`${m.office}-${m.name}`}
                className="border-t border-[color:var(--nh-gold)] pt-4"
              >
                <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
                  {OFFICE_LABEL[m.office]}
                </p>
                <p className="font-display text-ink mt-2 text-2xl leading-tight">
                  {leaderName(m)}
                </p>
              </li>
            ))}
          </ul>

          <p className="text-fog mt-12 text-sm italic">
            Need prayer, pastoral care, or an introduction? Submit a{" "}
            <Link
              href="/connect"
              className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
            >
              Connect Card
            </Link>{" "}
            and the team will reach out.
          </p>
        </Container>
      </section>
    </>
  );
}
