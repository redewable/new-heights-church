import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { ValuesList } from "@/components/sections/ValuesList";
import { Convictions } from "@/components/sections/home/Convictions";
import { CHURCH } from "@/lib/constants/church";
import { PURPOSE } from "@/lib/constants/values";

export const metadata: Metadata = buildMetadata({
  title: "What we believe",
  description:
    "The statement of faith of New Heights Church — twenty-one values in the Church's own words, the convictions we say out loud, and the three pillars we walk them out on.",
  path: "/about/beliefs",
});

/**
 * What we believe. Four movements, all on one grid: the hero; the purpose
 * (the sentence, then You and Us in the Church's words); the twenty-one
 * values as a ledger; the convictions said out loud this season; and the
 * three pillars they get walked out on.
 */
export default function BeliefsPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "What we believe", href: "/about/beliefs" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      <PageHero
        eyebrow="Our statement of faith"
        title="What we believe."
        lead={
          <>
            Everything at New Heights roots back to the Word of God. These are the
            Church&rsquo;s own statements — the doctrinal ground of the house — followed
            by what we say out loud in this season, and the three pillars we walk it out
            on.
          </>
        }
      />

      {/* ---- Our purpose ---- */}
      <section aria-labelledby="purpose-heading" className="py-20 md:py-28">
        <Container size="lg">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
                <span aria-hidden="true" className="u-rule-gold w-12" />
                <span className="u-eyebrow">Our purpose</span>
              </div>
              <h2
                id="purpose-heading"
                className="u-display-dramatic text-ink mt-5 max-w-[14ch] text-[clamp(2.25rem,5vw,3.75rem)]"
              >
                {PURPOSE.headline}
              </h2>
            </div>
            <dl className="grid gap-8">
              <div className="border-t border-[color:var(--nh-gold)] pt-5">
                <dt className="u-eyebrow text-[color:var(--nh-gold-ink)]">You</dt>
                <dd className="u-display-soft text-ink mt-3 text-xl leading-snug md:text-2xl">
                  {PURPOSE.you}
                </dd>
              </div>
              <div className="border-t border-[color:var(--nh-gold)] pt-5">
                <dt className="u-eyebrow text-[color:var(--nh-gold-ink)]">Us</dt>
                <dd className="u-display-soft text-ink mt-3 text-xl leading-snug md:text-2xl">
                  {PURPOSE.us}
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      {/* ---- The twenty-one values ---- */}
      <ValuesList />

      {/* ---- Said out loud in this season ---- */}
      <Convictions />

      {/* ---- The pillars ---- */}
      <section aria-labelledby="pillars-close-heading" className="py-20 md:py-28">
        <Container size="lg">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-16">
            <div>
              <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
                <span aria-hidden="true" className="u-rule-gold w-12" />
                <span className="u-eyebrow">The pillars</span>
              </div>
              <h2
                id="pillars-close-heading"
                className="u-display-dramatic text-ink mt-5 max-w-[16ch] text-[clamp(2rem,4.5vw,3.25rem)]"
              >
                Where it all gets walked out.
              </h2>
              <p className="text-stone mt-5 max-w-[52ch] text-lg leading-relaxed md:text-xl">
                The values above get embodied in the three things this house is about
                right now. See{" "}
                <Link
                  href="/grow"
                  className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
                >
                  the path
                </Link>{" "}
                for how we walk them out, one Sunday at a time.
              </p>
              <p className="text-fog mt-8 text-sm">
                For a printed copy of the statement of faith — for elders, group leaders,
                or anyone vetting our doctrine before visiting — contact{" "}
                <a
                  href={CHURCH.contact.emailHref}
                  className="text-stone font-semibold underline-offset-4 hover:underline"
                >
                  {CHURCH.contact.email}
                </a>
                .
              </p>
            </div>
            <ol className="bg-paper divide-y divide-[color:var(--nh-border)] rounded-[var(--radius-lg)] border border-[color:var(--nh-border)]">
              {CHURCH.pillars.map((p, i) => (
                <li key={p.key} className="flex items-center gap-4 px-5 py-4">
                  <AscendingBars
                    highlight={p.key}
                    className="text-ink h-9 w-auto shrink-0"
                    aria-label=""
                  />
                  <div className="min-w-0">
                    <p className="u-eyebrow text-fog">Pillar {["I", "II", "III"][i]}</p>
                    <Link
                      href={p.href}
                      className="font-display text-ink block text-lg leading-tight underline-offset-4 hover:underline md:text-xl"
                    >
                      {p.full}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
