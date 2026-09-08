import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AscendingBars } from "@/components/brand/AscendingBars";

describe("AscendingBars (logo mark)", () => {
  it("renders exactly three bars — the three pillars, never four", () => {
    const { container } = render(<AscendingBars />);
    expect(container.querySelectorAll("rect")).toHaveLength(3);
  });

  it("bars rise left to right", () => {
    const { container } = render(<AscendingBars />);
    const heights = [...container.querySelectorAll("rect")].map((r) =>
      Number(r.getAttribute("height")),
    );
    expect(heights[0]).toBeLessThan(heights[1]);
    expect(heights[1]).toBeLessThan(heights[2]);
  });

  it("paints pillar colors in canonical order when tone=pillars", () => {
    const { container } = render(<AscendingBars tone="pillars" />);
    const fills = [...container.querySelectorAll("rect")].map((r) =>
      r.getAttribute("fill"),
    );
    expect(fills).toEqual([
      "var(--nh-harvest)",
      "var(--nh-bride)",
      "var(--nh-habitation)",
    ]);
  });

  it("is decorative unless labelled", () => {
    const { container, rerender } = render(<AscendingBars />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(<AscendingBars aria-label="New Heights Church logo mark" />);
    expect(container.querySelector("svg")).toHaveAttribute("role", "img");
  });
});
