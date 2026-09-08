import { WordMark } from "@/components/brand/WordMark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

export const PRIMARY_NAV = [
  { label: "I'm New", href: "/im-new" },
  { label: "Watch", href: "/watch" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Grow", href: "/grow" },
  { label: "Give", href: "/give" },
  { label: "About", href: "/about" },
] as const;

/**
 * Site header. Cream, sticky, one row: the mark, the primary nav with a
 * gold active underline, and two decisions — watch, or give.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--nh-border)] bg-[color:var(--nh-cream)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--nh-cream)]/85">
      <Container
        size="xl"
        className="flex h-[4.5rem] items-center justify-between gap-8 md:h-[5.25rem]"
      >
        <WordMark size="md" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" size="sm" href="/watch">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--nh-scarlet)]"
            />
            Watch live
          </Button>
          <Button variant="gold" size="sm" href="/give">
            Give
          </Button>
        </div>

        <MobileNav items={PRIMARY_NAV} />
      </Container>
    </header>
  );
}
