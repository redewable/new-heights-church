"use client";

import Link from "next/link";
import { useConsent } from "./ConsentProvider";

/**
 * Cookie consent banner. Renders only while consent is "pending" — once
 * the user has made a choice the banner disappears until they clear
 * their browser data. Two buttons, no dark pattern; equal visual weight
 * so "Only essential" isn't hidden.
 *
 * Fixed to the bottom on all viewports, responsive to reduced motion
 * (no slide-up animation), and includes a link to the privacy policy so
 * the user can read what they're agreeing to.
 */
export function ConsentBanner() {
  const { state, accept, essentialOnly } = useConsent();

  if (state.choice !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="bg-ink text-cream fixed inset-x-0 bottom-0 z-50 border-t border-white/10 shadow-[0_-8px_40px_rgba(11,27,43,0.45)]"
    >
      <div className="mx-auto flex w-full max-w-[82.5rem] flex-col gap-5 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10 md:py-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--nh-gold)]"
          />
          <p className="text-cream/90 max-w-[60ch] text-sm leading-relaxed">
            We use a small amount of essential cookies to make the site work. With your
            permission we also use analytics to understand how the site is used — we never
            sell or share that data. See our{" "}
            <Link
              href="/legal/privacy"
              className="font-semibold text-[color:var(--nh-gold)] underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={essentialOnly}
            className="text-cream hover:bg-cream hover:text-ink inline-flex h-11 items-center rounded-[var(--radius-sm)] border border-white/40 px-5 text-sm font-semibold"
          >
            Only essential
          </button>
          <button
            type="button"
            onClick={accept}
            className="text-ink hover:text-cream inline-flex h-11 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-5 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
