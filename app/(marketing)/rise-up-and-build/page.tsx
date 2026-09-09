import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { FaqList } from "@/components/ui/FaqList";
import { PledgeForm } from "@/components/forms/PledgeForm";
import {
  formatUSD,
  formatUSDLong,
  getCampaignProgress,
  progressPercent,
} from "@/lib/giving/campaigns";
import { CAMPAIGNS } from "@/lib/constants/giving";
import { CHURCH } from "@/lib/constants/church";

export const metadata: Metadata = buildMetadata({
  title: "Rise Up and Build",
  description:
    "Rise Up and Build — the capital initiative at New Heights Church. Pledge, partner, and see what the Lord is doing.",
  path: "/rise-up-and-build",
});

export const revalidate = 300;

const SLUG = CAMPAIGNS.riseUpAndBuild.slug;

const FAQ = [
  {
    q: "Is a pledge a payment?",
    a: "No. A pledge tells us your intent — how much, over what frequency. After you pledge, we send a Pushpay link so you can set up the actual recurring gift on your own time. You can change or stop it any time.",
  },
  {
    q: "Where does Rise Up and Build money go?",
    a: "Every dollar is tracked by our finance team and restricted to the capital campaign. Categories include facility expansion, equipment and build-out, and capacity for the next season of services.",
  },
  {
    q: "Can I pledge stock or crypto?",
    a: "Yes. Pledge the dollar equivalent here, then use the matching channel on the Give page. Our finance team reconciles the inflow to your pledge automatically.",
  },
  {
    q: "Who sees my pledge?",
    a: "Senior Pastor and finance team only. The public progress meter shows totals in aggregate — never individual names or amounts.",
  },
] as const;

export default async function RiseUpPage() {
  const campaign = await getCampaignProgress(SLUG);
  if (!campaign) {
    // Can't happen once the migration ran + fixture exists; defensive just in case.
    return (
      <Container size="md" className="py-28 text-center">
        <p className="text-stone">
          The Rise Up and Build page is being updated. Check back shortly.
        </p>
      </Container>
    );
  }

  const percent = progressPercent(campaign);
  const committed = campaign.pledged_cents + campaign.given_cents;

  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Rise Up and Build", href: "/rise-up-and-build" },
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
            <span className="u-eyebrow">Capital initiative</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.75rem,7vw,6.5rem)]">
            Rise up.
            <br />
            <span className="text-[color:var(--nh-gold)]">And build.</span>
          </h1>
          <p className="text-cream/85 mt-7 hidden max-w-[44ch] text-lg leading-relaxed md:block md:text-xl">
            {campaign.blurb}
          </p>
          <p className="text-cream/85 mt-5 max-w-[26ch] text-lg leading-snug md:hidden">
            More room for the harvest we can already see.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="gold" size="lg" href="#pledge">
              Pledge now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="#vision"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              The vision
            </Button>
          </div>
        </Container>
      </section>

      {/* ---- Progress meter ---- */}
      <section className="py-20 md:py-24" aria-labelledby="progress-heading">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">Where we are</span>
          </div>
          <h2
            id="progress-heading"
            className="u-display-dramatic text-ink mt-4 text-[clamp(2rem,5vw,3.5rem)]"
          >
            {formatUSD(committed)}{" "}
            <span className="text-stone">of {formatUSD(campaign.goal_cents)}</span>.
          </h2>
          <p className="text-stone mt-4 text-lg">
            Pledged + given to date. Staff updates this weekly.
          </p>

          <div
            className="mt-8 h-3 w-full overflow-hidden rounded-full bg-[color:var(--nh-bone)]"
            role="progressbar"
            aria-label="Rise Up and Build progress"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${percent}% toward ${formatUSDLong(campaign.goal_cents)}`}
          >
            <div
              className="h-full rounded-full bg-[color:var(--nh-gold)]"
              style={{ width: `${percent}%` }}
            />
          </div>

          <dl className="mt-10 grid gap-8 text-sm sm:grid-cols-3">
            <ProgressStat label="Pledged" value={formatUSDLong(campaign.pledged_cents)} />
            <ProgressStat label="Given" value={formatUSDLong(campaign.given_cents)} />
            <ProgressStat
              label="Next milestone"
              value={campaign.next_milestone ?? "—"}
              detail={campaign.next_milestone_date ?? undefined}
            />
          </dl>
        </Container>
      </section>

      {/* ---- Vision band ---- */}
      <section
        id="vision"
        className="bg-[color:var(--nh-bone)] py-24 md:py-32"
        aria-labelledby="vision-heading"
      >
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">The vision</p>
          <h2
            id="vision-heading"
            className="u-display-dramatic text-ink mt-4 text-[clamp(2rem,4.5vw,3.5rem)]"
          >
            We are not building for us.
          </h2>
          <div className="text-ink mt-8 space-y-6 text-lg leading-relaxed md:text-xl">
            <p className="md:hidden">
              The house is already too small for what the Lord is doing. More seats, more
              classrooms, more altar room.
            </p>
            <p className="hidden md:block">
              The house we meet in is already too small for what the Lord is doing. Every
              Sunday the altar runs long. Every midweek, the room fills. Conferences are
              outgrowing the footprint.
            </p>
            <p className="hidden md:block">
              Rise Up and Build is how we answer. It isn&rsquo;t a building fund for a
              building&rsquo;s sake — it&rsquo;s a preparation for a harvest we can
              already see. More seats, more classrooms, more altar room, more capacity to
              receive whoever He sends.
            </p>
            <p className="text-stone italic">
              &ldquo;Let us rise up and build.&rdquo; So they strengthened their hands for
              the good work. — Nehemiah 2:18
            </p>
          </div>
        </Container>
      </section>

      {/* ---- Pledge form ---- */}
      <section
        id="pledge"
        className="motif-altar-glow relative py-24 md:py-32"
        aria-labelledby="pledge-heading"
      >
        <Container size="prose">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
            Pledge — intent, not payment
          </p>
          <h2
            id="pledge-heading"
            className="u-display-dramatic text-ink mt-4 text-[clamp(2rem,4.5vw,3.5rem)]"
          >
            Tell us what the Lord said.
          </h2>
          <p className="text-stone mt-6 hidden text-lg leading-relaxed md:block">
            Commit a number and a frequency. We&rsquo;ll email you a Pushpay link to set
            up the actual gift whenever you&rsquo;re ready — the pledge itself is sacred,
            but not binding. We trust you; the Lord keeps score.
          </p>
          <p className="text-stone mt-5 text-lg leading-snug md:hidden">
            A number and a frequency. Sacred, not binding.
          </p>
          <div className="mt-12">
            <PledgeForm
              campaign={SLUG}
              campaignTitle={CAMPAIGNS.riseUpAndBuild.shortTitle}
            />
          </div>
        </Container>
      </section>

      {/* ---- FAQ ---- */}
      <section
        className="border-t border-[color:var(--nh-border)] py-20 md:py-24"
        aria-labelledby="faq-heading"
      >
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Frequently asked</p>
          <h2
            id="faq-heading"
            className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.5rem)]"
          >
            Before you pledge.
          </h2>
          <FaqList items={FAQ} className="mt-10" />
          <p className="text-fog mt-10 text-sm">
            Anything else? Email{" "}
            <a
              className="text-ink underline-offset-4 hover:underline"
              href={CHURCH.contact.emailHref}
            >
              {CHURCH.contact.email}
            </a>{" "}
            or call{" "}
            <a
              className="text-ink underline-offset-4 hover:underline"
              href={CHURCH.contact.phoneHref}
            >
              {CHURCH.contact.phone}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}

function ProgressStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div>
      <dt className="u-eyebrow text-fog">{label}</dt>
      <dd className="font-display text-ink mt-2 text-xl md:text-2xl">{value}</dd>
      {detail ? <p className="text-fog mt-1 text-xs">{detail}</p> : null}
    </div>
  );
}
