import { describe, it, expect } from "vitest";
import { matchRedirect } from "@/lib/redirects/queries";
import type { RedirectRule } from "@/lib/redirects/queries";

const RULES: RedirectRule[] = [
  { source: "/sermons-main", target: "/sermons", status: 301 },
  { source: "/online/", target: "/watch", status: 301 },
  { source: "/bhp", target: "/podcasts#brian-hallam-podcast", status: 301 },
];

describe("matchRedirect", () => {
  it("matches exact sources", () => {
    expect(matchRedirect("/sermons-main", RULES)).toEqual(RULES[0]);
  });

  it("normalizes trailing slashes both directions", () => {
    // Rule has trailing slash, request doesn't.
    expect(matchRedirect("/online", RULES)).toEqual(RULES[1]);
    // Rule has no trailing slash, request does.
    expect(matchRedirect("/sermons-main/", RULES)).toEqual(RULES[0]);
  });

  it("preserves hash fragments on the target", () => {
    const m = matchRedirect("/bhp", RULES);
    expect(m?.target).toContain("#brian-hallam-podcast");
  });

  it("returns null for no match", () => {
    expect(matchRedirect("/not-a-legacy-path", RULES)).toBeNull();
  });
});
