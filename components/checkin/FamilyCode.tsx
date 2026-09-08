import { AscendingBars } from "@/components/brand/AscendingBars";

/**
 * The household's check-in code, set like a boarding pass: big enough to
 * read across a desk, with a scannable pattern. The pattern is decorative
 * in the preview; the real one is a QR that encodes the code.
 */
export function FamilyCode({ code, name }: { code: string; name: string }) {
  return (
    <div className="u-grain-ink text-cream overflow-hidden rounded-[var(--radius-lg)]">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <AscendingBars
            size={18}
            className="text-[color:var(--nh-gold)]"
            aria-label=""
          />
          <span className="u-eyebrow text-[color:var(--nh-gold)]">
            Young Lions · family code
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-5 px-5 pt-4 pb-6">
        <div>
          <p className="font-mono text-4xl font-semibold tracking-[0.12em]">{code}</p>
          <p className="text-cream/70 mt-2 text-sm">{name}</p>
          <p className="text-cream/50 mt-3 text-xs">
            Show this at the desk, or scan it at the kiosk.
          </p>
        </div>
        <QrPattern seed={code} />
      </div>
    </div>
  );
}

/** Deterministic 11×11 pattern from the code — looks like a QR, isn't one yet. */
function QrPattern({ seed }: { seed: string }) {
  const n = 11;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push(((h >>> 16) & 1) === 1);
  }
  const finder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= n - 3) || (r >= n - 3 && c < 3);
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${n} ${n}`}
      width="96"
      height="96"
      className="rounded-[var(--radius-sm)] bg-[color:var(--nh-cream)] p-1"
      shapeRendering="crispEdges"
    >
      {cells.map((on, i) => {
        const r = Math.floor(i / n);
        const c = i % n;
        const dark = finder(r, c)
          ? (r % 2 === 0 || c % 2 === 0) && !(r === 1 && c === 1)
          : on;
        return dark ? (
          <rect key={i} x={c} y={r} width={1} height={1} fill="#0b1b2b" />
        ) : null;
      })}
    </svg>
  );
}
