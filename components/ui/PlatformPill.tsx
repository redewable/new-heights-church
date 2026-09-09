import { PlatformIcon, type Platform } from "@/components/brand/PlatformIcon";

/** An outbound platform button: the platform's mark and its name. */
export function PlatformPill({
  platform,
  label,
  href,
}: {
  platform: Platform;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink bg-paper inline-flex h-11 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[color:var(--nh-border)] px-4 text-sm font-semibold transition-colors hover:border-[color:var(--nh-ink)]"
    >
      <PlatformIcon platform={platform} size={18} />
      {label}
    </a>
  );
}
