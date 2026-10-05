import { GoogleGenAI } from "@google/genai";
import { checkDistributedRateLimit } from "./distributedRateLimit.js";
import { sanitizeCustomApiKey } from "./security.js";

const PRIMARY_MODEL = process.env.GEMINI_PRIMARY_MODEL || "gemini-3.8-flash";
const FALLBACK_MODELS = String(
  process.env.GEMINI_FALLBACK_MODELS || "gemini-3.7-flash,gemini-3.5-flash-lite"
)
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);

export const CANDIDATE_MODELS = [
  PRIMARY_MODEL,
  ...FALLBACK_MODELS.filter((model) => model !== PRIMARY_MODEL),
];

export function getPrimaryModel() {
  return PRIMARY_MODEL;
}

export async function checkRateLimit(req, scope, limit = 20, windowMs = 60_000) {
  return checkDistributedRateLimit(req, scope, limit, windowMs);
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
  const preferred = params.preferredModel || PRIMARY_MODEL;
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
  const key = sanitizeCustomApiKey(customApiKey);
  return key || process.env.GEMINI_API_KEY;
}

export function createGemini(apiKey) {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 30_000,
      headers: { "User-Agent": "aistudio-build" },
    },
  });
}
