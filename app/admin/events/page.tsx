import type { Metadata } from "next";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
} from "@/components/admin/ui";
import { listEvents } from "@/lib/events/queries";
import { eventRangeShort } from "@/lib/events/format";

export const metadata: Metadata = { title: "Events" };

const PLATFORM: Record<string, string> = {
  planning_center: "Church Center",
  brushfire: "Brushfire",
  internal: "This site",
  external: "External",
};

export default async function AdminEvents() {
  const { events } = await listEvents({ limit: 100, upcoming: false });

  return (
    <AdminPage
      title="Events"
      description="Planning Center Calendar is the source of truth; this table is the on-site cache. Featured, registration status, speakers, and the poster are editable here."
      actions={
        <>
          <PreviewButton tone="ghost">Sync from Planning Center</PreviewButton>
          <PreviewButton tone="gold">+ New event</PreviewButton>
        </>
      }
    >
      <Panel title={`All events · ${events.length}`}>
        <DataTable
          rows={events}
          rowKey={(e) => e.id}
          columns={[
            {
              key: "when",
              label: "When",
              cell: (e) => (
                <span className="font-mono text-xs whitespace-nowrap">
                  {eventRangeShort(e)}
                </span>
              ),
            },
            {
              key: "title",
              label: "Event",
              cell: (e) => (
                <div>
                  <p className="text-ink font-medium">{e.title}</p>
                  {e.speakers?.length ? (
                    <p className="text-stone text-xs">{e.speakers.join(" · ")}</p>
                  ) : null}
                </div>
              ),
            },
            {
              key: "ministry",
              label: "Ministry",
              cell: (e) => <span className="text-stone">{e.ministry ?? "—"}</span>,
            },
            {
              key: "platform",
              label: "Registration",
              cell: (e) => (
                <span>
                  {e.registration_platform ? PLATFORM[e.registration_platform] : "—"}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              cell: (e) => <StatusPill status={e.registration_status} />,
            },
            {
              key: "featured",
              label: "Featured",
              cell: (e) =>
                e.featured ? (
                  <StatusPill status="approved" />
                ) : (
                  <span className="text-fog">—</span>
                ),
            },
            {
              key: "pc",
              label: "PC sync",
              cell: () => <span className="text-fog text-xs">Not linked</span>,
            },
            {
              key: "actions",
              label: "",
              cell: () => <PreviewButton tone="ghost">Edit</PreviewButton>,
            },
          ]}
        />
      </Panel>
    </AdminPage>
  );
}
