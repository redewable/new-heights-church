import { beforeEach, describe, it, expect, vi } from "vitest";
import {
  INITIAL_CONSENT,
  analyticsAllowed,
  CONSENT_KEY,
  CONSENT_CHANGE_EVENT,
} from "@/lib/consent/constants";
import { readConsent, writeConsent, clearConsent } from "@/lib/consent/storage";

describe("consent storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the initial state when nothing is stored", () => {
    expect(readConsent()).toEqual(INITIAL_CONSENT);
  });

  it("persists an accept-all choice and can read it back", () => {
    const next = writeConsent("all");
    expect(next.choice).toBe("all");
    expect(next.decidedAt).toMatch(/\d{4}-\d{2}-\d{2}T/);
    expect(readConsent().choice).toBe("all");
  });

  it("persists an essential-only choice", () => {
    writeConsent("essential");
    expect(readConsent().choice).toBe("essential");
  });

  it("clears the stored state on reset", () => {
    writeConsent("all");
    clearConsent();
    expect(readConsent().choice).toBe("pending");
    expect(window.localStorage.getItem(CONSENT_KEY)).toBeNull();
  });

  it("dispatches a CustomEvent on change", () => {
    const handler = vi.fn();
    window.addEventListener(CONSENT_CHANGE_EVENT, handler);
    writeConsent("all");
    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
  });

  it("ignores corrupt storage values", () => {
    window.localStorage.setItem(CONSENT_KEY, "not-json");
    expect(readConsent()).toEqual(INITIAL_CONSENT);
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ choice: "garbage", version: 1 }),
    );
    expect(readConsent()).toEqual(INITIAL_CONSENT);
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ choice: "all", version: 99 }),
    );
    expect(readConsent()).toEqual(INITIAL_CONSENT);
  });
});

describe("analyticsAllowed", () => {
  it("only returns true for 'all'", () => {
    expect(analyticsAllowed({ choice: "all", decidedAt: "x", version: 1 })).toBe(true);
    expect(analyticsAllowed({ choice: "essential", decidedAt: "x", version: 1 })).toBe(
      false,
    );
    expect(analyticsAllowed(INITIAL_CONSENT)).toBe(false);
  });
});
