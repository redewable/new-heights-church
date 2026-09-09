import { PlatformIcon } from "@/components/brand/PlatformIcon";
import { SermonPlayer } from "@/components/sermons/SermonPlayer";
import type { LatestUpload } from "@/lib/youtube/latest";
import type { PodcastEpisode } from "@/lib/podcast/feed";
import { formatDate } from "@/lib/utils/format";

/**
 * The newest episode of a show, from whichever source answered:
 *   1. YouTube — the channel's newest upload, click-to-load video;
 *   2. the podcast RSS — title, date, and the audio itself;
 *   3. neither — one line and a link to the channel.
 * Never the show's key art: the pages that use this already carry it.
 */
export function LatestEpisode({
  video,
  audio,
  youtubeUrl,
}: {
  video: LatestUpload | null;
  audio: PodcastEpisode | null;
  youtubeUrl: string | null;
}) {
  if (video) {
    return (
      <div>
        <Header label="Latest on YouTube" date={video.publishedAt} />
        <div className="mt-4">
          <SermonPlayer
            videoId={video.videoId}
            posterUrl={null}
            title={video.title}
            kind="episode"
          />
        </div>
        <h3 className="u-display-soft text-ink mt-4 text-lg leading-snug md:text-xl">
          {video.title}
        </h3>
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink mt-2 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
        >
          <PlatformIcon platform="youtube" size={16} />
          Open on YouTube
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    );
  }

  if (audio) {
    return (
      <div>
        <Header label="Latest episode" date={audio.publishedAt} />
        <div className="u-grain-ink bg-ink text-cream mt-4 rounded-[var(--radius-lg)] p-5 md:p-6">
          <h3 className="u-display-soft text-cream text-xl leading-snug md:text-2xl">
            {audio.title}
          </h3>
          {/* Native audio: no third-party iframe, plays inline on every phone. */}
          <audio
            controls
            preload="none"
            src={audio.audioUrl}
            className="mt-5 w-full"
            aria-label={`Play: ${audio.title}`}
          />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {youtubeUrl ? (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
              >
                <PlatformIcon platform="youtube" size={16} />
                Watch on YouTube
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {audio.link ? (
              <a
                href={audio.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-cream underline-offset-4 hover:underline"
              >
                Episode page ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--nh-border)] p-6">
      <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">Latest episode</p>
      <p className="u-display-soft text-ink mt-3 text-xl leading-snug">
        Every episode is on the channel.
      </p>
      {youtubeUrl ? (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink mt-4 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
        >
          <PlatformIcon platform="youtube" size={16} />
          Watch on YouTube
          <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </div>
  );
}

function Header({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <p className="u-eyebrow text-[color:var(--nh-gold-ink)]">{label}</p>
      <p className="text-fog text-sm whitespace-nowrap">
        {formatDate(date.slice(0, 10))}
      </p>
    </div>
  );
}
