import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const indexSource = read("src/data/tools850/index.ts");
const repairSource = read("src/data/tools850/placeholder_repairs.ts");
const repaired956Source = read("src/data/tools850/batch9_repaired_956_1000.ts");
const metadataSource = read("src/data/toolsMetadata.ts");

const requiredBatchImports = [
  "./batch1_text",
  "./batch2_converters",
  "./batch3_math",
  "./batch4_web_security",
  "./batch5_code_dev",
  "./batch6_data_ai",
  "./batch7_design_audio",
  "./batch8_system_devops",
  "./batch9_fixed",
  "./batch9_repaired_956_1000",
];
for (const marker of requiredBatchImports) {
  if (!indexSource.includes(`from \"${marker}\"`)) {
    throw new Error(`Missing dynamic registry import: ${marker}`);
  }
}

if (!indexSource.includes("...BATCH_9_REPAIRED_956_1000")) {
  throw new Error("Concrete 956-1000 registry is not connected to ALL_850_TOOLS.");
}
if (!indexSource.includes("const expectedDynamicCount = 850")) {
  throw new Error("Tool 1000 registry verifier is missing the 850-tool dynamic count gate.");
}
if (!metadataSource.includes("TOOL_1_METADATA") || !metadataSource.includes("...STATIC_TOOLS_METADATA") || !metadataSource.includes("...DYNAMIC_METADATA_LIST")) {
  throw new Error("1-1000 metadata assembly is incomplete.");
}

const requiredPlaceholderRanges = ["[521, 550]", "[561, 650]", "[661, 750]", "[761, 850]", "[856, 950]"];
for (const range of requiredPlaceholderRanges) {
  if (!repairSource.includes(range)) throw new Error(`Missing repaired placeholder range: ${range}`);
}

const requiredRepairedMarkers = [
  "README Badges Markdown Generator",
  "GitHub Issue Template",
  "Git Branch Naming Standardizer",
  "Semantic Versioning Tag & Push Script",
  "Responsive Fluid Spacing Calculator",
  "PWA Service Worker Cache-First Runtime Strategy",
  "Web Bluetooth API Device Pairing Snippet",
  "Web NFC API NDEFReader Scan Snippet",
  "Developer Toolbox 1000 Tools Master Verifier",
];
for (const marker of requiredRepairedMarkers) {
  if (!repaired956Source.includes(marker)) throw new Error(`Missing repaired tool marker: ${marker}`);
}

if (repaired956Source.includes("Verified active in 1000 Tools SuperHub")) {
  throw new Error("Old 956-1000 placeholder output detected.");
}
if (repaired956Source.includes('console.log("Ready for deployment.")')) {
  throw new Error("Old generic placeholder implementation detected.");
}

console.log("Tool source structure check passed. Exact 1-1000 coverage is validated by runtime-tool-smoke.ts.");
