import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredContracts = {
  "api/health.js": ["req.method !== \"GET\"", "Cache-Control", "Allow"],
  "api/ai/ask.js": ["req.method !== \"POST\"", "checkRateLimit", "MAX_PROMPT_LENGTH"],
  "api/code/run.js": ["req.method !== \"POST\"", "parseRuntimeResponse", "MAX_CODE_LENGTH"],
  "api/_lib/gemini.js": ["checkRateLimit", "MAX_CUSTOM_API_KEY_LENGTH", "generateWithFallback"],
};

const failures = [];
for (const [file, tokens] of Object.entries(requiredContracts)) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${file}: file is missing`);
    continue;
  }
  const source = fs.readFileSync(fullPath, "utf8");
  for (const token of tokens) {
    if (!source.includes(token)) failures.push(`${file}: missing ${token}`);
  }
}

if (failures.length) {
  console.error("API contract smoke check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`API contract smoke check passed (${Object.keys(requiredContracts).length} contracts).`);
