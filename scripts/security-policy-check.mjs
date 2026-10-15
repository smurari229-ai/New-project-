import fs from "node:fs";

const files = [
  "vercel.json",
  "server.ts",
  "api/_lib/gemini.js",
  "api/_lib/distributedRateLimit.js",
  "src/components/AIAssistant.tsx",
];

const sources = Object.fromEntries(
  files.map((file) => [file, fs.readFileSync(file, "utf8")])
);

if (sources["vercel.json"].includes("style-src 'self' 'unsafe-inline'")) {
  throw new Error("vercel.json still contains unsafe-inline in style-src.");
}

if (sources["server.ts"].includes("style-src 'self' 'unsafe-inline'")) {
  throw new Error("server.ts still contains unsafe-inline in style-src.");
}

if (sources["api/_lib/gemini.js"].includes("rateLimitBuckets")) {
  throw new Error("Vercel Gemini helper still contains an in-memory rate-limit map.");
}

if (sources["server.ts"].includes("const rateLimitBuckets")) {
  throw new Error("Express server still contains an in-memory rate-limit map.");
}

if (!sources["api/_lib/distributedRateLimit.js"].includes("UPSTASH_REDIS_REST_URL")) {
  throw new Error("Distributed Redis rate limiter is not configured.");
}

if (sources["src/components/AIAssistant.tsx"].includes("csh_custom_key")) {
  throw new Error("Custom Gemini API keys are still persisted in localStorage/sessionStorage.");
}

console.log("Security policy regression checks passed.");
