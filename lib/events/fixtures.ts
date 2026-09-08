import type { EventRow } from "@/lib/supabase/types";

/**
 * Dev fixtures — mirror the events table after migrations 0004 → 0008.
 * When Supabase isn't configured, these six events power /events, /grow,
 * and the home "also on the calendar" rail. Staff edits in admin update the
 * DB; keep this file in sync with the latest migration so local dev and
 * production tell the same story.
 *
 * Times are stored in UTC; the Church is on Central time (CDT = UTC−5 in
 * season). The comments carry the local time so nobody has to convert.
 */
const AUDIT = "2026-09-07T00:00:00Z";

export const EVENT_FIXTURES: EventRow[] = [
  {
    id: "e-activated",
    slug: "activated-2026",
    title: "Activated",
    subtitle:
      "New Heights Conference 2026 · Four days in the Presence with Apostle Brian Hallam, Pastor Paula White, Prophet Dr. Lashund Lambert, and Prophet Richard Summerlin.",
    description:
      "Activated is the New Heights Conference 2026 — for the house and the whole region — a Thursday-through-Sunday gathering built around worship, the word, and an open altar. Apostle Brian Hallam hosts, joined by Pastor Paula White, Prophet Dr. Lashund Lambert, and Prophet Richard Summerlin. Come to be activated: in your gifting, in your calling, in the harvest. Registration is required but free.",
    start_at: "2026-09-25T00:00:00Z", // Thu Sep 24 · 7:00 PM CDT
    end_at: "2026-09-27T17:00:00Z", // Sun Sep 27 · 12:00 PM CDT
    time_note: "Thursday evening through Sunday morning",
    location: "New Heights Church · Main Room",
    ministry: "conferences",
    pillar: "habitation",
    registration_url:
      "https://brushfire.com/newheightschurch/newheightsconference2026/627904",
    registration_platform: "brushfire",
    registration_status: "open",
    cost_label: "Free (registration required)",
    poster_url:
      "https://newheightschurch.info/wp-content/uploads/2026/07/Conference-2026-7-scaled.png",
    speakers: [
      "Pastor Paula White",
      "Prophet Dr. Lashund Lambert",
      "Prophet Richard Summerlin",
    ],
    featured: true,
    published: true,
    published_at: "2026-04-21T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: AUDIT,
  },
  {
    id: "e-n2n",
    slug: "new-to-new-heights",
    title: "New to New Heights",
    subtitle: "The first room on the road to Foundations of Faith + serving.",
    description:
      "The introduction class for every new guest. A short, welcoming walk through who we are, what we preach, and the discipleship path — New to New Heights → Foundations of Faith → First-Touch Team. Required before serving.",
    start_at: "2026-05-17T13:30:00Z", // Sun May 17 · 8:30 AM CDT
    end_at: "2026-05-17T14:45:00Z", // 9:45 AM CDT
    time_note: "Sunday · 8:30–9:45 AM",
    location: "New Heights Church · The Upper Room (2nd Floor)",
    ministry: "discipleship",
    pillar: "bride",
    registration_url:
      "https://experiencenewheights.churchcenter.com/registrations/events/3584132",
    registration_platform: "planning_center",
    registration_status: "open",
    cost_label: "Free",
    poster_url: null,
    speakers: null,
    featured: true,
    published: true,
    published_at: "2026-04-21T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: AUDIT,
  },
  {
    id: "e-foundations",
    slug: "foundations-of-faith",
    title: "Foundations of Faith",
    subtitle: "Four Sundays. The whole counsel of God, plainly taught.",
    description:
      "Welcome to the family of Christ. As a born-again believer you're a Christian — Christ-One — redeemed by His sacrifice. This four-week class teaches who Jesus is and what you are, your purpose, what a Christian does, and when and where. The Bible is our guide to knowing who we are and how to live the calling on our life. Come and discover your new family.",
    start_at: "2026-04-26T13:30:00Z", // Sun Apr 26 · 8:30 AM CDT (cohort start)
    end_at: "2026-05-10T14:30:00Z", // Sun May 10 · 9:30 AM CDT (cohort end)
    time_note: "Sunday mornings · 8:30–9:30 AM · 4-week cohort",
    location: "New Heights Church · The Upper Room (2nd Floor)",
    ministry: "discipleship",
    pillar: "bride",
    registration_url:
      "https://experiencenewheights.churchcenter.com/registrations/events/3558344",
    registration_platform: "planning_center",
    registration_status: "open",
    cost_label: "Free",
    poster_url: null,
    speakers: null,
    featured: true,
    published: true,
    published_at: "2026-04-21T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: AUDIT,
  },
  {
    id: "e-baby-dedications",
    slug: "baby-dedications-may-10",
    title: "Baby Dedications",
    subtitle: "Consecrating the next generation at the altar.",
    description:
      "Parents bring their children before the house; pastors lay hands, declare a word, and the family stands together in covenant. The whole Church witnesses and prays.",
    start_at: "2026-05-10T15:00:00Z", // Sun May 10 · 10:00 AM CDT
    end_at: "2026-05-10T17:00:00Z",
    time_note: "Sunday service",
    location: "New Heights Church · Main Room",
    ministry: "church_wide",
    pillar: "habitation",
    registration_url: "/connect/baby-dedication",
    registration_platform: "internal",
    registration_status: "open",
    cost_label: "Free",
    poster_url: null,
    speakers: null,
    featured: true,
    published: true,
    published_at: "2026-04-21T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: AUDIT,
  },
  {
    id: "e-youth-camp",
    slug: "youth-camp-encounter",
    title: "Youth Camp Encounter",
    subtitle:
      "A weekend away with the Youth Army. Entering 6th grade through High School Senior.",
    description:
      "Our annual youth camp — worship, word, altar, and the friendships that build a generation. Led by the Youth Army pastoral team at Carolina Creek in Huntsville, TX. Cost is $350 per camper (with a $100 non-refundable deposit); adult leaders require a background check and state-approved child protection training. Applications for 2026 closed March 31.",
    start_at: "2026-06-19T14:00:00Z", // Fri Jun 19 · 9:00 AM CDT
    end_at: "2026-06-21T22:00:00Z", // Sun Jun 21 · 5:00 PM CDT
    time_note: "Friday morning – Sunday afternoon",
    location: "Carolina Creek Camps & Retreat Center, Huntsville, TX",
    ministry: "youth",
    pillar: null,
    registration_url:
      "https://experiencenewheights.churchcenter.com/registrations/events/3478925",
    registration_platform: "planning_center",
    registration_status: "closed",
    cost_label: "$350 per camper",
    poster_url: null,
    speakers: null,
    featured: true,
    published: true,
    published_at: "2026-04-21T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: AUDIT,
  },
  {
    id: "e-youth-raffle",
    slug: "youth-camp-raffle-may-10",
    title: "Youth Camp Raffle Drawing",
    subtitle: "One camper goes free.",
    description:
      "The annual raffle drawing for a full Youth Camp scholarship. Winner announced live at Sunday service; enter through the raffle page before the drawing.",
    start_at: "2026-05-10T15:00:00Z", // Sun May 10 · 10:00 AM CDT
    end_at: "2026-05-10T17:00:00Z",
    time_note: "Sunday service",
    location: "New Heights Church · Main Room",
    ministry: "youth",
    pillar: null,
    registration_url: "https://newheightschurch.info/new-heights-youth-raffle/",
    registration_platform: "external",
    registration_status: "open",
    cost_label: null,
    poster_url: null,
    speakers: null,
    featured: false,
    published: true,
    published_at: "2026-04-21T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: AUDIT,
  },
];
