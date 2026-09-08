/**
 * Cookie-consent model. We keep the surface small on purpose:
 *   - "pending"    — no choice made yet (banner shows)
 *   - "essential"  — user chose "Only essential" (no analytics, no marketing)
 *   - "all"        — user accepted all analytics + marketing
 *
 * We do NOT grade consent by vendor — a single-question banner is the
 * right balance for a church site (not e-commerce). If we ever ship a
 * granular preferences modal, add vendors without breaking this shape.
 */

export const CONSENT_KEY = "nhc.consent.v1";
export type ConsentChoice = "pending" | "essential" | "all";

export interface ConsentState {
  choice: ConsentChoice;
  /** ISO timestamp of the decision. Updated on every re-save. */
  decidedAt: string | null;
  /** Version bump lets us re-prompt when privacy practices change. */
  version: 1;
}

export const INITIAL_CONSENT: ConsentState = {
  choice: "pending",
  decidedAt: null,
  version: 1,
};

/** Convenience: true when the user has actively opted in to analytics. */
export function analyticsAllowed(state: ConsentState): boolean {
  return state.choice === "all";
}

/** Event name we dispatch on the `window` after any change. */
export const CONSENT_CHANGE_EVENT = "nhc:consent-change";
