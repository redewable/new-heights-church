import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Form field wrapper. Label on top, input slot, optional help text, and
 * inline error. Error is rendered as an aria-live region so screen readers
 * announce validation failures without a page re-focus.
 *
 * We put the error under the input, not above, because that's where the
 * eye lands after failing to submit — and the screen-reader announcement
 * makes ordering moot.
 */

export interface FieldProps {
  id: string;
  label: string;
  /** When true, the input collects a required value. Adds a "required" chip. */
  required?: boolean;
  /** Short help sentence shown under the label. */
  help?: string;
  /** Single error string. When provided, renders in aria-live and colors the field. */
  error?: string;
  /** Visually hide the label (still read by assistive tech). */
  labelHidden?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  required,
  help,
  error,
  labelHidden,
  children,
  className,
}: FieldProps) {
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-ink flex items-baseline justify-between gap-3 text-sm font-semibold",
          labelHidden && "sr-only",
        )}
      >
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="u-eyebrow text-fog">
            Required
          </span>
        ) : null}
      </label>
      {help && !labelHidden ? (
        <p id={`${id}-help`} className="text-fog -mt-1 text-sm">
          {help}
        </p>
      ) : null}
      <div data-described-by={describedBy || undefined} className="mt-auto">
        {children}
      </div>
      <p
        id={`${id}-error`}
        role={error ? "alert" : undefined}
        aria-live="polite"
        className={cn(
          "text-sm",
          error ? "text-[color:var(--nh-scarlet-ink)]" : "sr-only",
        )}
      >
        {error ?? ""}
      </p>
    </div>
  );
}

/** Inputs share this shell so focus, error, and filled states render consistently. */
export function inputBaseClasses(hasError?: boolean) {
  return cn(
    "w-full rounded-[var(--radius)] border px-4 py-3 text-base text-ink placeholder:text-fog",
    "bg-paper outline-none transition-colors",
    "focus-visible:border-[color:var(--nh-ink)] focus-visible:ring-2 focus-visible:ring-[color:var(--nh-gold)]",
    hasError
      ? "border-[color:var(--nh-scarlet)] bg-[color:var(--nh-scarlet-soft)]/40"
      : "border-[color:var(--nh-border)]",
  );
}
