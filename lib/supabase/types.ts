/**
 * Hand-maintained types mirroring supabase/migrations/0001_content_base.sql.
 * Once a live Supabase project exists, replace this file by running:
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 *
 * Until then, this file intentionally mirrors the shape Supabase emits —
 * Tables (with Row/Insert/Update/Relationships), Views, Functions, Enums,
 * CompositeTypes — so the postgrest-js generics resolve and query results
 * aren't inferred as `never`.
 */

export type PillarTag = "harvest" | "bride" | "habitation";

export interface SermonRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  speaker: string;
  series_id: string | null;
  service_date: string; // ISO date — "YYYY-MM-DD"
  youtube_id: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  poster_url: string | null;
  transcript: string | null;
  notes_url: string | null;
  scripture_refs: string[];
  topics: string[];
  pillar: PillarTag | null;
  views: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeriesRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  start_date: string | null;
  end_date: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffEmailRow {
  email: string;
  role: string;
  created_at: string;
}

export type PledgeFrequency = "one_time" | "monthly" | "quarterly" | "annually";

export interface CampaignProgressRow {
  id: string;
  campaign: string;
  title: string;
  blurb: string | null;
  goal_cents: number;
  pledged_cents: number;
  given_cents: number;
  next_milestone: string | null;
  next_milestone_date: string | null;
  active: boolean;
  updated_at: string;
}

export interface PledgeRow {
  id: string;
  campaign: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  amount_cents: number;
  frequency: PledgeFrequency;
  note: string | null;
  consent_followup: boolean;
  pushpay_initiated_at: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatementRequestRow {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  tax_year: number;
  notes: string | null;
  fulfilled: boolean;
  fulfilled_at: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface RedirectRow {
  id: string;
  source_path: string;
  target_path: string;
  status_code: 301 | 302 | 307 | 308;
  note: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BaptismInterestRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  parent_consent: boolean;
  parent_name: string | null;
  parent_phone: string | null;
  testimony: string | null;
  preferred_service: string | null;
  status: "new" | "scheduled" | "baptized" | "paused";
  scheduled_for: string | null;
  baptized_on: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface BabyDedicationRow {
  id: string;
  parent_first_name: string;
  parent_last_name: string;
  partner_first_name: string | null;
  partner_last_name: string | null;
  email: string;
  phone: string;
  child_first_name: string;
  child_last_name: string | null;
  child_date_of_birth: string | null;
  preferred_service_date: string | null;
  notes: string | null;
  status: "new" | "scheduled" | "dedicated";
  scheduled_for: string | null;
  dedicated_on: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface VolunteerApplicationRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  ministry_areas: string[];
  availability: string | null;
  completed_n2n: boolean;
  completed_foundations: boolean;
  background_check_consent: boolean;
  notes: string | null;
  status: "new" | "reviewing" | "approved" | "waitlist" | "declined";
  reviewed_at: string | null;
  reviewed_by: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export type EventMinistry =
  | "kids"
  | "youth"
  | "adults"
  | "church_wide"
  | "conferences"
  | "worship_nights"
  | "discipleship";

export type RegistrationPlatform =
  | "planning_center"
  | "brushfire"
  | "internal"
  | "external";

/**
 * Drives the CTA state on cards and the detail page without nulling the
 * registration URL (migration 0007). `open` is the default.
 */
export type EventRegistrationStatus = "open" | "closed" | "waitlist" | "tbd";

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  start_at: string;
  end_at: string | null;
  time_note: string | null;
  location: string | null;
  ministry: EventMinistry | null;
  pillar: PillarTag | null;
  registration_url: string | null;
  registration_platform: RegistrationPlatform | null;
  registration_status: EventRegistrationStatus;
  cost_label: string | null;
  poster_url: string | null;
  /** Guest speakers / featured voices, display order. Migration 0008. */
  speakers: string[] | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      sermons: {
        Row: SermonRow;
        Insert: Partial<SermonRow> & Pick<SermonRow, "slug" | "title" | "service_date">;
        Update: Partial<SermonRow>;
        Relationships: [
          {
            foreignKeyName: "sermons_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["id"];
          },
        ];
      };
      series: {
        Row: SeriesRow;
        Insert: Partial<SeriesRow> & Pick<SeriesRow, "slug" | "title">;
        Update: Partial<SeriesRow>;
        Relationships: [];
      };
      staff_emails: {
        Row: StaffEmailRow;
        Insert: { email: string; role?: string };
        Update: { email?: string; role?: string };
        Relationships: [];
      };
      campaign_progress: {
        Row: CampaignProgressRow;
        Insert: Partial<CampaignProgressRow> &
          Pick<CampaignProgressRow, "campaign" | "title" | "goal_cents">;
        Update: Partial<CampaignProgressRow>;
        Relationships: [];
      };
      pledges: {
        Row: PledgeRow;
        Insert: Partial<PledgeRow> &
          Pick<
            PledgeRow,
            "campaign" | "first_name" | "email" | "amount_cents" | "frequency"
          >;
        Update: Partial<PledgeRow>;
        Relationships: [
          {
            foreignKeyName: "pledges_campaign_fkey";
            columns: ["campaign"];
            isOneToOne: false;
            referencedRelation: "campaign_progress";
            referencedColumns: ["campaign"];
          },
        ];
      };
      statement_requests: {
        Row: StatementRequestRow;
        Insert: Partial<StatementRequestRow> &
          Pick<StatementRequestRow, "first_name" | "email" | "tax_year">;
        Update: Partial<StatementRequestRow>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Partial<EventRow> & Pick<EventRow, "slug" | "title" | "start_at">;
        Update: Partial<EventRow>;
        Relationships: [];
      };
      baptism_interest: {
        Row: BaptismInterestRow;
        Insert: Partial<BaptismInterestRow> &
          Pick<BaptismInterestRow, "first_name" | "last_name" | "email">;
        Update: Partial<BaptismInterestRow>;
        Relationships: [];
      };
      baby_dedications: {
        Row: BabyDedicationRow;
        Insert: Partial<BabyDedicationRow> &
          Pick<
            BabyDedicationRow,
            | "parent_first_name"
            | "parent_last_name"
            | "email"
            | "phone"
            | "child_first_name"
          >;
        Update: Partial<BabyDedicationRow>;
        Relationships: [];
      };
      volunteer_applications: {
        Row: VolunteerApplicationRow;
        Insert: Partial<VolunteerApplicationRow> &
          Pick<VolunteerApplicationRow, "first_name" | "last_name" | "email" | "phone">;
        Update: Partial<VolunteerApplicationRow>;
        Relationships: [];
      };
      redirects: {
        Row: RedirectRow;
        Insert: Partial<RedirectRow> & Pick<RedirectRow, "source_path" | "target_path">;
        Update: Partial<RedirectRow>;
        Relationships: [];
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    Functions: {
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      bump_sermon_view: {
        Args: { p_slug: string };
        Returns: undefined;
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Enums: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    CompositeTypes: {};
  };
}
