import { Suspense } from "react";
import { getLiveState } from "@/lib/sanity/queries";
import { HeroLive } from "@/components/live/HeroLive";
import { HeroDefault } from "@/components/layout/HeroDefault";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { LatestSermon } from "@/components/layout/LatestSermon";
import { LatestPodcast } from "@/components/layout/LatestPodcast";
import { UpcomingEvents } from "@/components/layout/UpcomingEvents";
import { SocialFeed } from "@/components/layout/SocialFeed";
import { NextSteps } from "@/components/layout/NextSteps";

// Revalidate every 30 seconds to check live state
export const revalidate = 30;

export default async function HomePage() {
  const liveState = await getLiveState();

  return (
    <>
      {/* Dynamic Hero based on live state */}
      {liveState.state === "live" || liveState.state === "startingSoon" ? (
        <HeroLive 
          state={liveState.state}
          videoId={liveState.videoId}
          startsAt={liveState.startsAt}
          showChat={liveState.showChat}
        />
      ) : (
        <HeroDefault />
      )}

      {/* Floating Actions - Always visible */}
      <FloatingActions />

      {/* Content Sections */}
      <section className="section bg-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Latest Sermon */}
            <Suspense fallback={<div className="card skeleton h-80" />}>
              <LatestSermon />
            </Suspense>

            {/* Latest Podcast */}
            <Suspense fallback={<div className="card skeleton h-80" />}>
              <LatestPodcast />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-bg-secondary">
        <div className="container-site">
          <Suspense fallback={<div className="skeleton h-64" />}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </section>

      {/* Next Steps */}
      <section className="section bg-bg">
        <div className="container-site">
          <NextSteps />
        </div>
      </section>

      {/* Social Feed */}
      <section className="section bg-bg-secondary">
        <div className="container-site">
          <Suspense fallback={<div className="skeleton h-64" />}>
            <SocialFeed />
          </Suspense>
        </div>
      </section>
    </>
  );
}
