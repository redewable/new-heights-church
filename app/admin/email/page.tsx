import type { Metadata } from "next";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
} from "@/components/admin/ui";
import { DECISION_DRIP, EMAIL_TEMPLATES } from "@/lib/admin/mock";

export const metadata: Metadata = { title: "Email & follow-up" };

export default function AdminEmail() {
  return (
    <AdminPage
      title="Email & follow-up"
      description="Transactional email through Resend. Every form sends a confirmation; a decision starts the pastors' follow-up sequence."
    >
      <Panel title="Templates">
        <DataTable
          rows={EMAIL_TEMPLATES}
          rowKey={(t) => t.key}
          columns={[
            {
              key: "name",
              label: "Template",
              cell: (t) => <span className="text-ink font-medium">{t.name}</span>,
            },
            {
              key: "trigger",
              label: "Sends when",
              cell: (t) => <span className="text-stone">{t.trigger}</span>,
            },
            {
              key: "from",
              label: "From",
              cell: (t) => (
                <span className="font-mono text-xs">{t.from}newheightschurch.info</span>
              ),
            },
            {
              key: "status",
              label: "Status",
              cell: (t) => (
                <StatusPill status={t.status === "built" ? "built" : "planned"} />
              ),
            },
            {
              key: "actions",
              label: "",
              cell: () => <PreviewButton tone="ghost">Preview</PreviewButton>,
            },
          ]}
        />
      </Panel>

      <Panel title="Decision follow-up sequence">
        <ol className="relative ml-3 space-y-5 border-l border-[color:var(--nh-border)] pl-6">
          {DECISION_DRIP.map((step) => (
            <li key={step.at} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[1.9rem] h-3 w-3 rounded-full bg-[color:var(--nh-gold)]"
              />
              <p className="u-eyebrow text-fog">{step.at}</p>
              <p className="text-ink mt-1 text-sm">{step.what}</p>
            </li>
          ))}
        </ol>
        <p className="text-fog mt-6 text-xs">
          The sequence is sacred: short, personal, signed by the pastors. It pauses the
          moment a staff member marks the decision "contacted".
        </p>
      </Panel>
    </AdminPage>
  );
}
