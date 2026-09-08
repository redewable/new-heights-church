/**
 * Giving channels — source of truth for every "give" link on the site.
 *
 * We deliberately keep this separate from `lib/constants/church.ts` because
 * the giving surface has its own lifecycle: processors change, crypto gets
 * added or dropped, campaigns come and go. Import GIVING from here anywhere
 * the site needs a giving URL; never hard-code.
 */

import { CHURCH } from "./church";

export const GIVING = {
  /**
   * Pushpay — the primary online giving portal. Handles card, ACH,
   * one-time, and recurring. PCI-DSS scope sits with Pushpay; the card
   * never touches our origin.
   */
  pushpay: {
    label: "Online",
    url: "https://pushpay.com/g/newheightschurch",
    kind: "online" as const,
    blurb:
      "Card, bank transfer, or recurring. The fastest way; most of our family uses this.",
  },

  /**
   * Engiven — crypto donation widget. Donors contribute BTC, ETH, and
   * other major chains; Engiven handles custody and conversion.
   */
  engiven: {
    label: "Crypto",
    url: "https://platform.engiven.com/give/1110/widget/1000",
    kind: "crypto" as const,
    blurb:
      "Donate Bitcoin, Ethereum, and other major cryptocurrencies through our Engiven partner.",
  },

  /**
   * Edward Jones-held securities account for stock and mutual-fund gifts.
   * The donor's broker delivers to DTC #0057 using the instructions in
   * the public PDF — staff rep for questions is on the PDF as well.
   */
  securities: {
    label: "Stock & securities",
    pdfPath: "/docs/nhc-securities-contribution.pdf",
    broker: "Edward Jones",
    dtcNumber: "0057",
    /** Keep the tax ID in this constants file, not inlined in JSX. */
    taxId: "43-0345811",
    staffEmail: "secretary@newheightschurch.info",
    kind: "securities" as const,
    blurb:
      "Contribute appreciated stock, mutual funds, or bonds through the Church's Edward Jones account. Your broker handles the delivery.",
  },

  /**
   * Mail a check. Address derives from CHURCH constants so a single address
   * change updates everything.
   */
  mail: {
    label: "Check by mail",
    payableTo: CHURCH.name,
    address: CHURCH.address.full,
    kind: "mail" as const,
    blurb: "Make checks payable to New Heights Church and send to the campus address.",
  },

  /**
   * In-person offering during any service. Not a link — a reminder.
   */
  inPerson: {
    label: "In person",
    kind: "in_person" as const,
    blurb: "Drop your gift in the basket at any Sunday or midweek service.",
  },
} as const;

/**
 * Build a Pushpay URL tagged with UTM params so staff can see which page
 * drove the click. Pushpay passes query params through to its analytics.
 */
export function pushpayHref(campaign: string): string {
  const u = new URL(GIVING.pushpay.url);
  u.searchParams.set("utm_source", "website");
  u.searchParams.set("utm_medium", "give");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

/**
 * Named giving campaigns — in-flight initiatives beyond general giving.
 * Populate `campaign_progress` rows via admin; surface on /give and
 * /rise-up-and-build.
 */
export const CAMPAIGNS = {
  riseUpAndBuild: {
    slug: "rise-up-and-build",
    title: "Rise Up and Build",
    shortTitle: "Rise Up",
    href: "/rise-up-and-build",
    blurb:
      "Capital initiative — every seat filled, every square foot sanctified, every ceiling raised for what the Lord is doing in this season.",
  },
  givingTowardsGrowth: {
    slug: "giving-towards-growth",
    title: "Giving Towards Growth for The Harvest",
    shortTitle: "Growth for the Harvest",
    href: "/give#growth-for-the-harvest",
    blurb:
      "A focused push into the first pillar — the end-time Harvest. Seats, altars, and staff for the next season of souls.",
  },
} as const;

export type CampaignKey = keyof typeof CAMPAIGNS;
