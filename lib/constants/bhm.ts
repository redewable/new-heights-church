/**
 * Brian Hallam Ministries — the parallel brand around Apostle Brian Hallam's
 * itinerant preaching, teaching, podcast, and books. Canonical URLs and the
 * current book release live here; import from this file, never retype.
 */

export const BHM = {
  name: "Brian Hallam Ministries",
  shortName: "BHM",
  url: "https://brianhallam.com",
  youtube: "https://www.youtube.com/@brianhallamministries",
  youtubeHandle: "@brianhallamministries",
  /** Resolved from the channel page for @brianhallamministries. */
  youtubeChannelId: "UCIRtxjBNU3e8yRYVYpoyLOA",
  facebook: "https://www.facebook.com/pastorbrianhallam/",
  instagram: "https://www.instagram.com/brian_hallam/",
  podcast: {
    title: "The Brian Hallam Podcast",
    apple: "https://podcasts.apple.com/us/podcast/the-brian-hallam-podcast/id1604967894",
    appleShowId: "1604967894",
    spotify: "https://open.spotify.com/show/7cYqeHSZDg5Dg0orFyHc5a",
    /** Buzzsprout feed, as listed on Apple Podcasts. */
    rss: "https://rss.buzzsprout.com/1919457.rss",
  },
  tagline: "Apostolic. Prophetic. Unapologetic.",
  blurb:
    "Apostle Brian's preaching itinerary, teaching, the podcast, and his books — everything that orbits the pulpit beyond Sunday morning.",
} as const;

export const BOOK = {
  title: "God Is Prosperity, So I Prosper",
  titleLead: "God Is Prosperity,",
  titleTail: "So I Prosper",
  author: "Apostle Brian Hallam",
  kicker: "A book that will change your view on God's will for your life.",
  /** Official description, paragraph by paragraph. */
  description: [
    "In God Is Prosperity, So I Prosper, Apostle Hallam brings clarity to what the Bible truly teaches about prosperity. In a world where many ideas about money and success are shaped by culture rather than Scripture, this book returns us to the foundation of God's Word.",
    "Through powerful, biblical insight, Apostle Hallam shows that prosperity begins with understanding the nature of God Himself. God is not a God of lack, shortage, or limitation — He is the source of life, blessing, and abundance. When believers are connected to Him and aligned with His Word, they are connected to the source of true prosperity.",
    "This book will challenge wrong thinking, strengthen your faith, and help you see prosperity from the right perspective: the Bible. As you grow in the truth of God's Word, you will discover how to walk confidently in the life of blessing God has prepared for His people.",
  ],
  /** One-sentence version for cards and meta descriptions. */
  summary:
    "What the Bible truly teaches about prosperity — starting with the nature of God Himself, the source of life, blessing, and abundance.",
  cover: {
    src: "https://brianhallam.com/wp-content/uploads/2026/03/Front.webp",
    alt: "Cover of God Is Prosperity, So I Prosper by Brian Hallam — gold title on a deep green ground, with Apostle Brian Hallam in a navy suit and green tie.",
    width: 1300,
    height: 1950,
  },
  buy: {
    /** Direct from the ministry (Square). Preferred — more of the gift lands with BHM. */
    direct: "https://square.link/u/mQoYv49Q",
    /** Kindle / Amazon listing (ASIN B0GSC6QZCC). */
    amazon: "https://www.amazon.com/dp/B0GSC6QZCC",
  },
  asin: "B0GSC6QZCC",
} as const;
