import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/schema";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import { ValuesList } from "@/components/sections/ValuesList";
import { Convictions } from "@/components/sections/home/Convictions";
import { CHURCH, PILLAR_STRIP } from "@/lib/constants/church";
import Beliefs from "@/content/beliefs.mdx";

export const metadata: Metadata = buildMetadata({
  title: "What we believe",
  description:
    "The statement of faith of New Heights Church — twenty-one values in the Church's own words, the convictions we say out loud, and the three pillars we walk them out on.",
  path: "/about/beliefs",
});

export default function BeliefsPage() {
  const bc = breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "What we believe", href: "/about/beliefs" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bc) }}
      />

      {/* ---- Kicker + purpose (MDX) ---- */}
      <section className="bg-cream pt-20 md:pt-24">
        <Container size="prose">
          <div className="flex items-center gap-3 text-[color:var(--nh-gold-ink)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">Our statement of faith</span>
          </div>
        </Container>
      </section>
      <article className="pb-8 md:pb-10">
        <Container size="prose" as="div">
          <Beliefs />
        </Container>
      </article>

      {/* ---- The twenty-one values ---- */}
      <ValuesList />

      {/* ---- Said out loud in this season ---- */}
      <Convictions />

      {/* ---- The pillars ---- */}
      <section className="py-20 md:py-24">
        <Container size="prose">
          <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">The pillars</p>
          <h2 className="u-display-soft text-ink mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
            Where it all gets walked out.
          </h2>
          <p className="text-ink mt-5 text-lg leading-relaxed md:text-xl">
            The values above get embodied in the three things this house is about right
            now — {PILLAR_STRIP}. See{" "}
            <Link
              href="/grow"
              className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
            >
              the path
            </Link>{" "}
            for how we walk them out, one Sunday at a time.
          </p>
          <p className="text-stone mt-8 text-sm italic">
            For a printed copy of the statement of faith — for elders, group leaders, or
            anyone vetting our doctrine before visiting — contact{" "}
            <a
              href={CHURCH.contact.emailHref}
              className="font-semibold text-[color:var(--nh-scarlet-ink)] underline-offset-4 hover:underline"
            >
              {CHURCH.contact.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
