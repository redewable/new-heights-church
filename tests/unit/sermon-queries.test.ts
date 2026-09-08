import { describe, it, expect } from "vitest";
import {
  getLatestSermon,
  getSermonBySlug,
  getSermonFacets,
  getSeriesById,
  getSeriesSiblings,
  listSermons,
  listSeries,
} from "@/lib/sermons/queries";

// These tests rely on the fixtures fallback (Supabase env is unset). That's
// the right thing — they validate the filter/search logic we control, not
// Postgres behavior, and they stay green on every contributor's laptop.
//
// Fixtures are the Church's six most recent real services (three Sunday
// mornings, three Wednesday evenings) with no pillar/scripture/topic tags.

describe("listSermons (fixtures fallback)", () => {
  it("returns newest first by default", async () => {
    const { sermons, source } = await listSermons();
    expect(source).toBe("fixtures");
    expect(sermons[0]?.service_date >= sermons[1]?.service_date).toBe(true);
  });

  it("filters by pillar — only tagged sermons come back", async () => {
    const { sermons } = await listSermons({ pillar: "harvest" });
    expect(sermons.every((s) => s.pillar === "harvest")).toBe(true);
  });

  it("filters by series slug", async () => {
    const { sermons } = await listSermons({ seriesSlug: "sunday-morning" });
    expect(sermons.length).toBe(3);
    expect(sermons.every((s) => s.series_id === "s-sunday-morning")).toBe(true);
  });

  it("filters by year", async () => {
    const { sermons } = await listSermons({ year: 2026 });
    expect(sermons.length).toBe(6);
    expect(sermons.every((s) => s.service_date.startsWith("2026"))).toBe(true);
    const { sermons: none } = await listSermons({ year: 2024 });
    expect(none.length).toBe(0);
  });

  it("searches across title and description", async () => {
    const { sermons: byTitle } = await listSermons({ q: "wednesday" });
    expect(byTitle.length).toBe(3);

    const { sermons: byDescription } = await listSermons({ q: "prophetic" });
    expect(byDescription.length).toBe(3);

    const { sermons: byDate } = await listSermons({ q: "September 6" });
    expect(byDate.length).toBe(1);
  });

  it("sorts by views when asked", async () => {
    const { sermons } = await listSermons({ sort: "popular", limit: 3 });
    expect(sermons[0].views).toBeGreaterThanOrEqual(sermons[1].views);
  });

  it("returns a total count independent of the page limit", async () => {
    const { total, sermons } = await listSermons({ limit: 2 });
    expect(sermons.length).toBe(2);
    expect(total).toBeGreaterThan(2);
  });
});

describe("getSermonBySlug (fixtures fallback)", () => {
  it("returns the matching fixture", async () => {
    const s = await getSermonBySlug("sunday-morning-2026-09-06");
    expect(s?.title).toContain("Sunday Morning");
    expect(s?.youtube_id).toBe("2fNnE7R1jfQ");
  });
  it("returns null when slug is unknown", async () => {
    expect(await getSermonBySlug("does-not-exist")).toBeNull();
  });
});

describe("series helpers (fixtures fallback)", () => {
  it("listSeries returns published series", async () => {
    const s = await listSeries();
    expect(s.length).toBe(2);
  });
  it("getSeriesById returns the matching fixture", async () => {
    const s = await getSeriesById("s-sunday-morning");
    expect(s?.slug).toBe("sunday-morning");
  });
  it("getSeriesSiblings excludes the current sermon", async () => {
    const siblings = await getSeriesSiblings("s-sunday-morning", "m-2026-09-06");
    expect(siblings).toHaveLength(2);
    expect(siblings.map((s) => s.id)).not.toContain("m-2026-09-06");
  });
});

describe("getSermonFacets (fixtures fallback)", () => {
  it("returns unique speakers, descending years, and all series", async () => {
    const facets = await getSermonFacets();
    expect(facets.speakers).toContain("Apostle Brian Hallam");
    expect(facets.years[0]).toBeGreaterThanOrEqual(facets.years[1] ?? 0);
    expect(facets.series.map((s) => s.slug)).toEqual(
      expect.arrayContaining(["sunday-morning", "wednesday-evening"]),
    );
  });
});

describe("getLatestSermon (fixtures fallback)", () => {
  it("returns the single most recent sermon", async () => {
    const s = await getLatestSermon();
    expect(s).not.toBeNull();
    expect(s?.service_date).toBe("2026-09-06");
  });
});
