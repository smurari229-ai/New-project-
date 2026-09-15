// @ts-nocheck
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./scripts",
  testMatch: "static-deep-audit.spec.ts",
  timeout: 120000,
  expect: { timeout: 5000 },
  workers: 1,
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000/",
    reuseExistingServer: false,
    timeout: 120000,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
  },
});
