# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should redirect logged in user away from sign in
- Location: e2e/auth.spec.ts:55:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /dashboard|private-folder|user/
Received string:  "http://localhost:3000/sign-in"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/sign-in"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
  - button "Open Next.js Dev Tools" [ref=e36] [cursor=pointer]:
    - img [ref=e37]
  - alert [ref=e40]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Authentication", () => {
  4  |   test("should load sign in page", async ({ page }) => {
  5  |     await page.goto("/sign-in");
  6  |     await expect(page).toHaveTitle(/Ucomp/);
  7  |     await expect(page.getByText("Welcome back")).toBeVisible();
  8  |   });
  9  | 
  10 |   test("should load sign up page", async ({ page }) => {
  11 |     await page.goto("/sign-up");
  12 |     await expect(page.getByText("Create an account")).toBeVisible();
  13 |   });
  14 | 
  15 |   test("should show validation errors on empty sign in", async ({ page }) => {
  16 |     await page.goto("/sign-in");
  17 |     await page.getByRole("button", { name: "Sign in" }).click();
  18 |     await expect(
  19 |       page.getByText("Please enter a valid email address"),
  20 |     ).toBeVisible();
  21 |   });
  22 | 
  23 |   test("should show validation errors on empty sign up", async ({ page }) => {
  24 |     await page.goto("/sign-up");
  25 |     await page.getByRole("button", { name: "Create account" }).click();
  26 |     await expect(
  27 |       page.getByText("Name must be at least 2 characters"),
  28 |     ).toBeVisible();
  29 |   });
  30 | 
  31 |   test("should show error on invalid credentials", async ({ page }) => {
  32 |     await page.goto("/sign-in");
  33 |     await page.getByLabel("Email").fill("wrong@example.com");
  34 |     await page.getByLabel("Password").fill("wrongpassword");
  35 |     await page.getByRole("button", { name: "Sign in" }).click();
  36 |     await expect(
  37 |       page.getByText("Invalid email or password. Please try again."),
  38 |     ).toBeVisible();
  39 |   });
  40 | 
  41 |   test("should redirect to dashboard after sign in", async ({ browser }) => {
  42 |     const context = await browser.newContext({
  43 |       storageState: { cookies: [], origins: [] },
  44 |     });
  45 |     const page = await context.newPage();
  46 |     await page.goto("/sign-in");
  47 |     await page.getByLabel("Email").fill("test@example.com");
  48 |     await page.getByLabel("Password").fill("password123");
  49 |     await page.getByRole("button", { name: "Sign in" }).click();
  50 |     await page.waitForTimeout(5000);
  51 |     await expect(page).toHaveURL(/dashboard|private-folder|user/);
  52 |     await context.close();
  53 |   });
  54 | 
  55 |   test("should redirect logged in user away from sign in", async ({
  56 |     browser,
  57 |   }) => {
  58 |     const context = await browser.newContext({
  59 |       storageState: { cookies: [], origins: [] },
  60 |     });
  61 |     const page = await context.newPage();
  62 |     await page.goto("/sign-in");
  63 |     await page.getByLabel("Email").fill("test@example.com");
  64 |     await page.getByLabel("Password").fill("password123");
  65 |     await page.getByRole("button", { name: "Sign in" }).click();
  66 |     await page.waitForTimeout(5000);
  67 |     await page.goto("/sign-in");
> 68 |     await expect(page).toHaveURL(/dashboard|private-folder|user/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  69 |     await context.close();
  70 |   });
  71 | 
  72 |   test("should load forgot password page", async ({ page }) => {
  73 |     await page.goto("/forgot-password");
  74 |     await expect(page.getByText("Forgot password")).toBeVisible();
  75 |   });
  76 | 
  77 |   test("should show error for non-existent email on forgot password", async ({
  78 |     page,
  79 |   }) => {
  80 |     await page.goto("/forgot-password");
  81 |     await page.getByLabel("Email").fill("nonexistent@example.com");
  82 |     await page.getByRole("button", { name: "Send Reset Link" }).click();
  83 |     await expect(
  84 |       page.getByText("No account found with this email address."),
  85 |     ).toBeVisible();
  86 |   });
  87 | });
  88 | 
```