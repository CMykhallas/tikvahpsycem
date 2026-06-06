import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";

test.describe("Protected routes & auth flow integration", () => {
  test("anonymous /administration redirects to /auth preserving state.from", async ({ page }) => {
    await page.goto(BASE_URL + "/administration");
    await expect(page).toHaveURL(/\/auth$/);

    // Auth screen must be rendered with both tabs visible
    await expect(page.getByRole("tab", { name: /Entrar/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Registar/i })).toBeVisible();

    // After login redirect target is encoded in router location state — we assert
    // by reading the React Router state via the history API
    const fromState = await page.evaluate(() => {
      const s = (window.history.state && (window.history.state as any).usr) || null;
      return s?.from ?? null;
    });
    expect(fromState).toBe("/administration");
  });

  test("anonymous /security redirects to /auth", async ({ page }) => {
    await page.goto(BASE_URL + "/security");
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole("heading", { name: /Área Administrativa/i })).toBeVisible();
  });

  test("login form validates email and password client-side", async ({ page }) => {
    await page.goto(BASE_URL + "/auth");

    // Empty submit — browser blocks via required, so test invalid email
    await page.getByLabel("Email", { exact: false }).first().fill("not-an-email");
    await page.getByLabel("Palavra-passe", { exact: false }).first().fill("123");
    await page.getByRole("button", { name: /^Entrar$/ }).click();

    await expect(
      page.getByText(/email válido|palavra-passe deve ter/i).first(),
    ).toBeVisible();
  });

  test("/auth is publicly accessible and renders without auth", async ({ page }) => {
    await page.goto(BASE_URL + "/auth");
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole("heading", { name: /Área Administrativa/i })).toBeVisible();
  });
});
