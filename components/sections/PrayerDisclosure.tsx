"use client";

import { useId, useState, type ReactNode } from "react";
import { CHURCH } from "@/lib/constants/church";
import { cn } from "@/lib/utils/cn";

/**
 * "How do I pray?" — a button that opens the prayer of salvation, word for
 * word, in a panel beneath the CTA row. `before` lets a server component
 * pass the other buttons so they share one row with this toggle.
 */
export function PrayerDisclosure({
  tone = "cream",
  before,
  className,
}: {
  tone?: "cream" | "ink";
  /** Buttons rendered to the left of the toggle, in the same row. */
  before?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ink = tone === "ink";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {before}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "inline-flex h-13 items-center gap-2 rounded-[var(--radius-sm)] border px-7 text-base font-semibold tracking-wide transition-colors",
            ink
              ? "text-cream hover:bg-cream hover:text-ink border-white/40"
              : "text-ink border-ink hover:bg-ink hover:text-cream",
          )}
        >
          How do I pray?
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            className={cn("transition-transform", open && "rotate-180")}
          >
            <path
              d="M4 7l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "mt-5 rounded-[var(--radius-lg)] border-l-4 border-[color:var(--nh-scarlet)] p-6 md:p-8",
          ink
            ? "border-y border-r border-white/10 bg-white/[0.04]"
            : "bg-paper shadow-[0_1px_0_rgba(11,27,43,0.04)]",
        )}
      >
        <p
          className={cn(
            "u-eyebrow",
            ink ? "text-[color:var(--nh-gold)]" : "text-[color:var(--nh-scarlet-ink)]",
          )}
        >
          Pray this out loud, and mean it
        </p>
        <blockquote
          className={cn(
            "u-display-soft mt-4 max-w-[40ch] text-xl leading-snug md:text-2xl",
            ink ? "text-cream" : "text-ink",
          )}
        >
          &ldquo;{CHURCH.salvationPrayer}&rdquo;
        </blockquote>
        <p className={cn("mt-5 text-sm", ink ? "text-cream/70" : "text-stone")}>
          If you prayed that and meant it, you are saved. Tell us — we want to stand with
          you.
        </p>
      </div>
    </div>
  );
}
