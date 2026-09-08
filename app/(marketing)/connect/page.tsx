import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { FormShell } from "@/components/forms/FormShell";
import { ConnectCardForm } from "@/components/forms/ConnectCardForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = buildMetadata({
  title: "Connect",
  description:
    "Drop us a line — first-time guest, prayer request, or a decision at the altar. Every line is read.",
  path: "/connect",
});

export default function ConnectPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Connect", href: "/connect" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      <FormShell
        kicker="Drop us a line"
        title={<>Connect card.</>}
        lead="If you were at a service — or you're planning to be — this is how we find you."
      >
        <ConnectCardForm />
      </FormShell>

      {/* Cross-links to the other engagement flows */}
      <section className="border-t border-[color:var(--nh-border)] bg-[color:var(--nh-bone)] py-16 md:py-20">
        <Container size="xl">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Three other paths</p>
          <h2 className="u-display-dramatic text-ink mt-4 text-[clamp(1.5rem,3.5vw,2.5rem)]">
            Different need, different door.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            <CrossLink
              kicker="Altar call"
              href="/connect/decision"
              title="I made a decision"
              body="Salvation, rededication, baptism in the Spirit, water baptism — all of it starts here."
              tone="gold"
            />
            <CrossLink
              kicker="Prayer"
              href="/connect/prayer"
              title="I need prayer"
              body="Held in confidence by our intercessory team. Anonymous is an option."
              tone="purple"
            />
            <CrossLink
              kicker="Pastoral call"
              href="/connect?wantsCall=on"
              title="Please call me"
              body="Use the Connect Card above — check the 'call me' box and tell us the quickest number."
              tone="blue"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function CrossLink({
  kicker,
  href,
  title,
  body,
  tone,
}: {
  kicker: string;
  href: string;
  title: string;
  body: string;
  tone: "gold" | "purple" | "blue";
}) {
  const tones = {
    gold: "border-l-[color:var(--nh-gold)]",
    purple: "border-l-[color:var(--nh-purple)]",
    blue: "border-l-[color:var(--nh-blue)]",
  } as const;
  const ink = {
    gold: "text-[color:var(--nh-gold-ink)]",
    purple: "text-[color:var(--nh-purple-ink)]",
    blue: "text-[color:var(--nh-blue-ink)]",
  } as const;
  return (
    <Link
      href={href}
      className={`group block rounded-[var(--radius-lg)] border border-l-4 border-[color:var(--nh-border)] ${tones[tone]} bg-paper p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-20px_rgba(11,27,43,0.25)] md:p-7`}
    >
      <p className={`u-eyebrow ${ink[tone]}`}>{kicker}</p>
      <h3 className="font-display text-ink mt-3 text-2xl leading-tight">{title}</h3>
      <p className="text-stone mt-3 leading-relaxed">{body}</p>
      <span
        aria-hidden="true"
        className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${ink[tone]}`}
      >
        <span className="block h-px w-8 bg-current transition-all group-hover:w-12" />
        Walk this way →
      </span>
    </Link>
  );
}
