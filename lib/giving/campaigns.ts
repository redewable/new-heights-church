import "server-only";

import { supabaseServer } from "@/lib/supabase/server";
import type { CampaignProgressRow } from "@/lib/supabase/types";
import { CAMPAIGNS } from "@/lib/constants/giving";

/**
 * Campaign progress reader. Prefers Supabase when configured, falls back
 * to a static fixture derived from `lib/constants/giving.ts` so the
 * /rise-up-and-build page always renders with something honest — a "we're
 * still calibrating the ledger" state — rather than throwing.
 */

export async function getCampaignProgress(
  campaign: string,
): Promise<CampaignProgressRow | null> {
  const db = await supabaseServer();
  if (!db) return fixtureFor(campaign);
  const { data, error } = await db
    .from("campaign_progress")
    .select("*")
    .eq("campaign", campaign)
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return fixtureFor(campaign);
  return data as CampaignProgressRow;
}

function fixtureFor(slug: string): CampaignProgressRow | null {
  const entry = Object.values(CAMPAIGNS).find((c) => c.slug === slug);
  if (!entry) return null;
  return {
    id: `fixture-${slug}`,
    campaign: slug,
    title: entry.title,
    blurb: entry.blurb,
    goal_cents: slug === "rise-up-and-build" ? 250_000_000 : 50_000_000,
    pledged_cents: 0,
    given_cents: 0,
    next_milestone: slug === "rise-up-and-build" ? "Phase 1 groundbreaking" : null,
    next_milestone_date: null,
    active: true,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Percent-of-goal for a progress bar (0–100, clamped). Uses pledged+given
 * as "momentum" — the meter tells the story of what's been committed +
 * delivered, not just banked money.
 */
export function progressPercent(c: CampaignProgressRow): number {
  if (c.goal_cents <= 0) return 0;
  const num = c.pledged_cents + c.given_cents;
  return Math.max(0, Math.min(100, Math.round((num / c.goal_cents) * 100)));
}

export function formatUSD(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) {
    return `$${trimZeros((dollars / 1_000_000).toFixed(2))}M`;
  }
  if (dollars >= 1_000) {
    return `$${trimZeros((dollars / 1_000).toFixed(1))}K`;
  }
  return `$${dollars.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/**
 * Strip trailing zeros and a dangling decimal point so `2.50` renders as
 * `2.5` and `1.00` renders as `1`. Applied after `toFixed()` in the
 * compact USD formatter.
 */
function trimZeros(s: string): string {
  if (!s.includes(".")) return s;
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

export function formatUSDLong(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
