"use client";

import { useActionState, useState } from "react";
import { submitPledge } from "@/app/(marketing)/give/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { PLEDGE_FREQUENCIES, PLEDGE_FREQUENCY_LABEL } from "@/lib/schemas/pledge";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";
import { cn } from "@/lib/utils/cn";

const SUGGESTED_AMOUNTS = [50, 100, 250, 500, 1000, 2500] as const;

export function PledgeForm({
  campaign,
  campaignTitle,
}: {
  campaign: string;
  campaignTitle: string;
}) {
  const [state, action] = useActionState(submitPledge, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);
  const [amount, setAmount] = useState<string>("");
  const [frequency, setFrequency] =
    useState<(typeof PLEDGE_FREQUENCIES)[number]>("monthly");

  if (state.status === "success") {
    const href = typeof state.data?.href === "string" ? state.data.href : "#";
    return (
      <div className="motif-altar-glow rounded-[var(--radius-xl)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-12">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Pledge received</p>
        <h2 className="u-display-dramatic text-ink mt-5 text-[clamp(1.75rem,4vw,2.75rem)]">
          {state.message}
        </h2>
        <p className="text-stone mt-6 max-w-[46ch] text-lg leading-relaxed md:text-xl">
          A pledge is intent, not payment. To finish setting up the actual gift, open our
          Pushpay portal — it remembers the amount and cadence.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink hover:text-cream mt-8 inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-6 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
        >
          Finish on Pushpay →
        </a>
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

      <input type="hidden" name="campaign" value={campaign} />

      {/* Amount — suggested pills + free-form override */}
      <fieldset>
        <legend className="text-ink font-display text-xl md:text-2xl">
          What are you pledging to {campaignTitle}?
        </legend>
        <p className="text-stone mt-2 text-base">
          Pick a starting point or type your own.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTED_AMOUNTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(String(v))}
              className={cn(
                "inline-flex h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                amount === String(v)
                  ? "border-ink bg-ink text-cream"
                  : "bg-paper text-ink hover:border-ink border-[color:var(--nh-border)]",
              )}
            >
              ${v.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="mt-5 max-w-[14rem]">
          <label htmlFor="amount" className="sr-only">
            Pledge amount (USD)
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="text-fog absolute top-1/2 left-4 -translate-y-1/2 text-lg"
            >
              $
            </span>
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              aria-invalid={Boolean(fieldError("amount")) || undefined}
              className={cn(
                "bg-paper text-ink h-14 w-full rounded-[var(--radius)] border border-[color:var(--nh-border)] pr-4 pl-9 text-2xl font-semibold outline-none focus-visible:border-[color:var(--nh-ink)] focus-visible:ring-2 focus-visible:ring-[color:var(--nh-gold)]",
                fieldError("amount") &&
                  "border-[color:var(--nh-scarlet)] bg-[color:var(--nh-scarlet-soft)]/40",
              )}
            />
          </div>
          {fieldError("amount") ? (
            <p role="alert" className="mt-2 text-sm text-[color:var(--nh-scarlet-ink)]">
              {fieldError("amount")}
            </p>
          ) : null}
        </div>
      </fieldset>

      {/* Frequency */}
      <fieldset>
        <legend className="text-ink font-display text-xl">How often?</legend>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PLEDGE_FREQUENCIES.map((f) => (
            <label
              key={f}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[var(--radius-lg)] border px-5 py-4 transition-colors",
                frequency === f
                  ? "border-[color:var(--nh-gold)] bg-[color:var(--nh-gold-soft)]/40"
                  : "bg-paper hover:border-ink border-[color:var(--nh-border)]",
              )}
            >
              <input
                type="radio"
                name="frequency"
                value={f}
                checked={frequency === f}
                onChange={() => setFrequency(f)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  frequency === f
                    ? "border-[color:var(--nh-gold-ink)] bg-[color:var(--nh-gold)]"
                    : "border-[color:var(--nh-border)]",
                )}
              >
                {frequency === f ? (
                  <span className="h-2 w-2 rounded-full bg-[color:var(--nh-ink)]" />
                ) : null}
              </span>
              <span className="text-ink text-base">{PLEDGE_FREQUENCY_LABEL[f]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Contact */}
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          id="firstName"
          label="First name"
          required
          autoComplete="given-name"
          error={fieldError("firstName")}
        />
        <TextInput
          id="lastName"
          label="Last name"
          autoComplete="family-name"
          error={fieldError("lastName")}
        />
      </div>
      <TextInput
        id="email"
        label="Email"
        required
        type="email"
        inputMode="email"
        autoComplete="email"
        help="We'll send a Pushpay link to set up the gift."
        error={fieldError("email")}
      />
      <TextInput
        id="phone"
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={fieldError("phone")}
      />

      <Textarea
        id="note"
        label="A word with the pastors"
        help="Optional. What the Lord has said to you about this gift."
        rows={3}
        error={fieldError("note")}
      />

      <Checkbox
        id="consentFollowup"
        label="It's OK for a pastor to reach out about this pledge"
        defaultChecked
      />

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="decision" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="gold" size="lg">
          Send my pledge
        </SubmitButton>
        <p className="text-fog text-xs leading-snug">
          Your card never touches this site. We email you a Pushpay link to finish the
          actual gift on your own time.
        </p>
      </div>
    </form>
  );
}
