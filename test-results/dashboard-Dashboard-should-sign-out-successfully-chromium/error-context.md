# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> should sign out successfully
- Location: e2e/dashboard.spec.ts:42:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('Sign out')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link "Ucomp" [ref=e4] [cursor=pointer]:
        - /url: /
        - img [ref=e5]
        - generic [ref=e7]: Ucomp
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Welcome back
        - generic [ref=e12]: Sign in to your Ucomp account
      - generic [ref=e13]:
        - generic [ref=e15]:
          - group [ref=e16]:
            - generic [ref=e17]: Email
            - textbox "Email" [ref=e18]:
              - /placeholder: john@example.com
          - group [ref=e19]:
            - generic [ref=e20]:
              - generic [ref=e21]: Password
              - link "Forgot password?" [ref=e22] [cursor=pointer]:
                - /url: /forgot-password
            - textbox "Password" [ref=e23]:
              - /placeholder: ••••••••
          - button "Sign in" [ref=e24]
        - generic [ref=e26]: or
        - button "Continue with Google" [ref=e27]:
          - img
          - text: Continue with Google
      - paragraph [ref=e29]:
        - text: Don't have an account?
        - link "Sign up" [ref=e30] [cursor=pointer]:
          - /url: /sign-up
  - region "Notifications alt+T"
  - generic [active]:
    - menu "Next.js Dev Tools Items" [ref=e31]:
      - generic [ref=e32]:
        - menuitem "Route Static" [ref=e33] [cursor=pointer]:
          - generic [ref=e34]: Route
          - generic [ref=e35]: Static
        - generic "Turbopack is enabled." [ref=e36]:
          - generic [ref=e37]: Bundler
          - generic [ref=e38]: Turbopack
        - menuitem "Route Info" [ref=e39]:
          - generic [ref=e40]: Route Info
          - img [ref=e42]
      - menuitem "Preferences" [ref=e45]:
        - generic [ref=e46]: Preferences
        - img [ref=e48]
    - button "Close Next.js Dev Tools" [expanded] [ref=e55] [cursor=pointer]:
      - img [ref=e56]
  - alert [ref=e59]
```

# Test source

```ts
  1  | import { test, expect, type Page } from "@playwright/test";
  2  | 
  3  | test.describe("Dashboard", () => {
  4  |   test("should redirect unauthenticated user to sign in", async ({
  5  |     browser,
  6  |   }) => {
  7  |     // Use a fresh context without stored auth
  8  |     const context = await browser.newContext({
  9  |       storageState: { cookies: [], origins: [] },
  10 |     });
  11 |     const page = await context.newPage();
  12 |     await page.goto("/user/private-folder");
  13 |     await expect(page).toHaveURL(/sign-in/);
  14 |     await context.close();
  15 |   });
  16 | 
  17 |   test("should show private folder after sign in", async ({ page }) => {
  18 |     await page.goto("/user/private-folder");
  19 |     await expect(page.getByText("Private Folder")).toBeVisible();
  20 |   });
  21 | 
  22 |   test("should show storage meter", async ({ page }) => {
  23 |     await page.goto("/user/private-folder");
  24 |     await expect(page.getByText("Storage")).toBeVisible();
  25 |   });
  26 | 
  27 |   test("should show print queue page", async ({ page }) => {
  28 |     await page.goto("/user/print-queue");
  29 |     await expect(page.getByText("Print Queue")).toBeVisible();
  30 |   });
  31 | 
  32 |   test("should show notification bell", async ({ page }) => {
  33 |     await page.goto("/user/private-folder");
  34 |     await expect(page.locator("header")).toBeVisible();
  35 |   });
  36 | 
  37 |   test("should show settings page", async ({ page }) => {
  38 |     await page.goto("/settings");
  39 |     await expect(page.getByText("Settings")).toBeVisible();
  40 |   });
  41 | 
  42 |   test("should sign out successfully", async ({ page }) => {
  43 |     await page.goto("/user/private-folder");
  44 |     await page.getByRole("button").last().click();
> 45 |     await page.getByText("Sign out").click();
     |                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  46 |     await expect(page).toHaveURL(/sign-in/);
  47 |   });
  48 | });
  49 | 
```