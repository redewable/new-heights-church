import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { CAMPAIGNS, GIVING, pushpayHref } from "@/lib/constants/giving";
import { CHURCH } from "@/lib/constants/church";

export const metadata: Metadata = buildMetadata({
  title: "Give",
  description:
    "Five ways to give to New Heights Church — online, crypto, stock, check, in person. We never touch your card. Every gift is receipted.",
  path: "/give",
});

const FAQ = [
  {
    q: "Is online giving secure?",
    a: "Yes. Pushpay handles every card and bank transaction; the card never touches our servers. They carry the PCI-DSS compliance burden, not us.",
  },
  {
    q: "Can I give anonymously?",
    a: "Yes — use a check by mail, or give in the basket at service. Online methods always tie to an account for the receipt, but that information stays with the processor and our finance team.",
  },
  {
    q: "Will I get a tax receipt?",
    a: "Automatic receipts come from Pushpay (card/bank) and Engiven (crypto) at the time of the gift. Stock gifts through Edward Jones receive a separate letter from the Church. Year-end consolidated statements are available on request.",
  },
  {
    q: "What about text-to-give?",
    a: "Pushpay supports text-to-give. Our keyword and shortcode are being confirmed — check back here or ask an usher on Sunday.",
  },
  {
    q: "Can my workplace match my gift?",
    a: "Many can. We're a registered 501(c)(3) nonprofit; your HR team can verify with our Tax ID on the securities form or by emailing our office directly.",
  },
  {
    q: "Can I designate my gift to a specific ministry?",
    a: "Yes. Pushpay has a fund selector. For stock or check, write the ministry name in the memo. Unspecified gifts go to general operations.",
  },
] as const;

export default function GivePage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Give", href: "/give" },
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd) }}
      />

      {/* ---- Hero ---- */}
      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">The altar is open</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[16ch] text-[clamp(2.75rem,6.5vw,6rem)]">
            Generosity is <span className="text-[color:var(--nh-gold)]">soil</span>.
          </h1>
          <p className="text-cream/85 mt-7 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            Every seat filled, every soul saved, every building raised grows in it. We
            never touch your card. Each gift is receipted. Here are the five ways to give.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="gold" size="lg" href={pushpayHref("give-hero")} external>
              Give now (Pushpay)
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="#methods"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              See all five ways
            </Button>
          </div>
        </Container>
      </section>

      {/* ---- Five methods ---- */}
      <section id="methods" className="py-20 md:py-28">
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">How to give</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,3.25rem)]">
            Five honest paths.
          </h2>

          <div className="mt-12 divide-y divide-[color:var(--nh-border)]">
            {/* 1. Pushpay */}
            <GivingMethodRow
              numeral="I"
              label="Online"
              title="Card, bank, or recurring."
              body="The fastest. Most of our family uses this. Pushpay handles the gift and sends the receipt immediately; you can set up a one-time or recurring schedule in under a minute."
              cta={{
                label: "Give through Pushpay",
                href: pushpayHref("give-method-online"),
                external: true,
              }}
            />

            {/* 2. Crypto */}
            <GivingMethodRow
              numeral="II"
              label="Crypto"
              title="Bitcoin, Ethereum, and more."
              body="Donate appreciated cryptocurrency through our Engiven partner. The donor receives a tax receipt for the fair-market-value gift; NHC receives fiat dollars after conversion."
              cta={{
                label: "Give through Engiven",
                href: GIVING.engiven.url,
                external: true,
              }}
            />

            {/* 3. Stock & securities */}
            <GivingMethodRow
              numeral="III"
              label="Stock & securities"
              title="Transfer from your broker."
              body="Give appreciated stock, mutual funds, or bonds through the Church's Edward Jones account. Donors often avoid capital-gains tax on the transfer. Share the delivery instructions with your broker — it's one page."
              cta={{
                label: "Download delivery form (PDF)",
                href: GIVING.securities.pdfPath,
                external: true,
                download: true,
              }}
              footer={
                <p className="text-fog text-sm">
                  Questions? Email{" "}
                  <a
                    href={`mailto:${GIVING.securities.staffEmail}`}
                    className="text-ink underline-offset-4 hover:underline"
                  >
                    {GIVING.securities.staffEmail}
                  </a>{" "}
                  — our finance team will walk you through it.
                </p>
              }
            />

            {/* 4. Check / mail */}
            <GivingMethodRow
              numeral="IV"
              label="Check by mail"
              title="Make it payable to New Heights Church."
              body={
                <>
                  <p>
                    Traditional, reliable, no platform between you and the Church.
                    Designate a fund in the memo if you'd like.
                  </p>
                  <address className="u-display-soft text-ink mt-5 block text-xl not-italic">
                    {CHURCH.name}
                    <br />
                    {CHURCH.address.street}
                    <br />
                    {CHURCH.address.city}, {CHURCH.address.region} {CHURCH.address.postal}
                  </address>
                </>
              }
            />

            {/* 5. In person */}
            <GivingMethodRow
              numeral="V"
              label="In person"
              title="Bring it to the altar."
              body="At any Sunday or midweek service the offering is received as an act of worship. If you are our guest, you are our guest — nothing is expected of you. This is for the planted family."
            />
          </div>
        </Container>
      </section>

      {/* ---- Rise Up + Growth campaigns ---- */}
      <section
        className="bg-[color:var(--nh-bone)] py-20 md:py-24"
        id="growth-for-the-harvest"
      >
        <Container size="xl">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">Named campaigns</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[22ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            Beyond the weekly offering.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
            <CampaignCard
              title={CAMPAIGNS.riseUpAndBuild.title}
              kicker="Capital initiative"
              blurb={CAMPAIGNS.riseUpAndBuild.blurb}
              href={CAMPAIGNS.riseUpAndBuild.href}
              ctaLabel="See the vision"
            />
            <CampaignCard
              title={CAMPAIGNS.givingTowardsGrowth.title}
              kicker="Harvest focus"
              blurb={CAMPAIGNS.givingTowardsGrowth.blurb}
              href={pushpayHref("growth-for-the-harvest")}
              ctaLabel="Give towards Growth"
              external
            />
          </div>
        </Container>
      </section>

      {/* ---- Receipts + year-end statements ---- */}
      <section className="py-20 md:py-24">
        <Container size="prose">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
            Receipts &amp; statements
          </p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.5rem)]">
            Every gift is receipted.
          </h2>
          <p className="text-stone mt-6 text-lg leading-relaxed">
            Online and crypto receipts fire automatically at the time of the gift. Stock
            gifts receive a letter from the Church after the transfer settles. For a
            consolidated year-end statement that merges every channel, request it below
            and we'll send it within five business days.
          </p>
          <div className="mt-8">
            <Button variant="secondary" href="/give/statement">
              Request my year-end statement
            </Button>
          </div>
        </Container>
      </section>

      {/* ---- FAQ ---- */}
      <section className="border-t border-[color:var(--nh-border)] py-20 md:py-24">
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Frequently asked</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.5rem)]">
            Straight answers on giving.
          </h2>
          <dl className="mt-10 divide-y divide-[color:var(--nh-border)]">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="grid gap-3 py-7 md:grid-cols-[1fr_1.5fr] md:gap-10"
              >
                <dt className="font-display text-ink text-lg leading-snug md:text-xl">
                  {f.q}
                </dt>
                <dd className="text-stone leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---- Benediction ---- */}
      <section className="bg-ink text-cream py-14">
        <Container size="md" className="text-center">
          <p className="u-eyebrow text-[color:var(--nh-gold)]">2 Corinthians 9:7</p>
          <p
            className="u-display-soft mt-4 text-[clamp(1.25rem,3vw,1.875rem)] leading-snug"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            God loves a cheerful giver.
          </p>
          <div className="mt-8">
            <Link
              href="/rise-up-and-build"
              className="text-cream/80 hover:text-cream text-sm underline-offset-4 hover:underline"
            >
              Rise Up and Build →
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ---------------- UI bits ---------------- */

function GivingMethodRow({
  numeral,
  label,
  title,
  body,
  cta,
  footer,
}: {
  numeral: string;
  label: string;
  title: string;
  body: React.ReactNode;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
    download?: boolean;
  };
  footer?: React.ReactNode;
}) {
  return (
    <article className="grid gap-8 py-10 md:grid-cols-[0.4fr_1.6fr] md:gap-14 md:py-14">
      <div className="flex items-start gap-5">
        <span
          aria-hidden="true"
          className="u-numeral block text-[color:var(--nh-gold)] opacity-60"
          style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)", lineHeight: 0.8 }}
        >
          {numeral}
        </span>
        <p className="u-eyebrow text-fog mt-3">{label}</p>
      </div>
      <div>
        <h3 className="u-display-soft text-ink text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
          {title}
        </h3>
        <div className="text-stone mt-4 text-lg leading-relaxed md:text-xl">
          {typeof body === "string" ? <p>{body}</p> : body}
        </div>
        {cta ? (
          <div className="mt-6">
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                download={cta.download ? "" : undefined}
                className="text-ink hover:text-cream inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-6 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
              >
                {cta.label}
                <span aria-hidden="true" className="ml-2">
                  ↗
                </span>
              </a>
            ) : (
              <Link
                href={cta.href}
                className="text-ink hover:text-cream inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-6 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
              >
                {cta.label}
              </Link>
            )}
          </div>
        ) : null}
        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </article>
  );
}

function CampaignCard({
  title,
  kicker,
  blurb,
  href,
  ctaLabel,
  external,
}: {
  title: string;
  kicker: string;
  blurb: string;
  href: string;
  ctaLabel: string;
  external?: boolean;
}) {
  const content = (
    <>
      <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">{kicker}</p>
      <h3 className="font-display text-ink mt-3 text-2xl leading-tight md:text-3xl">
        {title}
      </h3>
      <p className="text-stone mt-4 leading-relaxed">{blurb}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]">
        <span
          aria-hidden="true"
          className="block h-px w-10 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-14"
        />
        {ctaLabel} {external ? "↗" : "→"}
      </span>
    </>
  );
  const cls =
    "group bg-paper block rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-20px_rgba(11,27,43,0.25)] md:p-8";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
