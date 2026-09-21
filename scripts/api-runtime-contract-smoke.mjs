const makeRes = () => {
  const headers = new Map();
  return {
    statusCode: 200,
    body: null,
    headers,
    setHeader(name, value) { headers.set(name.toLowerCase(), String(value)); },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
};

const call = async (handler, method, body = undefined) => {
  const req = { method, body, headers: {} };
  const res = makeRes();
  await handler(req, res);
  return res;
};

const { default: health } = await import("../api/health.js");
const { default: ask } = await import("../api/ai/ask.js");
const { default: run } = await import("../api/code/run.js");

const healthGet = await call(health, "GET");
if (healthGet.statusCode !== 200 || healthGet.body?.status !== "ok") {
  throw new Error("Health GET runtime contract failed.");
}
if (healthGet.headers.get("cache-control") !== "no-store") {
  throw new Error("Health endpoint cache policy failed.");
}

const healthPost = await call(health, "POST");
if (healthPost.statusCode !== 405 || healthPost.headers.get("allow") !== "GET") {
  throw new Error("Health method guard runtime contract failed.");
}

const askGet = await call(ask, "GET");
if (askGet.statusCode !== 405) throw new Error("AI ask method guard runtime contract failed.");

const askEmpty = await call(ask, "POST", {});
if (askEmpty.statusCode !== 400 || askEmpty.body?.error !== "Prompt is required") {
  throw new Error("AI ask validation runtime contract failed.");
}

const askOversized = await call(ask, "POST", { prompt: "x".repeat(20_001) });
if (askOversized.statusCode !== 400 || !String(askOversized.body?.error).includes("20,000")) {
  throw new Error("AI ask prompt limit runtime contract failed.");
}

const runGet = await call(run, "GET");
if (runGet.statusCode !== 405) throw new Error("Code runner method guard runtime contract failed.");

const runEmpty = await call(run, "POST", {});
if (runEmpty.statusCode !== 400 || runEmpty.body?.error !== "Code is required to run.") {
  throw new Error("Code runner validation runtime contract failed.");
}

const runOversized = await call(run, "POST", { code: "x".repeat(10_001) });
if (runOversized.statusCode !== 400 || !String(runOversized.body?.error).includes("10,000")) {
  throw new Error("Code runner code limit runtime contract failed.");
}

console.log("API runtime contract smoke passed (health + AI ask + code runner guards/validation).");
