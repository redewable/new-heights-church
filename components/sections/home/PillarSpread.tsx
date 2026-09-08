import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { CHURCH, type PillarKey } from "@/lib/constants/church";
import { cn } from "@/lib/utils/cn";

/**
 * The signature module. Three pillars as compact editorial rows. The mark
 * carries each row — the three bars with this pillar's bar lit in its color
 * and the other two ghosted — set flush against the copy so nothing floats.
 * Rows alternate left/right so the eye walks down the page.
 *
 * Order stays Endtime Harvest → Preparation → Habitation — the three bars
 * of the logo, left to right. A unit test enforces the order.
 */

const COLOR_TOKEN: Record<PillarKey, string> = {
  harvest: "--nh-scarlet",
  bride: "--nh-purple",
  habitation: "--nh-blue",
};

const COLOR_SOFT: Record<PillarKey, string> = {
  harvest: "--nh-scarlet-soft",
  bride: "--nh-purple-soft",
  habitation: "--nh-blue-soft",
};

const COLOR_INK: Record<PillarKey, string> = {
  harvest: "--nh-scarlet-ink",
  bride: "--nh-purple-ink",
  habitation: "--nh-blue-ink",
};

const NUMERALS = ["I", "II", "III"] as const;

export function PillarSpread() {
  return (
    <section aria-labelledby="pillars-heading" className="relative py-16 md:py-20">
      <Container size="lg">
        <header className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
          <span aria-hidden="true" className="u-rule-gold w-12" />
          <span className="u-eyebrow">What the house is about</span>
        </header>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-10">
          <h2
            id="pillars-heading"
            className="u-display-dramatic text-ink max-w-[16ch] text-[clamp(2.25rem,4.5vw,3.5rem)]"
          >
            Three things. <br className="hidden md:inline" />
            <span className="text-stone">One house. One fire.</span>
          </h2>
          <p className="text-stone max-w-[40rem] text-lg">
            In this season, New Heights is about three things — the same three you see in
            the mark on our door. Every service, every class, every altar call traces back
            to one of them.
          </p>
        </div>
      </Container>

      <div className="mt-8 md:mt-10">
        {CHURCH.pillars.map((p, i) => (
          <PillarRow
            key={p.key}
            pillar={p.key}
            numeral={NUMERALS[i]}
            label={p.label}
            full={p.full}
            verse={p.verse}
            blurb={p.blurb}
            href={p.href}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

function PillarRow({
  pillar,
  numeral,
  label,
  full,
  verse,
  blurb,
  href,
  index,
}: {
  pillar: PillarKey;
  numeral: string;
  label: string;
  full: string;
  verse: string;
  blurb: string;
  href: string;
  index: number;
}) {
  const flip = index % 2 === 1;
  const color = COLOR_TOKEN[pillar];
  const soft = COLOR_SOFT[pillar];
  const ink = COLOR_INK[pillar];

  return (
    <article
      aria-label={`Pillar ${numeral}: ${full}`}
      className="relative overflow-hidden border-t border-[color:var(--nh-border)] first:border-t-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(${flip ? "90deg" : "270deg"}, color-mix(in oklab, var(${soft}) 70%, transparent) 0%, transparent 55%)`,
        }}
      />
      <Container
        size="lg"
        className={cn(
          "relative grid items-center gap-5 py-8 md:gap-10 md:py-10",
          flip
            ? "md:grid-cols-[minmax(0,1fr)_auto] md:justify-items-end"
            : "md:grid-cols-[auto_minmax(0,1fr)]",
        )}
      >
        <div className={cn("flex items-center", flip && "md:order-2")}>
          <AscendingBars
            highlight={pillar}
            className="text-ink h-[clamp(4.5rem,8vw,7rem)] w-auto"
            aria-label=""
          />
        </div>

        <div className={cn("max-w-[58ch] min-w-0", flip && "md:order-1 md:text-right")}>
          <div
            className={cn("flex items-center gap-3", flip && "md:justify-end")}
            style={{ color: `var(${ink})` }}
          >
            <span
              aria-hidden="true"
              className="block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: `var(${color})` }}
            />
            <span className="u-eyebrow">
              Pillar {numeral} · {label}
            </span>
          </div>

          <h3
            className={cn(
              "u-display-soft text-ink mt-3 max-w-[24ch] text-[clamp(1.625rem,3vw,2.375rem)]",
              flip && "md:ml-auto",
            )}
          >
            {full}
          </h3>

          <p
            className={cn(
              "text-stone mt-3 max-w-[56ch] leading-relaxed md:text-lg",
              flip && "md:ml-auto",
            )}
          >
            {blurb}
          </p>

          <div
            className={cn(
              "mt-4 flex flex-wrap items-center gap-x-5 gap-y-2",
              flip && "md:justify-end",
            )}
          >
            <Link
              href={href}
              className={cn(
                "group inline-flex items-center gap-2 text-sm font-semibold",
                flip && "md:flex-row-reverse",
              )}
              style={{ color: `var(${ink})` }}
            >
              <span
                aria-hidden="true"
                className="block h-px w-8 transition-all group-hover:w-12"
                style={{ background: `var(${color})` }}
              />
              Walk this out
              <span aria-hidden="true">{flip ? "←" : "→"}</span>
            </Link>
            <span className="u-eyebrow text-fog">{verse}</span>
          </div>
        </div>
      </Container>
    </article>
  );
}
