import { test, expect } from "@playwright/test";

/**
 * Fetch-mock scenarios for EcosystemDetail:
 *   - Slow API responses (delay) must still surface the H1 and keep #main focusable.
 *   - HTTP 500 responses must not blank the page — user-visible content stays intact
 *     because the route data is static; any auxiliary fetches must degrade gracefully.
 *   - Timeout / abort simulations must recover and return focus to #main-content.
 *
 * These tests exercise defensive rendering: EcosystemDetail is not supposed to depend
 * on network fetches, so any Supabase/analytics call failing must NOT break the page.
 */
const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const ITEM_PATH =
  "/ecosistema/saude-mental/psicologia-clinica-social-e-organizacional";

test.describe("EcosystemDetail — network resilience", () => {
  test("survives 500 responses from backend endpoints", async ({ page }) => {
    await page.route(/supabase\.co\/(rest|functions|auth)\//, (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      }),
    );

    await page.goto(BASE_URL + ITEM_PATH, { waitUntil: "domcontentloaded" });
    // Core content must render even if auxiliary APIs return 500.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#main-content")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  test("survives timed-out / aborted backend calls", async ({ page }) => {
    await page.route(/supabase\.co\//, (route) => route.abort("timedout"));

    await page.goto(BASE_URL + ITEM_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 15_000,
    });

    // Focus must be manageable — return it to #main-content and confirm.
    await page.evaluate(() => {
      const el = document.getElementById("main-content");
      (el as HTMLElement | null)?.focus();
    });
    const focusedId = await page.evaluate(
      () => document.activeElement?.id ?? "",
    );
    expect(focusedId).toBe("main-content");
  });

  test("delayed backend responses do not block heading render", async ({
    page,
  }) => {
    await page.route(/supabase\.co\//, async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      });
    });

    const start = Date.now();
    await page.goto(BASE_URL + ITEM_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 5_000,
    });
    // Heading should appear well before the mocked 3s delay resolves.
    expect(Date.now() - start).toBeLessThan(5_000);
  });

  test("404 fallback stays accessible when backend is failing", async ({
    page,
  }) => {
    await page.route(/supabase\.co\//, (route) =>
      route.fulfill({ status: 500, body: "boom" }),
    );

    await page.goto(BASE_URL + "/ecosistema/saude-mental/__missing__");
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveAttribute("aria-live", "polite");
    await expect(
      page.getByRole("link", { name: /Ver todos os serviços/i }),
    ).toBeVisible();
  });
});
