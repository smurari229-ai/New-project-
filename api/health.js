const REDIS_HEALTH_TIMEOUT_MS = 1_200;

function getRedisConfig() {
  const url = String(
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "",
  ).trim().replace(/\/$/, "");
  const token = String(
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "",
  ).trim();
  return url && token ? { url, token } : null;
}

async function checkRedis(config) {
  if (!config) return { status: "not_configured" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_HEALTH_TIMEOUT_MS);
  try {
    const response = await fetch(`${config.url}/ping`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      signal: controller.signal,
    });
    if (!response.ok) return { status: "unreachable" };
    const payload = await response.json();
    return String(payload?.result || "").toUpperCase() === "PONG"
      ? { status: "ok" }
      : { status: "unreachable" };
  } catch {
    return { status: "unreachable" };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(_req, res) {
  const geminiConfigured = Boolean(String(process.env.GEMINI_API_KEY || "").trim());
  const redis = await checkRedis(getRedisConfig());
  const checks = {
    geminiApiKey: geminiConfigured ? "configured_not_live_verified" : "missing",
    distributedRateLimit: redis.status,
  };
  const healthy = geminiConfigured && redis.status === "ok";

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    service: "Coding Super Hub API",
    checks,
    note: "Gemini key presence is checked; the key is not tested with a paid generation request.",
  });
}
