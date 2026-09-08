import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { LegalShell } from "@/components/legal/LegalShell";
import ChildProtection from "@/content/legal/child-protection.mdx";

export const metadata: Metadata = buildMetadata({
  title: "Child Protection Statement",
  description:
    "Zero-tolerance child-protection commitment. Background checks, two-adult rule, secure check-in, mandatory reporting.",
  path: "/legal/child-protection",
});

export default function ChildProtectionPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Child Protection", href: "/legal/child-protection" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <LegalShell kicker="Child Protection">
        <ChildProtection />
      </LegalShell>
    </>
  );
}
