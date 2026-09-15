import { ALL_850_TOOLS } from "../src/data/tools850/index";
import { ALL_TOOLS_METADATA } from "../src/data/toolsMetadata";

const expectedAllIds = Array.from({ length: 1000 }, (_, i) => i + 1);
const metadataIds = ALL_TOOLS_METADATA.map((tool) => tool.id);
const metadataUnique = new Set(metadataIds);

if (ALL_TOOLS_METADATA.length !== 1000) {
  throw new Error(`Expected 1000 metadata entries, found ${ALL_TOOLS_METADATA.length}.`);
}
if (metadataIds.some((id, index) => metadataIds.indexOf(id) !== index)) {
  throw new Error("Duplicate metadata tool IDs detected.");
}
if (expectedAllIds.some((id) => !metadataUnique.has(id))) {
  throw new Error("Metadata does not cover every tool ID from 1-1000.");
}

const metadataTitles = ALL_TOOLS_METADATA.map((tool) => tool.title.trim().toLowerCase()).filter(Boolean);
const duplicateTitles = [...new Set(metadataTitles.filter((title, index) => metadataTitles.indexOf(title) !== index))];
if (duplicateTitles.length) {
  throw new Error(`Duplicate tool titles detected: ${duplicateTitles.slice(0, 20).join(" | ")}`);
}

if (ALL_850_TOOLS.length !== 850) {
  throw new Error(`Expected 850 dynamic tools, found ${ALL_850_TOOLS.length}.`);
}

const dynamicIds = ALL_850_TOOLS.map((tool) => tool.id);
const dynamicUnique = new Set(dynamicIds);
for (let id = 151; id <= 1000; id += 1) {
  if (!dynamicUnique.has(id)) throw new Error(`Missing dynamic tool ${id}.`);
}
if (dynamicIds.some((id) => id < 151 || id > 1000)) {
  throw new Error("Dynamic registry contains an out-of-range tool ID.");
}
if (dynamicIds.some((id, index) => dynamicIds.indexOf(id) !== index)) {
  throw new Error("Duplicate dynamic tool IDs detected.");
}
if (!dynamicUnique.has(956) || !dynamicUnique.has(1000)) {
  throw new Error("Concrete 956-1000 repair range is not fully connected to the live registry.");
}

const tool1000 = ALL_850_TOOLS.find((tool) => tool.id === 1000);
if (!tool1000) throw new Error("Tool 1000 is missing from the live registry.");
const verifierOutput = tool1000.run("", "");
if (!verifierOutput.includes("Registry result: PASS")) {
  throw new Error(`Tool 1000 registry self-check failed:\n${verifierOutput}`);
}

const sampleFor = (tool: (typeof ALL_850_TOOLS)[number]) => {
  const first = tool.default1?.trim() || "sample input";
  const second = tool.default2?.trim() || "sample value";
  if (tool.inputType === "number") return { first: tool.default1?.trim() || "2", second };
  if (tool.inputType === "select-text") return { first: tool.default1?.trim() || tool.options?.[0]?.value || "sample", second };
  if (tool.inputType === "action") return { first: "", second: "" };
  if (tool.inputType === "two-inputs") return { first, second };
  return { first, second };
};

const failures: string[] = [];
for (const tool of ALL_850_TOOLS) {
  const { first, second } = sampleFor(tool);
  try {
    const output = tool.run(first, second);
    if (typeof output !== "string") failures.push(`#${tool.id} ${tool.title}: non-string output`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`#${tool.id} ${tool.title}: ${message}`);
  }
}

const passed = ALL_850_TOOLS.length - failures.length;
const passRate = (passed / ALL_850_TOOLS.length) * 100;
console.log(`Dynamic runtime smoke: ${passed}/${ALL_850_TOOLS.length} passed (${passRate.toFixed(2)}%).`);
console.log("Registry self-check: 1-1000 metadata, 151-1000 dynamic IDs, duplicate IDs/titles, and tool 1000 verifier passed.");

if (failures.length > 0) {
  console.error(failures.slice(0, 25).join("\n"));
  throw new Error(`Dynamic runtime smoke is not 100%: ${failures.length} tool(s) failed.`);
}

if (passRate !== 100) {
  throw new Error(`Dynamic runtime smoke is not 100%: ${passRate.toFixed(2)}%.`);
}
