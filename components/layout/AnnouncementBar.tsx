import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Announcement } from "@/lib/constants/announcements";

/**
 * Top-of-page announcement strip. Data-driven from
 * `lib/constants/announcements.ts`, which picks the active entry by date.
 *
 * The gold `lead` is always visible; the longer `headline` only appears
 * from `sm` up so nothing truncates on a phone. The CTA never wraps mid-
 * label — it drops to its own line instead.
 */
export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const a = announcement;
  return (
    <div
      role="region"
      aria-label="Announcement"
      className="bg-ink text-cream w-full text-sm"
    >
      <Container
        size="xl"
        className="flex items-center justify-center gap-x-5 py-2.5 text-center"
      >
        <p className="m-0 min-w-0">
          <span className="font-semibold text-[color:var(--nh-gold)]">{a.lead}</span>
          {a.headline ? (
            <span className="text-cream/85 hidden md:inline"> {a.headline}</span>
          ) : null}
        </p>
        <Link
          href={a.ctaHref}
          className="u-eyebrow text-cream shrink-0 border-b border-[color:var(--nh-gold)] pb-0.5 whitespace-nowrap transition-colors hover:text-[color:var(--nh-gold)]"
        >
          {a.ctaLabel} <span aria-hidden="true">→</span>
        </Link>
      </Container>
    </div>
  );
}
