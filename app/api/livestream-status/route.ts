import { NextResponse } from "next/server";
import { getLivestreamStatus } from "@/lib/youtube/livestream";

/**
 * GET /api/livestream-status
 * Returns the current livestream state, cached 60s at the Next fetch layer
 * inside `getLivestreamStatus`. The client-side <LiveEmbed /> polls this
 * endpoint on the /watch page — NOT the YouTube API directly — so the key
 * never leaves the server and the quota stays bounded.
 */
export const revalidate = 60;

export async function GET() {
  const status = await getLivestreamStatus();
  return NextResponse.json(status, {
    headers: {
      // Short public cache + a longer stale-while-revalidate window. If the
      // edge gets hot during Sunday traffic we'd rather serve slightly stale
      // data than batter the YouTube API.
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
    },
  });
}
