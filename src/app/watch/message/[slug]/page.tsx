import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";
import { client } from "@/lib/sanity/client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getSermon(slug: string) {
  return client.fetch(
    `
    *[_type == "sermon" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      date,
      "speaker": speaker->name,
      "series": series->title,
      "seriesSlug": series->slug.current,
      youtubeVideoId,
      notes,
      keyPoints,
      scriptureReferences
    }
  `,
    { slug }
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const sermon = await getSermon(slug);

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
  const sermon = await getSermon(slug);

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
        {/* Back Link */}
        <Link
          href="/watch"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Messages
        </Link>

        {/* Video Player */}
        {sermon.youtubeVideoId && (
          <div className="video-container mb-8 shadow-gold-glow">
            <iframe
              src={`https://www.youtube.com/embed/${sermon.youtubeVideoId}`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {/* Sermon Info */}
        <div className="max-w-3xl">
          {/* Series Badge */}
          {sermon.series && (
            <Link
              href={`/watch/series/${sermon.seriesSlug}`}
              className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs uppercase tracking-wider rounded mb-4 hover:bg-gold/20 transition-colors"
            >
              {sermon.series}
            </Link>
          )}

          {/* Title */}
          <h1 className="font-heading text-display-sm md:text-display-md text-text-primary mb-4">
            {sermon.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-8">
            {sermon.speaker && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                {sermon.speaker}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                {date}
              </span>
            )}
          </div>

          {/* Scripture References */}
          {sermon.scriptureReferences && sermon.scriptureReferences.length > 0 && (
            <div className="mb-8">
              <h2 className="font-heading text-heading-sm text-text-primary mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold" />
                Scripture References
              </h2>
              <div className="flex flex-wrap gap-2">
                {sermon.scriptureReferences.map((ref: string, i: number) => (
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

          {/* Key Points */}
          {sermon.keyPoints && sermon.keyPoints.length > 0 && (
            <div className="mb-8">
              <h2 className="font-heading text-heading-sm text-text-primary mb-3">
                Key Points
              </h2>
              <ul className="space-y-2">
                {sermon.keyPoints.map((point: string, i: number) => (
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
        </div>
      </div>
    </div>
  );
}