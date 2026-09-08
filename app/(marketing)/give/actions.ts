"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateSubmission } from "@/lib/forms/submission";
import { PledgeSchema } from "@/lib/schemas/pledge";
import { StatementRequestSchema } from "@/lib/schemas/statement";
import type { FormResult } from "@/lib/schemas/shared";
import { envelope, sendEmail } from "@/lib/email/resend";
import { CHURCH } from "@/lib/constants/church";
import { GIVING, pushpayHref } from "@/lib/constants/giving";
import { formatUSDLong } from "@/lib/giving/campaigns";

/**
 * Giving server actions. Two forms — pledge (§9.9) + year-end statement
 * request (§9.11). Both write to Supabase FIRST; emails are
 * fire-and-forget so a Resend outage never blocks the submission from
 * landing.
 *
 * A pledge is NOT a payment. After saving we send the donor a link to
 * Pushpay to finish setting up the recurring gift themselves — we never
 * move money from the form.
 */

// ================================================================
// Pledge (§9.9)
// ================================================================
export async function submitPledge(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: PledgeSchema,
    rateLimitKey: "pledge",
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  let pledgeId: string | undefined;

  if (db) {
    // `as never` cast — see note in app/(marketing)/connect/actions.ts
    const pledgeInsert = {
      campaign: d.campaign,
      first_name: d.firstName,
      last_name: d.lastName ?? null,
      email: d.email,
      phone: d.phone ?? null,
      amount_cents: d.amount,
      frequency: d.frequency,
      note: d.note ?? null,
      consent_followup: d.consentFollowup,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };
    const { data, error } = await db
      .from("pledges")
      .insert(pledgeInsert as never)
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
    pledgeId = (data as { id: string }).id;
  }

  // Ack + Pushpay link to finish the recurring gift.
  const env = envelope("connect");
  const href = pushpayHref(`pledge-${d.campaign}`);
  const amountLabel = formatUSDLong(d.amount);
  const freqLabel = {
    one_time: "one-time gift",
    monthly: "monthly",
    quarterly: "quarterly",
    annually: "annually",
  }[d.frequency];

  await sendEmail({
    to: d.email,
    from: env.from,
    replyTo: env.replyTo,
    subject: `${d.firstName}, your pledge is in`,
    text: [
      `${d.firstName}, we received your pledge.`,
      "",
      `Pledged: ${amountLabel} (${freqLabel})`,
      d.campaign === "rise-up-and-build"
        ? "Campaign: Rise Up and Build"
        : `Campaign: ${d.campaign}`,
      "",
      "A pledge is intent, not payment. To set up the actual gift, use our online giving portal:",
      `  ${href}`,
      "",
      "If you'd rather give by check, mail to:",
      `  ${CHURCH.name}`,
      `  ${CHURCH.address.full}`,
      "",
      "Any questions? Reply to this email — a pastor will see it.",
      "",
      `— ${CHURCH.name}`,
    ].join("\n"),
    html: `<p>${d.firstName}, we received your pledge.</p>
<p><strong>Pledged:</strong> ${amountLabel} (${freqLabel})</p>
<p>A pledge is intent, not payment. To set up the actual gift, use our online giving portal:<br>
<a href="${href}" style="color:#8f7115">Give through Pushpay →</a></p>
<p>Or mail a check to<br>${CHURCH.name}<br>${CHURCH.address.full}</p>
<p>Questions? Reply here.</p>
<p>— ${CHURCH.name}</p>`,
    tags: [
      { name: "flow", value: "pledge" },
      { name: "campaign", value: d.campaign },
    ],
  });

  revalidatePath("/rise-up-and-build");
  revalidatePath("/give");

  return {
    status: "success",
    message: `${d.firstName}, your pledge is in. Check your inbox for the next step.`,
    data: { pledgeId: pledgeId ?? "", href },
  };
}

// ================================================================
// Year-End Statement Request (§9.11)
// ================================================================
export async function submitStatementRequest(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: StatementRequestSchema,
    rateLimitKey: "statement-request",
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  if (db) {
    const stmtInsert = {
      first_name: d.firstName,
      last_name: d.lastName ?? null,
      email: d.email,
      phone: d.phone ?? null,
      tax_year: d.taxYear,
      notes: d.notes ?? null,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };
    const { error } = await db.from("statement_requests").insert(stmtInsert as never);
    if (error) {
      return {
        status: "error",
        message:
          "We couldn't submit that. Please email " +
          GIVING.securities.staffEmail +
          " and we'll handle it manually.",
      };
    }
  }

  // Ack to donor.
  const env = envelope("connect");
  await sendEmail({
    to: d.email,
    from: env.from,
    replyTo: env.replyTo,
    subject: `${d.firstName}, your ${d.taxYear} statement is on the way`,
    text: [
      `${d.firstName},`,
      "",
      `Your ${d.taxYear} giving statement is queued. Someone on staff will prepare it and email it within five business days.`,
      "",
      "If you gave through Pushpay, Engiven, or by stock during that year, all of it will be consolidated in the statement.",
      "",
      "If you need it faster, reply to this email.",
      "",
      `— ${CHURCH.name}`,
    ].join("\n"),
    html: `<p>${d.firstName},</p>
<p>Your ${d.taxYear} giving statement is queued. Someone on staff will prepare it and email it within five business days.</p>
<p>If you gave through Pushpay, Engiven, or by stock during that year, all of it will be consolidated in the statement.</p>
<p>If you need it faster, reply to this email.</p>
<p>— ${CHURCH.name}</p>`,
    tags: [
      { name: "flow", value: "statement-request" },
      { name: "tax_year", value: String(d.taxYear) },
    ],
  });

  return {
    status: "success",
    message: `${d.firstName}, your ${d.taxYear} statement is queued. Watch your inbox — five business days at most.`,
  };
}
