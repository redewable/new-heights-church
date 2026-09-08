"use client";

import { useActionState, useState } from "react";
import { submitDecisionFollowUp } from "@/app/(marketing)/connect/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";

/**
 * Follow-up form on /connect/decision/next. We already have the decision
 * in Supabase from the previous step — this collects the contact and
 * mailing details so a pastor can reach out and the Bible packet can ship.
 */
export function DecisionFollowUpForm({ decisionId }: { decisionId: string }) {
  const [state, action] = useActionState(submitDecisionFollowUp, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);

  if (state.status === "success") {
    return (
      <div className="motif-altar-glow rounded-[var(--radius-lg)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-10">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">
          Done · A pastor will reach out
        </p>
        <p className="u-display-soft text-ink mt-5 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
          {state.message}
        </p>
        <p className="text-stone mt-6 leading-relaxed">
          In the meantime, come Sunday. Sit anywhere. Stay for the altar. The rest, we
          walk together.
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

      <input type="hidden" name="decisionId" value={decisionId} />

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
        error={fieldError("email")}
      />
      <TextInput
        id="phone"
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        help="Optional. Easier if you'd like a call instead of an email."
        error={fieldError("phone")}
      />
      <Textarea
        id="address"
        label="Mailing address"
        help="For the packet. We ship a Bible and a letter from Apostle Brian and Crystal."
        rows={4}
        autoComplete="street-address"
      />
      <Checkbox
        id="wantsCall"
        label="It's OK for a pastor to call me this week"
        defaultChecked
      />

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="decision" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="gold">That's me — send the packet</SubmitButton>
      </div>
    </form>
  );
}
