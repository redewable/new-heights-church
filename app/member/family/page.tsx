import type { Metadata } from "next";
import Link from "next/link";
import { MemberShell } from "@/components/member/MemberShell";
import { Panel, PreviewButton } from "@/components/admin/ui";
import { FamilyCode } from "@/components/checkin/FamilyCode";
import { FAMILY, MEMBER } from "@/lib/member/mock";

export const metadata: Metadata = { title: "Family & check-in" };

export default function MemberFamily() {
  return (
    <MemberShell>
      <header>
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Family & check-in</p>
        <h1 className="u-display-dramatic text-ink mt-3 text-[clamp(2rem,4.5vw,3rem)]">
          {MEMBER.household}.
        </h1>
        <p className="text-stone mt-3 max-w-[56ch]">
          Everyone in the household, the children&rsquo;s rooms, and the one code that
          checks them in downstairs.
        </p>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          <FamilyCode code={FAMILY.code} name={MEMBER.household} />
          <Panel title="Adults">
            <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
              {FAMILY.adults.map((a) => (
                <li key={a.name} className="flex items-center justify-between py-2">
                  <span className="text-ink font-medium">{a.name}</span>
                  <span className="text-fog text-xs">{a.role}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Authorized for pickup">
            <ul className="text-ink space-y-1 text-sm">
              {FAMILY.authorizedPickups.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="text-fog mt-3 text-xs">
              Only these people can pick up with your code. A volunteer checks a photo ID
              if they don&rsquo;t recognize the face.
            </p>
            <div className="mt-3">
              <PreviewButton tone="ghost">Add a person</PreviewButton>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel
            title="Children"
            aside={<PreviewButton tone="ghost">Add a child</PreviewButton>}
          >
            <ul className="divide-y divide-[color:var(--nh-border)]">
              {FAMILY.children.map((c) => (
                <li
                  key={c.name}
                  className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start"
                >
                  <div>
                    <p className="font-display text-ink text-xl">{c.name}</p>
                    <p className="text-stone mt-0.5 text-sm">
                      Age {c.age} · {c.grade} ·{" "}
                      <span className="text-ink font-medium">{c.room}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.allergies.map((a) => (
                        <StatusPill key={a} status="failed" />
                      ))}
                      {c.allergies.length > 0 ? (
                        <span className="text-xs font-semibold text-[color:var(--nh-scarlet-ink)]">
                          Allergy: {c.allergies.join(", ")}
                        </span>
                      ) : (
                        <span className="text-fog text-xs">No allergies on file</span>
                      )}
                    </div>
                    {c.notes ? (
                      <p className="text-fog mt-2 text-xs">
                        Note for the room: {c.notes}
                      </p>
                    ) : null}
                  </div>
                  <PreviewButton tone="ghost">Edit</PreviewButton>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="How check-in works">
            <ol className="text-stone list-decimal space-y-2 pl-5 text-sm">
              <li>Come downstairs to the Young Lions desk any time after 9:30.</li>
              <li>Show the family code above, or type your phone number on the kiosk.</li>
              <li>Two tags print: one for each child, one for you. The codes match.</li>
              <li>
                Bring your tag back to the room after the altar. Nobody leaves without it.
              </li>
            </ol>
            <Link
              href="/checkin"
              className="mt-4 inline-block text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
            >
              See the kiosk preview →
            </Link>
          </Panel>
        </div>
      </div>
    </MemberShell>
  );
}
