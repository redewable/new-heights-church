import Link from "next/link";
import Image from "next/image";
import { Play, Clock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Sermon } from "@/lib/types";

export async function LatestSermon() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("sermons")
    .select(`
      *,
      speaker:speakers(name),
      series:series(title)
    `)
    .eq("published", true)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  const sermon = data as Sermon | null;

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
          {sermon.youtube_video_id ? (
            <Image
              src={`https://i.ytimg.com/vi/${sermon.youtube_video_id}/hqdefault.jpg`}
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
          {sermon.series?.title && (
            <p className="text-text-secondary text-sm mb-3">{sermon.series.title}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {sermon.speaker?.name && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {sermon.speaker.name}
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