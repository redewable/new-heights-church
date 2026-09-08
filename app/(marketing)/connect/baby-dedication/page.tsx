import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { FormShell } from "@/components/forms/FormShell";
import { BabyDedicationForm } from "@/components/forms/BabyDedicationForm";

export const metadata: Metadata = buildMetadata({
  title: "Baby Dedication",
  description:
    "Dedicate your child before the house at New Heights Church. Next service May 10 — register here.",
  path: "/connect/baby-dedication",
});

export default function BabyDedicationPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Connect", href: "/connect" },
    { name: "Baby Dedication", href: "/connect/baby-dedication" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      <FormShell
        tone="altar"
        kicker="Baby Dedication · Next service May 10"
        title={
          <>
            Consecrate the next
            <br />
            <span className="text-[color:var(--nh-gold-ink)]">generation.</span>
          </>
        }
        lead="You bring the child before the house; pastors lay hands, declare a word, and the whole Church stands in covenant with your family. Fill this out and a pastor will call to confirm the logistics and who you'd like up there with you."
      >
        <BabyDedicationForm />
      </FormShell>
    </>
  );
}
