import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CHURCH } from "@/lib/constants/church";
import { MEDIA } from "@/lib/constants/media";

/**
 * A place-anchoring block. A real address in real ink, not a map widget
 * hidden in the footer. Until the Church provides photography, the right-
 * hand slot is a framed bronze negative-space treatment — intentionally
 * minimal so we don't ship a stock map tile. Phase 4 drops a real embedded
 * campus map (OpenStreetMap or MapTiler, configured in lib/utils/map.ts).
 */
export function WhereWeGather() {
  const a = CHURCH.address;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.full)}`;
  return (
    <section aria-labelledby="where-heading" className="bg-cream py-24 md:py-32">
      <Container size="xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center md:gap-16">
          <div className="min-w-0">
            <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
              <span aria-hidden="true" className="u-rule-gold w-12" />
              <span className="u-eyebrow">Where we gather</span>
            </div>

            <h2
              id="where-heading"
              className="u-display-dramatic text-ink mt-5 text-[clamp(2rem,5vw,3.75rem)]"
            >
              {a.city}, {a.region}.
            </h2>
            <p className="text-stone mt-5 max-w-[42ch] text-lg md:text-xl">
              A real house on a real street in the Brazos Valley. Doors open thirty
              minutes before every service, and the altar is always open.
            </p>

            <address className="text-ink mt-10 space-y-1 text-lg not-italic">
              <div>{a.street}</div>
              <div>
                {a.city}, {a.region} {a.postal}
              </div>
            </address>

            <dl className="mt-8 grid grid-cols-2 gap-6 text-sm">
              {CHURCH.services.map((s) => (
                <div key={s.name} className="min-w-0">
                  <dt className="u-eyebrow text-fog">{s.dayOfWeek}</dt>
                  <dd className="font-display text-ink mt-1 text-xl">{s.time}</dd>
                </div>
              ))}
              <div className="min-w-0">
                <dt className="u-eyebrow text-fog">Phone</dt>
                <dd className="mt-1 text-base">
                  <a
                    href={CHURCH.contact.phoneHref}
                    className="text-ink underline-offset-4 hover:underline"
                  >
                    {CHURCH.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="u-eyebrow text-fog">Office</dt>
                <dd className="mt-1 text-base">
                  <a
                    href={CHURCH.contact.emailHref}
                    className="u-break-anywhere text-ink underline-offset-4 hover:underline"
                  >
                    {CHURCH.contact.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <Button
                variant="secondary"
                href={mapsHref}
                external
                aria-label="Open New Heights Church in Google Maps (new tab)"
              >
                Get directions
              </Button>
            </div>
          </div>

          <figure className="u-frame-gold relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)]">
            <Image
              src={MEDIA.campus.src}
              alt={MEDIA.campus.alt}
              fill
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover"
            />
            <figcaption className="u-eyebrow text-cream/90 absolute right-4 bottom-4 left-4 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[color:var(--nh-gold)]" />
              {a.street} · The campus
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
