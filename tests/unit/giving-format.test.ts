import { describe, it, expect } from "vitest";
import { formatUSD, formatUSDLong, progressPercent } from "@/lib/giving/campaigns";
import type { CampaignProgressRow } from "@/lib/supabase/types";

describe("formatUSD (progress-meter abbreviated)", () => {
  it.each([
    [0, "$0"],
    [50_00, "$50"], // $50
    [1_000_00, "$1K"], // $1,000
    [2_500_00, "$2.5K"], // $2,500
    [1_234_567_00, "$1.23M"], // $1,234,567
    [250_000_000, "$2.5M"], // $2,500,000
  ])("formats %i cents as %s", (cents, expected) => {
    expect(formatUSD(cents)).toBe(expected);
  });
});

describe("formatUSDLong (full precision)", () => {
  it("prints commas for thousands separators", () => {
    expect(formatUSDLong(100_000_00)).toBe("$100,000");
    expect(formatUSDLong(1_234_567_00)).toBe("$1,234,567");
  });
});

describe("progressPercent", () => {
  function c(overrides: Partial<CampaignProgressRow>): CampaignProgressRow {
    return {
      id: "x",
      campaign: "test",
      title: "Test",
      blurb: null,
      goal_cents: 100_000_00,
      pledged_cents: 0,
      given_cents: 0,
      next_milestone: null,
      next_milestone_date: null,
      active: true,
      updated_at: new Date().toISOString(),
      ...overrides,
    };
  }

  it("is 0 when nothing is pledged or given", () => {
    expect(progressPercent(c({}))).toBe(0);
  });

  it("adds pledged + given to compute momentum", () => {
    expect(progressPercent(c({ pledged_cents: 25_000_00, given_cents: 25_000_00 }))).toBe(
      50,
    );
  });

  it("clamps to 100 even if overcommitted", () => {
    expect(progressPercent(c({ pledged_cents: 200_000_00 }))).toBe(100);
  });

  it("returns 0 for zero-goal campaigns (defensive)", () => {
    expect(progressPercent(c({ goal_cents: 0 }))).toBe(0);
  });
});
