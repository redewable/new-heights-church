import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { getEventBySlug } from "@/lib/events/queries";
import { eventDateLong } from "@/lib/events/format";

export const metadata: Metadata = buildMetadata({
  title: "Youth Army",
  description:
    "Youth Army is the student ministry at New Heights Church — worship, word, camps, and the kind of friendships that build a generation.",
  path: "/youth",
});

const YOUTH_RAFFLE_URL = "https://newheightschurch.info/new-heights-youth-raffle/";

export default async function YouthPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Youth Army", href: "/youth" },
  ]);

  const camp = await getEventBySlug("youth-camp-encounter");
  const raffleDrawing = await getEventBySlug("youth-camp-raffle-may-10");

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
            <span className="u-eyebrow">Student ministry · Grades 6–12</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.75rem,7vw,6.5rem)]">
            Youth Army.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            This is not a watered-down version of church. Youth Army is worship, word, and
            altar for 6th through 12th grade — same Spirit, same seriousness, same
            expectation that Jesus will show up.
          </p>
        </Container>
      </section>

      {/* ---- Camp pin ---- */}
      {camp ? (
        <section className="bg-cream py-20 md:py-24">
          <Container size="xl">
            <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
              This year&rsquo;s camp
            </p>
            <div className="mt-6 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
              <div>
                <h2 className="u-display-dramatic text-ink text-[clamp(2rem,5vw,3.75rem)]">
                  {camp.title}
                </h2>
                <p className="text-stone mt-5 max-w-[44ch] text-lg leading-relaxed md:text-xl">
                  {camp.description}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {camp.registration_url ? (
                    <Button
                      variant="gold"
                      size="lg"
                      href={camp.registration_url}
                      external
                    >
                      Register on Church Center
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="lg" href={`/events/${camp.slug}`}>
                    Full event details
                  </Button>
                </div>
              </div>

              <aside className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 md:p-8">
                <p className="u-eyebrow text-fog">When</p>
                <p className="u-display-soft text-ink mt-3 text-[clamp(1.5rem,3vw,2rem)] leading-tight">
                  {eventDateLong(camp.start_at)}
                  {camp.end_at
                    ? ` – ${eventDateLong(camp.end_at).replace(/^\w+, /, "")}`
                    : ""}
                </p>
                {camp.time_note ? (
                  <p className="text-fog mt-2 text-sm">{camp.time_note}</p>
                ) : null}
                <hr className="my-6 border-[color:var(--nh-border)]" />
                <p className="u-eyebrow text-fog">Where</p>
                <p className="text-ink mt-2">{camp.location ?? "Off-site"}</p>
              </aside>
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---- Raffle ---- */}
      {raffleDrawing ? (
        <section className="bg-ink text-cream py-20 md:py-24">
          <Container size="xl">
            <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
              <div>
                <p className="u-eyebrow text-[color:var(--nh-gold)]">Camp raffle</p>
                <h2 className="u-display-dramatic text-cream mt-4 text-[clamp(1.75rem,4.5vw,3rem)]">
                  One camper goes free.
                </h2>
                <p className="text-cream/80 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
                  Every year we raffle off a full scholarship to Youth Camp — no-cost,
                  no-strings. Enter through the link; winner announced live at the Sunday
                  service on {eventDateLong(raffleDrawing.start_at)}.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <Button variant="gold" size="lg" href={YOUTH_RAFFLE_URL} external>
                  Enter the raffle
                </Button>
                <p className="text-cream/55 text-xs">
                  Opens on newheightschurch.info — raffle migrates to the new site next
                  phase.
                </p>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---- Weekly rhythm ---- */}
      <section className="py-20 md:py-28">
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Weekly</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            Youth meets with the house.
          </h2>
          <p className="text-ink mt-8 text-lg leading-relaxed md:text-xl">
            Youth Army worships + receives with the whole Church on Sundays and
            Wednesdays, and gathers separately for retreats, encounter weekends, and Youth
            Camp each summer. Students sit in main service — we don&rsquo;t pull them out
            for a separate track every week. They need the whole house as much as the
            whole house needs them.
          </p>
          <p className="text-stone mt-6 text-lg italic">
            &ldquo;Let no one despise you for your youth, but set the believers an
            example.&rdquo; — 1 Timothy 4:12
          </p>
        </Container>
      </section>

      {/* ---- Parents ---- */}
      <section className="bg-[color:var(--nh-bone)] py-20 md:py-24">
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">For parents</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            We work with you, not around you.
          </h2>
          <p className="text-ink mt-8 leading-relaxed md:text-xl">
            Every Youth Army leader is background-checked. Every trip has parent consent
            forms. Every teaching aligns with what the house preaches — we aren&rsquo;t
            running a parallel doctrine. If you have questions, concerns, or want to meet
            the leaders, reach out through{" "}
            <Link
              href="/connect"
              className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
            >
              the Connect Card
            </Link>{" "}
            — we&rsquo;ll make introductions.
          </p>
        </Container>
      </section>
    </>
  );
}
