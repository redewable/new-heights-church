"use client";

import { useActionState, useState } from "react";
import { submitVolunteerApplication } from "@/app/(marketing)/grow/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { MINISTRY_AREA_LABEL, MINISTRY_AREAS } from "@/lib/schemas/volunteer";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";

export function VolunteerForm() {
  const [state, action] = useActionState(submitVolunteerApplication, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);

  if (state.status === "success") {
    return (
      <div className="motif-altar-glow rounded-[var(--radius-xl)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-12">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">In the queue</p>
        <h2 className="u-display-dramatic text-ink mt-5 text-[clamp(1.75rem,4vw,2.75rem)]">
          {state.message}
        </h2>
        <p className="text-stone mt-6 max-w-[46ch] text-lg leading-relaxed md:text-xl">
          We keep the serve path tight on purpose — New to New Heights, Foundations of
          Faith, then the team. If you haven't hit those yet, a coordinator will line them
          up for you.
        </p>
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
          error={fieldError("phone")}
        />
      </div>

      <fieldset>
        <legend className="text-ink font-display text-xl md:text-2xl">
          Where do you want to serve?
        </legend>
        <p className="text-stone mt-2 text-base">
          Pick every area that interests you; coordinators will place you.
        </p>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {MINISTRY_AREAS.map((a) => (
            <Checkbox
              key={a}
              id={`ministry-${a}`}
              name="ministryAreas"
              value={a}
              label={MINISTRY_AREA_LABEL[a]}
            />
          ))}
        </div>
        {fieldError("ministryAreas") ? (
          <p role="alert" className="mt-3 text-sm text-[color:var(--nh-scarlet-ink)]">
            {fieldError("ministryAreas")}
          </p>
        ) : null}
      </fieldset>

      <Textarea
        id="availability"
        label="When are you typically available?"
        rows={3}
        help="Optional. Sundays before/after service, Wednesdays, once a month, etc."
        error={fieldError("availability")}
      />

      <fieldset>
        <legend className="u-eyebrow text-[color:var(--nh-gold-ink)]">
          Serve-path prerequisites
        </legend>
        <p className="text-stone mt-2 text-sm">
          We ask everyone to complete both before joining a team. If you haven't finished
          them yet, tell us here anyway — a coordinator will line up the next cohort.
        </p>
        <div className="mt-5 grid gap-3">
          <Checkbox id="completedN2N" label="I've completed New to New Heights" />
          <Checkbox
            id="completedFoundations"
            label="I've completed Foundations of Faith"
          />
        </div>
      </fieldset>

      <Checkbox
        id="backgroundCheckConsent"
        label="I consent to a background check for kids/youth-facing roles"
        help="Required for Young Lions, Youth Army, and any role working with minors."
      />

      <Textarea
        id="notes"
        label="Anything else we should know?"
        rows={3}
        help="Optional. Experience, constraints, a heart for a specific ministry."
        error={fieldError("notes")}
      />

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="connect-card" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="primary">Apply to serve</SubmitButton>
      </div>
    </form>
  );
}
