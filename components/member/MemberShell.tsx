import Link from "next/link";
import { WordMark } from "@/components/brand/WordMark";
import { Container } from "@/components/ui/Container";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { MemberNav } from "./MemberNav";
import { MEMBER } from "@/lib/member/mock";

/**
 * The family side of the site. Same brand, warmer and quieter than the
 * public pages: cream throughout, one gold accent, no hero. The nav is a
 * row of pills; on phones it scrolls sideways.
 */
export function MemberShell({ children }: { children: React.ReactNode }) {
  const initials = `${MEMBER.firstName[0]}${MEMBER.lastName[0]}`;
  return (
    <div className="bg-cream flex min-h-dvh flex-col">
      <PreviewBanner note="Sample household. Sign-in, giving, and check-in codes are illustrations until the portal is wired to Planning Center." />
      <header className="border-b border-[color:var(--nh-border)] bg-[color:var(--nh-cream)]">
        <Container
          size="lg"
          className="flex h-[4.5rem] items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <WordMark size="sm" />
            <span className="u-eyebrow hidden text-[color:var(--nh-gold-ink)] sm:inline">
              Family
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/member/profile" className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className="bg-ink text-cream flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-semibold"
              >
                {initials}
              </span>
              <span className="text-ink hidden font-medium sm:inline">
                {MEMBER.firstName} {MEMBER.lastName[0]}.
              </span>
            </Link>
            <Link
              href="/member/sign-in"
              className="text-stone hover:text-ink text-sm underline-offset-4 hover:underline"
            >
              Sign out
            </Link>
          </div>
        </Container>
        <Container size="lg" className="pb-3">
          <MemberNav />
        </Container>
      </header>
      <main id="main" className="flex-1 py-10 md:py-14">
        <Container size="lg">{children}</Container>
      </main>
      <footer className="border-t border-[color:var(--nh-border)] py-6">
        <Container
          size="lg"
          className="text-fog flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <span>Questions about your account? Call the office at 979-314-7585.</span>
          <Link href="/" className="hover:text-ink underline-offset-4 hover:underline">
            ← Back to the site
          </Link>
        </Container>
      </footer>
    </div>
  );
}
