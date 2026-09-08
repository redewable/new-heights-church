import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * /admin — staff tools. PREVIEW: no sign-in yet, mock data everywhere,
 * blocked from search engines here and in robots.ts. Phase 2 adds Supabase
 * Auth with the ADMIN_EMAILS allow-list; until then nothing here can write.
 */
export const metadata: Metadata = {
  title: { default: "Staff", template: "%s · Staff · New Heights" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
