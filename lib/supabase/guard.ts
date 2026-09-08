import "server-only";

import { supabaseServer, type NhcSupabaseClient } from "./server";

/**
 * A public page must never 500 because the CMS is down, misconfigured, or
 * pointed at the wrong project. Every read goes through `guarded`: try
 * Supabase, and on any thrown error, returned error, or malformed row, log
 * once and serve the fixture equivalent instead.
 *
 * This is what kept the site up on 2026-09-08, when the Vercel project still
 * carried Supabase keys from an older build whose tables don't match.
 */

type Db = NonNullable<NhcSupabaseClient>;

/**
 * The client the public read layer uses — or null, meaning "fixture mode".
 *
 * Null when Supabase isn't configured, and also when the configured project
 * doesn't carry our schema. That second case matters: a project from an
 * older build can have `sermons` with `slug` and `published` columns, so a
 * lookup by slug quietly returns *no row* instead of an error. The list
 * page (which errors on a missing column) would fall back to fixtures while
 * the detail page 404s — the site disagreeing with itself. One probe per
 * process settles it for every read.
 */
export async function dataClient(): Promise<Db | null> {
  const db = await supabaseServer();
  if (!db) return null;
  return (await schemaMatches(db)) ? db : null;
}

const RECHECK_MS = 60_000;
let verdict: { ok: boolean; at: number } | null = null;
let inflight: Promise<boolean> | null = null;

async function schemaMatches(db: Db): Promise<boolean> {
  // A pass is final for this process; a fail is re-checked every minute so
  // applying migrations doesn't require a redeploy to take effect.
  if (verdict && (verdict.ok || Date.now() - verdict.at < RECHECK_MS)) return verdict.ok;
  inflight ??= probe(db).finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Columns that only exist once migrations 0001–0008 have run. */
async function probe(db: Db): Promise<boolean> {
  let reason: string | null = null;
  try {
    const checks = await Promise.all([
      db.from("sermons").select("id, pillar, views, poster_url").limit(1),
      db.from("events").select("id, registration_status, speakers, poster_url").limit(1),
      db.from("series").select("id, slug, published").limit(1),
    ]);
    reason = checks.find((c) => c.error)?.error?.message ?? null;
  } catch (err) {
    reason = err instanceof Error ? err.message : String(err);
  }
  const ok = reason === null;
  if (!ok) {
    console.warn(
      `[data] Supabase project doesn't match our schema, serving fixtures — ${reason}`,
    );
  }
  verdict = { ok, at: Date.now() };
  return ok;
}
export async function guarded<T>(
  label: string,
  attempt: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  try {
    return await attempt();
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[data] ${label}: Supabase read failed, serving fixtures — ${reason}`);
    return await fallback();
  }
}

/** Throw if a row is missing the fields the UI relies on. */
export function requireFields<T extends object>(
  row: unknown,
  fields: ReadonlyArray<string>,
  label: string,
): asserts row is T {
  if (!row || typeof row !== "object") throw new Error(`${label}: row is not an object`);
  for (const f of fields) {
    const v = (row as Record<string, unknown>)[f];
    if (v === undefined) throw new Error(`${label}: row is missing "${f}"`);
  }
}

/** ISO timestamps must parse — an Invalid Date would crash the formatters. */
export function requireIsoDate(value: unknown, label: string): void {
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) {
    throw new Error(`${label}: bad timestamp ${String(value)}`);
  }
}
