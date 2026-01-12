import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

interface LiveState {
  state: "live" | "startingSoon" | "off";
  videoId?: string;
  startsAt?: string;
  showChat?: boolean;
  message?: string;
}

// Cache the response for 30 seconds
export const revalidate = 30;

export async function GET() {
  try {
    // Demo mode - return mock data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json<LiveState>({
        state: "off",
        message: "Demo mode - no live stream",
      });
    }

    // Fetch live control from Sanity
    const liveControl = await client.fetch(`
      *[_type == "liveControl"][0] {
        mode,
        overrideVideoId,
        showChat,
        scheduledServices,
        startingSoonMessage
      }
    `);

    if (!liveControl) {
      return NextResponse.json<LiveState>({ state: "off" });
    }

    // Handle force modes
    if (liveControl.mode === "force_live" && liveControl.overrideVideoId) {
      return NextResponse.json<LiveState>({
        state: "live",
        videoId: liveControl.overrideVideoId,
        showChat: liveControl.showChat || false,
      });
    }

    if (liveControl.mode === "force_off") {
      return NextResponse.json<LiveState>({ state: "off" });
    }

    // Auto mode - check YouTube API for live status
    const youtubeChannelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!youtubeChannelId || !youtubeApiKey) {
      console.warn("YouTube credentials not configured");
      return NextResponse.json<LiveState>({ state: "off" });
    }

    // Check for live broadcasts on the channel
    const youtubeResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        new URLSearchParams({
          part: "snippet",
          channelId: youtubeChannelId,
          eventType: "live",
          type: "video",
          key: youtubeApiKey,
        }),
      { next: { revalidate: 30 } }
    );

    if (!youtubeResponse.ok) {
      console.error("YouTube API error:", await youtubeResponse.text());
      return NextResponse.json<LiveState>({ state: "off" });
    }

    const youtubeData = await youtubeResponse.json();

    if (youtubeData.items && youtubeData.items.length > 0) {
      const liveVideo = youtubeData.items[0];
      return NextResponse.json<LiveState>({
        state: "live",
        videoId: liveVideo.id.videoId,
        showChat: liveControl.showChat || false,
      });
    }

    // Check for upcoming broadcasts
    const upcomingResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        new URLSearchParams({
          part: "snippet",
          channelId: youtubeChannelId,
          eventType: "upcoming",
          type: "video",
          key: youtubeApiKey,
        }),
      { next: { revalidate: 60 } }
    );

    if (upcomingResponse.ok) {
      const upcomingData = await upcomingResponse.json();
      
      if (upcomingData.items && upcomingData.items.length > 0) {
        const upcomingVideo = upcomingData.items[0];
        const scheduledStart = upcomingVideo.snippet?.scheduledStartTime;
        
        if (scheduledStart) {
          const startTime = new Date(scheduledStart);
          const now = new Date();
          const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);
          
          // Show "starting soon" if within 30 minutes
          if (diffMinutes <= 30 && diffMinutes > 0) {
            return NextResponse.json<LiveState>({
              state: "startingSoon",
              videoId: upcomingVideo.id.videoId,
              startsAt: scheduledStart,
              message: liveControl.startingSoonMessage || "Service starts soon",
            });
          }
        }
      }
    }

    return NextResponse.json<LiveState>({ state: "off" });
  } catch (error) {
    console.error("Error fetching live state:", error);
    return NextResponse.json<LiveState>({ state: "off" });
  }
}
