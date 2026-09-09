import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { CHURCH } from "@/lib/constants/church";
import { MEDIA } from "@/lib/constants/media";

/**
 * Home hero. Apostle Brian Hallam at the pulpit fills the frame; a scrim
 * keeps the left two-thirds readable for the copy. The opening line is the
 * sermon — "Come expectant. Leave with fire." Everything below answers a
 * first-time guest's next questions in order: when, where, who leads.
 */
export function Hero() {
  const sun = CHURCH.services[0];
  const wed = CHURCH.services[1];
  return (
    <section className="bg-ink text-cream relative isolate overflow-hidden">
      <div className="u-scrim-photo absolute inset-0 -z-10">
        <Image
          src={MEDIA.pulpit.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] md:object-[70%_center]"
        />
      </div>

      <Container size="xl" className="relative py-24 md:py-32 lg:py-40">
        <div className="max-w-[42rem]">
          <div className="u-rise flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">
              College Station, Texas
              <span className="hidden sm:inline"> · House of the Lord</span>
            </span>
          </div>

          <h1 className="u-display-dramatic text-cream u-rise u-rise-2 mt-8 max-w-[16ch] text-[clamp(2.75rem,6vw,5.75rem)]">
            Come expectant.
            <br />
            <span className="text-[color:var(--nh-gold)]">Leave with fire.</span>
          </h1>

          <p className="text-cream/90 u-rise u-rise-3 mt-7 hidden max-w-[36rem] text-lg leading-relaxed md:block md:text-xl">
            A Spirit-filled, apostolic-prophetic house in the Brazos Valley. We preach the
            whole counsel of God, we make room for the altar, and we expect Him to move —
            because He still does.
          </p>
          <p className="text-cream/90 u-rise u-rise-3 mt-6 max-w-[24ch] text-lg leading-snug md:hidden">
            A Spirit-filled, apostolic-prophetic house in the Brazos Valley.
          </p>

          <div className="u-rise u-rise-4 mt-9 flex flex-wrap items-center gap-3">
            <Button variant="gold" size="lg" href="/im-new">
              Plan your visit
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/watch"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              Watch live
            </Button>
          </div>
        </div>

        <div className="mt-16 max-w-[46rem] border-t border-white/15 pt-8 md:mt-20">
          <p className="u-eyebrow text-cream/60">Gathered weekly</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-0">
            <ServiceStanding
              day={sun.dayOfWeek}
              time="10 A.M."
              line="Worship · Word · Altar"
            />
            <ServiceStanding
              day={wed.dayOfWeek}
              time="7 P.M."
              line="Prayer · Presence · Pouring-out"
              className="sm:border-l sm:border-white/15 sm:pl-10"
            />
          </div>
        </div>

        <p className="text-cream/60 mt-10 text-sm">
          Under the apostolic leadership of{" "}
          <span className="text-cream">{CHURCH.leadership.seniorPastor}</span> and{" "}
          <span className="text-cream">{CHURCH.leadership.firstLady}</span>.
        </p>
      </Container>
    </section>
  );
}

function ServiceStanding({
  day,
  time,
  line,
  className,
}: {
  day: string;
  time: string;
  line: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="u-eyebrow text-[color:var(--nh-gold)]">{day}</p>
      <p className="u-display-soft text-cream mt-2 text-[clamp(2rem,4.4vw,3.25rem)] leading-none">
        {time}
      </p>
      <p className="text-cream/75 mt-3 text-sm">{line}</p>
    </div>
  );
}
