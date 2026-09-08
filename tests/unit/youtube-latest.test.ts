import { describe, it, expect } from "vitest";
import { parseLatest } from "@/lib/youtube/latest";

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
  <title>Brian Hallam Ministries</title>
  <published>2020-04-02T14:37:21+00:00</published>
  <entry>
    <yt:videoId>fXLvduUBfZs</yt:videoId>
    <title>There Is A Competition For Souls</title>
    <published>2026-09-06T22:45:01+00:00</published>
  </entry>
  <entry>
    <yt:videoId>0ayvS8d6Evo</yt:videoId>
    <title>The Brian Hallam Podcast Ep 75 What Is The Mission? &amp; More</title>
    <published>2026-09-08T02:00:46+00:00</published>
  </entry>
</feed>`;

describe("parseLatest (YouTube channel feed)", () => {
  it("picks the newest entry whatever the feed order, and decodes entities", () => {
    expect(parseLatest(FEED)).toEqual({
      videoId: "0ayvS8d6Evo",
      title: "The Brian Hallam Podcast Ep 75 What Is The Mission? & More",
      publishedAt: "2026-09-08T02:00:46+00:00",
    });
  });

  it("ignores the channel's own <title>/<published> outside entries", () => {
    const onlyHeader = FEED.replace(/<entry>[\s\S]*<\/entry>/, "");
    expect(parseLatest(onlyHeader)).toBeNull();
  });

  it("returns null for empty or malformed input", () => {
    expect(parseLatest("")).toBeNull();
    expect(parseLatest("<feed><entry><title>no id</title></entry></feed>")).toBeNull();
  });
});
