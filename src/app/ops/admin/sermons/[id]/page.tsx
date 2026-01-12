import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SermonForm } from "../_components/SermonForm";
import type { Sermon, Speaker, Series } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSermonPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: sermonData }, { data: speakersData }, { data: seriesData }] = await Promise.all([
    supabase.from("sermons").select("*").eq("id", id).single(),
    supabase.from("speakers").select("id, name").order("name"),
    supabase.from("series").select("id, title").order("title"),
  ]);

  const sermon = sermonData as Sermon | null;
  const speakers = (speakersData || []) as Speaker[];
  const series = (seriesData || []) as Series[];

  if (!sermon) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-sm text-text-primary">Edit Sermon</h1>
        <p className="text-text-secondary">{sermon.title}</p>
      </div>

      <SermonForm sermon={sermon} speakers={speakers} series={series} />
    </div>
  );
}