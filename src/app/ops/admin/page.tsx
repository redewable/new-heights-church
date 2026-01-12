import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Video, Calendar, Users, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: sermonCount },
    { count: eventCount },
    { count: speakerCount },
  ] = await Promise.all([
    supabase.from("sermons").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("speakers").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { name: "Sermons", count: sermonCount || 0, icon: Video, href: "/ops/admin/sermons" },
    { name: "Events", count: eventCount || 0, icon: Calendar, href: "/ops/admin/events" },
    { name: "Speakers", count: speakerCount || 0, icon: Users, href: "/ops/admin/speakers" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-sm text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">Manage your church content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="card hover:border-gold/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">{stat.name}</p>
                <p className="font-heading text-display-sm text-text-primary">{stat.count}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gold" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-heading text-heading-md text-text-primary mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/ops/admin/sermons/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Sermon
          </Link>
          <Link href="/ops/admin/events/new" className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add Event
          </Link>
          <Link href="/ops/admin/speakers/new" className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add Speaker
          </Link>
        </div>
      </div>
    </div>
  );
}