import { CHURCH } from "@/lib/constants/church";
import type { EventRow } from "@/lib/supabase/types";

/**
 * Emit an iCalendar (RFC 5545) document for a single event. Pasted into
 * Apple Calendar, Google Calendar, Outlook, etc. by whatever OS the user
 * is on. We keep it one-event-per-file — multi-event .ics adds complexity
 * without meaningful benefit.
 *
 * All timestamps are emitted in UTC (`Z` suffix) so clients don't have to
 * interpret a VTIMEZONE block. Line folding at 75 chars is required by
 * the RFC; most clients tolerate its absence but some do not.
 */
export function eventToICS(event: EventRow): string {
  const dtStart = toICSDate(event.start_at);
  const dtEnd = toICSDate(event.end_at ?? addHoursISO(event.start_at, 2));
  const dtStamp = toICSDate(new Date().toISOString());
  const uid = `${event.slug}@newheightschurch.info`;

  const summary = escapeText(event.title);
  const description = escapeText(
    [
      event.subtitle,
      event.description,
      event.registration_url ? `Register: ${event.registration_url}` : null,
    ]
      .filter(Boolean)
      .join("\n\n"),
  );
  const location = escapeText(
    event.location
      ? `${event.location}${event.location === "Camp (off-site)" ? "" : ` · ${CHURCH.address.full}`}`
      : CHURCH.address.full,
  );
  const url = `${CHURCH.urls.site}/events/${event.slug}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//New Heights Church//NHC Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `URL:${url}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

/** `2026-05-10T15:00:00Z` → `20260510T150000Z`. */
function toICSDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function addHoursISO(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setUTCHours(d.getUTCHours() + hours);
  return d.toISOString();
}

/**
 * Escape iCal TEXT fields per RFC 5545 §3.3.11 — backslash first, then
 * comma / semicolon / newline.
 */
function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r?\n/g, "\\n");
}

/** Fold content lines at 75 octets. Multibyte-safe enough for our ASCII-ish content. */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let remaining = line;
  chunks.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    chunks.push(" " + remaining.slice(0, 74));
    remaining = remaining.slice(74);
  }
  return chunks.join("\r\n");
}
