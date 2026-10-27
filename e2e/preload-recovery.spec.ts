import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const RELOAD_KEY = "tikvah:preload-reloaded";
const fallbackTitle = "Não foi possível apresentar esta página";

test("a missing route chunk reloads once, then reaches the ErrorBoundary", async ({ page }) => {
  let attempts = 0;
  await page.route("**/assets/About-*.js", async (route) => {
    attempts += 1;
    await route.fulfill({ status: 404, contentType: "text/javascript", body: "" });
  });
  await page.goto(BASE_URL + "/about");
  await expect(page.getByRole("heading", { name: fallbackTitle })).toBeVisible();
  expect(attempts).toBe(2);
  expect(await page.evaluate((key) => sessionStorage.getItem(key), RELOAD_KEY)).toBe("1");
});

test("a successful route render clears the reload flag", async ({ page }) => {
  let attempts = 0;
  await page.route("**/assets/About-*.js", async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({ status: 404, contentType: "text/javascript", body: "" });
    } else {
      await route.continue();
    }
  });
  await page.goto(BASE_URL + "/about");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Sobre/i);
  expect(attempts).toBe(2);
  await expect.poll(() => page.evaluate((key) => sessionStorage.getItem(key), RELOAD_KEY)).toBeNull();
});

test("unavailable sessionStorage leaves chunk failures to the ErrorBoundary", async ({ page }) => {
  let attempts = 0;
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() { throw new Error("Storage unavailable"); },
    });
  });
  await page.route("**/assets/About-*.js", async (route) => {
    attempts += 1;
    await route.fulfill({ status: 404, contentType: "text/javascript", body: "" });
  });
  await page.goto(BASE_URL + "/about");
  await expect(page.getByRole("heading", { name: fallbackTitle })).toBeVisible();
  expect(attempts).toBe(1);
});

test("a recovered document does not reload again for a later chunk failure", async ({ page }) => {
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), RELOAD_KEY);
  await page.goto(BASE_URL + "/about");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Sobre/i);
  await expect.poll(() => page.evaluate((key) => sessionStorage.getItem(key), RELOAD_KEY)).toBeNull();
  let attempts = 0;
  await page.route("**/assets/Loja-*.js", async (route) => {
    attempts += 1;
    await route.fulfill({ status: 404, contentType: "text/javascript", body: "" });
  });
  await page.evaluate(() => {
    history.pushState(null, "", "/loja");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: fallbackTitle })).toBeVisible();
  expect(attempts).toBe(1);
});
