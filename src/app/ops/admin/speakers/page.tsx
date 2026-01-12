import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Edit, User } from "lucide-react";
import type { Speaker } from "@/lib/types";

export default async function SpeakersAdmin() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("speakers")
    .select("*")
    .order("name");

  const speakers = (data || []) as Speaker[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-display-sm text-text-primary">Speakers</h1>
          <p className="text-text-secondary">Manage your speakers</p>
        </div>
        <Link href="/ops/admin/speakers/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Speaker
        </Link>
      </div>

      {speakers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-heading-sm text-text-primary">
                    {speaker.name}
                  </h3>
                  {speaker.role && (
                    <p className="text-text-muted text-sm">{speaker.role}</p>
                  )}
                </div>
                <Link
                  href={`/ops/admin/speakers/${speaker.id}`}
                  className="text-gold hover:underline text-sm"
                >
                  <Edit className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-muted mb-4">No speakers yet</p>
          <Link href="/ops/admin/speakers/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Your First Speaker
          </Link>
        </div>
      )}
    </div>
  );
}