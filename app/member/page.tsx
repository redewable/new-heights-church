import Link from "next/link";
import { MemberShell } from "@/components/member/MemberShell";
import { Panel, PreviewButton, StatusPill, formatUsd } from "@/components/admin/ui";
import { AscendingBars } from "@/components/brand/AscendingBars";
import {
  FAMILY,
  GIVING,
  MEMBER,
  PATH,
  PRAYER,
  REGISTRATIONS,
  SERVING,
} from "@/lib/member/mock";
import { CHURCH } from "@/lib/constants/church";
import { cn } from "@/lib/utils/cn";

function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    ...opts,
  }).format(new Date(iso));
}

export default function MemberHome() {
  const nextServe = SERVING.upcoming[0];
  const current = PATH.find((p) => p.state === "current");

  return (
    <MemberShell>
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
            {MEMBER.household} · Planted since {MEMBER.plantedSince}
          </p>
          <h1 className="u-display-dramatic text-ink mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">
            Welcome home, {MEMBER.firstName}.
          </h1>
          <p className="text-stone mt-3 max-w-[52ch]">
            Sunday is at 10. You&rsquo;re on the front doors this week, the Sample
            children are set for Young Lions, and Activated is eleven days out.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/watch"
            className="text-ink inline-flex h-11 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-5 text-sm font-semibold"
          >
            Watch live
          </Link>
          <Link
            href="/connect/prayer"
            className="text-ink bg-paper inline-flex h-11 items-center rounded-[var(--radius-sm)] border border-[color:var(--nh-border)] px-5 text-sm font-semibold"
          >
            Ask for prayer
          </Link>
        </div>
      </header>

      {/* ---- The path ---- */}
      <section aria-labelledby="path-heading" className="mt-12">
        <div className="flex items-center gap-4 text-[color:var(--nh-gold-ink)]">
          <span aria-hidden="true" className="u-rule-gold w-12" />
          <h2 id="path-heading" className="u-eyebrow">
            Your path
          </h2>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PATH.map((step, i) => (
            <li
              key={step.key}
              className={cn(
                "rounded-[var(--radius-lg)] border p-4",
                step.state === "done" && "bg-paper border-[color:var(--nh-border)]",
                step.state === "current" && "bg-ink text-cream border-ink",
                step.state === "next" && "border-dashed border-[color:var(--nh-border)]",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "u-eyebrow",
                    step.state === "current" ? "text-[color:var(--nh-gold)]" : "text-fog",
                  )}
                >
                  {["I", "II", "III", "IV", "V", "VI"][i]}
                </span>
                {step.state === "done" ? (
                  <span aria-label="Done" className="text-[color:var(--nh-gold-ink)]">
                    ✓
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  "font-display mt-2 text-xl",
                  step.state === "next" && "text-stone",
                )}
              >
                {step.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  step.state === "current" ? "text-cream/75" : "text-fog",
                )}
              >
                {step.when ?? step.detail}
              </p>
            </li>
          ))}
        </ol>
        {current ? (
          <p className="text-stone mt-4 text-sm">
            Right now: <span className="text-ink font-medium">{current.detail}</span>.
            Next step is being sent — ask your team lead about leading a group or a class.
          </p>
        ) : null}
      </section>

      {/* ---- This week ---- */}
      <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Panel title="Next Sunday">
          <p className="font-display text-ink text-2xl">Sept 13 · 10 AM</p>
          <p className="text-stone mt-2 text-sm">
            You serve: <span className="text-ink font-medium">{nextServe.role}</span> ·
            arrive {nextServe.arrive}
          </p>
          <Link
            href="/member/serve"
            className="mt-4 inline-block text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
          >
            Serving schedule →
          </Link>
        </Panel>
        <Panel title="Young Lions">
          <p className="font-display text-ink text-2xl">
            {FAMILY.children.length} children
          </p>
          <p className="text-stone mt-2 text-sm">
            Family code{" "}
            <span className="text-ink font-mono font-semibold">{FAMILY.code}</span> · show
            it at the desk
          </p>
          <Link
            href="/member/family"
            className="mt-4 inline-block text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
          >
            Family & check-in →
          </Link>
        </Panel>
        <Panel title="Life Group">
          <p className="font-display text-ink text-2xl">
            {fmt(MEMBER.lifeGroup.next, { weekday: "long" })}
          </p>
          <p className="text-stone mt-2 text-sm">
            {MEMBER.lifeGroup.name} ·{" "}
            {fmt(MEMBER.lifeGroup.next, { hour: "numeric", minute: "2-digit" })}
          </p>
          <Link
            href="/grow/life-groups"
            className="mt-4 inline-block text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
          >
            Group details →
          </Link>
        </Panel>
        <Panel title="Registered">
          {REGISTRATIONS.map((r) => (
            <div key={r.slug}>
              <p className="font-display text-ink text-2xl">{r.event}</p>
              <p className="text-stone mt-2 text-sm">
                {r.when} · {r.seats} seats · {r.platform}
              </p>
              <Link
                href={`/events/${r.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
              >
                Event page →
              </Link>
            </div>
          ))}
        </Panel>
      </section>

      {/* ---- Giving + prayer ---- */}
      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Panel
          title="Giving"
          aside={
            <Link
              href="/member/giving"
              className="text-sm font-semibold text-[color:var(--nh-gold-ink)] hover:underline"
            >
              Full history →
            </Link>
          }
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="u-eyebrow text-fog">Year to date</p>
              <p className="text-ink mt-1 font-mono text-2xl font-semibold tabular-nums">
                {formatUsd(GIVING.ytd)}
              </p>
            </div>
            <div>
              <p className="u-eyebrow text-fog">Recurring</p>
              <p className="text-ink mt-1 font-mono text-2xl font-semibold tabular-nums">
                {formatUsd(GIVING.recurring.amount)}
              </p>
              <p className="text-fog text-xs">
                {GIVING.recurring.cadence} · next {GIVING.recurring.nextDate}
              </p>
            </div>
            <div>
              <p className="u-eyebrow text-fog">{GIVING.pledge.campaign}</p>
              <p className="text-ink mt-1 font-mono text-2xl font-semibold tabular-nums">
                {Math.round(GIVING.pledge.fulfilled * 100)}%
              </p>
              <p className="text-fog text-xs">of your pledge, fulfilled</p>
            </div>
          </div>
          <p className="text-fog mt-5 text-xs">
            Gifts are processed by Pushpay. We never touch your card — this page reads the
            record.
          </p>
        </Panel>
        <Panel
          title="Prayer"
          aside={<PreviewButton tone="ghost">New request</PreviewButton>}
        >
          <ul className="divide-y divide-[color:var(--nh-border)] text-sm">
            {PRAYER.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4 py-2">
                <div>
                  <p className="text-ink font-medium">{p.summary}</p>
                  <p className="text-fog text-xs">
                    Submitted {p.submitted} · {p.status}
                  </p>
                </div>
                <StatusPill status={p.open ? "open" : "done"} />
              </li>
            ))}
          </ul>
          <p className="text-stone mt-4 text-sm">
            The prayer team prays over every request on Wednesday night. Nothing you send
            here is shared without your yes.
          </p>
        </Panel>
      </section>

      <section className="mt-12 flex items-center gap-3 text-[color:var(--nh-gold-ink)]">
        <AscendingBars size={18} tone="pillars" aria-label="" />
        <p className="u-eyebrow">{CHURCH.tagline}</p>
      </section>
    </MemberShell>
  );
}
