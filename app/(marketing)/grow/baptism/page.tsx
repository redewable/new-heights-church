import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { FormShell } from "@/components/forms/FormShell";
import { BaptismInterestForm } from "@/components/forms/BaptismInterestForm";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";

export const metadata: Metadata = buildMetadata({
  title: "Baptism",
  description:
    "Water baptism + the baptism in the Holy Spirit at New Heights Church. Say yes, we'll match you to the next Sunday.",
  path: "/grow/baptism",
});

export default function BaptismPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Grow", href: "/grow" },
    { name: "Baptism", href: "/grow/baptism" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      {/* ---- Theology band ---- */}
      <section className="bg-cream py-20 md:py-28">
        <Container size="md">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">The Bride · Room II</span>
          </div>
          <h1 className="u-display-dramatic text-ink mt-4 max-w-[18ch] text-[clamp(2.5rem,6vw,5rem)]">
            Baptism.
          </h1>
          <p className="text-stone mt-6 max-w-[48ch] text-lg leading-relaxed md:text-xl">
            Public obedience. Romans 6 on display. You don't need perfect theology to walk
            into the water — you need a yes. We baptize regularly; the next Sunday is
            close.
          </p>

          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="u-eyebrow text-fog">Water baptism</p>
              <h2 className="u-display-soft text-ink mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
                A public yes to what's already real.
              </h2>
              <p className="text-stone mt-4 leading-relaxed md:text-lg">
                Going under the water signifies dying with Christ; coming up signifies
                rising with Him. It doesn't save you — your faith already did — but it
                declares what happened, out loud, in front of the Church.
              </p>
              <p className="text-fog mt-6 text-sm italic">
                &ldquo;We were buried with Him through baptism into death... that we
                should walk in newness of life.&rdquo; — Romans 6:4
              </p>
            </div>

            <div>
              <p className="u-eyebrow text-fog">Baptism in the Holy Spirit</p>
              <h2 className="u-display-soft text-ink mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
                The promise of the Father.
              </h2>
              <p className="text-stone mt-4 leading-relaxed md:text-lg">
                Not a class — an altar moment. This isn't something to register for; it's
                something to come hungry for. Sundays at 10 AM, Wednesdays at 7 PM. We
                stay until the last person has been prayed for.
              </p>
              <div className="mt-6">
                <Link
                  href="/watch"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline"
                >
                  <span aria-hidden="true">→</span> Watch this Sunday
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- Registration form ---- */}
      <FormShell
        as="h2"
        tone="altar"
        kicker="Water baptism"
        title={
          <>
            Say yes.
            <br />
            <span className="text-[color:var(--nh-gold-ink)]">
              We&rsquo;ll match you to the next Sunday.
            </span>
          </>
        }
        lead="Staff will reach out personally to confirm the date, walk you through the morning, and invite anyone you want to stand with you."
      >
        <BaptismInterestForm />
      </FormShell>

      {/* ---- What to expect ---- */}
      <section className="border-t border-[color:var(--nh-border)] py-20 md:py-24">
        <Container size="md">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">On the day</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            What to expect.
          </h2>
          <div className="text-ink mt-10 space-y-6 text-lg leading-relaxed md:text-xl">
            <p>
              Bring a change of clothes. We'll have towels. You won't be on a stage —
              you'll be in front of the Church. A pastor will ask you two questions and
              then we go under.
            </p>
            <p>
              Bring your people. Family, friends, the person who invited you. If they came
              to see you, we'd love to see them.
            </p>
            <p>
              No script, no performance, no pressure. The whole Sunday stops for it; the
              altar stays open after.
            </p>
          </div>
          <div className="mt-12">
            <AscendingBars
              size={28}
              className="text-[color:var(--nh-gold)]"
              aria-label=""
            />
          </div>
        </Container>
      </section>
    </>
  );
}
