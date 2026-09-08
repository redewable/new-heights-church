/**
 * Mock data for the /member PREVIEW — one sample household, obviously so.
 * Nothing here is a real person. When the portal is built, these shapes
 * become Supabase rows joined to Planning Center People / Giving / Groups.
 */

export const MEMBER = {
  firstName: "Jordan",
  lastName: "Sample",
  email: "jordan@example.com",
  phone: "979-555-0100",
  household: "The Sample family",
  plantedSince: "2024",
  memberSince: "2024-11-10",
  firstTouchTeam: "Greeters",
  lifeGroup: {
    name: "South College Station · Tuesdays",
    leader: "Group leader (sample)",
    next: "2026-09-09T19:00:00-05:00",
  },
  preferences: { email: true, sms: false, newsletter: true },
} as const;

export type PathState = "done" | "current" | "next";

export const PATH: ReadonlyArray<{
  key: string;
  label: string;
  detail: string;
  state: PathState;
  when?: string;
}> = [
  {
    key: "saved",
    label: "Saved",
    detail: "Said yes at the altar",
    state: "done",
    when: "Aug 2024",
  },
  {
    key: "baptized",
    label: "Baptized",
    detail: "Water baptism",
    state: "done",
    when: "Sep 2024",
  },
  {
    key: "filled",
    label: "Filled",
    detail: "Baptism in the Holy Spirit",
    state: "done",
    when: "Oct 2024",
  },
  {
    key: "planted",
    label: "Planted",
    detail: "New to New Heights · Foundations of Faith",
    state: "done",
    when: "Nov 2024",
  },
  {
    key: "serving",
    label: "Serving",
    detail: "First Touch · Greeters",
    state: "current",
    when: "Since Jan 2025",
  },
  { key: "sent", label: "Sent", detail: "Leading, discipling, going", state: "next" },
];

export const GIVING = {
  ytd: 4_150,
  lastGift: { amount: 250, date: "2026-09-06", fund: "General", method: "Pushpay" },
  recurring: { amount: 250, cadence: "Monthly", nextDate: "2026-10-01", fund: "General" },
  pledge: {
    campaign: "Rise Up and Build",
    amount: 1_200,
    cadence: "Monthly",
    fulfilled: 0.35,
  },
  statements: [
    { year: 2025, ready: true },
    { year: 2026, ready: false },
  ],
  recent: [
    { date: "2026-09-06", fund: "General", amount: 250, method: "Pushpay · recurring" },
    { date: "2026-08-24", fund: "Rise Up and Build", amount: 100, method: "Pushpay" },
    { date: "2026-08-02", fund: "General", amount: 250, method: "Pushpay · recurring" },
    { date: "2026-07-12", fund: "Youth Camp scholarship", amount: 50, method: "Pushpay" },
    { date: "2026-07-01", fund: "General", amount: 250, method: "Pushpay · recurring" },
  ],
} as const;

export const FAMILY = {
  code: "NH-7K2Q",
  adults: [
    { name: "Jordan Sample", role: "Parent · account holder" },
    { name: "Casey Sample", role: "Parent" },
  ],
  children: [
    {
      name: "Ava Sample",
      age: 4,
      grade: "Pre-K",
      room: "Preschool",
      allergies: ["Peanuts"],
      notes: "Bring comfort blanket",
    },
    {
      name: "Eli Sample",
      age: 8,
      grade: "3rd",
      room: "Elementary 3–5",
      allergies: [],
      notes: null,
    },
  ],
  authorizedPickups: ["Jordan Sample", "Casey Sample", "Grandparent (sample)"],
} as const;

export const SERVING = {
  team: "First Touch · Greeters",
  lead: "Team lead (sample)",
  upcoming: [
    {
      date: "2026-09-13",
      service: "Sunday 10 AM",
      role: "Front doors",
      arrive: "9:15 AM",
    },
    {
      date: "2026-09-27",
      service: "Activated · Sunday",
      role: "Guest check-in",
      arrive: "8:30 AM",
    },
    {
      date: "2026-10-11",
      service: "Sunday 10 AM",
      role: "Front doors",
      arrive: "9:15 AM",
    },
  ],
  training: [
    { name: "New to New Heights", status: "done", when: "Nov 2024" },
    { name: "Foundations of Faith", status: "done", when: "Dec 2024" },
    { name: "Background check", status: "done", when: "Renews Jan 2027" },
    { name: "Child protection training", status: "due", when: "Due Oct 2026" },
  ],
} as const;

export const REGISTRATIONS = [
  {
    event: "Activated",
    slug: "activated-2026",
    when: "Sept 24–27",
    seats: 2,
    platform: "Brushfire",
  },
] as const;

export const PRAYER = [
  {
    id: "p-1",
    summary: "Healing for a family member",
    submitted: "2026-09-02",
    status: "Prayed over Wednesday",
    open: true,
  },
] as const;
