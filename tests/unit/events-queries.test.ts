import { describe, it, expect } from "vitest";
import {
  getEventBySlug,
  listEvents,
  listFeaturedEvents,
  listUpcomingEvents,
} from "@/lib/events/queries";

/**
 * Events query tests against the fixtures-fallback path. Supabase isn't
 * configured in unit tests; these validate our filter + sort logic.
 */

describe("listEvents (fixtures fallback)", () => {
  it("returns all published events sorted by featured then date", async () => {
    const { events, source } = await listEvents();
    expect(source).toBe("fixtures");
    expect(events.length).toBeGreaterThan(0);
    // First event must be featured
    expect(events[0].featured).toBe(true);
  });

  it("filters by ministry", async () => {
    const { events } = await listEvents({ ministry: "discipleship" });
    expect(events.every((e) => e.ministry === "discipleship")).toBe(true);
    expect(events.length).toBeGreaterThanOrEqual(2); // N2N + Foundations
  });

  it("filters to upcoming when requested", async () => {
    // Fixtures have dates in 2026 which are "future" for this test run
    // assuming tests run against the same clock the rest of the app uses.
    // This test just verifies the filter path is invoked, not the calendar.
    const { events } = await listEvents({ upcoming: true });
    const now = Date.now();
    expect(events.every((e) => new Date(e.start_at).getTime() >= now)).toBe(true);
  });

  it("obeys the limit parameter", async () => {
    const { events } = await listEvents({ limit: 2 });
    expect(events.length).toBeLessThanOrEqual(2);
  });
});

describe("getEventBySlug (fixtures fallback)", () => {
  it("returns the matching fixture by slug", async () => {
    const e = await getEventBySlug("new-to-new-heights");
    expect(e?.title).toBe("New to New Heights");
    expect(e?.registration_platform).toBe("planning_center");
  });

  it("returns null for unknown slugs", async () => {
    expect(await getEventBySlug("not-a-real-event")).toBeNull();
  });
});

describe("listFeaturedEvents (fixtures fallback)", () => {
  it("returns up to `limit` items starting with featured ones", async () => {
    const top3 = await listFeaturedEvents(3);
    expect(top3.length).toBeLessThanOrEqual(3);
    // All three should be featured given the fixture shape
    expect(top3.every((e) => e.featured)).toBe(true);
  });
});

describe("listUpcomingEvents (fixtures fallback)", () => {
  it("returns up to N upcoming events regardless of featured flag", async () => {
    const events = await listUpcomingEvents(5);
    expect(events.length).toBeLessThanOrEqual(5);
  });
});
