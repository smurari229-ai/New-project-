import { createHash } from "node:crypto";

const DEFAULT_WINDOW_MS = 60_000;
const REDIS_TIMEOUT_MS = 1_500;

function getHeader(req, name) {
  const value = req?.headers?.[name] ?? req?.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export function getClientIp(req) {
  const forwarded = getHeader(req, "x-forwarded-for");
  const realIp = getHeader(req, "x-real-ip");
  const remote = req?.socket?.remoteAddress;

  return String(forwarded || realIp || remote || "unknown")
    .split(",")[0]
    .trim() || "unknown";
}

function getRedisConfig() {
  const url = String(process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/$/, "");
  const token = String(process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  return url && token ? { url, token } : null;
}

function buildKey(scope, req) {
  const identity = `${scope}:${getClientIp(req)}`;
  const digest = createHash("sha256").update(identity).digest("hex").slice(0, 32);
  return `csh:rl:${digest}`;
}

async function redisCommand(config, command, args = []) {
  const path = [command, ...args.map((value) => encodeURIComponent(String(value)))].join("/");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.url}/${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Redis REST request failed with HTTP ${response.status}`);
    }

    const payload = await response.json();
    return payload?.result;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkDistributedRateLimit(
  req,
  scope,
  limit = 20,
  windowMs = DEFAULT_WINDOW_MS,
) {
  const config = getRedisConfig();

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      return {
        allowed: false,
        retryAfter: 5,
        backendError: true,
        configured: false,
      };
    }

    return {
      allowed: true,
      retryAfter: 0,
      backendError: false,
      configured: false,
      developmentFallback: true,
    };
  }

  const key = buildKey(scope, req);
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const first = await redisCommand(config, "set", [
      key,
      "1",
      "EX",
      windowSeconds,
      "NX",
    ]);

    const count = first === "OK"
      ? 1
      : Number(await redisCommand(config, "incr", [key])) || 1;

    if (count > limit) {
      const ttl = Number(await redisCommand(config, "ttl", [key]));
      return {
        allowed: false,
        retryAfter: Math.max(1, Number.isFinite(ttl) && ttl > 0 ? ttl : windowSeconds),
        backendError: false,
        configured: true,
      };
    }

    return {
      allowed: true,
      retryAfter: 0,
      backendError: false,
      configured: true,
    };
  } catch (error) {
    console.error("[RateLimit] Distributed limiter unavailable:", error?.message || error);

    if (process.env.NODE_ENV === "production") {
      return {
        allowed: false,
        retryAfter: 5,
        backendError: true,
        configured: true,
      };
    }

    return {
      allowed: true,
      retryAfter: 0,
      backendError: false,
      configured: true,
      developmentFallback: true,
    };
  }
}
