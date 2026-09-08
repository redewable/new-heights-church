"use client";

import { useActionState, useState } from "react";
import { submitBaptismInterest } from "@/app/(marketing)/grow/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";

export function BaptismInterestForm() {
  const [state, action] = useActionState(submitBaptismInterest, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);
  const [isMinor, setIsMinor] = useState(false);

  if (state.status === "success") {
    return (
      <div className="motif-altar-glow rounded-[var(--radius-xl)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-12">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">On the list</p>
        <h2 className="u-display-dramatic text-ink mt-5 text-[clamp(1.75rem,4vw,2.75rem)]">
          {state.message}
        </h2>
        <p className="text-stone mt-6 max-w-[46ch] text-lg leading-relaxed md:text-xl">
          We baptize regularly — the next service is close. A pastor will confirm the date
          and walk you through what the morning looks like. Bring everyone you want to
          stand with you.
        </p>
      </div>
    );
  }

  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;

  return (
    <form action={action} noValidate className="flex flex-col gap-6">
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
      <TextInput
        id="dateOfBirth"
        label="Date of birth"
        type="date"
        help="Optional. If you're under 18, we'll ask for a parent or guardian below."
        onChange={(e) => {
          const v = e.currentTarget.value;
          if (!v) {
            setIsMinor(false);
            return;
          }
          const dob = new Date(v);
          if (Number.isNaN(dob.getTime())) return;
          const years = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
          setIsMinor(years < 18);
        }}
        error={fieldError("dateOfBirth")}
      />

      {isMinor ? (
        <div className="grid gap-5 rounded-[var(--radius-lg)] border border-[color:var(--nh-bronze)] bg-[color:var(--nh-bronze-soft)]/40 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Checkbox
              id="parentConsent"
              label="A parent or legal guardian gives consent for this baptism"
              help="Required for anyone under 18."
            />
          </div>
          <TextInput
            id="parentName"
            label="Parent or guardian name"
            autoComplete="name"
            error={fieldError("parentName")}
          />
          <TextInput
            id="parentPhone"
            label="Parent or guardian phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            error={fieldError("parentPhone")}
          />
        </div>
      ) : null}

      <Textarea
        id="testimony"
        label="A short testimony"
        rows={5}
        help="Optional. A couple of sentences on your story with Jesus — what He's done, what you're stepping into."
        error={fieldError("testimony")}
      />

      <TextInput
        id="preferredService"
        label="A Sunday you already have in mind"
        help="Optional. Leave blank and we'll match you to the next one."
        error={fieldError("preferredService")}
      />

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="decision" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="gold">Put me on the list</SubmitButton>
        <p className="text-fog text-xs leading-snug">
          A pastor will reach out personally. Nothing is booked until you and the Church
          confirm the date.
        </p>
      </div>
    </form>
  );
}
