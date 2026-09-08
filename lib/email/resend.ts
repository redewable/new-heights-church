import "server-only";

/**
 * Minimal Resend client. We call the REST API directly so we don't
 * add the `resend` SDK as a dependency — the payload is small enough that
 * a 30-line wrapper is cleaner than another SDK upgrade path.
 *
 * When `RESEND_API_KEY` isn't set we log the email to the server console
 * and return `{ ok: true, mode: "dry-run" }`. Forms must never fail
 * because email dispatch failed — the submission already landed in
 * Supabase, and the `submission_jobs` queue will retry if real delivery
 * is required.
 */

export interface SendEmailInput {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  ok: boolean;
  mode: "resend" | "dry-run" | "disabled";
  id?: string;
  error?: string;
}

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = Array.isArray(input.to) ? input.to : [input.to];
  const anyTo = to.filter(Boolean);

  if (anyTo.length === 0) {
    return { ok: true, mode: "disabled" };
  }

  if (!apiKey) {
    if (process.env.NODE_ENV !== "test") {
      console.info(`[email/dry-run] to=${anyTo.join(",")} subject="${input.subject}"`);
    }
    return { ok: true, mode: "dry-run" };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        from: input.from,
        to: anyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
        tags: input.tags,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        mode: "resend",
        error: `http-${res.status}:${text.slice(0, 180)}`,
      };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, mode: "resend", id: data.id };
  } catch (err) {
    return {
      ok: false,
      mode: "resend",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Envelope resolver — reads preferred "from" addresses out of env or falls
 * back to a single sensible default. Lets us keep different from-addresses
 * per flow (welcome@, prayer@, pastors@) without hard-coding in templates.
 */
export function envelope(which: "connect" | "prayer" | "decisions"): {
  from: string;
  replyTo: string;
} {
  const defaults = {
    connect: "New Heights Church <welcome@newheightschurch.info>",
    prayer: "NHC Prayer Team <prayer@newheightschurch.info>",
    decisions: "Apostle Brian & Crystal <pastors@newheightschurch.info>",
  } as const;

  const env = {
    connect: process.env.RESEND_FROM_CONNECT?.trim(),
    prayer: process.env.RESEND_FROM_PRAYER?.trim(),
    decisions: process.env.RESEND_FROM_DECISIONS?.trim(),
  } as const;

  const from = env[which] || defaults[which];
  const replyTo = parseReplyTo(from);
  return { from, replyTo };
}

function parseReplyTo(from: string): string {
  // Extract the email portion of "Display Name <email@domain>"
  const m = from.match(/<([^>]+)>/);
  return m?.[1] ?? from;
}
