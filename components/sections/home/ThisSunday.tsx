import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { listUpcomingEvents } from "@/lib/events/queries";
import { eventTile } from "@/lib/events/format";
import { CHURCH } from "@/lib/constants/church";

/**
 * "This Sunday" — the single most important event on the page, pinned.
 * Sunday 10 AM is the headline. Beside it, a schedule card: every row has
 * a fixed-width date tile (day or month + dates) so nothing can wrap, the
 * two standing services are always listed, and the next real events from
 * the calendar follow underneath.
 */

const MINISTRY_CHIP: Record<string, string> = {
  discipleship: "Class",
  youth: "Youth Army",
  kids: "Young Lions",
  church_wide: "Church-wide",
  conferences: "Conference",
  worship_nights: "Worship night",
  adults: "Adults",
};

export async function ThisSunday() {
  const upcoming = await listUpcomingEvents(8);
  // Drop the raffle drawing from the rail so Baby Dedications represents
  // the May 10 date — raffle stays listed on the /events page.
  const events = upcoming
    .filter((e) => e.slug !== "youth-camp-raffle-may-10")
    .slice(0, 3);
  const [sun, wed] = CHURCH.services;

  return (
    <section aria-labelledby="this-sunday" className="bg-bone py-20 md:py-28">
      <Container size="xl">
        <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
          <span aria-hidden="true" className="u-rule-gold w-12" />
          <span className="u-eyebrow">Next Sunday at the house</span>
        </div>

        <div className="mt-6 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-16">
          <div>
            <h2
              id="this-sunday"
              className="u-display-dramatic text-ink text-[clamp(2.5rem,6.2vw,5.25rem)]"
            >
              Sunday, 10 A.M.
            </h2>
            <p className="text-stone mt-5 max-w-[40ch] text-lg leading-relaxed md:text-xl">
              Worship lifts. The Word lands. The altar stays open. You do not need to know
              how to dress, sit, or sing — you need to know you&rsquo;re welcome. The
              doors open at 9:30 and we start together at ten.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="/im-new">
                Plan your visit
              </Button>
              <Button variant="ghost" size="lg" href="/about/visit">
                Map &amp; directions
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-3 text-[color:var(--nh-gold-ink)]">
              <AscendingBars size={18} aria-label="" />
              <span className="u-eyebrow">Worship · Word · Altar</span>
            </div>
          </div>

          <aside
            aria-labelledby="schedule-heading"
            className="bg-paper overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--nh-border)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[color:var(--nh-border)] px-5 py-4">
              <h3 id="schedule-heading" className="u-eyebrow text-ink">
                This week at the house
              </h3>
              <span className="u-eyebrow text-fog">Central time</span>
            </div>

            <ul className="divide-y divide-[color:var(--nh-border)]">
              <ScheduleRow
                tileTop={sun.dayOfWeek.slice(0, 3)}
                tileMain="10 AM"
                title="Sunday Morning"
                line="Worship · Word · Altar"
                href="/about/visit"
              />
              <ScheduleRow
                tileTop={wed.dayOfWeek.slice(0, 3)}
                tileMain="7 PM"
                title="Wednesday Evening"
                line="Prayer · Presence · Pouring-out"
                href="/about/visit"
              />
              {events.map((e) => {
                const tile = eventTile(e);
                const tag = (e.ministry && MINISTRY_CHIP[e.ministry]) || "Gathering";
                return (
                  <ScheduleRow
                    key={e.id}
                    tileTop={tile.month}
                    tileMain={tile.days}
                    title={e.title}
                    line={`${tag} · ${(e.location ?? "").replace(/^New Heights Church\s*·\s*/, "") || CHURCH.shortName}`}
                    href={`/events/${e.slug}`}
                    accent
                  />
                );
              })}
            </ul>

            <div className="border-t border-[color:var(--nh-border)] px-5 py-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
              >
                Full calendar <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

/**
 * One schedule row. The tile is a fixed 4.5rem block — the day or month on
 * top, the time or dates beneath — so the row's text column always starts
 * at the same x and no date ever wraps.
 */
function ScheduleRow({
  tileTop,
  tileMain,
  title,
  line,
  href,
  accent = false,
}: {
  tileTop: string;
  tileMain: string;
  title: string;
  line: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-4 px-5 py-4">
        <span
          className={
            accent
              ? "bg-ink text-cream flex w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-[var(--radius)] py-2 text-center"
              : "bg-bone text-ink flex w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-[var(--radius)] py-2 text-center"
          }
        >
          <span
            className={
              accent
                ? "u-eyebrow whitespace-nowrap text-[color:var(--nh-gold)]"
                : "u-eyebrow text-fog whitespace-nowrap"
            }
          >
            {tileTop}
          </span>
          <span className="font-display mt-0.5 text-lg leading-none font-semibold whitespace-nowrap">
            {tileMain}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-display text-ink block truncate text-lg leading-tight decoration-[color:var(--nh-gold)] decoration-2 underline-offset-4 group-hover:underline md:text-xl">
            {title}
          </span>
          <span className="text-fog mt-0.5 block truncate text-sm">{line}</span>
        </span>
        <span
          aria-hidden="true"
          className="text-fog group-hover:text-ink shrink-0 text-sm"
        >
          →
        </span>
      </Link>
    </li>
  );
}
