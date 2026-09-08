import { z } from "zod";
import {
  EmailSchema,
  NameSchema,
  OptionalNameSchema,
  OptionalPhoneSchema,
  TurnstileTokenSchema,
} from "./shared";

/**
 * Year-end giving statement request (§9.11). Donor types their name,
 * email, and the tax year they need; staff compiles and emails back.
 * Allow tax years from five years ago through the current year — IRS
 * letter requirements mean older years usually require a written ask.
 */

const MAX_YEAR = new Date().getUTCFullYear();
const MIN_YEAR = MAX_YEAR - 5;

export const StatementRequestSchema = z.object({
  firstName: NameSchema,
  lastName: OptionalNameSchema,
  email: EmailSchema,
  phone: OptionalPhoneSchema,
  taxYear: z
    .union([z.number(), z.string()])
    .transform((v) => (typeof v === "number" ? v : Number.parseInt(v, 10)))
    .refine(
      (y) => Number.isFinite(y) && y >= MIN_YEAR && y <= MAX_YEAR,
      `Tax year must be between ${MIN_YEAR} and ${MAX_YEAR}.`,
    ),
  notes: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  website: z.string().max(0, "bot").optional().default(""),
  turnstileToken: TurnstileTokenSchema,
});

export type StatementRequestInput = z.input<typeof StatementRequestSchema>;
export type StatementRequestData = z.output<typeof StatementRequestSchema>;

export function availableTaxYears(): number[] {
  return Array.from({ length: 6 }, (_, i) => MAX_YEAR - i);
}
