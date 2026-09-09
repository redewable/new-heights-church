import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript, localBusinessSchema } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { MobileFolds } from "@/components/ui/MobileFolds";
import { CHURCH } from "@/lib/constants/church";
import { MEDIA } from "@/lib/constants/media";

export const metadata: Metadata = buildMetadata({
  title: "Plan your visit",
  description:
    "Address, parking, check-in, service times, and what to expect on your first Sunday at New Heights Church.",
  path: "/about/visit",
});

const WHEN = [
  {
    day: "Sunday",
    time: "10:00 AM CT",
    what: "Main service — worship, word, altar. Doors at 9:30.",
  },
  {
    day: "Wednesday",
    time: "7:00 PM CT",
    what: "Midweek — prayer, presence, pouring-out.",
  },
] as const;

export default function VisitPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Plan your visit", href: "/about/visit" },
  ]);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CHURCH.address.full)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }}
      />

      <section className="u-grain-ink bg-ink text-cream relative overflow-hidden">
        <Container size="xl" className="u-hero-mark relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">Plan your visit</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)]">
            We&rsquo;ll look for you.
          </h1>
          <p className="text-cream/85 mt-6 hidden max-w-[44ch] text-lg leading-relaxed md:block md:text-xl">
            Everything you need to walk in confident. Address, parking, children, timing,
            and what to expect. If we miss anything below, tell a greeter and
            they&rsquo;ll get you there.
          </p>
          <p className="text-cream/85 mt-5 max-w-[28ch] text-lg leading-snug md:hidden">
            Address, parking, children, timing — everything to walk in confident.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" href={mapHref} external>
              Get directions
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/connect"
              className="text-cream hover:bg-cream hover:text-ink border-white/40"
            >
              Tell us you&rsquo;re coming
            </Button>
          </div>
        </Container>
      </section>

      {/* ---- Campus facts ---- */}
      <section className="py-20 md:py-28">
        <Container size="xl">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-start md:gap-16">
            <div>
              <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">The campus</p>
              <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                {CHURCH.address.city}, {CHURCH.address.region}.
              </h2>
              <address className="text-ink u-display-soft mt-8 block text-2xl leading-tight not-italic md:text-3xl">
                {CHURCH.address.street}
                <br />
                {CHURCH.address.city}, {CHURCH.address.region} {CHURCH.address.postal}
              </address>
              <dl className="mt-10 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <dt className="u-eyebrow text-fog">Phone</dt>
                  <dd className="mt-1 text-base">
                    <a
                      href={CHURCH.contact.phoneHref}
                      className="text-ink underline-offset-4 hover:underline"
                    >
                      {CHURCH.contact.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="u-eyebrow text-fog">Email</dt>
                  <dd className="mt-1 text-base">
                    <a
                      href={CHURCH.contact.emailHref}
                      className="u-break-anywhere text-ink underline-offset-4 hover:underline"
                    >
                      {CHURCH.contact.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <figure className="u-frame-gold relative order-first aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] md:order-none">
              <Image
                src={MEDIA.campus.src}
                alt={MEDIA.campus.alt}
                fill
                sizes="(min-width: 768px) 48vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </Container>
      </section>

      {/* ---- Service times ---- */}
      <section className="bg-[color:var(--nh-bone)] py-20 md:py-24">
        <Container size="xl">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">When we gather</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            Two services a week. Same altar.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            {WHEN.map((s) => (
              <article
                key={s.day}
                className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 md:p-8"
              >
                <p className="u-eyebrow text-fog">{s.day}</p>
                <p className="u-display-soft text-ink mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-none">
                  {s.time}
                </p>
                <p className="text-stone mt-5 leading-relaxed md:text-lg">{s.what}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- What to expect ---- */}
      <section className="py-20 md:py-24">
        <Container size="md">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Your first Sunday</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            How to walk in.
          </h2>
          <MobileFolds
            className="mt-8"
            items={[
              {
                title: "Parking",
                body: "Free on-site lot. Park anywhere and walk straight to the front doors.",
              },
              {
                title: "Check-in",
                body: "Young Lions check-in opens at 9:30 AM. Your child gets a tag; you get the matching one.",
              },
              {
                title: "Seating",
                body: "Sit wherever you like. Nobody will call you out. Stay for the altar.",
              },
              {
                title: "The altar",
                body: "Come forward, stay seated, kneel, raise your hands — whatever is yours to do.",
              },
            ]}
          />
          <div className="text-ink mt-10 hidden space-y-6 text-lg leading-relaxed md:block md:text-xl">
            <p>
              <span className="font-display block text-2xl">Parking.</span>
              Free on-site lot. Greeters hold space by the front doors; pull in, park
              anywhere, walk straight to the entrance.
            </p>
            <p>
              <span className="font-display block text-2xl">Check-in.</span>
              Young Lions (kids, nursery through 5th) check-in opens at 9:30 AM. Each
              child gets a tag; parents get a matching tag. Volunteers are
              background-checked and the rooms are clean.
            </p>
            <p>
              <span className="font-display block text-2xl">Seating.</span>
              Sit wherever you like. Nobody will call you out from the stage or ask you to
              stand and wave. Stay for the altar — that is where this house does its
              deepest work.
            </p>
            <p>
              <span className="font-display block text-2xl">The altar.</span>
              Toward the end of every service, we open the altar. You can come forward,
              stay in your seat, kneel, raise your hands — whatever is yours to do. We
              don&rsquo;t rush it.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/im-new"
              className="text-ink hover:text-cream inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-6 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
            >
              The full first-time guide
            </Link>
            <a
              href={CHURCH.contact.phoneHref}
              className="text-stone text-sm underline-offset-4 hover:underline"
            >
              Or call {CHURCH.contact.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
