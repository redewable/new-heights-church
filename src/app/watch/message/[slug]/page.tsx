import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Sermon } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("sermons")
    .select("title")
    .eq("slug", slug)
    .single();

  const sermon = data as { title: string } | null;

  if (!sermon) {
    return { title: "Sermon Not Found" };
  }

  return {
    title: sermon.title,
    description: `Watch "${sermon.title}" from New Heights Church.`,
  };
}

export default async function SermonPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("sermons")
    .select(`
      *,
      speaker:speakers(name),
      series:series(title, slug)
    `)
    .eq("slug", slug)
    .single();

  const sermon = data as Sermon | null;

  if (!sermon) {
    notFound();
  }

  const date = sermon.date
    ? new Date(sermon.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="container-site">
        <Link
          href="/watch"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Messages
        </Link>

        {sermon.youtube_video_id && (
          <div className="video-container mb-8 shadow-gold-glow">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${sermon.youtube_video_id}?rel=0&modestbranding=1`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        <div className="max-w-3xl">
          {sermon.series?.title && (
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs uppercase tracking-wider rounded mb-4">
              {sermon.series.title}
            </span>
          )}

          <h1 className="font-heading text-display-sm md:text-display-md text-text-primary mb-4">
            {sermon.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-8">
            {sermon.speaker?.name && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                {sermon.speaker.name}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                {date}
              </span>
            )}
          </div>

          {sermon.scripture_refs && sermon.scripture_refs.length > 0 && (
            <div className="mb-8">
              <h2 className="font-heading text-heading-sm text-text-primary mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold" />
                Scripture References
              </h2>
              <div className="flex flex-wrap gap-2">
                {sermon.scripture_refs.map((ref, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/5 text-text-secondary text-sm rounded"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sermon.key_points && sermon.key_points.length > 0 && (
            <div className="mb-8">
              <h2 className="font-heading text-heading-sm text-text-primary mb-3">
                Key Points
              </h2>
              <ul className="space-y-2">
                {sermon.key_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-secondary">
                    <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sermon.notes && (
            <div className="mb-8">
              <h2 className="font-heading text-heading-sm text-text-primary mb-3">
                Notes
              </h2>
              <div className="text-text-secondary whitespace-pre-wrap">
                {sermon.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}