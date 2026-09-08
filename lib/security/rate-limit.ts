import "server-only";

import { headers } from "next/headers";
import { createHash } from "node:crypto";

/**
 * Lightweight per-IP rate limiter backed by Upstash Redis (REST). Falls
 * back to an in-memory LRU when no Redis env is configured so local dev
 * still exercises the logic. The in-memory variant is PER-PROCESS — fine
 * for dev but useless in production where Vercel runs many instances.
 *
 * Usage:
 *   const gate = await rateLimit({ key: "connect-card", max: 10, windowSec: 600 });
 *   if (!gate.ok) return error("Too many submissions. Please try again later.");
 */

interface RateLimitOptions {
  /** A key namespace unique per form, e.g. "connect-card" / "prayer". */
  key: string;
  /** Max allowed submissions in the window. Default 10. */
  max?: number;
  /** Window size in seconds. Default 600 (10 minutes). */
  windowSec?: number;
}

interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
  source: "upstash" | "memory" | "unbounded";
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.trim();
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
const IP_SECRET = process.env.IP_HASH_SECRET ?? "nhc-dev-ip-secret";

/** Derive a stable, non-reversible IP fingerprint for logs and rate keys. */
export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const raw =
    h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "anon";
  return createHash("sha256").update(`${IP_SECRET}:${raw}`).digest("hex").slice(0, 32);
}

/** Raw client IP — ONLY for piping to Turnstile's verify call; never log. */
export async function clientIpRaw(): Promise<string | undefined> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? undefined
  );
}

export async function rateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const max = opts.max ?? 10;
  const windowSec = opts.windowSec ?? 600;
  const ipHash = await clientIpHash();
  const bucket = `rl:${opts.key}:${ipHash}`;

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    return upstashLimit(bucket, max, windowSec);
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      `[rate-limit] Upstash env is not set in production; bucket ${opts.key} is unbounded.`,
    );
    return {
      ok: true,
      remaining: max,
      resetAt: Date.now() + windowSec * 1000,
      source: "unbounded",
    };
  }
  return memoryLimit(bucket, max, windowSec);
}

// ---------- Upstash (INCR + EXPIRE via REST pipeline) ----------
async function upstashLimit(
  bucket: string,
  max: number,
  windowSec: number,
): Promise<RateLimitResult> {
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify([
        ["INCR", bucket],
        ["EXPIRE", bucket, windowSec, "NX"],
        ["TTL", bucket],
      ]),
    });
    if (!res.ok) throw new Error(`upstash-${res.status}`);
    const payload = (await res.json()) as Array<{ result: number | string }>;
    const count = Number(payload[0]?.result ?? 0);
    const ttl = Number(payload[2]?.result ?? windowSec);
    const resetAt = Date.now() + Math.max(ttl, 1) * 1000;
    return {
      ok: count <= max,
      remaining: Math.max(0, max - count),
      resetAt,
      source: "upstash",
    };
  } catch {
    // On Upstash outage, fail open — we'd rather accept a legitimate
    // submission than lock out the altar because a Redis hiccup hit at
    // the wrong second. Turnstile + honeypot still protect us.
    return {
      ok: true,
      remaining: max,
      resetAt: Date.now() + windowSec * 1000,
      source: "unbounded",
    };
  }
}

// ---------- In-memory (dev only) ----------
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(bucket: string, max: number, windowSec: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(bucket);
  if (!entry || entry.resetAt < now) {
    memoryStore.set(bucket, { count: 1, resetAt: now + windowSec * 1000 });
    return {
      ok: true,
      remaining: max - 1,
      resetAt: now + windowSec * 1000,
      source: "memory",
    };
  }
  entry.count += 1;
  return {
    ok: entry.count <= max,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.resetAt,
    source: "memory",
  };
}
