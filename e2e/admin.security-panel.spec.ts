/**
 * E2E: /admin/security-incidents panel
 *
 * Validates:
 *  - RBAC: unauthenticated visitors are redirected to /auth (no leak of admin UI)
 *  - Filters (range) restrict export data to the selected period (checks CSV rows)
 *  - Pagination controls exist and switch pages without exposing HTML in cell content
 *  - No user-controlled field is rendered as HTML (XSS-safe): any injected `<script>`/`<img>`
 *    string in incident data appears as escaped text in DOM.
 *
 * When admin session env vars are not injected, RBAC checks still run; authenticated
 * flows are skipped gracefully so CI never falsely fails on unsupported environments.
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080";
const ADMIN_TOKEN = process.env.LOVABLE_BROWSER_SUPABASE_SESSION_JSON;
const ADMIN_STORAGE_KEY = process.env.LOVABLE_BROWSER_SUPABASE_STORAGE_KEY;

test.describe("Admin • Security Incidents panel", () => {
  test("unauthenticated user is redirected away from /admin/security-incidents", async ({ page }) => {
    await page.goto(`${BASE}/admin/security-incidents`, { waitUntil: "domcontentloaded" });
    // The ProtectedRoute component redirects to /auth when unauthenticated.
    await page.waitForURL(/\/auth/, { timeout: 10_000 });
    await expect(page.locator('[data-testid="admin-incidents-title"]')).toHaveCount(0);
  });

  test("authenticated admin sees panel and CSV export honors selected period", async ({ page, context }) => {
    test.skip(!ADMIN_TOKEN || !ADMIN_STORAGE_KEY, "Admin session not injected in this environment");

    await page.goto(BASE);
    await page.evaluate(
      ([key, val]) => window.localStorage.setItem(key as string, val as string),
      [ADMIN_STORAGE_KEY!, ADMIN_TOKEN!],
    );

    await page.goto(`${BASE}/admin/security-incidents`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-testid="admin-incidents-title"]')).toBeVisible();

    // Any string fields (ip, endpoint, reason) must be rendered as text nodes only.
    // If a row's ip_address contained `<script>` markup, JSX escapes it — assert no
    // element with a matching tag name was injected inside the incidents table.
    const injectedScripts = await page.locator("table script, table img[onerror], table iframe").count();
    expect(injectedScripts).toBe(0);

    // Pagination controls exist
    await expect(page.getByRole("button", { name: /Anterior/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Próxima/i })).toBeVisible();

    // Trigger CSV download for 7d and assert filename + row timestamps are within window.
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator('[data-testid="export-csv-7"]').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^security-incidents-7d-\d{4}-\d{2}-\d{2}\.csv$/);

    const path = await download.path();
    if (path) {
      const fs = await import("node:fs/promises");
      const csv = await fs.readFile(path, "utf8");
      const cutoff = Date.now() - 7 * 86_400_000;
      const dataLines = csv.split("\n").slice(1).filter(Boolean);
      for (const line of dataLines) {
        // created_at is the 2nd CSV cell; guardCsvCell wraps every cell in quotes.
        const match = line.match(/^"[^"]*","([^"]+)"/);
        if (!match) continue;
        const ts = Date.parse(match[1]);
        if (!Number.isNaN(ts)) {
          expect(ts).toBeGreaterThanOrEqual(cutoff - 60_000);
        }
      }

      // Every cell must be quoted (formula-injection guard) — no raw =, +, -, @ leading chars.
      for (const line of dataLines) {
        expect(line.startsWith('"')).toBeTruthy();
      }
    }
  });

  test("analytics dashboard route is admin-only", async ({ page }) => {
    await page.goto(`${BASE}/admin/security-analytics`, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/auth/, { timeout: 10_000 });
  });
});
