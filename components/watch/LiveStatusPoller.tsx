"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { youTubeEmbedUrl } from "@/lib/youtube/url";
import { CHURCH } from "@/lib/constants/church";
import { pushpayHref } from "@/lib/constants/giving";

type Status =
  | { state: "live"; videoId: string; title?: string }
  | { state: "offline" }
  | { state: "unavailable" };

interface ApiResponse {
  live: boolean;
  videoId?: string;
  title?: string;
  source: "youtube" | "offline" | "no-env" | "error";
}

/**
 * Polls /api/livestream-status on a 60s cadence while the tab is visible.
 * Swaps between a full-bleed live iframe and a "next service" countdown
 * without a page navigation — so someone who lands a few minutes early
 * gets the embed the instant the stream starts.
 *
 * We intentionally pause polling when the tab is hidden. No reason to burn
 * YouTube quota for a backgrounded tab.
 */
export function LiveStatusPoller({ initial }: { initial: Status }) {
  const [status, setStatus] = useState<Status>(initial);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function check() {
      try {
        const res = await fetch("/api/livestream-status", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data = (await res.json()) as ApiResponse;
        if (cancelled) return;
        if (data.live && data.videoId) {
          setStatus({ state: "live", videoId: data.videoId, title: data.title });
        } else if (data.source === "no-env") {
          setStatus({ state: "unavailable" });
        } else {
          setStatus({ state: "offline" });
        }
      } catch {
        /* keep the last known state — a transient failure shouldn't blank the UI */
      }
    }

    function schedule() {
      if (cancelled) return;
      if (document.hidden) return;
      timeoutId = setTimeout(async () => {
        await check();
        schedule();
      }, 60_000);
    }

    function onVisibility() {
      if (document.hidden) {
        if (timeoutId) clearTimeout(timeoutId);
      } else {
        check().then(schedule);
      }
    }

    schedule();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (status.state === "live") {
    return <LiveEmbed videoId={status.videoId} title={status.title} />;
  }
  return <OfflinePanel unavailable={status.state === "unavailable"} />;
}

function LiveEmbed({ videoId, title }: { videoId: string; title?: string }) {
  return (
    <section aria-label="Live stream" className="bg-ink">
      <div className="mx-auto max-w-[100rem] px-0 md:px-6 lg:px-10">
        <div className="relative aspect-video overflow-hidden md:rounded-[var(--radius-lg)]">
          <iframe
            src={youTubeEmbedUrl(videoId, { autoplay: true })}
            title={title ?? "New Heights Church — live"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-[100rem] flex-col items-start justify-between gap-4 px-5 py-6 text-sm md:flex-row md:items-center md:px-10">
        <div className="text-cream/85 flex items-center gap-3">
          <PulseDot />
          <span className="u-eyebrow">Live now · {CHURCH.name}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/85 hover:text-cream inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
          >
            Open chat on YouTube ↗
          </a>
          <a
            href={pushpayHref("watch-live")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink inline-flex h-9 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-4 font-semibold"
          >
            Give during service
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Shown whenever we aren't live — including when the YouTube API key isn't
 * configured yet. A visitor never sees configuration language; they see the
 * next service and a way to watch on YouTube right now.
 */
function OfflinePanel({ unavailable }: { unavailable: boolean }) {
  const next = nextServiceMoment();
  void unavailable; // same public panel either way; the API source is an ops detail
  return (
    <section
      aria-live="polite"
      className="u-grain-ink text-cream relative overflow-hidden"
    >
      <div className="u-hero-mark relative mx-auto flex max-w-[82.5rem] flex-col items-start px-5 py-20 sm:px-8 md:py-28 lg:px-12">
        <span className="u-eyebrow inline-flex items-center gap-2 text-[color:var(--nh-gold)]">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[color:var(--nh-gold)]"
          />
          Watch live · Not streaming right now
        </span>

        <h1 className="u-display-dramatic text-cream mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,5.25rem)]">
          Next service:
          <br />
          <span className="text-[color:var(--nh-gold)]">
            {next.day}, {next.time}
          </span>
        </h1>

        <p className="text-cream/85 mt-6 max-w-[42rem] text-lg leading-relaxed md:text-xl">
          Every Sunday at 10 AM and Wednesday at 7 PM we stream from the house. This page
          goes live the moment worship starts. Until then, watch the latest service below
          or subscribe on YouTube so you never miss one.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={CHURCH.urls.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-cream inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-[color:var(--nh-gold)] px-6 text-sm font-semibold hover:bg-[color:var(--nh-gold-ink)]"
          >
            Watch on YouTube ↗
          </a>
          <Link
            href="/sermons"
            className="text-cream hover:bg-cream hover:text-ink inline-flex h-12 items-center rounded-[var(--radius-sm)] border border-white/40 px-6 text-sm font-semibold"
          >
            Latest services
          </Link>
          <Link
            href="/im-new"
            className="text-cream/80 hover:text-cream inline-flex h-12 items-center px-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Plan a visit
          </Link>
        </div>
      </div>
    </section>
  );
}

function PulseDot() {
  return (
    <span className="relative inline-flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--nh-scarlet)] opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-[color:var(--nh-scarlet)]" />
    </span>
  );
}

/**
 * Compute the next service time in Central Time. We use the user's local
 * clock to render the weekday/time labels (Intl handles this). If it's
 * currently Sunday morning, the "next" is Sunday 10 AM; if Wednesday
 * afternoon, "next" is Wednesday 7 PM; otherwise we walk forward.
 */
function nextServiceMoment(): { day: string; time: string } {
  const now = new Date();
  const dow = now.getUTCDay();
  const hourCT = (now.getUTCHours() - 6 + 24) % 24; // crude CT offset; DST ±1h is fine for display
  // Sunday service: Sun 10 AM CT. Wed service: Wed 7 PM CT.
  const isBeforeSunSvc = dow === 0 && hourCT < 10;
  const isBeforeWedSvc = dow === 3 && hourCT < 19;

  if (isBeforeSunSvc) return { day: "This Sunday", time: "10 A.M. CT" };
  if (isBeforeWedSvc) return { day: "This Wednesday", time: "7 P.M. CT" };

  // Walk forward to the next Sun or Wed.
  for (let add = 1; add <= 7; add++) {
    const d = (dow + add) % 7;
    if (d === 0) return { day: "Sunday", time: "10 A.M. CT" };
    if (d === 3) return { day: "Wednesday", time: "7 P.M. CT" };
  }
  return { day: "Sunday", time: "10 A.M. CT" };
}
