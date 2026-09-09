import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CHURCH } from "@/lib/constants/church";
import { MEDIA } from "@/lib/constants/media";

/**
 * A short letter to the first-time guest from the pastors, with their
 * portrait beside it. Warm and specific, never casual: this house carries
 * honor for the office and a seat for the stranger at the same time.
 */
export function Letter() {
  return (
    <section aria-labelledby="letter-heading" className="py-24 md:py-32">
      <Container size="xl">
        <div className="grid items-start gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 lg:gap-24">
          <figure className="u-frame-gold relative mx-auto aspect-[4/5] w-full max-w-[24rem] overflow-hidden rounded-[var(--radius-lg)] md:sticky md:top-32 md:max-w-none">
            <Image
              src={MEDIA.pastors.src}
              alt={MEDIA.pastors.alt}
              fill
              sizes="(min-width: 768px) 38vw, 24rem"
              className="object-cover object-[50%_20%]"
            />
            <figcaption className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[color:var(--nh-ink)]/85 to-transparent p-5 pt-14">
              <p className="font-display text-cream text-xl leading-tight">
                {CHURCH.leadership.seniorPastor}
                <br />
                <span className="text-cream/80">and {CHURCH.leadership.firstLady}</span>
              </p>
              <p className="u-eyebrow mt-2 text-[color:var(--nh-gold)]">Senior Pastors</p>
            </figcaption>
          </figure>

          <div className="min-w-0">
            <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
              <span aria-hidden="true" className="u-rule-gold w-12" />
              <span className="u-eyebrow">From the pastors</span>
            </div>

            <h2
              id="letter-heading"
              className="u-display-dramatic text-ink mt-5 text-[clamp(2rem,4.8vw,3.5rem)]"
            >
              We save a seat for you.
            </h2>

            <p className="text-ink mt-6 text-lg leading-snug md:hidden">
              Park anywhere, walk in the front doors, and the First Touch Team will find
              you. Come as you are — you are walking into a family.
            </p>

            <div className="text-ink mt-8 hidden max-w-[58ch] space-y-6 text-lg leading-relaxed md:block md:text-xl">
              <p>
                Park anywhere in the lot and walk in through the front doors. Someone on
                the First Touch Team will find you before you find them — tell them
                it&rsquo;s your first time.
              </p>
              <p>
                Come as you are and bring your people. You are walking into a family, not
                a dress code. If you have children, Young Lions check-in opens thirty
                minutes before the hour, and every volunteer is background-checked.
              </p>
              <p>
                Plan on being with us from ten until noon or one. We don't watch the clock
                and we don't rush the Holy Spirit — stay for the altar. That is where the
                deepest work happens.
              </p>
              <p className="text-stone italic">
                Whatever you carry in, this house will pray over it. That is not a
                formality. That is who we are.
              </p>
            </div>

            <div className="mt-10">
              <p
                className="text-ink text-2xl md:text-3xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontVariationSettings: '"opsz" 144, "SOFT" 100',
                }}
              >
                — {CHURCH.leadership.seniorPastor} &amp; {CHURCH.leadership.firstLady}
              </p>
              <p className="u-eyebrow text-fog mt-2">Senior Pastors · {CHURCH.name}</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[color:var(--nh-border)] pt-8">
              <Button variant="primary" size="lg" href="/im-new">
                What to expect
              </Button>
              <Button variant="ghost" size="lg" href="/about/visit">
                Map &amp; directions
              </Button>
              <a
                href={CHURCH.contact.phoneHref}
                className="text-stone hover:text-ink text-sm underline-offset-4 hover:underline"
              >
                Or call {CHURCH.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
