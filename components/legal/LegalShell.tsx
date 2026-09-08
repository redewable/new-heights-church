import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";

/**
 * Shell used by every /legal/* page. A quiet hero, a prose column for
 * the MDX body, and a back-links footer. Keeps the three legal docs
 * visually consistent without forking the TSX across three files.
 */
export function LegalShell({
  kicker,
  children,
}: {
  kicker: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-cream border-b border-[color:var(--nh-border)] pt-20 md:pt-24">
        <Container size="prose">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold-ink)]">
            <AscendingBars size={18} aria-label="" />
            <span className="u-eyebrow">{kicker}</span>
          </div>
        </Container>
      </section>

      <article className="bg-cream pb-28 md:pb-36">
        <Container size="prose" as="div">
          {children}
        </Container>
      </article>

      <section className="border-t border-[color:var(--nh-border)] bg-[color:var(--nh-bone)] py-10">
        <Container
          size="prose"
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <p className="u-eyebrow text-fog">Legal · New Heights Church</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <li>
              <Link
                href="/legal/privacy"
                className="text-ink underline-offset-4 hover:underline"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="text-ink underline-offset-4 hover:underline"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/legal/child-protection"
                className="text-ink underline-offset-4 hover:underline"
              >
                Child Protection
              </Link>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}
