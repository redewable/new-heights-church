import { cn } from "@/lib/utils/cn";
import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** `md` = default content max (1072px), `lg` = 1200, `xl` = 1320, `prose` = 720 */
  size?: "prose" | "md" | "lg" | "xl";
}

const SIZE: Record<NonNullable<ContainerProps["size"]>, string> = {
  prose: "max-w-[45rem]",
  md: "max-w-[67rem]",
  lg: "max-w-[75rem]",
  xl: "max-w-[82.5rem]",
};

/**
 * Centered max-width wrapper. Gutter is 20px on phones, 32px on
 * tablets, 48px on desktop — set here and nowhere else (docs/BRAND.md §5.2).
 */
export function Container({
  as: As = "div",
  children,
  className,
  size = "md",
}: ContainerProps) {
  return (
    <As className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", SIZE[size], className)}>
      {children}
    </As>
  );
}
