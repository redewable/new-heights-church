import { describe, it, expect } from "vitest";
import { ConnectCardSchema } from "@/lib/schemas/connect-card";
import { PrayerRequestSchema } from "@/lib/schemas/prayer";
import { DecisionSchema, DecisionFollowUpSchema } from "@/lib/schemas/decision";

/**
 * Schemas are the front-line defense of every engagement flow. These tests
 * pin the validation contract — required vs. optional, honeypot rejection,
 * phone normalization, checkbox coercion — so a well-intended refactor
 * can't silently loosen the gate.
 */

function fd(obj: Record<string, string>): Record<string, string> {
  // The server action reads `Object.fromEntries(formData)`; we mimic that
  // shape directly here so tests cover the real parse surface.
  return obj;
}

describe("ConnectCardSchema", () => {
  const base = fd({
    firstName: "Marcus",
    lastName: "Tillman",
    email: "marcus@example.com",
  });

  it("accepts the minimum required fields", () => {
    const result = ConnectCardSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Marcus");
      expect(result.data.email).toBe("marcus@example.com");
      expect(result.data.firstTime).toBe(false);
      expect(result.data.wantsCall).toBe(false);
    }
  });

  it("requires first name, last name, and email", () => {
    const r1 = ConnectCardSchema.safeParse(fd({ email: "a@b.co" }));
    expect(r1.success).toBe(false);
    if (!r1.success) {
      const paths = r1.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("firstName");
      expect(paths).toContain("lastName");
    }
  });

  it("rejects malformed emails", () => {
    const r = ConnectCardSchema.safeParse({ ...base, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("normalizes email to lowercase + trim", () => {
    const r = ConnectCardSchema.safeParse({
      ...base,
      email: "  Marcus@Example.COM  ",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("marcus@example.com");
  });

  it("strips phone formatting down to digits", () => {
    const r = ConnectCardSchema.safeParse({
      ...base,
      phone: "(979) 314-7585",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe("9793147585");
  });

  it("rejects phone with fewer than 10 digits", () => {
    const r = ConnectCardSchema.safeParse({ ...base, phone: "314-7585" });
    expect(r.success).toBe(false);
  });

  it("coerces HTML checkbox 'on' into boolean true", () => {
    const r = ConnectCardSchema.safeParse({
      ...base,
      firstTime: "on",
      wantsCall: "on",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.firstTime).toBe(true);
      expect(r.data.wantsCall).toBe(true);
    }
  });

  it("rejects a populated honeypot", () => {
    const r = ConnectCardSchema.safeParse({
      ...base,
      website: "http://bot-target.com",
    });
    expect(r.success).toBe(false);
  });

  it("accepts an empty honeypot", () => {
    const r = ConnectCardSchema.safeParse({ ...base, website: "" });
    expect(r.success).toBe(true);
  });
});

describe("PrayerRequestSchema", () => {
  it("requires only `request`", () => {
    const r = PrayerRequestSchema.safeParse({ request: "Please pray for my mom." });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.name).toBeUndefined();
      expect(r.data.email).toBeUndefined();
      expect(r.data.urgent).toBe(false);
      expect(r.data.shareAnonymously).toBe(false);
    }
  });

  it("rejects blank request", () => {
    const r = PrayerRequestSchema.safeParse({ request: "   " });
    expect(r.success).toBe(false);
  });

  it("accepts an optional email that validates", () => {
    const r = PrayerRequestSchema.safeParse({
      request: "covering a hard season",
      email: "me@example.com",
      name: "Sarah",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("me@example.com");
      expect(r.data.name).toBe("Sarah");
    }
  });

  it("rejects a malformed optional email", () => {
    const r = PrayerRequestSchema.safeParse({
      request: "test",
      email: "not-an-email",
    });
    expect(r.success).toBe(false);
  });

  it("caps request length at 3000 characters", () => {
    const r = PrayerRequestSchema.safeParse({ request: "x".repeat(3001) });
    expect(r.success).toBe(false);
  });
});

describe("DecisionSchema", () => {
  it("requires decisionType + firstName; everything else is optional", () => {
    const r = DecisionSchema.safeParse({
      decisionType: "salvation",
      firstName: "Marcus",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.decisionType).toBe("salvation");
      expect(r.data.firstName).toBe("Marcus");
      expect(r.data.email).toBeUndefined();
      expect(r.data.phone).toBeUndefined();
    }
  });

  it("rejects unknown decisionType", () => {
    const r = DecisionSchema.safeParse({
      decisionType: "deliverance",
      firstName: "Marcus",
    });
    expect(r.success).toBe(false);
  });

  it("accepts all four decision types", () => {
    for (const t of ["salvation", "rededication", "holy_spirit", "water_baptism"]) {
      const r = DecisionSchema.safeParse({ decisionType: t, firstName: "X" });
      expect(r.success, `expected ${t} to be accepted`).toBe(true);
    }
  });

  it("rejects missing firstName even when decisionType is set", () => {
    const r = DecisionSchema.safeParse({ decisionType: "salvation" });
    expect(r.success).toBe(false);
  });

  it("accepts serviceChannel when provided and valid", () => {
    const r = DecisionSchema.safeParse({
      decisionType: "salvation",
      firstName: "Marcus",
      serviceChannel: "online",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.serviceChannel).toBe("online");
  });

  it("rejects unknown serviceChannel", () => {
    const r = DecisionSchema.safeParse({
      decisionType: "salvation",
      firstName: "Marcus",
      serviceChannel: "drive-thru",
    });
    expect(r.success).toBe(false);
  });
});

describe("DecisionFollowUpSchema", () => {
  const valid = {
    decisionId: "00000000-0000-4000-8000-000000000001",
    firstName: "Marcus",
    email: "m@example.com",
  };

  it("requires a uuid decisionId", () => {
    const r = DecisionFollowUpSchema.safeParse({ ...valid, decisionId: "nope" });
    expect(r.success).toBe(false);
  });

  it("accepts a valid uuid + email + firstName", () => {
    const r = DecisionFollowUpSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("requires email (unlike the initial decision step)", () => {
    const r = DecisionFollowUpSchema.safeParse({
      ...valid,
      email: undefined,
    });
    expect(r.success).toBe(false);
  });
});
