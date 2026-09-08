import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { CHURCH } from "@/lib/constants/church";

/**
 * The house-closer. One sentence. Large. Quiet. This line appears in the
 * RFP §18 as an example of the tone we want — the visible version of the
 * welcome we actually give at the door.
 */
export function Benediction() {
  return (
    <section
      aria-labelledby="benediction-heading"
      className="relative overflow-hidden py-28 md:py-36"
    >
      <div aria-hidden="true" className="motif-altar-glow absolute inset-0" />
      <Container size="md" className="relative text-center">
        <AscendingBars
          size={28}
          className="mx-auto text-[color:var(--nh-gold)]"
          aria-label=""
        />
        <h2
          id="benediction-heading"
          className="u-display-dramatic text-ink mt-6 text-[clamp(2rem,5vw,4rem)] text-balance"
        >
          {CHURCH.tagline}
        </h2>
      </Container>
    </section>
  );
}
