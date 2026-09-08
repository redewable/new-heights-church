import type { SermonRow, SeriesRow } from "@/lib/supabase/types";

/**
 * Dev/preview fixtures — the Church's six most recent real services, pulled
 * from the New Heights YouTube channel (UCKRwjr7sT9avbEUDsY2BLiA) on
 * 2026-09-07. Used as a fallback when Supabase isn't configured so the
 * sermons library and watch page render honestly before the YouTube ingest
 * is wired. Real video IDs, real dates, real titles. No placeholder tags:
 * pillar, scripture, and topics stay empty until staff tag them in admin.
 *
 * Order matches supabase/seed.sql. When you change a fixture here, mirror it
 * in seed.sql so local Postgres stays consistent.
 */

const SPEAKER = "Apostle Brian Hallam";

export const SERIES_FIXTURES: SeriesRow[] = [
  {
    id: "s-sunday-morning",
    slug: "sunday-morning",
    title: "Sunday Morning @ New Heights",
    description:
      "The weekend gathering — worship, the Word of God, and an open altar. Every Sunday at 10 AM with Apostle Brian Hallam.",
    poster_url: null,
    start_date: "2026-01-04",
    end_date: null,
    published: true,
    created_at: "2026-01-04T00:00:00Z",
    updated_at: "2026-09-07T00:00:00Z",
  },
  {
    id: "s-wednesday-evening",
    slug: "wednesday-evening",
    title: "Wednesday Evening @ New Heights",
    description:
      "The midweek refill — prayer, the prophetic, and the presence of God. Every Wednesday at 7 PM with Apostle Brian Hallam.",
    poster_url: null,
    start_date: "2026-01-07",
    end_date: null,
    published: true,
    created_at: "2026-01-07T00:00:00Z",
    updated_at: "2026-09-07T00:00:00Z",
  },
];

function service(
  kind: "sunday" | "wednesday",
  date: string,
  youtubeId: string,
  label: string,
): SermonRow {
  const isSunday = kind === "sunday";
  // Central time: Sundays 10 AM, Wednesdays 7 PM.
  const at = isSunday ? `${date}T10:00:00-05:00` : `${date}T19:00:00-05:00`;
  return {
    id: `m-${date}`,
    slug: `${isSunday ? "sunday-morning" : "wednesday-evening"}-${date}`,
    title: `${isSunday ? "Sunday Morning" : "Wednesday Evening"} · ${label}`,
    description: isSunday
      ? `Sunday morning service at New Heights Church with ${SPEAKER} — worship, the Word of God, and the altar. ${label}.`
      : `Wednesday evening service at New Heights Church with ${SPEAKER} — prayer, the prophetic, and the presence of God. ${label}.`,
    speaker: SPEAKER,
    series_id: isSunday ? "s-sunday-morning" : "s-wednesday-evening",
    service_date: date,
    youtube_id: youtubeId,
    audio_url: null,
    duration_seconds: null,
    poster_url: null,
    transcript: null,
    notes_url: null,
    scripture_refs: [],
    topics: [],
    pillar: null,
    views: 0,
    published: true,
    published_at: at,
    created_at: at,
    updated_at: "2026-09-07T00:00:00Z",
  };
}

export const SERMON_FIXTURES: SermonRow[] = [
  service("sunday", "2026-09-06", "2fNnE7R1jfQ", "September 6, 2026"),
  service("wednesday", "2026-09-02", "kP3C1SlllRk", "September 2, 2026"),
  service("sunday", "2026-08-30", "b0bkcZJo05g", "August 30, 2026"),
  service("wednesday", "2026-08-26", "j0PfC7luZrE", "August 26, 2026"),
  service("sunday", "2026-08-23", "tu8wWQ0HW8s", "August 23, 2026"),
  service("wednesday", "2026-08-19", "tHLnZvjBzSE", "August 19, 2026"),
];
