import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";

const LIFE_GROUPS_FINDER_URL =
  "https://experiencenewheights.churchcenter.com/groups/life-groups?enrollment=open_signup%2Crequest_to_join&filter=enrollment";

export const metadata: Metadata = buildMetadata({
  title: "Life Groups",
  description:
    "Life Groups at New Heights Church — small communities meeting in homes across the Brazos Valley. Find one that fits your day, demographic, and heart.",
  path: "/grow/life-groups",
});

const HOW_IT_WORKS = [
  {
    num: "I",
    t: "Find one that fits",
    b: "Filter by day, demographic, location, or leader on the Church Center finder. Every group is open for signup or request-to-join.",
  },
  {
    num: "II",
    t: "Show up",
    b: "Groups meet weekly or bi-weekly in homes. Some are for couples, some for men, women, young adults, students. Food is usually involved.",
  },
  {
    num: "III",
    t: "Stay for a season",
    b: "A group is a commitment to a few people — not a ministry to consume. Stay long enough to be known.",
  },
] as const;

export default function LifeGroupsPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Grow", href: "/grow" },
    { name: "Life Groups", href: "/grow/life-groups" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">The Bride · Room VI</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)]">
            Life Groups.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            No one grows alone. Our groups meet in homes across the Brazos Valley — a
            handful of people, a Bible open, a meal, and a shared yes. Pick a group that
            fits and walk in.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" href={LIFE_GROUPS_FINDER_URL} external>
              Find a group
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="#how"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              How it works
            </Button>
          </div>
          <p className="text-cream/55 mt-4 text-xs">
            Opens on Church Center — our groups live there.
          </p>
        </Container>
      </section>

      <section id="how" className="py-20 md:py-28">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">How a group works</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[20ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            Three things to know before you walk in.
          </h2>

          <ol className="mt-14 divide-y divide-[color:var(--nh-border)]">
            {HOW_IT_WORKS.map((step) => (
              <li
                key={step.num}
                className="grid gap-6 py-10 md:grid-cols-[0.35fr_1.65fr] md:gap-12 md:py-12"
              >
                <span
                  aria-hidden="true"
                  className="u-numeral block text-[color:var(--nh-gold)] opacity-60"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 4.5rem)",
                    lineHeight: 0.8,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <h3 className="font-display text-ink text-xl md:text-2xl">{step.t}</h3>
                  <p className="text-stone mt-3 leading-relaxed md:text-lg">{step.b}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] bg-[color:var(--nh-bone)] p-6 md:p-8">
            <p className="u-eyebrow text-fog">Can't find the right one?</p>
            <p className="text-ink mt-3 text-lg">
              New groups start regularly — or we'll help you plant one. Send a note
              through the{" "}
              <a
                className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
                href="/connect"
              >
                Connect Card
              </a>{" "}
              and tell us you're looking.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
