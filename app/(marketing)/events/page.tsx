import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { EventCard } from "@/components/events/EventCard";
import { MinistryFilter } from "@/components/events/MinistryFilter";
import { listEvents } from "@/lib/events/queries";
import type { EventMinistry } from "@/lib/supabase/types";

export const metadata: Metadata = buildMetadata({
  title: "Events",
  description:
    "What's happening at New Heights Church — classes, conferences, worship nights, Youth Army camp, and the next Sunday altar.",
  path: "/events",
});

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ ministry?: string }>;
}

function normalizeMinistry(m: string | undefined): EventMinistry | "any" {
  if (!m) return "any";
  const allowed: EventMinistry[] = [
    "kids",
    "youth",
    "adults",
    "church_wide",
    "conferences",
    "worship_nights",
    "discipleship",
  ];
  return (allowed as string[]).includes(m) ? (m as EventMinistry) : "any";
}

export default async function EventsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ministry = normalizeMinistry(sp.ministry);

  const { events, total } = await listEvents({
    ministry,
    upcoming: true,
    limit: 60,
  });

  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      {/* ---- Hero ---- */}
      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">On the calendar</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.75rem,6.5vw,6rem)]">
            Events.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            Classes, conferences, worship nights, Youth Army camp, and everything in
            between.
            <span className="hidden md:inline">
              {" "}
              The Sunday altar is always the main event — but a lot happens around it.
            </span>
          </p>
        </Container>
      </section>

      {/* ---- Filter bar ---- */}
      <MinistryFilter active={ministry} resultCount={total} />

      {/* ---- Event list ---- */}
      <Container size="xl" className="py-10 md:py-14">
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-[color:var(--nh-border)]">
            {events.map((e, i) => (
              <EventCard key={e.id} event={e} priority={i < 2} size="md" />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-[52ch] py-20 text-center">
      <AscendingBars
        size={28}
        className="mx-auto text-[color:var(--nh-gold)]"
        aria-label=""
      />
      <h2 className="u-display-dramatic text-ink mt-6 text-3xl">
        Nothing on the board for this filter.
      </h2>
      <p className="text-stone mt-4 text-lg">
        Sunday at 10 AM is always on. Clear the filter to see everything coming up.
      </p>
      <Link
        href="/events"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline"
      >
        <span aria-hidden="true">←</span> Full calendar
      </Link>
    </div>
  );
}
