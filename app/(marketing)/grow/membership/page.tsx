import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";

const N2N_REGISTRATION =
  "https://experiencenewheights.churchcenter.com/registrations/events/3584132";

export const metadata: Metadata = buildMetadata({
  title: "New to New Heights — Membership",
  description:
    "Becoming family at New Heights Church starts in one room — New to New Heights. Who we are, what we preach, and what it looks like to call this house home.",
  path: "/grow/membership",
});

const WHAT_WE_COVER = [
  "Our story — how NHC started and who's leading it now.",
  "What we preach — the three pillars: Endtime Harvest, Preparation, Habitation.",
  "How Sundays work — services, kids, youth, hospitality, altar.",
  "The discipleship path — where Foundations of Faith comes next.",
  "What it means to be a member — covenant, not contract.",
] as const;

export default function MembershipPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Grow", href: "/grow" },
    { name: "Membership · New to New Heights", href: "/grow/membership" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">The Bride · Room IV</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)]">
            New to New Heights.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            The first class on the path. A short, welcoming walk through who we are, what
            we preach, and what it looks like to call this house home. Ninety minutes;
            coffee included.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" href={N2N_REGISTRATION} external>
              Register on Church Center
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="#covers"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              What we cover
            </Button>
          </div>
          <p className="text-cream/55 mt-4 text-xs">
            Opens on experiencenewheights.churchcenter.com
          </p>
        </Container>
      </section>

      <section id="covers" className="py-20 md:py-28">
        <Container size="md">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">What we cover</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[22ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            One room. Five honest conversations.
          </h2>
          <ul className="text-ink mt-10 space-y-4 text-lg md:text-xl">
            {WHAT_WE_COVER.map((line, i) => (
              <li key={i} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-8 shrink-0 bg-[color:var(--nh-gold)]"
                />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-[color:var(--nh-bone)] py-16 md:py-20">
        <Container size="md">
          <p className="u-eyebrow text-fog">On the path</p>
          <p className="text-ink font-display mt-3 text-2xl leading-snug md:text-3xl">
            <span className="text-[color:var(--nh-gold-ink)]">New to New Heights</span> →{" "}
            <Link
              href="/grow/foundation-faith"
              className="underline-offset-4 hover:underline"
            >
              Foundations of Faith
            </Link>{" "}
            →{" "}
            <Link href="/grow/volunteer" className="underline-offset-4 hover:underline">
              First-Touch Team
            </Link>
          </p>
          <p className="text-stone mt-5 text-lg">
            This is Room I on the serve path. Once you're through both classes, you're
            clear to apply.
          </p>
        </Container>
      </section>
    </>
  );
}
