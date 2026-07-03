import { test, expect } from "@playwright/test";

/**
 * Visual regression tests for EcosystemDetail.
 *
 * Guards against unintended layout/style regressions across versions for:
 *   - Category page (list layout)
 *   - Item detail page (hero + content)
 *   - 404 accessible error fallback
 *
 * Baselines live under e2e/ecosystem.visual.spec.ts-snapshots/.
 * Update intentionally with:  bunx playwright test e2e/ecosystem.visual.spec.ts --update-snapshots
 */
const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const CATEGORY = "saude-mental";
const ITEM = "psicologia-clinica-social-e-organizacional";

// Disable animations for deterministic pixel comparisons.
test.beforeEach(async ({ page }) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `,
  });
});

test.describe("EcosystemDetail — visual regression", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("category page layout", async ({ page }) => {
    await page.goto(`${BASE_URL}/ecosistema/${CATEGORY}`, {
      waitUntil: "networkidle",
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Wait for fonts + async content to stabilize before snapshot.
    await page.evaluate(() => (document as any).fonts?.ready);
    await expect(page).toHaveScreenshot("category-saude-mental.png", {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("item detail layout", async ({ page }) => {
    await page.goto(`${BASE_URL}/ecosistema/${CATEGORY}/${ITEM}`, {
      waitUntil: "networkidle",
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => (document as any).fonts?.ready);
    await expect(page).toHaveScreenshot("item-detail.png", {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("404 error fallback layout", async ({ page }) => {
    await page.goto(`${BASE_URL}/ecosistema/${CATEGORY}/__missing__`, {
      waitUntil: "networkidle",
    });
    await expect(page.getByRole("alert")).toBeVisible();
    await page.evaluate(() => (document as any).fonts?.ready);
    await expect(page.getByRole("alert")).toHaveScreenshot(
      "not-found-alert.png",
      { maxDiffPixelRatio: 0.02 },
    );
  });
});
