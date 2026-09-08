import type { Metadata } from "next";

/**
 * /member — the family portal. PREVIEW on a sample household; blocked from
 * search engines here and in robots.ts. Real sign-in is a Supabase magic
 * link matched to a Planning Center person.
 */
export const metadata: Metadata = {
  title: { default: "My New Heights", template: "%s · My New Heights" },
  robots: { index: false, follow: false, nocache: true },
};

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return children;
}
