import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const CATEGORY = "saude-mental";
const ITEM = "psicologia-clinica-social-e-organizacional";
const ITEM_URL = `/ecosistema/${CATEGORY}/${ITEM}`;

test.describe("/ecosistema loading & focus behavior", () => {
  test("main landmark is present and h1 receives focus after mount", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_URL);

    // Main landmark exists and is programmatically focusable
    const main = page.locator("#main-content");
    await expect(main).toHaveAttribute("tabindex", "-1");

    // H1 visible and focused (SPA route announcement for SR/keyboard users)
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toBeFocused();
  });

  test("404 fallback announces via role=alert and aria-live", async ({
    page,
  }) => {
    await page.goto(BASE_URL + `/ecosistema/${CATEGORY}/__does-not-exist__`);
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveAttribute("aria-live", "polite");

    // Recovery links remain keyboard-accessible
    await expect(
      page.getByRole("link", { name: /Ver todos os serviços/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Página inicial/i }),
    ).toBeVisible();
  });

  test("keyboard focus is not trapped and reaches first interactive element", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Tab from h1; focus must move to a visible interactive element
    await page.keyboard.press("Tab");
    const tag = await page.evaluate(
      () => document.activeElement?.tagName ?? "",
    );
    expect(["A", "BUTTON", "INPUT"]).toContain(tag);
  });

  test("renders fully under simulated slow network without layout crash", async ({
    page,
  }) => {
    const client = await page.context().newCDPSession(page);
    await client.send("Network.enable");
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 400,
      downloadThroughput: (200 * 1024) / 8,
      uploadThroughput: (200 * 1024) / 8,
    });

    await page.goto(BASE_URL + ITEM_URL, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#main-content")).toBeVisible();
  });
});
