import type { Metadata } from "next";
import Image from "next/image";
import { AdminPage, Panel, PreviewButton } from "@/components/admin/ui";
import { MEDIA } from "@/lib/constants/media";
import { BOOK } from "@/lib/constants/bhm";
import { EVENT_FIXTURES } from "@/lib/events/fixtures";

export const metadata: Metadata = { title: "Media library" };

export default function AdminMedia() {
  const poster = EVENT_FIXTURES.find((e) => e.poster_url)?.poster_url ?? null;
  const items = [
    ...Object.entries(MEDIA).map(([key, p]) => ({
      key,
      src: p.src,
      alt: p.alt,
      w: p.width,
      h: p.height,
      host: new URL(p.src).hostname,
    })),
    {
      key: "book",
      src: BOOK.cover.src,
      alt: BOOK.cover.alt,
      w: BOOK.cover.width,
      h: BOOK.cover.height,
      host: new URL(BOOK.cover.src).hostname,
    },
    ...(poster
      ? [
          {
            key: "activated-poster",
            src: poster,
            alt: "Activated poster",
            w: 2000,
            h: 1125,
            host: new URL(poster).hostname,
          },
        ]
      : []),
  ];

  return (
    <AdminPage
      title="Media library"
      description="Every image the site uses today is hot-linked from the Church's existing sites. Phase 6 moves them into Supabase Storage, which this screen will browse."
      actions={<PreviewButton tone="gold">Upload</PreviewButton>}
    >
      <Panel title={`Images in use · ${items.length}`}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <li
              key={m.key}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--nh-border)]"
            >
              <div className="bg-ink relative aspect-[4/3]">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-xs">
                <p className="text-ink font-mono font-semibold">{m.key}</p>
                <p className="text-fog mt-1">
                  {m.w} × {m.h} · {m.host}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminPage>
  );
}
