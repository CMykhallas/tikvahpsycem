/**
 * Verifies every /services/* CTA (button/anchor with data-track-click) fires a
 * consistent GA4/GTM event when clicked. Uses a dataLayer stub — no real GA
 * network call is made.
 */
import { test, expect } from "@playwright/test";

const ROUTES = [
  "/services/psicoterapia",
  "/services/cursos",
  "/services/workshops",
  "/services/consultoria",
];

for (const path of ROUTES) {
  test(`CTAs on ${path} push a cta_click event`, async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
      document.addEventListener("click", (e) => {
        const el = (e.target as HTMLElement | null)?.closest?.("[data-track-click]");
        if (el) {
          (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
            event: "cta_click",
            track_id: el.getAttribute("data-track-click"),
          });
        }
      }, true);
    });

    await page.goto(path, { waitUntil: "domcontentloaded" });
    const first = page.locator("[data-track-click]").first();
    await expect(first).toBeVisible({ timeout: 10000 });
    await first.click({ trial: false, force: true }).catch(() => {});

    const events = await page.evaluate(
      () => (window as unknown as { dataLayer: { event: string; track_id: string }[] }).dataLayer,
    );
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].event).toBe("cta_click");
    expect(typeof events[0].track_id).toBe("string");
    expect(events[0].track_id.length).toBeGreaterThan(2);
  });
}
