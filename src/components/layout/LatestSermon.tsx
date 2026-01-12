import Link from "next/link";
import Image from "next/image";
import { Play, Clock, User } from "lucide-react";
// import { getLatestSermon } from "@/lib/sanity/queries";

// Placeholder data for demo
const mockSermon = {
  title: "Walking in Faith",
  series: "The Journey",
  speaker: "Pastor John",
  date: "December 8, 2024",
  duration: "45 min",
  thumbnail: null,
  slug: "walking-in-faith",
};

export async function LatestSermon() {
  // const sermon = await getLatestSermon();
  const sermon = mockSermon; // Use mock data for now

  return (
    <div className="card group cursor-pointer hover:shadow-gold-glow transition-all duration-500">
      <Link href={`/watch/message/${sermon.slug}`} className="block">
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
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                <Play className="w-6 h-6 text-gold" />
              </div>
            </div>
          )}
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-bg/80 backdrop-blur rounded text-xs text-text-primary">
            {sermon.duration}
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            Latest Message
          </p>
          <h3 className="font-heading text-heading-lg text-text-primary mb-2 group-hover:text-gold transition-colors">
            {sermon.title}
          </h3>
          <p className="text-text-secondary text-sm mb-3">
            {sermon.series}
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
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
    </div>
  );
}
