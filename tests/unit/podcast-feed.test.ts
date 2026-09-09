import { describe, it, expect } from "vitest";
import { parseLatestEpisode } from "@/lib/podcast/feed";

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>The Brian Hallam Podcast</title>
  <link>https://www.buzzsprout.com/1919457</link>
  <item>
    <title><![CDATA[The Brian Hallam Podcast Ep 74 Faith &amp; Fire]]></title>
    <link>https://www.buzzsprout.com/1919457/episodes/74</link>
    <pubDate>Mon, 31 Aug 2026 20:00:00 -0500</pubDate>
    <enclosure url="https://www.buzzsprout.com/1919457/episodes/74.mp3" length="1" type="audio/mpeg" />
  </item>
  <item>
    <title>The Brian Hallam Podcast Ep 75 What Is The Mission?</title>
    <link>https://www.buzzsprout.com/1919457/episodes/75</link>
    <pubDate>Mon, 07 Sep 2026 20:00:00 -0500</pubDate>
    <enclosure url="https://www.buzzsprout.com/1919457/episodes/75.mp3" length="1" type="audio/mpeg" />
  </item>
</channel></rss>`;

describe("parseLatestEpisode (podcast RSS)", () => {
  it("returns the newest item with its audio, whatever the feed order", () => {
    expect(parseLatestEpisode(FEED)).toEqual({
      title: "The Brian Hallam Podcast Ep 75 What Is The Mission?",
      publishedAt: "2026-09-08T01:00:00.000Z",
      audioUrl: "https://www.buzzsprout.com/1919457/episodes/75.mp3",
      link: "https://www.buzzsprout.com/1919457/episodes/75",
    });
  });

  it("unwraps CDATA and entities in titles", () => {
    const onlyOld = FEED.replace(
      /<item>\s*<title>The Brian Hallam Podcast Ep 75[\s\S]*?<\/item>/,
      "",
    );
    expect(parseLatestEpisode(onlyOld)?.title).toBe(
      "The Brian Hallam Podcast Ep 74 Faith & Fire",
    );
  });

  it("returns null when there is no playable item", () => {
    expect(parseLatestEpisode("")).toBeNull();
    expect(
      parseLatestEpisode("<rss><channel><item><title>x</title></item></channel></rss>"),
    ).toBeNull();
  });
});
