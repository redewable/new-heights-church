import { describe, it, expect, vi } from "vitest";

// A Supabase project from an older build: `sermons` exists with `slug` and
// `published`, so a lookup by slug returns *no row* and no error — but it
// lacks the columns our migrations add. Before the schema probe, the list
// page fell back to fixtures (its query errored on a missing column) while
// the detail page 404'd: the site disagreeing with itself. The probe must
// put every read in fixture mode.
vi.mock("@/lib/supabase/server", () => {
  interface Fake {
    select: () => Fake;
    limit: () => Promise<{ data: null; error: { message: string } | null }>;
  }
  const chain = (table: string): Fake => {
    const q: Fake = {
      select: () => q,
      limit: async () => ({
        data: null,
        error:
          table === "sermons"
            ? { message: "column sermons.pillar does not exist" }
            : null,
      }),
    };
    return q;
  };
  return { supabaseServer: async () => ({ from: (table: string) => chain(table) }) };
});

import { getSermonBySlug, listSermons } from "@/lib/sermons/queries";
import { getEventBySlug, listEvents } from "@/lib/events/queries";

describe("dataClient schema probe (project from another build)", () => {
  it("serves the fixture sermon by slug instead of a 404", async () => {
    const sermon = await getSermonBySlug("sunday-morning-2026-08-30");
    expect(sermon?.slug).toBe("sunday-morning-2026-08-30");
  });

  it("keeps the sermon list in fixture mode — same source as the detail page", async () => {
    const { source, sermons } = await listSermons();
    expect(source).toBe("fixtures");
    expect(sermons.some((s) => s.slug === "sunday-morning-2026-08-30")).toBe(true);
  });

  it("does the same for events", async () => {
    const [{ source }, event] = await Promise.all([
      listEvents(),
      getEventBySlug("activated-2026"),
    ]);
    expect(source).toBe("fixtures");
    expect(event?.slug).toBe("activated-2026");
  });
});
