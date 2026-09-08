import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import type { Database, RedirectRow } from "@/lib/supabase/types";

/**
 * Redirect-map loader. Called from proxy.ts on every request, so the
 * performance story matters — Next's fetch cache is what keeps it cheap.
 * We use the anon key (public-read RLS policy makes it safe) and cache
 * the response for 60s via `next: { revalidate: 60 }`.
 *
 * Falls back to the fixture map when Supabase isn't configured — the
 * legacy WordPress routes are still served even pre-launch.
 */

export interface RedirectRule {
  source: string;
  target: string;
  status: 301 | 302 | 307 | 308;
}

const FIXTURE_REDIRECTS: ReadonlyArray<RedirectRule> = [
  { source: "/sermons-main", target: "/sermons", status: 301 },
  { source: "/sermons-main/", target: "/sermons", status: 301 },
  { source: "/online", target: "/watch", status: 301 },
  { source: "/online/", target: "/watch", status: 301 },
  { source: "/giving", target: "/give", status: 301 },
  { source: "/giving/", target: "/give", status: 301 },
  { source: "/bhp", target: "/podcasts#brian-hallam-podcast", status: 301 },
  { source: "/bhp/", target: "/podcasts#brian-hallam-podcast", status: 301 },
  { source: "/riseupandbuild", target: "/rise-up-and-build", status: 301 },
  { source: "/riseupandbuild/", target: "/rise-up-and-build", status: 301 },
  { source: "/new-heights-youth-raffle", target: "/youth#raffle", status: 301 },
  { source: "/new-heights-youth-raffle/", target: "/youth#raffle", status: 301 },
];

/**
 * Load the full redirect map. We load everything once per cache window
 * rather than per-request-by-source because the map is tiny (dozens to
 * low hundreds of entries) and the inside-proxy lookup must be O(1).
 */
export async function loadRedirects(): Promise<ReadonlyArray<RedirectRule>> {
  const env = getSupabasePublicEnv();
  if (!env) return FIXTURE_REDIRECTS;

  // Build a stateless client — proxy.ts calls have no user session.
  const client = createClient<Database>(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 60, tags: ["redirects"] } }),
    },
  });

  const { data, error } = await client
    .from("redirects")
    .select("source_path, target_path, status_code")
    .eq("active", true);

  if (error || !data) return FIXTURE_REDIRECTS;

  return (data as Pick<RedirectRow, "source_path" | "target_path" | "status_code">[]).map(
    (r) => ({
      source: r.source_path,
      target: r.target_path,
      status: r.status_code,
    }),
  );
}

/**
 * Find a match for a given incoming pathname. Checks both exact and
 * trailing-slash-normalized variants so `/sermons-main/` resolves even if
 * staff only entered `/sermons-main` in admin. Returns null when no rule
 * applies.
 */
export function matchRedirect(
  pathname: string,
  rules: ReadonlyArray<RedirectRule>,
): RedirectRule | null {
  // Exact match wins.
  const exact = rules.find((r) => r.source === pathname);
  if (exact) return exact;

  // Normalize trailing slash and retry.
  const alt = pathname.endsWith("/") ? pathname.slice(0, -1) : `${pathname}/`;
  const byAlt = rules.find((r) => r.source === alt);
  return byAlt ?? null;
}
