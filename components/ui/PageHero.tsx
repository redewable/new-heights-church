import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { AscendingBars } from "@/components/brand/AscendingBars";
import type { Photo } from "@/lib/constants/media";
import { cn } from "@/lib/utils/cn";

/**
 * Inner-page hero. Ink canvas, the mark + eyebrow, a display title, a lead,
 * and optional actions. Pass a `photo` to set it behind a scrim (subject on
 * the right, copy on the left); without one it's the clean ink gradient.
 * Every inner page uses this so heroes stay consistent — polish it here,
 * not per page.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  photo,
  photoPosition = "70% center",
  size = "md",
  titleMaxCh = 16,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  photo?: Photo;
  /** CSS object-position for the photo. */
  photoPosition?: string;
  size?: "md" | "lg";
  titleMaxCh?: number;
}) {
  return (
    <section
      className={cn(
        "text-cream relative isolate overflow-hidden",
        !photo && "u-grain-ink",
      )}
    >
      {photo ? (
        <div className="u-scrim-photo absolute inset-0 -z-10 bg-[color:var(--nh-ink)]">
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: photoPosition }}
          />
        </div>
      ) : null}

      <Container
        size="xl"
        className={cn(
          "relative",
          !photo && "u-hero-mark",
          size === "lg" ? "py-24 md:py-32 lg:py-36" : "py-16 md:py-24",
        )}
      >
        <div className="max-w-[42rem]">
          <div className="u-rise flex items-center gap-3 text-[color:var(--nh-gold)]">
            <AscendingBars size={20} aria-label="" />
            <span className="u-eyebrow">{eyebrow}</span>
          </div>
          <h1
            className={cn(
              "u-display-dramatic text-cream u-rise u-rise-2 mt-7",
              size === "lg"
                ? "text-[clamp(2.75rem,6.5vw,6rem)]"
                : "text-[clamp(2.5rem,6vw,5.25rem)]",
            )}
            style={{ maxWidth: `${titleMaxCh}ch` }}
          >
            {title}
          </h1>
          {lead ? (
            <p className="text-cream/88 u-rise u-rise-3 mt-6 max-w-[44ch] text-lg leading-relaxed md:text-xl">
              {lead}
            </p>
          ) : null}
          {actions ? (
            <div className="u-rise u-rise-4 mt-9 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
