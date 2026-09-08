/**
 * Lazy initializer for `useState` — reads `navigator.userAgent` once on
 * mount without requiring a `useEffect`. Safe on the server (returns an
 * empty string when `navigator` isn't defined); when hydrated in the
 * browser, the real value replaces it without an extra render pass.
 */
export function readUserAgent(): string {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent.slice(0, 300);
}
