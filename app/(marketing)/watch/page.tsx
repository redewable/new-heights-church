import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { LiveStatusPoller } from "@/components/watch/LiveStatusPoller";
import { SermonListRow } from "@/components/sermons/SermonListRow";
import { getLivestreamStatus } from "@/lib/youtube/livestream";
import { listSermons } from "@/lib/sermons/queries";

export const metadata: Metadata = buildMetadata({
  title: "Watch",
  description:
    "Watch New Heights Church live every Sunday at 10 AM and Wednesday at 7 PM Central. When the stream goes up, this page turns on.",
  path: "/watch",
});

// Poll the server side every 60s so the initial paint has the current state.
// The client-side poller takes over from there.
export const revalidate = 60;

export default async function WatchPage() {
  const [status, latest] = await Promise.all([
    getLivestreamStatus(),
    listSermons({ sort: "newest", limit: 4 }),
  ]);

  const initial =
    status.live && status.videoId
      ? { state: "live" as const, videoId: status.videoId, title: status.title }
      : status.source === "no-env"
        ? { state: "unavailable" as const }
        : { state: "offline" as const };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Watch", href: "/watch" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbs) }}
      />

      <LiveStatusPoller initial={initial} />

      {latest.sermons.length > 0 ? (
        <section className="bg-cream py-20 md:py-28">
          <Container size="xl">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Catch up</p>
                <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                  Recent words from the house.
                </h2>
              </div>
              <Link
                href="/sermons"
                className="hidden text-sm font-semibold text-[color:var(--nh-scarlet-ink)] hover:underline sm:inline-flex"
              >
                Full library →
              </Link>
            </div>

            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14">
              {latest.sermons.map((s, i) => (
                <SermonListRow key={s.id} sermon={s} size="sm" priority={i === 0} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
