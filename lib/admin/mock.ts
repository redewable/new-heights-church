/**
 * Mock data for the /admin PREVIEW. Nothing here is real and nothing here
 * writes anywhere. Every screen in the preview reads from this file (plus
 * the same fixtures the public site uses) so staff can see the shape of the
 * tools before Supabase, Planning Center, Resend, and YouTube are wired.
 *
 * When a feature is built for real, its page stops importing from here.
 */

import { CHURCH } from "@/lib/constants/church";

export type SubmissionType =
  | "connect_card"
  | "prayer"
  | "decision"
  | "baptism"
  | "baby_dedication"
  | "volunteer"
  | "pledge"
  | "statement";

export const SUBMISSION_TYPES: ReadonlyArray<{ key: SubmissionType; label: string }> = [
  { key: "connect_card", label: "Connect cards" },
  { key: "prayer", label: "Prayer requests" },
  { key: "decision", label: "Decisions" },
  { key: "baptism", label: "Baptism" },
  { key: "baby_dedication", label: "Baby dedications" },
  { key: "volunteer", label: "Volunteer" },
  { key: "pledge", label: "Pledges" },
  { key: "statement", label: "Statement requests" },
];

export type SubmissionStatus = "new" | "contacted" | "done";

export interface MockSubmission {
  id: string;
  type: SubmissionType;
  who: string;
  summary: string;
  channel: "in_person" | "online";
  receivedAt: string;
  status: SubmissionStatus;
  synced: "pending" | "done" | "failed" | "n/a";
}

/** Sample rows — placeholder people, obviously so. */
export const MOCK_SUBMISSIONS: MockSubmission[] = [
  {
    id: "s-01",
    type: "decision",
    who: "Sample guest A.",
    summary: "I said yes to Jesus for the first time",
    channel: "in_person",
    receivedAt: "2026-09-06T11:42:00-05:00",
    status: "new",
    synced: "pending",
  },
  {
    id: "s-02",
    type: "connect_card",
    who: "Sample family B.",
    summary: "First time · heard from a friend · wants a call",
    channel: "online",
    receivedAt: "2026-09-06T12:10:00-05:00",
    status: "new",
    synced: "done",
  },
  {
    id: "s-03",
    type: "prayer",
    who: "Anonymous",
    summary: "Urgent · shared anonymously",
    channel: "online",
    receivedAt: "2026-09-05T22:03:00-05:00",
    status: "contacted",
    synced: "n/a",
  },
  {
    id: "s-04",
    type: "baptism",
    who: "Sample guest C.",
    summary: "Wants the next Sunday · testimony attached",
    channel: "online",
    receivedAt: "2026-09-04T09:15:00-05:00",
    status: "contacted",
    synced: "done",
  },
  {
    id: "s-05",
    type: "volunteer",
    who: "Sample member D.",
    summary: "First Touch · Young Lions · Sundays",
    channel: "online",
    receivedAt: "2026-09-03T18:30:00-05:00",
    status: "done",
    synced: "done",
  },
  {
    id: "s-06",
    type: "pledge",
    who: "Sample member E.",
    summary: "Rise Up and Build · monthly · intent only",
    channel: "online",
    receivedAt: "2026-09-02T20:45:00-05:00",
    status: "done",
    synced: "failed",
  },
  {
    id: "s-07",
    type: "baby_dedication",
    who: "Sample family F.",
    summary: "Two children · preferred October",
    channel: "online",
    receivedAt: "2026-09-01T14:20:00-05:00",
    status: "new",
    synced: "pending",
  },
  {
    id: "s-08",
    type: "statement",
    who: "Sample member G.",
    summary: "Year-end giving statement · 2025",
    channel: "online",
    receivedAt: "2026-08-30T08:05:00-05:00",
    status: "done",
    synced: "n/a",
  },
];

/** Dashboard figures — illustrative only. */
export const MOCK_METRICS = {
  window: "This week",
  decisions: 3,
  connectCards: 12,
  prayerRequests: 7,
  sermonPlays: 418,
  firstTimeGuests: 9,
  pendingSync: 2,
} as const;

export interface MockTestimony {
  id: string;
  source: string;
  submittedAt: string;
  status: "pending" | "approved" | "retired";
  consent: boolean;
}

/**
 * The queue holds submissions, not stories: no testimony text is invented
 * here. Text appears only when a real person submits it with consent.
 */
export const MOCK_TESTIMONIES: MockTestimony[] = [
  {
    id: "t-01",
    source: "Connect Card · Sept 6",
    submittedAt: "2026-09-06",
    status: "pending",
    consent: true,
  },
  {
    id: "t-02",
    source: "Decision follow-up · Aug 30",
    submittedAt: "2026-08-31",
    status: "pending",
    consent: false,
  },
  {
    id: "t-03",
    source: "Staff entry · Fire of God weekend",
    submittedAt: "2026-08-18",
    status: "approved",
    consent: true,
  },
];

export const MOCK_CAMPAIGN = {
  name: "Rise Up and Build",
  goal: 2_500_000,
  pledged: 0,
  given: 0,
  updatedAt: null as string | null,
  updatedBy: "Finance lead (to be confirmed)",
};

export interface MockUser {
  email: string;
  name: string;
  role: "Lead Admin" | "Content" | "Pastoral Care" | "Finance";
  status: "active" | "invited" | "to confirm";
}

export const MOCK_USERS: MockUser[] = [
  {
    email: CHURCH.contact.email,
    name: "Church office",
    role: "Lead Admin",
    status: "active",
  },
  {
    email: "media@newheightschurch.info",
    name: "Media / content",
    role: "Content",
    status: "to confirm",
  },
  {
    email: "prayer@newheightschurch.info",
    name: "Prayer team lead",
    role: "Pastoral Care",
    status: "to confirm",
  },
  {
    email: "finance@newheightschurch.info",
    name: "Finance lead",
    role: "Finance",
    status: "to confirm",
  },
];

export interface IntegrationStatus {
  key: string;
  name: string;
  purpose: string;
  envVars: string[];
  configured: boolean;
  docsRef: string;
}

/** Reads env presence at request time — real, not mocked. */
export function integrationStatuses(): IntegrationStatus[] {
  const has = (...names: string[]) => names.every((n) => Boolean(process.env[n]));
  return [
    {
      key: "supabase",
      name: "Supabase",
      purpose:
        "Database, auth, storage, row-level security. Every form writes here first.",
      envVars: [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
      ],
      configured: has("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      docsRef: "§7",
    },
    {
      key: "planning-center",
      name: "Planning Center",
      purpose: "People sync, Groups finder, Calendar events, Registrations.",
      envVars: ["PLANNING_CENTER_CLIENT_ID", "PLANNING_CENTER_CLIENT_SECRET"],
      configured: has("PLANNING_CENTER_CLIENT_ID", "PLANNING_CENTER_CLIENT_SECRET"),
      docsRef: "§8.1",
    },
    {
      key: "youtube",
      name: "YouTube Data API",
      purpose: "Livestream detection every 60s; sermon import from a video URL.",
      envVars: ["YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID"],
      configured: has("YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID"),
      docsRef: "§8.2",
    },
    {
      key: "resend",
      name: "Resend",
      purpose:
        "Transactional email: confirmations, decision follow-up drip, staff digest.",
      envVars: ["RESEND_API_KEY", "PRAYER_TEAM_INBOX"],
      configured: has("RESEND_API_KEY"),
      docsRef: "§8.5",
    },
    {
      key: "mailchimp",
      name: "Mailchimp",
      purpose: "Newsletter double opt-in, mirrored to Supabase.",
      envVars: ["MAILCHIMP_API_KEY", "MAILCHIMP_AUDIENCE_ID", "MAILCHIMP_SERVER_PREFIX"],
      configured: has("MAILCHIMP_API_KEY", "MAILCHIMP_AUDIENCE_ID"),
      docsRef: "§8.4",
    },
    {
      key: "turnstile",
      name: "Cloudflare Turnstile",
      purpose: "Bot protection on every form.",
      envVars: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"],
      configured: has("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"),
      docsRef: "§9",
    },
    {
      key: "upstash",
      name: "Upstash Redis",
      purpose: "Rate limiting: 10 submissions per 10 minutes per IP.",
      envVars: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
      configured: has("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"),
      docsRef: "§9",
    },
    {
      key: "sentry",
      name: "Sentry",
      purpose: "Error monitoring with PII scrubbing.",
      envVars: ["NEXT_PUBLIC_SENTRY_DSN"],
      configured: has("NEXT_PUBLIC_SENTRY_DSN"),
      docsRef: "§13",
    },
    {
      key: "analytics",
      name: "GA4 + Meta Pixel",
      purpose: "Consent-gated analytics and KPIs.",
      envVars: ["NEXT_PUBLIC_GA4_MEASUREMENT_ID", "NEXT_PUBLIC_META_PIXEL_ID"],
      configured: has("NEXT_PUBLIC_GA4_MEASUREMENT_ID"),
      docsRef: "§8.7",
    },
  ];
}

export interface EmailTemplate {
  key: string;
  name: string;
  trigger: string;
  from: string;
  status: "built" | "planned";
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: "connect",
    name: "Connect Card confirmation",
    trigger: "Connect Card submitted",
    from: "welcome@",
    status: "built",
  },
  {
    key: "prayer-ack",
    name: "Prayer request acknowledgement",
    trigger: "Prayer request with an email",
    from: "prayer@",
    status: "built",
  },
  {
    key: "prayer-team",
    name: "Prayer team notification",
    trigger: "Any prayer request",
    from: "prayer@",
    status: "built",
  },
  {
    key: "decision",
    name: "Next Steps letter from the Pastors",
    trigger: "Decision captured",
    from: "pastors@",
    status: "built",
  },
  {
    key: "pledge",
    name: "Pledge receipt (intent only)",
    trigger: "Pledge submitted",
    from: "welcome@",
    status: "planned",
  },
  {
    key: "statement",
    name: "Statement request acknowledgement",
    trigger: "Year-end statement requested",
    from: "welcome@",
    status: "planned",
  },
  {
    key: "digest",
    name: "Staff daily digest · 7:00 AM CT",
    trigger: "Scheduled",
    from: "welcome@",
    status: "planned",
  },
];

export const DECISION_DRIP = [
  { at: "Immediately", what: "Next Steps letter signed by the Pastors" },
  { at: "48 hours", what: "Foundations of Faith — what it is, when it meets" },
  { at: "1 week", what: "Water baptism — tell us you want in" },
  { at: "2 weeks", what: "Life Groups — an invitation and the finder" },
] as const;

export type RoadmapStatus = "built" | "preview" | "planned" | "optional";

export interface RoadmapItem {
  area: string;
  name: string;
  status: RoadmapStatus;
  phase: string;
  note: string;
  href?: string;
}

export const ROADMAP: RoadmapItem[] = [
  // Public site
  {
    area: "Public site",
    name: "Home, I'm New, About, Leadership, Beliefs, Visit",
    status: "built",
    phase: "1 · 5",
    note: "Live on main with the Church's photography and copy.",
  },
  {
    area: "Public site",
    name: "Sermons library + Watch",
    status: "built",
    phase: "2",
    note: "Runs on the six most recent real services until the YouTube ingest is wired.",
  },
  {
    area: "Public site",
    name: "Connect, Prayer, Decision, Baptism, Baby Dedication, Volunteer, Pledge, Statement forms",
    status: "built",
    phase: "3 · 4",
    note: "Validated, Turnstile-ready, rate-limit-ready. Writes to Supabase once credentials land.",
  },
  {
    area: "Public site",
    name: "Events + Activated conference",
    status: "built",
    phase: "4",
    note: "Registration status and speakers on every event; Brushfire / Church Center deep links.",
  },
  {
    area: "Public site",
    name: "Give, Rise Up and Build, Kids, Youth, Podcasts, Resources, Legal",
    status: "built",
    phase: "4 · 5 · 6",
    note: "Pushpay deep links; podcasts wait on feed IDs.",
  },
  // Admin
  {
    area: "Admin",
    name: "Sign-in with staff allow-list",
    status: "planned",
    phase: "2",
    note: "Supabase Auth magic link; ADMIN_EMAILS gate; roles below.",
    href: "/admin/users",
  },
  {
    area: "Admin",
    name: "Dashboard metrics",
    status: "preview",
    phase: "3",
    note: "Decisions, connect cards, prayer, sermon plays.",
    href: "/admin",
  },
  {
    area: "Admin",
    name: "Sermons manager + Import from YouTube",
    status: "preview",
    phase: "2",
    note: "Paste a URL, stage a draft, publish.",
    href: "/admin/sermons",
  },
  {
    area: "Admin",
    name: "Events with Planning Center sync",
    status: "preview",
    phase: "4",
    note: "PC Calendar is the source; featured flag and status are editable here.",
    href: "/admin/events",
  },
  {
    area: "Admin",
    name: "Announcements",
    status: "preview",
    phase: "3",
    note: "Date-windowed top strip.",
    href: "/admin/announcements",
  },
  {
    area: "Admin",
    name: "Testimonies queue",
    status: "preview",
    phase: "3",
    note: "Approve, edit, retire. Consent required before anything publishes.",
    href: "/admin/testimonies",
  },
  {
    area: "Admin",
    name: "Submissions inbox + CSV export",
    status: "preview",
    phase: "3",
    note: "Every form, one inbox, sync status per row.",
    href: "/admin/submissions",
  },
  {
    area: "Admin",
    name: "Campaign progress",
    status: "preview",
    phase: "4",
    note: "Rise Up and Build goal, pledged, given.",
    href: "/admin/campaign",
  },
  {
    area: "Admin",
    name: "Media library",
    status: "preview",
    phase: "6",
    note: "Supabase Storage browser; ends the hot-linking of brianhallam.com.",
    href: "/admin/media",
  },
  {
    area: "Admin",
    name: "Redirects editor",
    status: "preview",
    phase: "6",
    note: "The 301 map from the old WordPress URLs.",
    href: "/admin/redirects",
  },
  {
    area: "Admin",
    name: "Users and roles",
    status: "preview",
    phase: "2",
    note: "Lead Admin, Content, Pastoral Care, Finance.",
    href: "/admin/users",
  },
  // Integrations
  {
    area: "Integrations",
    name: "Planning Center client",
    status: "planned",
    phase: "4",
    note: "People upsert, Groups finder, Calendar, Registrations.",
    href: "/admin/integrations",
  },
  {
    area: "Integrations",
    name: "YouTube livestream detection + ingest",
    status: "planned",
    phase: "2",
    note: "Needs an API key; the channel ID is recorded.",
    href: "/admin/integrations",
  },
  {
    area: "Integrations",
    name: "Resend templates + decision drip",
    status: "preview",
    phase: "3",
    note: "Templates drafted; drip schedule defined.",
    href: "/admin/email",
  },
  {
    area: "Integrations",
    name: "Mailchimp newsletter",
    status: "planned",
    phase: "3",
    note: "Double opt-in, mirrored to Supabase.",
  },
  {
    area: "Integrations",
    name: "Twilio SMS (keyword opt-in)",
    status: "optional",
    phase: "5",
    note: "TCPA compliance; opt-in only.",
  },
  {
    area: "Integrations",
    name: "GA4 + Meta Pixel (consent-gated)",
    status: "planned",
    phase: "6",
    note: "Consent banner is built; IDs pending.",
  },
  // Launch
  {
    area: "Launch",
    name: "Content migration + 301 map",
    status: "planned",
    phase: "6",
    note: "Old WordPress URLs mapped; media moved to Storage.",
  },
  {
    area: "Launch",
    name: "Security review, load test, runbook, staff training",
    status: "planned",
    phase: "7",
    note: "Go / No-Go checklist.",
  },
  // Ideas from the January build (not in the RFP)
  {
    area: "Ideas from the January build",
    name: "Member portal (sign-in, giving, family, serving)",
    status: "preview",
    phase: "—",
    note: "Sign-in, the path, giving read from Pushpay, family and check-in code, serving schedule.",
    href: "/member",
  },
  {
    area: "Ideas from the January build",
    name: "Young Lions check-in kiosk and room roster",
    status: "preview",
    phase: "—",
    note: "Tablet kiosk with phone lookup or family code, printed tags with matching codes, room roster with allergies and paging.",
    href: "/checkin",
  },
];
