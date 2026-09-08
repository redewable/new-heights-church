import type { Metadata } from "next";
import {
  AdminPage,
  Panel,
  PreviewButton,
  StatTile,
  formatUsd,
} from "@/components/admin/ui";
import { MOCK_CAMPAIGN } from "@/lib/admin/mock";

export const metadata: Metadata = { title: "Campaign progress" };

export default function AdminCampaign() {
  const c = MOCK_CAMPAIGN;
  const pct = c.goal > 0 ? Math.round((c.given / c.goal) * 100) : 0;
  return (
    <AdminPage
      title="Campaign progress"
      description="Rise Up and Build. Three numbers the finance lead updates; the public page renders the bar from them."
      actions={<PreviewButton tone="gold">Save</PreviewButton>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Goal" value={formatUsd(c.goal)} />
        <StatTile
          label="Pledged"
          value={formatUsd(c.pledged)}
          hint="Intent captured on the site"
          tone="gold"
        />
        <StatTile
          label="Given"
          value={formatUsd(c.given)}
          hint={`${pct}% of goal`}
          tone="scarlet"
        />
      </div>

      <Panel title="Edit">
        <form
          className="grid gap-5 md:grid-cols-3"
          aria-label="Campaign progress (preview)"
        >
          {(["goal", "pledged", "given"] as const).map((k) => (
            <label key={k} className="block text-sm">
              <span className="u-eyebrow text-fog">{k}</span>
              <input
                type="text"
                inputMode="numeric"
                disabled
                defaultValue={c[k].toLocaleString("en-US")}
                className="bg-cream text-ink mt-2 w-full rounded-[var(--radius)] border border-[color:var(--nh-border)] px-4 py-3 font-mono"
              />
            </label>
          ))}
        </form>
        <p className="text-fog mt-4 text-xs">
          Last updated: {c.updatedAt ?? "never"} · Owner: {c.updatedBy}
        </p>
      </Panel>
    </AdminPage>
  );
}
