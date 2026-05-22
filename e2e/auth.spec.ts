import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should load sign in page", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveTitle(/Ucomp/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("should load sign up page", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.getByText("Create an account")).toBeVisible();
  });

  test("should show validation errors on empty sign in", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page.getByText("Please enter a valid email address"),
    ).toBeVisible();
  });

  test("should show validation errors on empty sign up", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(
      page.getByText("Name must be at least 2 characters"),
    ).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page.getByText("Invalid email or password. Please try again."),
    ).toBeVisible();
  });

  test("should redirect to dashboard after sign in", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(/dashboard|private-folder|user/);
    await context.close();
  });

  test("should redirect logged in user away from sign in", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForTimeout(5000);
    await page.goto("/sign-in");
    await expect(page).toHaveURL(/dashboard|private-folder|user/);
    await context.close();
  });

  test("should load forgot password page", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByText("Forgot password")).toBeVisible();
  });

  test("should show error for non-existent email on forgot password", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("nonexistent@example.com");
    await page.getByRole("button", { name: "Send Reset Link" }).click();
    await expect(
      page.getByText("No account found with this email address."),
    ).toBeVisible();
  });
});
