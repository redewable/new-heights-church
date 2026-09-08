import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { EventMinistry } from "@/lib/supabase/types";

const MINISTRIES: ReadonlyArray<{ key: EventMinistry | "any"; label: string }> = [
  { key: "any", label: "Everything" },
  { key: "church_wide", label: "Church-wide" },
  { key: "worship_nights", label: "Worship nights" },
  { key: "conferences", label: "Conferences" },
  { key: "discipleship", label: "Discipleship" },
  { key: "youth", label: "Youth Army" },
  { key: "kids", label: "Young Lions" },
  { key: "adults", label: "Adults" },
];

export function MinistryFilter({
  active,
  resultCount,
}: {
  active: EventMinistry | "any";
  resultCount: number;
}) {
  return (
    <section
      aria-label="Filter events by ministry"
      className="border-y border-[color:var(--nh-border)] bg-[color:var(--nh-bone)] py-6"
    >
      <div className="mx-auto flex w-full max-w-[82.5rem] flex-col gap-4 px-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <ul className="flex flex-wrap items-center gap-2" aria-label="Ministry filter">
          {MINISTRIES.map((m) => (
            <li key={m.key}>
              <Link
                href={m.key === "any" ? "/events" : `/events?ministry=${m.key}`}
                aria-current={active === m.key ? "true" : undefined}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  active === m.key
                    ? "bg-ink text-cream border-ink"
                    : "bg-paper text-ink border-[color:var(--nh-border)] hover:border-[color:var(--nh-ink)]",
                )}
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className="u-eyebrow text-fog shrink-0">
          {resultCount} {resultCount === 1 ? "event" : "events"} ahead
        </span>
      </div>
    </section>
  );
}
