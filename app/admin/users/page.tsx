import type { Metadata } from "next";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
} from "@/components/admin/ui";
import { MOCK_USERS } from "@/lib/admin/mock";

export const metadata: Metadata = { title: "Users & roles" };

const ROLES = [
  {
    role: "Lead Admin",
    can: "Everything, including users, redirects, and integrations.",
  },
  { role: "Content", can: "Sermons, events, announcements, media, testimonies." },
  {
    role: "Pastoral Care",
    can: "Submissions inbox: prayer, decisions, connect cards. No settings.",
  },
  { role: "Finance", can: "Campaign progress, pledges, statement requests." },
];

export default function AdminUsers() {
  return (
    <AdminPage
      title="Users & roles"
      description="Sign-in is a Supabase magic link, gated by the staff allow-list. Roles decide which screens a person sees."
      actions={<PreviewButton tone="gold">+ Invite</PreviewButton>}
    >
      <Panel title="Staff">
        <DataTable
          rows={MOCK_USERS}
          rowKey={(u) => u.email}
          columns={[
            {
              key: "name",
              label: "Name",
              cell: (u) => <span className="text-ink font-medium">{u.name}</span>,
            },
            {
              key: "email",
              label: "Email",
              cell: (u) => <span className="font-mono text-xs">{u.email}</span>,
            },
            { key: "role", label: "Role", cell: (u) => u.role },
            {
              key: "status",
              label: "Status",
              cell: (u) => <StatusPill status={u.status} />,
            },
            {
              key: "actions",
              label: "",
              cell: () => <PreviewButton tone="ghost">Edit</PreviewButton>,
            },
          ]}
        />
      </Panel>
      <Panel title="What each role can do">
        <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
          {ROLES.map((r) => (
            <li key={r.role} className="grid gap-1 py-3 md:grid-cols-[10rem_1fr]">
              <span className="text-ink font-medium">{r.role}</span>
              <span className="text-stone">{r.can}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminPage>
  );
}
