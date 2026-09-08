import "server-only";

import { dataClient, guarded, requireFields, requireIsoDate } from "@/lib/supabase/guard";
import type { EventRow, EventMinistry } from "@/lib/supabase/types";
import { EVENT_FIXTURES } from "./fixtures";

/**
 * Events query layer. Supabase when configured, fixtures otherwise — and
 * fixtures again whenever Supabase errors or returns rows the UI can't
 * render, so a CMS problem never becomes a 500 on the public site.
 */

export interface EventFilters {
  ministry?: EventMinistry | "any";
  /** When true, only future events are returned. */
  upcoming?: boolean;
  limit?: number;
}

export interface EventListResult {
  events: EventRow[];
  total: number;
  source: "supabase" | "fixtures";
}

const REQUIRED: ReadonlyArray<keyof EventRow> = [
  "id",
  "slug",
  "title",
  "start_at",
  "published",
];

function assertEventRow(row: unknown): asserts row is EventRow {
  requireFields<EventRow>(row, REQUIRED, "events");
  requireIsoDate(row.start_at, "events.start_at");
  if (row.end_at != null) requireIsoDate(row.end_at, "events.end_at");
}

/** Fill columns added after the first schema so older rows still render. */
function normalize(row: EventRow): EventRow {
  return {
    ...row,
    registration_status: row.registration_status ?? "open",
    speakers: row.speakers ?? null,
    poster_url: row.poster_url ?? null,
  };
}

export async function listEvents(filters: EventFilters = {}): Promise<EventListResult> {
  return guarded(
    "events.list",
    async () => {
      const db = await dataClient();
      if (!db) return fixtureList(filters);

      const limit = filters.limit ?? 60;
      let query = db.from("events").select("*", { count: "exact" }).eq("published", true);

      if (filters.ministry && filters.ministry !== "any") {
        query = query.eq("ministry", filters.ministry);
      }
      if (filters.upcoming) {
        query = query.gte("start_at", new Date().toISOString());
      }

      // Featured first, then chronological.
      query = query
        .order("featured", { ascending: false })
        .order("start_at", { ascending: true });

      const { data, count, error } = await query.limit(limit);
      if (error) throw error;
      const rows = (data ?? []).map((r) => {
        assertEventRow(r);
        return normalize(r);
      });
      return { events: rows, total: count ?? rows.length, source: "supabase" };
    },
    () => fixtureList(filters),
  );
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const fromFixtures = () => EVENT_FIXTURES.find((e) => e.slug === slug) ?? null;
  return guarded(
    "events.bySlug",
    async () => {
      const db = await dataClient();
      if (!db) return fromFixtures();
      const { data, error } = await db
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      assertEventRow(data);
      return normalize(data);
    },
    fromFixtures,
  );
}

export async function listFeaturedEvents(limit = 3): Promise<EventRow[]> {
  const { events } = await listEvents({ upcoming: true, limit: limit * 4 });
  const featured = events.filter((e) => e.featured);
  // If fewer than `limit` featured, pad with any upcoming to avoid a thin row.
  const padded = [
    ...featured,
    ...events.filter((e) => !e.featured && !featured.includes(e)),
  ];
  return padded.slice(0, limit);
}

/** Next N upcoming events regardless of featured status. */
export async function listUpcomingEvents(limit = 5): Promise<EventRow[]> {
  const { events } = await listEvents({ upcoming: true, limit });
  return events;
}

// ---------- fixtures fallback ----------
function fixtureList(filters: EventFilters): EventListResult {
  let rows = EVENT_FIXTURES.filter((e) => e.published);
  if (filters.ministry && filters.ministry !== "any") {
    rows = rows.filter((e) => e.ministry === filters.ministry);
  }
  if (filters.upcoming) {
    const now = Date.now();
    rows = rows.filter((e) => new Date(e.start_at).getTime() >= now);
  }
  rows = [...rows].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.start_at.localeCompare(b.start_at);
  });
  const limit = filters.limit ?? 60;
  return { events: rows.slice(0, limit), total: rows.length, source: "fixtures" };
}
