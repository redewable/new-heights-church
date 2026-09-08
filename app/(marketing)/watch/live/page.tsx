import { redirect } from "next/navigation";

/**
 * /watch/live is a legacy and convenience route. The real logic lives at
 * /watch and dynamically switches to the live embed when the stream is up —
 * having a separate "always live" URL invites the embarrassing case of
 * pointing people to a dead iframe mid-week. Redirect to the canonical
 * /watch so there's one URL, one source of truth.
 *
 * The `redirects` table (Phase 6) will preserve the legacy
 * `newheightschurch.info/online/` → `/watch/live` hop for inbound links;
 * this file anchors the other side of that chain.
 */
export default function WatchLivePage() {
  redirect("/watch");
}
