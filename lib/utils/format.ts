/**
 * Small formatters used across sermon/event/date UI. All return strings
 * suitable for rendering directly — they handle `null`/`undefined` inputs
 * instead of forcing every caller to guard. Locale is hard-coded to en-US
 * because the Church is in College Station, TX; add an `intl` layer here
 * if we ever internationalize.
 */

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const DATE_FMT_SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const DATE_FMT_WEEKDAY = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

/** "March 8, 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = parseDate(iso);
  return d ? DATE_FMT.format(d) : "";
}

/** "Mar 8, 2026" */
export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = parseDate(iso);
  return d ? DATE_FMT_SHORT.format(d) : "";
}

/** "Sunday, March 8" */
export function formatDateWeekday(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = parseDate(iso);
  return d ? DATE_FMT_WEEKDAY.format(d) : "";
}

/**
 * "52 min" · "1h 14m" · "— " (when unknown).
 * We show seconds only when the clip is genuinely under a minute.
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Given YYYY-MM-DD or full ISO, construct a Date anchored at noon UTC so
 * timezone nudges can't flip the day under us (a "2026-03-08" sermon should
 * always read as March 8, not March 7 for viewers east of UTC).
 */
function parseDate(iso: string): Date | null {
  if (!iso) return null;
  const short = /^\d{4}-\d{2}-\d{2}$/;
  const d = short.test(iso) ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Split a sermon title at its " · " separator so the kind ("Sunday Morning")
 * and the date ("September 6, 2026") always render on their own lines.
 * Titles without a separator come back as a single part.
 */
export function sermonTitleParts(title: string): string[] {
  const i = title.indexOf(" · ");
  return i === -1 ? [title] : [title.slice(0, i), title.slice(i + 3)];
}
