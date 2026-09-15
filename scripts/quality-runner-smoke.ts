import { ALL_850_TOOLS } from "../src/data/tools850";
import { runQualityTool } from "../src/utils/dynamicToolQuality";

const placeholders = ["Verified active in 1000 Tools SuperHub", "Ready for deployment."];
const failures: string[] = [];

for (let id = 956; id <= 1000; id += 1) {
  const tool = ALL_850_TOOLS.find((candidate) => candidate.id === id);
  if (!tool) {
    failures.push(`${id}: missing from runtime registry`);
    continue;
  }
  let output = "";
  try {
    output = runQualityTool(tool, tool.default1 ?? "sample-project", tool.default2 ?? "context");
  } catch (error) {
    failures.push(`${id}: runner threw ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }
  if (!output.trim()) failures.push(`${id}: empty output`);
  for (const placeholder of placeholders) {
    if (output.includes(placeholder)) failures.push(`${id}: generic placeholder leaked`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Final-tool quality smoke: 956/956-1000 runners passed; no generic placeholder output detected.");
