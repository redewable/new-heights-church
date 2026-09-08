import { z } from "zod";
import {
  CheckboxSchema,
  OptionalEmailSchema,
  OptionalNameSchema,
  requiredText,
  TurnstileTokenSchema,
} from "./shared";

/**
 * Prayer Request — RFP §9.2. Name and email are both optional; the request
 * itself is not. Anonymity is a first-class option and must be respected
 * downstream (anonymous submissions don't sync to Planning Center).
 */
export const PrayerRequestSchema = z.object({
  name: OptionalNameSchema,
  email: OptionalEmailSchema,
  request: requiredText("Your request", 3000),
  urgent: CheckboxSchema.default(false),
  shareAnonymously: CheckboxSchema.default(false),
  consentFollowup: CheckboxSchema.default(true),
  website: z.string().max(0, "bot").optional().default(""),
  turnstileToken: TurnstileTokenSchema,
});

export type PrayerRequestInput = z.input<typeof PrayerRequestSchema>;
export type PrayerRequestData = z.output<typeof PrayerRequestSchema>;
