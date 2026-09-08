"use client";

import { useActionState, useState } from "react";
import { submitStatementRequest } from "@/app/(marketing)/give/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { availableTaxYears } from "@/lib/schemas/statement";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { Select } from "./Select";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";

export function StatementRequestForm() {
  const [state, action] = useActionState(submitStatementRequest, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);

  if (state.status === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--nh-gold)] bg-[color:var(--nh-gold-soft)]/40 p-8 md:p-10">
        <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Queued</p>
        <p className="u-display-soft text-ink mt-5 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
          {state.message}
        </p>
      </div>
    );
  }

  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;

  const years = availableTaxYears();

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
        help="Where we send the statement."
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
      <Select
        id="taxYear"
        label="Tax year"
        required
        defaultValue={String(years[0])}
        options={years.map((y) => ({ value: String(y), label: String(y) }))}
        error={fieldError("taxYear")}
      />
      <Textarea
        id="notes"
        label="Anything we should know?"
        rows={3}
        help="Optional. E.g. maiden name on older receipts, household filing preference, etc."
        error={fieldError("notes")}
      />

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="connect-card" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="primary">Request my statement</SubmitButton>
      </div>
    </form>
  );
}
