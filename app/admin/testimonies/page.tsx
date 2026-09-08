import type { Metadata } from "next";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
} from "@/components/admin/ui";
import { MOCK_TESTIMONIES } from "@/lib/admin/mock";

export const metadata: Metadata = { title: "Testimonies" };

export default function AdminTestimonies() {
  return (
    <AdminPage
      title="Testimonies"
      description="Real stories, with written consent, first name and last initial only, never a photograph of a minor. Nothing publishes to the site until it's approved here."
    >
      <Panel title="Queue">
        <DataTable
          rows={MOCK_TESTIMONIES}
          rowKey={(t) => t.id}
          columns={[
            {
              key: "source",
              label: "Source",
              cell: (t) => <span className="text-ink font-medium">{t.source}</span>,
            },
            {
              key: "text",
              label: "Text",
              cell: () => (
                <span className="text-fog italic">
                  Awaiting the person's own words — none are written for them.
                </span>
              ),
            },
            {
              key: "consent",
              label: "Consent",
              cell: (t) =>
                t.consent ? (
                  <StatusPill status="approved" />
                ) : (
                  <StatusPill status="pending" />
                ),
            },
            {
              key: "date",
              label: "Submitted",
              cell: (t) => <span className="font-mono text-xs">{t.submittedAt}</span>,
            },
            {
              key: "status",
              label: "Status",
              cell: (t) => <StatusPill status={t.status} />,
            },
            {
              key: "actions",
              label: "",
              cell: (t) => (
                <div className="flex gap-2">
                  {t.status === "pending" ? <PreviewButton>Approve</PreviewButton> : null}
                  <PreviewButton tone="ghost">
                    {t.status === "retired" ? "Restore" : "Retire"}
                  </PreviewButton>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </AdminPage>
  );
}
