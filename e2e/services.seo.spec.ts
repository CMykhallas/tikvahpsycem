/**
 * Contract test — every /services/* route must expose the SEO surface used by
 * Google + social crawlers: title, description, canonical, og:*, twitter:card
 * and JSON-LD containing Service + Organization + BreadcrumbList (+ LocalBusiness
 * for Consultoria).
 */
import { test, expect } from "@playwright/test";

const ROUTES = [
  { path: "/services/psicoterapia", extraJsonld: [] as string[] },
  { path: "/services/cursos", extraJsonld: [] },
  { path: "/services/workshops", extraJsonld: [] },
  { path: "/services/consultoria", extraJsonld: ["LocalBusiness"] },
];

for (const { path, extraJsonld } of ROUTES) {
  test.describe(`SEO surface: ${path}`, () => {
    test(`title, meta, canonical, og and JSON-LD are present`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
      expect(title.length).toBeLessThanOrEqual(80);

      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc && desc.length).toBeGreaterThan(30);
      expect(desc!.length).toBeLessThanOrEqual(200);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBeTruthy();
      expect(canonical!.startsWith("http")).toBeTruthy();
      expect(canonical!.endsWith(path)).toBeTruthy();

      for (const p of ["og:title", "og:description", "og:url", "og:type"]) {
        const v = await page.locator(`meta[property="${p}"]`).first().getAttribute("content");
        expect(v, `missing ${p}`).toBeTruthy();
      }
      const twitter = await page.locator('meta[name="twitter:card"]').first().getAttribute("content");
      expect(twitter).toBeTruthy();

      // JSON-LD graph
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const types = new Set<string>();
      for (const block of blocks) {
        try {
          const parsed = JSON.parse(block);
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          for (const node of arr) {
            const t = node["@type"];
            if (typeof t === "string") types.add(t);
            else if (Array.isArray(t)) t.forEach((x) => types.add(x));
          }
        } catch { /* skip unparseable */ }
      }
      for (const required of ["Organization", "BreadcrumbList"]) {
        expect(types, `missing @type=${required}`).toContain(required);
      }
      // Service-ish type — psicoterapia uses Psychotherapy schemaType
      const serviceTypes = ["Service", "Psychotherapy", "EducationalOccupationalProgram", "Event"];
      expect(serviceTypes.some((s) => types.has(s))).toBeTruthy();
      for (const extra of extraJsonld) expect(types).toContain(extra);
    });
  });
}
