import { BHM } from "./bhm";
import { CHURCH } from "./church";
import { MEDIA, type Photo } from "./media";

/**
 * The two NHC podcasts. The Brian Hallam Podcast's Apple, Spotify, and RSS
 * URLs are confirmed (see `BHM.podcast`); New Heights Sermons is YouTube
 * only until its feed lands (docs/OPEN_QUESTIONS.md #19).
 *
 * "Latest episode" on the page is each show's newest YouTube upload, read
 * from the channel feed — no API key, nothing for staff to update.
 */

export type FollowPlatform = "facebook" | "instagram";

export interface PodcastShow {
  slug: "new-heights-sermons" | "brian-hallam-podcast";
  title: string;
  hostedBy: string;
  tagline: string;
  blurb: string;
  /** Apple Podcasts show URL (or null if TBD). */
  appleUrl: string | null;
  /** Apple show id (`https://podcasts.apple.com/.../id{N}`). */
  appleShowId: string | null;
  /** Spotify show URL. */
  spotifyUrl: string | null;
  /** Canonical RSS feed. */
  rssUrl: string | null;
  /** YouTube channel backing the video side, if any. */
  youtubeUrl: string | null;
  /** Channel whose newest upload is the "latest episode" on the page. */
  youtubeChannelId: string | null;
  /** Show art. Holds the player slot if the channel feed can't be reached. */
  cover: Photo | null;
  /** The host's own accounts, shown under the platforms. */
  follow: ReadonlyArray<{ platform: FollowPlatform; label: string; href: string }>;
  /** Who the follow row is for — "Apostle Brian Hallam". */
  followLabel: string | null;
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
    youtubeChannelId: CHURCH.urls.youtubeChannelId,
    cover: MEDIA.pulpit,
    follow: [],
    followLabel: null,
  },
  {
    slug: "brian-hallam-podcast",
    title: BHM.podcast.title,
    hostedBy: CHURCH.leadership.seniorPastor,
    tagline: "Apostolic, prophetic, unapologetic — conversations on what God is doing.",
    blurb:
      "Apostle Brian Hallam's parallel podcast — longer-form conversations, teaching drops, and prophetic dialogue beyond Sunday morning. Part of Brian Hallam Ministries.",
    appleUrl: BHM.podcast.apple,
    appleShowId: BHM.podcast.appleShowId,
    spotifyUrl: BHM.podcast.spotify,
    rssUrl: BHM.podcast.rss,
    youtubeUrl: BHM.youtube,
    youtubeChannelId: BHM.youtubeChannelId,
    cover: MEDIA.podcast,
    follow: [
      { platform: "facebook", label: "Facebook", href: BHM.facebook },
      { platform: "instagram", label: "Instagram", href: BHM.instagram },
    ],
    followLabel: CHURCH.leadership.seniorPastor,
  },
];

export const RESOURCES_PAGE_KEYS = ["books", "media", "partners"] as const;
