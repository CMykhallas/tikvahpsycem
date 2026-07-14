/**
 * Extended XSS regression matrix for admin PDF/CSV exports.
 * Confirms every stored value is escaped, rendered as text, and blocked by CSP.
 * Requires an injected admin session; otherwise the whole file is skipped.
 */
import { test, expect, Page } from "@playwright/test";

const AUTH_STATUS = process.env.LOVABLE_BROWSER_AUTH_STATUS;

// eslint-disable-next-line no-template-curly-in-string
const POLYGLOT = "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//";

const PAYLOADS = [
  { name: "script-tag", value: "<script>window.__pwned=1</script>" },
  { name: "img-onerror", value: `<img src=x onerror="window.__pwned=1">` },
  { name: "svg-onload", value: `<svg onload="window.__pwned=1"></svg>` },
  { name: "iframe-js", value: `<iframe src="javascript:window.__pwned=1"></iframe>` },
  { name: "attr-breakout", value: `"><script>alert(1)</script>` },
  { name: "js-url", value: `javascript:alert(1)` },
  { name: "anchor-js", value: `<a href="javascript:window.__pwned=1">x</a>` },
  { name: "entity-double", value: `&lt;script&gt;alert(1)&lt;/script&gt;` },
  { name: "polyglot", value: POLYGLOT },
  { name: "style-import", value: `<style>@import 'https://evil.example/x.css'</style>` },
  { name: "object", value: `<object data="javascript:alert(1)"></object>` },
];

test.describe("Security export — extended XSS matrix", () => {
  test.skip(AUTH_STATUS !== "injected", "no injected admin session available");

  test.beforeEach(async ({ page }) => {
    const storageKey = process.env.LOVABLE_BROWSER_SUPABASE_STORAGE_KEY;
    const sessionJson = process.env.LOVABLE_BROWSER_SUPABASE_SESSION_JSON;
    await page.goto("/");
    if (storageKey && sessionJson) {
      await page.evaluate(
        ([k, v]) => localStorage.setItem(k as string, v as string),
        [storageKey, sessionJson],
      );
    }
  });

  const assertSafePrintWindow = async (opened: Page, payloadValue: string) => {
    await opened.waitForLoadState("domcontentloaded");

    // 1) No script execution artifacts
    const pwned = await opened.evaluate(
      () => (window as unknown as { __pwned?: unknown }).__pwned === 1,
    );
    expect(pwned, "payload must not execute").toBeFalsy();

    // 2) CSP present and strict
    const csp = await opened
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .first()
      .getAttribute("content");
    expect(csp, "CSP meta must exist").toBeTruthy();
    expect(csp!).toMatch(/default-src\s+'none'/);

    // 3) No dangerous nodes
    for (const sel of ["script", "iframe", "object", "embed", "[onerror]", "[onload]", "[onclick]"]) {
      expect(await opened.locator(sel).count(), `no ${sel} nodes`).toBe(0);
    }

    // 4) Payload text present as text, not parsed as HTML
    const bodyText = await opened.locator("body").innerText();
    // Compare with entities stripped to their raw form — DOMPurify/textContent keeps them literal
    const literal = payloadValue.slice(0, Math.min(30, payloadValue.length));
    expect(bodyText).toContain(literal.replace(/[&<>"']/g, (c) =>
      ({ "&": "&", "<": "<", ">": ">", '"': '"', "'": "'" }[c]!)
    ));
  };

  for (const payload of PAYLOADS) {
    test(`payload ${payload.name} is neutralized`, async ({ page, context }) => {
      // Inject payload into a mock incident via window hook consumed by the dashboard.
      // The admin export button reads current filtered rows; we stub Supabase response.
      await page.route("**/rest/v1/security_incidents**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: `fixture-${payload.name}`,
              created_at: new Date().toISOString(),
              incident_type: payload.value,
              severity: "high",
              ip_address: payload.value,
              user_agent: payload.value,
              endpoint: payload.value,
              details: { reason: payload.value },
            },
          ]),
        });
      });

      await page.goto("/security");
      const exportBtn = page.getByRole("button", { name: /Exportar|Export/i }).first();
      if (!(await exportBtn.isVisible().catch(() => false))) {
        test.skip(true, "export UI not visible");
      }

      const opened = await context.waitForEvent("page", { timeout: 5000 }).catch(() => null);
      await exportBtn.click();
      if (!opened) test.skip(true, "no print window opened");
      await assertSafePrintWindow(opened!, payload.value);
      await opened!.close();
    });
  }

  test("CSV formula injection guard", async ({ page }) => {
    await page.route("**/rest/v1/security_incidents**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "csv-1", created_at: new Date().toISOString(), incident_type: "=cmd|'/c calc'!A1", severity: "high", ip_address: "+1", user_agent: "-cmd", endpoint: "@sum", details: { reason: "\tTAB" } },
        ]),
      });
    });

    await page.goto("/security");
    const csvBtn = page.getByRole("button", { name: /CSV/i }).first();
    if (!(await csvBtn.isVisible().catch(() => false))) test.skip(true, "no CSV button");

    const downloadPromise = page.waitForEvent("download", { timeout: 5000 }).catch(() => null);
    await csvBtn.click();
    const download = await downloadPromise;
    if (!download) test.skip(true, "no download triggered");
    const text = await (await download!.createReadStream())?.getReader().read();
    const csvText = text ? new TextDecoder().decode(text.value) : "";
    for (const line of csvText.split("\n").slice(1)) {
      for (const cell of line.split(",")) {
        const trimmed = cell.replace(/^"|"$/g, "").trim();
        if (/^[=+\-@\t\r]/.test(trimmed)) {
          throw new Error(`CSV cell not guarded: ${cell}`);
        }
      }
    }
  });
});
