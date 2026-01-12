import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SpeakerForm } from "../_components/SpeakerForm";
import type { Speaker } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSpeakerPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("speakers")
    .select("*")
    .eq("id", id)
    .single();

  const speaker = data as Speaker | null;

  if (!speaker) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-display-sm text-text-primary">Edit Speaker</h1>
        <p className="text-text-secondary">{speaker.name}</p>
      </div>

      <SpeakerForm speaker={speaker} />
    </div>
  );
}