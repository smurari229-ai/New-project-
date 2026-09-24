import { ALL_850_TOOLS } from "../src/data/tools850";

const forbidden = [
  "Verified active in 1000 Tools SuperHub",
  "Ready for deployment.",
  "Ready for production runtime.",
  "Generated starter output:",
  "Reference result:\nThis title has a dedicated result path",
];

const casesFor = (tool: (typeof ALL_850_TOOLS)[number]) => {
  const d1 = tool.default1 ?? "";
  const d2 = tool.default2 ?? "";
  if (tool.inputType === "action") return [["", ""]];
  if (tool.inputType === "number") return [["", d2], ["0", d2], ["-1", d2], ["999999", d2], [d1 || "2", d2]];
  if (tool.inputType === "select-text") {
    const options = tool.options ?? [];
    return [[options[0]?.value ?? d1, d2], [options.at(-1)?.value ?? d1, d2]];
  }
  if (tool.inputType === "two-inputs") return [["", ""], ["   ", "   "], ["🚀 <>&", "特殊"], [d1, d2]];
  return [["", ""], ["   ", "   "], ["🚀 <>&\"'\\/\n", "context"], ["x".repeat(2048), "context"], [d1, d2]];
};

const failures: string[] = [];
let executions = 0;

for (const tool of ALL_850_TOOLS) {
  for (const [a, b] of casesFor(tool)) {
    executions += 1;
    try {
      const output = String(tool.run(a, b));
      // Empty output can be semantically correct for transforms such as
      // removing characters/lines from empty input; quality is covered separately.
      for (const marker of forbidden) {
        if (output.includes(marker)) failures.push(`#${tool.id} ${tool.title}: forbidden generic output ${marker}`);
      }
    } catch (error) {
      failures.push(`#${tool.id} ${tool.title}: threw ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

console.log(`Dynamic edge matrix: ${executions} executions across all ${ALL_850_TOOLS.length} dynamic tools.`);
if (failures.length) {
  console.error(failures.slice(0, 50).join("\n"));
  throw new Error(`Dynamic edge matrix failed: ${failures.length} failure(s).`);
}
console.log("Dynamic edge matrix: 100% of registered dynamic tools completed all applicable edge cases without exceptions or forbidden generic output.");
