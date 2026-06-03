import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";

test.describe("/services flow", () => {
  test("navigates via Navbar \"Serviços\" and renders catalog + Consultoria", async ({ page }) => {
    await page.goto(BASE_URL + "/");

    // Click "Serviços" in navbar (desktop link)
    await page.getByRole("link", { name: "Serviços", exact: true }).first().click();

    await expect(page).toHaveURL(/\/services$/);

    // Loading state may flash; final UI must show catalog
    const main = page.getByTestId("services-page-main");
    await expect(main).toBeVisible();

    // Catalog: at least one category tab and one service card
    await expect(page.getByRole("heading", { name: /Soluções e Serviços Tikvah/i })).toBeVisible();
    await expect(page.getByRole("navigation", { name: /Categorias de Serviços/i })).toBeVisible();

    // Consultoria category tab should be reachable
    const consultoriaTab = page.getByRole("button", { name: /Consultoria/i }).first();
    await expect(consultoriaTab).toBeVisible();
    await consultoriaTab.click();

    // After selecting Consultoria, at least one service card must render
    const cards = page.locator("button.group");
    await expect(cards.first()).toBeVisible();

    // Model 360 section
    await expect(page.getByRole("heading", { name: /Modelo de Intervenção 360/i })).toBeVisible();
  });

  test("Hero CTA \"Nossos Serviços\" navigates to /services", async ({ page }) => {
    await page.goto(BASE_URL + "/");
    await page.getByRole("link", { name: /Nossos Serviços/i }).first().click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByTestId("services-page-main")).toBeVisible();
  });
});
