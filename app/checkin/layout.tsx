import type { Metadata } from "next";

/**
 * /checkin — Young Lions check-in kiosk and volunteer roster. PREVIEW on a
 * sample station; blocked from search engines here and in robots.ts. The
 * real kiosk runs on a locked-down tablet signed in as a station account.
 */
export const metadata: Metadata = {
  title: { default: "Young Lions check-in", template: "%s · Young Lions check-in" },
  robots: { index: false, follow: false, nocache: true },
};

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
