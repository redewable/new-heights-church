import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { WordMark } from "@/components/brand/WordMark";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { PlatformIcon, type Platform } from "@/components/brand/PlatformIcon";
import { CHURCH, PILLAR_STRIP } from "@/lib/constants/church";
import { BHM, BOOK } from "@/lib/constants/bhm";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialSpec {
  platform: Platform;
  href: string;
  label: string;
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
  { label: BOOK.title, href: "/resources#book" },
  { label: BHM.podcast.title, href: "/podcasts#brian-hallam-podcast" },
  { label: "Resources", href: "/resources" },
];

/** Where Apostle Brian publishes — the podcast, the channel, and his own accounts. */
const BHM_SOCIAL: ReadonlyArray<SocialSpec> = [
  { platform: "youtube", href: BHM.youtube, label: `${BHM.name} on YouTube` },
  {
    platform: "apple",
    href: BHM.podcast.apple,
    label: `${BHM.podcast.title} on Apple Podcasts`,
  },
  {
    platform: "spotify",
    href: BHM.podcast.spotify,
    label: `${BHM.podcast.title} on Spotify`,
  },
  { platform: "facebook", href: BHM.facebook, label: "Apostle Brian Hallam on Facebook" },
  {
    platform: "instagram",
    href: BHM.instagram,
    label: "Apostle Brian Hallam on Instagram",
  },
];

const CHURCH_SOCIAL: ReadonlyArray<SocialSpec> = [
  { platform: "facebook", href: CHURCH.urls.facebook, label: "New Heights on Facebook" },
  {
    platform: "instagram",
    href: CHURCH.urls.instagram,
    label: "New Heights on Instagram",
  },
  { platform: "youtube", href: CHURCH.urls.youtube, label: "New Heights on YouTube" },
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
          <FooterCol
            title={BHM.name}
            items={COL_BHM}
            after={<SocialRow items={BHM_SOCIAL} label={`${BHM.name} elsewhere`} />}
          />
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

          <SocialRow items={CHURCH_SOCIAL} label="Social" />
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
  after,
}: {
  title: string;
  items: ReadonlyArray<FooterLink>;
  /** Anything that belongs under the links — the BHM column carries a social row. */
  after?: ReactNode;
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
      {after ? <div className="mt-5">{after}</div> : null}
    </div>
  );
}

function SocialRow({
  items,
  label,
}: {
  items: ReadonlyArray<SocialSpec>;
  label: string;
}) {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label={label}>
      {items.map((s) => (
        <li key={s.platform}>
          <a
            href={s.href}
            aria-label={s.label}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/70 hover:text-ink inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-[color:var(--nh-gold)] hover:bg-[color:var(--nh-gold)]"
          >
            <PlatformIcon
              platform={s.platform}
              size={s.platform === "youtube" ? 18 : 16}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
