import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    // Enable partial prerendering when stable
  },
  // Redirect /admin to Sanity Studio
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/studio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
