"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";
import type { Event } from "@/lib/types";

interface EventFormProps {
  event?: Event;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: event?.title || "",
    slug: event?.slug || "",
    start_date: event?.start_date ? event.start_date.slice(0, 16) : "",
    end_date: event?.end_date ? event.end_date.slice(0, 16) : "",
    location: event?.location || "",
    description: event?.description || "",
    registration_url: event?.registration_url || "",
    featured: event?.featured || false,
    published: event?.published || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const submitData = {
      title: formData.title,
      slug: formData.slug,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      location: formData.location || null,
      description: formData.description || null,
      registration_url: formData.registration_url || null,
      featured: formData.featured,
      published: formData.published,
    };

    try {
      if (event?.id) {
        const { error: updateError } = await supabase
          .from("events")
          .update(submitData as never)
          .eq("id", event.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("events")
          .insert(submitData as never);

        if (insertError) throw insertError;
      }

      router.push("/ops/admin/events");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="card space-y-6">
        <div>
          <label htmlFor="title" className="label">Title *</label>
          <input
            id="title"
            type="text"
            className="input"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
                slug: formData.slug || generateSlug(e.target.value),
              });
            }}
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="label">Slug *</label>
          <input
            id="slug"
            type="text"
            className="input"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
          <p className="text-text-muted text-xs mt-1">URL: /events/{formData.slug || "..."}</p>
        </div>

        <div>
          <label htmlFor="start_date" className="label">Start Date & Time *</label>
          <input
            id="start_date"
            type="datetime-local"
            className="input"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="end_date" className="label">End Date & Time</label>
          <input
            id="end_date"
            type="datetime-local"
            className="input"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="location" className="label">Location</label>
          <input
            id="location"
            type="text"
            className="input"
            placeholder="e.g. Main Sanctuary, Fellowship Hall"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description"
            className="input min-h-[120px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="registration_url" className="label">Registration URL</label>
          <input
            id="registration_url"
            type="url"
            className="input"
            placeholder="https://..."
            value={formData.registration_url}
            onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 bg-bg-secondary text-gold focus:ring-gold"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="text-text-primary">
              Featured event
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="published"
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 bg-bg-secondary text-gold focus:ring-gold"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            <label htmlFor="published" className="text-text-primary">
              Publish immediately
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-error/20 text-error-light text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {event ? "Update Event" : "Create Event"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}