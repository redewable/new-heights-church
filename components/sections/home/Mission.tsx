import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { CHURCH } from "@/lib/constants/church";

/**
 * House verse band. One sentence, centered, with serif weight. The follow-
 * on is a small scripture citation — not a paragraph explaining why the
 * sentence matters. If the sentence needs defending, we wrote the wrong
 * sentence.
 */
export function Mission() {
  return (
    <section aria-labelledby="mission-heading" className="relative py-28 md:py-40">
      <div aria-hidden="true" className="motif-altar-glow absolute inset-0" />
      <Container size="md" className="relative text-center">
        <AscendingBars
          size={32}
          className="mx-auto text-[color:var(--nh-gold)]"
          aria-label=""
        />

        <p className="u-eyebrow mt-6 text-[color:var(--nh-gold-ink)]">Our house verse</p>

        <h2
          id="mission-heading"
          className="u-display-dramatic text-ink mt-5 text-[clamp(2rem,5.2vw,4.25rem)] text-balance"
        >
          {CHURCH.mission}
        </h2>

        <p className="text-fog mt-8 text-sm">
          Matthew 22:37–39 · John 13:34 · 2 Corinthians 5:20
        </p>
      </Container>
    </section>
  );
}
