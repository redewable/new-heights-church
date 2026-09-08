import { z } from "zod";
import { CheckboxSchema, EmailSchema, NameSchema, TurnstileTokenSchema } from "./shared";

/**
 * Volunteer application (§9.7). Applicants self-attest to having
 * completed the two prereq classes (N2N + Foundations of Faith); staff
 * verifies in Planning Center before onboarding. Background-check
 * consent is explicit — if they don't consent, the form still submits but
 * admin can only route them to non-public-facing roles.
 *
 * Ministry areas come from a controlled list; anything else lives in the
 * "notes" field so we don't accumulate typos in the database.
 */

export const MINISTRY_AREAS = [
  "first_touch",
  "young_lions_kids",
  "youth_army",
  "worship",
  "tech_production",
  "hospitality_cafe",
  "parking",
  "prayer_team",
  "intercession",
  "ushers_greeters",
  "media_photography",
] as const;

export const MINISTRY_AREA_LABEL: Record<(typeof MINISTRY_AREAS)[number], string> = {
  first_touch: "First-Touch Team (guest services)",
  young_lions_kids: "Young Lions (kids)",
  youth_army: "Youth Army",
  worship: "Worship team",
  tech_production: "Tech / production",
  hospitality_cafe: "Hospitality / café",
  parking: "Parking team",
  prayer_team: "Altar prayer team",
  intercession: "Intercession",
  ushers_greeters: "Ushers + greeters",
  media_photography: "Media + photography",
};

export const VolunteerSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  phone: z
    .string({ error: "Phone number helps us coordinate with you." })
    .trim()
    .max(24)
    .transform((v) => v.replace(/[^\d]/g, ""))
    .refine((v) => v.length >= 10, "Phone number looks short by a digit or two."),
  /**
   * Multi-select — HTML `name="ministryAreas"` with multiple checkboxes
   * submits as either a single string or nothing. We normalize both via
   * a union. `formData.getAll()` on the action side gives us an array.
   */
  ministryAreas: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v.length > 0 ? [v] : []))
    .refine((v) => v.length > 0, "Pick at least one place you'd like to serve.")
    .refine(
      (v) => v.every((a) => (MINISTRY_AREAS as readonly string[]).includes(a)),
      "One or more of those options isn't valid — refresh and try again.",
    ),
  availability: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  completedN2N: CheckboxSchema.default(false),
  completedFoundations: CheckboxSchema.default(false),
  backgroundCheckConsent: CheckboxSchema.default(false),
  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  website: z.string().max(0, "bot").optional().default(""),
  turnstileToken: TurnstileTokenSchema,
});

export type VolunteerInput = z.input<typeof VolunteerSchema>;
export type VolunteerData = z.output<typeof VolunteerSchema>;
