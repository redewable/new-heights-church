"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget. Renders a hidden input `name="turnstileToken"`
 * that the server action picks up via FormData. When the site key isn't
 * configured we render nothing and the server verifier treats the submission
 * as ok — see `lib/security/turnstile.ts`.
 *
 * We lazy-load the Turnstile script with `strategy="lazyOnload"` so it
 * doesn't block first paint. The widget auto-renders itself against any
 * DOM node carrying `.cf-turnstile`.
 */

interface TurnstileWindow {
  turnstile?: {
    render: (
      el: HTMLElement | string,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        "error-callback"?: () => void;
        "expired-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact";
      },
    ) => string;
    reset: (widgetId?: string) => void;
  };
}

declare const window: Window & TurnstileWindow;

export function TurnstileWidget({
  action,
  theme = "light",
}: {
  /** Distinguishes which form the token came from — forwarded to Turnstile. */
  action: "connect-card" | "prayer" | "decision" | "newsletter";
  theme?: "light" | "dark" | "auto";
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string>("");
  const [ready, setReady] = useState(false);

  const render = useCallback(() => {
    if (!siteKey || !containerRef.current) return;
    if (!window.turnstile) return;
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      size: "normal",
      callback: (t: string) => setToken(t),
      "error-callback": () => setToken(""),
      "expired-callback": () => {
        setToken("");
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      },
    });
  }, [siteKey, theme]);

  useEffect(() => {
    if (ready) render();
  }, [ready, render]);

  // No key? Render nothing. The server action accepts an empty token when
  // the secret isn't configured, so the form still works in dev.
  if (!siteKey) return null;

  return (
    <div className="mt-4">
      <input type="hidden" name="turnstileToken" value={token} />
      <input type="hidden" name="turnstileAction" value={action} />
      <div ref={containerRef} aria-label="Human verification" />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => setReady(true)}
      />
    </div>
  );
}
