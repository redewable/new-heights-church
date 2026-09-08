/**
 * The strip that sits on every preview surface (admin, member portal,
 * check-in) until the feature is wired to real data and real sign-in.
 */
export function PreviewBanner({ note }: { note?: string }) {
  return (
    <div
      role="status"
      className="text-ink flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[color:var(--nh-gold)] px-4 py-2 text-center text-xs font-semibold"
    >
      <span className="u-eyebrow">Preview build</span>
      <span className="opacity-80">
        {note ?? "Mock data. Nothing on these screens saves, sends, or syncs yet."}
      </span>
    </div>
  );
}
