import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadRedirects, matchRedirect } from "@/lib/redirects/queries";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`. Runtime is nodejs
 * (no edge) — that's fine for our use: we query the Supabase redirect
 * table with a short TTL cache, which needs Node's fetch semantics.
 *
 * On every non-asset request we check the legacy→new URL map loaded
 * from Supabase (60s cache) and issue a 301 if a rule matches. When the
 * table is unavailable we fall back to a hand-written fixture of common
 * WordPress routes so inbound links never 404 during an outage.
 *
 * Scope is tight: skip `/api`, `/_next`, `/static`, and files with an
 * extension. Those should flow through untouched.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (shouldSkip(pathname)) return NextResponse.next();

  const rules = await loadRedirects();
  const match = matchRedirect(pathname, rules);
  if (!match) return NextResponse.next();

  // Preserve query string unless the target already has its own.
  const targetHasQuery = match.target.includes("?");
  const target = targetHasQuery ? match.target : `${match.target}${search ?? ""}`;

  const url = target.startsWith("http")
    ? new URL(target)
    : new URL(target, request.nextUrl.origin);

  return NextResponse.redirect(url, match.status);
}

function shouldSkip(pathname: string): boolean {
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/static")) return true;
  if (pathname === "/favicon.ico") return true;
  // Static assets (anything with a file extension past the last slash).
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  if (/\.[a-zA-Z0-9]+$/.test(lastSegment)) return true;
  return false;
}

export const config = {
  // Match everything except the obvious static routes. The internal
  // `shouldSkip` guard covers anything the matcher lets through.
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
