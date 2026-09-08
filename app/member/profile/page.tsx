import type { Metadata } from "next";
import { MemberShell } from "@/components/member/MemberShell";
import { Panel, PreviewButton } from "@/components/admin/ui";
import { MEMBER } from "@/lib/member/mock";

export const metadata: Metadata = { title: "Profile" };

export default function MemberProfile() {
  const prefs = [
    { key: "email", label: "Email from the church", on: MEMBER.preferences.email },
    {
      key: "sms",
      label: "Text messages (keyword opt-in only)",
      on: MEMBER.preferences.sms,
    },
    { key: "newsletter", label: "Weekly newsletter", on: MEMBER.preferences.newsletter },
  ];
  return (
    <MemberShell>
      <header>
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Profile</p>
        <h1 className="u-display-dramatic text-ink mt-3 text-[clamp(2rem,4.5vw,3rem)]">
          {MEMBER.firstName} {MEMBER.lastName}.
        </h1>
        <p className="text-stone mt-3 max-w-[56ch]">
          What the church has on file. Changes here update Planning Center, so the office
          always has the right number.
        </p>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Panel title="Contact" aside={<PreviewButton tone="ghost">Edit</PreviewButton>}>
          <dl className="grid grid-cols-[7rem_1fr] gap-y-3 text-sm">
            <dt className="u-eyebrow text-fog">Email</dt>
            <dd className="text-ink font-mono">{MEMBER.email}</dd>
            <dt className="u-eyebrow text-fog">Phone</dt>
            <dd className="text-ink font-mono">{MEMBER.phone}</dd>
            <dt className="u-eyebrow text-fog">Household</dt>
            <dd className="text-ink">{MEMBER.household}</dd>
            <dt className="u-eyebrow text-fog">Member since</dt>
            <dd className="text-ink font-mono">{MEMBER.memberSince}</dd>
          </dl>
        </Panel>
        <Panel title="How we reach you">
          <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
            {prefs.map((p) => (
              <li key={p.key} className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-ink">{p.label}</span>
                <span
                  role="switch"
                  aria-checked={p.on}
                  aria-disabled="true"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${p.on ? "bg-[color:var(--nh-gold)]" : "bg-[color:var(--nh-bone)]"}`}
                >
                  <span
                    className={`bg-paper h-5 w-5 rounded-full shadow transition-transform ${p.on ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </span>
              </li>
            ))}
          </ul>
          <p className="text-fog mt-3 text-xs">
            Text messages are never on by default. You opt in with a keyword; one reply
            opts you out.
          </p>
        </Panel>
      </div>
    </MemberShell>
  );
}
