// @ts-nocheck
import { test, expect } from "@playwright/test";

test("static tools 2-150 render and their controls do not crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`console: ${msg.text()}`); });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  for (let id = 2; id <= 150; id += 1) {
    const card = page.locator(`#tool-${id}`);
    await expect(card, `Tool #${id} must render exactly once`).toHaveCount(1);
    await card.scrollIntoViewIfNeeded();
    const controls = card.locator("input, textarea, select");
    for (let i = 0; i < await controls.count(); i += 1) {
      const control = controls.nth(i);
      const type = await control.getAttribute("type");
      const tag = await control.evaluate((el) => el.tagName.toLowerCase());
      if (tag === "select" || type === "checkbox" || type === "radio") continue;
      await control.fill(type === "number" ? "2" : "deep audit sample 🚀");
    }
    const buttons = card.locator("button");
    for (let i = 0; i < await buttons.count(); i += 1) {
      const button = buttons.nth(i);
      await expect(button).toBeEnabled();
      await button.click({ timeout: 3000 });
    }
  }
  expect(errors, `Static tool runtime errors: ${errors.join(" | ")}`).toEqual([]);
});
