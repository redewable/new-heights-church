import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { localBusinessSchema, jsonLdScript } from "@/lib/seo/schema";
import { Hero } from "@/components/sections/home/Hero";
import { FeaturedEvent } from "@/components/sections/home/FeaturedEvent";
import { PillarSpread } from "@/components/sections/home/PillarSpread";
import { Mission } from "@/components/sections/home/Mission";
import { Convictions } from "@/components/sections/home/Convictions";
import { MoveOfGod } from "@/components/sections/home/MoveOfGod";
import { SalvationCall } from "@/components/sections/home/SalvationCall";
import { ThisSunday } from "@/components/sections/home/ThisSunday";
import { Letter } from "@/components/sections/home/Letter";
import { BookFeature } from "@/components/sections/BookFeature";
import { Altar } from "@/components/sections/home/Altar";
import { WhereWeGather } from "@/components/sections/home/WhereWeGather";
import { Benediction } from "@/components/sections/home/Benediction";

export const metadata: Metadata = buildMetadata({
  title: null,
  description:
    "New Heights Church — a Spirit-filled, apostolic-prophetic house in College Station, Texas under Apostle Brian Hallam. Sundays 10 AM · Wednesdays 7 PM. Endtime Harvest. Preparation. Habitation.",
  path: "/",
});

/**
 * Home composition. Each section lives in components/sections/home/* so we
 * can iterate on one without disturbing the others. The ordering is
 * deliberate: we open by telling the first-time guest WHY (hero), show
 * them what's next on the calendar (the conference), answer WHAT we're
 * about (pillars), invite them to the nearest on-ramp (Sunday), name the
 * sentence we live by (mission), say what we believe out loud
 * (convictions), say why this house exists (a move of God), hand them a
 * letter from the pastors, put the Apostle's book in their hands, name the
 * altar, show them the address, and send them with a blessing.
 *
 * No testimony module ships until the Church supplies real, consented
 * testimonies — we don't fabricate fruit.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }}
      />
      <Hero />
      <FeaturedEvent />
      <PillarSpread />
      <ThisSunday />
      <Mission />
      <Convictions />
      <MoveOfGod />
      <SalvationCall />
      <Letter />
      <BookFeature tone="ink" />
      <Altar />
      <WhereWeGather />
      <Benediction />
    </>
  );
}
