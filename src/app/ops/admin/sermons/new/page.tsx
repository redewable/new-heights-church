import { SermonForm } from "../_components/SermonForm";
import { createClient } from "@/lib/supabase/server";
import type { Speaker, Series } from "@/lib/types";

export default async function NewSermonPage() {
  const supabase = await createClient();

  const [{ data: speakersData }, { data: seriesData }] = await Promise.all([
    supabase.from("speakers").select("id, name").order("name"),
    supabase.from("series").select("id, title").order("title"),
  ]);

  const speakers = (speakersData || []) as Speaker[];
  const series = (seriesData || []) as Series[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-sm text-text-primary">Add Sermon</h1>
        <p className="text-text-secondary">Create a new sermon entry</p>
      </div>

      <SermonForm speakers={speakers} series={series} />
    </div>
  );
}