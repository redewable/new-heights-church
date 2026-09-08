/**
 * Photography the Church already owns — served from brianhallam.com and the
 * legacy WordPress site until Phase 6 migrates media into Supabase storage.
 * Every image here is the Church's own; no stock. Hosts are allow-listed in
 * `next.config.ts`.
 *
 * Alt text describes the photo for a screen reader; decorative uses pass
 * `alt=""` at the call site.
 */

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const BHM_UPLOADS = "https://brianhallam.com/wp-content/uploads/2026/03";

export const MEDIA = {
  /** Apostle Brian Hallam at the pulpit, band behind him — the home hero. */
  pulpit: {
    src: `${BHM_UPLOADS}/DSC02944.jpg`,
    alt: "Apostle Brian Hallam preaching from the pulpit at New Heights Church",
    width: 2304,
    height: 1536,
  },
  /** Apostle Hallam in worship at the altar, flags and light behind him. */
  altar: {
    src: `${BHM_UPLOADS}/Apostle-Hallam-Altar-Worship-683x1024.webp`,
    alt: "Apostle Brian Hallam worshiping at the altar during a New Heights service",
    width: 683,
    height: 1024,
  },
  /** Apostle Brian and Pastor Crystal Hallam, together. */
  pastors: {
    src: `${BHM_UPLOADS}/Apostle-Brian-and-Pastor-Crystal-Hallam.webp`,
    alt: "Apostle Brian Hallam and Pastor Crystal Hallam",
    width: 2304,
    height: 1536,
  },
  /** The Hallam family. */
  family: {
    src: `${BHM_UPLOADS}/Hallam-Family.webp`,
    alt: "The Hallam family",
    width: 2085,
    height: 1266,
  },
  /** Architectural rendering of the New Heights campus — the mark on the tower. */
  campus: {
    src: "https://newheightschurch.info/wp-content/uploads/2020/10/IMG_9142-scaled.jpg",
    alt: "Rendering of the New Heights Church campus in College Station, Texas",
    width: 2560,
    height: 1920,
  },
} as const satisfies Record<string, Photo>;
