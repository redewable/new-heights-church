"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateSubmission } from "@/lib/forms/submission";
import { BaptismInterestSchema } from "@/lib/schemas/baptism";
import { BabyDedicationSchema } from "@/lib/schemas/baby-dedication";
import { MINISTRY_AREA_LABEL, VolunteerSchema } from "@/lib/schemas/volunteer";
import type { FormResult } from "@/lib/schemas/shared";
import { envelope, sendEmail } from "@/lib/email/resend";
import { CHURCH } from "@/lib/constants/church";

/**
 * Server actions for the three Grow-wing internal forms. Same posture as
 * the other engagement actions:
 *   1. Zod + honeypot + rate limit + Turnstile via `validateSubmission`
 *   2. Supabase insert (fallback: skip silently if no DB configured)
 *   3. Fire-and-forget email ack to the submitter + internal notify
 *   4. Never surface email failures to the UI — the row is saved either way
 */

// ================================================================
// Water Baptism Interest (§9.4)
// ================================================================
export async function submitBaptismInterest(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: BaptismInterestSchema,
    rateLimitKey: "baptism",
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  if (db) {
    const insertRow = {
      first_name: d.firstName,
      last_name: d.lastName,
      email: d.email,
      phone: d.phone ?? null,
      date_of_birth: d.dateOfBirth ?? null,
      parent_consent: d.parentConsent,
      parent_name: d.parentName ?? null,
      parent_phone: d.parentPhone ?? null,
      testimony: d.testimony ?? null,
      preferred_service: d.preferredService ?? null,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };
    const { error } = await db.from("baptism_interest").insert(insertRow as never);
    if (error) {
      return {
        status: "error",
        message:
          "We couldn't save that right now. Try again or call " +
          CHURCH.contact.phone +
          ".",
      };
    }
  }

  const env = envelope("connect");
  await sendEmail({
    to: d.email,
    from: env.from,
    replyTo: env.replyTo,
    subject: `${d.firstName}, you're on the baptism list`,
    text: [
      `${d.firstName},`,
      "",
      "You said yes to the water. We're glad.",
      "",
      "Here's what happens next: a pastor will reach out within the next few days to confirm the date. We baptize regularly — the next service is coming up soon, and we'll match you to it.",
      "",
      "If you want to bring family or anyone you want to stand with you, we'll make room. That's the whole point.",
      "",
      `Any questions in the meantime — reply to this email or call ${CHURCH.contact.phone}.`,
      "",
      `— The pastoral team at ${CHURCH.name}`,
    ].join("\n"),
    html: `<p>${d.firstName},</p>
<p>You said yes to the water. We're glad.</p>
<p>Here's what happens next: a pastor will reach out within the next few days to confirm the date. We baptize regularly — the next service is coming up soon, and we'll match you to it.</p>
<p>If you want to bring family or anyone you want to stand with you, we'll make room. That's the whole point.</p>
<p>Questions? Reply here or call ${CHURCH.contact.phone}.</p>
<p>— The pastoral team at ${CHURCH.name}</p>`,
    tags: [{ name: "flow", value: "baptism-interest" }],
  });

  const pastoralInbox = process.env.PASTORAL_INBOX?.trim();
  if (pastoralInbox) {
    await sendEmail({
      to: pastoralInbox,
      from: env.from,
      replyTo: env.replyTo,
      subject: `New baptism interest — ${d.firstName} ${d.lastName}`,
      text: [
        `NEW BAPTISM INTEREST`,
        "",
        `Name: ${d.firstName} ${d.lastName}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone ?? "(none)"}`,
        `DOB: ${d.dateOfBirth ?? "(not shared)"}`,
        d.parentConsent ? `Parent: ${d.parentName} — ${d.parentPhone}` : "",
        `Preferred service: ${d.preferredService ?? "(none)"}`,
        "",
        "Testimony:",
        d.testimony ?? "(none shared)",
      ]
        .filter((l) => l !== "")
        .join("\n"),
      html: "",
      tags: [{ name: "flow", value: "baptism-interest-internal" }],
    });
  }

  revalidatePath("/grow/baptism");
  return {
    status: "success",
    message: `${d.firstName}, you're on the list. Someone will reach out this week.`,
  };
}

// ================================================================
// Baby Dedication (§9.5)
// ================================================================
export async function submitBabyDedication(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: BabyDedicationSchema,
    rateLimitKey: "baby-dedication",
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  if (db) {
    const insertRow = {
      parent_first_name: d.parentFirstName,
      parent_last_name: d.parentLastName,
      partner_first_name: d.partnerFirstName ?? null,
      partner_last_name: d.partnerLastName ?? null,
      email: d.email,
      phone: d.phone,
      child_first_name: d.childFirstName,
      child_last_name: d.childLastName ?? null,
      child_date_of_birth: d.childDateOfBirth ?? null,
      preferred_service_date: d.preferredServiceDate ?? null,
      notes: d.notes ?? null,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };
    const { error } = await db.from("baby_dedications").insert(insertRow as never);
    if (error) {
      return {
        status: "error",
        message:
          "We couldn't save that right now. Please call " +
          CHURCH.contact.phone +
          " and we'll register you over the phone.",
      };
    }
  }

  const env = envelope("connect");
  await sendEmail({
    to: d.email,
    from: env.from,
    replyTo: env.replyTo,
    subject: `${d.parentFirstName}, we have you for the dedication`,
    text: [
      `${d.parentFirstName},`,
      "",
      `We're honored to stand with you and ${d.childFirstName}${d.childLastName ? " " + d.childLastName : ""}.`,
      "",
      d.preferredServiceDate
        ? `You picked ${d.preferredServiceDate}. A pastor will confirm the logistics this week — what to expect, where to meet us before service, who you'd like up there with you.`
        : "A pastor will reach out this week to pick a Sunday and walk through the service logistics with you.",
      "",
      "If anything changes between now and then, just reply here.",
      "",
      `— The pastoral team at ${CHURCH.name}`,
    ].join("\n"),
    html: "",
    tags: [{ name: "flow", value: "baby-dedication" }],
  });

  revalidatePath("/grow/baptism");
  revalidatePath("/connect/baby-dedication");
  return {
    status: "success",
    message: `${d.parentFirstName}, you're on the list. A pastor will reach out this week.`,
  };
}

// ================================================================
// Volunteer Application (§9.7)
// ================================================================
export async function submitVolunteerApplication(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const v = await validateSubmission({
    formData,
    schema: VolunteerSchema,
    rateLimitKey: "volunteer",
  });
  if (!v.ok) return v.result;
  const d = v.data;

  const db = supabaseAdmin();
  if (db) {
    const insertRow = {
      first_name: d.firstName,
      last_name: d.lastName,
      email: d.email,
      phone: d.phone,
      ministry_areas: d.ministryAreas,
      availability: d.availability ?? null,
      completed_n2n: d.completedN2N,
      completed_foundations: d.completedFoundations,
      background_check_consent: d.backgroundCheckConsent,
      notes: d.notes ?? null,
      ip_hash: v.ipHash,
      user_agent: v.userAgent,
    };
    const { error } = await db.from("volunteer_applications").insert(insertRow as never);
    if (error) {
      return {
        status: "error",
        message: "We couldn't save that. Try again in a moment.",
      };
    }
  }

  const env = envelope("connect");
  const areas = d.ministryAreas
    .map((a) => MINISTRY_AREA_LABEL[a as keyof typeof MINISTRY_AREA_LABEL] ?? a)
    .join(", ");

  await sendEmail({
    to: d.email,
    from: env.from,
    replyTo: env.replyTo,
    subject: `${d.firstName}, your serve application is in`,
    text: [
      `${d.firstName},`,
      "",
      "Thanks for wanting to serve. A coordinator will reach out within a week to confirm the details and get you onboarded.",
      "",
      `Areas you picked: ${areas}`,
      "",
      d.completedN2N && d.completedFoundations
        ? "You self-attested to having completed New to New Heights and Foundations of Faith — our team will confirm in Church Center."
        : "Heads up: our serve path requires completing New to New Heights and Foundations of Faith first. If you haven't finished those yet, we'll help you register for the next cohorts.",
      "",
      `— ${CHURCH.name}`,
    ].join("\n"),
    html: "",
    tags: [{ name: "flow", value: "volunteer-application" }],
  });

  revalidatePath("/grow/volunteer");
  return {
    status: "success",
    message: `${d.firstName}, you're in the queue. A coordinator will reach out this week.`,
  };
}
