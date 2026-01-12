import Link from "next/link";
import { Headphones, Play, Clock } from "lucide-react";

// Placeholder data for demo
const mockEpisode = {
  title: "Finding Peace in Uncertain Times",
  description: "Pastor shares practical wisdom on navigating life's challenges with faith and hope.",
  date: "December 5, 2024",
  duration: "32 min",
  slug: "finding-peace",
};

export async function LatestPodcast() {
  // const episode = await getLatestPodcastEpisode();
  const episode = mockEpisode; // Use mock data for now

  return (
    <div className="card group cursor-pointer hover:shadow-gold-glow transition-all duration-500">
      <Link href={`/podcast#${episode.slug}`} className="block">
        {/* Podcast artwork placeholder */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-gold/20 to-bg-tertiary">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated sound waves */}
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gold/30 rounded-full animate-pulse"
                    style={{
                      height: `${20 + Math.random() * 30}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <div className="relative w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                <Headphones className="w-8 h-8 text-gold" />
              </div>
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-bg/80 backdrop-blur rounded text-xs text-text-primary">
            {episode.duration}
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            Latest Podcast Episode
          </p>
          <h3 className="font-heading text-heading-lg text-text-primary mb-2 group-hover:text-gold transition-colors">
            {episode.title}
          </h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {episode.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {episode.date}
            </span>
            <span className="flex items-center gap-1 text-gold">
              <Play className="w-3 h-3" />
              Listen Now
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
