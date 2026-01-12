import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  Calendar, 
  Users, 
  Settings,
  Church
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/ops/admin", icon: LayoutDashboard },
  { name: "Sermons", href: "/ops/admin/sermons", icon: Video },
  { name: "Events", href: "/ops/admin/events", icon: Calendar },
  { name: "Speakers", href: "/ops/admin/speakers", icon: Users },
  { name: "Settings", href: "/ops/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/member/login");
  }

  return (
    <div className="min-h-screen bg-bg pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 min-h-[calc(100vh-80px)] p-4 hidden md:block">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <Church className="w-5 h-5 text-bg" />
            </div>
            <div>
              <p className="font-heading text-text-primary text-sm">Admin</p>
              <p className="text-text-muted text-xs">New Heights</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}