import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "src/data/tools850/batch9_repaired_956_1000.ts"), "utf8");

const ids = [...source.matchAll(/\bid:\s*(\d+)\b/g)].map((m) => Number(m[1]));
const expected = Array.from({ length: 45 }, (_, i) => 956 + i);
const missing = expected.filter((id) => !ids.includes(id));
const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];

if (ids.length !== 45) throw new Error(`Expected 45 repaired IDs, found ${ids.length}.`);
if (missing.length) throw new Error(`Missing repaired IDs: ${missing.join(", ")}`);
if (duplicates.length) throw new Error(`Duplicate repaired IDs: ${duplicates.join(", ")}`);
if (source.includes("Verified active in 1000 Tools SuperHub")) throw new Error("Old placeholder output detected.");
if (source.includes('console.log("Ready for deployment.")')) throw new Error("Old generic placeholder implementation detected.");

const requiredMarkers = [
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
for (const marker of requiredMarkers) {
  if (!source.includes(marker)) throw new Error(`Missing repaired tool marker: ${marker}`);
}

console.log("Repair smoke check passed: 45 concrete 956-1000 definitions detected.");
