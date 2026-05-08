import { test, expect } from "@playwright/test";

test.describe("Task Manager E2E", () => {
  test("full task lifecycle flow", async ({ page }) => {
    // =========================
    // LOGIN
    // =========================

    await page.goto("/login");

    await page.getByLabel("Email").fill("admin@test.com");

    await page.getByLabel("Password").fill("password123");

    await page
      .getByRole("button", {
        name: /sign in/i,
      })
      .click();

    // =========================
    // VERIFY DASHBOARD
    // =========================

    await expect(page).toHaveURL(/dashboard/);

    // WAIT FOR PROJECT INPUT
    await expect(page.getByPlaceholder(/enter project name/i)).toBeVisible({
      timeout: 10000,
    });

    // =========================
    // CREATE PROJECT
    // =========================

    await page.getByPlaceholder(/enter project name/i).fill("E2E Test Project");

    await page
      .getByRole("button", {
        name: /create project/i,
      })
      .click();

    // =========================
    // VERIFY PROJECT CREATED
    // =========================

    await expect(page.getByText("E2E Test Project")).toBeVisible({
      timeout: 10000,
    });
  });

  test("member task lifecycle", async ({ page }) => {
    // =========================
    // LOGIN
    // =========================

    await page.goto("/login");

    await page.getByLabel("Email").fill("member@test.com");

    await page.getByLabel("Password").fill("password123");

    await page
      .getByRole("button", {
        name: /sign in/i,
      })
      .click();

    // =========================
    // VERIFY DASHBOARD
    // =========================

    await expect(page).toHaveURL(/dashboard/);

    // =========================
    // GO TO MY TASKS
    // =========================

    await page.goto("/my-tasks");

    // =========================
    // VERIFY PAGE
    // =========================

    await expect(
      page.getByRole("heading", {
        name: /my tasks/i,
      }),
    ).toBeVisible({
      timeout: 10000,
    });

    // =========================
    // VERIFY PENDING SECTION
    // =========================

    await expect(
      page.getByRole("heading", {
        name: /pending/i,
      }),
    ).toBeVisible({
      timeout: 10000,
    });
  });
});
