"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItemClass } from "./NavLink";
import type { NavChild } from "./nav";
import { cn } from "@/lib/utils/cn";

/**
 * A primary-nav item that opens a panel of section pages. Opens on hover
 * and on click; closes on Escape, on a pointer outside it, when focus
 * leaves it, or when a page is chosen. The gold underline marks the section
 * active whenever the current route lives under `href`.
 */
export function NavMenu({
  label,
  href,
  items,
}: {
  label: string;
  href: string;
  items: ReadonlyArray<NavChild>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const hovering = useRef(false);
  const active = pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  function show() {
    hovering.current = true;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    hovering.current = false;
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }
  function close() {
    setOpen(false);
  }

  const primary = items.filter((i) => !i.secondary);
  const secondary = items.filter((i) => i.secondary);

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        // Hover already opened it for a mouse; the click must not close it.
        // Keyboard and touch users get a real toggle.
        onClick={() => setOpen((o) => (hovering.current ? true : !o))}
        className={cn(navItemClass(active), "gap-1.5")}
      >
        {label}
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={cn("transition-transform duration-200", open && "rotate-180")}
        >
          <path
            d="M2 3.5l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-1/2 z-50 w-[22rem] -translate-x-1/2 pt-3"
      >
        <div className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-2 shadow-[0_28px_60px_-28px_rgba(11,27,43,0.45)]">
          <ul className="flex flex-col">
            {primary.map((item) => {
              const here =
                pathname === item.href ||
                (item.href !== href && pathname.startsWith(`${item.href}/`));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "group flex items-start gap-3 rounded-[var(--radius-sm)] px-3 py-3 transition-colors hover:bg-[color:var(--nh-bone)]",
                      here && "bg-[color:var(--nh-bone)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-2 block h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                        here
                          ? "bg-[color:var(--nh-gold)]"
                          : "bg-[color:var(--nh-border)] group-hover:bg-[color:var(--nh-gold)]",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="text-ink block text-[0.95rem] font-semibold">
                        {item.label}
                      </span>
                      {item.note ? (
                        <span className="text-stone mt-0.5 block text-sm leading-snug">
                          {item.note}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {secondary.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 border-t border-[color:var(--nh-border)] px-3 pt-3 pb-1">
              {secondary.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="u-eyebrow hover:text-ink text-[color:var(--nh-gold-ink)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
