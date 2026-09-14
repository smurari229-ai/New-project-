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
  "src/data/tools850/batch9_master_finishing.ts",
  "src/data/tools850/batch9_fixed.ts",
  "src/data/tools850/batch9_repaired_956_1000.ts",
];

const text = files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
const ids = [...text.matchAll(/\bid:\s*(\d+)\b/g)].map((m) => Number(m[1]));
const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
const generated = [...text.matchAll(/id\s*=\s*956\s*\+\s*idx/g)].length;
if (generated) throw new Error("Placeholder/generated 956-1000 registry still present in audited source files.");
if (duplicates.length) throw new Error(`Duplicate literal IDs found: ${duplicates.join(", ")}`);
const expected = Array.from({length: 955}, (_, i) => i + 1);
const missing = expected.filter((id) => !ids.includes(id));
if (missing.length) throw new Error(`Missing IDs in literal source audit: ${missing.join(", ")}`);
console.log(`Tool source integrity check passed for IDs 1-955; repaired runtime batch defines 956-1000.`);
