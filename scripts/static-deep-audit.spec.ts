// @ts-nocheck
import { test, expect } from "@playwright/test";

const TEXT_CASES = ["", "   ", "deep audit sample 🚀", '<>&"\'\\/\\n', "x".repeat(2048)];

test("static tool 1 plus tools 2-150 exhaustive control and edge-input smoke", async ({ page }) => {
  const errors: string[] = [];
  const localHmr400Responses = new Set<string>();
  const unexpected400Responses = new Set<string>();
  page.on("response", (response) => {
    if (response.status() === 400) {
      unexpected400Responses.add(response.url());
    }
    if (response.status() === 400 && response.url().includes("127.0.0.1:24678")) {
      localHmr400Responses.add(response.url());
    }
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("status of 429")) {
      const text = msg.text();
      const isLocalHmrNoise =
        text.includes("ws://127.0.0.1:24678/") ||
        text.includes("Connecting to 'ws://127.0.0.1:24678") ||
        (text.includes("Failed to load resource: the server responded with a status of 400") &&
          Array.from(localHmr400Responses).some((url) => url.includes("127.0.0.1:24678")));
      if (!isLocalHmrNoise) errors.push(`console: ${text}`);
    }
  });

  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });

  await expect(page.locator("#code-editor-section")).toBeVisible();
  await expect(page.locator("#code-editor-section textarea").first()).toBeVisible();
  await page.locator("#code-editor-section textarea").first().fill("console.log('phase7 🚀 <>&');");
  const editorButtons = page.locator("#code-editor-section button");
  for (let i = 0; i < await editorButtons.count(); i += 1) {
    const button = editorButtons.nth(i);
    if (await button.isEnabled().catch(() => false)) await button.click({ timeout: 3000 }).catch(() => {});
  }

  for (let id = 2; id <= 150; id += 1) {
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

      const cardText = (await card.innerText()).toLowerCase();
      const samples = cardText.includes("binary")
        ? ["01001000 01101001"]
        : cardText.includes("hexadecimal") || /\bhex\b/.test(cardText)
          ? ["48656c6c6f"]
          : TEXT_CASES;

      for (const sample of samples) {
        const value = type === "number" ? (sample.trim() ? "2" : "0") : sample;
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

  expect(errors, `Static tool runtime errors: ${errors.join(" | ")}; 400 responses: ${Array.from(unexpected400Responses).join(" | ")}`).toEqual([]);
});
