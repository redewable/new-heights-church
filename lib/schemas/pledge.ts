import { z } from "zod";
import {
  CheckboxSchema,
  EmailSchema,
  NameSchema,
  OptionalNameSchema,
  OptionalPhoneSchema,
  TurnstileTokenSchema,
} from "./shared";

/**
 * Pledge (§9.9). A pledge is INTENT, not payment. We capture the
 * commitment, email back with a Pushpay link to set up the actual
 * recurring gift, and update campaign progress on a staff timeline. The
 * site itself never touches card data.
 */

export const PLEDGE_FREQUENCIES = [
  "one_time",
  "monthly",
  "quarterly",
  "annually",
] as const;

export const PLEDGE_FREQUENCY_LABEL: Record<(typeof PLEDGE_FREQUENCIES)[number], string> =
  {
    one_time: "One-time gift",
    monthly: "Monthly",
    quarterly: "Quarterly",
    annually: "Annually",
  };

/**
 * Parse the dollar-amount input. Accepts "$1,000", "1000", "1,000.50" —
 * strips formatting, rejects negatives and anything under $1. Rounds to
 * cents so the database stores an integer number of cents.
 */
const AmountSchema = z
  .union([z.string(), z.number()])
  .transform((v) => {
    if (typeof v === "number") return Math.round(v * 100);
    const cleaned = v.replace(/[^0-9.]/g, "");
    if (cleaned.length === 0) return 0;
    const parsed = Number.parseFloat(cleaned);
    if (!Number.isFinite(parsed)) return 0;
    return Math.round(parsed * 100);
  })
  .refine((cents) => cents >= 100, "Pledges start at $1.")
  .refine(
    (cents) => cents <= 100_000_000,
    "For gifts over $1,000,000, please reach out to the pastoral team directly.",
  );

export const PledgeSchema = z.object({
  campaign: z.string().trim().min(1, "Pick a campaign."),
  firstName: NameSchema,
  lastName: OptionalNameSchema,
  email: EmailSchema,
  phone: OptionalPhoneSchema,
  amount: AmountSchema,
  frequency: z.enum(PLEDGE_FREQUENCIES, { error: "Pick a frequency." }),
  note: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  consentFollowup: CheckboxSchema.default(true),
  website: z.string().max(0, "bot").optional().default(""),
  turnstileToken: TurnstileTokenSchema,
});

export type PledgeInput = z.input<typeof PledgeSchema>;
export type PledgeData = z.output<typeof PledgeSchema>;
