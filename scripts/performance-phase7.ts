import { ALL_850_TOOLS } from "../src/data/tools850";

const sampleFor = (tool: (typeof ALL_850_TOOLS)[number]) => ({
  first: tool.default1?.trim() || (tool.inputType === "action" ? "" : "sample input"),
  second: tool.default2?.trim() || "sample value",
});

const rounds = 3;
const timings: number[] = [];
let executions = 0;

for (let round = 1; round <= rounds; round += 1) {
  const start = performance.now();
  for (const tool of ALL_850_TOOLS) {
    const { first, second } = sampleFor(tool);
    const output = tool.run(first, second);
    if (typeof output !== "string") throw new Error(`#${tool.id} returned non-string output`);
    executions += 1;
  }
  timings.push(performance.now() - start);
}

const total = timings.reduce((a, b) => a + b, 0);
const avg = total / rounds;
const perTool = avg / ALL_850_TOOLS.length;
console.log(`Performance benchmark: ${executions} executions (${rounds} rounds × ${ALL_850_TOOLS.length} tools).`);
console.log(`Round ms: ${timings.map((n) => n.toFixed(2)).join(", ")}`);
console.log(`Average full-registry run: ${avg.toFixed(2)} ms; average per tool: ${perTool.toFixed(4)} ms.`);
