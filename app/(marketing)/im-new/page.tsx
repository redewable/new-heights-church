import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/ui/FaqList";
import { ConnectCardForm } from "@/components/forms/ConnectCardForm";
import { CHURCH } from "@/lib/constants/church";
import { MEDIA } from "@/lib/constants/media";

export const metadata: Metadata = buildMetadata({
  title: "I'm new",
  description:
    "What to expect at New Heights Church. Sundays at 10 AM. Come as you are — you're walking into a family, and we save a seat for you.",
  path: "/im-new",
});

const FAQ = [
  {
    q: "How long is the service?",
    a: "Plan on being with us from 10 AM until noon or one. Worship leads in, the Word of God lands, and the altar stays open — we don't rush the Holy Spirit. We are there for if and when He shows up, and we are about getting in one accord (Acts 2:1).",
  },
  {
    q: "What do I wear?",
    a: "Come as you are. Suits, jeans, scrubs straight off a shift — it doesn't matter. You are walking into a family, not a dress code.",
  },
  {
    q: "What about my kids?",
    a: "Young Lions (nursery through 5th grade) has its own space downstairs. Check-in opens 30 minutes before every service. Every volunteer is background-checked and trained.",
  },
  {
    q: "Is there a Youth program?",
    a: "Youth Army gathers with the main service and has its own camps, worship nights, and encounter weekends. Visit /youth for what's next on the calendar.",
  },
  {
    q: "Do I have to give?",
    a: "No. The offering is an act of worship for the planted family. If you're our guest, you are our guest — nothing is expected of you.",
  },
  {
    q: "Is it safe to bring someone who's never been to church?",
    a: "Yes. Our greeters know first-time language. You won't be singled out, you won't be put on a stage, and you won't be the odd one out.",
  },
  {
    q: "What if the altar makes me uncomfortable?",
    a: "That's okay. You can sit. You can stand. You can come forward. We don't perform and we don't pressure — the altar is a response, not a requirement.",
  },
  {
    q: "How do I get prayer, pastoral care, or a next step?",
    a: "Tell a First Touch Team member what you need, or fill out the Connect Card below. The house is built to respond — prayer, pastoral care, and next steps flow through the team so nothing gets lost.",
  },
] as const;

export default function ImNewPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "I'm new", href: "/im-new" },
  ]);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CHURCH.address.full,
  )}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faq) }}
      />

      <PageHero
        eyebrow="First time · Planning a visit"
        title="We save a seat for you."
        titleMaxCh={18}
        lead={
          <>
            Sundays at 10 AM and Wednesdays at 7 PM in the Brazos Valley. Doors open
            thirty minutes early. Everything below is what we&rsquo;d tell you on the
            phone — come ready, and come expectant.
          </>
        }
        leadShort="Sundays 10 AM · Wednesdays 7 PM. Doors open thirty minutes early."
        actions={
          <>
            <Button variant="gold" size="lg" href="#connect">
              Tell us you&rsquo;re coming
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href={mapHref}
              external
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              Get directions
            </Button>
          </>
        }
      />

      {/* ---- What to expect ---- */}
      <section className="py-20 md:py-28">
        <Container size="xl">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
            <div>
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">What to expect</p>
              <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                Three movements. One house.
              </h2>
            </div>
            <ol className="space-y-8">
              {[
                {
                  num: "I",
                  t: "Praise and worship",
                  b: "Worship looks like worship and praise looks like praise. We lift God up so He can come down.",
                  s: "We lift God up so He can come down.",
                },
                {
                  num: "II",
                  t: "The message",
                  b: `${CHURCH.leadership.seniorPastor} delivers a message from the Lord in alignment with His Word. Bring your Bible.`,
                  s: "A message from the Lord, in alignment with His Word. Bring your Bible.",
                },
                {
                  num: "III",
                  t: "Prayer and salvation",
                  b: "New Heights Church is a place where you can experience true hope and freedom. Anything is possible with God.",
                  s: "True hope and freedom. Anything is possible with God.",
                },
              ].map((s) => (
                <li
                  key={s.num}
                  className="grid grid-cols-[4.5rem_1fr] gap-4 md:grid-cols-[5.5rem_1fr] md:gap-6"
                >
                  <span
                    aria-hidden="true"
                    className="u-numeral block text-[color:var(--nh-gold)]"
                    style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", lineHeight: 0.8 }}
                  >
                    {s.num}
                  </span>
                  <div>
                    <h3 className="font-display text-ink text-xl md:text-2xl">{s.t}</h3>
                    <p className="text-stone mt-2 hidden leading-relaxed md:block">
                      {s.b}
                    </p>
                    <p className="text-stone mt-1 text-sm leading-snug md:hidden">
                      {s.s}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ---- The pastors ---- */}
      <section className="bg-cream border-y border-[color:var(--nh-border)] py-20 md:py-28">
        <Container size="xl">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
            <figure className="u-frame-gold relative mx-auto aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-[var(--radius-lg)] md:max-w-none">
              <Image
                src={MEDIA.pastors.src}
                alt={MEDIA.pastors.alt}
                fill
                sizes="(min-width: 768px) 40vw, 22rem"
                className="object-cover object-[50%_20%]"
              />
            </figure>
            <div className="min-w-0">
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
                Under apostolic leadership
              </p>
              <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                {CHURCH.leadership.seniorPastor} &amp; {CHURCH.leadership.firstLady}.
              </h2>
              <p className="text-stone mt-4 text-lg leading-snug md:hidden">
                Planted New Heights in {CHURCH.founded}. Honor, order, and an open altar.
              </p>
              <p className="text-stone mt-6 hidden text-lg leading-relaxed md:block">
                {CHURCH.leadership.seniorPastor} and {CHURCH.leadership.firstLady} planted
                New Heights in {CHURCH.founded} and lead it today — with honor, with
                order, and with an open altar. {CHURCH.leadership.seniorPastor} carries
                the apostolic office of the house and preaches the Word every Sunday and
                Wednesday.
              </p>
              <p className="text-stone mt-4 hidden text-lg leading-relaxed md:block">
                If you need prayer, pastoral care, or a next step, the First Touch Team
                and the Connect Card are how this house responds. Nothing gets lost.
              </p>
              <div className="mt-8">
                <Button variant="secondary" href="/about/leadership">
                  Our leadership
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- FAQ ---- */}
      <section className="py-20 md:py-28">
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Frequently asked</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            Straight answers.
          </h2>
          <FaqList items={FAQ} ratio="1fr_1.4fr" className="mt-10" />
        </Container>
      </section>

      {/* ---- Embedded Connect Card ---- */}
      <section
        id="connect"
        className="motif-altar-glow relative scroll-mt-24 py-20 md:py-28"
      >
        <Container size="prose">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
            Tell us you&rsquo;re coming
          </p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
            We&rsquo;ll look for you.
          </h2>
          <p className="text-stone mt-6 hidden text-lg md:block">
            Send a quick note. We&rsquo;ll let a greeter know your name so you&rsquo;re
            expected, not anonymous. No obligation, no marketing list — we read every
            card.
          </p>
          <p className="text-stone mt-5 text-lg leading-snug md:hidden">
            Send a quick note and a greeter will know your name.
          </p>
          <div className="mt-10">
            <ConnectCardForm />
          </div>
        </Container>
      </section>

      {/* ---- Address band ---- */}
      <section className="u-grain-ink text-cream border-t border-white/10 py-14">
        <Container size="xl" className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="u-eyebrow text-[color:var(--nh-gold)]">The campus</p>
            <p className="font-display text-cream mt-3 text-2xl leading-tight md:text-3xl">
              {CHURCH.address.street}
              <br />
              <span className="text-cream/80">
                {CHURCH.address.city}, {CHURCH.address.region} {CHURCH.address.postal}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-cream inline-flex h-11 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-5 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
            >
              Open in maps
            </Link>
            <a
              href={CHURCH.contact.phoneHref}
              className="text-cream hover:bg-cream hover:text-ink inline-flex h-11 items-center rounded-[var(--radius-sm)] border border-white/40 px-5 text-sm font-semibold"
            >
              {CHURCH.contact.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
