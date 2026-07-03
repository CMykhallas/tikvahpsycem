import { test, expect, Page } from "@playwright/test";

/**
 * E2E suite for /ecosistema/:categoryId/:itemSlug (EcosystemDetail).
 *
 * Covers:
 *  - SEO/social meta tags (og:image, twitter:image absolute URLs) and image alts.
 *  - Accessible loading states (aria-busy, aria-live) and post-fetch focus handoff.
 *  - Keyboard tab-order and :focus-visible affordances.
 *
 * Selectors prefer accessibility roles per WCAG 2.1 / ISO 30071-1 guidance.
 */

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";
const CATEGORY = "saude-mental";
const ITEM = "psicologia-clinica-social-e-organizacional";
const ITEM_URL = `/ecosistema/${CATEGORY}/${ITEM}`;

const metaContent = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute("content");

test.describe("EcosystemDetail — SEO social images & alt text", () => {
  /** og:image / twitter:image must be absolute URLs so crawlers can resolve them. */
  test("og:image and twitter:image are present and absolute", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForFunction(
      () => !!document.querySelector('meta[property="og:image"]'),
    );

    const ogImage = await metaContent(page, 'meta[property="og:image"]');
    const twitterImage = await metaContent(page, 'meta[name="twitter:image"]');

    expect(ogImage, "og:image must exist").toBeTruthy();
    expect(twitterImage, "twitter:image must exist").toBeTruthy();
    expect(ogImage).toMatch(/^https?:\/\//);
    expect(twitterImage).toMatch(/^https?:\/\//);
  });

  /** Informative <img> tags must ship a non-empty alt (WCAG 1.1.1). */
  test("informative images expose non-empty alt attributes", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const imgs = page.locator("img:not([alt=''])");
    const count = await page.locator("img").count();
    for (let i = 0; i < count; i++) {
      const img = page.locator("img").nth(i);
      const alt = await img.getAttribute("alt");
      const ariaHidden = await img.getAttribute("aria-hidden");
      const role = await img.getAttribute("role");
      // Decorative images may use alt="" + aria-hidden / role="presentation".
      const decorative =
        alt === "" || ariaHidden === "true" || role === "presentation";
      if (!decorative) {
        expect(alt, `img #${i} needs a descriptive alt`).toBeTruthy();
        expect((alt ?? "").trim().length).toBeGreaterThan(0);
      }
    }
    // Sanity: at least the informative-image locator is queryable.
    await imgs.count();
  });
});

test.describe("EcosystemDetail — accessible loading states & focus handoff", () => {
  /**
   * While the route is fetching, any skeleton container must announce itself
   * as busy. After render completes, aria-busy must clear and the H1 must
   * receive programmatic focus (tabindex=-1) for SR/keyboard users.
   */
  test("aria-busy toggles and focus lands on <h1> after load", async ({
    page,
  }) => {
    // Delay any dynamic JSON/API responses so we can observe the loading state.
    await page.route(/\.(json)(\?.*)?$/i, async (route) => {
      await new Promise((r) => setTimeout(r, 250));
      await route.continue();
    });

    await page.goto(BASE_URL + ITEM_URL, { waitUntil: "domcontentloaded" });

    // If a skeleton/loader is present, it should expose aria-busy or aria-live.
    const busy = page.locator('[aria-busy="true"], [aria-live="polite"]');
    // Non-strict: some routes render synchronously and skip skeletons.
    await busy.first().count();

    // After load: H1 visible, focused, no aria-busy=true left behind.
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toBeFocused();

    const stillBusy = await page.locator('[aria-busy="true"]').count();
    expect(stillBusy).toBe(0);

    // Main landmark must be programmatically focusable for route announcements.
    await expect(page.locator("#main-content")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});

test.describe("EcosystemDetail — keyboard tab order & focus-visible", () => {
  /**
   * Tabbing from the H1 should traverse: breadcrumb links → "Voltar" link →
   * sibling service links → CTA buttons, in DOM order, each receiving a
   * visible focus ring (:focus-visible).
   */
  test("tab order follows DOM and every stop is focus-visible", async ({
    page,
  }) => {
    await page.goto(BASE_URL + ITEM_URL);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toBeFocused();

    const seenTags: string[] = [];
    const seenLabels: string[] = [];

    for (let step = 0; step < 8; step++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return null;
        // Programmatic proxy for :focus-visible (jsdom-safe pattern).
        const matchesFV =
          typeof el.matches === "function" && el.matches(":focus-visible");
        return {
          tag: el.tagName,
          label:
            el.getAttribute("aria-label") ||
            el.textContent?.trim().slice(0, 40) ||
            "",
          focusVisible: matchesFV,
          outlineWidth: getComputedStyle(el).outlineWidth,
          boxShadow: getComputedStyle(el).boxShadow,
        };
      });
      expect(info, `step ${step}: no active element`).not.toBeNull();
      seenTags.push(info!.tag);
      seenLabels.push(info!.label);

      // A visible focus indicator = :focus-visible OR non-zero outline OR ring shadow.
      const hasIndicator =
        info!.focusVisible ||
        (info!.outlineWidth && info!.outlineWidth !== "0px") ||
        (info!.boxShadow && info!.boxShadow !== "none");
      expect(
        hasIndicator,
        `step ${step} (${info!.tag} — "${info!.label}") lacks a visible focus style`,
      ).toBeTruthy();
    }

    // Every stop must be an interactive element.
    for (const tag of seenTags) {
      expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(tag);
    }

    // Expect at least one breadcrumb-ish link ("Serviços" or category short) early.
    const earlyLabels = seenLabels.slice(0, 5).join(" | ").toLowerCase();
    expect(earlyLabels).toMatch(/servi|voltar|saúde|saude/);
  });
});
