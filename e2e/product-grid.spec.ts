import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const product = {
  id: "test-product",
  name: "Consulta de teste",
  slug: "consulta-de-teste",
  description: "Consulta de psicologia",
  location: "Maputo",
  price: 1500,
  price_after_discount: 1500,
  discount_percentage: 0,
  currency: "MZN",
};

test("the shop renders products after a successful query", async ({ page }) => {
  await page.route("**/rest/v1/products?*", (route) => route.fulfill({ json: [product] }));
  await page.goto(BASE_URL + "/loja");
  await expect(page.getByRole("heading", { name: product.name })).toBeVisible();
  await expect(page.getByText("Nenhum produto encontrado nesta categoria.")).toHaveCount(0);
});

test("an empty successful query retains the empty category message", async ({ page }) => {
  await page.route("**/rest/v1/products?*", (route) => route.fulfill({ json: [] }));
  await page.goto(BASE_URL + "/loja");
  await expect(page.getByText("Nenhum produto encontrado nesta categoria.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Não foi possível carregar os produtos" })).toHaveCount(0);
});

test("a failed query shows a safe alert and retry recovers the catalog", async ({ page }) => {
  let failing = true;
  await page.route("**/rest/v1/products?*", (route) => route.fulfill({
    status: failing ? 400 : 200,
    json: failing ? { code: "42703", message: "column products.active does not exist" } : [product],
  }));
  await page.goto(BASE_URL + "/loja");
  const alert = page.getByRole("alert").filter({ hasText: "Não foi possível carregar os produtos" });
  await expect(alert).toBeVisible();
  await expect(page.getByText("column products.active does not exist")).toHaveCount(0);
  await expect(page.getByText("Nenhum produto encontrado nesta categoria.")).toHaveCount(0);
  failing = false;
  await alert.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("heading", { name: product.name })).toBeVisible();
  await expect(alert).toHaveCount(0);
});
