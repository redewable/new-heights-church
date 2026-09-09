import { describe, it, expect } from "vitest";
import { CHURCH, leaderName } from "@/lib/constants/church";

describe("CHURCH constants", () => {
  it("orders the three pillars harvest → bride → habitation (immutable keys)", () => {
    expect(CHURCH.pillars.map((p) => p.key)).toEqual(["harvest", "bride", "habitation"]);
  });

  it("maps each pillar to its tabernacle color", () => {
    const colors = Object.fromEntries(CHURCH.pillars.map((p) => [p.key, p.color]));
    expect(colors.harvest).toBe("scarlet");
    expect(colors.bride).toBe("purple");
    expect(colors.habitation).toBe("blue");
  });

  it("advertises both Sunday and Wednesday services", () => {
    const days = CHURCH.services.map((s) => s.dayOfWeek);
    expect(days).toContain("Sunday");
    expect(days).toContain("Wednesday");
  });
});

describe("CHURCH.leadership.team", () => {
  it("lists every minister with a fivefold office — honor travels with the name", () => {
    const { team } = CHURCH.leadership;
    expect(team).toHaveLength(13);
    for (const m of team) {
      expect(["Prophet", "Pastor", "Teacher"]).toContain(m.office);
      expect(m.name.trim().length).toBeGreaterThan(0);
      expect(leaderName(m)).toBe(`${m.office} ${m.name}`);
    }
    expect(leaderName(team[0])).toBe("Prophet Larry Hallam");
    // Names are unique even where only a first name is known.
    expect(new Set(team.map(leaderName)).size).toBe(team.length);
  });
});
