import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:8080";

test.describe("/ecosistema navigation", () => {
  test("category page renders and lists items with working item links", async ({
    page,
  }) => {
    await page.goto(BASE_URL + "/ecosistema/saude-mental");

    // H1 + structured breadcrumb
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Saúde mental, reabilitação e intervenção/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: /Trilho de navegação/i }),
    ).toBeVisible();

    // Item list is keyboard-accessible
    const firstItem = page
      .getByRole("link", { name: /Abrir detalhes do serviço/i })
      .first();
    await expect(firstItem).toBeVisible();
    await firstItem.click();

    await expect(page).toHaveURL(
      /\/ecosistema\/saude-mental\/[a-z0-9-]+$/,
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("unknown category renders accessible 404 alert (no crash)", async ({ page }) => {
    await page.goto(BASE_URL + "/ecosistema/__nope__");
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText(/Erro 404/i)).toBeVisible();
  });

  test("unknown item slug under valid category renders accessible 404", async ({
    page,
  }) => {
    await page.goto(BASE_URL + "/ecosistema/saude-mental/__nope__");
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText(/Erro 404/i)).toBeVisible();
  });

  test("category card on homepage ecosystem section links to /ecosistema/:id", async ({
    page,
  }) => {
    await page.goto(BASE_URL + "/services");
    const catLink = page
      .getByRole("link", { name: /Explorar área:/i })
      .first();
    await expect(catLink).toBeVisible();
    await catLink.click();
    await expect(page).toHaveURL(/\/ecosistema\/[a-z0-9-]+$/);
  });
});
