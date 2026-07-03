import { test, expect } from "@playwright/test";

/**
 * Validates parity between the visible breadcrumb UI, the URL params
 * (:categoryId / :itemSlug) and the JSON-LD BreadcrumbList schema.
 * Also asserts keyboard focus visibility on breadcrumb links.
 */
const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const CATEGORY = "saude-mental";
const ITEM = "psicologia-clinica-social-e-organizacional";
const ITEM_PATH = `/ecosistema/${CATEGORY}/${ITEM}`;

type Ld = {
  "@type"?: string | string[];
  itemListElement?: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
};

async function readJsonLd(page: import("@playwright/test").Page): Promise<Ld[]> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed: Ld[] = [];
  for (const chunk of raw) {
    try {
      const j = JSON.parse(chunk);
      if (Array.isArray(j)) parsed.push(...j);
      else parsed.push(j);
    } catch {
      /* ignore malformed blocks */
    }
  }
  return parsed;
}

test.describe("EcosystemDetail — breadcrumbs ↔ JSON-LD parity", () => {
  test("BreadcrumbList mirrors URL params and visible trail", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_PATH);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const nodes = await readJsonLd(page);
    const breadcrumb = nodes.find((n) => n["@type"] === "BreadcrumbList");
    expect(breadcrumb, "BreadcrumbList JSON-LD present").toBeTruthy();

    const items = breadcrumb!.itemListElement!;
    expect(items.length).toBe(4);
    expect(items[0].name).toMatch(/Início/i);
    expect(items[1].name).toMatch(/Serviços/i);
    // Category + item URLs must reflect the route params.
    expect(items[2].item).toContain(`/ecosistema/${CATEGORY}`);
    expect(items[3].item).toContain(ITEM_PATH);
    expect(items[3].position).toBe(4);

    // Visible breadcrumb has same last-item label as JSON-LD.
    const nav = page.getByRole("navigation", { name: /Trilho de navegação/i });
    await expect(nav).toBeVisible();
    const current = nav.locator('[aria-current="page"]');
    await expect(current).toHaveText(items[3].name);
  });

  test("breadcrumb links are clickable and navigate up the hierarchy", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_PATH);
    const nav = page.getByRole("navigation", { name: /Trilho de navegação/i });

    // Category link inside breadcrumbs navigates to category page.
    const categoryLink = nav.getByRole("link").nth(1); // 0 = Serviços, 1 = Categoria
    await expect(categoryLink).toBeVisible();
    await categoryLink.click();
    await expect(page).toHaveURL(new RegExp(`/ecosistema/${CATEGORY}$`));
  });

  test("breadcrumb links receive visible focus via keyboard", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_PATH);
    const nav = page.getByRole("navigation", { name: /Trilho de navegação/i });
    const firstLink = nav.getByRole("link").first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();

    // focus-visible ring must produce a non-empty outline / box-shadow.
    const outlineStyles = await firstLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        outlineWidth: s.outlineWidth,
        outlineStyle: s.outlineStyle,
        boxShadow: s.boxShadow,
      };
    });
    const hasFocusRing =
      (outlineStyles.outlineStyle !== "none" &&
        parseFloat(outlineStyles.outlineWidth) > 0) ||
      (outlineStyles.boxShadow && outlineStyles.boxShadow !== "none");
    expect(hasFocusRing).toBeTruthy();
  });
});
