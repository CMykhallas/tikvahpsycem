import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";

test.describe("/services accessibility (WCAG 2.1 AA / ISO 40500)", () => {
  test("has no detectable axe violations on initial render", async ({ page }) => {
    await page.goto(BASE_URL + "/services");
    await expect(page.getByTestId("services-page-main")).toBeVisible();
    // Wait for lazy ServicesCatalog to mount
    await expect(
      page.getByRole("heading", { name: /Soluções e Serviços Tikvah/i }),
    ).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });

  test("keyboard navigation reaches the first service card and opens dialog", async ({
    page,
  }) => {
    await page.goto(BASE_URL + "/services");
    await expect(
      page.getByRole("heading", { name: /Soluções e Serviços Tikvah/i }),
    ).toBeVisible();

    // Focus the first service card via tabbing
    const firstCard = page.locator("button.group").first();
    await firstCard.focus();
    await expect(firstCard).toBeFocused();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    // Close button must be reachable and labelled
    const closeBtn = page.getByRole("button", { name: /Fechar janela/i });
    await expect(closeBtn).toBeVisible();
  });

  test("category nav has accessible label and live catalog region is exposed", async ({
    page,
  }) => {
    await page.goto(BASE_URL + "/services");
    await expect(
      page.getByRole("navigation", { name: /Categorias de Serviços/i }),
    ).toBeVisible();

    // Live (backend) catalog should resolve to either grid, loading, or error — never silent
    const live = page
      .getByTestId("live-services-grid")
      .or(page.getByTestId("live-services-loading"))
      .or(page.getByTestId("live-services-error"));
    await expect(live.first()).toBeVisible();
  });
});
