import type { Metadata } from "next";
import Link from "next/link";
import { KioskShell } from "@/components/checkin/KioskShell";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { HOUSEHOLD, ROOMS, STATION } from "@/lib/checkin/mock";

export const metadata: Metadata = { title: "Your family" };

/**
 * Household found. Children are big tap targets with the room already
 * chosen from their grade; allergies show in scarlet so the room lead
 * sees them before the child does. Below, exactly what prints.
 */
export default function CheckinHousehold() {
  const room = (key: string) => ROOMS.find((r) => r.key === key)!;
  return (
    <KioskShell>
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="u-eyebrow text-[color:var(--nh-gold)]">
              Found · {HOUSEHOLD.parents.join(" & ")}
            </p>
            <h1 className="u-display-dramatic text-cream mt-3 text-[clamp(2.25rem,5vw,3.75rem)]">
              {HOUSEHOLD.name}.
            </h1>
          </div>
          <Link
            href="/checkin"
            className="text-cream/70 hover:text-cream text-sm underline-offset-4 hover:underline"
          >
            Not you? Start over
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {HOUSEHOLD.children.map((c) => {
            const r = room(c.roomKey);
            return (
              <li
                key={c.id}
                className="flex items-start gap-4 rounded-[var(--radius-lg)] border-2 border-[color:var(--nh-gold)] bg-white/[0.04] p-5"
              >
                <span
                  aria-hidden="true"
                  className="text-ink mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] text-lg font-bold"
                >
                  ✓
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-cream text-2xl">{c.name}</p>
                  <p className="text-cream/75 mt-1 text-sm">
                    Age {c.age} · {c.grade} →{" "}
                    <span className="text-cream font-semibold">{r.name}</span>
                    <span className="text-cream/50"> · ages {r.ages}</span>
                  </p>
                  {c.allergies.length > 0 ? (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--nh-scarlet)] px-3 py-1 text-xs font-semibold">
                      Allergy · {c.allergies.join(", ")}
                    </p>
                  ) : null}
                  {c.notes ? (
                    <p className="text-cream/60 mt-2 text-xs">{c.notes}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled
            title="Preview — tags don't print yet"
            className="text-ink inline-flex h-14 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-8 text-lg font-semibold opacity-90"
          >
            Check in {HOUSEHOLD.children.length} children · print tags
          </button>
          <span className="text-cream/60 text-sm">
            Two child tags and one parent tag. Same code on all three.
          </span>
        </div>

        {/* ---- What prints ---- */}
        <section aria-labelledby="tags-heading" className="mt-12">
          <p id="tags-heading" className="u-eyebrow text-cream/60">
            What prints
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {HOUSEHOLD.children.map((c) => {
              const r = room(c.roomKey);
              return (
                <div
                  key={c.id}
                  className="bg-paper text-ink rounded-[var(--radius)] p-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex items-center justify-between">
                    <AscendingBars
                      size={16}
                      className="text-[color:var(--nh-gold-ink)]"
                      aria-label=""
                    />
                    <span className="u-eyebrow text-fog">Child</span>
                  </div>
                  <p className="font-display mt-3 text-2xl leading-tight">{c.name}</p>
                  <p className="text-stone text-sm">
                    {r.name} · {STATION.service}
                  </p>
                  {c.allergies.length > 0 ? (
                    <p className="mt-2 inline-block rounded-sm bg-[color:var(--nh-scarlet)] px-2 py-0.5 text-xs font-bold text-white uppercase">
                      Allergy: {c.allergies.join(", ")}
                    </p>
                  ) : null}
                  <p className="mt-4 font-mono text-xl font-semibold tracking-[0.15em]">
                    {HOUSEHOLD.code}
                  </p>
                </div>
              );
            })}
            <div className="bg-paper text-ink rounded-[var(--radius)] border-2 border-dashed border-[color:var(--nh-gold)] p-4">
              <div className="flex items-center justify-between">
                <AscendingBars
                  size={16}
                  className="text-[color:var(--nh-gold-ink)]"
                  aria-label=""
                />
                <span className="u-eyebrow text-fog">Parent · pickup</span>
              </div>
              <p className="font-display mt-3 text-2xl leading-tight">{HOUSEHOLD.name}</p>
              <p className="text-stone text-sm">
                {HOUSEHOLD.children.map((c) => c.name.split(" ")[0]).join(" · ")}
              </p>
              <p className="mt-4 font-mono text-xl font-semibold tracking-[0.15em]">
                {HOUSEHOLD.code}
              </p>
              <p className="text-fog mt-2 text-xs">
                Bring this tag to the room. No tag, no pickup — for their sake.
              </p>
            </div>
          </div>
        </section>
      </div>
    </KioskShell>
  );
}
