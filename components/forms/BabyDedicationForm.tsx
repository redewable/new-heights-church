"use client";

import { useActionState, useState } from "react";
import { submitBabyDedication } from "@/app/(marketing)/grow/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";

export function BabyDedicationForm() {
  const [state, action] = useActionState(submitBabyDedication, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);

  if (state.status === "success") {
    return (
      <div className="motif-altar-glow rounded-[var(--radius-xl)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-12">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Received</p>
        <h2 className="u-display-dramatic text-ink mt-5 text-[clamp(1.75rem,4vw,2.75rem)]">
          {state.message}
        </h2>
        <p className="text-stone mt-6 max-w-[46ch] text-lg leading-relaxed md:text-xl">
          We stand with your family on this. A pastor will confirm the Sunday and walk
          through who you want up there with you.
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

      <fieldset>
        <legend className="text-ink font-display text-xl md:text-2xl">Parents</legend>
        <p className="text-stone mt-2 text-base">
          Whoever is bringing the child to the altar.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextInput
            id="parentFirstName"
            label="Your first name"
            required
            autoComplete="given-name"
            error={fieldError("parentFirstName")}
          />
          <TextInput
            id="parentLastName"
            label="Your last name"
            required
            autoComplete="family-name"
            error={fieldError("parentLastName")}
          />
          <TextInput
            id="partnerFirstName"
            label="Partner's first name"
            autoComplete="off"
            error={fieldError("partnerFirstName")}
          />
          <TextInput
            id="partnerLastName"
            label="Partner's last name"
            autoComplete="off"
            error={fieldError("partnerLastName")}
          />
        </div>
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
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
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          help="We coordinate by phone the week of."
          error={fieldError("phone")}
        />
      </div>

      <fieldset>
        <legend className="text-ink font-display text-xl md:text-2xl">Child</legend>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextInput
            id="childFirstName"
            label="Child's first name"
            required
            error={fieldError("childFirstName")}
          />
          <TextInput
            id="childLastName"
            label="Child's last name"
            error={fieldError("childLastName")}
          />
          <TextInput
            id="childDateOfBirth"
            label="Child's date of birth"
            type="date"
            error={fieldError("childDateOfBirth")}
          />
          <TextInput
            id="preferredServiceDate"
            label="Preferred Sunday (optional)"
            type="date"
            help="We'll confirm and may suggest another if that one's full."
            error={fieldError("preferredServiceDate")}
          />
        </div>
      </fieldset>

      <Textarea
        id="notes"
        label="Anything we should know?"
        rows={4}
        help="Optional. Family traveling in, a specific pastor you'd like praying, any sensitivities."
        error={fieldError("notes")}
      />

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="connect-card" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="primary">Send our family's info</SubmitButton>
        <p className="text-fog text-xs leading-snug">
          A pastor will reach out to confirm. Nothing is booked until you confirm with the
          Church.
        </p>
      </div>
    </form>
  );
}
