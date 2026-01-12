"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface HeroLiveProps {
  state: "live" | "startingSoon";
  videoId?: string;
  startsAt?: string;
  showChat?: boolean;
}

export function HeroLive({ state, videoId, startsAt, showChat = false }: HeroLiveProps) {
  const [countdown, setCountdown] = useState<string | null>(null);
  const [showChatPanel, setShowChatPanel] = useState(showChat);

  // Countdown timer for "starting soon" state
  useEffect(() => {
    if (state !== "startingSoon" || !startsAt) return;

    const updateCountdown = () => {
      const now = new Date();
      const start = new Date(startsAt);
      const diff = start.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [state, startsAt]);

  return (
    <section className="relative min-h-screen bg-bg pt-20">
      {/* Live Indicator Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-live/10 border-b border-live/20 py-3"
      >
        <div className="container-site flex items-center justify-center gap-4">
          <div className="live-indicator">
            {state === "live" ? "Live Now" : "Starting Soon"}
          </div>
          {countdown && (
            <span className="text-text-secondary text-sm">
              Service begins in {countdown}
            </span>
          )}
          <div className="hidden sm:flex items-center gap-2 text-text-secondary text-sm">
            <Users className="w-4 h-4" />
            <span>Watching with your church family</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container-site py-8">
        <div className={cn(
          "grid gap-6",
          showChatPanel ? "lg:grid-cols-[1fr_350px]" : "grid-cols-1"
        )}>
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="video-container shadow-gold-glow">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="New Heights Church Live Stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gold" />
                    </div>
                    <p className="text-text-secondary">
                      {state === "startingSoon"
                        ? "Service will begin shortly"
                        : "Loading stream..."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Bar */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="font-heading text-xl text-text-primary">
                  Sunday Service
                </h1>
                <p className="text-text-secondary text-sm">
                  New Heights Church
                </p>
              </div>
              <button
                onClick={() => setShowChatPanel(!showChatPanel)}
                className={cn(
                  "btn-ghost text-xs",
                  showChatPanel && "bg-white/10"
                )}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {showChatPanel ? "Hide Chat" : "Show Chat"}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Chat Panel */}
          {showChatPanel && videoId && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:block"
            >
              <div className="bg-bg-elevated rounded-xl border border-white/5 overflow-hidden h-full min-h-[500px]">
                <div className="p-4 border-b border-white/5">
                  <h2 className="font-heading text-sm uppercase tracking-wider text-gold">
                    Live Chat
                  </h2>
                </div>
                <iframe
                  src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
                  className="w-full h-[calc(100%-60px)]"
                  title="Live Chat"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Actions - Below Fold */}
      <div className="container-site pb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/give" className="btn-primary">
            Give
          </a>
          <a href="/visit" className="btn-secondary">
            Plan a Visit
          </a>
          <a href="#" className="btn-ghost">
            Submit Prayer Request
          </a>
        </div>
      </div>
    </section>
  );
}
