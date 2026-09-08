import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, Panel, StatusPill } from "@/components/admin/ui";
import { ROADMAP, type RoadmapStatus } from "@/lib/admin/mock";

export const metadata: Metadata = { title: "Roadmap" };

const LEGEND: ReadonlyArray<{ status: RoadmapStatus; meaning: string }> = [
  { status: "built", meaning: "Live on the public site." },
  {
    status: "preview",
    meaning: "A screen exists here on mock data; wiring comes with its phase.",
  },
  { status: "planned", meaning: "In the build spec, not started." },
  { status: "optional", meaning: "Worth a decision — not in the RFP." },
];

export default function RoadmapPage() {
  const areas = [...new Set(ROADMAP.map((r) => r.area))];
  return (
    <AdminPage
      title="Roadmap"
      description="Everything in the build, by area and status. Phases follow the build spec (§15)."
    >
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {LEGEND.map((l) => (
          <span key={l.status} className="inline-flex items-center gap-2">
            <StatusPill status={l.status} />
            <span className="text-stone">{l.meaning}</span>
          </span>
        ))}
      </div>

      {areas.map((area) => (
        <Panel key={area} title={area}>
          <ul className="divide-y divide-[color:var(--nh-border)]">
            {ROADMAP.filter((r) => r.area === area).map((r) => (
              <li
                key={r.name}
                className="grid gap-2 py-3 md:grid-cols-[minmax(0,1fr)_7rem_8rem] md:items-start md:gap-6"
              >
                <div className="min-w-0">
                  <p className="text-ink font-medium">
                    {r.href ? (
                      <Link href={r.href} className="underline-offset-4 hover:underline">
                        {r.name}
                      </Link>
                    ) : (
                      r.name
                    )}
                  </p>
                  <p className="text-stone mt-0.5 text-sm">{r.note}</p>
                </div>
                <p className="font-mono text-xs">Phase {r.phase}</p>
                <div>
                  <StatusPill status={r.status} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </AdminPage>
  );
}
