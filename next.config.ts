import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/**
 * Security headers per RFP §13. CSP is intentionally deferred — we'll lock
 * it down in Phase 6 once the full third-party allowlist (Turnstile, GA4,
 * Meta, YouTube, Supabase, Pushpay, Engiven) is known. Tracked in
 * docs/RUNBOOK.md.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * `mdx` is NOT in `pageExtensions` — we import .mdx content into TSX
   * pages instead of routing directly to it. Lets us wrap content in a
   * consistent editorial shell (headings, container, breadcrumbs).
   */
  pageExtensions: ["ts", "tsx"],
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "experiencenewheights.churchcenter.com" },
      // Brian Hallam Ministries — book cover + itinerary artwork.
      { protocol: "https", hostname: "brianhallam.com" },
      // Legacy WordPress uploads — conference posters until Phase 6 migrates media.
      { protocol: "https", hostname: "newheightschurch.info" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withMDX = createMDX({
  // The default (unified + remark + rehype) is plenty for our use.
});

export default withMDX(nextConfig);
