"use client";

import { useActionState, useState } from "react";
import { submitPrayerRequest } from "@/app/(marketing)/connect/actions";
import { INITIAL_FORM_STATE } from "@/lib/schemas/shared";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { SubmitButton } from "./SubmitButton";
import { Honeypot } from "./Honeypot";
import { TurnstileWidget } from "./TurnstileWidget";
import { FormNotice } from "./FormShell";
import { readUserAgent } from "./user-agent";

export function PrayerRequestForm() {
  const [state, action] = useActionState(submitPrayerRequest, INITIAL_FORM_STATE);
  const [uaValue] = useState(readUserAgent);
  const [anonymous, setAnonymous] = useState(false);

  if (state.status === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--nh-purple)] bg-[color:var(--nh-purple-soft)]/50 p-8 md:p-10">
        <p className="u-eyebrow text-[color:var(--nh-purple-ink)]">
          Received · Held in confidence
        </p>
        <p className="u-display-soft text-ink mt-5 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
          {state.message}
        </p>
        <p className="text-stone mt-6 leading-relaxed">
          Our prayer team meets weekly and covers every request together. If you left an
          email and asked for follow-up, we'll reach back when we have something to share.
        </p>
        <p className="text-fog mt-6 text-sm italic">
          &ldquo;The effectual fervent prayer of a righteous man availeth much.&rdquo; —
          James 5:16
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
          id="name"
          label="Your name"
          help="Optional. Skip if you'd rather stay anonymous."
          autoComplete="name"
          disabled={anonymous}
          error={fieldError("name")}
        />
        <TextInput
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          help="Optional. We only use it to reply."
          disabled={anonymous}
          error={fieldError("email")}
        />
      </div>

      <Textarea
        id="request"
        label="What can we pray with you for?"
        required
        rows={6}
        help="There's no such thing as too small. We take every line seriously."
        error={fieldError("request")}
      />

      <div className="grid gap-3">
        <Checkbox
          id="urgent"
          label="This is urgent — please pray now"
          help="The prayer team is notified immediately on urgent requests."
        />
        <Checkbox
          id="shareAnonymously"
          label="Share with the prayer team, but keep my name private"
          help="We won't attach your name to the request when the team prays."
          onChange={(e) => setAnonymous(e.currentTarget.checked)}
        />
        <Checkbox
          id="consentFollowup"
          label="It's OK for the team to reach back with encouragement"
          defaultChecked
        />
      </div>

      <input type="hidden" name="__userAgent" value={uaValue} readOnly />
      <Honeypot />
      <TurnstileWidget action="prayer" />

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <SubmitButton variant="primary">Send my request</SubmitButton>
        <p className="text-fog text-xs leading-snug">
          Prayer requests are held in confidence by our intercessory team.
        </p>
      </div>
    </form>
  );
}
