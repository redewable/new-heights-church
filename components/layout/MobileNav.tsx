"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { WordMark } from "@/components/brand/WordMark";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { Button } from "@/components/ui/Button";
import { PILLAR_STRIP } from "@/lib/constants/church";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Full-screen takeover on mobile with the three-pillar mark as its sign-off.
 * Desktop nav lives in <Header>; this component hides itself at `lg:` and up.
 */
export function MobileNav({ items }: { items: ReadonlyArray<NavItem> }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll + Escape-to-close while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="border-border bg-paper text-ink inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border lg:hidden"
      >
        <BurgerIcon />
      </button>

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "bg-ink text-cream fixed inset-0 z-50 flex flex-col transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <WordMark href={null} tone="cream" />
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="text-cream inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-white/20"
          >
            <CloseIcon />
          </button>
        </div>

        <nav
          aria-label="Primary mobile"
          className="flex-1 overflow-y-auto px-5 pt-2 pb-10"
        >
          <ul className="flex flex-col divide-y divide-white/10">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="font-display flex items-baseline justify-between py-4 text-3xl tracking-tight"
                >
                  {item.label}
                  <span aria-hidden="true" className="text-[color:var(--nh-gold)]">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-3">
            <AscendingBars size={24} tone="pillars" aria-label="" />
            <span className="u-eyebrow text-[color:var(--nh-gold)]">{PILLAR_STRIP}</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              href="/connect"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              Connect
            </Button>
            <Button variant="gold" href="/give">
              Give
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}

function BurgerIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 6h14M3 10h14M3 14h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
