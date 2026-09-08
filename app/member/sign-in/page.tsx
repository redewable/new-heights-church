import type { Metadata } from "next";
import Link from "next/link";
import { WordMark } from "@/components/brand/WordMark";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { PreviewButton } from "@/components/admin/ui";
import { CHURCH } from "@/lib/constants/church";

export const metadata: Metadata = { title: "Sign in" };

/**
 * No passwords. A member types the email Planning Center knows them by, we
 * send a link, the link signs them in for the session. First-time guests
 * are pointed to the Connect Card instead of an account form.
 */
export default function MemberSignIn() {
  return (
    <div className="bg-ink text-cream flex min-h-dvh flex-col">
      <PreviewBanner note="Sample sign-in. The real one emails a link that works for fifteen minutes." />
      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between">
            <WordMark tone="cream" size="sm" />
            <span className="u-eyebrow text-[color:var(--nh-gold)]">Family</span>
          </div>

          <div className="u-grain-ink mt-10 rounded-[var(--radius-lg)] border border-white/10 p-7 md:p-9">
            <AscendingBars
              size={28}
              className="text-[color:var(--nh-gold)]"
              aria-label=""
            />
            <h1 className="u-display-dramatic text-cream mt-5 text-[clamp(2rem,5vw,2.75rem)]">
              Welcome home.
            </h1>
            <p className="text-cream/80 mt-3 text-sm leading-relaxed">
              Sign in with the email the church has for you. We&rsquo;ll send a link — no
              password to remember.
            </p>

            <form className="mt-7 space-y-4" aria-label="Sign in (preview)">
              <label className="block">
                <span className="u-eyebrow text-cream/70">Email</span>
                <input
                  type="email"
                  disabled
                  placeholder="you@example.com"
                  className="text-cream placeholder:text-cream/40 mt-2 w-full rounded-[var(--radius)] border border-white/20 bg-white/5 px-4 py-3 text-base"
                />
              </label>
              <PreviewButton tone="gold">Send my sign-in link</PreviewButton>
            </form>

            <p className="text-cream/60 mt-6 text-xs leading-relaxed">
              The link works for fifteen minutes and only on the device that asked for it.
              Your giving and family details never leave Planning Center.
            </p>
          </div>

          <p className="text-cream/70 mt-6 text-center text-sm">
            First time at New Heights?{" "}
            <Link
              href="/im-new"
              className="text-cream underline-offset-4 hover:underline"
            >
              Start with a Connect Card
            </Link>
            .
          </p>
          <p className="text-cream/50 mt-2 text-center text-xs">
            Or call the office · {CHURCH.contact.phone}
          </p>
          <p className="mt-8 text-center">
            <Link
              href="/member"
              className="u-eyebrow text-[color:var(--nh-gold)] hover:underline"
            >
              Preview the portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
