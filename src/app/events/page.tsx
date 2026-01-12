import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Filter } from "lucide-react";

export const metadata = {
  title: "Events",
  description: "Discover upcoming events and gatherings at New Heights Church.",
};

// Mock data for demo
const mockEvents = [
  {
    id: "1",
    title: "Christmas Eve Service",
    date: "December 24, 2024",
    time: "6:00 PM & 8:00 PM",
    location: "Main Sanctuary",
    description: "Join us for a special Christmas Eve celebration with carols, candlelight, and a message of hope.",
    slug: "christmas-eve-2024",
    featured: true,
    category: "worship",
  },
  {
    id: "2",
    title: "New Year's Eve Prayer Night",
    date: "December 31, 2024",
    time: "9:00 PM - 12:30 AM",
    location: "Main Sanctuary",
    description: "Ring in the new year with prayer, worship, and fellowship. Childcare provided.",
    slug: "new-years-prayer-2024",
    featured: true,
    category: "worship",
  },
  {
    id: "3",
    title: "Youth Winter Retreat",
    date: "January 10-12, 2025",
    time: "All Day",
    location: "Mountain View Camp",
    description: "A weekend getaway for students grades 6-12. Games, worship, and life-changing teaching.",
    slug: "youth-winter-retreat-2025",
    featured: false,
    category: "youth",
  },
  {
    id: "4",
    title: "Marriage Workshop",
    date: "January 18, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "Fellowship Hall",
    description: "Strengthen your marriage with practical tools and Biblical wisdom. Lunch provided.",
    slug: "marriage-workshop-2025",
    featured: false,
    category: "community",
  },
  {
    id: "5",
    title: "Kids Kickoff Sunday",
    date: "January 5, 2025",
    time: "During all services",
    location: "Kids Building",
    description: "New year, new adventures! Special activities and surprises for all kids.",
    slug: "kids-kickoff-2025",
    featured: false,
    category: "kids",
  },
  {
    id: "6",
    title: "Community Outreach Day",
    date: "January 25, 2025",
    time: "8:00 AM - 2:00 PM",
    location: "Various Locations",
    description: "Serve our community together through various projects around the city.",
    slug: "outreach-day-jan-2025",
    featured: false,
    category: "outreach",
  },
];

const categories = [
  { id: "all", name: "All Events" },
  { id: "worship", name: "Worship" },
  { id: "youth", name: "Youth" },
  { id: "kids", name: "Kids" },
  { id: "community", name: "Community" },
  { id: "outreach", name: "Outreach" },
];

function EventCard({ event }: { event: typeof mockEvents[0] }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="card group block"
    >
      {/* Date Badge */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center">
          <span className="text-gold text-xs uppercase font-medium">
            {event.date.split(" ")[0].slice(0, 3)}
          </span>
          <span className="text-text-primary font-heading text-xl">
            {event.date.split(" ")[1].replace(",", "")}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          {event.featured && (
            <span className="inline-block px-2 py-0.5 mb-2 bg-gold/20 text-gold text-xs rounded uppercase tracking-wider">
              Featured
            </span>
          )}
          <h3 className="font-heading text-heading-md text-text-primary group-hover:text-gold transition-colors">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4 text-gold" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin className="w-4 h-4 text-gold" />
          <span>{event.location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-muted text-sm line-clamp-2 mb-4">
        {event.description}
      </p>

      {/* CTA */}
      <span className="inline-flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
        Learn More
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

export default async function EventsPage() {
  // In production: const events = await getUpcomingEvents();
  const events = mockEvents;

  const featuredEvents = events.filter((e) => e.featured);
  const regularEvents = events.filter((e) => !e.featured);

  return (
    <div className="min-h-screen bg-bg pt-28 pb-16">
      <div className="container-site">
        {/* Header */}
        <div className="mb-12">
          <p className="text-gold text-xs uppercase tracking-wider mb-2">
            What&apos;s Happening
          </p>
          <h1 className="font-heading text-display-md text-text-primary mb-4">
            Upcoming Events
          </h1>
          <p className="text-text-secondary max-w-2xl">
            There&apos;s always something happening at New Heights. Find an event
            that fits you and get connected.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat.id === "all"
                  ? "bg-gold text-bg"
                  : "bg-white/5 text-text-secondary hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-heading-lg text-text-primary mb-6">
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        <div>
          <h2 className="font-heading text-heading-lg text-text-primary mb-6">
            All Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Empty State (for when there are no events) */}
        {events.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="font-heading text-heading-md text-text-primary mb-2">
              No Upcoming Events
            </h3>
            <p className="text-text-secondary">
              Check back soon for new events and gatherings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
