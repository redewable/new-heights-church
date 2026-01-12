"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Play } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Sermon, Speaker, Series } from "@/lib/types";

interface SermonFormProps {
  sermon?: Sermon;
  speakers: Pick<Speaker, "id" | "name">[];
  series: Pick<Series, "id" | "title">[];
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(input: string): string {
  if (!input) return "";
  
  const trimmed = input.trim();
  
  // Already just an ID (11 characters, alphanumeric with - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Try to extract from various URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  // If it looks like it could be an ID but with extra stuff, try to extract 11 chars
  const possibleId = trimmed.match(/([a-zA-Z0-9_-]{11})/);
  if (possibleId) return possibleId[1];
  
  return "";
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
    thumbnail_url: sermon?.thumbnail_url || "",
    notes: sermon?.notes || "",
    published: sermon?.published || false,
  });

  const [youtubeInput, setYoutubeInput] = useState(
    sermon?.youtube_video_id 
      ? `https://youtube.com/watch?v=${sermon.youtube_video_id}` 
      : ""
  );

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleYoutubeChange = (value: string) => {
    setYoutubeInput(value);
    const videoId = extractYouTubeId(value);
    
    setFormData(prev => ({
      ...prev,
      youtube_video_id: videoId,
      // Auto-generate thumbnail from YouTube if no custom thumbnail set
      thumbnail_url: prev.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "")
    }));
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
      thumbnail_url: formData.thumbnail_url || null,
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
          <label htmlFor="youtube" className="label">YouTube Video</label>
          <input
            id="youtube"
            type="text"
            className="input"
            placeholder="Paste YouTube URL or video ID"
            value={youtubeInput}
            onChange={(e) => handleYoutubeChange(e.target.value)}
          />
          <p className="text-text-muted text-xs mt-1">
            Paste the full YouTube URL (e.g. https://youtube.com/watch?v=xxxxx)
          </p>
          {formData.youtube_video_id && (
            <div className="mt-3">
              <p className="text-gold text-xs mb-2">
                ✓ Video ID: {formData.youtube_video_id}
              </p>
              {/* Video Preview */}
              <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-bg-secondary border border-white/10">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${formData.youtube_video_id}?rel=0`}
                  title="Video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="label">Thumbnail</label>
          <ImageUpload
            value={formData.thumbnail_url}
            onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
            folder="sermons"
            placeholder="Drag and drop a thumbnail image"
          />
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