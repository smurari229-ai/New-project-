import { safeBase64Encode, safeBase64Decode, csvToJson, HTTP_STATUS_CODES } from "../src/utils/helpers";
import { BATCH_2_CONVERTER_TOOLS } from "../src/data/tools850/batch2_converters";
import { BATCH_6_DATA_AI_TOOLS } from "../src/data/tools850/batch6_data_ai";

const failures: string[] = [];
const check = (name: string, condition: boolean, detail: string) => {
  if (!condition) failures.push(`${name}: ${detail}`);
};

const encoded = safeBase64Encode("Developer 🚀");
check("Base64 UTF-8 encode", encoded === "RGV2ZWxvcGVyIPCfmoA=", encoded);
check("Base64 UTF-8 round-trip", safeBase64Decode(encoded) === "Developer 🚀", safeBase64Decode(encoded));

const csv = 'name,note\n"Alice","Line 1\nLine 2"\n"Bob","He said ""hello"""';
const parsedCsv = csvToJson(csv);
check("CSV multiline quoted field", parsedCsv[0]?.note === "Line 1\nLine 2", JSON.stringify(parsedCsv[0]));
check("CSV escaped quote", parsedCsv[1]?.note === 'He said "hello"', JSON.stringify(parsedCsv[1]));

check("HTTP 200", HTTP_STATUS_CODES[200] === "OK", String(HTTP_STATUS_CODES[200]));
check("HTTP 429", HTTP_STATUS_CODES[429] === "Too Many Requests", String(HTTP_STATUS_CODES[429]));

const punycode = BATCH_2_CONVERTER_TOOLS.find((tool) => tool.id === 298);
check("Tool 298 exists", Boolean(punycode), "missing");
if (punycode) {
  check("Punycode München", punycode.run("xn--mnchen-3ya.de") === "Decoded Domain: münchen.de", punycode.run("xn--mnchen-3ya.de"));
  check("Punycode ASCII", punycode.run("example.com") === "Decoded Domain: example.com", punycode.run("example.com"));
  check("Punycode invalid", punycode.run("xn--") === "Error: Invalid Punycode/IDN domain", punycode.run("xn--"));
  check("Punycode empty", punycode.run("   ") === "Error: Domain is required", punycode.run("   "));
}

const minMax = BATCH_6_DATA_AI_TOOLS.find((tool) => tool.id === 659);
check("Tool 659 exists", Boolean(minMax), "missing");
if (minMax) {
  check("Min-max normal", minMax.run("10, 20, 35, 50, 90") === "Original:   [10, 20, 35, 50, 90]\nNormalized: [0.000, 0.250, 0.500, 0.750, 1.000]", minMax.run("10, 20, 35, 50, 90"));
  check("Min-max constant", minMax.run("5, 5, 5") === "Original:   [5, 5, 5]\nNormalized: [0.000, 0.000, 0.000]", minMax.run("5, 5, 5"));
  check("Min-max empty", minMax.run("   ") === "Error: Enter at least one valid number", minMax.run("   "));
}


if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Specialized semantic smoke passed: UTF-8 Base64, multiline/escaped CSV, and HTTP status semantics.");
