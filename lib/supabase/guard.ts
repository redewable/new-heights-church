import "server-only";

/**
 * A public page must never 500 because the CMS is down, misconfigured, or
 * pointed at the wrong project. Every read goes through `guarded`: try
 * Supabase, and on any thrown error, returned error, or malformed row, log
 * once and serve the fixture equivalent instead.
 *
 * This is what kept the site up on 2026-09-08, when the Vercel project still
 * carried Supabase keys from an older build whose tables don't match.
 */
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
