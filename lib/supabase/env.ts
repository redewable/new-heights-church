/**
 * Centralized env reader for Supabase. Returns `null` when the project isn't
 * configured so the rest of the app can fall back to fixtures in dev. When
 * live, the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 * must both be present — either both set or both missing. Partial config
 * is treated as misconfiguration and thrown in non-production.
 */

interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url && !anonKey) return null;
  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        "Supabase env is half-configured. Set BOTH NEXT_PUBLIC_SUPABASE_URL " +
          "and NEXT_PUBLIC_SUPABASE_ANON_KEY, or leave both unset to use fixtures.",
      );
    }
    return null;
  }
  return { url, anonKey };
}

export function getSupabaseServiceRoleKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}
