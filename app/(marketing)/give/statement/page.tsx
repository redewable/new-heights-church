import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { FormShell } from "@/components/forms/FormShell";
import { StatementRequestForm } from "@/components/forms/StatementRequestForm";

export const metadata: Metadata = buildMetadata({
  title: "Year-end giving statement",
  description:
    "Request a consolidated year-end giving statement from New Heights Church — merging every channel you gave through.",
  path: "/give/statement",
});

export default function StatementPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Give", href: "/give" },
    { name: "Year-end statement", href: "/give/statement" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />
      <FormShell
        kicker="Year-end statement"
        title={<>Consolidated, one page, on its way.</>}
        lead="Tell us the tax year and where to send it. If you gave through Pushpay, Engiven, or stock during that year, every channel gets merged into a single IRS-ready letter."
      >
        <StatementRequestForm />
      </FormShell>
    </>
  );
}
