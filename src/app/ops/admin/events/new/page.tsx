import { EventForm } from "../_components/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-sm text-text-primary">Add Event</h1>
        <p className="text-text-secondary">Create a new event</p>
      </div>

      <EventForm />
    </div>
  );
}