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

console.log("Domain semantic smoke passed: SHA-256, CRC-32, HMAC-SHA256, PKCE format.");
