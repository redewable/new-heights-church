import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "./env";
import type { Database } from "./types";

/**
 * Re-export the inferred server-client type for consumers that need to
 * annotate (e.g. helper functions that receive the client as a param).
 * Inferring rather than constructing avoids fighting the complex generic
 * on `SupabaseClient` — newer versions introduced a `PostgrestVersion`
 * positional arg that makes hand-constructed aliases incompatible.
 */
export type NhcSupabaseClient = Awaited<ReturnType<typeof supabaseServer>>;

/**
 * Server-side Supabase client bound to the current request's cookie jar.
 * Use this in Server Components, Route Handlers, and Server Actions that
 * need to respect the user's auth session.
 *
 * Returns `null` when Supabase isn't configured — callers should branch
 * to fixtures or return a graceful "unavailable" UI. Throwing would break
 * local dev for anyone who hasn't wired credentials yet.
 */
export async function supabaseServer() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  // Next 16: cookies() is async.
  const jar = await cookies();

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return jar.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(
        all: {
          name: string;
          value: string;
          options: Parameters<typeof jar.set>[2];
        }[],
      ) {
        // Best-effort set — Server Components can't mutate cookies, but
        // Route Handlers and Server Actions can. Ignore the "readonly" throw.
        try {
          for (const { name, value, options } of all) {
            jar.set(name, value, options);
          }
        } catch {
          /* intentionally ignored in RSC context */
        }
      },
    },
  });
}

/**
 * Privileged client using the service-role key. Bypasses RLS.
 * Use ONLY in admin Route Handlers and Server Actions that have already
 * authenticated the caller as staff via `supabaseServer().auth.getUser()`
 * followed by an `is_staff()` check.
 *
 * NEVER import this from a Client Component. Returns null if the service
 * key isn't configured so dev doesn't blow up when we're unstaffed.
 */
export function supabaseAdmin() {
  const env = getSupabasePublicEnv();
  const key = getSupabaseServiceRoleKey();
  if (!env || !key) return null;
  return createClient<Database>(env.url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
