import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "scarlet";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** If set, renders as a `next/link`. */
  href?: string;
  /** For external links. */
  external?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] transition-colors duration-150 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--nh-gold)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-ink-2",
  secondary: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-cream",
  ghost: "bg-transparent text-ink hover:bg-bone",
  gold: "bg-[color:var(--nh-gold)] text-ink hover:bg-[color:var(--nh-gold-ink)] hover:text-cream",
  scarlet: "bg-scarlet text-cream hover:bg-[color:var(--nh-scarlet-ink)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base tracking-wide",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...rest
}: BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps>) {
  const cls = cn(BASE, VARIANTS[variant], SIZES[size], className);
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          {...(rest as ComponentPropsWithoutRef<"a">)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      {...(rest as ComponentPropsWithoutRef<"button">)}
    >
      {children}
    </button>
  );
}
