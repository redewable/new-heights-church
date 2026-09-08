import Link from "next/link";
import {
  AdminPage,
  DataTable,
  Panel,
  StatTile,
  StatusPill,
  formatWhen,
} from "@/components/admin/ui";
import { MOCK_METRICS, MOCK_SUBMISSIONS, SUBMISSION_TYPES } from "@/lib/admin/mock";
import { listUpcomingEvents } from "@/lib/events/queries";
import { getLatestSermon } from "@/lib/sermons/queries";
import { getActiveAnnouncement } from "@/lib/constants/announcements";
import { eventRangeShort } from "@/lib/events/format";

export default async function AdminDashboard() {
  const [upcoming, latest] = await Promise.all([
    listUpcomingEvents(4),
    getLatestSermon(),
  ]);
  const announcement = getActiveAnnouncement();
  const recent = MOCK_SUBMISSIONS.slice(0, 5);
  const typeLabel = (k: string) => SUBMISSION_TYPES.find((t) => t.key === k)?.label ?? k;

  return (
    <AdminPage
      title="Dashboard"
      description="What moved this week. Figures below are sample numbers until Supabase is connected."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Decisions"
          value={MOCK_METRICS.decisions}
          hint={MOCK_METRICS.window}
          tone="scarlet"
        />
        <StatTile
          label="Connect cards"
          value={MOCK_METRICS.connectCards}
          hint={`${MOCK_METRICS.firstTimeGuests} first-time guests`}
        />
        <StatTile
          label="Prayer requests"
          value={MOCK_METRICS.prayerRequests}
          hint={MOCK_METRICS.window}
        />
        <StatTile
          label="Sermon plays"
          value={MOCK_METRICS.sermonPlays}
          hint="Site + YouTube embeds"
          tone="gold"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Recent submissions"
          aside={
            <Link
              href="/admin/submissions"
              className="text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
            >
              Open inbox →
            </Link>
          }
        >
          <DataTable
            rows={recent}
            rowKey={(r) => r.id}
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
                key: "when",
                label: "Received",
                cell: (r) => (
                  <span className="font-mono text-xs">{formatWhen(r.receivedAt)}</span>
                ),
              },
              {
                key: "status",
                label: "Status",
                cell: (r) => <StatusPill status={r.status} />,
              },
            ]}
          />
        </Panel>

        <div className="space-y-6">
          <Panel title="On the site right now">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="u-eyebrow text-fog">Announcement bar</dt>
                <dd className="text-ink mt-1">
                  {announcement
                    ? `${announcement.lead} — ${announcement.ctaLabel}`
                    : "None active"}
                </dd>
              </div>
              <div>
                <dt className="u-eyebrow text-fog">Latest service</dt>
                <dd className="text-ink mt-1">{latest ? latest.title : "—"}</dd>
              </div>
              <div>
                <dt className="u-eyebrow text-fog">Livestream</dt>
                <dd className="text-ink mt-1">
                  Polling every 60s · YouTube key not configured
                </dd>
              </div>
              <div>
                <dt className="u-eyebrow text-fog">Planning Center sync</dt>
                <dd className="text-ink mt-1">
                  {MOCK_METRICS.pendingSync} submissions waiting
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel
            title="Coming up"
            aside={
              <Link
                href="/admin/events"
                className="text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
              >
                All events →
              </Link>
            }
          >
            <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
              {upcoming.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-ink font-medium">{e.title}</span>
                  <span className="font-mono text-xs whitespace-nowrap">
                    {eventRangeShort(e)}
                  </span>
                </li>
              ))}
              {upcoming.length === 0 ? (
                <li className="text-fog py-2.5">Nothing scheduled.</li>
              ) : null}
            </ul>
          </Panel>
        </div>
      </div>
    </AdminPage>
  );
}
