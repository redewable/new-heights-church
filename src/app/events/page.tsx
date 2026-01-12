import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Events",
  description: "Discover upcoming events and gatherings at New Heights Church.",
};

interface Event {
  id: string;
  title: string;
  slug: string;
  start_date: string;
  end_date?: string;
  location?: string;
  description?: string;
  featured: boolean;
  published: boolean;
}

function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.start_date);
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });
  const day = eventDate.getDate();
  const time = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Link href={`/events/${event.slug}`} className="card group block">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center">
          <span className="text-gold text-xs uppercase font-medium">{month}</span>
          <span className="text-text-primary font-heading text-xl">{day}</span>
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

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4 text-gold" />
          <span>{time}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-4 h-4 text-gold" />
            <span>{event.location}</span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="text-text-muted text-sm line-clamp-2 mb-4">
          {event.description}
        </p>
      )}

      <span className="inline-flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
        Learn More
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

export default async function EventsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true });

  const events = (data || []) as Event[];
  const featuredEvents = events.filter((e) => e.featured);
  const regularEvents = events.filter((e) => !e.featured);

  return (
    <div className="min-h-screen bg-bg pt-28 pb-16">
      <div className="container-site">
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

        <div>
          {regularEvents.length > 0 ? (
            <>
              <h2 className="font-heading text-heading-lg text-text-primary mb-6">
                All Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading text-heading-md text-text-primary mb-2">
                No Upcoming Events
              </h3>
              <p className="text-text-secondary">
                Check back soon for new events and gatherings.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}