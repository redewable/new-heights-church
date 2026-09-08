import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { CHURCH } from "@/lib/constants/church";
import type { PillarTag } from "@/lib/supabase/types";

interface FilterProps {
  facets: {
    speakers: string[];
    years: number[];
    series: { slug: string; title: string }[];
  };
  active: {
    q: string;
    pillar: PillarTag | "any";
    seriesSlug: string | null;
    speaker: string | null;
    year: number | null;
    sort: "newest" | "popular";
  };
  resultCount: number;
}

const PILLARS: ReadonlyArray<{ key: PillarTag | "any"; label: string }> = [
  { key: "any", label: "All pillars" },
  ...CHURCH.pillars.map((p) => ({ key: p.key, label: p.label })),
];

/**
 * Server-rendered filter bar. Uses a GET form so filters are bookmarkable
 * and back-button-friendly; no client-side framework required. The "clear
 * filter" chips are ordinary `<a>` tags that navigate.
 *
 * Layout: one column on phones, two on tablets (search spans both), and
 * the full single row from `lg` up. Selects are allowed to shrink so the
 * row never pushes past the viewport.
 */
export function SermonFilters({ facets, active, resultCount }: FilterProps) {
  return (
    <section
      aria-label="Filter sermons"
      className="border-y border-[color:var(--nh-border)] bg-[color:var(--nh-bone)] py-8"
    >
      <Container size="xl" className="flex flex-col gap-6">
        <form
          method="get"
          action="/sermons"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]"
        >
          <label className="sr-only" htmlFor="q">
            Search sermons
          </label>
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Search by title, verse, or topic"
            defaultValue={active.q}
            className="focus-visible:border-ink bg-paper text-ink placeholder:text-fog h-12 min-w-0 rounded-[var(--radius)] border border-[color:var(--nh-border)] px-4 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nh-gold)] sm:col-span-2 lg:col-span-1"
          />

          <FilterSelect
            name="series"
            defaultValue={active.seriesSlug ?? ""}
            label="Series"
            options={[
              { value: "", label: "All series" },
              ...facets.series.map((s) => ({ value: s.slug, label: s.title })),
            ]}
          />
          <FilterSelect
            name="speaker"
            defaultValue={active.speaker ?? ""}
            label="Speaker"
            options={[
              { value: "", label: "All speakers" },
              ...facets.speakers.map((s) => ({ value: s, label: s })),
            ]}
          />
          <FilterSelect
            name="year"
            defaultValue={active.year ? String(active.year) : ""}
            label="Year"
            options={[
              { value: "", label: "Any year" },
              ...facets.years.map((y) => ({ value: String(y), label: String(y) })),
            ]}
          />

          <button
            type="submit"
            className="bg-ink text-cream hover:bg-ink-2 h-12 rounded-[var(--radius-sm)] px-5 text-sm font-semibold"
          >
            Apply
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap items-center gap-2" aria-label="Pillar filter">
            {PILLARS.map((p) => (
              <li key={p.key}>
                <PillarChip
                  pillar={p.key}
                  label={p.label}
                  active={active.pillar === p.key}
                  href={buildHref(active, { pillar: p.key })}
                />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="u-eyebrow text-fog">
              {resultCount} {resultCount === 1 ? "sermon" : "sermons"}
            </span>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <SortToggle active={active} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function FilterSelect({
  name,
  defaultValue,
  label,
  options,
}: {
  name: string;
  defaultValue: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="focus-visible:border-ink bg-paper text-ink h-12 w-full min-w-0 rounded-[var(--radius)] border border-[color:var(--nh-border)] px-4 pr-9 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nh-gold)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PillarChip({
  pillar,
  label,
  active,
  href,
}: {
  pillar: PillarTag | "any";
  label: string;
  active: boolean;
  href: string;
}) {
  const swatch =
    pillar === "harvest"
      ? "bg-[color:var(--nh-scarlet)]"
      : pillar === "bride"
        ? "bg-[color:var(--nh-purple)]"
        : pillar === "habitation"
          ? "bg-[color:var(--nh-blue)]"
          : "bg-[color:var(--nh-fog)]";
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-colors",
        active
          ? "bg-ink text-cream border-ink"
          : "bg-paper text-ink border-[color:var(--nh-border)] hover:border-[color:var(--nh-ink)]",
      )}
    >
      {pillar !== "any" ? (
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", swatch)} />
      ) : null}
      {label}
    </Link>
  );
}

function SortToggle({ active }: { active: FilterProps["active"] }) {
  return (
    <div
      role="group"
      aria-label="Sort sermons"
      className="inline-flex overflow-hidden rounded-[var(--radius-sm)] border border-[color:var(--nh-border)]"
    >
      <SortPill
        href={buildHref(active, { sort: "newest" })}
        active={active.sort === "newest"}
      >
        Newest
      </SortPill>
      <SortPill
        href={buildHref(active, { sort: "popular" })}
        active={active.sort === "popular"}
      >
        Most-watched
      </SortPill>
    </div>
  );
}

function SortPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-9 items-center px-3 text-xs font-semibold",
        active ? "bg-ink text-cream" : "bg-paper text-ink hover:bg-bone",
      )}
    >
      {children}
    </Link>
  );
}

function buildHref(
  active: FilterProps["active"],
  patch: Partial<FilterProps["active"]>,
): string {
  const params = new URLSearchParams();
  const merged = { ...active, ...patch };
  if (merged.q) params.set("q", merged.q);
  if (merged.pillar && merged.pillar !== "any") params.set("pillar", merged.pillar);
  if (merged.seriesSlug) params.set("series", merged.seriesSlug);
  if (merged.speaker) params.set("speaker", merged.speaker);
  if (merged.year) params.set("year", String(merged.year));
  if (merged.sort === "popular") params.set("sort", "popular");
  const qs = params.toString();
  return qs ? `/sermons?${qs}` : "/sermons";
}
