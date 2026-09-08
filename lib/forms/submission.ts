import "server-only";

import type { ZodIssue, ZodSchema } from "zod";
import { clientIpHash, clientIpRaw, rateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import type { FormResult } from "@/lib/schemas/shared";

/**
 * Shared front-half for every Server Action: parse FormData through a Zod
 * schema, drop honeypot hits, enforce rate limits, verify Turnstile. Returns
 * the validated data plus `ipHash` and `userAgent` metadata on success, or
 * a ready-to-return `FormResult` error on failure.
 *
 * Action bodies become:
 *   const v = await validateSubmission({...});
 *   if (!v.ok) return v.result;
 *   // ...insert into Supabase, send emails, return success...
 */

export interface ValidateArgs<T> {
  formData: FormData;
  schema: ZodSchema<T>;
  /** Namespace used by the rate limiter (unique per form). */
  rateLimitKey: string;
  rateLimitMax?: number;
  rateLimitWindowSec?: number;
  /** Field-error fallback mapper when Zod pinpoints the honeypot or captcha. */
  honeypotField?: string;
}

export interface ValidateSuccess<T> {
  ok: true;
  data: T;
  ipHash: string;
  userAgent: string | null;
}

export interface ValidateFailure {
  ok: false;
  result: Extract<FormResult, { status: "error" }>;
}

export async function validateSubmission<T>(
  args: ValidateArgs<T>,
): Promise<ValidateSuccess<T> | ValidateFailure> {
  const raw = formDataToObject(args.formData);

  // Honeypot fires first. Silent rejection — mimic a success to not leak
  // detection to bots, but never touch the database.
  const honeypotName = args.honeypotField ?? "website";
  if (typeof raw[honeypotName] === "string" && (raw[honeypotName] as string).length > 0) {
    return {
      ok: false,
      result: {
        status: "error",
        message: "We couldn't process that submission. Try again in a moment.",
      },
    };
  }

  // Zod. We narrow FormResult.fieldErrors by collapsing Zod issues.
  const parsed = args.schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      result: {
        status: "error",
        message: "Please check the highlighted fields.",
        fieldErrors: issuesToFieldErrors(parsed.error.issues),
      },
    };
  }

  // Rate limit.
  const gate = await rateLimit({
    key: args.rateLimitKey,
    max: args.rateLimitMax,
    windowSec: args.rateLimitWindowSec,
  });
  if (!gate.ok) {
    return {
      ok: false,
      result: {
        status: "error",
        message:
          "That's a lot of submissions from this device. Give it a few minutes, then try again.",
      },
    };
  }

  // Turnstile. Token comes from the form (optional field on the schema).
  const token =
    typeof raw.turnstileToken === "string" ? (raw.turnstileToken as string) : "";
  const ip = await clientIpRaw();
  const verify = await verifyTurnstile(token, ip);
  if (!verify.ok) {
    return {
      ok: false,
      result: {
        status: "error",
        message: "The security check didn't pass. Refresh the page and try once more.",
      },
    };
  }

  const ipHash = await clientIpHash();
  const uaHeader = args.formData.get("__userAgent");
  const userAgent =
    typeof uaHeader === "string" && uaHeader.length > 0 ? uaHeader.slice(0, 300) : null;

  return { ok: true, data: parsed.data, ipHash, userAgent };
}

function issuesToFieldErrors(issues: ZodIssue[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "_form");
    if (!out[key]) out[key] = [];
    out[key].push(issue.message);
  }
  return out;
}

/**
 * Convert a FormData into a plain object, collapsing single-valued keys
 * to their value and preserving multi-valued keys (checkbox groups,
 * multi-selects) as arrays. `Object.fromEntries(formData)` drops all
 * but the last value for repeated keys — this fixes that.
 *
 * File entries are skipped (we don't accept uploads on these forms).
 */
function formDataToObject(fd: FormData): Record<string, unknown> {
  const keys = new Set<string>();
  for (const [k] of fd.entries()) keys.add(k);
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    const values = fd.getAll(key).filter((v): v is string => typeof v === "string");
    if (values.length === 0) continue;
    out[key] = values.length === 1 ? values[0] : values;
  }
  return out;
}
