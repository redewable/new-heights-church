import { ImageResponse } from "next/og";
import { CHURCH, PILLAR_STRIP } from "@/lib/constants/church";

/**
 * Default social card (1200×630) for every page that doesn't set its own
 * `ogImage`. Ink canvas, the three-bar mark, the name in Fraunces, and the
 * tagline in gold — the same lockup as the site header, sized for a feed.
 *
 * Fraunces is fetched from Google Fonts at build time (subset to the glyphs
 * we render). If that fetch fails the card still builds with the default
 * sans face — a plain card beats a failed build.
 */
export const alt = `${CHURCH.name} — ${CHURCH.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0b1b2b";
const CREAM = "#faf7f1";
const GOLD = "#c9a227";

async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const headline = CHURCH.name;
  const tagline = CHURCH.tagline;
  const sun = CHURCH.services[0];
  const wed = CHURCH.services[1];
  const meta = `${CHURCH.address.city}, ${CHURCH.address.region}  ·  ${sun.dayOfWeek}s ${sun.time}  ·  ${wed.dayOfWeek}s ${wed.time}`;

  // Subset each face to the glyphs it renders. Fraunces also covers the
  // small lines so a failed Inter fetch degrades to one consistent face.
  const allText = `${headline}${tagline}${PILLAR_STRIP}${meta}`;
  const [fraunces, inter] = await Promise.all([
    loadGoogleFont("Fraunces:wght@600", allText),
    loadGoogleFont("Inter:wght@500", `${PILLAR_STRIP}${meta}`),
  ]);
  const smallFace = inter
    ? "Inter, sans-serif"
    : fraunces
      ? "Fraunces, serif"
      : "sans-serif";

  // Logo geometry (95 × 123) scaled.
  const s = 0.9;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: INK,
        backgroundImage:
          "radial-gradient(circle at 12% 10%, rgba(201,162,39,0.28) 0%, rgba(201,162,39,0) 45%), radial-gradient(circle at 90% 95%, rgba(29,79,139,0.35) 0%, rgba(29,79,139,0) 50%)",
        color: CREAM,
        fontFamily: fraunces ? "Fraunces, serif" : "serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5 * s }}>
        <div
          style={{ width: 20 * s, height: 60 * s, background: GOLD, borderRadius: 2 }}
        />
        <div
          style={{ width: 25 * s, height: 83 * s, background: GOLD, borderRadius: 2 }}
        />
        <div
          style={{ width: 40 * s, height: 123 * s, background: GOLD, borderRadius: 2 }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: CREAM,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: GOLD,
          }}
        >
          {tagline}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          fontFamily: smallFace,
          fontWeight: 500,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: GOLD,
          }}
        >
          {PILLAR_STRIP}
        </div>
        <div style={{ fontSize: 24, color: "rgba(250,247,241,0.72)" }}>{meta}</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        ...(fraunces
          ? [
              {
                name: "Fraunces",
                data: fraunces,
                style: "normal" as const,
                weight: 600 as const,
              },
            ]
          : []),
        ...(inter
          ? [
              {
                name: "Inter",
                data: inter,
                style: "normal" as const,
                weight: 500 as const,
              },
            ]
          : []),
      ],
    },
  );
}
