import "server-only";

import { supabaseServer } from "@/lib/supabase/server";
import type { PillarTag, SermonRow, SeriesRow } from "@/lib/supabase/types";
import { SERIES_FIXTURES, SERMON_FIXTURES } from "./fixtures";

/**
 * Query layer for sermons + series. Every function prefers Supabase when the
 * project is configured and falls back to local fixtures otherwise so the
 * Phase-2 UI is developable before the Church stands up their Supabase
 * project. When you add a query here, also add its fixture equivalent below
 * so the fallback stays honest.
 *
 * All functions are server-only. Do NOT import into Client Components.
 */

export interface SermonFilters {
  q?: string; // full-text search
  pillar?: PillarTag | "any";
  seriesSlug?: string;
  speaker?: string;
  year?: number;
  sort?: "newest" | "popular";
  limit?: number;
}

export interface SermonListResult {
  sermons: SermonRow[];
  total: number;
  source: "supabase" | "fixtures";
}

/** Return the most recent published sermons, optionally filtered. */
export async function listSermons(
  filters: SermonFilters = {},
): Promise<SermonListResult> {
  const db = await supabaseServer();
  if (!db) return fixtureList(filters);

  const limit = filters.limit ?? 24;
  let query = db.from("sermons").select("*", { count: "exact" }).eq("published", true);

  if (filters.pillar && filters.pillar !== "any") {
    query = query.eq("pillar", filters.pillar);
  }
  if (filters.speaker) query = query.eq("speaker", filters.speaker);
  if (filters.seriesSlug) {
    const { data } = await db
      .from("series")
      .select("id")
      .eq("slug", filters.seriesSlug)
      .single();
    const seriesId = (data as { id: string } | null)?.id;
    if (seriesId) query = query.eq("series_id", seriesId);
    else return { sermons: [], total: 0, source: "supabase" };
  }
  if (filters.year) {
    query = query
      .gte("service_date", `${filters.year}-01-01`)
      .lte("service_date", `${filters.year}-12-31`);
  }
  if (filters.q && filters.q.trim().length > 0) {
    // Postgres full-text search, websearch_to_tsquery handles "quoted phrases".
    query = query.textSearch("search", filters.q.trim(), {
      type: "websearch",
      config: "english",
    });
  }

  query =
    filters.sort === "popular"
      ? query.order("views", { ascending: false })
      : query.order("service_date", { ascending: false });

  const { data, count, error } = await query.limit(limit);
  if (error) throw error;
  return {
    sermons: (data ?? []) as SermonRow[],
    total: count ?? data?.length ?? 0,
    source: "supabase",
  };
}

/** Fetch a single sermon by slug. Returns null when not found. */
export async function getSermonBySlug(slug: string): Promise<SermonRow | null> {
  const db = await supabaseServer();
  if (!db) {
    return SERMON_FIXTURES.find((s) => s.slug === slug) ?? null;
  }
  const { data, error } = await db
    .from("sermons")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Fetch the series that owns a sermon. */
export async function getSeriesById(id: string | null): Promise<SeriesRow | null> {
  if (!id) return null;
  const db = await supabaseServer();
  if (!db) return SERIES_FIXTURES.find((s) => s.id === id) ?? null;
  const { data, error } = await db
    .from("series")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Siblings in the same series, excluding the current sermon. Ordered by date. */
export async function getSeriesSiblings(
  seriesId: string | null,
  excludeSermonId: string,
): Promise<SermonRow[]> {
  if (!seriesId) return [];
  const db = await supabaseServer();
  if (!db) {
    return SERMON_FIXTURES.filter(
      (s) => s.series_id === seriesId && s.id !== excludeSermonId,
    ).sort((a, b) => a.service_date.localeCompare(b.service_date));
  }
  const { data, error } = await db
    .from("sermons")
    .select("*")
    .eq("series_id", seriesId)
    .eq("published", true)
    .neq("id", excludeSermonId)
    .order("service_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SermonRow[];
}

/** List all published series, newest first. */
export async function listSeries(): Promise<SeriesRow[]> {
  const db = await supabaseServer();
  if (!db) return [...SERIES_FIXTURES];
  const { data, error } = await db
    .from("series")
    .select("*")
    .eq("published", true)
    .order("start_date", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as SeriesRow[];
}

/**
 * Collect the unique filter values (speakers, years, series) present in the
 * published library. Used by the /sermons filter UI. Cheap when the library
 * is small; when it grows past ~10k rows move this into a materialized view.
 */
export async function getSermonFacets(): Promise<{
  speakers: string[];
  years: number[];
  series: Pick<SeriesRow, "slug" | "title">[];
}> {
  const db = await supabaseServer();
  if (!db) {
    const speakers = uniq(SERMON_FIXTURES.map((s) => s.speaker));
    const years = uniq(
      SERMON_FIXTURES.map((s) => Number(s.service_date.slice(0, 4))),
    ).sort((a, b) => b - a);
    const series = SERIES_FIXTURES.map((s) => ({ slug: s.slug, title: s.title }));
    return { speakers, years, series };
  }

  const [sermonRes, seriesRes] = await Promise.all([
    db.from("sermons").select("speaker, service_date").eq("published", true),
    db
      .from("series")
      .select("slug, title")
      .eq("published", true)
      .order("start_date", { ascending: false, nullsFirst: false }),
  ]);

  const rows = (sermonRes.data ?? []) as Array<{
    speaker: string;
    service_date: string;
  }>;
  const seriesRows = (seriesRes.data ?? []) as Array<Pick<SeriesRow, "slug" | "title">>;

  return {
    speakers: uniq(rows.map((r) => r.speaker)),
    years: uniq(rows.map((r) => Number(r.service_date.slice(0, 4)))).sort(
      (a, b) => b - a,
    ),
    series: seriesRows,
  };
}

/**
 * Latest single sermon — used by /watch as the "if we're not live, here's
 * the most recent word" fallback and by the Home page's sermon strip in
 * future phases.
 */
export async function getLatestSermon(): Promise<SermonRow | null> {
  const { sermons } = await listSermons({ sort: "newest", limit: 1 });
  return sermons[0] ?? null;
}

// ---------- fixtures fallback ----------

function fixtureList(filters: SermonFilters): SermonListResult {
  let rows = SERMON_FIXTURES.filter((s) => s.published);

  if (filters.pillar && filters.pillar !== "any") {
    rows = rows.filter((s) => s.pillar === filters.pillar);
  }
  if (filters.speaker) rows = rows.filter((s) => s.speaker === filters.speaker);
  if (filters.seriesSlug) {
    const s = SERIES_FIXTURES.find((x) => x.slug === filters.seriesSlug);
    rows = s ? rows.filter((r) => r.series_id === s.id) : [];
  }
  if (filters.year) {
    rows = rows.filter((s) => Number(s.service_date.slice(0, 4)) === filters.year);
  }
  if (filters.q && filters.q.trim().length > 0) {
    const needle = filters.q.trim().toLowerCase();
    rows = rows.filter((s) => {
      const hay = [
        s.title,
        s.description ?? "",
        s.speaker,
        ...s.scripture_refs,
        ...s.topics,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }

  rows =
    filters.sort === "popular"
      ? [...rows].sort((a, b) => b.views - a.views)
      : [...rows].sort((a, b) => b.service_date.localeCompare(a.service_date));

  const limit = filters.limit ?? 24;
  return { sermons: rows.slice(0, limit), total: rows.length, source: "fixtures" };
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
