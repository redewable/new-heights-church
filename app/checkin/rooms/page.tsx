import type { Metadata } from "next";
import { KioskShell } from "@/components/checkin/KioskShell";
import { Panel, PreviewButton, StatusPill } from "@/components/admin/ui";
import { CHECKINS, ROOMS, STATION } from "@/lib/checkin/mock";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Rooms" };

/**
 * Volunteer roster — the laptop behind the desk and the tablet in each
 * room. Counts against capacity, allergies up front, and a way to page a
 * parent during the service without leaving the room.
 */
export default function CheckinRooms() {
  const inRoom = (key: string) =>
    CHECKINS.filter((c) => c.roomKey === key && !c.pickedUp);
  const total = CHECKINS.filter((c) => !c.pickedUp).length;
  const allergies = CHECKINS.filter((c) => !c.pickedUp && c.allergies.length > 0).length;

  return (
    <KioskShell tone="paper" title="Young Lions · rooms">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
              {STATION.service} · {STATION.date}
            </p>
            <h1 className="u-display-dramatic text-ink mt-3 text-[clamp(2rem,4.5vw,3rem)]">
              {total} children checked in.
            </h1>
            <p className="text-stone mt-2 text-sm">
              {allergies} with allergies on file ·{" "}
              {CHECKINS.filter((c) => c.pickedUp).length} already picked up
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PreviewButton tone="ghost">Print roster</PreviewButton>
            <PreviewButton tone="gold">Page a parent</PreviewButton>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ROOMS.map((r) => {
            const kids = inRoom(r.key);
            const pct = Math.round((kids.length / r.capacity) * 100);
            return (
              <Panel
                key={r.key}
                title={`${r.name} · ${r.ages}`}
                aside={
                  <span className="font-mono text-xs tabular-nums">
                    {kids.length}/{r.capacity}
                  </span>
                }
              >
                <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--nh-bone)]">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      pct >= 90
                        ? "bg-[color:var(--nh-scarlet)]"
                        : "bg-[color:var(--nh-gold)]",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-fog mt-2 text-xs">{r.leader}</p>
                <ul className="mt-4 divide-y divide-[color:var(--nh-border)]">
                  {kids.map((c) => (
                    <li
                      key={c.child}
                      className="flex items-start justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-ink font-medium">{c.child}</p>
                        <p className="text-fog font-mono text-xs">
                          {c.code} · {c.at}
                        </p>
                        {c.allergies.length > 0 ? (
                          <p className="mt-1 text-xs font-semibold text-[color:var(--nh-scarlet-ink)]">
                            Allergy: {c.allergies.join(", ")}
                          </p>
                        ) : null}
                      </div>
                      <PreviewButton tone="ghost">Page</PreviewButton>
                    </li>
                  ))}
                  {kids.length === 0 ? (
                    <li className="text-fog py-2.5 text-sm">Empty</li>
                  ) : null}
                </ul>
              </Panel>
            );
          })}
        </div>

        <Panel title="Picked up" className="mt-6">
          <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
            {CHECKINS.filter((c) => c.pickedUp).map((c) => (
              <li key={c.child} className="flex items-center justify-between gap-4 py-2">
                <span className="text-ink">{c.child}</span>
                <span className="text-fog font-mono text-xs">{c.code}</span>
                <StatusPill status="done" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </KioskShell>
  );
}
