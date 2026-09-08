import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "Grow",
  description:
    "The discipleship path at New Heights Church — from first yes to sent. Membership, Foundations of Faith, baptism, life groups, and serving.",
  path: "/grow",
});

/**
 * The Grow hub. A narrative walk through the path — saved → baptized →
 * filled → planted → serving → sent — with entry points into each page.
 * We tell the story first; sub-pages give the details.
 */

const PATH = [
  {
    num: "I",
    step: "Saved",
    blurb:
      "A yes to Jesus. Not a transaction — a surrender. Whether it's first-time or rededication, it starts on the altar, and we stand with you when it does.",
    href: "/connect/decision",
    ctaLabel: "I said yes",
  },
  {
    num: "II",
    step: "Baptized in water",
    blurb:
      "Public obedience. Romans 6 on display. We baptize regularly — the next Sunday is close. Tell us you want in and we'll match you to the date.",
    href: "/grow/baptism",
    ctaLabel: "Register for baptism",
  },
  {
    num: "III",
    step: "Filled with the Spirit",
    blurb:
      "The promise of the Father. This isn't a class — it's an altar moment. Come Sunday hungry; stay for the pouring-out.",
    href: "/connect/decision?decisionType=holy_spirit",
    ctaLabel: "Come for the Spirit",
  },
  {
    num: "IV",
    step: "Planted — New to New Heights",
    blurb:
      "The first class on the path. A short, welcoming walk through who we are, what we preach, and what it looks like to call this house home.",
    href: "/grow/membership",
    ctaLabel: "Register for N2N",
  },
  {
    num: "V",
    step: "Formed — Foundations of Faith",
    blurb:
      "Multi-week cohort. The whole counsel of God laid out plainly. What we believe, why it matters, where you fit. Prereq before serving.",
    href: "/grow/foundation-faith",
    ctaLabel: "Register for Foundations",
  },
  {
    num: "VI",
    step: "Planted in community — Life Groups",
    blurb:
      "No one grows alone. Life Groups meet in homes across the Brazos Valley — pick one that fits your day, demographic, and heart.",
    href: "/grow/life-groups",
    ctaLabel: "Find a group",
  },
  {
    num: "VII",
    step: "Serving — First-Touch Team",
    blurb:
      "Once planted, sent back out. First-Touch Team runs hospitality, prayer, kids, youth, worship, media, and more. New to New Heights + Foundations are the prereqs.",
    href: "/grow/volunteer",
    ctaLabel: "Apply to serve",
  },
] as const;

export default function GrowHubPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Grow", href: "/grow" },
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
            <span className="u-eyebrow">Preparation · The Bride — Pillar II</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.75rem,6.5vw,6rem)]">
            Grow.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            Discipleship at New Heights isn't a feeling — it's a path. Seven rooms: saved,
            baptized, filled, planted, formed, gathered in community, sent back out. Pick
            the room in front of you.
          </p>
        </Container>
      </section>

      {/* ---- The path ---- */}
      <section className="py-20 md:py-28">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">The seven rooms</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[22ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            The whole path, one Sunday at a time.
          </h2>

          <ol className="mt-14 divide-y divide-[color:var(--nh-border)]">
            {PATH.map((step, i) => (
              <li key={step.num}>
                <Link
                  href={step.href}
                  className={cn(
                    "group grid gap-6 py-10 md:grid-cols-[0.35fr_1.65fr] md:gap-12 md:py-14",
                    "transition-colors hover:bg-[color:var(--nh-bone)]/50",
                  )}
                >
                  <div className="flex items-start gap-5">
                    <span
                      aria-hidden="true"
                      className="u-numeral block text-[color:var(--nh-gold)] opacity-60"
                      style={{
                        fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                        lineHeight: 0.8,
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <div>
                    <p className="u-eyebrow text-fog">Room {i + 1}</p>
                    <h3 className="u-display-soft text-ink mt-2 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
                      {step.step}
                    </h3>
                    <p className="text-stone mt-4 max-w-[60ch] leading-relaxed md:text-lg">
                      {step.blurb}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]">
                      <span
                        aria-hidden="true"
                        className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
                      />
                      {step.ctaLabel} →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---- Benediction ---- */}
      <section className="relative py-24 md:py-32">
        <div aria-hidden="true" className="motif-altar-glow absolute inset-0" />
        <Container size="md" className="relative text-center">
          <AscendingBars
            size={28}
            className="mx-auto text-[color:var(--nh-gold)]"
            aria-label=""
          />
          <h2 className="u-display-dramatic text-ink mt-6 text-[clamp(2rem,5vw,4rem)] text-balance">
            Saved. Baptized. Filled. Planted. Sent.
          </h2>
        </Container>
      </section>
    </>
  );
}
