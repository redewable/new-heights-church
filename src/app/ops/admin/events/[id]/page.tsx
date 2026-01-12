import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "../_components/EventForm";
import type { Event } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  const event = data as Event | null;

  if (!event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-sm text-text-primary">Edit Event</h1>
        <p className="text-text-secondary">{event.title}</p>
      </div>

      <EventForm event={event} />
    </div>
  );
}