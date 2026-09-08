import "server-only";

/**
 * Cloudflare Turnstile verification. Returns `ok: true` when we either
 * don't have the secret key (dev) or the token verified. The error branch
 * only fires when the secret IS configured and the token fails — that's
 * when we're confident enough to reject the submission.
 *
 * When the key isn't configured we log once so nobody ships to prod
 * thinking captcha is live. The `warned` flag guards against log spam.
 */

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

let warned = false;

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (!warned && process.env.NODE_ENV === "production") {
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY is not set. Form submissions are unprotected. Set the key before launch.",
      );
      warned = true;
    }
    return { ok: true };
  }

  if (!token || token.length === 0) {
    return { ok: false, reason: "missing-token" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, reason: `verify-http-${res.status}` };
    const data = (await res.json()) as TurnstileVerifyResponse;
    if (data.success) return { ok: true };
    const code = data["error-codes"]?.[0] ?? "unknown";
    return { ok: false, reason: `verify-${code}` };
  } catch {
    return { ok: false, reason: "verify-network" };
  }
}
