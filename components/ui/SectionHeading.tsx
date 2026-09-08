import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Marketing-section heading with a kicker label and optional lead paragraph.
 * The kicker uses mono-style tracking to look like a chapter marker.
 */
export function SectionHeading({
  kicker,
  title,
  lead,
  align = "left",
  tone = "ink",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "cream";
  className?: string;
}) {
  const color = tone === "cream" ? "text-cream" : "text-ink";
  const muted = tone === "cream" ? "text-fog" : "text-stone";
  return (
    <div
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}
    >
      {kicker ? (
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase",
            tone === "cream"
              ? "text-[color:var(--nh-gold)]"
              : "text-[color:var(--nh-gold-ink)]",
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-[color:var(--nh-gold)]" />
          {kicker}
        </div>
      ) : null}
      <h2 className={cn("font-display", color)}>{title}</h2>
      {lead ? (
        <p className={cn("mt-4 text-lg leading-relaxed md:text-xl", muted)}>{lead}</p>
      ) : null}
    </div>
  );
}
