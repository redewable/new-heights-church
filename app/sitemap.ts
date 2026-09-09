import type { MetadataRoute } from "next";
import { CHURCH } from "@/lib/constants/church";
import { listSermons, listSeries } from "@/lib/sermons/queries";
import { listEvents } from "@/lib/events/queries";

/**
 * Marketing routes + dynamic sermon/series URLs. When Supabase isn't wired
 * the query helpers fall back to fixtures so the sitemap still renders.
 *
 * `revalidate` keeps the published list fresh within ~10 minutes without
 * regenerating on every request.
 */

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    frequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1.0, frequency: "weekly" },
    { path: "/im-new", priority: 0.9, frequency: "weekly" },
    { path: "/watch", priority: 0.9, frequency: "daily" },
    { path: "/sermons", priority: 0.9, frequency: "daily" },
    { path: "/give", priority: 0.9, frequency: "weekly" },
    { path: "/grow", priority: 0.8, frequency: "weekly" },
    { path: "/grow/life-groups", priority: 0.7, frequency: "weekly" },
    { path: "/grow/foundation-faith", priority: 0.7, frequency: "monthly" },
    { path: "/grow/baptism", priority: 0.7, frequency: "monthly" },
    { path: "/grow/membership", priority: 0.7, frequency: "monthly" },
    { path: "/grow/volunteer", priority: 0.7, frequency: "monthly" },
    { path: "/events", priority: 0.8, frequency: "daily" },
    { path: "/connect", priority: 0.8, frequency: "monthly" },
    { path: "/connect/prayer", priority: 0.7, frequency: "monthly" },
    { path: "/connect/decision", priority: 0.8, frequency: "monthly" },
    { path: "/connect/baby-dedication", priority: 0.7, frequency: "monthly" },
    { path: "/give/statement", priority: 0.6, frequency: "yearly" },
    { path: "/rise-up-and-build", priority: 0.8, frequency: "weekly" },
    { path: "/kids", priority: 0.7, frequency: "monthly" },
    { path: "/youth", priority: 0.7, frequency: "monthly" },
    { path: "/podcasts", priority: 0.7, frequency: "weekly" },
    { path: "/about", priority: 0.7, frequency: "monthly" },
    { path: "/about/beliefs", priority: 0.6, frequency: "yearly" },
    { path: "/about/leadership", priority: 0.6, frequency: "monthly" },
    { path: "/about/brian-hallam-ministries", priority: 0.6, frequency: "monthly" },
    { path: "/about/visit", priority: 0.7, frequency: "monthly" },
    { path: "/resources", priority: 0.6, frequency: "monthly" },
    { path: "/legal/privacy", priority: 0.4, frequency: "yearly" },
    { path: "/legal/terms", priority: 0.4, frequency: "yearly" },
    { path: "/legal/child-protection", priority: 0.4, frequency: "yearly" },
  ];

  const [{ sermons }, series, { events }] = await Promise.all([
    listSermons({ limit: 1000 }),
    listSeries(),
    listEvents({ limit: 500 }),
  ]);

  const sermonEntries: MetadataRoute.Sitemap = sermons.map((s) => ({
    url: `${CHURCH.urls.site}/sermons/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const seriesEntries: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${CHURCH.urls.site}/sermons/series/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${CHURCH.urls.site}/events/${e.slug}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : now,
    changeFrequency: "weekly",
    priority: e.featured ? 0.7 : 0.5,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${CHURCH.urls.site}${r.path}`,
    lastModified: now,
    changeFrequency: r.frequency,
    priority: r.priority,
  }));

  return [...staticEntries, ...sermonEntries, ...seriesEntries, ...eventEntries];
}
