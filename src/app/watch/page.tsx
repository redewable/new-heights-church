import Link from "next/link";
import Image from "next/image";
import { Play, Clock, User } from "lucide-react";
import { client } from "@/lib/sanity/client";

export const metadata = {
  title: "Watch",
  description: "Browse our sermon archive and watch messages on-demand.",
};

async function getSermons() {
  return client.fetch(`
    *[_type == "sermon"] | order(date desc) {
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

function SermonCard({ sermon }: { sermon: any }) {
  const date = sermon.date
    ? new Date(sermon.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/watch/message/${sermon.slug}`} className="card group">
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
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
              <Play className="w-5 h-5 text-gold" />
            </div>
          </div>
        )}
      </div>
      <div>
        {sermon.series && (
          <p className="text-gold text-xs uppercase tracking-wider mb-1">
            {sermon.series}
          </p>
        )}
        <h3 className="font-heading text-heading-sm text-text-primary mb-2 group-hover:text-gold transition-colors line-clamp-2">
          {sermon.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-text-muted">
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
  );
}

export default async function WatchPage() {
  const sermons = await getSermons();

  return (
    <div className="min-h-screen bg-bg pt-28 pb-16">
      <div className="container-site">
        <div className="mb-12">
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            Sermon Archive
          </p>
          <h1 className="font-heading text-display-md text-text-primary mb-4">
            Watch Messages
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Explore our library of messages and series.
          </p>
        </div>

        {sermons && sermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon: any) => (
              <SermonCard key={sermon._id} sermon={sermon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Play className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="font-heading text-heading-md text-text-primary mb-2">
              No Sermons Yet
            </h3>
            <p className="text-text-secondary">Check back soon for new messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}
