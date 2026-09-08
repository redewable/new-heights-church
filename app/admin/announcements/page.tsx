import type { Metadata } from "next";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
} from "@/components/admin/ui";
import { ANNOUNCEMENTS, getActiveAnnouncement } from "@/lib/constants/announcements";

export const metadata: Metadata = { title: "Announcements" };

function windowLabel(a: { startsAt: string | null; endsAt: string | null }) {
  const f = (iso: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  if (!a.startsAt && !a.endsAt) return "Always (fallback)";
  return `${a.startsAt ? f(a.startsAt) : "…"} → ${a.endsAt ? f(a.endsAt) : "…"}`;
}

export default function AdminAnnouncements() {
  const active = getActiveAnnouncement();
  return (
    <AdminPage
      title="Announcements"
      description="The strip at the top of every page. Entries are date-windowed; the first one whose window is open wins, and the evergreen fallback catches the rest."
      actions={<PreviewButton tone="gold">+ New announcement</PreviewButton>}
    >
      <Panel title="Schedule">
        <DataTable
          rows={ANNOUNCEMENTS}
          rowKey={(a) => a.id}
          columns={[
            {
              key: "lead",
              label: "Lead",
              cell: (a) => <span className="text-ink font-medium">{a.lead}</span>,
            },
            {
              key: "headline",
              label: "Sentence",
              cell: (a) => <span className="text-stone">{a.headline ?? "—"}</span>,
            },
            {
              key: "cta",
              label: "Button",
              cell: (a) => (
                <span className="font-mono text-xs">
                  {a.ctaLabel} → {a.ctaHref}
                </span>
              ),
            },
            {
              key: "window",
              label: "Window",
              cell: (a) => (
                <span className="font-mono text-xs whitespace-nowrap">
                  {windowLabel(a)}
                </span>
              ),
            },
            {
              key: "status",
              label: "",
              cell: (a) =>
                active?.id === a.id ? (
                  <StatusPill status="active" />
                ) : (
                  <StatusPill status="planned" />
                ),
            },
          ]}
        />
      </Panel>
    </AdminPage>
  );
}
