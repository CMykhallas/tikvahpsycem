/**
 * MultiStepBudgetForm — E2E:
 *   1. Real-time validation of required fields (zod).
 *   2. Draft persistence in localStorage across reloads.
 *   3. Success + error transitions with accessible messaging.
 */
import { test, expect } from "@playwright/test";

const ROUTE = "/services/psicoterapia";

test.describe("MultiStepBudgetForm", () => {
  test("validates step 1 in real time and blocks Continue", async ({ page }) => {
    await page.goto(ROUTE);
    const continueBtn = page.getByRole("button", { name: /Continuar/i });
    await continueBtn.first().click();
    // Zod should surface field errors without leaving the step
    await expect(page.getByText(/Informe o seu nome|Email inválido/i).first()).toBeVisible();
  });

  test("persists draft in localStorage across reload", async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByLabel(/Nome completo/i).fill("Maria Silva");
    await page.getByLabel(/^Email$/i).fill("maria@example.com");
    await page.reload();
    await expect(page.getByLabel(/Nome completo/i)).toHaveValue("Maria Silva");
    await expect(page.getByLabel(/^Email$/i)).toHaveValue("maria@example.com");
  });

  test("shows accessible error on 429 and preserves data", async ({ page }) => {
    // Mock the supabase function invocation → return 429
    await page.route(/\/functions\/v1\/send-contact-email/i, (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        headers: { "Retry-After": "60" },
        body: JSON.stringify({ error: "Too many requests", retryAfter: 60 }),
      }),
    );

    await page.goto(ROUTE);
    await page.getByLabel(/Nome completo/i).fill("Ana Costa");
    await page.getByLabel(/^Email$/i).fill("ana@example.com");
    await page.getByRole("button", { name: /Continuar/i }).first().click();

    await page.getByLabel(/Telefone/i).fill("+258840000000");
    await page.getByText(/^presencial$/i).click();
    await page.getByRole("button", { name: /Continuar/i }).first().click();

    await page.getByLabel(/Conte-nos mais/i).fill("Preciso de orçamento para 10 sessões.");
    await page.getByRole("button", { name: /Enviar pedido/i }).click();

    // Toast (destructive) is announced via role=status/alert region
    await expect(page.getByText(/Erro ao enviar|Too many requests/i).first()).toBeVisible({ timeout: 5000 });
    // Data preserved (still in step 3)
    await expect(page.getByLabel(/Conte-nos mais/i)).toHaveValue(/Preciso de orçamento/i);
  });

  test("shows success and clears draft on 200", async ({ page }) => {
    await page.route(/\/functions\/v1\/send-contact-email/i, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, requestId: "test-1" }),
      }),
    );

    await page.goto(ROUTE);
    await page.getByLabel(/Nome completo/i).fill("João");
    await page.getByLabel(/^Email$/i).fill("joao@example.com");
    await page.getByRole("button", { name: /Continuar/i }).first().click();
    await page.getByLabel(/Telefone/i).fill("+258840000000");
    await page.getByText(/^online$/i).click();
    await page.getByRole("button", { name: /Continuar/i }).first().click();
    await page.getByLabel(/Conte-nos mais/i).fill("Descrição detalhada.");
    await page.getByRole("button", { name: /Enviar pedido/i }).click();

    await expect(page.getByText(/Pedido enviado com sucesso/i)).toBeVisible({ timeout: 5000 });
    const draft = await page.evaluate(() => localStorage.getItem("tikvah:budget-draft:psicoterapia"));
    expect(draft).toBeNull();
  });
});
