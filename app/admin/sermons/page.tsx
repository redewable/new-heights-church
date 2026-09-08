import type { Metadata } from "next";
import {
  AdminPage,
  DataTable,
  Panel,
  PreviewButton,
  StatusPill,
} from "@/components/admin/ui";
import { listSermons, listSeries } from "@/lib/sermons/queries";
import { formatDateShort } from "@/lib/utils/format";
import { CHURCH } from "@/lib/constants/church";

export const metadata: Metadata = { title: "Sermons" };

export default async function AdminSermons() {
  const [{ sermons }, series] = await Promise.all([
    listSermons({ limit: 100 }),
    listSeries(),
  ]);
  const seriesTitle = (id: string | null) =>
    series.find((s) => s.id === id)?.title ?? "—";

  return (
    <AdminPage
      title="Sermons"
      description="Every service on the site. Import from YouTube stages a draft for review; publishing puts it in the library and the Watch page."
      actions={<PreviewButton tone="gold">+ Import from YouTube</PreviewButton>}
    >
      <Panel title="Import from YouTube">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form className="space-y-3" aria-label="Import a sermon (preview)">
            <label className="block text-sm font-medium" htmlFor="yt-url">
              Video URL
            </label>
            <input
              id="yt-url"
              type="url"
              disabled
              placeholder={`https://www.youtube.com/watch?v=… (channel ${CHURCH.urls.youtubeHandle})`}
              className="bg-cream text-ink placeholder:text-fog w-full rounded-[var(--radius)] border border-[color:var(--nh-border)] px-4 py-3 text-sm"
            />
            <PreviewButton>Fetch details</PreviewButton>
          </form>
          <ol className="text-stone list-decimal space-y-2 pl-5 text-sm">
            <li>
              Paste the URL. We pull the title, description, thumbnail, and duration from
              the YouTube Data API.
            </li>
            <li>
              A draft appears below with the fields editable: speaker, series, scripture,
              topics, pillar.
            </li>
            <li>
              Publish. The sermon lands in the library, the Watch page, the sitemap, and
              the podcast feed.
            </li>
          </ol>
        </div>
      </Panel>

      <Panel title={`Library · ${sermons.length}`}>
        <DataTable
          rows={sermons}
          rowKey={(s) => s.id}
          columns={[
            {
              key: "date",
              label: "Date",
              cell: (s) => (
                <span className="font-mono text-xs whitespace-nowrap">
                  {formatDateShort(s.service_date)}
                </span>
              ),
            },
            {
              key: "title",
              label: "Title",
              cell: (s) => <span className="text-ink font-medium">{s.title}</span>,
            },
            {
              key: "series",
              label: "Series",
              cell: (s) => <span className="text-stone">{seriesTitle(s.series_id)}</span>,
            },
            {
              key: "pillar",
              label: "Pillar",
              cell: (s) =>
                s.pillar ? (
                  <StatusPill status={s.pillar} />
                ) : (
                  <span className="text-fog">untagged</span>
                ),
            },
            {
              key: "video",
              label: "Video",
              cell: (s) => (
                <span className="font-mono text-xs">{s.youtube_id ?? "—"}</span>
              ),
            },
            {
              key: "status",
              label: "Status",
              cell: (s) => <StatusPill status={s.published ? "approved" : "pending"} />,
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
