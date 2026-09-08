import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";

const FOUNDATIONS_REGISTRATION =
  "https://experiencenewheights.churchcenter.com/registrations/events/3558344";

export const metadata: Metadata = buildMetadata({
  title: "Foundations of Faith",
  description:
    "Foundations of Faith at New Heights Church — a multi-week discipleship cohort. The whole counsel of God, laid out plainly. Prereq for serving.",
  path: "/grow/foundation-faith",
});

const WEEKS = [
  {
    num: "01",
    t: "The Word",
    b: "How we read the Bible at New Heights. Canon, interpretation, hearing the voice of God through the text.",
  },
  {
    num: "02",
    t: "The Father",
    b: "Who God is and how He relates to His people. Covenant, adoption, providence.",
  },
  {
    num: "03",
    t: "The Son",
    b: "Jesus — incarnation, cross, resurrection, ascension, and what it means that He is Lord now.",
  },
  {
    num: "04",
    t: "The Spirit",
    b: "The promise of the Father, the gifts, the fruit, the filling. Not a topic — a person.",
  },
  {
    num: "05",
    t: "The Church",
    b: "Why we gather, what we do when we do, and what it means to belong to this house.",
  },
  {
    num: "06",
    t: "The Call",
    b: "Where the path goes from here — membership, serving, mission, family.",
  },
] as const;

export default function FoundationFaithPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Grow", href: "/grow" },
    { name: "Foundations of Faith", href: "/grow/foundation-faith" },
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
            <span className="u-eyebrow">The Bride · Room V</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[16ch] text-[clamp(2.5rem,6vw,5.25rem)]">
            Foundations of Faith.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            A multi-week cohort on the whole counsel of God — what we believe, why it
            matters, and where you fit. Free, small-group format, Sunday evenings.
            Required before joining the First-Touch Team.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" href={FOUNDATIONS_REGISTRATION} external>
              Register on Church Center
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="#what"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              What we cover
            </Button>
          </div>
          <p className="text-cream/55 mt-4 text-xs">
            Opens on experiencenewheights.churchcenter.com
          </p>
        </Container>
      </section>

      <section id="what" className="py-20 md:py-28">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">Six weeks, six rooms</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[24ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            Plainly taught, honestly discussed.
          </h2>

          <ol className="mt-14 grid gap-6 md:grid-cols-2 md:gap-10">
            {WEEKS.map((w) => (
              <li
                key={w.num}
                className="bg-paper flex gap-5 rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 md:p-7"
              >
                <span
                  aria-hidden="true"
                  className="u-numeral block text-[color:var(--nh-gold)] opacity-60"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    lineHeight: 0.8,
                  }}
                >
                  {w.num}
                </span>
                <div>
                  <h3 className="font-display text-ink text-xl">{w.t}</h3>
                  <p className="text-stone mt-2 leading-relaxed">{w.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-[color:var(--nh-bone)] py-16 md:py-20">
        <Container size="md">
          <p className="u-eyebrow text-fog">On the path</p>
          <p className="text-ink font-display mt-3 text-2xl leading-snug md:text-3xl">
            <Link href="/grow/membership" className="underline-offset-4 hover:underline">
              New to New Heights
            </Link>{" "}
            →{" "}
            <span className="text-[color:var(--nh-gold-ink)]">Foundations of Faith</span>{" "}
            →{" "}
            <Link href="/grow/volunteer" className="underline-offset-4 hover:underline">
              First-Touch Team
            </Link>
          </p>
          <p className="text-stone mt-5 text-lg">
            Foundations is the second room. Finish both and you can apply to serve
            anywhere in the house.
          </p>
        </Container>
      </section>
    </>
  );
}
