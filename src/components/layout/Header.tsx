"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "Watch", href: "/watch" },
  { name: "Podcast", href: "/podcast" },
  { name: "Events", href: "/events" },
  {
    name: "About",
    href: "/about",
    children: [
      { name: "Our Story", href: "/about" },
      { name: "What We Believe", href: "/about/beliefs" },
      { name: "Our Stances", href: "/about/stances" },
    ],
  },
  { name: "Give", href: "/give" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-premium border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <nav className="container-site">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 relative">
              <Image
                src="/images/brand/logo.png"
                alt="New Heights Church"
                fill
                className="object-contain invert brightness-0 group-hover:brightness-100 group-hover:invert-0 transition-all"
                style={{ filter: "invert(1)" }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-lg text-text-primary group-hover:text-gold transition-colors">
                New Heights
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors",
                        pathname.startsWith(item.href)
                          ? "text-gold"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 py-2 w-48 bg-bg-elevated border border-white/10 rounded-lg shadow-elevated"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "text-gold"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Plan a Visit - Desktop */}
            <Link
              href="/visit"
              className="hidden md:inline-flex btn-primary text-xs py-2 px-4"
            >
              Plan a Visit
            </Link>

            {/* Member Login */}
            <Link
              href="/member/login"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Member Login"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden backdrop-premium border-t border-white/5"
          >
            <div className="container-site py-6 space-y-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-wider text-text-muted">
                        {item.name}
                      </span>
                      <div className="space-y-1 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-2 text-text-secondary hover:text-text-primary transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-2 text-lg transition-colors",
                        pathname === item.href
                          ? "text-gold"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-white/10">
                <Link href="/visit" className="btn-primary w-full">
                  Plan a Visit
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
