import { test, expect } from "@playwright/test";

/**
 * Phase 6a smoke — legal pages, cookie consent banner, legacy redirects.
 */

test.describe("Legal pages — Phase 6a smoke", () => {
  test("/legal/privacy renders policy content", async ({ page }) => {
    await page.goto("/legal/privacy");
    await expect(
      page.getByRole("heading", { level: 1, name: /Privacy Policy/i }),
    ).toBeVisible();
    await expect(page.getByText(/Last updated/i)).toBeVisible();
  });

  test("/legal/terms renders terms content", async ({ page }) => {
    await page.goto("/legal/terms");
    await expect(
      page.getByRole("heading", { level: 1, name: /Terms of Use/i }),
    ).toBeVisible();
  });

  test("/legal/child-protection renders child-protection commitment", async ({
    page,
  }) => {
    await page.goto("/legal/child-protection");
    await expect(
      page.getByRole("heading", { level: 1, name: /Child Protection Statement/i }),
    ).toBeVisible();
    await expect(page.getByText(/zero tolerance/i)).toBeVisible();
  });
});

test.describe("Consent banner — Phase 6a smoke", () => {
  test("shows on first visit and dismisses after Accept", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("dialog", { name: /Cookie consent/i });
    await expect(banner).toBeVisible();
    await page.getByRole("button", { name: /^Accept$/ }).click();
    await expect(banner).not.toBeVisible();
  });

  test("dismisses after Only essential + persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Only essential/i }).click();
    const banner = page.getByRole("dialog", { name: /Cookie consent/i });
    await expect(banner).not.toBeVisible();
    await page.reload();
    await expect(banner).not.toBeVisible();
  });
});

test.describe("Legacy redirects — Phase 6a smoke", () => {
  test("/sermons-main 301-redirects to /sermons", async ({ request }) => {
    const res = await request.get("/sermons-main", { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/sermons$/);
  });

  test("/giving 301-redirects to /give", async ({ request }) => {
    const res = await request.get("/giving", { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/give$/);
  });

  test("/riseupandbuild 301-redirects to /rise-up-and-build", async ({ request }) => {
    const res = await request.get("/riseupandbuild", { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/rise-up-and-build$/);
  });
});
