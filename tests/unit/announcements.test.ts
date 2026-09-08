import { describe, it, expect } from "vitest";
import { getActiveAnnouncement } from "@/lib/constants/announcements";

describe("getActiveAnnouncement", () => {
  it("shows Activated in the weeks before the conference", () => {
    const a = getActiveAnnouncement(new Date("2026-09-07T12:00:00-05:00"));
    expect(a?.id).toBe("activated-2026");
    expect(a?.ctaHref).toBe("/events/activated-2026");
  });

  it("still shows Activated on the Sunday morning of the conference", () => {
    const a = getActiveAnnouncement(new Date("2026-09-27T09:00:00-05:00"));
    expect(a?.id).toBe("activated-2026");
  });

  it("falls back to Rise Up and Build once the conference has ended", () => {
    const a = getActiveAnnouncement(new Date("2026-10-01T12:00:00-05:00"));
    expect(a?.id).toBe("rise-up-and-build");
  });

  it("falls back to Rise Up and Build before the Activated window opens", () => {
    const a = getActiveAnnouncement(new Date("2026-05-01T12:00:00-05:00"));
    expect(a?.id).toBe("rise-up-and-build");
  });
});
