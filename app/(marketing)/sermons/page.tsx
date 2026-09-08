import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { SermonFilters } from "@/components/sermons/SermonFilters";
import { SermonListRow } from "@/components/sermons/SermonListRow";
import { getSermonFacets, listSermons } from "@/lib/sermons/queries";
import type { PillarTag } from "@/lib/supabase/types";

export const metadata: Metadata = buildMetadata({
  title: "Sermons",
  description:
    "The pulpit, distributed. Every word from New Heights Church — search by series, scripture, speaker, and the three pillars.",
  path: "/sermons",
});

export const revalidate = 60; // library page re-renders at most once a minute

interface Params {
  searchParams: Promise<{
    q?: string;
    pillar?: string;
    series?: string;
    speaker?: string;
    year?: string;
    sort?: string;
  }>;
}

export default async function SermonsPage({ searchParams }: Params) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const pillar = normalizePillar(sp.pillar);
  const seriesSlug = sp.series?.trim() || null;
  const speaker = sp.speaker?.trim() || null;
  const year = sp.year ? Number(sp.year) || null : null;
  const sort: "newest" | "popular" = sp.sort === "popular" ? "popular" : "newest";

  const [{ sermons, total }, facets] = await Promise.all([
    listSermons({
      q,
      pillar,
      seriesSlug: seriesSlug ?? undefined,
      speaker: speaker ?? undefined,
      year: year ?? undefined,
      sort,
      limit: 48,
    }),
    getSermonFacets(),
  ]);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Sermons", href: "/sermons" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbs) }}
      />

      {/* ---- Masthead ---- */}
      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">The pulpit, distributed</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.5rem,6vw,5.75rem)]">
            Sermons.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            Every Sunday word and Wednesday pouring-out, tagged, searchable, and ready to
            carry. Filter by the three pillars, a series, a scripture, or just the hunger
            that brought you here.
          </p>
        </Container>
      </section>

      {/* ---- Filters ---- */}
      <SermonFilters
        facets={facets}
        active={{ q, pillar, seriesSlug, speaker, year, sort }}
        resultCount={total}
      />

      {/* ---- Results ---- */}
      <Container size="xl" className="py-16 md:py-24">
        {sermons.length === 0 ? (
          <EmptyState q={q} />
        ) : (
          <div className="grid gap-14 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {sermons.map((s, i) => (
              <SermonListRow key={s.id} sermon={s} priority={i < 2} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

function EmptyState({ q }: { q: string }) {
  return (
    <div className="mx-auto max-w-[52ch] py-10 text-center">
      <AscendingBars
        size={28}
        className="mx-auto text-[color:var(--nh-gold)]"
        aria-label=""
      />
      <h2 className="u-display-dramatic text-ink mt-6 text-3xl">
        Nothing landed on that search.
      </h2>
      <p className="text-stone mt-4 text-lg">
        {q ? (
          <>
            We couldn&rsquo;t find a sermon that matched{" "}
            <strong className="text-ink">&ldquo;{q}&rdquo;</strong>. Try a broader word, a
            different pillar, or reset the filters.
          </>
        ) : (
          <>
            No sermons match that combination of filters. Clear them to see the full
            library.
          </>
        )}
      </p>
      <Link
        href="/sermons"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline"
      >
        <span aria-hidden="true">←</span> Back to the full library
      </Link>
    </div>
  );
}

function normalizePillar(p: string | undefined): PillarTag | "any" {
  if (p === "harvest" || p === "bride" || p === "habitation") return p;
  return "any";
}
