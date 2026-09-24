// @ts-nocheck
import { test, expect } from "@playwright/test";

const TEXT_CASES = [
  "",
  "   ",
  "deep audit sample 🚀",
  '<>&"\'\\/\\n',
  "x".repeat(2048),
];

test("static tools 1-150 exhaustive control and edge-input smoke", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("status of 429")) errors.push(`console: ${msg.text()}`);
  });

  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });

  for (let id = 1; id <= 150; id += 1) {
    const card = page.locator(`#tool-${id}`);
    await expect(card, `Tool #${id} must render exactly once`).toHaveCount(1);
    await card.scrollIntoViewIfNeeded();

    const controls = card.locator("input, textarea, select");
    for (let i = 0; i < await controls.count(); i += 1) {
      const control = controls.nth(i);
      const type = await control.getAttribute("type");
      const tag = await control.evaluate((el) => el.tagName.toLowerCase());

      if (tag === "select") {
        const values = await control.locator("option").evaluateAll((opts) => opts.map((o) => (o as HTMLOptionElement).value));
        if (values.length) {
          await control.selectOption(values[0]);
          if (values.length > 1) await control.selectOption(values[values.length - 1]);
        }
        continue;
      }

      if (["checkbox", "radio", "color", "range", "date", "datetime-local", "time", "file"].includes(type || "")) continue;

      for (const sample of TEXT_CASES) {
        const value = type === "number"
          ? (sample === "" || sample.trim() === "" ? "0" : "2")
          : sample;
        await control.fill(value);
      }
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
