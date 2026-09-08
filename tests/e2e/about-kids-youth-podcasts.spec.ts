import { test, expect } from "@playwright/test";

/**
 * Phase 5a smoke — /about/*, /kids (Young Lions), /youth (Youth Army),
 * /podcasts, /resources.
 */

test.describe("About wing — Phase 5a smoke", () => {
  test("/about hub lists three rooms", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { level: 1, name: /Who we are/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /What we believe/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Our leadership/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Plan a visit/i })).toBeVisible();
  });

  test("/about/beliefs renders MDX content", async ({ page }) => {
    await page.goto("/about/beliefs");
    await expect(
      page.getByRole("heading", { level: 1, name: /What we believe/i }),
    ).toBeVisible();
    // A few section headings from the MDX
    await expect(page.getByRole("heading", { name: /^The Word$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^The Son$/ })).toBeVisible();
  });

  test("/about/leadership names the Hallams", async ({ page }) => {
    await page.goto("/about/leadership");
    await expect(
      page.getByRole("heading", { level: 1, name: /^Leadership/i }),
    ).toBeVisible();
    await expect(page.getByText("Apostle Brian Hallam")).toBeVisible();
    await expect(page.getByText("Crystal Hallam")).toBeVisible();
  });

  test("/about/visit has service times + directions CTA", async ({ page }) => {
    await page.goto("/about/visit");
    await expect(
      page.getByRole("heading", { level: 1, name: /look for you/i }),
    ).toBeVisible();
    const directions = page.getByRole("link", { name: /^Get directions$/ }).first();
    await expect(directions).toHaveAttribute("href", /google\.com\/maps/);
  });
});

test.describe("Young Lions + Youth Army — Phase 5a smoke", () => {
  test("/kids uses Young Lions name + child protection statement", async ({ page }) => {
    await page.goto("/kids");
    await expect(
      page.getByRole("heading", { level: 1, name: /Young Lions/i }),
    ).toBeVisible();
    await expect(page.getByText(/Child protection statement/i)).toBeVisible();
    // Three age rooms
    await expect(page.getByRole("heading", { name: /^Nursery$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Preschool$/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Elementary$/ })).toBeVisible();
  });

  test("/youth uses Youth Army name + links to camp event + raffle", async ({ page }) => {
    await page.goto("/youth");
    await expect(
      page.getByRole("heading", { level: 1, name: /Youth Army/i }),
    ).toBeVisible();
    // Camp registration CTA
    const campCta = page
      .getByRole("link", { name: /Register on Church Center/i })
      .first();
    await expect(campCta).toHaveAttribute("href", /registrations\/events\/3478925/);
    // Raffle link
    const raffle = page.getByRole("link", { name: /Enter the raffle/i });
    await expect(raffle).toHaveAttribute(
      "href",
      /newheightschurch\.info\/new-heights-youth-raffle/,
    );
  });
});

test.describe("Podcasts + Resources — Phase 5a smoke", () => {
  test("/podcasts lists both shows with PodcastSeries JSON-LD", async ({ page }) => {
    await page.goto("/podcasts");
    await expect(
      page.getByRole("heading", { level: 1, name: /^Podcasts/i }),
    ).toBeVisible();
    // Both show headings (h2 inside sections)
    await expect(
      page.getByRole("heading", { name: /New Heights Sermons/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Brian Hallam Podcast/i }),
    ).toBeVisible();
    // JSON-LD
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.join("\n")).toMatch(/"PodcastSeries"/);
  });

  test("/resources surfaces the Brian Hallam Ministries partner card", async ({
    page,
  }) => {
    await page.goto("/resources");
    await expect(
      page.getByRole("heading", { level: 1, name: /^Resources/i }),
    ).toBeVisible();
    const bhm = page.getByRole("link", { name: /Brian Hallam Ministries/i });
    await expect(bhm).toHaveAttribute("href", /brianhallam\.com/);
  });
});
