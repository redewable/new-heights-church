import { ImageResponse } from "next/og";

/**
 * Apple touch icon (180×180) — the three-bar mark on ink. Generated at
 * build so it always matches the SVG favicon in `app/icon.svg`.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const INK = "#0b1b2b";
const GOLD = "#c9a227";

export default function AppleIcon() {
  // Logo geometry (95 × 123) scaled to ~110px wide.
  const s = 1.16;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: INK,
        paddingBottom: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5 * s }}>
        <div
          style={{ width: 20 * s, height: 60 * s, background: GOLD, borderRadius: 3 }}
        />
        <div
          style={{ width: 25 * s, height: 83 * s, background: GOLD, borderRadius: 3 }}
        />
        <div
          style={{ width: 40 * s, height: 123 * s, background: GOLD, borderRadius: 3 }}
        />
      </div>
    </div>,
    size,
  );
}
