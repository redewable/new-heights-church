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
 * Baptism interest (§9.4). We don't schedule on submit — staff matches
 * the person to the next baptism Sunday manually. The form captures the
 * minimum we need to reach back + lay hands.
 *
 * Minors require `parent_consent` and parent contact. We don't enforce the
 * age calculation here; the staff follow-up confirms details and the row
 * is flagged in admin.
 */
export const BaptismInterestSchema = z
  .object({
    firstName: NameSchema,
    lastName: NameSchema,
    email: EmailSchema,
    phone: OptionalPhoneSchema,
    dateOfBirth: OptionalISODateSchema,
    parentConsent: CheckboxSchema.default(false),
    parentName: z
      .string()
      .trim()
      .max(80)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    parentPhone: OptionalPhoneSchema,
    testimony: z
      .string()
      .trim()
      .max(3000)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    preferredService: z
      .string()
      .trim()
      .max(80)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    website: z.string().max(0, "bot").optional().default(""),
    turnstileToken: TurnstileTokenSchema,
  })
  .superRefine((val, ctx) => {
    if (!val.dateOfBirth) return;
    const dob = new Date(val.dateOfBirth);
    if (Number.isNaN(dob.getTime())) return;
    const ageMs = Date.now() - dob.getTime();
    const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
    if (ageYears < 18) {
      if (!val.parentConsent) {
        ctx.addIssue({
          code: "custom",
          path: ["parentConsent"],
          message: "For anyone under 18, a parent or guardian needs to grant consent.",
        });
      }
      if (!val.parentName) {
        ctx.addIssue({
          code: "custom",
          path: ["parentName"],
          message: "Parent or guardian name is required for minors.",
        });
      }
      if (!val.parentPhone) {
        ctx.addIssue({
          code: "custom",
          path: ["parentPhone"],
          message: "A parent or guardian phone number lets us reach them.",
        });
      }
    }
  });

export type BaptismInterestInput = z.input<typeof BaptismInterestSchema>;
export type BaptismInterestData = z.output<typeof BaptismInterestSchema>;
