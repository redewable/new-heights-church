"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { label: "Home", href: "/member" },
  { label: "Giving", href: "/member/giving" },
  { label: "Family & check-in", href: "/member/family" },
  { label: "Serve", href: "/member/serve" },
  { label: "Profile", href: "/member/profile" },
] as const;

export function MemberNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Member" className="-mx-1 overflow-x-auto">
      <ul className="flex items-center gap-1.5 px-1">
        {ITEMS.map((item) => {
          const active =
            item.href === "/member"
              ? pathname === "/member"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "bg-ink text-cream border-ink"
                    : "bg-paper text-ink border-[color:var(--nh-border)] hover:border-[color:var(--nh-ink)]",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
