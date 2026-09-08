import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { cn } from "@/lib/utils/cn";

/**
 * Section wrapper used by every engagement form. Gives each flow a
 * consistent editorial header (kicker → display title → lead) and a
 * prose-width content column. The `tone` knob lets the sacred flows
 * (decision capture) run on the ink canvas with altar-glow motion.
 *
 * `as` picks the heading level. Default `h1` for pages where the form IS
 * the page; pass `h2` when the page already has a hero H1 above it.
 */
export function FormShell({
  kicker,
  title,
  lead,
  children,
  tone = "cream",
  as: Heading = "h1",
  className,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  tone?: "cream" | "ink" | "altar";
  as?: "h1" | "h2";
  className?: string;
}) {
  const wrap =
    tone === "ink"
      ? "bg-ink text-cream u-grain-ink"
      : tone === "altar"
        ? "bg-cream motif-altar-glow"
        : "bg-cream";

  const titleColor = tone === "ink" ? "text-cream" : "text-ink";
  const leadColor = tone === "ink" ? "text-cream/80" : "text-stone";
  const kickerColor =
    tone === "ink" ? "text-[color:var(--nh-gold)]" : "text-[color:var(--nh-gold-ink)]";

  return (
    <section className={cn("relative overflow-hidden py-20 md:py-28", wrap, className)}>
      <Container size="prose">
        <div className={cn("flex items-center gap-4", kickerColor)}>
          <AscendingBars size={20} aria-label="" />
          <span className="u-eyebrow">{kicker}</span>
        </div>
        <Heading
          className={cn(
            "u-display-dramatic mt-6 text-[clamp(2.25rem,5vw,4rem)]",
            titleColor,
          )}
        >
          {title}
        </Heading>
        {lead ? (
          <p
            className={cn(
              "mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl",
              leadColor,
            )}
          >
            {lead}
          </p>
        ) : null}
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  );
}

/**
 * Announcement banner rendered above a form when the server action returns
 * an `error` or `success` status. Non-field-level feedback lives here.
 */
export function FormNotice({
  variant,
  title,
  children,
}: {
  variant: "error" | "success";
  title: string;
  children?: ReactNode;
}) {
  const style =
    variant === "success"
      ? "bg-[color:var(--nh-gold-soft)] border-[color:var(--nh-gold)] text-[color:var(--nh-gold-ink)]"
      : "bg-[color:var(--nh-scarlet-soft)] border-[color:var(--nh-scarlet)] text-[color:var(--nh-scarlet-ink)]";
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "rounded-[var(--radius-lg)] border-l-4 px-5 py-4",
        "border-y border-r border-y-transparent border-r-transparent",
        style,
      )}
    >
      <p className="font-display text-lg leading-tight">{title}</p>
      {children ? <div className="mt-2 text-sm opacity-90">{children}</div> : null}
    </div>
  );
}
