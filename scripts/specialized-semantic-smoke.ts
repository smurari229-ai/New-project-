import { safeBase64Encode, safeBase64Decode, csvToJson, HTTP_STATUS_CODES } from "../src/utils/helpers";

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

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Specialized semantic smoke passed: UTF-8 Base64, multiline/escaped CSV, and HTTP status semantics.");
