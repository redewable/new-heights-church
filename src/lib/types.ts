export interface Speaker {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  photo_url?: string;
  created_at: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  date: string;
  speaker_id?: string;
  series_id?: string;
  youtube_video_id?: string;
  thumbnail_url?: string;
  notes?: string;
  key_points?: string[];
  scripture_refs?: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
  speaker?: { name: string };
  series?: { title: string; slug?: string };
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  start_date: string;
  end_date?: string;
  location?: string;
  description?: string;
  image_url?: string;
  registration_url?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}