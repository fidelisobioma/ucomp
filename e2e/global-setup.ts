import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Sign in once
  await page.goto(`${baseURL}/sign-in`);
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  // Wait for navigation to complete
  await page.waitForTimeout(5000);

  // Save session state
  await page.context().storageState({ path: "e2e/.auth/user.json" });

  await browser.close();
}

export default globalSetup;
