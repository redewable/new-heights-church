import { test, expect } from "@playwright/test";

test.describe("Sermons — Phase 2 smoke", () => {
  test("library renders fixtures with filter bar", async ({ page }) => {
    await page.goto("/sermons");
    await expect(
      page.getByRole("heading", { level: 1, name: /^Sermons/i }),
    ).toBeVisible();
    // Pillar chip is a Link (role link) with aria-current when active.
    await expect(page.getByRole("link", { name: /^All pillars$/ })).toBeVisible();
    // At least one sermon row should render (fixtures).
    await expect(
      page.getByRole("link", { name: /Watch & listen/i }).first(),
    ).toBeVisible();
  });

  test("pillar filter narrows results", async ({ page }) => {
    await page.goto("/sermons?pillar=harvest");
    await expect(page.getByRole("link", { name: /^Endtime Harvest$/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("sermon detail renders the service title and a player poster", async ({
    page,
  }) => {
    // Fixtures are the Church's real services: "Sunday Morning · September 6, 2026".
    await page.goto("/sermons/sunday-morning-2026-09-06");
    await expect(
      page.getByRole("heading", { level: 1, name: /Sunday Morning/ }),
    ).toBeVisible();
    // Click-to-play button is visible before any interaction.
    await expect(page.getByRole("button", { name: /Play sermon/i })).toBeVisible();
  });

  test("watch page renders offline-or-unavailable state without a live key", async ({
    page,
  }) => {
    await page.goto("/watch");
    // Without a YouTube key, we show the "livestream not configured" panel.
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /stream will light up|Next service/i,
      }),
    ).toBeVisible();
  });

  test("watch/live redirects to /watch", async ({ page }) => {
    const response = await page.goto("/watch/live");
    expect(response?.url()).toMatch(/\/watch$/);
  });
});

test.describe("Home — Phase 1 smoke", () => {
  test("hero copy lands", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /come expectant/i }),
    ).toBeVisible();
  });

  test("three pillars render in canonical order (Endtime Harvest → Preparation → Habitation)", async ({
    page,
  }) => {
    await page.goto("/");
    const articles = page.getByRole("article", { name: /^Pillar / });
    await expect(articles).toHaveCount(3);
    await expect(articles.nth(0)).toHaveAccessibleName(/^Pillar I:.*Harvest/i);
    await expect(articles.nth(1)).toHaveAccessibleName(/^Pillar II:.*Bride/i);
    await expect(articles.nth(2)).toHaveAccessibleName(/^Pillar III:.*Habitation/i);
  });

  test("altar / giving block is present with a verse anchor", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /give as the altar/i })).toBeVisible();
    await expect(page.getByText(/2 Corinthians 9:7/)).toBeVisible();
  });

  test("closing benediction ends the page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /we are family/i })).toBeVisible();
  });

  test("skip-link appears on keyboard focus and targets #main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /skip to content/i });
    await expect(skip).toBeVisible();
    await expect(skip).toHaveAttribute("href", "#main");
  });

  test("exposes Organization + LocalBusiness JSON-LD", async ({ page }) => {
    await page.goto("/");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length).toBeGreaterThanOrEqual(2);
    const joined = blocks.join("\n");
    expect(joined).toMatch(/"Organization"/);
    expect(joined).toMatch(/"Church"/);
    expect(joined).toMatch(/"PlaceOfWorship"/);
  });
});
