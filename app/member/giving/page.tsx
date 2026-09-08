import type { Metadata } from "next";
import { MemberShell } from "@/components/member/MemberShell";
import {
  DataTable,
  Panel,
  PreviewButton,
  StatTile,
  StatusPill,
  formatUsd,
} from "@/components/admin/ui";
import { GIVING } from "@/lib/member/mock";
import { GIVING as GIVING_METHODS } from "@/lib/constants/giving";

export const metadata: Metadata = { title: "Giving" };

export default function MemberGiving() {
  return (
    <MemberShell>
      <header>
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Giving</p>
        <h1 className="u-display-dramatic text-ink mt-3 text-[clamp(2rem,4.5vw,3rem)]">
          Give as the altar has loved you.
        </h1>
        <p className="text-stone mt-3 max-w-[56ch]">
          Your record, read from Pushpay. Change a recurring gift or a card on Pushpay
          itself — we never hold payment details.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Year to date"
          value={formatUsd(GIVING.ytd)}
          hint="Across all funds"
        />
        <StatTile
          label="Recurring"
          value={formatUsd(GIVING.recurring.amount)}
          hint={`${GIVING.recurring.cadence} · next ${GIVING.recurring.nextDate}`}
          tone="gold"
        />
        <StatTile
          label="Last gift"
          value={formatUsd(GIVING.lastGift.amount)}
          hint={`${GIVING.lastGift.date} · ${GIVING.lastGift.fund}`}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Recent gifts">
          <DataTable
            rows={GIVING.recent}
            rowKey={(g) => `${g.date}-${g.fund}`}
            columns={[
              {
                key: "date",
                label: "Date",
                cell: (g) => <span className="font-mono text-xs">{g.date}</span>,
              },
              {
                key: "fund",
                label: "Fund",
                cell: (g) => <span className="text-ink font-medium">{g.fund}</span>,
              },
              {
                key: "method",
                label: "Method",
                cell: (g) => <span className="text-stone">{g.method}</span>,
              },
              {
                key: "amount",
                label: "Amount",
                className: "text-right",
                cell: (g) => (
                  <span className="font-mono tabular-nums">{formatUsd(g.amount)}</span>
                ),
              },
            ]}
          />
        </Panel>

        <div className="space-y-5">
          <Panel title="Rise Up and Build">
            <p className="text-ink font-display text-2xl">
              {formatUsd(GIVING.pledge.amount)} {GIVING.pledge.cadence.toLowerCase()}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--nh-bone)]">
              <div
                className="h-full rounded-full bg-[color:var(--nh-gold)]"
                style={{ width: `${Math.round(GIVING.pledge.fulfilled * 100)}%` }}
              />
            </div>
            <p className="text-fog mt-2 text-xs">
              {Math.round(GIVING.pledge.fulfilled * 100)}% of your pledge fulfilled
            </p>
          </Panel>

          <Panel title="Statements">
            <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
              {GIVING.statements.map((s) => (
                <li key={s.year} className="flex items-center justify-between gap-4 py-2">
                  <span className="text-ink font-medium">{s.year} giving statement</span>
                  {s.ready ? (
                    <PreviewButton tone="ghost">Download PDF</PreviewButton>
                  ) : (
                    <StatusPill status="pending" />
                  )}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Manage">
            <a
              href={GIVING_METHODS.pushpay.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-5 text-sm font-semibold"
            >
              Open Pushpay ↗
            </a>
            <p className="text-fog mt-3 text-xs">
              Update a card, pause a recurring gift, or give a one-time gift.
            </p>
          </Panel>
        </div>
      </div>
    </MemberShell>
  );
}
