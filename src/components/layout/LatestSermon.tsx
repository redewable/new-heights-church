import Link from "next/link";
import Image from "next/image";
import { Play, Clock, User } from "lucide-react";
import { client } from "@/lib/sanity/client";

async function getLatestSermon() {
  return client.fetch(`
    *[_type == "sermon"] | order(date desc)[0] {
      _id,
      title,
      "slug": slug.current,
      date,
      "speaker": speaker->name,
      "series": series->title,
      youtubeVideoId,
      "thumbnail": thumbnail.asset->url
    }
  `);
}

export async function LatestSermon() {
  const sermon = await getLatestSermon();

  if (!sermon) {
    return (
      <div className="card">
        <p className="text-text-muted text-center py-8">
          No sermons yet. Check back soon!
        </p>
      </div>
    );
  }

  const date = sermon.date
    ? new Date(sermon.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="card group cursor-pointer hover:shadow-gold-glow transition-all duration-500">
      <Link href={`/watch/message/${sermon.slug}`} className="block">
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-bg-tertiary">
          {sermon.thumbnail ? (
            <Image
              src={sermon.thumbnail}
              alt={sermon.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : sermon.youtubeVideoId ? (
            <Image
              src={`https://i.ytimg.com/vi/${sermon.youtubeVideoId}/hqdefault.jpg`}
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
        </div>

        <div>
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            Latest Message
          </p>
          <h3 className="font-heading text-heading-lg text-text-primary mb-2 group-hover:text-gold transition-colors">
            {sermon.title}
          </h3>
          {sermon.series && (
            <p className="text-text-secondary text-sm mb-3">{sermon.series}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {sermon.speaker && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {sermon.speaker}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {date}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}