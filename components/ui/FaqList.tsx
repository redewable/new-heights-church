import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { MobileFolds } from "./MobileFolds";

export interface FaqItem {
  q: string;
  a: ReactNode;
}

/**
 * Questions and answers. Desktop: a ledger, question beside answer. Phones:
 * each question is a tappable row and the answer opens beneath it, so the
 * page reads as a list of questions rather than a wall of answers.
 */
export function FaqList({
  items,
  ratio = "1fr_1.5fr",
  className,
}: {
  items: ReadonlyArray<FaqItem>;
  /** Desktop column split — the wider answer column is the default. */
  ratio?: "1fr_1.4fr" | "1fr_1.5fr";
  className?: string;
}) {
  const cols =
    ratio === "1fr_1.4fr" ? "md:grid-cols-[1fr_1.4fr]" : "md:grid-cols-[1fr_1.5fr]";
  return (
    <>
      <dl
        className={cn(
          "hidden divide-y divide-[color:var(--nh-border)] md:block",
          className,
        )}
      >
        {items.map((f) => (
          <div key={f.q} className={cn("grid gap-3 py-7 md:gap-10", cols)}>
            <dt className="font-display text-ink text-lg leading-snug md:text-xl">
              {f.q}
            </dt>
            <dd className="text-stone leading-relaxed">{f.a}</dd>
          </div>
        ))}
      </dl>
      <MobileFolds
        items={items.map((f) => ({ key: f.q, title: f.q, body: f.a }))}
        className={className}
      />
    </>
  );
}
