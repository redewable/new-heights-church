import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { FormShell } from "@/components/forms/FormShell";
import { PrayerRequestForm } from "@/components/forms/PrayerRequestForm";

export const metadata: Metadata = buildMetadata({
  title: "Prayer request",
  description:
    "Send a prayer request to the New Heights Church intercessory team. Held in confidence. Anonymity is an option.",
  path: "/connect/prayer",
});

export default function PrayerPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Connect", href: "/connect" },
    { name: "Prayer", href: "/connect/prayer" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <FormShell
        kicker="Prayer request"
        title="The house will pray for you."
        lead="Every request goes to the intercessory team and is prayed over that week — urgent ones the same day. Write as much or as little as you want, and stay anonymous if you'd rather."
      >
        <PrayerRequestForm />
      </FormShell>
    </>
  );
}
