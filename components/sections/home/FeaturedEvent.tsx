import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { listUpcomingEvents } from "@/lib/events/queries";
import { eventRangeShort } from "@/lib/events/format";
import { canRegister } from "@/lib/events/status";
import { CHURCH } from "@/lib/constants/church";

/**
 * The next featured conference, set like a release: poster on the right,
 * the name, dates, guest voices, and one gold decision on the left.
 * Renders nothing when there's no upcoming featured conference, so the
 * home page never shows an empty slot.
 */
export async function FeaturedEvent() {
  const upcoming = await listUpcomingEvents(8);
  const event =
    upcoming.find((e) => e.featured && e.ministry === "conferences") ??
    upcoming.find((e) => e.featured && e.poster_url);
  if (!event) return null;

  const speakers = event.speakers?.filter(Boolean) ?? [];
  const open = canRegister(event);
  const href = `/events/${event.slug}`;

  return (
    <section aria-labelledby="featured-event-heading" className="bg-bone py-20 md:py-28">
      <Container size="xl">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14 lg:gap-20">
          <div className="min-w-0">
            <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
              <span aria-hidden="true" className="u-rule-gold w-12" />
              <span className="u-eyebrow">
                {event.ministry === "conferences"
                  ? `${CHURCH.shortName} Conference`
                  : "Featured"}{" "}
                · <span className="whitespace-nowrap">{eventRangeShort(event)}</span>
              </span>
            </div>

            <h2
              id="featured-event-heading"
              className="u-display-dramatic text-ink mt-5 text-[clamp(2.75rem,7vw,6rem)]"
            >
              {event.title}.
            </h2>

            {event.subtitle ? (
              <p className="text-stone mt-5 max-w-[42ch] text-lg leading-relaxed md:text-xl">
                {event.subtitle}
              </p>
            ) : null}

            {speakers.length > 0 ? (
              <ul className="mt-7 space-y-2">
                <li className="u-eyebrow text-fog">Guest speakers</li>
                {speakers.map((s) => (
                  <li key={s} className="font-display text-ink text-xl md:text-2xl">
                    {s}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {open && event.registration_url ? (
                <Button
                  variant="gold"
                  size="lg"
                  href={event.registration_url}
                  external={event.registration_platform !== "internal"}
                >
                  Register free
                </Button>
              ) : null}
              <Button variant="secondary" size="lg" href={href}>
                Details
              </Button>
            </div>
            <p className="text-fog mt-4 text-sm">
              {event.location ?? CHURCH.address.full}
              {event.cost_label ? <> · {event.cost_label}</> : null}
            </p>
          </div>

          {event.poster_url ? (
            <Link
              href={href}
              className="group block"
              aria-label={`${event.title} details`}
            >
              <figure className="u-frame-gold relative aspect-video overflow-hidden rounded-[var(--radius-lg)] shadow-[0_40px_80px_-40px_rgba(11,27,43,0.6)] ring-1 ring-black/10 transition-transform duration-300 group-hover:-translate-y-1">
                <Image
                  src={event.poster_url}
                  alt={`${event.title} — event artwork`}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                  priority
                />
              </figure>
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
