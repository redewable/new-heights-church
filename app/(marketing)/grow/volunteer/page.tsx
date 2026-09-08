import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { FormShell } from "@/components/forms/FormShell";
import { VolunteerForm } from "@/components/forms/VolunteerForm";

export const metadata: Metadata = buildMetadata({
  title: "Serve — First-Touch Team",
  description:
    "Serving at New Heights Church — First-Touch Team plus worship, tech, kids, youth, and more. Prereq: New to New Heights + Foundations of Faith.",
  path: "/grow/volunteer",
});

export default function VolunteerPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Grow", href: "/grow" },
    { name: "Serve", href: "/grow/volunteer" },
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
            <span className="u-eyebrow">The Bride · Room VII</span>
          </div>
          <h1 className="u-display-dramatic text-cream mt-7 max-w-[14ch] text-[clamp(2.5rem,6vw,5.5rem)]">
            Serve.
          </h1>
          <p className="text-cream/85 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
            The First-Touch Team makes every Sunday happen — hospitality, prayer, kids,
            youth, worship, production. Planted people making room for the next person
            through the door.
          </p>
        </Container>
      </section>

      {/* ---- The path ---- */}
      <section className="py-20 md:py-28">
        <Container size="md">
          <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
            <span aria-hidden="true" className="u-rule-gold w-12" />
            <span className="u-eyebrow">The path to serving</span>
          </div>
          <h2 className="u-display-dramatic text-ink mt-4 max-w-[22ch] text-[clamp(1.75rem,4vw,2.75rem)]">
            Two classes first. Then the team.
          </h2>
          <p className="text-stone mt-6 text-lg leading-relaxed md:text-xl">
            We keep the serve path tight on purpose. Before we hand you a lanyard, we want
            to know each other — and we want you to know what we preach. Two rooms, then
            the team.
          </p>

          <ol className="mt-10 space-y-8">
            <PathStep
              num="I"
              href="/grow/membership"
              label="New to New Heights"
              body="The welcome class. Who we are, what we preach, what Sunday looks like. Ninety minutes."
            />
            <PathStep
              num="II"
              href="/grow/foundation-faith"
              label="Foundations of Faith"
              body="Multi-week cohort. The whole counsel of God. What we believe, why it matters."
            />
            <PathStep
              num="III"
              href="#apply"
              label="Apply to serve"
              body="Tell us where you want to serve. A coordinator confirms your classes in Church Center and places you on a team."
              emphasized
            />
          </ol>
        </Container>
      </section>

      {/* ---- Application ---- */}
      <FormShell
        as="h2"
        kicker="Apply to serve"
        title={<>Where do you want to stand?</>}
        lead="If you haven't finished both classes yet, still submit — we'll line them up for you and check back when you're through."
        className="scroll-mt-20"
      >
        <div id="apply" />
        <VolunteerForm />
      </FormShell>
    </>
  );
}

function PathStep({
  num,
  href,
  label,
  body,
  emphasized,
}: {
  num: string;
  href: string;
  label: string;
  body: string;
  emphasized?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group bg-paper flex items-start gap-6 rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-20px_rgba(11,27,43,0.25)] md:p-7"
      >
        <span
          aria-hidden="true"
          className={
            emphasized
              ? "u-numeral block text-[color:var(--nh-gold)]"
              : "u-numeral block text-[color:var(--nh-gold)] opacity-60"
          }
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            lineHeight: 0.8,
          }}
        >
          {num}
        </span>
        <div className="flex-1">
          <h3 className="font-display text-ink text-xl md:text-2xl">{label}</h3>
          <p className="text-stone mt-2 leading-relaxed">{body}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--nh-scarlet-ink)]">
            <span
              aria-hidden="true"
              className="block h-px w-8 bg-[color:var(--nh-scarlet)] transition-all group-hover:w-12"
            />
            {href.startsWith("#") ? "Jump to the form" : "Open the room"} →
          </span>
        </div>
      </Link>
    </li>
  );
}
