import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { BHM, BOOK } from "@/lib/constants/bhm";
import { cn } from "@/lib/utils/cn";

/**
 * Apostle Brian Hallam's book, set like a release announcement: the cover
 * on the left with a gold altar-glow behind it, the pitch on the right,
 * two ways to buy, and the door to Brian Hallam Ministries.
 *
 * Shared by the home page (`tone="ink"`, short pitch) and the Resources
 * room (`tone="cream"`, full description, `id="book"` for deep links).
 */
export function BookFeature({
  tone = "ink",
  full = false,
  id,
  headingLevel: Heading = "h2",
}: {
  tone?: "ink" | "cream";
  /** Render all three description paragraphs instead of the first two. */
  full?: boolean;
  id?: string;
  headingLevel?: "h2" | "h3";
}) {
  const ink = tone === "ink";
  const paragraphs = full ? BOOK.description : BOOK.description.slice(0, 2);
  const headingId = `${id ?? "book"}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        ink ? "u-grain-ink bg-ink text-cream" : "bg-bone text-ink",
      )}
    >
      {ink ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(50% 60% at 22% 50%, color-mix(in oklab, var(--nh-gold) 30%, transparent), transparent 70%)",
          }}
        />
      ) : null}

      <Container size="xl" className="relative">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:gap-16 lg:gap-24">
          <figure className="relative mx-auto w-full max-w-[18rem] md:max-w-[24rem]">
            <div
              aria-hidden="true"
              className="absolute -inset-8 -z-10 rounded-full opacity-70 blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--nh-gold) 45%, transparent), transparent)",
              }}
            />
            <div className="relative aspect-[2/3] overflow-hidden rounded-[var(--radius)] shadow-[0_40px_80px_-32px_rgba(0,0,0,0.65)] ring-1 ring-black/10">
              <Image
                src={BOOK.cover.src}
                alt={BOOK.cover.alt}
                fill
                sizes="(min-width: 768px) 24rem, 18rem"
                className="object-cover"
              />
            </div>
            <figcaption className="sr-only">
              {BOOK.title} by {BOOK.author}
            </figcaption>
          </figure>

          <div className="min-w-0">
            <div
              className={cn(
                "flex items-center gap-3",
                ink ? "text-[color:var(--nh-gold)]" : "text-[color:var(--nh-gold-ink)]",
              )}
            >
              <AscendingBars size={20} aria-label="" />
              <span className="u-eyebrow">
                From {BOOK.author}
                <span className="hidden sm:inline"> · {BHM.name}</span>
              </span>
            </div>

            <Heading
              id={headingId}
              className={cn(
                "u-display-dramatic mt-6 max-w-[16ch] text-[clamp(2.25rem,5vw,4.25rem)]",
                ink ? "text-cream" : "text-ink",
              )}
            >
              {BOOK.titleLead}{" "}
              <span
                className={
                  ink ? "text-[color:var(--nh-gold)]" : "text-[color:var(--nh-gold-ink)]"
                }
              >
                {BOOK.titleTail}.
              </span>
            </Heading>

            <p
              className={cn(
                "u-display-soft mt-6 max-w-[34ch] text-xl leading-snug md:text-2xl",
                ink ? "text-cream/90" : "text-ink",
              )}
            >
              {BOOK.kicker}
            </p>

            <div
              className={cn(
                "mt-7 hidden max-w-[60ch] space-y-5 text-lg leading-relaxed md:block",
                ink ? "text-cream/80" : "text-stone",
              )}
            >
              {paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <p
              className={cn(
                "mt-5 text-lg leading-snug md:hidden",
                ink ? "text-cream/80" : "text-stone",
              )}
            >
              {BOOK.summary}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button variant="gold" size="lg" href={BOOK.buy.direct} external>
                Order the book <span aria-hidden="true">↗</span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href={BOOK.buy.amazon}
                external
                className={
                  ink
                    ? "text-cream hover:bg-cream hover:text-ink border-white/40"
                    : undefined
                }
              >
                Kindle on Amazon <span aria-hidden="true">↗</span>
              </Button>
            </div>

            <p className={cn("mt-6 text-sm", ink ? "text-cream/70" : "text-stone")}>
              More from {BHM.name}:{" "}
              <a
                href={BHM.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "font-semibold underline-offset-4 hover:underline",
                  ink ? "text-cream" : "text-ink",
                )}
              >
                brianhallam.com ↗
              </a>
              <span className="text-border mx-2" aria-hidden="true">
                ·
              </span>
              <a
                href={BHM.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "font-semibold underline-offset-4 hover:underline",
                  ink ? "text-cream" : "text-ink",
                )}
              >
                YouTube {BHM.youtubeHandle} ↗
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
