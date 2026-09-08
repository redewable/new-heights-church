import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { getActiveAnnouncement } from "@/lib/constants/announcements";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const announcement = getActiveAnnouncement();
  return (
    <>
      {announcement ? <AnnouncementBar announcement={announcement} /> : null}
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
