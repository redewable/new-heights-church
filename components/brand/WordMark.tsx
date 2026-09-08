import Link from "next/link";
import { AscendingBars } from "./AscendingBars";
import { cn } from "@/lib/utils/cn";

/**
 * New Heights wordmark — the three-bar mark + "new heights" in Fraunces.
 * Until the Church ships final SVG logo files this is the system-default
 * lockup. Swap for the SVG in `public/brand/logo.svg` once delivered.
 */
export function WordMark({
  href = "/",
  tone = "ink",
  size = "md",
  className,
}: {
  href?: string | null;
  tone?: "ink" | "cream";
  size?: "sm" | "md";
  className?: string;
}) {
  const color = tone === "cream" ? "text-cream" : "text-ink";
  const bars =
    tone === "cream" ? "text-[color:var(--nh-gold)]" : "text-[color:var(--nh-gold-ink)]";
  const content = (
    <span
      className={cn(
        "inline-flex items-center",
        size === "md" ? "gap-3" : "gap-2.5",
        color,
        className,
      )}
    >
      <AscendingBars
        size={size === "md" ? 30 : 24}
        className={bars}
        aria-label="New Heights Church logo mark"
      />
      <span
        className={cn(
          "font-display leading-none font-semibold tracking-tight",
          size === "md" ? "text-[1.45rem]" : "text-xl",
        )}
      >
        <span className="sr-only">New Heights Church</span>
        <span aria-hidden="true">
          <span className="font-display">new</span>
          <span className="font-display font-bold"> heights</span>
        </span>
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link
      href={href}
      aria-label="New Heights Church home"
      className="inline-flex items-center"
    >
      {content}
    </Link>
  );
}
