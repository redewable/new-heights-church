import { describe, it, expect } from "vitest";
import { eventToICS } from "@/lib/events/ics";
import { EVENT_FIXTURES } from "@/lib/events/fixtures";

describe("eventToICS", () => {
  const n2n = EVENT_FIXTURES.find((e) => e.slug === "new-to-new-heights")!;
  const camp = EVENT_FIXTURES.find((e) => e.slug === "youth-camp-encounter")!;

  it("emits a well-formed VCALENDAR with a VEVENT", () => {
    const ics = eventToICS(n2n);
    expect(ics).toMatch(/^BEGIN:VCALENDAR\r\n/);
    expect(ics).toMatch(/END:VCALENDAR\r\n$/);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("PRODID:-//New Heights Church//NHC Events//EN");
  });

  it("UIDs are stable + scoped to our domain", () => {
    const ics = eventToICS(n2n);
    expect(ics).toContain("UID:new-to-new-heights@newheightschurch.info");
  });

  it("encodes DTSTART in UTC from the event's ISO timestamp", () => {
    const ics = eventToICS(n2n);
    // fixture's start_at is "2026-05-17T13:30:00Z" (Sun May 17 · 8:30 AM CDT)
    expect(ics).toContain("DTSTART:20260517T133000Z");
  });

  it("handles multi-day events", () => {
    const ics = eventToICS(camp);
    // Fri Jun 19 · 9:00 AM CDT → Sun Jun 21 · 5:00 PM CDT
    expect(ics).toContain("DTSTART:20260619T140000Z");
    expect(ics).toContain("DTEND:20260621T220000Z");
  });

  it("escapes commas, semicolons, and newlines in TEXT fields", () => {
    const ics = eventToICS({
      ...n2n,
      description: "First, second; third\nfourth",
    });
    expect(ics).toContain("First\\, second\\; third\\nfourth");
  });

  it("folds lines over 75 octets", () => {
    const longDescription = "x".repeat(200) + " end"; // forces folding in the description
    const ics = eventToICS({
      ...n2n,
      description: longDescription,
    });
    // Every line should be ≤ 75 chars + CR/LF fold markers (space prefix).
    for (const line of ics.split("\r\n")) {
      // Continuation lines start with a leading space; those are legal.
      expect(line.length).toBeLessThanOrEqual(75);
    }
  });

  it("includes a URL back to the public event page", () => {
    const ics = eventToICS(n2n);
    expect(ics).toContain("URL:https://newheightschurch.info/events/new-to-new-heights");
  });
});
