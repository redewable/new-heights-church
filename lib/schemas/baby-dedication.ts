import { z } from "zod";
import {
  EmailSchema,
  NameSchema,
  OptionalISODateSchema,
  OptionalNameSchema,
  OptionalPhoneSchema,
  TurnstileTokenSchema,
} from "./shared";

/**
 * Baby Dedication (§9.5). Captures the parent(s), the child, and a
 * preferred service date. Phone required because dedications are
 * coordinated one-on-one with a pastor in the week leading up.
 */
export const BabyDedicationSchema = z.object({
  parentFirstName: NameSchema,
  parentLastName: NameSchema,
  partnerFirstName: OptionalNameSchema,
  partnerLastName: OptionalNameSchema,
  email: EmailSchema,
  phone: z
    .string({ error: "Phone number helps us coordinate with you." })
    .trim()
    .max(24)
    .transform((v) => v.replace(/[^\d]/g, ""))
    .refine((v) => v.length >= 10, "Phone number looks short by a digit or two."),
  childFirstName: NameSchema,
  childLastName: OptionalNameSchema,
  childDateOfBirth: OptionalISODateSchema,
  preferredServiceDate: OptionalISODateSchema,
  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  website: z.string().max(0, "bot").optional().default(""),
  turnstileToken: TurnstileTokenSchema,
});

// Re-export the phone schema from shared for consistency where desired.
export const BabyDedicationPhoneSchema = OptionalPhoneSchema;

export type BabyDedicationInput = z.input<typeof BabyDedicationSchema>;
export type BabyDedicationData = z.output<typeof BabyDedicationSchema>;
