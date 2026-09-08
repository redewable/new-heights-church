/**
 * New Heights Church — canonical facts.
 * Single source of truth for name, address, contact, service times, URLs,
 * pillar definitions, convictions, and calls. Imported into footer, schema,
 * metadata, forms. Never retype these elsewhere.
 */

export const CHURCH = {
  name: "New Heights Church",
  shortName: "New Heights",
  mission: "We exist to love people and point them to Christ.",
  tagline: "We are family. Welcome home.",

  /**
   * The prayer of salvation, word for word as the house prays it. Shown
   * behind "How do I pray?" on the home salvation call and the decision page.
   */
  salvationPrayer:
    "Oh God, I come to You now and I ask You to save me. Write my name in Your book. I believe Jesus died and rose from the dead for my victory. I'm a Christian now, on my way to Heaven! In Jesus' name, Amen!",

  /** Planted in College Station in 2012 by the Hallams. */
  founded: 2012,

  /**
   * Honor the office. Always the full title in copy — "Apostle Brian
   * Hallam", "Pastor Crystal Hallam" — never a first name alone.
   */
  leadership: {
    seniorPastor: "Apostle Brian Hallam",
    firstLady: "Pastor Crystal Hallam",
  },

  address: {
    street: "8125 Turkey Creek Rd.",
    city: "College Station",
    region: "TX",
    postal: "77845",
    country: "US",
    full: "8125 Turkey Creek Rd., College Station, TX 77845",
    /** Rough coords for the Brazos Valley / College Station area. Refine before launch. */
    geo: { lat: 30.5863, lng: -96.2849 },
  },

  contact: {
    phone: "979-314-7585",
    phoneHref: "tel:+19793147585",
    email: "admin@newheightschurch.info",
    emailHref: "mailto:admin@newheightschurch.info",
  },

  services: [
    {
      name: "Sunday Service",
      dayOfWeek: "Sunday",
      time: "10:00 AM",
      zone: "CT",
      description: "Weekend gathering — worship, the Word, and the altar.",
    },
    {
      name: "Midweek Service",
      dayOfWeek: "Wednesday",
      time: "7:00 PM",
      zone: "CT",
      description: "Midweek refill — prayer, the prophetic, and the presence of God.",
    },
  ] as const,

  urls: {
    site: "https://newheightschurch.info",
    /**
     * Alias for Pushpay (the current online-giving processor). Kept here
     * so legacy imports still route to the right place. New code should
     * import from `lib/constants/giving.ts` (`GIVING.pushpay.url` or
     * `pushpayHref(campaign)` for UTM-tagged links).
     */
    giving: "https://pushpay.com/g/newheightschurch",
    churchCenter: "https://experiencenewheights.churchcenter.com",
    youtube: "https://www.youtube.com/@NewHeightsBCS",
    youtubeHandle: "@NewHeightsBCS",
    /** Resolved from the channel's RSS feed (legacy username NewHeightsBCS). */
    youtubeChannelId: "UCKRwjr7sT9avbEUDsY2BLiA",
    /** Brian Hallam Ministries — see `lib/constants/bhm.ts` for the full brand. */
    youtubeBhm: "https://www.youtube.com/@brianhallamministries",
    brianHallam: "https://brianhallam.com",
    facebook: "https://www.facebook.com/experiencenewheights",
    instagram: "https://www.instagram.com/experiencenewheights/",
  },

  /**
   * The three pillars — what the house is about in this season, in the
   * Church's own words: laboring for the endtime harvest of souls;
   * preparing the Bride of Christ for the return of the Lord; being a
   * habitation of God — the remnant, carriers of revival. Colors are
   * scripture-mapped (scarlet / purple / blue) and the three bars of the
   * logo are these three, in this order.
   *
   * Keep ordering: Harvest → Bride → Habitation. Do NOT reorder;
   * it's a discipleship progression, not a taste preference.
   */
  pillars: [
    {
      key: "harvest",
      label: "Endtime Harvest",
      full: "Laboring for the Endtime Harvest of Souls",
      short: "The endtime harvest of souls",
      verse: "John 4:35",
      blurb:
        "The fields are white. Lost people are the agenda — a clear path from first hunger to full surrender, and a house that goes after souls on purpose.",
      href: "/grow/harvest",
      color: "scarlet",
    },
    {
      key: "bride",
      label: "Preparation",
      full: "Preparing the Bride of Christ for the Return of the Lord",
      short: "Preparing the Bride for the return of the Lord",
      verse: "Ephesians 5:27",
      blurb:
        "A glorious church without spot or wrinkle. Discipleship that moves a guest from saved → baptized → filled → planted → serving → sent, ready for the Groom.",
      href: "/grow/bride",
      color: "purple",
    },
    {
      key: "habitation",
      label: "Habitation",
      full: "A Habitation of God — the Remnant, Carriers of Revival",
      short: "Being a habitation — the remnant, carriers of revival",
      verse: "Psalm 132:13–14 · 1 Thessalonians 4:17",
      blurb:
        "Not a visitation. A habitation. We that are alive and remain — the remnant — carrying and releasing supernatural power in the here and now: an altar culture where God is welcome to stay, and a people who take that fire out the doors.",
      href: "/grow/habitation",
      color: "blue",
    },
  ] as const,

  /**
   * Convictions we say out loud. Rendered as the "We believe" band on the
   * home page and in the Beliefs page. Keep the verse load-bearing.
   */
  convictions: [
    {
      key: "signs",
      statement: "We believe in miracles, signs, and wonders.",
      verse: "2 Corinthians 12:12",
      note: "The marks of an apostle were wrought among you — in signs, and wonders, and mighty deeds.",
    },
    {
      key: "same",
      statement: "God is the same — yesterday, today, and forever.",
      verse: "Hebrews 13:8",
      note: "What He did in Acts He does in College Station. He has not changed.",
    },
    {
      key: "wealth",
      statement: "We believe in the transfer of wealth.",
      verse: "Proverbs 13:22",
      note: "The wealth of the sinner is laid up for the just. God is not a God of lack.",
    },
    {
      key: "whole-bible",
      statement: "We take the whole Bible.",
      verse: "2 Timothy 3:16",
      note: "All Scripture is given by inspiration of God. You cannot have one part of the Word without the other — we don't edit it.",
    },
    {
      key: "scripture",
      statement: "We interpret the Bible with the Bible.",
      verse: "2 Peter 1:20–21 · Isaiah 28:10",
      note: "Line upon line, precept upon precept. Scripture explains Scripture — not culture, not opinion.",
    },
    {
      key: "fivefold",
      statement: "We believe in the restoration of the fivefold ministry.",
      verse: "Ephesians 4:11–13",
      note: "Apostles, prophets, evangelists, pastors, and teachers — given by Christ to equip the saints until we all come to the unity of the faith.",
    },
    {
      key: "tongues",
      statement: "We pray in tongues — all day, every day.",
      verse: "1 Corinthians 14:18 · Jude 1:20",
      note: "Building ourselves up on our most holy faith, praying in the Holy Ghost. Not a Sunday thing — a lifestyle.",
    },
    {
      key: "remnant",
      statement: "We are the remnant — we that are alive and remain.",
      verse: "1 Thessalonians 4:17",
      note: "A habitation, not a visitation. A people prepared, awake, and waiting for the return of the Lord.",
    },
  ] as const,

  /**
   * The three calls — imperatives the house says to everyone, every week.
   * Rendered as the closing strip of the "We believe" band.
   */
  calls: [
    { key: "come", line: "Come to church.", verse: "Hebrews 10:25" },
    { key: "bible", line: "Bring your Bible.", verse: "2 Timothy 2:15" },
    { key: "stir", line: "Stir it up!", verse: "2 Timothy 1:6" },
  ] as const,
} as const;

export type PillarKey = (typeof CHURCH.pillars)[number]["key"];

/** Bullet separator the Church uses for the pillar strip. */
export const PILLAR_SEPARATOR = " • ";

/** "Endtime Harvest • Preparation • Habitation" — the strip under the mark. */
export const PILLAR_STRIP = CHURCH.pillars.map((p) => p.label).join(PILLAR_SEPARATOR);
