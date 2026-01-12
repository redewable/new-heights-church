import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

// Placeholder data for demo
const mockEvents = [
  {
    id: "1",
    title: "Christmas Eve Service",
    date: "December 24, 2024",
    time: "6:00 PM & 8:00 PM",
    location: "Main Sanctuary",
    slug: "christmas-eve-2024",
    featured: true,
  },
  {
    id: "2",
    title: "New Year's Eve Prayer Night",
    date: "December 31, 2024",
    time: "9:00 PM",
    location: "Main Sanctuary",
    slug: "new-years-prayer-2024",
    featured: false,
  },
  {
    id: "3",
    title: "Youth Winter Retreat",
    date: "January 10-12, 2025",
    time: "All Day",
    location: "Mountain View Camp",
    slug: "youth-winter-retreat-2025",
    featured: false,
  },
];

export async function UpcomingEvents() {
  // const events = await getUpcomingEvents();
  const events = mockEvents; // Use mock data for now

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            What&apos;s Happening
          </p>
          <h2 className="font-heading text-display-sm text-text-primary">
            Upcoming Events
          </h2>
        </div>
        <Link
          href="/events"
          className="btn-ghost text-xs group"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="card group"
          >
            {/* Date badge */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gold/10 border border-gold/20 flex flex-col items-center justify-center">
                <span className="text-gold text-xs uppercase">
                  {event.date.split(" ")[0].slice(0, 3)}
                </span>
                <span className="text-text-primary font-heading text-lg">
                  {event.date.split(" ")[1].replace(",", "")}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-heading-sm text-text-primary group-hover:text-gold transition-colors truncate">
                  {event.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {event.time}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>

            {/* Featured badge */}
            {event.featured && (
              <div className="mt-4 inline-block px-2 py-1 bg-gold/10 text-gold text-xs rounded uppercase tracking-wider">
                Featured
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
