import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/data/toolsMetadata.ts",
  "src/data/tools850/batch1_text.ts",
  "src/data/tools850/batch2_converters.ts",
  "src/data/tools850/batch3_math.ts",
  "src/data/tools850/batch4_web_security.ts",
  "src/data/tools850/batch5_code_dev.ts",
  "src/data/tools850/batch6_data_ai.ts",
  "src/data/tools850/batch7_design_audio.ts",
  "src/data/tools850/batch8_system_devops.ts",
  "src/data/tools850/batch9_fixed.ts",
  "src/data/tools850/batch9_repaired_956_1000.ts",
];

const text = files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");

// Static metadata uses JSON-style `"id": N`; dynamic registries use TypeScript `id: N`.
// Only capture IDs attached to an object property named exactly `id`.
const ids = [...text.matchAll(/(?:^|[,{\n]\s*)(?:"id"|id)\s*:\s*(\d+)\b/gm)].map((m) => Number(m[1]));
const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
const expected = Array.from({ length: 1000 }, (_, i) => i + 1);
const missing = expected.filter((id) => !ids.includes(id));
const unexpected = ids.filter((id) => id < 1 || id > 1000);

if (ids.length !== 1000) throw new Error(`Expected 1000 literal tool IDs, found ${ids.length}.`);
if (duplicates.length) throw new Error(`Duplicate literal tool IDs: ${duplicates.join(", ")}`);
if (missing.length) throw new Error(`Missing literal tool IDs: ${missing.join(", ")}`);
if (unexpected.length) throw new Error(`Unexpected tool IDs: ${unexpected.join(", ")}`);
if (/id\s*=\s*956\s*\+\s*idx/.test(text)) throw new Error("Generated 956-1000 placeholder registry detected.");

console.log("Tool source integrity check passed: 1000 unique literal IDs covering 1-1000.");
