import { Suspense } from "react";
import { getLiveState } from "@/lib/sanity/queries";
import { HeroLive } from "@/components/live/HeroLive";
import { Play, Calendar, Bell } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "Live",
  description: "Watch our live service or catch up on the latest message.",
};

export default async function LivePage() {
  const liveState = await getLiveState();

  if (liveState.state === "live" || liveState.state === "startingSoon") {
    return (
      <HeroLive
        state={liveState.state}
        videoId={liveState.videoId}
        startsAt={liveState.startsAt}
        showChat={liveState.showChat}
      />
    );
  }

  // Not currently live - show info page
  return (
    <div className="min-h-screen bg-bg pt-32 pb-16">
      <div className="container-site">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Play className="w-8 h-8 text-gold" />
          </div>

          {/* Headline */}
          <h1 className="font-heading text-display-md text-text-primary mb-4">
            We&apos;re Not Live Right Now
          </h1>
          
          <p className="text-text-secondary text-body-lg mb-8">
            Join us for our next service or watch the latest message from our archive.
          </p>

          {/* Service Times */}
          <div className="card mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-heading-md text-text-primary">
                Service Times
              </h2>
            </div>
            <div className="space-y-2 text-text-secondary">
              <p>Sunday 9:00 AM</p>
              <p>Sunday 11:00 AM</p>
              <p className="text-sm text-text-muted mt-4">
                All services are streamed live on this page
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/watch" className="btn-primary">
              <Play className="w-4 h-4" />
              Watch Latest Message
            </Link>
            <button className="btn-secondary">
              <Bell className="w-4 h-4" />
              Get Notified
            </button>
          </div>

          {/* Note */}
          <p className="mt-8 text-sm text-text-muted">
            Can&apos;t make it live? All services are available on-demand in our{" "}
            <Link href="/watch" className="text-gold hover:underline">
              sermon archive
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
