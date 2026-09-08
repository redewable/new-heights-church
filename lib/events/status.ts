import type { EventRegistrationStatus, EventRow } from "@/lib/supabase/types";

/**
 * Registration-state helpers shared by the event card and detail page so
 * the two never disagree about whether a CTA is live.
 */

/** Short label for cards. `null` = nothing to say (registration is simply open). */
export const REGISTRATION_STATUS_LABEL: Record<EventRegistrationStatus, string | null> = {
  open: null,
  closed: "Registration closed",
  waitlist: "Waitlist open",
  tbd: "Registration opens soon",
};

/** Sentence for the detail page under the CTA. */
export const REGISTRATION_STATUS_NOTE: Record<EventRegistrationStatus, string | null> = {
  open: null,
  closed: "Registration for this event has closed. Watch this page for next year.",
  waitlist: "Spots are full — join the waitlist and we'll reach out if one opens.",
  tbd: "Registration hasn't opened yet. Check back, or ask a greeter on Sunday.",
};

/** True when a visitor can still act on the registration link. */
export function canRegister(
  event: Pick<EventRow, "registration_status" | "registration_url">,
) {
  if (!event.registration_url) return false;
  return event.registration_status === "open" || event.registration_status === "waitlist";
}

/** schema.org ItemAvailability for the Event offer. */
export function offerAvailability(status: EventRegistrationStatus): string {
  switch (status) {
    case "closed":
      return "https://schema.org/SoldOut";
    case "waitlist":
      return "https://schema.org/LimitedAvailability";
    case "tbd":
      return "https://schema.org/PreOrder";
    default:
      return "https://schema.org/InStock";
  }
}
