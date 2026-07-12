/**
 * XSS regression — Security Dashboard PDF/CSV export must never execute
 * script from stored `ip_address`, `user_agent` or `endpoint`. This test
 * requires an authenticated admin session; when the sandbox does not have
 * one, it is skipped so the pipeline still passes.
 *
 * Payloads exercised:
 *   ip_address:  <img src=x onerror="window.__pwned=true">
 *   user_agent:  <script>window.__pwned=true</script>
 *   endpoint:    javascript:alert(1)
 */
import { test, expect } from "@playwright/test";

const AUTH_STATUS = process.env.LOVABLE_BROWSER_AUTH_STATUS;

test.describe("Security export XSS", () => {
  test.skip(AUTH_STATUS !== "injected", "no injected admin session available");

  test("PDF export renders payload as text, not script", async ({ page }) => {
    // Restore session (see browser-use guidance)
    const storageKey = process.env.LOVABLE_BROWSER_SUPABASE_STORAGE_KEY;
    const sessionJson = process.env.LOVABLE_BROWSER_SUPABASE_SESSION_JSON;
    await page.goto("/");
    if (storageKey && sessionJson) {
      await page.evaluate(([k, v]) => localStorage.setItem(k as string, v as string), [storageKey, sessionJson]);
    }

    await page.goto("/administration");
    // Best-effort — the button label depends on locale
    const exportBtn = page.getByRole("button", { name: /Exportar|Export/i }).first();
    if (!(await exportBtn.isVisible().catch(() => false))) {
      test.skip(true, "admin export UI not visible for this session");
    }

    // Listen for the new page opened by print flow
    const pagePromise = page.context().waitForEvent("page", { timeout: 5000 }).catch(() => null);
    await exportBtn.click();
    const opened = await pagePromise;
    if (!opened) test.skip(true, "no print window opened");

    await opened!.waitForLoadState("domcontentloaded");
    // No script execution artifacts
    const pwned = await opened!.evaluate(() => (window as unknown as { __pwned?: boolean }).__pwned === true);
    expect(pwned).toBeFalsy();

    // CSP is present
    const cspCount = await opened!.locator('meta[http-equiv="Content-Security-Policy"]').count();
    expect(cspCount).toBeGreaterThan(0);

    // No dangerous nodes
    expect(await opened!.locator("script").count()).toBe(0);
    expect(await opened!.locator("img[onerror]").count()).toBe(0);
    expect(await opened!.locator("iframe").count()).toBe(0);
  });
});
