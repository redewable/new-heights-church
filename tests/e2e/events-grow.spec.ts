import { test, expect } from "@playwright/test";

/**
 * Phase 4b smoke — /events, /events/[slug], /grow + 5 sub-pages,
 * /connect/baby-dedication.
 */

test.describe("Events — Phase 4b smoke", () => {
  test("/events renders filter bar and list", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { level: 1, name: /^Events/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Everything$/ })).toBeVisible();
    // At least one fixture event
    await expect(page.getByText("New to New Heights").first()).toBeVisible();
  });

  test("/events?ministry=youth narrows results", async ({ page }) => {
    await page.goto("/events?ministry=youth");
    await expect(page.getByRole("link", { name: /^Youth Army$/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("/events/[slug] renders Event JSON-LD + platform-aware CTA", async ({ page }) => {
    await page.goto("/events/new-to-new-heights");
    await expect(
      page.getByRole("heading", { level: 1, name: /New to New Heights/i }),
    ).toBeVisible();

    // Planning Center CTA
    const cta = page.getByRole("link", { name: /Register on Church Center/i });
    await expect(cta).toHaveAttribute("href", /churchcenter\.com/);
    await expect(cta).toHaveAttribute("target", "_blank");

    // Event JSON-LD
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const joined = blocks.join("\n");
    expect(joined).toMatch(/"@type":"Event"/);
  });

  test("/events/[slug] links to ICS download", async ({ page }) => {
    await page.goto("/events/new-to-new-heights");
    const ics = page.getByRole("link", { name: /Add to calendar/i });
    await expect(ics).toHaveAttribute("href", "/events/new-to-new-heights/ics");
  });

  test("/events/[slug]/ics returns a VCALENDAR document", async ({ request }) => {
    const res = await request.get("/events/new-to-new-heights/ics");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/text\/calendar/);
    const body = await res.text();
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("UID:new-to-new-heights@newheightschurch.info");
  });

  test("conference event uses Brushfire CTA", async ({ page }) => {
    await page.goto("/events/activated-2026");
    const cta = page.getByRole("link", { name: /Register on Brushfire/i });
    await expect(cta).toHaveAttribute("href", /brushfire\.com/);
  });

  test("baby-dedication event routes to internal form", async ({ page }) => {
    await page.goto("/events/baby-dedications-may-10");
    const cta = page.getByRole("link", { name: /Register here/i });
    await expect(cta).toHaveAttribute("href", "/connect/baby-dedication");
  });
});

test.describe("Grow — Phase 4b smoke", () => {
  test("/grow hub lists the seven rooms", async ({ page }) => {
    await page.goto("/grow");
    await expect(page.getByRole("heading", { level: 1, name: /^Grow/i })).toBeVisible();
    // Check for a few of the room names
    await expect(page.getByText("Baptized in water")).toBeVisible();
    await expect(page.getByText("Planted — New to New Heights")).toBeVisible();
    await expect(page.getByText("Formed — Foundations of Faith")).toBeVisible();
  });

  test("/grow/life-groups deep-links to Church Center finder", async ({ page }) => {
    await page.goto("/grow/life-groups");
    const cta = page.getByRole("link", { name: /^Find a group$/ });
    await expect(cta).toHaveAttribute("href", /churchcenter\.com\/groups\/life-groups/);
  });

  test("/grow/foundation-faith deep-links to Foundations registration", async ({
    page,
  }) => {
    await page.goto("/grow/foundation-faith");
    const cta = page.getByRole("link", { name: /Register on Church Center/i });
    await expect(cta).toHaveAttribute("href", /registrations\/events\/3558344/);
  });

  test("/grow/membership deep-links to N2N registration", async ({ page }) => {
    await page.goto("/grow/membership");
    const cta = page.getByRole("link", { name: /Register on Church Center/i });
    await expect(cta).toHaveAttribute("href", /registrations\/events\/3584132/);
  });

  test("/grow/baptism renders registration form", async ({ page }) => {
    await page.goto("/grow/baptism");
    await expect(page.getByRole("heading", { level: 1, name: /Baptism/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Put me on the list/i })).toBeVisible();
  });

  test("/grow/volunteer renders serve path + application form", async ({ page }) => {
    await page.goto("/grow/volunteer");
    await expect(page.getByRole("heading", { level: 1, name: /^Serve/i })).toBeVisible();
    // Path chips
    await expect(page.getByText("New to New Heights").first()).toBeVisible();
    await expect(page.getByText("Foundations of Faith").first()).toBeVisible();
    // Apply button
    await expect(page.getByRole("button", { name: /Apply to serve/i })).toBeVisible();
  });

  test("/connect/baby-dedication renders the dedication form", async ({ page }) => {
    await page.goto("/connect/baby-dedication");
    await expect(
      page.getByRole("heading", { level: 1, name: /Consecrate the next/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Send our family/i })).toBeVisible();
  });
});
