import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if exists
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ["/member", "/ops"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Allow login pages
  const isLoginPage =
    request.nextUrl.pathname === "/member/login" ||
    request.nextUrl.pathname === "/ops/login";

  if (isProtectedPath && !isLoginPage && !user) {
    // Redirect to login
    const loginUrl = request.nextUrl.pathname.startsWith("/ops")
      ? "/ops/login"
      : "/member/login";
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // Redirect logged-in users away from login pages
  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.pathname.startsWith("/ops")
      ? "/ops/kids/rooms"
      : "/member";
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json|api).*)",
  ],
};
