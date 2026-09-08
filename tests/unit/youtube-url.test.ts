import { describe, it, expect } from "vitest";
import { parseYouTubeId, youTubeEmbedUrl, youTubeThumbnailUrl } from "@/lib/youtube/url";
import { iso8601DurationToSeconds } from "@/lib/youtube/ingest";

describe("parseYouTubeId", () => {
  const id = "dQw4w9WgXcQ";

  it("extracts id from standard /watch URLs", () => {
    expect(parseYouTubeId(`https://www.youtube.com/watch?v=${id}`)).toBe(id);
    expect(parseYouTubeId(`https://youtube.com/watch?v=${id}&t=30s`)).toBe(id);
    expect(parseYouTubeId(`https://m.youtube.com/watch?v=${id}`)).toBe(id);
  });

  it("extracts id from youtu.be short links", () => {
    expect(parseYouTubeId(`https://youtu.be/${id}`)).toBe(id);
    expect(parseYouTubeId(`https://youtu.be/${id}?si=abc`)).toBe(id);
  });

  it("extracts id from /embed, /live, /shorts, /v paths", () => {
    expect(parseYouTubeId(`https://www.youtube.com/embed/${id}`)).toBe(id);
    expect(parseYouTubeId(`https://www.youtube.com/live/${id}`)).toBe(id);
    expect(parseYouTubeId(`https://www.youtube.com/shorts/${id}`)).toBe(id);
    expect(parseYouTubeId(`https://www.youtube.com/v/${id}`)).toBe(id);
  });

  it("accepts a bare 11-char id", () => {
    expect(parseYouTubeId(id)).toBe(id);
    expect(parseYouTubeId(`  ${id}  `)).toBe(id);
  });

  it("returns null for non-YouTube URLs and garbage", () => {
    expect(parseYouTubeId("")).toBeNull();
    expect(parseYouTubeId("https://vimeo.com/12345")).toBeNull();
    expect(parseYouTubeId("https://youtube.com/@NewHeightsBCS")).toBeNull();
    expect(parseYouTubeId("not-a-url-at-all")).toBeNull();
    // 10 chars, not 11.
    expect(parseYouTubeId("dQw4w9WgXc")).toBeNull();
    // 11 chars but with a disallowed `.`.
    expect(parseYouTubeId("dQw4w9.WgXQ")).toBeNull();
  });
});

describe("youTubeEmbedUrl", () => {
  it("always uses youtube-nocookie.com and sets modest params", () => {
    const url = youTubeEmbedUrl("dQw4w9WgXcQ");
    expect(url).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(url).toContain("rel=0");
    expect(url).toContain("modestbranding=1");
    expect(url).toContain("playsinline=1");
  });

  it("applies start time and autoplay when given", () => {
    const url = youTubeEmbedUrl("dQw4w9WgXcQ", { start: 42, autoplay: true });
    expect(url).toContain("start=42");
    expect(url).toContain("autoplay=1");
  });
});

describe("youTubeThumbnailUrl", () => {
  it("points at the maxres thumbnail on i.ytimg.com", () => {
    expect(youTubeThumbnailUrl("dQw4w9WgXcQ")).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    );
  });
});

describe("iso8601DurationToSeconds", () => {
  it("parses standard YouTube duration strings", () => {
    expect(iso8601DurationToSeconds("PT42S")).toBe(42);
    expect(iso8601DurationToSeconds("PT15M")).toBe(900);
    expect(iso8601DurationToSeconds("PT1H")).toBe(3600);
    expect(iso8601DurationToSeconds("PT1H23M4S")).toBe(3600 + 23 * 60 + 4);
  });

  it("returns 0 for malformed input", () => {
    expect(iso8601DurationToSeconds("")).toBe(0);
    expect(iso8601DurationToSeconds("nonsense")).toBe(0);
  });
});
