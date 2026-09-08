import Link from "next/link";
import { WordMark } from "@/components/brand/WordMark";
import { AdminNav } from "./AdminNav";

/**
 * The staff tools frame: ink sidebar, cream workspace, a preview banner
 * that stays until the tools are wired to real data and real sign-in.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream flex min-h-dvh flex-col lg:flex-row">
      <aside className="bg-ink text-cream flex shrink-0 flex-col border-r border-white/10 lg:sticky lg:top-0 lg:h-dvh lg:w-64">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <WordMark tone="cream" size="sm" href="/admin" />
          <span className="u-eyebrow text-[color:var(--nh-gold)]">Staff</span>
        </div>
        <AdminNav />
        <div className="mt-auto border-t border-white/10 px-5 py-4 text-xs">
          <p className="text-cream/60">Signed in as</p>
          <p className="text-cream mt-0.5 font-mono">preview@newheightschurch.info</p>
          <Link
            href="/"
            className="text-cream/70 hover:text-cream mt-3 inline-block underline-offset-4 hover:underline"
          >
            ← Back to the site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          role="status"
          className="text-ink flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[color:var(--nh-gold)] px-4 py-2 text-center text-xs font-semibold"
        >
          <span className="u-eyebrow">Preview build</span>
          <span className="opacity-80">
            Mock data. Nothing on these screens saves, sends, or syncs yet.
          </span>
        </div>
        <main id="main" className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
