import { CHURCH } from "@/lib/constants/church";
import { BHM } from "@/lib/constants/bhm";

/**
 * Primary navigation. An item with `children` renders as a menu on desktop
 * (see `NavMenu`) and as a group in the mobile takeover. `secondary`
 * children sit in the menu's footer row — reachable, but not the headline.
 */
export interface NavChild {
  label: string;
  href: string;
  /** One line under the label, desktop menu only. */
  note?: string;
  secondary?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: ReadonlyArray<NavChild>;
}

export const PRIMARY_NAV: ReadonlyArray<NavItem> = [
  { label: "I'm New", href: "/im-new" },
  { label: "Watch", href: "/watch" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Grow", href: "/grow" },
  { label: "Give", href: "/give" },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "New Heights Church",
        href: "/about",
        note: "Who we are, the story, and our purpose.",
      },
      {
        label: "Leadership",
        href: "/about/leadership",
        note: `${CHURCH.leadership.seniorPastor}, ${CHURCH.leadership.firstLady}, and the ministry team.`,
      },
      {
        label: BHM.name,
        href: "/about/brian-hallam-ministries",
        note: "The podcast, the channel, the book, and where to follow Apostle Brian.",
      },
      { label: "What we believe", href: "/about/beliefs", secondary: true },
      { label: "Plan a visit", href: "/about/visit", secondary: true },
    ],
  },
];
