import Link from "next/link";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { STATION } from "@/lib/checkin/mock";
import { cn } from "@/lib/utils/cn";

/**
 * The kiosk frame: a tablet on a stand at the Young Lions desk. Ink,
 * big type, big targets, no site navigation. `tone="paper"` is the
 * volunteer-facing roster, which lives on a laptop behind the desk.
 */
export function KioskShell({
  children,
  tone = "ink",
  title = "Young Lions check-in",
}: {
  children: React.ReactNode;
  tone?: "ink" | "paper";
  title?: string;
}) {
  const ink = tone === "ink";
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col",
        ink ? "u-grain-ink text-cream" : "bg-cream text-ink",
      )}
    >
      <PreviewBanner note="Sample station and sample families. Tags don't print and nothing is recorded." />
      <header
        className={cn(
          "flex items-center justify-between border-b px-6 py-4",
          ink ? "border-white/10" : "border-[color:var(--nh-border)]",
        )}
      >
        <div className="flex items-center gap-3">
          <AscendingBars
            size={22}
            className={
              ink ? "text-[color:var(--nh-gold)]" : "text-[color:var(--nh-gold-ink)]"
            }
            aria-label=""
          />
          <span className="font-display text-lg font-semibold">{title}</span>
        </div>
        <div
          className={cn(
            "u-eyebrow flex items-center gap-4",
            ink ? "text-cream/60" : "text-fog",
          )}
        >
          <span className="hidden sm:inline">{STATION.name}</span>
          <span>{STATION.service}</span>
          <Link
            href={tone === "ink" ? "/checkin/rooms" : "/checkin"}
            className={cn(
              "tracking-normal normal-case underline-offset-4 hover:underline",
              ink ? "text-cream/70" : "text-stone",
            )}
          >
            {tone === "ink" ? "Volunteer view" : "Kiosk view"}
          </Link>
        </div>
      </header>
      <main id="main" className="flex flex-1 flex-col px-6 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
