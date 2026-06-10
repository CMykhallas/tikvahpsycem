import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const CATEGORY = "saude-mental";
const ITEM = "psicologia-clinica-social-e-organizacional";
const ITEM_URL = `/ecosistema/${CATEGORY}/${ITEM}`;
const SITE_ORIGIN = "https://tikvahpsycem.lovable.app";

const getMeta = (page: import("@playwright/test").Page, selector: string) =>
  page.locator(selector).first().getAttribute("content");

test.describe("/ecosistema item — SEO metadata, OG, Twitter, JSON-LD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL + ITEM_URL);
    // Wait for SEOHead useEffect to flush head mutations
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForFunction(
      () =>
        !!document.querySelector('link[rel="canonical"]') &&
        !!document.querySelector('script[data-seo="route"]'),
    );
  });

  test("title and description are item-specific", async ({ page }) => {
    const title = await page.title();
    expect(title).toMatch(/Tikvah/);
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(80);

    const description = await getMeta(page, 'meta[name="description"]');
    expect(description).toBeTruthy();
    expect((description ?? "").length).toBeGreaterThan(40);
    expect((description ?? "").length).toBeLessThanOrEqual(160);
  });

  test("canonical is absolute and matches route", async ({ page }) => {
    const canonical = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute("href");
    expect(canonical).toBe(`${SITE_ORIGIN}${ITEM_URL}`);
  });

  test("Open Graph tags are present and consistent", async ({ page }) => {
    const ogTitle = await getMeta(page, 'meta[property="og:title"]');
    const ogDesc = await getMeta(page, 'meta[property="og:description"]');
    const ogType = await getMeta(page, 'meta[property="og:type"]');
    const ogUrl = await getMeta(page, 'meta[property="og:url"]');
    const ogImage = await getMeta(page, 'meta[property="og:image"]');

    expect(ogTitle).toBeTruthy();
    expect(ogDesc).toBeTruthy();
    expect(ogType).toBe("article");
    expect(ogUrl).toBe(`${SITE_ORIGIN}${ITEM_URL}`);
    expect(ogImage).toMatch(/^https?:\/\//);
  });

  test("Twitter tags are present", async ({ page }) => {
    expect(await getMeta(page, 'meta[name="twitter:title"]')).toBeTruthy();
    expect(await getMeta(page, 'meta[name="twitter:description"]')).toBeTruthy();
    expect(await getMeta(page, 'meta[name="twitter:image"]')).toMatch(
      /^https?:\/\//,
    );
  });

  test("JSON-LD includes Service and BreadcrumbList", async ({ page }) => {
    const blocks = await page
      .locator('script[data-seo="route"]')
      .allTextContents();
    expect(blocks.length).toBeGreaterThanOrEqual(2);

    const parsed = blocks.map((b) => JSON.parse(b));
    const types = parsed.map((p) => p["@type"]);
    expect(types).toContain("Service");
    expect(types).toContain("BreadcrumbList");

    const service = parsed.find((p) => p["@type"] === "Service");
    expect(service.name).toBeTruthy();
    expect(service.description).toBeTruthy();

    const breadcrumb = parsed.find((p) => p["@type"] === "BreadcrumbList");
    expect(Array.isArray(breadcrumb.itemListElement)).toBe(true);
    expect(breadcrumb.itemListElement.length).toBeGreaterThanOrEqual(3);
  });
});
