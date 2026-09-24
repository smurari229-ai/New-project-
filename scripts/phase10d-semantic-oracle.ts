import { ALL_850_TOOLS } from "../src/data/tools850";
import { safeBase64Encode, safeBase64Decode } from "../src/utils/helpers";

const failures: string[] = [];
const check = (name: string, actual: unknown, expected: unknown) => {
  if (actual !== expected) failures.push(`${name}: expected ${String(expected)}, got ${String(actual)}`);
};
const tool = (id: number) => {
  const found = ALL_850_TOOLS.find((item) => item.id === id);
  if (!found) throw new Error(`Missing dynamic tool #${id}`);
  return found;
};

// Independent deterministic oracles.
check("Base64 UTF-8 helper", safeBase64Encode("Hello 🚀"), "SGVsbG8g8J+agA==");
check("Base64 UTF-8 round-trip", safeBase64Decode("SGVsbG8g8J+agA=="), "Hello 🚀");

check("251 Base32", tool(251).run("foo"), "MZXW6===");
check("252 Base32 decode", tool(252).run("MZXW6==="), "foo");
check("255 Base64URL", tool(255).run("Hello?"), "SGVsbG8_");
check("258 binary decimal", tool(258).run("11111111"), "255");
check("265 Roman", tool(265).run("1994"), "MCMXCIV");
check("349 Celsius", tool(349).run("25"), "25°C =\n77.00°F\n298.15 K");
check("474 SHA-256", tool(474).run("hello"), "SHA-256:\n2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
check("476 CRC-32", tool(476).run("hello"), "CRC32 Hex: 0x3610A686\nInteger:   907060870");
check("497 HMAC-SHA256", tool(497).run("hello", "secret"), "HMAC-SHA256:\n88aab3ede8d3adf94d26ab90d3bafd4a2083070c3bcce9c014ee04a443847c0b\n\nVerification: Recompute this value on the receiver using the same secret.");
check("656 cosine", tool(656).run("1,0 | 0,1"), "Cosine Similarity: 0.0000 (0.0% match)\nRating: Low Similarity");
check("657 confusion matrix", tool(657).run("80,10,15,85"), "Accuracy:  86.84%\nPrecision: 88.89%\nRecall:    84.21%\nF1-Score:  0.8649");
check("661 softmax", tool(661).run("0,0"), "Softmax: [0.500000, 0.500000]");
check("662 sigmoid", tool(662).run("0"), "sigmoid(0) = 0.500000");
check("663 relu", tool(663).run("-2,3"), "ReLU(-2) = 0\nReLU(3) = 3");
check("664 MSE", tool(664).run("1,2,2,3"), "MSE: 1.000000");
check("665 RMSE", tool(665).run("1,2,2,3"), "RMSE: 1.000000");
check("666 MAE", tool(666).run("1,2,2,3"), "MAE: 1.000000");
check("659 constant", tool(659).run("5,5,5"), "Original:   [5, 5, 5]\nNormalized: [0.000, 0.000, 0.000]");
check("659 malformed", tool(659).run("10,nope,20"), "Error: Enter at least one valid number");

// Cross-range execution coverage: one tool from each dynamic range, with input-sensitive output.
const representatives: Array<[number, string, string, string?]> = [
  [151, "semantic-A", "semantic-B"],
  [251, "foo", "bar"],
  [351, "48", "35", "two-numeric"],
  [451, "Hello World", "Completely Different 98765"],
  [521, "semantic-A", "semantic-B"],
  [651, "Architect", "Developer"],
  [661, "0,0", "1,2"],
  [751, "10px 20px 30px", "0 0 0"],
  [851, "777", "000"],
  [951, "HELLO", "WORLD"],
];

for (const [id, inputA, inputB, mode] of representatives) {
  const t = tool(id);
  const a = mode === "two-numeric" ? String(t.run(inputA, "18")) : String(t.run(inputA, "alpha"));
  const b = mode === "two-numeric" ? String(t.run(inputB, "14")) : String(t.run(inputB, "beta"));
  if (!a && !b) failures.push(`#${id} returned empty output for both representative inputs`);
  if (a === b) failures.push(`#${id} produced identical output for unrelated valid inputs`);
}

// Phase 10B explicit/generic boundary checks.
for (const id of [451, 520, 521, 550, 561, 650, 651, 660, 661, 750, 761, 850, 856, 950]) {
  try { String(tool(id).run("boundary 🚀 <>&")); }
  catch (error) { failures.push(`#${id} threw: ${error instanceof Error ? error.message : String(error)}`); }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Phase 10D semantic oracle: deterministic vectors passed; representative dynamic ranges executed without identical-input collapse or uncaught exceptions.");
