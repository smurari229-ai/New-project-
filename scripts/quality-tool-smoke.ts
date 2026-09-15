import { ALL_850_TOOLS } from "../src/data/tools850";

const FORBIDDEN_PLACEHOLDER_OUTPUTS = [
  "Verified active in 1000 Tools SuperHub",
  "Ready for deployment.",
  "Ready for production runtime.",
  "Generated starter output:",
  "Reference result:\nThis title has a dedicated result path",
];

const failures: string[] = [];

for (const tool of ALL_850_TOOLS) {
  let output = "";
  try {
    output = String(tool.run(tool.default1 ?? "sample", tool.default2 ?? "context"));
  } catch (error) {
    failures.push(`${tool.id} ${tool.title}: runner threw ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  if (!output.trim()) failures.push(`${tool.id} ${tool.title}: empty output`);
  for (const marker of FORBIDDEN_PLACEHOLDER_OUTPUTS) {
    if (output.includes(marker)) failures.push(`${tool.id} ${tool.title}: generic/fake placeholder output detected (${marker})`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Dynamic quality regression: ${ALL_850_TOOLS.length}/850 runners returned non-empty, tool-specific output with no generic/fake placeholder success message.`);
