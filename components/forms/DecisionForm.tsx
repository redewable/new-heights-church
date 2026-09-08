"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitDecision } from "@/app/(marketing)/connect/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { DECISION_TYPE_LABEL, DECISION_TYPES } from "@/lib/schemas/decision";
import { TextInput } from "./TextInput";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";
import { cn } from "@/lib/utils/cn";

/**
 * Decision capture. RFP §9.3 says this flow is sacred — keep required
 * fields to decision type + first name; everything else can be collected
 * on the follow-up page. The tile selector below is a radiogroup; the
 * first option (salvation) is focused by default because that's the
 * capital-H Harvest moment and the page exists to serve it.
 */
export function DecisionForm({
  channel,
}: {
  /** in_person or online — pre-filled based on where the form is embedded. */
  channel?: "in_person" | "online";
}) {
  const [state, action] = useActionState(submitDecision, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);
  const [selectedType, setSelectedType] =
    useState<(typeof DECISION_TYPES)[number]>("salvation");

  if (state.status === "success") {
    const next = state.nextHref ?? "/connect/decision/next";
    return (
      <div className="motif-altar-glow relative rounded-[var(--radius-xl)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-12">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Heaven heard</p>
        <h2 className="u-display-dramatic text-ink mt-5 text-[clamp(2rem,4.5vw,3.5rem)]">
          {state.message}
        </h2>
        <p className="text-stone mt-6 max-w-[46ch] text-lg leading-relaxed md:text-xl">
          A pastor will reach out personally within 48 hours. Before they do, tell us
          where to send a small packet — a Bible, a letter from the pastors, and a map of
          the road ahead.
        </p>
        <div className="mt-8">
          <Link
            href={next}
            className="text-ink hover:text-cream inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-6 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
          >
            Take the next step →
          </Link>
        </div>
      </div>
    );
  }

  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;

  return (
    <form action={action} noValidate className="flex flex-col gap-8">
      {state.status === "error" ? (
        <FormNotice variant="error" title="Something's off">
          {state.message}
        </FormNotice>
      ) : null}

      {/* Decision-type selector — visually a radiogroup */}
      <fieldset>
        <legend className="text-ink font-display text-xl md:text-2xl">
          What just happened?
        </legend>
        <p className="text-stone mt-2 text-base">Pick the one that fits.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {DECISION_TYPES.map((t) => (
            <label
              key={t}
              className={cn(
                "group flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border p-5 transition-colors",
                selectedType === t
                  ? "border-[color:var(--nh-gold)] bg-[color:var(--nh-gold-soft)]/40"
                  : "bg-paper border-[color:var(--nh-border)] hover:border-[color:var(--nh-ink)]",
              )}
            >
              <input
                type="radio"
                name="decisionType"
                value={t}
                checked={selectedType === t}
                onChange={() => setSelectedType(t)}
                className="sr-only"
                required
              />
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  selectedType === t
                    ? "border-[color:var(--nh-gold-ink)] bg-[color:var(--nh-gold)]"
                    : "border-[color:var(--nh-border)]",
                )}
              >
                {selectedType === t ? (
                  <span className="h-2 w-2 rounded-full bg-[color:var(--nh-ink)]" />
                ) : null}
              </span>
              <span className="text-ink flex-1 text-base leading-snug">
                {DECISION_TYPE_LABEL[t]}
              </span>
            </label>
          ))}
        </div>
        {fieldError("decisionType") ? (
          <p role="alert" className="mt-3 text-sm text-[color:var(--nh-scarlet-ink)]">
            {fieldError("decisionType")}
          </p>
        ) : null}
      </fieldset>

      {/* Name only at this stage — channel is hidden */}
      <TextInput
        id="firstName"
        label="Your first name"
        required
        autoComplete="given-name"
        help="That's all we need right now. We'll ask for more on the next page."
        error={fieldError("firstName")}
      />

      {channel ? <input type="hidden" name="serviceChannel" value={channel} /> : null}
      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="decision" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="gold" size="lg">
          Say yes
        </SubmitButton>
        <p className="text-fog text-xs leading-snug">
          We never share this. Heaven and our pastoral team — that's it.
        </p>
      </div>
    </form>
  );
}
