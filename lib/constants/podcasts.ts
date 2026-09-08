import { CHURCH } from "./church";

/**
 * The two NHC podcasts. URLs + show IDs confirmed where we have them;
 * Apple show IDs + RSS feed URLs are PENDING (docs/OPEN_QUESTIONS.md #19).
 * The page renders with the outbound links we have now and gracefully
 * swaps in feed-parsed episodes once the IDs land.
 */

export interface PodcastShow {
  slug: "new-heights-sermons" | "brian-hallam-podcast";
  title: string;
  hostedBy: string;
  tagline: string;
  blurb: string;
  /** Apple Podcasts show URL (or null if TBD). */
  appleUrl: string | null;
  /** Apple show id for embed (`https://embed.podcasts.apple.com/us/podcast/id{N}`). */
  appleShowId: string | null;
  /** Spotify show URL. */
  spotifyUrl: string | null;
  /** Canonical RSS feed. Parsed for latest episodes once wired. */
  rssUrl: string | null;
  /** YouTube channel backing the audio side, if any. */
  youtubeUrl: string | null;
}

export const PODCASTS: readonly PodcastShow[] = [
  {
    slug: "new-heights-sermons",
    title: "New Heights Sermons",
    hostedBy: `${CHURCH.leadership.seniorPastor} + NHC pulpit`,
    tagline: "Every Sunday word — carried with you.",
    blurb:
      "The weekly sermon from New Heights Church. Every word preached from the pulpit, released as audio so the teaching travels past the room.",
    appleUrl: null,
    appleShowId: null,
    spotifyUrl: null,
    rssUrl: null,
    youtubeUrl: CHURCH.urls.youtube,
  },
  {
    slug: "brian-hallam-podcast",
    title: "The Brian Hallam Podcast",
    hostedBy: CHURCH.leadership.seniorPastor,
    tagline: "Apostolic, prophetic, unapologetic — conversations on what God is doing.",
    blurb:
      "Apostle Brian Hallam's parallel podcast — longer-form conversations, teaching drops, and prophetic dialogue beyond Sunday morning. Part of Brian Hallam Ministries.",
    appleUrl: null,
    appleShowId: null,
    spotifyUrl: null,
    rssUrl: null,
    youtubeUrl: CHURCH.urls.youtubeBhm,
  },
];

export const RESOURCES_PAGE_KEYS = ["books", "media", "partners"] as const;
