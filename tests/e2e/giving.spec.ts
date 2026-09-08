import { test, expect } from "@playwright/test";

/**
 * Phase 4a smoke — /give, /give/statement, /rise-up-and-build.
 */

test.describe("Give — Phase 4a smoke", () => {
  test("/give renders all five methods with correct CTA targets", async ({ page }) => {
    await page.goto("/give");
    await expect(
      page.getByRole("heading", { level: 1, name: /Generosity is/i }),
    ).toBeVisible();

    // Five numeral markers in the method rows.
    await expect(page.getByText(/^Online$/)).toBeVisible();
    await expect(page.getByText(/^Crypto$/)).toBeVisible();
    await expect(page.getByText(/^Stock & securities$/)).toBeVisible();
    await expect(page.getByText(/^Check by mail$/)).toBeVisible();
    await expect(page.getByText(/^In person$/)).toBeVisible();

    // Pushpay CTA opens pushpay.com (external)
    const pushpay = page.getByRole("link", { name: /Give through Pushpay/i }).first();
    await expect(pushpay).toHaveAttribute("href", /pushpay\.com/);
    await expect(pushpay).toHaveAttribute("target", "_blank");

    // Engiven CTA
    await expect(
      page.getByRole("link", { name: /Give through Engiven/i }),
    ).toHaveAttribute("href", /engiven\.com/);

    // Securities PDF downloads from our origin
    await expect(
      page.getByRole("link", { name: /Download delivery form/i }),
    ).toHaveAttribute("href", "/docs/nhc-securities-contribution.pdf");
  });

  test("/give exposes FAQPage JSON-LD", async ({ page }) => {
    await page.goto("/give");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const joined = blocks.join("\n");
    expect(joined).toMatch(/"FAQPage"/);
  });

  test("/give/statement renders request form", async ({ page }) => {
    await page.goto("/give/statement");
    await expect(
      page.getByRole("heading", { level: 1, name: /Consolidated/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Request my statement/i }),
    ).toBeVisible();
    // Tax-year selector exists
    await expect(page.getByLabel(/Tax year/i)).toBeVisible();
  });
});

test.describe("Rise Up — Phase 4a smoke", () => {
  test("/rise-up-and-build renders hero, progress meter, pledge form, FAQ", async ({
    page,
  }) => {
    await page.goto("/rise-up-and-build");

    await expect(page.getByRole("heading", { level: 1, name: /Rise up/i })).toBeVisible();

    // Progress bar is present and labelled
    await expect(
      page.getByRole("progressbar", { name: /Rise Up and Build progress/i }),
    ).toBeVisible();

    // Pledge form + "Send my pledge" submit
    await expect(page.getByRole("button", { name: /Send my pledge/i })).toBeVisible();

    // Vision band
    await expect(
      page.getByRole("heading", { name: /We are not building for us/i }),
    ).toBeVisible();

    // FAQ
    await expect(page.getByRole("heading", { name: /Before you pledge/i })).toBeVisible();
  });
});
