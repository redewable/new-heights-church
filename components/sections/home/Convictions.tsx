import { Container } from "@/components/ui/Container";
import { CHURCH } from "@/lib/constants/church";

/**
 * "We believe" — the convictions the house says out loud, each with the
 * verse that carries it, closed by the three calls it says to everyone.
 * Set as a quiet grid on bone: this is a creed, not a feature grid — no
 * cards, no icons. A gold hairline, the sentence in Fraunces, the
 * reference underneath.
 */
export function Convictions() {
  return (
    <section aria-labelledby="convictions-heading" className="bg-bone py-20 md:py-28">
      <Container size="xl">
        <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
          <span aria-hidden="true" className="u-rule-gold w-12" />
          <span className="u-eyebrow">We believe</span>
        </div>
        <h2
          id="convictions-heading"
          className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]"
        >
          Said plainly. Preached weekly.
        </h2>

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {CHURCH.convictions.map((c) => (
            <li
              key={c.key}
              className="border-t border-[color:var(--nh-gold)] pt-5 md:pt-6"
            >
              <p className="u-display-soft text-ink text-xl leading-snug md:text-2xl">
                {c.statement}
              </p>
              <p className="text-stone mt-3 text-sm leading-relaxed md:text-base">
                {c.note}
              </p>
              <p className="u-eyebrow mt-4 text-[color:var(--nh-gold-ink)]">{c.verse}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 border-t border-[color:var(--nh-border)] pt-12 md:mt-20 md:pt-14">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
            Every week, to everyone
          </p>
          <ol className="mt-6 grid gap-8 md:grid-cols-3 md:gap-10">
            {CHURCH.calls.map((c, i) => (
              <li key={c.key} className="flex items-baseline gap-4">
                <span
                  aria-hidden="true"
                  className="u-numeral text-3xl text-[color:var(--nh-gold)] md:text-4xl"
                >
                  {["I", "II", "III"][i]}
                </span>
                <div>
                  <p className="u-display-dramatic text-ink text-[clamp(1.75rem,3.2vw,2.5rem)]">
                    {c.line}
                  </p>
                  <p className="u-eyebrow text-fog mt-2">{c.verse}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
