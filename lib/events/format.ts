import type { EventRow } from "@/lib/supabase/types";

/**
 * Event-date formatters — timezone-aware so "Sunday, May 10 · 10 AM CT"
 * reads correctly for someone viewing from New York or LA. We anchor
 * everything to America/Chicago since that's where the Church sits;
 * donors across timezones still see Central-time labels, which is what
 * the RFP voice calls for ("Sundays, 10 AM CT").
 */

const TZ = "America/Chicago";

const DOW_LONG = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "long",
  month: "long",
  day: "numeric",
});

const DOW_SHORT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "short",
});

const MON_DAY = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  day: "numeric",
});

const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});

export function eventDateLong(iso: string): string {
  return DOW_LONG.format(new Date(iso));
}

export function eventDateShort(iso: string): string {
  const d = new Date(iso);
  return `${DOW_SHORT.format(d)} ${MON_DAY.format(d)}`;
}

/**
 * Returns the weekday abbreviation and month-day separately. Used by the
 * home-page ThisSunday rail to render the two pieces with different
 * typography — splitting the string with `.split(" ", 2)` drops the
 * day-of-month, so we expose the structured form instead.
 */
export function eventDowAndDate(iso: string): { dow: string; monDay: string } {
  const d = new Date(iso);
  return { dow: DOW_SHORT.format(d), monDay: MON_DAY.format(d) };
}

/**
 * "10:00 AM CT" — the "CT" suffix is explicit because most visitors view
 * the site from elsewhere in Texas or the wider US; the Central anchor
 * matters.
 */
export function eventTime(iso: string): string {
  return `${TIME_FMT.format(new Date(iso))} CT`;
}

/**
 * Full date-and-time label — for the event detail hero. Handles single-day
 * and multi-day events.
 */
export function eventWhenLabel(event: EventRow): string {
  const start = new Date(event.start_at);
  const end = event.end_at ? new Date(event.end_at) : null;

  if (!end || sameDayInCT(start, end)) {
    return `${eventDateLong(event.start_at)} · ${eventTime(event.start_at)}`;
  }
  // Multi-day.
  return `${eventDateLong(event.start_at)} – ${eventDateLong(event.end_at!)}`;
}

function sameDayInCT(a: Date, b: Date): boolean {
  const k = (d: Date) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  return k(a) === k(b);
}

const MON_SHORT = new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short" });
const DAY_NUM = new Intl.DateTimeFormat("en-US", { timeZone: TZ, day: "numeric" });

/**
 * Compact range for eyebrows and chips — "Sept 24–27", "Sept 30 – Oct 2",
 * or "Sun, May 17" for a single day. Short enough that it never needs to
 * wrap; always render it inside a `whitespace-nowrap` span anyway.
 */
export function eventRangeShort(event: Pick<EventRow, "start_at" | "end_at">): string {
  const start = new Date(event.start_at);
  const end = event.end_at ? new Date(event.end_at) : null;
  const mon = (d: Date) => MON_SHORT.format(d).replace(/^Sep$/, "Sept");
  if (!end || sameDayInCT(start, end)) return eventDateShort(event.start_at);
  if (mon(start) === mon(end))
    return `${mon(start)} ${DAY_NUM.format(start)}–${DAY_NUM.format(end)}`;
  return `${mon(start)} ${DAY_NUM.format(start)} – ${mon(end)} ${DAY_NUM.format(end)}`;
}

/**
 * The full when-label split into non-breaking pieces: a single-day event
 * yields [date, time]; a multi-day event yields [start, end]. Render each
 * piece in its own `whitespace-nowrap` span so a date never breaks mid-way.
 */
export function eventWhenParts(event: EventRow): { parts: string[]; separator: string } {
  const start = new Date(event.start_at);
  const end = event.end_at ? new Date(event.end_at) : null;
  if (!end || sameDayInCT(start, end)) {
    return {
      parts: [eventDateLong(event.start_at), eventTime(event.start_at)],
      separator: " · ",
    };
  }
  return {
    parts: [eventDateLong(event.start_at), eventDateLong(event.end_at!)],
    separator: " – ",
  };
}

/**
 * Pieces for a calendar tile — a fixed-width block that can never wrap:
 * `{ month: "SEP", days: "24–27" }`, or `{ month: "MAY", days: "17" }`.
 * Cross-month ranges collapse to "SEP–OCT" / "30–2".
 */
export function eventTile(event: Pick<EventRow, "start_at" | "end_at">): {
  month: string;
  days: string;
} {
  const start = new Date(event.start_at);
  const end = event.end_at ? new Date(event.end_at) : null;
  const m = (d: Date) => MON_SHORT.format(d).toUpperCase();
  if (!end || sameDayInCT(start, end))
    return { month: m(start), days: DAY_NUM.format(start) };
  if (m(start) === m(end)) {
    return { month: m(start), days: `${DAY_NUM.format(start)}–${DAY_NUM.format(end)}` };
  }
  return {
    month: `${m(start)}–${m(end)}`,
    days: `${DAY_NUM.format(start)}–${DAY_NUM.format(end)}`,
  };
}
