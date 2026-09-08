import { describe, it, expect } from "vitest";
import { PledgeSchema } from "@/lib/schemas/pledge";
import { StatementRequestSchema, availableTaxYears } from "@/lib/schemas/statement";

describe("PledgeSchema", () => {
  const base = {
    campaign: "rise-up-and-build",
    firstName: "Marcus",
    email: "marcus@example.com",
    amount: "100",
    frequency: "monthly",
  };

  it("accepts the minimum required fields", () => {
    const r = PledgeSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.amount).toBe(10000); // $100 = 10000 cents
      expect(r.data.frequency).toBe("monthly");
    }
  });

  it.each([
    ["100", 10000],
    ["1,000", 100000],
    ["$1,000.50", 100050],
    ["2500", 250000],
  ])("parses amount %j → %i cents", (input, expected) => {
    const r = PledgeSchema.safeParse({ ...base, amount: input });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.amount).toBe(expected);
  });

  it("rejects amounts below $1", () => {
    const r = PledgeSchema.safeParse({ ...base, amount: "0.50" });
    expect(r.success).toBe(false);
  });

  it("rejects amounts above $1M", () => {
    const r = PledgeSchema.safeParse({ ...base, amount: "1000001" });
    expect(r.success).toBe(false);
  });

  it("rejects unknown frequency", () => {
    const r = PledgeSchema.safeParse({ ...base, frequency: "biweekly" });
    expect(r.success).toBe(false);
  });

  it("requires campaign, firstName, email", () => {
    const r = PledgeSchema.safeParse({ amount: "100", frequency: "monthly" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("firstName");
      expect(paths).toContain("email");
      expect(paths).toContain("campaign");
    }
  });

  it("rejects a populated honeypot", () => {
    const r = PledgeSchema.safeParse({ ...base, website: "http://bot.com" });
    expect(r.success).toBe(false);
  });
});

describe("StatementRequestSchema", () => {
  const currentYear = new Date().getUTCFullYear();
  const base = {
    firstName: "Marcus",
    email: "marcus@example.com",
    taxYear: currentYear,
  };

  it("accepts current year", () => {
    const r = StatementRequestSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("accepts string tax year (form submits it as string)", () => {
    const r = StatementRequestSchema.safeParse({
      ...base,
      taxYear: String(currentYear),
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.taxYear).toBe(currentYear);
  });

  it("rejects a tax year more than 5 years ago", () => {
    const r = StatementRequestSchema.safeParse({
      ...base,
      taxYear: currentYear - 10,
    });
    expect(r.success).toBe(false);
  });

  it("rejects a future tax year", () => {
    const r = StatementRequestSchema.safeParse({
      ...base,
      taxYear: currentYear + 2,
    });
    expect(r.success).toBe(false);
  });

  it("availableTaxYears returns 6 descending years", () => {
    const years = availableTaxYears();
    expect(years).toHaveLength(6);
    expect(years[0]).toBe(currentYear);
    expect(years[5]).toBe(currentYear - 5);
    // Sorted descending
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeLessThan(years[i - 1]);
    }
  });
});
