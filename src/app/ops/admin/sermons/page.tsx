import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import type { Sermon } from "@/lib/types";

export default async function SermonsAdmin() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("sermons")
    .select(`
      *,
      speaker:speakers(name),
      series:series(title)
    `)
    .order("date", { ascending: false });

  const sermons = (data || []) as Sermon[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-display-sm text-text-primary">Sermons</h1>
          <p className="text-text-secondary">Manage your sermon library</p>
        </div>
        <Link href="/ops/admin/sermons/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Sermon
        </Link>
      </div>

      {sermons.length > 0 ? (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3">Title</th>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3 hidden md:table-cell">Speaker</th>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs uppercase tracking-wider text-text-muted px-4 py-3">Status</th>
                <th className="text-right text-xs uppercase tracking-wider text-text-muted px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sermons.map((sermon) => (
                <tr key={sermon.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-text-primary font-medium">{sermon.title}</p>
                      {sermon.series && (
                        <p className="text-text-muted text-xs">{sermon.series.title}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-text-secondary text-sm">
                    {sermon.speaker?.name || "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-text-secondary text-sm">
                    {sermon.date ? new Date(sermon.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {sermon.published ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success-light">
                        <Eye className="w-3 h-3" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                        <EyeOff className="w-3 h-3" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/ops/admin/sermons/${sermon.id}`}
                      className="inline-flex items-center gap-1 text-gold text-sm hover:underline"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-muted mb-4">No sermons yet</p>
          <Link href="/ops/admin/sermons/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Your First Sermon
          </Link>
        </div>
      )}
    </div>
  );
}