import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { FormShell } from "@/components/forms/FormShell";
import { DecisionFollowUpForm } from "@/components/forms/DecisionFollowUpForm";

export const metadata: Metadata = buildMetadata({
  title: "The next step",
  description:
    "A little more so we can reach out and send a welcome packet. Then we walk together.",
  path: "/connect/decision/next",
  noindex: true,
});

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function DecisionNextPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const id = sp.id?.trim();

  // We allow the page to render even without an id — some people will land
  // here from the email link after cookies cleared. If no id is present we
  // skip the update path and treat it like a fresh Connect Card follow-up;
  // the Zod schema will reject without a uuid and the user sees a clean
  // error prompting them to start over. That's the right fail-state.
  const decisionId = id ?? "";

  return (
    <FormShell
      tone="altar"
      kicker="One more page"
      title={<>Where do we send the packet?</>}
      lead="A Bible, a letter from Apostle Brian and Crystal, and a map of what comes next. Takes about a minute to fill out."
    >
      <DecisionFollowUpForm decisionId={decisionId} />
    </FormShell>
  );
}
