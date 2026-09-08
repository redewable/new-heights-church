import type { Metadata } from "next";
import Link from "next/link";
import { MemberShell } from "@/components/member/MemberShell";
import { DataTable, Panel, PreviewButton, StatusPill } from "@/components/admin/ui";
import { SERVING } from "@/lib/member/mock";

export const metadata: Metadata = { title: "Serve" };

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${iso}T12:00:00-05:00`));
}

export default function MemberServe() {
  return (
    <MemberShell>
      <header>
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Serve</p>
        <h1 className="u-display-dramatic text-ink mt-3 text-[clamp(2rem,4.5vw,3rem)]">
          {SERVING.team}.
        </h1>
        <p className="text-stone mt-3 max-w-[56ch]">
          Your schedule, your training, and the way to swap a Sunday when life happens.
          Team lead: {SERVING.lead}.
        </p>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel
          title="Upcoming"
          aside={<PreviewButton tone="ghost">Request a swap</PreviewButton>}
        >
          <DataTable
            rows={SERVING.upcoming}
            rowKey={(s) => s.date}
            columns={[
              {
                key: "date",
                label: "Date",
                cell: (s) => (
                  <span className="font-mono text-xs whitespace-nowrap">
                    {fmtDate(s.date)}
                  </span>
                ),
              },
              {
                key: "service",
                label: "Service",
                cell: (s) => <span className="text-ink font-medium">{s.service}</span>,
              },
              { key: "role", label: "Role", cell: (s) => s.role },
              {
                key: "arrive",
                label: "Arrive",
                cell: (s) => <span className="font-mono text-xs">{s.arrive}</span>,
              },
            ]}
          />
        </Panel>

        <div className="space-y-5">
          <Panel title="Training">
            <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
              {SERVING.training.map((t) => (
                <li key={t.name} className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <p className="text-ink font-medium">{t.name}</p>
                    <p className="text-fog text-xs">{t.when}</p>
                  </div>
                  <StatusPill status={t.status === "done" ? "done" : "pending"} />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Another team?">
            <p className="text-stone text-sm">
              Worship, media, Young Lions, Youth Army, prayer. Every team needs hands, and
              every hand needs the same two classes first.
            </p>
            <Link
              href="/grow/volunteer"
              className="mt-3 inline-block text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
            >
              Apply to serve →
            </Link>
          </Panel>
        </div>
      </div>
    </MemberShell>
  );
}
