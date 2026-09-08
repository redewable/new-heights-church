/**
 * Top-of-site announcement strip. Time-boxed entries win over the evergreen
 * fallback while their window is open, so the bar switches itself at the
 * next render/revalidation without a code change on the day.
 *
 * Order matters: the first entry whose window contains `now` is shown.
 * Keep `lead` short — it's the part that renders in gold and survives on
 * a phone; `headline` is the fuller sentence for wider screens.
 */

export interface Announcement {
  id: string;
  /** Gold lead-in, e.g. the event name + dates. Always shown. */
  lead: string;
  /** Sentence after the lead. Hidden on phones. */
  headline?: string;
  ctaLabel: string;
  ctaHref: string;
  /** ISO timestamps. `null` = unbounded. */
  startsAt: string | null;
  endsAt: string | null;
}

export const ANNOUNCEMENTS: readonly Announcement[] = [
  {
    id: "activated-2026",
    lead: "Activated · Sept 24–27",
    headline:
      "New Heights Conference 2026 · Pastor Paula White, Prophet Dr. Lashund Lambert, Prophet Richard Summerlin.",
    ctaLabel: "Register free",
    ctaHref: "/events/activated-2026",
    startsAt: "2026-07-01T00:00:00-05:00",
    endsAt: "2026-09-27T13:00:00-05:00",
  },
  {
    id: "rise-up-and-build",
    lead: "Rise Up and Build",
    headline: "— join what the Lord is doing in this season.",
    ctaLabel: "See the vision",
    ctaHref: "/rise-up-and-build",
    startsAt: null,
    endsAt: null,
  },
];

export function getActiveAnnouncement(now: Date = new Date()): Announcement | null {
  const t = now.getTime();
  return (
    ANNOUNCEMENTS.find((a) => {
      const afterStart = !a.startsAt || t >= new Date(a.startsAt).getTime();
      const beforeEnd = !a.endsAt || t < new Date(a.endsAt).getTime();
      return afterStart && beforeEnd;
    }) ?? null
  );
}
