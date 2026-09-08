import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { EventRow } from "@/lib/supabase/types";
import { eventRangeShort, eventTime } from "@/lib/events/format";
import { WhenLabel } from "@/components/events/WhenLabel";
import { REGISTRATION_STATUS_LABEL, canRegister } from "@/lib/events/status";

const MINISTRY_LABEL: Record<NonNullable<EventRow["ministry"]>, string> = {
  kids: "Young Lions",
  youth: "Youth Army",
  adults: "Adults",
  church_wide: "Church-wide",
  conferences: "Conference",
  worship_nights: "Worship Night",
  discipleship: "Discipleship",
};

const PLATFORM_LABEL: Record<NonNullable<EventRow["registration_platform"]>, string> = {
  planning_center: "Church Center",
  brushfire: "Brushfire",
  internal: "Here on the site",
  external: "Opens elsewhere",
};

/**
 * Editorial event row. Date on the left in display type, body on the
 * right. Ministry chip + registration-platform badge so visitors know
 * before clicking where the CTA lands; guest speakers and a closed /
 * waitlist state show inline so nobody clicks into a dead registration.
 */
export function EventCard({
  event,
  size = "md",
  priority,
}: {
  event: EventRow;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  const href = `/events/${event.slug}`;
  const ministry = event.ministry ? MINISTRY_LABEL[event.ministry] : null;
  const platformLabel = event.registration_platform
    ? PLATFORM_LABEL[event.registration_platform]
    : null;
  const statusLabel = REGISTRATION_STATUS_LABEL[event.registration_status];
  const open = canRegister(event);
  const speakers = event.speakers?.filter(Boolean) ?? [];

  const dateSize =
    size === "lg"
      ? "text-[clamp(2rem,4vw,3.25rem)]"
      : size === "sm"
        ? "text-2xl md:text-3xl"
        : "text-3xl md:text-4xl";

  return (
    <article className="grid gap-6 py-10 md:grid-cols-[0.35fr_1fr] md:gap-12 md:py-14">
      <div className="flex flex-col items-start">
        <span className={cn("u-display-soft text-ink block leading-none", dateSize)}>
          {eventRangeShort(event)}
        </span>
        <span className="text-fog mt-3 text-sm">
          <span className="whitespace-nowrap">
            {event.time_note ?? eventTime(event.start_at)}
          </span>
        </span>
        {event.featured ? (
          <span className="u-eyebrow text-ink mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--nh-gold)] px-3 py-1">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--nh-ink)]"
            />
            Featured
          </span>
        ) : null}
      </div>

      <div className="min-w-0">
        {event.poster_url && size !== "sm" ? (
          <figure className="relative mb-6 aspect-video max-w-2xl overflow-hidden rounded-[var(--radius-lg)] ring-1 ring-black/10">
            <Image
              src={event.poster_url}
              alt={` — event artwork`}
              fill
              sizes="(min-width: 768px) 42rem, 100vw"
              className="object-cover"
              priority={priority}
            />
          </figure>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {ministry ? (
            <span className="u-eyebrow text-[color:var(--nh-bronze-ink)]">
              {ministry}
            </span>
          ) : null}
          {event.location ? (
            <>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="text-fog text-xs">{event.location}</span>
            </>
          ) : null}
          {event.cost_label ? (
            <>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="text-fog text-xs">{event.cost_label}</span>
            </>
          ) : null}
        </div>

        <h3
          className={cn(
            "u-display-soft text-ink mt-3 leading-tight",
            size === "lg" ? "text-[clamp(1.75rem,3.2vw,2.5rem)]" : "text-2xl md:text-3xl",
          )}
        >
          <Link
            href={href}
            className="decoration-[color:var(--nh-gold)] decoration-2 underline-offset-[6px] hover:underline"
          >
            {event.title}
          </Link>
        </h3>

        {event.subtitle ? (
          <p className="text-stone mt-3 max-w-[56ch] leading-relaxed md:text-lg">
            {event.subtitle}
          </p>
        ) : null}

        {speakers.length > 0 ? (
          <p className="text-ink mt-3 text-sm">
            <span className="text-fog">With </span>
            {speakers.map((s, i) => (
              <span key={s}>
                {i > 0 ? <span className="text-border"> · </span> : null}
                <span className="font-semibold">{s}</span>
              </span>
            ))}
          </p>
        ) : null}

        <div className="text-stone mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <WhenLabel event={event} />
          {platformLabel ? (
            <>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="text-fog">{platformLabel}</span>
            </>
          ) : null}
          {statusLabel ? (
            <>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="u-eyebrow text-[color:var(--nh-scarlet-ink)]">
                {statusLabel}
              </span>
            </>
          ) : null}
        </div>

        <div className="mt-5">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]"
          >
            <span
              aria-hidden="true"
              className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
            />
            {open ? "Details & register" : "Details"}
          </Link>
        </div>
      </div>
    </article>
  );
}
