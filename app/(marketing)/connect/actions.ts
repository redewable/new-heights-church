"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateSubmission } from "@/lib/forms/submission";
import { ConnectCardSchema } from "@/lib/schemas/connect-card";
import { PrayerRequestSchema } from "@/lib/schemas/prayer";
import { DecisionFollowUpSchema, DecisionSchema } from "@/lib/schemas/decision";
import type { FormResult } from "@/lib/schemas/shared";
import { envelope, sendEmail } from "@/lib/email/resend";
import {
  connectCardAck,
  decisionAck,
  decisionPastoralNotify,
  prayerAck,
  prayerTeamNotify,
} from "@/lib/email/templates";
import { CHURCH } from "@/lib/constants/church";

/**
 * Server Actions for the engagement flows. Each:
 *   1. validates (Zod + honeypot + rate limit + Turnstile)
 *   2. writes to Supabase (source of truth — RFP §9: supabase first)
 *   3. fires Resend emails (ack + internal notify)
 *   4. enqueues downstream syncs (Planning Center, Mailchimp) in
 *      `submission_jobs` so Phase 4's worker can drain them
 *
 * Email failures are NEVER surfaced to the user. If Resend is down we still
 * saved the submission and the admin digest can pick it up.
 *
 * When Supabase itself isn't configured (local dev without creds), we fall
 * back to a "dry-run" path that still validates and still "sends" email
 * (logs to console) so we can exercise the full flow against fixtures.
 */

// ================================================================
// Connect Card (§9.1)
// ================================================================
export async function submitConnectCard(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: ConnectCardSchema,
    rateLimitKey: "connect-card",
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();

  if (db) {
    // NOTE on the `as never` casts below: supabase-js v2's generic resolves
    // our hand-typed Database.Tables["..."].Insert to `never` (same issue
    // the Phase 2 query layer hits on .select). Runtime shape is correct —
    // it mirrors the migration 1:1 — and the schema is Zod-validated before
    // we reach this line. Remove once `npx supabase gen types` runs against
    // the live project.
    const connectCardInsert = {
      first_name: d.firstName,
      last_name: d.lastName,
      email: d.email,
      phone: d.phone ?? null,
      how_heard: d.howHeard ?? null,
      first_time: d.firstTime,
      service_date: d.serviceDate ?? null,
      wants_call: d.wantsCall,
      prayer_request: d.prayerRequest ?? null,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };

    const { data, error } = await db
      .from("connect_cards")
      .insert(connectCardInsert as never)
      .select("id")
      .single();

    if (error) {
      return {
        status: "error",
        message:
          "We couldn't save that right now. Try again in a moment or call " +
          CHURCH.contact.phone +
          ".",
      };
    }

    // Enqueue Planning Center sync (drained by Phase 4 worker).
    await db.from("submission_jobs").insert({
      source_table: "connect_cards",
      source_id: (data as { id: string }).id,
      target: "planning_center",
      payload: {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        phone: d.phone ?? null,
        tags: d.firstTime
          ? ["Website Connect Card", "First-Time Guest"]
          : ["Website Connect Card"],
      },
    } as never);
  }

  // Fire-and-forget: guest ack + staff digest (handled server-side nightly in Phase 5).
  const env = envelope("connect");
  await sendEmail({
    to: d.email,
    from: env.from,
    replyTo: env.replyTo,
    subject: connectCardAck({
      firstName: d.firstName,
      isFirstTime: d.firstTime,
      wantsCall: d.wantsCall,
    }).subject,
    text: connectCardAck({
      firstName: d.firstName,
      isFirstTime: d.firstTime,
      wantsCall: d.wantsCall,
    }).text,
    html: connectCardAck({
      firstName: d.firstName,
      isFirstTime: d.firstTime,
      wantsCall: d.wantsCall,
    }).html,
    tags: [
      { name: "flow", value: "connect-card" },
      { name: "first_time", value: String(d.firstTime) },
    ],
  });

  revalidatePath("/connect");
  revalidatePath("/im-new");

  return {
    status: "success",
    message: d.firstTime
      ? `${d.firstName}, we've got it. Keep an eye on your inbox.`
      : `${d.firstName}, thanks — someone will reach back soon.`,
    data: { firstName: d.firstName, firstTime: d.firstTime },
  };
}

// ================================================================
// Prayer Request (§9.2)
// ================================================================
export async function submitPrayerRequest(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: PrayerRequestSchema,
    rateLimitKey: "prayer",
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  if (db) {
    // See note in submitConnectCard re: `as never` — same Supabase-generic
    // collapse, same schema-validated runtime shape.
    const prayerInsert = {
      name: d.shareAnonymously ? null : (d.name ?? null),
      email: d.shareAnonymously ? null : (d.email ?? null),
      request: d.request,
      urgent: d.urgent,
      share_anonymously: d.shareAnonymously,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };
    const { error } = await db.from("prayer_requests").insert(prayerInsert as never);

    if (error) {
      return {
        status: "error",
        message:
          "We couldn't save that right now. Try again in a moment — and know we're praying either way.",
      };
    }
  }

  const env = envelope("prayer");

  // Ack the requester, if they gave us an email.
  if (d.email && !d.shareAnonymously) {
    const ack = prayerAck({ name: d.name, hasFollowUp: d.consentFollowup });
    await sendEmail({
      to: d.email,
      from: env.from,
      replyTo: env.replyTo,
      subject: ack.subject,
      text: ack.text,
      html: ack.html,
      tags: [{ name: "flow", value: "prayer-ack" }],
    });
  }

  // Notify the prayer team inbox.
  const teamInbox = process.env.PRAYER_TEAM_INBOX?.trim();
  if (teamInbox) {
    const notify = prayerTeamNotify({
      name: d.name,
      email: d.email,
      urgent: d.urgent,
      request: d.request,
      anonymous: d.shareAnonymously,
    });
    await sendEmail({
      to: teamInbox,
      from: env.from,
      replyTo: env.replyTo,
      subject: notify.subject,
      text: notify.text,
      html: notify.html,
      tags: [
        { name: "flow", value: "prayer-team-notify" },
        { name: "urgent", value: String(d.urgent) },
      ],
    });
  }

  return {
    status: "success",
    message: d.name
      ? `${d.name}, your request is with the team. We're covering it.`
      : "Your request is with the team. We're covering it.",
  };
}

// ================================================================
// Decision Capture (§9.3) — sacred; extra care
// ================================================================
export async function submitDecision(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: DecisionSchema,
    rateLimitKey: "decision",
    // Decisions get a slightly more generous rate — it's sacred; if a youth
    // leader is capturing five kids in five minutes, that's a Sunday, not
    // an attack.
    rateLimitMax: 30,
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  let decisionId: string | undefined;

  if (db) {
    const decisionInsert = {
      decision_type: d.decisionType,
      first_name: d.firstName,
      last_name: d.lastName ?? null,
      email: d.email ?? null,
      phone: d.phone ?? null,
      service_channel: d.serviceChannel ?? null,
      notes: d.notes ?? null,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };
    const { data, error } = await db
      .from("decisions")
      .insert(decisionInsert as never)
      .select("id")
      .single();

    if (error) {
      return {
        status: "error",
        message:
          "Something went wrong on our side — but your decision is still yours. Please call " +
          CHURCH.contact.phone +
          " and let us celebrate with you.",
      };
    }

    decisionId = (data as { id: string }).id;
  }

  // Ack the person directly — this is the sacred one.
  if (d.email) {
    const env = envelope("decisions");
    const followUpHref = decisionId
      ? `${CHURCH.urls.site}/connect/decision/next?id=${decisionId}`
      : `${CHURCH.urls.site}/connect/decision/next`;
    const ack = decisionAck({
      firstName: d.firstName,
      decisionType: d.decisionType,
      followUpHref,
    });
    await sendEmail({
      to: d.email,
      from: env.from,
      replyTo: env.replyTo,
      subject: ack.subject,
      text: ack.text,
      html: ack.html,
      tags: [
        { name: "flow", value: "decision" },
        { name: "decision_type", value: d.decisionType },
      ],
    });
  }

  // Pastoral notify — always, regardless of whether the person shared email.
  const pastoralInbox = process.env.PASTORAL_INBOX?.trim();
  if (pastoralInbox) {
    const env = envelope("decisions");
    const notify = decisionPastoralNotify({
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      decisionType: d.decisionType,
      channel: d.serviceChannel,
    });
    await sendEmail({
      to: pastoralInbox,
      from: env.from,
      replyTo: env.replyTo,
      subject: notify.subject,
      text: notify.text,
      html: notify.html,
      tags: [
        { name: "flow", value: "decision-pastoral" },
        { name: "decision_type", value: d.decisionType },
      ],
    });
  }

  return {
    status: "success",
    message: `${d.firstName}, welcome home.`,
    nextHref: decisionId
      ? `/connect/decision/next?id=${decisionId}`
      : "/connect/decision/next",
    data: { decisionId: decisionId ?? "", firstName: d.firstName },
  };
}

// ================================================================
// Decision follow-up (address + Bible packet request)
// ================================================================
export async function submitDecisionFollowUp(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: DecisionFollowUpSchema,
    rateLimitKey: "decision-followup",
    rateLimitMax: 30,
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  if (db) {
    const decisionUpdate = {
      first_name: d.firstName,
      last_name: d.lastName ?? null,
      email: d.email,
      phone: d.phone ?? null,
      notes: d.address ? `Mailing address:\n${d.address}` : null,
      follow_up_at: new Date().toISOString(),
    };
    const { error } = await db
      .from("decisions")
      .update(decisionUpdate as never)
      .eq("id", d.decisionId);
    if (error) {
      return {
        status: "error",
        message:
          "We couldn't save those details. You can reach us directly at " +
          CHURCH.contact.phone +
          " and we'll finish this in person.",
      };
    }
  }

  return {
    status: "success",
    message: `${d.firstName}, we have what we need. A pastor will reach out this week.`,
  };
}
