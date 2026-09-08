import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { LegalShell } from "@/components/legal/LegalShell";
import Terms from "@/content/legal/terms.mdx";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "Terms governing use of the New Heights Church website — content, submissions, giving flows, disclaimers, and governing law.",
  path: "/legal/terms",
});

export default function TermsPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Terms of Use", href: "/legal/terms" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <LegalShell kicker="Terms of Use">
        <Terms />
      </LegalShell>
    </>
  );
}
