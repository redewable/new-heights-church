import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MEDIA } from "@/lib/constants/media";

/**
 * Why this house exists, said without hedging. Apostle Hallam at the altar
 * on the right; on the left, the lines the Church lives by: the pursuit of
 * God above all else, pressing toward the mark, and the oil that keeps a
 * fire burning. Matthew 25, Philippians 3, Revelation 3.
 */
export function MoveOfGod() {
  return (
    <section
      aria-labelledby="move-heading"
      className="u-grain-ink text-cream relative overflow-hidden py-24 md:py-32"
    >
      <Container size="xl">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-16 lg:gap-24">
          <div className="min-w-0">
            <div className="flex items-center gap-4 text-[color:var(--nh-gold)]">
              <span aria-hidden="true" className="u-rule-gold w-12" />
              <span className="u-eyebrow">Why we do this</span>
            </div>

            <h2
              id="move-heading"
              className="u-display-dramatic text-cream mt-5 max-w-[14ch] text-[clamp(2.5rem,6vw,5rem)]"
            >
              This is a move of God.
            </h2>

            <div className="text-cream/85 mt-8 max-w-[54ch] space-y-5 text-lg leading-relaxed md:text-xl">
              <p>
                The pursuit of God above all else. We don&rsquo;t take this lightly —
                being a Christian is not a Sunday habit or a prayer from long ago. It is
                staying on fire for God, and to stay on fire, you must have oil.
              </p>
              <p className="u-display-soft text-2xl leading-snug text-[color:var(--nh-gold)] md:text-3xl">
                The oil comes at a cost.
              </p>
              <p>
                Consecration. The Word of God. Prayer. The altar. That is the cost, and
                this house pays it gladly — because the Lord is not visiting here. He is
                dwelling here.
              </p>
              <p>
                You are either pressing toward the mark or drifting toward the world.
                Either hot or cold — the lukewarm get spit out. So we press.
              </p>
            </div>

            <p className="u-eyebrow mt-8 text-[color:var(--nh-gold)]">
              Matthew 6:33 · Philippians 3:14 · Revelation 3:15–16 · Matthew 25:1–13
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button variant="gold" size="lg" href="/grow">
                Walk the path
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/watch"
                className="text-cream hover:bg-cream hover:text-ink border-white/40"
              >
                Watch a service
              </Button>
            </div>
          </div>

          <figure className="u-frame-gold relative mx-auto aspect-[2/3] w-full max-w-[22rem] overflow-hidden rounded-[var(--radius-lg)] md:max-w-none">
            <Image
              src={MEDIA.altar.src}
              alt={MEDIA.altar.alt}
              fill
              sizes="(min-width: 768px) 38vw, 22rem"
              className="object-cover"
            />
            <figcaption className="u-eyebrow text-cream/80 absolute right-4 bottom-4 left-4 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[color:var(--nh-gold)]" />
              The altar · New Heights
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
