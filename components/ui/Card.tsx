import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
  as: As = "div",
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  tone?: "paper" | "cream" | "ink";
}) {
  const toneClass =
    tone === "ink"
      ? "bg-ink text-cream border-ink-2"
      : tone === "cream"
        ? "bg-cream border-border"
        : "bg-paper border-border";
  return (
    <As
      className={cn(
        "rounded-[var(--radius-lg)] border p-6 shadow-[0_1px_0_rgba(11,27,43,0.04)] md:p-7",
        toneClass,
        className,
      )}
    >
      {children}
    </As>
  );
}
