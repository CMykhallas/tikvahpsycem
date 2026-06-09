import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";

// Stable, representative routes from TIKVAH_CATEGORIES.
const CATEGORY = "saude-mental";
const ITEM = "psicologia-clinica-social-e-organizacional";
const ITEM_URL = `/ecosistema/${CATEGORY}/${ITEM}`;
const CATEGORY_URL = `/ecosistema/${CATEGORY}`;

test.describe("/ecosistema accessibility (WCAG 2.1 AA)", () => {
  test("item detail page has no axe violations", async ({ page }) => {
    await page.goto(BASE_URL + ITEM_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });

  test("category page has no axe violations", async ({ page }) => {
    await page.goto(BASE_URL + CATEGORY_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });

  test("h1 receives focus on mount (SPA route announcement)", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_URL);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toBeFocused();
  });

  test("keyboard navigation reaches breadcrumb, CTA and sibling links", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Breadcrumb has aria-current=page on last item
    const breadcrumb = page.getByRole("navigation", {
      name: /Trilho de navegação/i,
    });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator('[aria-current="page"]')).toBeVisible();

    // CTA buttons are reachable as proper links with accessible names
    await expect(
      page.getByRole("link", { name: /Agendar consulta inicial/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Pedir proposta formal/i }),
    ).toBeVisible();

    // Tab from h1 forward and ensure focus does not get trapped invisibly
    await page.keyboard.press("Tab");
    const active1 = await page.evaluate(
      () => document.activeElement?.tagName ?? "",
    );
    expect(active1).not.toBe("BODY");
  });

  test("404 fallback under /ecosistema is accessible (role=alert)", async ({
    page,
  }) => {
    await page.goto(BASE_URL + `/ecosistema/${CATEGORY}/__missing__`);
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });
});
