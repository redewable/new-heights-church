import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Edit, Eye, EyeOff, Calendar } from "lucide-react";
import type { Event } from "@/lib/types";

export default async function EventsAdmin() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false });

  const events = (data || []) as Event[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-display-sm text-text-primary">Events</h1>
          <p className="text-text-secondary">Manage your church events</p>
        </div>
        <Link href="/ops/admin/events/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Event
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3">Event</th>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3 hidden md:table-cell">Location</th>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3">Status</th>
                <th className="text-right text-xs uppercase tracking-wider text-text-muted px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((event) => {
                const eventDate = event.start_date ? new Date(event.start_date) : null;
                const isPast = eventDate && eventDate < new Date();

                return (
                  <tr key={event.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">{event.title}</p>
                          {event.featured && (
                            <span className="text-gold text-xs">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-text-secondary text-sm">
                      {eventDate ? eventDate.toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-text-secondary text-sm">
                      {event.location || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {!event.published ? (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </span>
                      ) : isPast ? (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          Past
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-success-light">
                          <Eye className="w-3 h-3" />
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/ops/admin/events/${event.id}`}
                        className="inline-flex items-center gap-1 text-gold text-sm hover:underline"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-muted mb-4">No events yet</p>
          <Link href="/ops/admin/events/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Your First Event
          </Link>
        </div>
      )}
    </div>
  );
}