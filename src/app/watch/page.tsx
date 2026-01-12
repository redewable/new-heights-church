import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock, User, Search, Filter } from "lucide-react";

export const metadata = {
  title: "Watch",
  description: "Browse our sermon archive and watch messages on-demand.",
};

// Mock data for demo
const mockSermons = [
  {
    id: "1",
    title: "Walking in Faith",
    series: "The Journey",
    speaker: "Pastor John",
    date: "December 8, 2024",
    duration: "45 min",
    thumbnail: null,
    slug: "walking-in-faith",
  },
  {
    id: "2",
    title: "The Power of Prayer",
    series: "Foundations",
    speaker: "Pastor John",
    date: "December 1, 2024",
    duration: "42 min",
    thumbnail: null,
    slug: "power-of-prayer",
  },
  {
    id: "3",
    title: "Living with Purpose",
    series: "The Journey",
    speaker: "Guest Speaker",
    date: "November 24, 2024",
    duration: "38 min",
    thumbnail: null,
    slug: "living-with-purpose",
  },
  {
    id: "4",
    title: "Grace and Truth",
    series: "Foundations",
    speaker: "Pastor John",
    date: "November 17, 2024",
    duration: "44 min",
    thumbnail: null,
    slug: "grace-and-truth",
  },
  {
    id: "5",
    title: "Community Matters",
    series: "Together",
    speaker: "Pastor John",
    date: "November 10, 2024",
    duration: "40 min",
    thumbnail: null,
    slug: "community-matters",
  },
  {
    id: "6",
    title: "Trusting God's Plan",
    series: "The Journey",
    speaker: "Pastor John",
    date: "November 3, 2024",
    duration: "46 min",
    thumbnail: null,
    slug: "trusting-gods-plan",
  },
];

const mockSeries = [
  { id: "1", title: "The Journey", count: 8, slug: "the-journey" },
  { id: "2", title: "Foundations", count: 12, slug: "foundations" },
  { id: "3", title: "Together", count: 6, slug: "together" },
];

function SermonCard({ sermon }: { sermon: typeof mockSermons[0] }) {
  return (
    <Link
      href={`/watch/message/${sermon.slug}`}
      className="card group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-bg-tertiary">
        {sermon.thumbnail ? (
          <Image
            src={sermon.thumbnail}
            alt={sermon.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-tertiary">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
              <Play className="w-5 h-5 text-gold" />
            </div>
          </div>
        )}
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-bg/80 backdrop-blur rounded text-xs text-text-primary">
          {sermon.duration}
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-gold text-xs uppercase tracking-wider mb-1">
          {sermon.series}
        </p>
        <h3 className="font-heading text-heading-sm text-text-primary mb-2 group-hover:text-gold transition-colors line-clamp-2">
          {sermon.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {sermon.speaker}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {sermon.date}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function WatchPage() {
  // In production: const sermons = await getSermons();
  const sermons = mockSermons;
  const series = mockSeries;

  return (
    <div className="min-h-screen bg-bg pt-28 pb-16">
      <div className="container-site">
        {/* Header */}
        <div className="mb-12">
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            Sermon Archive
          </p>
          <h1 className="font-heading text-display-md text-text-primary mb-4">
            Watch Messages
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Explore our library of messages and series. Each sermon is designed to
            help you grow in your faith and walk with Christ.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search messages..."
              className="input pl-11"
            />
          </div>
          <button className="btn-ghost">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Series Quick Nav */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 hide-scrollbar">
          <button className="px-4 py-2 rounded-full bg-gold text-bg text-sm font-medium whitespace-nowrap">
            All Messages
          </button>
          {series.map((s) => (
            <Link
              key={s.id}
              href={`/watch/series/${s.slug}`}
              className="px-4 py-2 rounded-full bg-white/5 text-text-secondary text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {s.title} ({s.count})
            </Link>
          ))}
        </div>

        {/* Sermon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="btn-secondary">
            Load More Messages
          </button>
        </div>
      </div>
    </div>
  );
}
