import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { client } from "@/lib/sanity/client";

async function getUpcomingEvents() {
  const now = new Date().toISOString();
  return client.fetch(
    `
    *[_type == "event" && startDate >= $now] | order(startDate asc)[0...6] {
      _id,
      title,
      "slug": slug.current,
      startDate,
      location,
      featured
    }
  `,
    { now }
  );
}

export async function UpcomingEvents() {
  const events = await getUpcomingEvents();

  if (!events || events.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold text-xs uppercase tracking-wider mb-2">
              What&apos;s Happening
            </p>
            <h2 className="font-heading text-display-sm text-text-primary">
              Upcoming Events
            </h2>
          </div>
        </div>
        <div className="card">
          <p className="text-text-muted text-center py-8">
            No upcoming events. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            What&apos;s Happening
          </p>
          <h2 className="font-heading text-display-sm text-text-primary">
            Upcoming Events
          </h2>
        </div>
        <Link href="/events" className="btn-ghost text-xs group">
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: any) => {
          const eventDate = new Date(event.startDate);
          const month = eventDate.toLocaleDateString("en-US", { month: "short" });
          const day = eventDate.getDate();
          const time = eventDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });

          return (
            <Link
              key={event._id}
              href={`/events/${event.slug}`}
              className="card group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gold/10 border border-gold/20 flex flex-col items-center justify-center">
                  <span className="text-gold text-xs uppercase">{month}</span>
                  <span className="text-text-primary font-heading text-lg">
                    {day}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-heading-sm text-text-primary group-hover:text-gold transition-colors truncate">
                    {event.title}
                  </h3>
                  <p className="text-text-secondary text-sm">{time}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <MapPin className="w-3 h-3" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.featured && (
                <div className="mt-4 inline-block px-2 py-1 bg-gold/10 text-gold text-xs rounded uppercase tracking-wider">
                  Featured
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}