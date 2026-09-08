import "server-only";

import { supabaseServer } from "@/lib/supabase/server";
import type { EventRow, EventMinistry } from "@/lib/supabase/types";
import { EVENT_FIXTURES } from "./fixtures";

/**
 * Events query layer. Same pattern as sermons — Supabase when configured,
 * fixtures otherwise. `listEvents` and `getEventBySlug` are the public
 * surface; the others are convenience helpers for the home page and
 * /grow cross-links.
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

export async function listEvents(filters: EventFilters = {}): Promise<EventListResult> {
  const db = await supabaseServer();
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
  return {
    events: (data ?? []) as EventRow[],
    total: count ?? data?.length ?? 0,
    source: "supabase",
  };
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const db = await supabaseServer();
  if (!db) return EVENT_FIXTURES.find((e) => e.slug === slug) ?? null;
  const { data, error } = await db
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as EventRow | null) ?? null;
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
