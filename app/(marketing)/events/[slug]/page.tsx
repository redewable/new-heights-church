import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { getEventBySlug, listUpcomingEvents } from "@/lib/events/queries";
import {
  REGISTRATION_STATUS_LABEL,
  REGISTRATION_STATUS_NOTE,
  canRegister,
  offerAvailability,
} from "@/lib/events/status";
import { EventCard } from "@/components/events/EventCard";
import { WhenLabel } from "@/components/events/WhenLabel";
import { CHURCH } from "@/lib/constants/church";
import { cn } from "@/lib/utils/cn";
import type { EventRow } from "@/lib/supabase/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PLATFORM_CTA: Record<
  NonNullable<EventRow["registration_platform"]>,
  { label: string; waitlistLabel: string; note: string; external: boolean }
> = {
  planning_center: {
    label: "Register on Church Center",
    waitlistLabel: "Join the waitlist on Church Center",
    note: "Opens on experiencenewheights.churchcenter.com",
    external: true,
  },
  brushfire: {
    label: "Register on Brushfire",
    waitlistLabel: "Join the waitlist on Brushfire",
    note: "Opens on brushfire.com",
    external: true,
  },
  internal: {
    label: "Register here",
    waitlistLabel: "Join the waitlist",
    note: "Handled on this site",
    external: false,
  },
  external: {
    label: "Register",
    waitlistLabel: "Join the waitlist",
    note: "Opens on an external site",
    external: true,
  },
};

const MINISTRY_LABEL: Record<NonNullable<EventRow["ministry"]>, string> = {
  kids: "Young Lions",
  youth: "Youth Army",
  adults: "Adults",
  church_wide: "Church-wide",
  conferences: "Conference",
  worship_nights: "Worship night",
  discipleship: "Discipleship",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return buildMetadata({
      title: "Event not found",
      description: "That event has moved on. See what's coming up next.",
      path: `/events/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: event.title,
    description:
      event.subtitle ??
      event.description?.slice(0, 200) ??
      `${event.title} at ${CHURCH.name}.`,
    path: `/events/${event.slug}`,
    ogImage: event.poster_url ?? undefined,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const others = (await listUpcomingEvents(5)).filter((e) => e.slug !== slug).slice(0, 3);
  const speakers = event.speakers?.filter(Boolean) ?? [];
  const isConference = event.ministry === "conferences";

  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: event.title, href: `/events/${event.slug}` },
  ]);

  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? event.subtitle ?? undefined,
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isConference
      ? "https://schema.org/OfflineEventAttendanceMode"
      : "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location ?? CHURCH.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: CHURCH.address.street,
        addressLocality: CHURCH.address.city,
        addressRegion: CHURCH.address.region,
        postalCode: CHURCH.address.postal,
        addressCountry: CHURCH.address.country,
      },
    },
    organizer: {
      "@type": "Organization",
      name: CHURCH.name,
      url: CHURCH.urls.site,
    },
    performer:
      speakers.length > 0
        ? speakers.map((name) => ({ "@type": "Person", name }))
        : undefined,
    url: `${CHURCH.urls.site}/events/${event.slug}`,
    offers: event.registration_url
      ? {
          "@type": "Offer",
          url: event.registration_url,
          price: /free/i.test(event.cost_label ?? "") ? "0" : undefined,
          priceCurrency: "USD",
          availability: offerAvailability(event.registration_status),
        }
      : undefined,
  };

  const platform = event.registration_platform;
  const cta = platform ? PLATFORM_CTA[platform] : null;
  const open = canRegister(event);
  const statusLabel = REGISTRATION_STATUS_LABEL[event.registration_status];
  const statusNote = REGISTRATION_STATUS_NOTE[event.registration_status];
  const ctaLabel = cta
    ? event.registration_status === "waitlist"
      ? cta.waitlistLabel
      : cta.label
    : null;

  // Conferences get the ink hero; everything else stays on cream.
  const heroInk = isConference;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(eventLd) }}
      />

      {/* ---- Hero ---- */}
      <section
        className={cn(
          "relative pt-12 pb-14 md:pt-16 md:pb-20",
          heroInk ? "u-grain-ink bg-ink text-cream overflow-hidden" : "bg-cream",
        )}
      >
        <Container size="xl" className="relative">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm">
            <ol
              className={cn(
                "flex items-center gap-2",
                heroInk ? "text-cream/60" : "text-fog",
              )}
            >
              <li>
                <Link
                  href="/"
                  className={heroInk ? "hover:text-cream" : "hover:text-ink"}
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/events"
                  className={heroInk ? "hover:text-cream" : "hover:text-ink"}
                >
                  Events
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                className={cn("truncate", heroInk ? "text-cream" : "text-ink")}
                aria-current="page"
              >
                {event.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <div
                className={cn(
                  "flex items-center gap-3",
                  heroInk
                    ? "text-[color:var(--nh-gold)]"
                    : "text-[color:var(--nh-gold-ink)]",
                )}
              >
                <AscendingBars size={20} aria-label="" />
                <span className="u-eyebrow">
                  {event.ministry ? MINISTRY_LABEL[event.ministry] : "Gathering"}
                  {isConference ? " · New Heights Church" : null}
                </span>
              </div>

              <h1
                className={cn(
                  "u-display-dramatic mt-5 text-[clamp(2.5rem,6vw,5.5rem)]",
                  heroInk ? "text-cream" : "text-ink",
                )}
              >
                {event.title}
              </h1>

              <p
                className={cn(
                  "mt-6 text-lg md:text-xl",
                  heroInk ? "text-cream/85" : "text-stone",
                )}
              >
                <WhenLabel event={event} />
                {event.location ? <> · {event.location}</> : null}
              </p>

              {event.subtitle ? (
                <p
                  className={cn(
                    "u-display-soft mt-6 max-w-[40ch] text-xl leading-snug md:text-2xl",
                    heroInk ? "text-cream" : "text-ink",
                  )}
                >
                  {event.subtitle}
                </p>
              ) : null}

              {event.description ? (
                <p
                  className={cn(
                    "mt-6 max-w-[60ch] text-lg leading-relaxed md:text-xl",
                    heroInk ? "text-cream/85" : "text-ink",
                  )}
                >
                  {event.description}
                </p>
              ) : null}

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {event.registration_url && cta && open ? (
                  <Button
                    variant="gold"
                    size="lg"
                    href={event.registration_url}
                    external={cta.external}
                  >
                    {ctaLabel}
                    {cta.external ? <span aria-hidden="true">↗</span> : null}
                  </Button>
                ) : statusLabel ? (
                  <span
                    className={cn(
                      "inline-flex h-13 items-center rounded-[var(--radius-sm)] border px-7 text-base font-semibold",
                      heroInk
                        ? "text-cream/70 border-white/25"
                        : "text-stone border-[color:var(--nh-border)]",
                    )}
                  >
                    {statusLabel}
                  </span>
                ) : null}
                <Button
                  variant="secondary"
                  size="lg"
                  href={`/events/${event.slug}/ics`}
                  external
                  download
                  className={
                    heroInk
                      ? "text-cream hover:bg-cream hover:text-ink border-white/40"
                      : undefined
                  }
                >
                  Add to calendar
                </Button>
              </div>
              {open && cta ? (
                <p className={cn("mt-4 text-xs", heroInk ? "text-cream/60" : "text-fog")}>
                  {cta.note}
                </p>
              ) : statusNote ? (
                <p
                  className={cn(
                    "mt-4 max-w-[52ch] text-sm",
                    heroInk ? "text-cream/70" : "text-stone",
                  )}
                >
                  {statusNote}
                </p>
              ) : null}
            </div>

            <aside className="space-y-5">
              {event.poster_url ? (
                <figure
                  className={cn(
                    "relative aspect-video overflow-hidden rounded-[var(--radius-lg)] ring-1",
                    heroInk ? "ring-white/10" : "ring-black/10",
                  )}
                >
                  <Image
                    src={event.poster_url}
                    alt={` — event artwork`}
                    fill
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </figure>
              ) : null}
              {speakers.length > 0 ? (
                <div
                  className={cn(
                    "rounded-[var(--radius-lg)] border p-6 md:p-7",
                    heroInk
                      ? "border-white/15 bg-white/[0.04]"
                      : "bg-paper border-[color:var(--nh-border)]",
                  )}
                >
                  <p
                    className={cn(
                      "u-eyebrow",
                      heroInk
                        ? "text-[color:var(--nh-gold)]"
                        : "text-[color:var(--nh-gold-ink)]",
                    )}
                  >
                    Guest speakers
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li
                      className={cn(
                        "font-display text-xl",
                        heroInk ? "text-cream" : "text-ink",
                      )}
                    >
                      {CHURCH.leadership.seniorPastor}
                      <span
                        className={cn(
                          "block text-sm font-normal",
                          heroInk ? "text-cream/60" : "text-fog",
                        )}
                      >
                        Host · {CHURCH.shortName}
                      </span>
                    </li>
                    {speakers.map((s) => (
                      <li
                        key={s}
                        className={cn(
                          "font-display text-xl",
                          heroInk ? "text-cream" : "text-ink",
                        )}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div
                className={cn(
                  "rounded-[var(--radius-lg)] border p-6 md:p-7",
                  heroInk
                    ? "border-white/15 bg-white/[0.04]"
                    : "bg-paper border-[color:var(--nh-border)]",
                )}
              >
                <p className={cn("u-eyebrow", heroInk ? "text-cream/60" : "text-fog")}>
                  At a glance
                </p>
                <dl className="mt-5 space-y-4 text-sm">
                  <Row ink={heroInk} label="When" value={<WhenLabel event={event} />} />
                  {event.time_note ? (
                    <Row ink={heroInk} label="Cadence" value={event.time_note} />
                  ) : null}
                  <Row
                    ink={heroInk}
                    label="Where"
                    value={event.location ?? CHURCH.address.full}
                  />
                  {event.cost_label ? (
                    <Row ink={heroInk} label="Cost" value={event.cost_label} />
                  ) : null}
                  {event.ministry ? (
                    <Row
                      ink={heroInk}
                      label="Ministry"
                      value={MINISTRY_LABEL[event.ministry]}
                    />
                  ) : null}
                </dl>
              </div>

              <div
                className={cn(
                  "rounded-[var(--radius-lg)] border p-6 md:p-7",
                  heroInk
                    ? "border-white/15 bg-white/[0.04]"
                    : "bg-paper border-[color:var(--nh-border)]",
                )}
              >
                <p className={cn("u-eyebrow", heroInk ? "text-cream/60" : "text-fog")}>
                  Campus address
                </p>
                <address
                  className={cn("mt-4 not-italic", heroInk ? "text-cream" : "text-ink")}
                >
                  {CHURCH.address.street}
                  <br />
                  {CHURCH.address.city}, {CHURCH.address.region} {CHURCH.address.postal}
                </address>
                <div className="mt-5">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CHURCH.address.full)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-sm font-semibold hover:underline",
                      heroInk
                        ? "text-[color:var(--nh-gold)]"
                        : "text-[color:var(--nh-scarlet-ink)]",
                    )}
                  >
                    Get directions →
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ---- Also upcoming ---- */}
      {others.length > 0 ? (
        <section className="bg-[color:var(--nh-bone)] py-16 md:py-24">
          <Container size="xl">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
                  Also on the calendar
                </p>
                <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                  Coming up next.
                </h2>
              </div>
              <Link
                href="/events"
                className="hidden text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline sm:inline-flex"
              >
                Full calendar →
              </Link>
            </div>
            <div className="mt-8 divide-y divide-[color:var(--nh-border)]">
              {others.map((e) => (
                <EventCard key={e.id} event={e} size="sm" />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}

function Row({
  label,
  value,
  ink,
}: {
  label: string;
  value: React.ReactNode;
  ink: boolean;
}) {
  return (
    <div>
      <dt className={cn("u-eyebrow", ink ? "text-cream/60" : "text-fog")}>{label}</dt>
      <dd className={cn("mt-1", ink ? "text-cream" : "text-ink")}>{value}</dd>
    </div>
  );
}
