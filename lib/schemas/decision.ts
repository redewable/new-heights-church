import { z } from "zod";
import {
  EmailSchema,
  NameSchema,
  OptionalEmailSchema,
  OptionalNameSchema,
  OptionalPhoneSchema,
  TurnstileTokenSchema,
} from "./shared";

/**
 * Decision Capture — RFP §9.3. "This flow is sacred. It gets extra care."
 * Keep the required surface to: decision type + first name. Every other
 * field is optional so nothing blocks a person on the altar.
 *
 * The salvation path intentionally does NOT require an email. If we lose
 * the address, we lose the follow-up — but we'd rather capture the moment
 * than gate it.
 */

export const DECISION_TYPES = [
  "salvation",
  "rededication",
  "holy_spirit",
  "water_baptism",
] as const;

export const DECISION_TYPE_LABEL: Record<(typeof DECISION_TYPES)[number], string> = {
  salvation: "I said yes to Jesus for the first time",
  rededication: "I recommitted my life to Christ",
  holy_spirit: "I want to be filled with the Holy Spirit",
  water_baptism: "I want to be baptized in water",
};

export const SERVICE_CHANNELS = ["in_person", "online"] as const;

export const DecisionSchema = z.object({
  decisionType: z.enum(DECISION_TYPES, {
    error: "Pick the one that fits.",
  }),
  firstName: NameSchema,
  lastName: OptionalNameSchema,
  email: OptionalEmailSchema,
  phone: OptionalPhoneSchema,
  serviceChannel: z.enum(SERVICE_CHANNELS).optional(),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  website: z.string().max(0, "bot").optional().default(""),
  turnstileToken: TurnstileTokenSchema,
});

export type DecisionInput = z.input<typeof DecisionSchema>;
export type DecisionData = z.output<typeof DecisionSchema>;

/**
 * Follow-up contact form — filled in AFTER the moment on a dedicated
 * "welcome to the family" page. Separated from the initial decision so the
 * altar flow stays one-tap.
 */
export const DecisionFollowUpSchema = z.object({
  decisionId: z.string().uuid("Something went wrong. Start over from /connect/decision."),
  firstName: NameSchema,
  lastName: OptionalNameSchema,
  email: EmailSchema,
  phone: OptionalPhoneSchema,
  address: z.string().trim().max(300).optional(),
  wantsCall: z
    .union([z.literal("on"), z.literal("true"), z.literal("false"), z.undefined()])
    .transform((v) => v === "on" || v === "true"),
  turnstileToken: TurnstileTokenSchema,
});

export type DecisionFollowUpInput = z.input<typeof DecisionFollowUpSchema>;
export type DecisionFollowUpData = z.output<typeof DecisionFollowUpSchema>;
