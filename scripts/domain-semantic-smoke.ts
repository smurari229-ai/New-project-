import { createHash } from "node:crypto";
import { ALL_850_TOOLS } from "../src/data/tools850/index";

const byId = (id) => {
  const tool = ALL_850_TOOLS.find((item) => item.id === id);
  if (!tool) throw new Error(`Missing tool ${id}`);
  return tool;
};

const sha = byId(474).run("abc");
if (!sha.includes("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")) {
  throw new Error("Tool 474 SHA-256 known-vector check failed.");
}

const crc = byId(476).run("123456789");
if (!crc.includes("CBF43926")) {
  throw new Error("Tool 476 CRC-32 known-vector check failed.");
}

const hmac = byId(497).run("The quick brown fox jumps over the lazy dog", "key");
if (!hmac.includes("f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8")) {
  throw new Error("Tool 497 HMAC-SHA256 known-vector check failed.");
}

const pkce = byId(518).run();
const verifier = pkce.match(/code_verifier:\n([^\n]+)/)?.[1];
const challenge = pkce.match(/code_challenge:\n([^\n]+)/)?.[1];
if (!verifier || !challenge || !/^[A-Za-z0-9_-]{43}$/.test(verifier) || !/^[A-Za-z0-9_-]{43}$/.test(challenge)) {
  throw new Error("Tool 518 PKCE format check failed.");
}
const expectedChallenge = createHash("sha256").update(verifier, "utf8").digest("base64url");
if (challenge !== expectedChallenge) {
  throw new Error("Tool 518 PKCE S256 challenge does not match the generated verifier.");
}

console.log("Domain semantic smoke passed: SHA-256, CRC-32, HMAC-SHA256, PKCE format.");

const sourceMetadata = await import("../src/data/generatedToolMetadata");
const stale = sourceMetadata.DYNAMIC_TOOL_METADATA.filter((tool) =>
  tool.id === 475 || tool.id === 481 || tool.id === 483
);
const expectedLabels = new Map([
  [475, "MD5 Hash Demo (Non-cryptographic)"],
  [481, "TOTP Code Simulator (Non-cryptographic)"],
  [483, "UUID v5 Namespace Name Template"],
  [487, "SRI HTML Template Generator"],
  [497, "Webhook HMAC-SHA256 Signature Generator"],
  [517, "JWK Structure Template"],
  [518, "OAuth 2.0 PKCE Code Verifier & Challenge Generator"],
]);
for (const tool of stale) {
  if (expectedLabels.get(tool.id) !== tool.title) throw new Error(`Stale security metadata title for tool ${tool.id}: ${tool.title}`);
}
if (stale.length !== expectedLabels.size) throw new Error("Expected all audited security metadata entries to be present.");
