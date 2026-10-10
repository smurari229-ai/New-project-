import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { ALL_850_TOOLS } from "../src/data/tools850/index.ts";
import { ALL_TOOLS_METADATA } from "../src/data/toolsMetadata.ts";
import { CANDIDATE_MODELS, getApiKey } from "../api/_lib/gemini.js";
import { checkDistributedRateLimit } from "../api/_lib/distributedRateLimit.js";
import { sanitizeCustomApiKey } from "../api/_lib/security.js";

const root = process.cwd();

test("catalog contains exactly 1,000 unique IDs", () => {
  assert.equal(ALL_TOOLS_METADATA.length, 1000);
  const ids = ALL_TOOLS_METADATA.map((tool) => tool.id);
  assert.equal(new Set(ids).size, 1000);
  assert.deepEqual(ids, Array.from({ length: 1000 }, (_, index) => index + 1));
});

test("dynamic registry contains exactly 850 tools covering 151-1000", () => {
  assert.equal(ALL_850_TOOLS.length, 850);
  const ids = ALL_850_TOOLS.map((tool) => tool.id);
  assert.equal(new Set(ids).size, 850);
  assert.deepEqual(ids, Array.from({ length: 850 }, (_, index) => index + 151));
});

test("dynamic tools expose runnable string-producing handlers", () => {
  for (const tool of [ALL_850_TOOLS[0], ALL_850_TOOLS[50], ALL_850_TOOLS[250], ALL_850_TOOLS[499], ALL_850_TOOLS[849]]) {
    const output = tool.run(tool.default1 ?? "sample", tool.default2 ?? "context");
    assert.equal(typeof output, "string");
    assert.ok(output.trim().length > 0, `tool #${tool.id} returned empty output`);
  }
});

test("Gemini model defaults and API-key validation are hardened", () => {
  assert.equal(CANDIDATE_MODELS[0], process.env.GEMINI_PRIMARY_MODEL || "gemini-3.8-flash");
  assert.ok(CANDIDATE_MODELS.includes("gemini-3.6-flash"));
  assert.ok(CANDIDATE_MODELS.includes("gemini-3.5-flash-lite"));
  assert.equal(getApiKey("  test-key  "), "test-key");
  assert.equal(getApiKey("bad\u0000key"), process.env.GEMINI_API_KEY || undefined);
  assert.equal(sanitizeCustomApiKey("  "), null);
  assert.equal(sanitizeCustomApiKey("a".repeat(257)), null);
  assert.equal(sanitizeCustomApiKey("ok-key"), "ok-key");
});

test("distributed rate limiter fails closed in production when Redis is missing", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousUrl = process.env.UPSTASH_REDIS_REST_URL;
  const previousToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const result = await checkDistributedRateLimit(
      { headers: {}, socket: { remoteAddress: "127.0.0.1" } },
      "test",
      1,
      60_000,
    );

    assert.equal(result.allowed, false);
    assert.equal(result.backendError, true);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
    else process.env.UPSTASH_REDIS_REST_URL = previousUrl;
    if (previousToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
    else process.env.UPSTASH_REDIS_REST_TOKEN = previousToken;
  }
});

test("production security configuration is represented in repository files", () => {
  const vercel = fs.readFileSync(path.join(root, "vercel.json"), "utf8");
  const server = fs.readFileSync(path.join(root, "server.ts"), "utf8");
  const assistant = fs.readFileSync(path.join(root, "src/components/AIAssistant.tsx"), "utf8");

  assert.ok(vercel.includes("style-src 'self';"));
  assert.ok(!vercel.includes("style-src 'self' 'unsafe-inline'"));
  assert.ok(server.includes('style-src \'self\';'));
  assert.ok(!server.includes("style-src 'self' 'unsafe-inline'"));
  assert.ok(!assistant.includes('csh_custom_key'));
});
