import { describe, it, expect } from "vitest";
import { CHURCH } from "@/lib/constants/church";

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
