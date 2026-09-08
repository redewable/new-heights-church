import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { pushpayHref } from "@/lib/constants/giving";

/**
 * The giving anchor. Deliberately quieter than a ribbon: centered, narrow,
 * verse-anchored, altar-glow motif doing real work in the background.
 *
 * We do not process payments on this origin (PCI-DSS per RFP §1). The
 * primary CTA deep-links to Pushpay with UTM params; the `Give` link goes
 * to the full /give page for donors who want crypto, stock, or mail.
 */
export function Altar() {
  const giveHref = pushpayHref("home");

  return (
    <section aria-labelledby="altar-heading" className="relative py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, color-mix(in oklab, var(--nh-gold) 22%, transparent), transparent 70%)",
        }}
      />

      <Container size="md" className="relative text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--nh-gold)] px-4 py-1.5 text-[color:var(--nh-gold-ink)]">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[color:var(--nh-gold)]"
          />
          <span className="u-eyebrow">The altar</span>
        </div>

        <h2
          id="altar-heading"
          className="u-display-dramatic text-ink mt-7 text-[clamp(2.25rem,5.5vw,4.25rem)] text-balance"
        >
          Give as the altar <br className="hidden md:inline" />
          has loved you.
        </h2>

        <p className="text-stone mx-auto mt-7 max-w-[46ch] text-lg leading-relaxed md:text-xl">
          Every seat filled, every soul saved, every building raised — generosity is the
          soil. We never touch your card. Five honest paths to give; pick the one that
          fits.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="gold"
            size="lg"
            href={giveHref}
            external
            aria-label="Give to New Heights Church via Pushpay (opens in a new tab)"
          >
            Give now
          </Button>
          <Button variant="ghost" size="lg" href="/give">
            All five ways
          </Button>
        </div>

        <p className="u-eyebrow text-fog mt-12">2 Corinthians 9:7 · Malachi 3:10</p>
      </Container>
    </section>
  );
}
