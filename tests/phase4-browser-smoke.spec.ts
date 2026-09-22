import { test, expect } from "@playwright/test";

test("main UI, tools, editor, and AI error recovery surface", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /Developer Tools, Multi-Language Sandbox & AI Assistant/i })).toBeVisible();
  await expect(page.locator("#search-all-tools-input")).toBeVisible();
  await expect(page.getByText(/Developer Toolbox \(1,000 Tools\)/i)).toBeVisible();

  await page.locator("#search-all-tools-input").fill("JSON");
  await expect(page.getByText(/Filtered by:/i)).toBeVisible();
  await page.locator("#search-all-tools-input").fill("");

  await page.getByRole("button", { name: /^Security\s+\d+/ }).click();
  await page.getByRole("button", { name: /^All\s+1000/ }).click();

  await page.locator("#all-tools-grid").scrollIntoViewIfNeeded();
  await expect(page.locator("#all-tools-grid")).toBeVisible();
  const runTool = page.getByRole("button", { name: "Run Tool" }).first();
  await expect(runTool).toBeVisible({ timeout: 20_000 });
  await runTool.click();

  await page.locator("#ai-assistant-section textarea").fill("test quota handling");
  await page.route("**/api/ai/ask", async route => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({ error: "Gemini usage quota/rate limit has been reached." }),
    });
  });
  await page.getByRole("button", { name: "Ask AI" }).last().click();
  await expect(page.getByText(/Gemini usage quota\/rate limit has been reached/i)).toBeVisible();

  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", await page.evaluate(() => document.documentElement.clientWidth));
  expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
});

test("code editor sandbox renders and remains bounded", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#code-editor-section")).toBeVisible();
  await expect(page.getByTitle("Live Output Preview")).toBeVisible();
  const frame = page.frameLocator("#liveOutput");
  await expect(frame.locator("body")).toBeVisible();
});
