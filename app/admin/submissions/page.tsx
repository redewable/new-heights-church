import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
  formatWhen,
} from "@/components/admin/ui";
import {
  MOCK_SUBMISSIONS,
  SUBMISSION_TYPES,
  type SubmissionType,
} from "@/lib/admin/mock";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Submissions" };

export default async function AdminSubmissions({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const active = SUBMISSION_TYPES.some((t) => t.key === type)
    ? (type as SubmissionType)
    : null;
  const rows = active
    ? MOCK_SUBMISSIONS.filter((s) => s.type === active)
    : MOCK_SUBMISSIONS;
  const typeLabel = (k: string) => SUBMISSION_TYPES.find((t) => t.key === k)?.label ?? k;

  return (
    <AdminPage
      title="Submissions"
      description="Every form on the site lands here first, then syncs to Planning Center. Failed syncs retry on their own; anything still failing shows scarlet."
      actions={<PreviewButton tone="ghost">Export CSV</PreviewButton>}
    >
      <nav aria-label="Submission type" className="flex flex-wrap gap-2">
        <Tab
          href="/admin/submissions"
          active={!active}
          label="All"
          count={MOCK_SUBMISSIONS.length}
        />
        {SUBMISSION_TYPES.map((t) => (
          <Tab
            key={t.key}
            href={`/admin/submissions?type=${t.key}`}
            active={active === t.key}
            label={t.label}
            count={MOCK_SUBMISSIONS.filter((s) => s.type === t.key).length}
          />
        ))}
      </nav>

      <Panel title={active ? typeLabel(active) : "All submissions"}>
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty="No submissions of this type yet."
          columns={[
            {
              key: "type",
              label: "Type",
              cell: (r) => <span className="font-medium">{typeLabel(r.type)}</span>,
            },
            { key: "who", label: "Who", cell: (r) => r.who },
            {
              key: "summary",
              label: "Summary",
              cell: (r) => <span className="text-stone">{r.summary}</span>,
            },
            {
              key: "channel",
              label: "Channel",
              cell: (r) => (
                <span className="text-fog text-xs">
                  {r.channel === "in_person" ? "In person" : "Online"}
                </span>
              ),
            },
            {
              key: "when",
              label: "Received",
              cell: (r) => (
                <span className="font-mono text-xs whitespace-nowrap">
                  {formatWhen(r.receivedAt)}
                </span>
              ),
            },
            {
              key: "sync",
              label: "PC sync",
              cell: (r) => <StatusPill status={r.synced} />,
            },
            {
              key: "status",
              label: "Status",
              cell: (r) => <StatusPill status={r.status} />,
            },
            {
              key: "actions",
              label: "",
              cell: () => <PreviewButton tone="ghost">Open</PreviewButton>,
            },
          ]}
        />
      </Panel>
    </AdminPage>
  );
}

function Tab({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-colors",
        active
          ? "bg-ink text-cream border-ink"
          : "bg-paper text-ink border-[color:var(--nh-border)] hover:border-[color:var(--nh-ink)]",
      )}
    >
      {label}
      <span className={cn("font-mono", active ? "text-cream/70" : "text-fog")}>
        {count}
      </span>
    </Link>
  );
}
