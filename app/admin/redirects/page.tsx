import type { Metadata } from "next";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
} from "@/components/admin/ui";
import { loadRedirects } from "@/lib/redirects/queries";

export const metadata: Metadata = { title: "Redirects" };

export default async function AdminRedirects() {
  const rules = await loadRedirects();
  return (
    <AdminPage
      title="Redirects"
      description="The 301 map from the old WordPress URLs. Checked on every request (60-second cache) so no inbound link ever 404s."
      actions={<PreviewButton tone="gold">+ Add redirect</PreviewButton>}
    >
      <Panel title={`Rules · ${rules.length}`}>
        <DataTable
          rows={rules}
          rowKey={(r) => r.source}
          columns={[
            {
              key: "from",
              label: "From",
              cell: (r) => <span className="font-mono text-xs">{r.source}</span>,
            },
            {
              key: "to",
              label: "To",
              cell: (r) => <span className="font-mono text-xs">{r.target}</span>,
            },
            {
              key: "code",
              label: "Code",
              cell: (r) => <span className="font-mono text-xs">{r.status}</span>,
            },
            { key: "state", label: "", cell: () => <StatusPill status="active" /> },
          ]}
        />
      </Panel>
    </AdminPage>
  );
}
