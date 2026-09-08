import {
  CONSENT_CHANGE_EVENT,
  CONSENT_KEY,
  INITIAL_CONSENT,
  type ConsentChoice,
  type ConsentState,
} from "./constants";

/**
 * Pure localStorage helpers for the cookie-consent state. Separated from
 * the React provider so unit tests can exercise the storage contract
 * without spinning up a component tree.
 *
 * All functions are SSR-safe: when `window` isn't available they return
 * the initial state rather than throwing.
 *
 * `getConsentSnapshot` / `subscribeConsent` implement the external-store
 * contract for `useSyncExternalStore`, so the provider never has to call
 * setState inside an effect. Snapshots are cached by the raw stored
 * string, which keeps the reference stable between unchanged reads.
 */

/** In-memory fallback when localStorage is blocked (private mode, policy). */
let volatile: ConsentState | null = null;

let cachedKey: string | null | undefined;
let cachedState: ConsentState = INITIAL_CONSENT;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function parseRaw(raw: string | null): ConsentState {
  if (!raw) return INITIAL_CONSENT;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (
      parsed.choice !== "all" &&
      parsed.choice !== "essential" &&
      parsed.choice !== "pending"
    ) {
      return INITIAL_CONSENT;
    }
    if (parsed.version !== 1) return INITIAL_CONSENT;
    return {
      choice: parsed.choice,
      decidedAt: parsed.decidedAt ?? null,
      version: 1,
    };
  } catch {
    return INITIAL_CONSENT;
  }
}

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return INITIAL_CONSENT;
  const raw = readRaw();
  if (raw) return parseRaw(raw);
  return volatile ?? INITIAL_CONSENT;
}

/** Stable-reference snapshot for `useSyncExternalStore`. */
export function getConsentSnapshot(): ConsentState {
  if (typeof window === "undefined") return INITIAL_CONSENT;
  const raw = readRaw();
  const key =
    raw ?? (volatile ? `volatile:${volatile.choice}:${volatile.decidedAt}` : null);
  if (key === cachedKey) return cachedState;
  cachedKey = key;
  cachedState = raw ? parseRaw(raw) : (volatile ?? INITIAL_CONSENT);
  return cachedState;
}

/** What the server (and the hydrating client) sees: nothing decided yet. */
export function getServerConsentSnapshot(): ConsentState {
  return INITIAL_CONSENT;
}

/** Subscribe to consent changes from this tab and from other tabs. */
export function subscribeConsent(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function writeConsent(choice: ConsentChoice): ConsentState {
  const next: ConsentState = {
    choice,
    decidedAt: choice === "pending" ? null : new Date().toISOString(),
    version: 1,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
      volatile = null;
    } catch {
      // Storage blocked — remember the choice for this page session.
      volatile = next;
    }
    try {
      window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: next }));
    } catch {
      /* noop */
    }
  }
  return next;
}

export function clearConsent(): ConsentState {
  volatile = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(CONSENT_KEY);
    } catch {
      /* noop */
    }
    try {
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGE_EVENT, { detail: INITIAL_CONSENT }),
      );
    } catch {
      /* noop */
    }
  }
  return INITIAL_CONSENT;
}
