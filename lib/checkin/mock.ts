/**
 * Mock data for the Young Lions check-in PREVIEW. Room names are working
 * labels by age band until the Young Lions team confirms theirs. Every
 * child here is a placeholder; the "Sample" household is the one from the
 * member-portal preview so the two screens tell one story.
 */

export const STATION = {
  name: "Downstairs desk · Station 1",
  service: "Sunday 10 AM",
  date: "2026-09-13",
  opensAt: "9:30 AM",
} as const;

export interface Room {
  key: string;
  name: string;
  ages: string;
  capacity: number;
  leader: string;
}

export const ROOMS: ReadonlyArray<Room> = [
  {
    key: "nursery",
    name: "Nursery",
    ages: "0–2",
    capacity: 12,
    leader: "Room lead (sample)",
  },
  {
    key: "preschool",
    name: "Preschool",
    ages: "3–5",
    capacity: 16,
    leader: "Room lead (sample)",
  },
  {
    key: "elem-k2",
    name: "Elementary K–2",
    ages: "K–2nd",
    capacity: 24,
    leader: "Room lead (sample)",
  },
  {
    key: "elem-35",
    name: "Elementary 3–5",
    ages: "3rd–5th",
    capacity: 24,
    leader: "Room lead (sample)",
  },
];

export interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  roomKey: string;
  allergies: string[];
  notes: string | null;
}

export interface Household {
  code: string;
  name: string;
  phoneLast4: string;
  parents: string[];
  children: Child[];
}

export const HOUSEHOLD: Household = {
  code: "NH-7K2Q",
  name: "The Sample family",
  phoneLast4: "0100",
  parents: ["Jordan Sample", "Casey Sample"],
  children: [
    {
      id: "c-ava",
      name: "Ava Sample",
      age: 4,
      grade: "Pre-K",
      roomKey: "preschool",
      allergies: ["Peanuts"],
      notes: "Bring comfort blanket",
    },
    {
      id: "c-eli",
      name: "Eli Sample",
      age: 8,
      grade: "3rd",
      roomKey: "elem-35",
      allergies: [],
      notes: null,
    },
  ],
};

export interface CheckIn {
  child: string;
  roomKey: string;
  code: string;
  at: string;
  allergies: string[];
  pickedUp: boolean;
}

/** What the roster looks like twenty minutes into a Sunday. */
export const CHECKINS: ReadonlyArray<CheckIn> = [
  {
    child: "Ava Sample",
    roomKey: "preschool",
    code: "NH-7K2Q",
    at: "9:41 AM",
    allergies: ["Peanuts"],
    pickedUp: false,
  },
  {
    child: "Eli Sample",
    roomKey: "elem-35",
    code: "NH-7K2Q",
    at: "9:41 AM",
    allergies: [],
    pickedUp: false,
  },
  {
    child: "Mia Example",
    roomKey: "nursery",
    code: "NH-3D8M",
    at: "9:36 AM",
    allergies: [],
    pickedUp: false,
  },
  {
    child: "Leo Example",
    roomKey: "preschool",
    code: "NH-3D8M",
    at: "9:36 AM",
    allergies: ["Dairy"],
    pickedUp: false,
  },
  {
    child: "Zoe Placeholder",
    roomKey: "elem-k2",
    code: "NH-9P4T",
    at: "9:44 AM",
    allergies: [],
    pickedUp: false,
  },
  {
    child: "Sam Placeholder",
    roomKey: "elem-k2",
    code: "NH-9P4T",
    at: "9:44 AM",
    allergies: [],
    pickedUp: false,
  },
  {
    child: "Ivy Placeholder",
    roomKey: "elem-35",
    code: "NH-2W6C",
    at: "9:47 AM",
    allergies: ["Tree nuts"],
    pickedUp: false,
  },
  {
    child: "Max Placeholder",
    roomKey: "nursery",
    code: "NH-5H1R",
    at: "9:52 AM",
    allergies: [],
    pickedUp: true,
  },
];
