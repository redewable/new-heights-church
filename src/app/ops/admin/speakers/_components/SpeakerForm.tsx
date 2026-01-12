"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";
import type { Speaker } from "@/lib/types";

interface SpeakerFormProps {
  speaker?: Speaker;
}

export function SpeakerForm({ speaker }: SpeakerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: speaker?.name || "",
    role: speaker?.role || "",
    bio: speaker?.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const submitData = {
      name: formData.name,
      role: formData.role || null,
      bio: formData.bio || null,
    };

    try {
      if (speaker?.id) {
        const { error: updateError } = await supabase
          .from("speakers")
          .update(submitData as never)
          .eq("id", speaker.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("speakers")
          .insert(submitData as never);

        if (insertError) throw insertError;
      }

      router.push("/ops/admin/speakers");
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
          <label htmlFor="name" className="label">Name *</label>
          <input
            id="name"
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="label">Role / Title</label>
          <input
            id="role"
            type="text"
            className="input"
            placeholder="e.g. Lead Pastor, Guest Speaker"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="bio" className="label">Bio</label>
          <textarea
            id="bio"
            className="input min-h-[120px]"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
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
            {speaker ? "Update Speaker" : "Create Speaker"}
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