import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils/cn";

/**
 * MDX component mapping — applied when an .mdx file renders inside a page.
 * Keeps content files free of styling so writers can stay in markdown; the
 * visual treatment lives here and tracks the brand system.
 *
 * This file is picked up automatically by `@next/mdx` at the project root.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "u-display-dramatic text-ink mt-0 text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "u-display-soft text-ink mt-14 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn("font-display text-ink mt-10 text-xl md:text-2xl", className)}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn("text-ink mt-5 text-lg leading-relaxed md:text-xl", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn("text-ink mt-5 space-y-3 pl-6 md:text-lg", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn("text-ink mt-5 list-decimal space-y-3 pl-6 md:text-lg", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("leading-relaxed", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "u-display-soft my-10 border-l-2 border-[color:var(--nh-gold)] pl-6 text-[color:var(--nh-stone)]",
          className,
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "text-[color:var(--nh-scarlet-ink)] underline decoration-[color:var(--nh-gold)] decoration-2 underline-offset-[5px] hover:decoration-[color:var(--nh-scarlet)]",
          className,
        )}
        {...props}
      />
    ),
    hr: ({ className, ...props }) => (
      <hr className={cn("my-14 border-[color:var(--nh-border)]", className)} {...props} />
    ),
    strong: ({ className, ...props }) => (
      <strong className={cn("text-ink font-semibold", className)} {...props} />
    ),
    ...components,
  };
}
