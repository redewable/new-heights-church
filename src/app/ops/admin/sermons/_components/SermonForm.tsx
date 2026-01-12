"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";
import type { Sermon, Speaker, Series } from "@/lib/types";

interface SermonFormProps {
  sermon?: Sermon;
  speakers: Pick<Speaker, "id" | "name">[];
  series: Pick<Series, "id" | "title">[];
}

export function SermonForm({ sermon, speakers, series }: SermonFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: sermon?.title || "",
    slug: sermon?.slug || "",
    date: sermon?.date || "",
    speaker_id: sermon?.speaker_id || "",
    series_id: sermon?.series_id || "",
    youtube_video_id: sermon?.youtube_video_id || "",
    notes: sermon?.notes || "",
    published: sermon?.published || false,
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
      date: formData.date,
      speaker_id: formData.speaker_id || null,
      series_id: formData.series_id || null,
      youtube_video_id: formData.youtube_video_id || null,
      notes: formData.notes || null,
      published: formData.published,
    };

    try {
      if (sermon?.id) {
        const { error: updateError } = await supabase
          .from("sermons")
          .update(submitData as never)
          .eq("id", sermon.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("sermons")
          .insert(submitData as never);

        if (insertError) throw insertError;
      }

      router.push("/ops/admin/sermons");
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
          <p className="text-text-muted text-xs mt-1">URL: /watch/message/{formData.slug || "..."}</p>
        </div>

        <div>
          <label htmlFor="date" className="label">Date *</label>
          <input
            id="date"
            type="date"
            className="input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="speaker" className="label">Speaker</label>
          <select
            id="speaker"
            className="input"
            value={formData.speaker_id}
            onChange={(e) => setFormData({ ...formData, speaker_id: e.target.value })}
          >
            <option value="">Select a speaker</option>
            {speakers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="series" className="label">Series</label>
          <select
            id="series"
            className="input"
            value={formData.series_id}
            onChange={(e) => setFormData({ ...formData, series_id: e.target.value })}
          >
            <option value="">Select a series</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="youtube" className="label">YouTube Video ID</label>
          <input
            id="youtube"
            type="text"
            className="input"
            placeholder="e.g. dQw4w9WgXcQ"
            value={formData.youtube_video_id}
            onChange={(e) => setFormData({ ...formData, youtube_video_id: e.target.value })}
          />
          <p className="text-text-muted text-xs mt-1">The ID from the YouTube URL (after v=)</p>
        </div>

        <div>
          <label htmlFor="notes" className="label">Notes</label>
          <textarea
            id="notes"
            className="input min-h-[120px]"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
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
            {sermon ? "Update Sermon" : "Create Sermon"}
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