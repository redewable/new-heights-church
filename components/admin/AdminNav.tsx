"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const GROUPS: ReadonlyArray<{
  label: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin" },
      { label: "Roadmap", href: "/admin/roadmap" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Sermons", href: "/admin/sermons" },
      { label: "Events", href: "/admin/events" },
      { label: "Announcements", href: "/admin/announcements" },
      { label: "Testimonies", href: "/admin/testimonies" },
      { label: "Media library", href: "/admin/media" },
      { label: "Redirects", href: "/admin/redirects" },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Submissions", href: "/admin/submissions" },
      { label: "Campaign progress", href: "/admin/campaign" },
    ],
  },
  {
    label: "Previews",
    items: [
      { label: "Member portal", href: "/member" },
      { label: "Young Lions check-in", href: "/checkin" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Email & follow-up", href: "/admin/email" },
      { label: "Integrations", href: "/admin/integrations" },
      { label: "Users & roles", href: "/admin/users" },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
      {GROUPS.map((g) => (
        <div key={g.label} className="mb-5">
          <p className="u-eyebrow text-cream/50 px-2 pb-2">{g.label}</p>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-[var(--radius)] px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "text-ink bg-[color:var(--nh-gold)] font-semibold"
                        : "text-cream/80 hover:text-cream hover:bg-white/5",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
