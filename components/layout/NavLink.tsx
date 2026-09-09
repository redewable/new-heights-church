"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

/** The primary-nav item look — shared by plain links and the menu button. */
export function navItemClass(active: boolean): string {
  return cn(
    "text-ink relative inline-flex h-10 items-center text-[0.95rem] font-medium transition-colors hover:text-[color:var(--nh-gold-ink)]",
    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[color:var(--nh-gold)] after:transition-transform after:duration-200",
    active && "after:scale-x-100",
  );
}

/**
 * Primary-nav link with an active state: a gold underline when the
 * current route is this item or lives beneath it.
 */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={navItemClass(active)}
    >
      {children}
    </Link>
  );
}
