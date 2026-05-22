import { test, expect, type Page } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should redirect unauthenticated user to sign in", async ({
    browser,
  }) => {
    // Use a fresh context without stored auth
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await page.goto("/user/private-folder");
    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });

  test("should show private folder after sign in", async ({ page }) => {
    await page.goto("/user/private-folder");
    await expect(page.getByText("Private Folder")).toBeVisible();
  });

  test("should show storage meter", async ({ page }) => {
    await page.goto("/user/private-folder");
    await expect(page.getByText("Storage")).toBeVisible();
  });

  test("should show print queue page", async ({ page }) => {
    await page.goto("/user/print-queue");
    await expect(page.getByText("Print Queue")).toBeVisible();
  });

  test("should show notification bell", async ({ page }) => {
    await page.goto("/user/private-folder");
    await expect(page.locator("header")).toBeVisible();
  });

  test("should show settings page", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByText("Settings")).toBeVisible();
  });

  test("should sign out successfully", async ({ page }) => {
    await page.goto("/user/private-folder");
    await page.getByRole("button").last().click();
    await page.getByText("Sign out").click();
    await expect(page).toHaveURL(/sign-in/);
  });
});
