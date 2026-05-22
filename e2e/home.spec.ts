import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ucomp/);
  });

  test("should show navbar", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Ucomp" }).first(),
    ).toBeVisible();
  });

  test("should show hero section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Print Smarter, Not Harder" }),
    ).toBeVisible();
  });

  test("should show features section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Everything You Need" }),
    ).toBeVisible();
  });

  test("should show services section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Our Services" }),
    ).toBeVisible();
  });

  test("should show pricing section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Simple, Transparent Pricing" }),
    ).toBeVisible();
  });

  test("should show FAQ section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Frequently Asked Questions" }),
    ).toBeVisible();
  });

  test("should navigate to sign in from navbar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/sign-in/);
  });

  test("should navigate to sign up from get started button", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Get Started" }).first().click();
    await expect(page).toHaveURL(/sign-up/);
  });
});
