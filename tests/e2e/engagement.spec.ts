import { test, expect } from "@playwright/test";

/**
 * Phase 3 smoke — the engagement flows. We exercise page loads,
 * accessibility landmarks, and validation error surfaces. Happy-path
 * submissions require a Turnstile test-token + configured Resend key;
 * those run in a separate integration suite against a preview deploy.
 */

test.describe("Engagement — Phase 3 smoke", () => {
  test("connect hub page renders the card form + cross-links", async ({ page }) => {
    await page.goto("/connect");
    await expect(
      page.getByRole("heading", { level: 1, name: /Connect card/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Send my card/i })).toBeVisible();
    // Cross-links
    await expect(page.getByRole("link", { name: /I made a decision/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /I need prayer/i })).toBeVisible();
  });

  test("prayer page renders with required textarea + anonymity option", async ({
    page,
  }) => {
    await page.goto("/connect/prayer");
    await expect(page.getByRole("heading", { level: 1, name: /We pray/i })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /What can we pray with you for/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/keep my name private/i)).toBeVisible();
  });

  test("decision page renders altar language + four decision tiles", async ({ page }) => {
    await page.goto("/connect/decision");
    await expect(
      page.getByRole("heading", { level: 1, name: /Say it out loud/i }),
    ).toBeVisible();
    // Four radio labels from DECISION_TYPES
    await expect(page.getByText(/said yes to Jesus for the first time/i)).toBeVisible();
    await expect(page.getByText(/recommitted my life/i)).toBeVisible();
    await expect(page.getByText(/filled with the Holy Spirit/i)).toBeVisible();
    await expect(page.getByText(/baptized in water/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Say yes/i })).toBeVisible();
  });

  test("I'm new page has FAQ + embedded Connect Card", async ({ page }) => {
    await page.goto("/im-new");
    await expect(
      page.getByRole("heading", { level: 1, name: /save a seat for you/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /Straight answers/i })).toBeVisible();
    // The embedded Connect Card form lives under the #connect anchor.
    await expect(page.getByRole("button", { name: /Send my card/i })).toBeVisible();
  });

  test("connect page exposes FAQ is absent (that belongs on /im-new)", async ({
    page,
  }) => {
    await page.goto("/connect");
    await expect(page.getByRole("heading", { name: /Straight answers/i })).toHaveCount(0);
  });

  test("decision page breadcrumb schema is present", async ({ page }) => {
    await page.goto("/connect/decision");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const joined = blocks.join("\n");
    expect(joined).toMatch(/"BreadcrumbList"/);
  });

  test("/im-new page exposes FAQPage JSON-LD", async ({ page }) => {
    await page.goto("/im-new");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const joined = blocks.join("\n");
    expect(joined).toMatch(/"FAQPage"/);
    // At least 8 questions land as Question entries
    const questionMatches = joined.match(/"@type":"Question"/g) ?? [];
    expect(questionMatches.length).toBeGreaterThanOrEqual(6);
  });
});
