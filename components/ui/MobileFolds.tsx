import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface FoldItem {
  title: ReactNode;
  body: ReactNode;
  key?: string;
}

/**
 * Phone-only. A list of titles, each a tappable row that opens its body
 * beneath — so long-form content reads as a list of headings, not a wall.
 * The desktop rendering stays wherever the page already had it; wrap that
 * in `hidden md:block` and place this beside it.
 */
export function MobileFolds({
  items,
  className,
}: {
  items: ReadonlyArray<FoldItem>;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-[color:var(--nh-border)] md:hidden", className)}>
      {items.map((it, i) => (
        <details key={it.key ?? i} className="group py-4">
          <summary className="font-display text-ink flex cursor-pointer list-none items-center justify-between gap-4 text-lg leading-snug [&::-webkit-details-marker]:hidden">
            <span>{it.title}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-[color:var(--nh-gold-ink)] transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="text-stone mt-3 space-y-3 leading-relaxed">{it.body}</div>
        </details>
      ))}
    </div>
  );
}
