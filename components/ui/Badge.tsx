import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone =
  | "ink"
  | "cream"
  | "gold"
  | "scarlet"
  | "purple"
  | "blue"
  | "silver"
  | "bronze";

const TONES: Record<Tone, string> = {
  ink: "bg-ink text-cream",
  cream: "bg-bone text-ink",
  gold: "bg-[color:var(--nh-gold-soft)] text-[color:var(--nh-gold-ink)]",
  scarlet: "bg-[color:var(--nh-scarlet-soft)] text-[color:var(--nh-scarlet-ink)]",
  purple: "bg-[color:var(--nh-purple-soft)] text-[color:var(--nh-purple-ink)]",
  blue: "bg-[color:var(--nh-blue-soft)] text-[color:var(--nh-blue-ink)]",
  silver: "bg-[color:var(--nh-silver-soft)] text-[color:var(--nh-silver-ink)]",
  bronze: "bg-[color:var(--nh-bronze-soft)] text-[color:var(--nh-bronze-ink)]",
};

export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-[0.08em] uppercase",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
