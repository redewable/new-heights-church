"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { type ConsentChoice, type ConsentState } from "@/lib/consent/constants";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent/storage";

interface ConsentContextValue {
  state: ConsentState;
  accept: () => void;
  essentialOnly: () => void;
  reset: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

/**
 * Provider that exposes consent state from localStorage as an external
 * store. `useSyncExternalStore` gives us SSR-safe hydration (server and
 * first client render both see "pending") with no setState-in-effect, and
 * keeps every tab in sync via the `storage` event.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  const apply = useCallback((choice: ConsentChoice) => {
    writeConsent(choice);
  }, []);

  const accept = useCallback(() => apply("all"), [apply]);
  const essentialOnly = useCallback(() => apply("essential"), [apply]);
  const reset = useCallback(() => apply("pending"), [apply]);

  return (
    <ConsentContext.Provider value={{ state, accept, essentialOnly, reset }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within <ConsentProvider>.");
  }
  return ctx;
}
