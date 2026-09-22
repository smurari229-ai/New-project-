import { GoogleGenAI } from "@google/genai";

export const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

const MAX_CUSTOM_API_KEY_LENGTH = 256;

// Lightweight per-instance guard for public AI endpoints. Vercel Firewall can
// provide stronger global protection, but this also protects the downstream
// Gemini key when a request reaches a function instance.
const rateLimitBuckets = new Map();

function getClientIp(req) {
  const forwarded = req?.headers?.["x-forwarded-for"] || req?.headers?.get?.("x-forwarded-for");
  const realIp = req?.headers?.["x-real-ip"] || req?.headers?.get?.("x-real-ip");
  return String(forwarded || realIp || "unknown").split(",")[0].trim() || "unknown";
}

export function checkRateLimit(req, scope, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const key = `${scope}:${getClientIp(req)}`;
  const existing = rateLimitBuckets.get(key);

  if (!existing || now >= existing.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

// Prevent unbounded growth in long-lived Node instances.
if (typeof setInterval === "function") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateLimitBuckets) {
      if (now >= bucket.resetAt) rateLimitBuckets.delete(key);
    }
  }, 5 * 60_000).unref?.();
}

function getGeminiErrorInfo(error) {
  const status =
    error?.status ||
    error?.code ||
    error?.error?.code ||
    error?.error?.status ||
    (error?.response ? error.response.status : undefined);
  const msg = String(
    error?.message || error?.error?.message || error || ""
  ).toLowerCase();
  return { status, msg };
}

export function isQuotaError(error) {
  const { status, msg } = getGeminiErrorInfo(error);
  return (
    status === 429 ||
    status === "RESOURCE_EXHAUSTED" ||
    msg.includes("429") ||
    msg.includes("resource has been exhausted") ||
    msg.includes("quota exceeded") ||
    msg.includes("rate limit")
  );
}

export function isTransientError(error) {
  const { status, msg } = getGeminiErrorInfo(error);
  return (
    status === 503 ||
    status === "UNAVAILABLE" ||
    msg.includes("503") ||
    msg.includes("high demand") ||
    msg.includes("unavailable") ||
    msg.includes("overloaded") ||
    msg.includes("spikes in demand are usually temporary") ||
    msg.includes("try again later")
  );
}

export async function generateWithFallback(ai, params) {
  const preferred = params.preferredModel || "gemini-3.8-flash";
  const modelsToTry = [
    preferred,
    ...CANDIDATE_MODELS.filter((model) => model !== preferred),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return { response, modelUsed: model };
      } catch (error) {
        lastError = error;
        // 429/RESOURCE_EXHAUSTED is a quota/rate-limit signal. Retrying the
        // same request across models can multiply quota consumption, so fail
        // fast and let the caller surface the real 429 to the user.
        if (isQuotaError(error)) {
          throw error;
        }
        if (isTransientError(error)) {
          const delayMs = attempt === 1 ? 600 + Math.random() * 400 : 1200;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          throw error;
        }
      }
    }
  }

  throw lastError;
}

export function getApiKey(customApiKey) {
  if (typeof customApiKey === "string" && customApiKey.trim()) {
    const key = customApiKey.trim();
    if (key.length > MAX_CUSTOM_API_KEY_LENGTH) return null;
    return key;
  }
  return process.env.GEMINI_API_KEY;
}

export function createGemini(apiKey) {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
    },
  });
}
