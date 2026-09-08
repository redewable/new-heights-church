import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { FormShell } from "@/components/forms/FormShell";
import { DecisionForm } from "@/components/forms/DecisionForm";
import { PrayerDisclosure } from "@/components/sections/PrayerDisclosure";

export const metadata: Metadata = buildMetadata({
  title: "I said yes",
  description:
    "Capture a decision for Christ — salvation, rededication, baptism in the Spirit, water baptism. A pastor will follow up personally.",
  path: "/connect/decision",
});

interface PageProps {
  searchParams: Promise<{ channel?: string }>;
}

export default async function DecisionPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const channel =
    sp.channel === "online"
      ? "online"
      : sp.channel === "in_person"
        ? "in_person"
        : undefined;

  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Connect", href: "/connect" },
    { name: "I said yes", href: "/connect/decision" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <FormShell
        tone="altar"
        kicker="The altar is open"
        title={
          <>
            Say it out loud.
            <br />
            <span className="text-[color:var(--nh-gold-ink)]">
              We&rsquo;ll carry it from here.
            </span>
          </>
        }
        lead="You don't have to know everything to be saved. Accept that Jesus Christ died for your sins and rose again, believe it in your heart, and confess with your mouth that He is Lord (Romans 10:9–10). Then pick the one that fits and tell us your name — that's all we need right now. We'll ask for the rest on the next page."
      >
        <PrayerDisclosure className="mb-10" />
        <DecisionForm channel={channel} />
      </FormShell>
    </>
  );
}
