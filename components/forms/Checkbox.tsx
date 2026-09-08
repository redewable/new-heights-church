import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible checkbox with the label rendered inline. The input itself is
 * visually hidden behind a styled box so keyboard focus + SR announcement
 * match what the user sees.
 */
export function Checkbox({
  id,
  label,
  help,
  defaultChecked,
  className,
  ...rest
}: {
  id: string;
  label: ReactNode;
  help?: string;
  defaultChecked?: boolean;
} & Omit<ComponentPropsWithoutRef<"input">, "id" | "type" | "defaultChecked">) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative -m-2 flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-transparent p-2 hover:bg-[color:var(--nh-bone)]",
        className,
      )}
    >
      <input
        id={id}
        name={rest.name ?? id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          "bg-paper relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-[color:var(--nh-border)]",
          "peer-checked:border-[color:var(--nh-gold-ink)] peer-checked:bg-[color:var(--nh-gold)]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--nh-gold)] peer-focus-visible:ring-offset-2",
        )}
      >
        <svg
          className="h-3 w-3 text-[color:var(--nh-ink)] opacity-0 group-has-[:checked]:opacity-100 peer-checked:opacity-100"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1.5 6.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-ink text-sm leading-snug font-medium">{label}</span>
        {help ? <span className="text-fog text-xs">{help}</span> : null}
      </span>
    </label>
  );
}
