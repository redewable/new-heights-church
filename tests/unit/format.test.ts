import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateShort,
  formatDateWeekday,
  formatDuration,
} from "@/lib/utils/format";

describe("formatDate", () => {
  it("renders YYYY-MM-DD as long-form US", () => {
    expect(formatDate("2026-03-08")).toBe("March 8, 2026");
  });
  it("handles full ISO timestamps", () => {
    expect(formatDate("2026-03-08T10:00:00Z")).toMatch(/March 8, 2026/);
  });
  it("returns empty for null / undefined / garbage", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("formatDateShort", () => {
  it("renders short form", () => {
    expect(formatDateShort("2026-03-08")).toBe("Mar 8, 2026");
  });
});

describe("formatDateWeekday", () => {
  it("includes the weekday", () => {
    expect(formatDateWeekday("2026-03-08")).toMatch(/Sunday, March 8/);
  });
});

describe("formatDuration", () => {
  it.each([
    [0, "—"],
    [30, "30s"],
    [60, "1 min"],
    [120, "2 min"],
    [3540, "59 min"],
    [3600, "1h"],
    [3660, "1h 1m"],
    [5400, "1h 30m"],
  ])("formats %i seconds as %s", (input, expected) => {
    expect(formatDuration(input)).toBe(expected);
  });

  it("handles null / negative gracefully", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(-10)).toBe("—");
  });
});
