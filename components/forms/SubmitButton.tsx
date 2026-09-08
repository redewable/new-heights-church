"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Submit button wired to the enclosing form's `useFormStatus`. Disables
 * itself + swaps to the pending label while the Server Action runs. Pair
 * with a Server-Action-driven form (`<form action={action}>`).
 */
export function SubmitButton({
  children,
  pendingLabel = "Sending…",
  variant = "primary",
  size = "lg",
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "gold" | "scarlet";
  size?: "md" | "lg";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--nh-gold)] disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    primary: "bg-ink text-cream hover:bg-ink-2",
    gold: "bg-[color:var(--nh-gold)] text-ink hover:bg-[color:var(--nh-gold-ink)] hover:text-cream",
    scarlet:
      "bg-[color:var(--nh-scarlet)] text-cream hover:bg-[color:var(--nh-scarlet-ink)]",
  };
  const sizes = {
    md: "h-11 px-5 text-[0.95rem]",
    lg: "h-13 px-7 text-base tracking-wide",
  };
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {pending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
