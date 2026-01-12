import { client } from "./client";

// Types
export interface LiveState {
  state: "live" | "startingSoon" | "off";
  videoId?: string;
  startsAt?: string;
  showChat?: boolean;
}

export interface Sermon {
  _id: string;
  title: string;
  slug: string;
  date: string;
  speaker: {
    name: string;
  };
  series?: {
    title: string;
    slug: string;
  };
  youtubeVideoId: string;
  thumbnail?: string;
  notes?: any; // Portable Text
  keyPoints?: string[];
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate?: string;
  location: string;
  description?: string;
  heroImage?: string;
  registrationLink?: string;
  featured?: boolean;
}

export interface Stance {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  content?: any; // Portable Text
  scriptureRefs?: string[];
}

// Queries
export async function getLiveState(): Promise<LiveState> {
  // In demo mode, return mock data
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return {
      state: "off",
      videoId: undefined,
      startsAt: undefined,
      showChat: false,
    };
  }

  try {
    const liveControl = await client.fetch(`
      *[_type == "liveControl"][0] {
        mode,
        overrideVideoId,
        showChat,
        scheduledServices,
        startingSoonMessage
      }
    `);

    if (!liveControl) {
      return { state: "off" };
    }

    // Handle force modes
    if (liveControl.mode === "force_live" && liveControl.overrideVideoId) {
      return {
        state: "live",
        videoId: liveControl.overrideVideoId,
        showChat: liveControl.showChat,
      };
    }

    if (liveControl.mode === "force_off") {
      return { state: "off" };
    }

    // Auto mode - check YouTube API
    // This would be replaced with actual YouTube API call
    // For now, return off state
    return { state: "off" };
  } catch (error) {
    console.error("Error fetching live state:", error);
    return { state: "off" };
  }
}

export async function getLatestSermon(): Promise<Sermon | null> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return null;
  }

  return client.fetch(`
    *[_type == "sermon"] | order(date desc)[0] {
      _id,
      title,
      "slug": slug.current,
      date,
      speaker->{name},
      series->{title, "slug": slug.current},
      youtubeVideoId,
      "thumbnail": thumbnail.asset->url,
      keyPoints
    }
  `);
}

export async function getSermons(limit = 12, offset = 0): Promise<Sermon[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return [];
  }

  return client.fetch(
    `
    *[_type == "sermon"] | order(date desc)[$offset...$end] {
      _id,
      title,
      "slug": slug.current,
      date,
      speaker->{name},
      series->{title, "slug": slug.current},
      youtubeVideoId,
      "thumbnail": thumbnail.asset->url
    }
  `,
    { offset, end: offset + limit }
  );
}

export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return null;
  }

  return client.fetch(
    `
    *[_type == "sermon" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      date,
      speaker->{name},
      series->{title, "slug": slug.current},
      youtubeVideoId,
      "thumbnail": thumbnail.asset->url,
      notes,
      keyPoints
    }
  `,
    { slug }
  );
}

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return [];
  }

  const now = new Date().toISOString();

  return client.fetch(
    `
    *[_type == "event" && startDate >= $now] | order(startDate asc)[0...$limit] {
      _id,
      title,
      "slug": slug.current,
      startDate,
      endDate,
      location,
      description,
      "heroImage": heroImage.asset->url,
      registrationLink,
      featured
    }
  `,
    { now, limit }
  );
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return null;
  }

  return client.fetch(
    `
    *[_type == "event" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      startDate,
      endDate,
      location,
      description,
      "heroImage": heroImage.asset->url,
      registrationLink,
      featured
    }
  `,
    { slug }
  );
}

export async function getStances(): Promise<Stance[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return [];
  }

  return client.fetch(`
    *[_type == "stance"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      category
    }
  `);
}

export async function getStanceBySlug(slug: string): Promise<Stance | null> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return null;
  }

  return client.fetch(
    `
    *[_type == "stance" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      summary,
      category,
      content,
      scriptureRefs
    }
  `,
    { slug }
  );
}

export async function getSiteSettings() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return {
      name: "New Heights Church",
      address: "123 Church Street, City, ST 12345",
      phone: "(555) 123-4567",
      email: "hello@newheightschurch.com",
      serviceTimes: ["Sunday 9:00 AM", "Sunday 11:00 AM"],
      socialLinks: {
        facebook: "#",
        instagram: "#",
        youtube: "#",
      },
    };
  }

  return client.fetch(`
    *[_type == "siteSettings"][0] {
      name,
      address,
      phone,
      email,
      serviceTimes,
      socialLinks,
      youtubeChannelId,
      podcastRssUrl,
      givingProviderUrl
    }
  `);
}
