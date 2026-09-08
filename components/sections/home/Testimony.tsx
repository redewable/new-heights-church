import { Container } from "@/components/ui/Container";

/**
 * Single featured testimony — one story at a time, set like a pullquote in
 * a serious publication. Phase 3 will wire this to the `testimonies` table
 * and rotate weekly; for Phase 1 we hold on one quote so the module teaches
 * the visual treatment the future carousel will inherit.
 *
 * Attribution uses first name + last initial only — never a full name
 * without written consent, never a photograph of a minor. See
 * docs/RUNBOOK.md § Child protection before changing this convention.
 */

const FEATURED = {
  quote:
    "I came in dragging. Two songs in, I had my hands open. By the time Pastor Brian called it, I was on the floor saying yes to Jesus with strangers praying my name. We were back Wednesday. We're planted now.",
  attribution: "Marcus T.",
  context: "Sunday · Fire of God weekend",
};

export function Testimony() {
  return (
    <section
      aria-labelledby="testimony-heading"
      className="u-grain-ink bg-ink text-cream relative overflow-hidden py-24 md:py-36"
    >
      <Container size="md" className="relative">
        <div className="flex items-center gap-4 text-[color:var(--nh-gold)]">
          <span aria-hidden="true" className="u-rule-gold w-12" />
          <span className="u-eyebrow">Fruit</span>
        </div>

        <h2 id="testimony-heading" className="sr-only">
          A testimony from the altar
        </h2>

        <figure className="mt-10">
          <span
            aria-hidden="true"
            className="font-display block text-[clamp(5rem,12vw,9rem)] leading-none text-[color:var(--nh-gold)] opacity-70"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            “
          </span>
          <blockquote className="u-display-soft -mt-10 text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2]">
            {FEATURED.quote}
          </blockquote>
          <figcaption className="mt-10 flex items-baseline gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-[color:var(--nh-gold)]" />
            <span>
              <span className="text-cream font-semibold">{FEATURED.attribution}</span>
              <span className="text-cream/60"> · {FEATURED.context}</span>
            </span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
