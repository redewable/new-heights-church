import { test, expect } from "@playwright/test";

/**
 * Phase 5a smoke — /about/*, /kids (Young Lions), /youth (Youth Army),
 * /podcasts, /resources.
 */

test.describe("About wing — Phase 5a smoke", () => {
  test("/about hub lists four rooms", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { level: 1, name: /Who we are/i }),
    ).toBeVisible();
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: /What we believe/i })).toBeVisible();
    await expect(main.getByRole("link", { name: /Our leadership/i })).toBeVisible();
    await expect(
      main.getByRole("link", { name: /^Brian Hallam Ministries/i }),
    ).toBeVisible();
    await expect(main.getByRole("link", { name: /Plan a visit/i })).toBeVisible();
  });

  test("/about/beliefs carries the values and the convictions", async ({ page }) => {
    await page.goto("/about/beliefs");
    await expect(
      page.getByRole("heading", { level: 1, name: /What we believe/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /What this house holds/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Straight from the Bible/i }),
    ).toBeVisible();
  });

  test("/about/leadership names the Hallams", async ({ page }) => {
    await page.goto("/about/leadership");
    await expect(
      page.getByRole("heading", { level: 1, name: /^Leadership/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Apostle Brian Hallam", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Pastor Crystal Hallam", exact: true }),
    ).toBeVisible();
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
  test("/podcasts presents The Brian Hallam Podcast with its platforms and JSON-LD", async ({
    page,
  }) => {
    await page.goto("/podcasts");
    await expect(
      page.getByRole("heading", { level: 1, name: /^Podcasts/i }),
    ).toBeVisible();
    // The one show on the hub (the Sunday word lives on /sermons and /watch).
    await expect(
      page.getByRole("heading", { level: 2, name: /Brian Hallam Podcast/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /New Heights Sermons/i })).toHaveCount(
      0,
    );
    // Confirmed platform links carry their marks and real destinations.
    await expect(page.getByRole("link", { name: /^Apple Podcasts$/ })).toHaveAttribute(
      "href",
      /podcasts\.apple\.com\/.*id1604967894/,
    );
    await expect(page.getByRole("link", { name: /^Spotify$/ })).toHaveAttribute(
      "href",
      /open\.spotify\.com\/show\/7cYqeHSZDg5Dg0orFyHc5a/,
    );
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
    const bhm = page
      .getByRole("main")
      .locator('a[href="https://brianhallam.com"]')
      .first();
    await expect(bhm).toBeVisible();
  });
});

test.describe("Brian Hallam Ministries — About wing", () => {
  test("/about/brian-hallam-ministries gathers the ministry's links", async ({
    page,
  }) => {
    await page.goto("/about/brian-hallam-ministries");
    await expect(
      page.getByRole("heading", { level: 1, name: /Brian Hallam Ministries/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^brianhallam\.com/ }).first(),
    ).toHaveAttribute("href", /brianhallam\.com/);
    await expect(page.getByRole("link", { name: /^Apple Podcasts$/ })).toHaveAttribute(
      "href",
      /id1604967894/,
    );
    await expect(page.getByRole("link", { name: /^Facebook$/ })).toHaveAttribute(
      "href",
      /facebook\.com\/pastorbrianhallam/,
    );
  });

  test("the About menu opens to the ministry page", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop menu only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: /^About/ }).click();
    const item = nav.getByRole("link", { name: /^Brian Hallam Ministries/ });
    await expect(item).toBeVisible();
    await item.click();
    await expect(page).toHaveURL(/\/about\/brian-hallam-ministries$/);
  });

  test("/about/leadership names the ministry team with their offices", async ({
    page,
  }) => {
    await page.goto("/about/leadership");
    await expect(page.getByText("Prophet Larry Hallam")).toBeVisible();
    await expect(page.getByText("Pastor Sherdonna Bragg")).toBeVisible();
    await expect(page.getByText("Teacher Lacresha")).toBeVisible();
  });
});
