import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { LegalShell } from "@/components/legal/LegalShell";
import Privacy from "@/content/legal/privacy.mdx";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How New Heights Church collects, uses, and protects your information. First-party data ownership, transparent practices, no advertising use.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Privacy Policy", href: "/legal/privacy" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <LegalShell kicker="Privacy Policy">
        <Privacy />
      </LegalShell>
    </>
  );
}
