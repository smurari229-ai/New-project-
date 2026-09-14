import { GoogleGenAI } from "@google/genai";

export const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

export function isTransientError(error) {
  const status =
    error?.status ||
    error?.code ||
    error?.error?.code ||
    error?.error?.status ||
    (error?.response ? error.response.status : undefined);
  const msg = String(
    error?.message || error?.error?.message || error || ""
  ).toLowerCase();

  return (
    status === 503 ||
    status === 429 ||
    status === "UNAVAILABLE" ||
    status === "RESOURCE_EXHAUSTED" ||
    msg.includes("503") ||
    msg.includes("429") ||
    msg.includes("high demand") ||
    msg.includes("unavailable") ||
    msg.includes("overloaded") ||
    msg.includes("resource has been exhausted") ||
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
  return (
    (typeof customApiKey === "string" && customApiKey.trim()) ||
    process.env.GEMINI_API_KEY
  );
}

export function createGemini(apiKey) {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
    },
  });
}
