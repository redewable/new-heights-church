import { z } from "zod";

/**
 * Shared Zod primitives used across every form schema. Keep the
 * constraints here — if you tighten "required name" in one place, tighten
 * it everywhere. Error messages are written in brand voice: direct, no
 * exclamation points, no corporate lectures.
 */

export const NameSchema = z
  .string({ error: "Tell us what to call you." })
  .trim()
  .min(1, "Tell us what to call you.")
  .max(80, "Names cap at 80 characters.");

export const OptionalNameSchema = z
  .string()
  .trim()
  .max(80, "Names cap at 80 characters.")
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

export const EmailSchema = z
  .string({ error: "We need an email to reach you." })
  .trim()
  .toLowerCase()
  .email("That email doesn't look right.")
  .max(200, "That email is too long.");

export const OptionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(200)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined))
  .refine(
    (v) => !v || z.string().email().safeParse(v).success,
    "That email doesn't look right.",
  );

/**
 * Accepts any sensible North American phone format — parens, dashes, dots,
 * spaces, optional country code. We only enforce digit count and strip
 * formatting on the way out so Supabase stores "9793147585"-style.
 */
export const OptionalPhoneSchema = z
  .string()
  .trim()
  .max(24)
  .optional()
  .transform((v) => (v && v.length > 0 ? v.replace(/[^\d]/g, "") : undefined))
  .refine(
    (v) => !v || v.length >= 10,
    "That phone number looks short by a digit or two.",
  );

/** Long-form field that must not be empty. */
export function requiredText(label: string, max = 2000) {
  return z
    .string({ error: `${label} can't be blank.` })
    .trim()
    .min(1, `${label} can't be blank.`)
    .max(max, `${label} is too long (max ${max} characters).`);
}

/**
 * Cloudflare Turnstile token — always a string when the widget loads. We
 * accept an empty string here and verify separately in the server action,
 * so the schema surface doesn't leak "you forgot to solve a captcha" to
 * the wrong field.
 */
export const TurnstileTokenSchema = z.string().optional().default("");

/**
 * HTML form checkbox values arrive as `"on" | undefined`. This schema
 * normalizes to a boolean.
 */
export const CheckboxSchema = z
  .union([z.literal("on"), z.literal("true"), z.literal("false"), z.undefined()])
  .transform((v) => v === "on" || v === "true");

/** ISO date (YYYY-MM-DD) or empty. */
export const OptionalISODateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please use YYYY-MM-DD.")
  .or(z.literal(""))
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

/**
 * Discriminated union returned from every form server action. The client
 * narrows on `status` to render the right UI. Keep this shape stable —
 * form primitives depend on it for error rendering.
 */
export type FormResult =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      /** Field-level errors, keyed by the form field `name`. */
      fieldErrors?: Record<string, string[]>;
    }
  | {
      status: "success";
      message: string;
      /** Optional destination for post-submit redirect or deep-link. */
      nextHref?: string;
      /** Optional payload for confirmation UI (e.g. "saved as {id}"). */
      data?: Record<string, string | number | boolean>;
    };

export const INITIAL_FORM_STATE: FormResult = { status: "idle" };
