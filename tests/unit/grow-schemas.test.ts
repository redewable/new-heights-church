import { describe, it, expect } from "vitest";
import { BaptismInterestSchema } from "@/lib/schemas/baptism";
import { BabyDedicationSchema } from "@/lib/schemas/baby-dedication";
import { VolunteerSchema } from "@/lib/schemas/volunteer";

describe("BaptismInterestSchema", () => {
  const base = {
    firstName: "Marcus",
    lastName: "Tillman",
    email: "marcus@example.com",
  };

  it("accepts the minimum required fields", () => {
    const r = BaptismInterestSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("requires parent consent + contact when the applicant is a minor", () => {
    const dob = new Date();
    dob.setUTCFullYear(dob.getUTCFullYear() - 13); // 13 years old
    const r = BaptismInterestSchema.safeParse({
      ...base,
      dateOfBirth: dob.toISOString().slice(0, 10),
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("parentConsent");
      expect(paths).toContain("parentName");
      expect(paths).toContain("parentPhone");
    }
  });

  it("accepts a minor when parent consent + contact are present", () => {
    const dob = new Date();
    dob.setUTCFullYear(dob.getUTCFullYear() - 13);
    const r = BaptismInterestSchema.safeParse({
      ...base,
      dateOfBirth: dob.toISOString().slice(0, 10),
      parentConsent: "on",
      parentName: "Parent T.",
      parentPhone: "9793147585",
    });
    expect(r.success).toBe(true);
  });

  it("adults do NOT need parent consent", () => {
    const dob = new Date();
    dob.setUTCFullYear(dob.getUTCFullYear() - 30);
    const r = BaptismInterestSchema.safeParse({
      ...base,
      dateOfBirth: dob.toISOString().slice(0, 10),
    });
    expect(r.success).toBe(true);
  });
});

describe("BabyDedicationSchema", () => {
  const base = {
    parentFirstName: "Sarah",
    parentLastName: "K.",
    email: "sarah@example.com",
    phone: "(979) 314-7585",
    childFirstName: "Ezra",
  };

  it("accepts the minimum required fields", () => {
    const r = BabyDedicationSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe("9793147585");
  });

  it("requires parent first + last name, email, phone, and child first name", () => {
    const r = BabyDedicationSchema.safeParse({});
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("parentFirstName");
      expect(paths).toContain("parentLastName");
      expect(paths).toContain("email");
      expect(paths).toContain("phone");
      expect(paths).toContain("childFirstName");
    }
  });

  it("rejects short phone numbers", () => {
    const r = BabyDedicationSchema.safeParse({ ...base, phone: "555-0" });
    expect(r.success).toBe(false);
  });
});

describe("VolunteerSchema", () => {
  const base = {
    firstName: "Andre",
    lastName: "P.",
    email: "andre@example.com",
    phone: "9793147585",
    ministryAreas: ["first_touch"],
  };

  it("accepts a single ministry area", () => {
    const r = VolunteerSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.ministryAreas).toEqual(["first_touch"]);
  });

  it("accepts multiple ministry areas (multi-select)", () => {
    const r = VolunteerSchema.safeParse({
      ...base,
      ministryAreas: ["first_touch", "worship", "prayer_team"],
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.ministryAreas).toHaveLength(3);
      expect(r.data.ministryAreas).toContain("worship");
    }
  });

  it("requires at least one ministry area", () => {
    const r = VolunteerSchema.safeParse({ ...base, ministryAreas: [] });
    expect(r.success).toBe(false);
  });

  it("rejects unknown ministry areas", () => {
    const r = VolunteerSchema.safeParse({
      ...base,
      ministryAreas: ["not_a_real_team"],
    });
    expect(r.success).toBe(false);
  });

  it("requires the same contact fields as other flows", () => {
    const r = VolunteerSchema.safeParse({ ministryAreas: ["first_touch"] });
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("firstName");
      expect(paths).toContain("lastName");
      expect(paths).toContain("email");
      expect(paths).toContain("phone");
    }
  });

  it("coerces HTML checkbox 'on' values for completedN2N + Foundations", () => {
    const r = VolunteerSchema.safeParse({
      ...base,
      completedN2N: "on",
      completedFoundations: "on",
      backgroundCheckConsent: "on",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.completedN2N).toBe(true);
      expect(r.data.completedFoundations).toBe(true);
      expect(r.data.backgroundCheckConsent).toBe(true);
    }
  });
});
