import { NextResponse } from "next/server";
import { getEventBySlug } from "@/lib/events/queries";
import { eventToICS } from "@/lib/events/ics";

/**
 * GET /events/[slug]/ics
 *
 * Returns an iCalendar (.ics) document for the named event. The "Add to
 * calendar" button on the detail page hits this endpoint and the browser
 * offers the file to the OS, which hands it to the default calendar app.
 *
 * 404 when the slug is unknown so caches don't poison a missing event.
 */

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return new NextResponse("Not found", { status: 404 });
  }
  const body = eventToICS(event);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="nhc-${event.slug}.ics"`,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
