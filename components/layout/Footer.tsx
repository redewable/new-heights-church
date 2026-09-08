import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { WordMark } from "@/components/brand/WordMark";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { CHURCH, PILLAR_STRIP } from "@/lib/constants/church";
import { BHM, BOOK } from "@/lib/constants/bhm";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const COL_CONNECT: ReadonlyArray<FooterLink> = [
  { label: "I'm New", href: "/im-new" },
  { label: "Plan a Visit", href: "/about/visit" },
  { label: "Connect Card", href: "/connect" },
  { label: "Prayer Request", href: "/connect/prayer" },
  { label: "I Made a Decision", href: "/connect/decision" },
];

const COL_GROW: ReadonlyArray<FooterLink> = [
  { label: "The Path", href: "/grow" },
  { label: "Foundations of Faith", href: "/grow/foundation-faith" },
  { label: "Baptism", href: "/grow/baptism" },
  { label: "Life Groups", href: "/grow/life-groups" },
  { label: "Membership", href: "/grow/membership" },
  { label: "Volunteer", href: "/grow/volunteer" },
];

const COL_DISCOVER: ReadonlyArray<FooterLink> = [
  { label: "Watch Live", href: "/watch" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Young Lions (Kids)", href: "/kids" },
  { label: "Youth Army", href: "/youth" },
  { label: "Rise Up and Build", href: "/rise-up-and-build" },
];

const COL_BHM: ReadonlyArray<FooterLink> = [
  { label: "brianhallam.com", href: BHM.url, external: true },
  { label: "YouTube", href: BHM.youtube, external: true },
  { label: BOOK.title, href: "/resources#book" },
  { label: "The Brian Hallam Podcast", href: "/podcasts#brian-hallam-podcast" },
  { label: "Resources", href: "/resources" },
];

/**
 * Site footer in three rows: a masthead (the mark and the three pillars),
 * the house block with four link columns, and the legal strip. Column
 * widths are set so no label wraps at desktop; the pillar strip stays on
 * one line from `md` up.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream border-t border-white/10">
      <Container size="xl">
        {/* ---- Masthead ---- */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <WordMark tone="cream" />
          <div className="flex items-center gap-3">
            <AscendingBars size={22} tone="pillars" aria-label="" />
            <span className="u-eyebrow text-[color:var(--nh-gold)] lg:whitespace-nowrap">
              {PILLAR_STRIP}
            </span>
          </div>
        </div>

        {/* ---- The house + link columns ---- */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 md:py-16 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.3fr] lg:gap-x-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h2 className="u-eyebrow text-[color:var(--nh-gold)]">The house</h2>
            <p className="text-cream mt-4 max-w-xs leading-relaxed">{CHURCH.mission}</p>
            <p className="text-cream/60 mt-3 max-w-xs text-sm leading-relaxed">
              Under the apostolic leadership of {CHURCH.leadership.seniorPastor} and{" "}
              {CHURCH.leadership.firstLady}. Planted {CHURCH.founded}.
            </p>

            <address className="text-cream/80 mt-6 space-y-1 text-sm not-italic">
              <div>{CHURCH.address.street}</div>
              <div>
                {CHURCH.address.city}, {CHURCH.address.region} {CHURCH.address.postal}
              </div>
              <div>
                <a
                  className="hover:text-cream underline-offset-4 hover:underline"
                  href={CHURCH.contact.phoneHref}
                >
                  {CHURCH.contact.phone}
                </a>
              </div>
              <div>
                <a
                  className="u-break-anywhere hover:text-cream underline-offset-4 hover:underline"
                  href={CHURCH.contact.emailHref}
                >
                  {CHURCH.contact.email}
                </a>
              </div>
            </address>

            <ul className="text-cream/70 mt-5 space-y-1 text-sm">
              {CHURCH.services.map((s) => (
                <li key={s.name} className="whitespace-nowrap">
                  <span className="text-cream font-semibold">{s.dayOfWeek}s</span> ·{" "}
                  {s.time} {s.zone}
                </li>
              ))}
            </ul>
          </div>

          <FooterCol title="Connect" items={COL_CONNECT} />
          <FooterCol title="Grow" items={COL_GROW} />
          <FooterCol title="Discover" items={COL_DISCOVER} />
          <FooterCol title={BHM.name} items={COL_BHM} />
        </div>
      </Container>

      {/* ---- Legal strip ---- */}
      <div className="border-t border-white/10">
        <Container
          size="xl"
          className="text-cream/60 flex flex-col gap-5 py-6 text-xs md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-3">
            <AscendingBars
              size={18}
              className="text-[color:var(--nh-gold)]"
              aria-label=""
            />
            <span className="whitespace-nowrap">
              © {year} {CHURCH.name}. All rights reserved.
            </span>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link href="/legal/privacy" className="hover:text-cream">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-cream">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/legal/child-protection" className="hover:text-cream">
                Child Protection
              </Link>
            </li>
          </ul>

          <ul className="flex items-center gap-2" aria-label="Social">
            <li>
              <SocialLink href={CHURCH.urls.facebook} label="New Heights on Facebook">
                <FacebookIcon />
              </SocialLink>
            </li>
            <li>
              <SocialLink href={CHURCH.urls.instagram} label="New Heights on Instagram">
                <InstagramIcon />
              </SocialLink>
            </li>
            <li>
              <SocialLink href={CHURCH.urls.youtube} label="New Heights on YouTube">
                <YouTubeIcon />
              </SocialLink>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<FooterLink>;
}) {
  return (
    <div>
      <h2 className="u-eyebrow mb-4 text-[color:var(--nh-gold)] lg:whitespace-nowrap">
        {title}
      </h2>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.href} className="lg:whitespace-nowrap">
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/85 hover:text-cream inline-block py-0.5"
              >
                {item.label} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link
                href={item.href}
                className="text-cream/85 hover:text-cream inline-block py-0.5"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cream/70 hover:text-ink inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-[color:var(--nh-gold)] hover:bg-[color:var(--nh-gold)]"
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.96h-1.51c-1.49 0-1.96.92-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  );
}
