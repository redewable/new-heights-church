import { cn } from "@/lib/utils/cn";
import type { PillarKey } from "@/lib/constants/church";

/**
 * The New Heights mark — three bars ascending. Traced from the Church's
 * logo: each bar rises and widens toward the right. Three, never four:
 * the bars are the three pillars in order — Endtime Harvest → Preparation
 * → Habitation.
 *
 * Renders as inline SVG so it scales cleanly at any size and can carry
 * either a single color (`currentColor`, the default), the three pillar
 * colors in canonical order (`tone="pillars"`), or one pillar lit in its
 * color with the other two ghosted (`highlight`).
 *
 * `size` is the overall height in px (default 32). Width follows the
 * logo's aspect ratio. Override with `className` (e.g. `h-40 w-auto`) for
 * fluid sizes.
 */

const VIEW_W = 95;
const VIEW_H = 123;

const BARS = [
  { x: 0, y: 63, w: 20, h: 60, pillar: "harvest" },
  { x: 25, y: 40, w: 25, h: 83, pillar: "bride" },
  { x: 55, y: 0, w: 40, h: 123, pillar: "habitation" },
] as const;

export function AscendingBars({
  size = 32,
  tone = "current",
  highlight,
  className,
  "aria-label": ariaLabel,
}: {
  size?: number;
  /** `current` inherits text color; `pillars` paints scarlet / purple / blue. */
  tone?: "current" | "pillars";
  /** Light one pillar's bar in its color and ghost the other two. */
  highlight?: PillarKey;
  className?: string;
  "aria-label"?: string;
}) {
  const width = Math.round((size * VIEW_W) / VIEW_H);
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={width}
      height={size}
      className={cn("inline-block shrink-0 align-middle", className)}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel || undefined}
      role={ariaLabel ? "img" : undefined}
      focusable="false"
    >
      {BARS.map((b) => {
        const lit = highlight ? b.pillar === highlight : true;
        const fill =
          tone === "pillars" || (highlight && lit)
            ? `var(--nh-${b.pillar})`
            : "currentColor";
        return (
          <rect
            key={b.pillar}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={2}
            fill={fill}
            fillOpacity={lit ? 1 : 0.14}
          />
        );
      })}
    </svg>
  );
}
