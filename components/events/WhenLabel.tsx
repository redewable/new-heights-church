import type { EventRow } from "@/lib/supabase/types";
import { eventWhenParts } from "@/lib/events/format";

/**
 * Renders an event's when-label with every date/time piece in its own
 * `whitespace-nowrap` span. A line may break at the separator, never inside
 * a date. Strict on purpose: dates that wrap read as sloppy.
 */
export function WhenLabel({ event, className }: { event: EventRow; className?: string }) {
  const { parts, separator } = eventWhenParts(event);
  return (
    <span className={className}>
      {parts.map((p, i) => (
        <span key={p}>
          {i > 0 ? separator : null}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </span>
  );
}
