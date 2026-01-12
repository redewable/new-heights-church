import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  connect: [
    { name: "Plan a Visit", href: "/visit" },
    { name: "Events", href: "/events" },
    { name: "Contact Us", href: "/about" },
  ],
  watch: [
    { name: "Latest Sermons", href: "/watch" },
    { name: "Podcast", href: "/podcast" },
    { name: "Live Stream", href: "/live" },
  ],
  about: [
    { name: "Our Story", href: "/about" },
    { name: "What We Believe", href: "/about/beliefs" },
    { name: "Our Stances", href: "/about/stances" },
  ],
  give: [
    { name: "Give Online", href: "/give" },
    { name: "Asset Giving", href: "/give/assets" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-white/5">
      {/* Main Footer */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 relative">
                <Image
                  src="/images/brand/logo.png"
                  alt="New Heights Church"
                  fill
                  className="object-contain"
                  style={{ filter: "invert(1)" }}
                />
              </div>
              <div>
                <span className="font-heading text-xl text-text-primary block">
                  New Heights
                </span>
                <span className="text-xs text-text-muted uppercase tracking-wider">
                  Church
                </span>
              </div>
            </Link>

            {/* Motto */}
            <p className="text-text-secondary mb-6 text-sm leading-relaxed max-w-xs">
              We exist to love people and point them to Christ.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-text-secondary">
              <a 
                href="https://maps.google.com/?q=8125+Turkey+Creek+Rd+College+Station+TX+77845" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-gold transition-colors"
              >
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>8125 Turkey Creek Rd.<br />College Station, TX 77845</span>
              </a>
              <a 
                href="tel:+19793147585" 
                className="flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>979-314-7585</span>
              </a>
              <a 
                href="mailto:hello@newheightschurch.com" 
                className="flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>hello@newheightschurch.com</span>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">
              Watch
            </h3>
            <ul className="space-y-3">
              {footerLinks.watch.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">
              About
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-4">
              Give
            </h3>
            <ul className="space-y-3">
              {footerLinks.give.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} New Heights Church. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-white/5 transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
