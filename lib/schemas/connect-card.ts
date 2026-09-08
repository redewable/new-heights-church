import { z } from "zod";
import {
  CheckboxSchema,
  EmailSchema,
  NameSchema,
  OptionalISODateSchema,
  OptionalPhoneSchema,
  TurnstileTokenSchema,
} from "./shared";

/**
 * Connect Card — RFP §9.1. The form a first-time guest fills out to say
 * "I was here; here's how to reach me." Keep required fields to the bare
 * minimum that lets a pastor follow up.
 */

export const HOW_HEARD_OPTIONS = [
  "Friend or family",
  "Invited by someone at NHC",
  "Google or online search",
  "Social media",
  "Drove past the campus",
  "Something else",
] as const;

export const ConnectCardSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  phone: OptionalPhoneSchema,
  howHeard: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  firstTime: CheckboxSchema.default(false),
  wantsCall: CheckboxSchema.default(false),
  serviceDate: OptionalISODateSchema,
  prayerRequest: z
    .string()
    .trim()
    .max(2000, "Keep prayer to 2000 characters or less; we'll call you for more.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  consentEmail: CheckboxSchema.default(true),
  /**
   * Honeypot. Legit users leave it blank. If it's populated, we drop the
   * submission silently (so bots don't learn they were detected).
   */
  website: z.string().max(0, "bot").optional().default(""),
  turnstileToken: TurnstileTokenSchema,
});

export type ConnectCardInput = z.input<typeof ConnectCardSchema>;
export type ConnectCardData = z.output<typeof ConnectCardSchema>;
