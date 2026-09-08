"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";
import type { Database } from "./types";

/**
 * Browser Supabase client. Module-level singleton — createBrowserClient does
 * its own internal memoization, but keeping a local reference avoids repeated
 * env lookups during fast re-renders.
 *
 * Returns `null` when Supabase isn't configured; the UI should degrade to a
 * read-only state (e.g. disable the "Give feedback" button) rather than crash.
 */

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function supabaseBrowser() {
  if (cached) return cached;
  const env = getSupabasePublicEnv();
  if (!env) return null;
  cached = createBrowserClient<Database>(env.url, env.anonKey);
  return cached;
}
