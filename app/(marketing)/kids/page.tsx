import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";

export const metadata: Metadata = buildMetadata({
  title: "Young Lions — Kids ministry",
  description:
    "Young Lions is the kids ministry at New Heights Church — Spirit-filled, safe, clean, and serious about raising a generation that knows God.",
  path: "/kids",
});

/**
 * Young Lions — kids ministry page. Per RFP §1 child-safe rule: zero
 * third-party trackers beyond GA4, no external embeds. The child-
 * protection statement is prominent and linked. Copy is written for
 * parents making their first visit, not for kids directly.
 */

const AGE_ROOMS = [
  {
    range: "Nursery",
    label: "0–2 yrs",
    body: "Safe, quiet space with trained volunteers. Bring your diaper bag; we'll page you during service if needed.",
  },
  {
    range: "Preschool",
    label: "3–5 yrs",
    body: "Bible story, worship, and age-right play. Kids learn who Jesus is in a room they want to come back to.",
  },
  {
    range: "Elementary",
    label: "K–5",
    body: "Interactive teaching, small-group prayer, and real-for-them worship. We pray expectantly with every kid every week.",
  },
] as const;

const SAFETY = [
  {
    t: "Background checks on every volunteer",
    b: "No exceptions. Every Young Lions volunteer is screened before they ever touch a room.",
  },
  {
    t: "Secure check-in + tag matching",
    b: "When you check in, you get a tag; your child gets a tag. Only the person holding the matching tag can pick them up.",
  },
  {
    t: "Two-adult rule",
    b: "No child is ever alone with a single volunteer. Ever. Rooms always run with two or more.",
  },
  {
    t: "Open-door + visible sightlines",
    b: "Doors stay open when possible; windows stay clear. Parents can watch their own child anytime.",
  },
] as const;

export default function KidsPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Young Lions", href: "/kids" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      {/* ---- Hero ---- */}
      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">Kids ministry</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.75rem,7vw,6.5rem)]">
            Young Lions.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            We are not running a babysitting service while the parents get fed. Young
            Lions has its own worship, its own teaching, its own altar. We take the next
            generation seriously — because Jesus did.
          </p>
          <p className="text-cream/60 mt-4 max-w-[44ch] text-sm">
            &ldquo;Let the little children come to me, and do not hinder them, for to such
            belongs the kingdom of heaven.&rdquo; — Matthew 19:14
          </p>
        </Container>
      </section>

      {/* ---- Age-room grid ---- */}
      <section className="py-20 md:py-28">
        <Container size="xl">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">By age</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            Three rooms, one mission.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            {AGE_ROOMS.map((r) => (
              <article
                key={r.range}
                className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 md:p-8"
              >
                <p className="u-eyebrow text-fog">{r.label}</p>
                <h3 className="font-display text-ink mt-3 text-2xl md:text-3xl">
                  {r.range}
                </h3>
                <p className="text-stone mt-4 leading-relaxed">{r.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- Check-in instructions ---- */}
      <section className="bg-[color:var(--nh-bone)] py-20 md:py-24">
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
            On your first Sunday
          </p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            Walk in at 9:30.
          </h2>
          <ol className="text-ink mt-10 space-y-6 text-lg md:text-xl">
            <li className="flex gap-5">
              <span
                className="u-numeral shrink-0 text-[color:var(--nh-gold)] opacity-60"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 0.8 }}
              >
                I
              </span>
              <p>
                Find the Young Lions check-in desk in the main lobby. Greeter will walk
                you over.
              </p>
            </li>
            <li className="flex gap-5">
              <span
                className="u-numeral shrink-0 text-[color:var(--nh-gold)] opacity-60"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 0.8 }}
              >
                II
              </span>
              <p>
                Your child gets a tag; you get a matching tag. Only the matching tag picks
                them up.
              </p>
            </li>
            <li className="flex gap-5">
              <span
                className="u-numeral shrink-0 text-[color:var(--nh-gold)] opacity-60"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 0.8 }}
              >
                III
              </span>
              <p>
                Head to main service. We&rsquo;ll page you if your child needs you. Pick
                them up right after the altar.
              </p>
            </li>
          </ol>
        </Container>
      </section>

      {/* ---- Safety + child protection ---- */}
      <section aria-labelledby="safety-heading" className="py-20 md:py-28">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">Safety is sacred</span>
          </div>
          <h2
            id="safety-heading"
            className="u-display-dramatic text-ink mt-4 max-w-[22ch] text-[clamp(1.75rem,4vw,2.75rem)]"
          >
            Four non-negotiables.
          </h2>
          <p className="text-stone mt-6 max-w-[52ch] text-lg md:text-xl">
            Every policy below is in force in every room, every week. If any detail below
            ever feels off on a Sunday, tell a pastor immediately — this is the most
            important thing we do.
          </p>

          <ul className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
            {SAFETY.map((s) => (
              <li
                key={s.t}
                className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 md:p-7"
              >
                <h3 className="font-display text-ink text-xl">{s.t}</h3>
                <p className="text-stone mt-3 leading-relaxed">{s.b}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-[var(--radius-lg)] border-l-4 border-[color:var(--nh-scarlet)] bg-[color:var(--nh-scarlet-soft)]/30 p-6 md:p-7">
            <p className="u-eyebrow text-[color:var(--nh-scarlet-ink)]">
              Child protection statement
            </p>
            <p className="text-ink mt-3 leading-relaxed md:text-lg">
              New Heights Church has zero tolerance for abuse of any kind. All incidents
              are reported to appropriate civil authorities. The full child protection
              policy is available on request — read it in full at{" "}
              <Link
                href="/legal/child-protection"
                className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
              >
                /legal/child-protection
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* ---- CTA ---- */}
      <section className="bg-ink text-cream py-16 md:py-20">
        <Container size="md" className="text-center">
          <p className="u-eyebrow text-[color:var(--nh-gold)]">Coming Sunday?</p>
          <p className="u-display-soft mt-4 text-[clamp(1.5rem,3.5vw,2.5rem)] leading-snug">
            Tell a greeter you&rsquo;ve got kids — we&rsquo;ll walk you through check-in
            the first time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="gold" size="lg" href="/im-new">
              Plan your visit
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/connect"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              Ask a question
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
