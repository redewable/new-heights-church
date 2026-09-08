"use client";

import { useActionState, useRef, useState } from "react";
import { submitConnectCard } from "@/app/(marketing)/connect/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { HOW_HEARD_OPTIONS } from "@/lib/schemas/connect-card";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { Select } from "./Select";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";

/**
 * Connect Card form. Server Action handles validation + database + email;
 * this component is the shell: label wiring, inline errors, success state.
 *
 * On success we swap the entire form for a warm confirmation message — the
 * same pattern used across every engagement flow. The warm message uses
 * the first-person voice we'd use at the door.
 */
export function ConnectCardForm({
  headingId = "connect-card-heading",
  showTitle = false,
}: {
  headingId?: string;
  showTitle?: boolean;
}) {
  const [state, action] = useActionState(submitConnectCard, INITIAL_FORM_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const [uaValue] = useState(readUserAgent);

  if (state.status === "success") {
    const firstTime = Boolean(state.data?.firstTime);
    return (
      <div className="u-display-soft rounded-[var(--radius-lg)] border border-[color:var(--nh-gold)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-10">
        {showTitle ? (
          <h2 id={headingId} className="sr-only">
            Connect card submitted
          </h2>
        ) : null}
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
          {firstTime ? "A seat is saved" : "We've got you"}
        </p>
        <p className="text-ink mt-5 text-[clamp(1.5rem,3.2vw,2.25rem)] leading-tight">
          {state.message}
        </p>
        <p className="text-stone mt-5 text-base leading-relaxed md:text-lg">
          Check your email in the next minute. Someone from the First Touch Team will
          follow up within 48 hours — and if it's Sunday already, tell a greeter it's your
          first time.
        </p>
      </div>
    );
  }

  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-6">
      {showTitle ? (
        <h2 id={headingId} className="sr-only">
          Connect card
        </h2>
      ) : null}

      {state.status === "error" ? (
        <FormNotice variant="error" title="Something's off">
          {state.message}
        </FormNotice>
      ) : null}

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
          required
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
        help="We send a welcome note and only follow-up messages — not a marketing list."
        error={fieldError("email")}
      />

      <TextInput
        id="phone"
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        help="Optional. Faster if you want a real conversation."
        error={fieldError("phone")}
      />

      <Select
        id="howHeard"
        label="How did you find us?"
        error={fieldError("howHeard")}
        defaultValue=""
        options={[
          { value: "", label: "— Pick one (optional) —" },
          ...HOW_HEARD_OPTIONS.map((o) => ({ value: o, label: o })),
        ]}
      />

      <Textarea
        id="prayerRequest"
        label="Anything to pray for you about?"
        help="Optional. We read every line."
        rows={4}
        error={fieldError("prayerRequest")}
      />

      <div className="grid gap-3">
        <Checkbox
          id="firstTime"
          label="This was my first time at New Heights"
          defaultChecked
        />
        <Checkbox id="wantsCall" label="I'd like a pastor to call me" />
        <Checkbox
          id="consentEmail"
          label="Send me a welcome note and service reminders"
          defaultChecked
        />
      </div>

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="connect-card" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="gold">Send my card</SubmitButton>
        <p className="text-fog text-xs leading-snug">
          By sending, you agree we can contact you at the email or phone you provided. We
          never share your info.
        </p>
      </div>
    </form>
  );
}
