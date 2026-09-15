import { createGemini, generateWithFallback, getApiKey, isTransientError, checkRateLimit } from "../_lib/gemini.js";

const MAX_PROMPT_LENGTH = 20_000;
const MAX_LANGUAGE_LENGTH = 100;
const MAX_OUTPUT_LENGTH = 40_000;
const MAX_HISTORY_ITEM_LENGTH = 4_000;
const MAX_HISTORY_CONTEXT_LENGTH = 18_000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rate = checkRateLimit(req, "ai-ask", 20, 60_000);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfter));
    return res.status(429).json({ error: "Too many AI requests. Please retry shortly." });
  }

  try {
    const { prompt, history = [], language = "javascript", customApiKey } = req.body || {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ error: "Prompt exceeds the 20,000 character limit" });
    }
    if (typeof language !== "string" || language.length > MAX_LANGUAGE_LENGTH) {
      return res.status(400).json({ error: "Language value is invalid" });
    }

    const apiKey = getApiKey(customApiKey);
    if (!apiKey) {
      return res.status(400).json({
        error: "No Gemini API key available. Please configure GEMINI_API_KEY in the environment or provide a key in the AI Assistant panel.",
      });
    }

    const ai = createGemini(apiKey);
    const systemInstruction = `You are Coding Super AI inside Coding Super Hub — an all-in-one developer workspace with 1,000 developer tools, a multi-language editor, and language catalog.
Selected language context: ${language}.
Your goal:
- Act as a senior, highly competent full-stack coding copilot.
- Give accurate, modern, runnable code when asked.
- When debugging, pinpoint the exact root cause, explain clearly in brief points, and provide the complete corrected code.
- Keep explanations structured, concise, and easy to scan.
- Return Markdown with language-tagged code blocks.`;

    // Gemini 3.8 Flash migration guidance discourages prefilled model turns.
    // Preserve recent conversation context as labeled user-provided context instead.
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      const contextParts = history
        .slice(-6)
        .filter((item) => item && item.text)
        .map((item) => {
          const role = item.role === "bot" || item.role === "model" ? "Assistant" : "User";
          return `${role}: ${String(item.text).slice(0, MAX_HISTORY_ITEM_LENGTH)}`;
        });
      const context = contextParts.join("\n\n").slice(0, MAX_HISTORY_CONTEXT_LENGTH);

      if (context) {
        contents.push({
          role: "user",
          parts: [{ text: `Recent conversation context (reference only):\n\n${context}` }],
        });
      }
    }

    contents.push({ role: "user", parts: [{ text: prompt.trim().slice(0, MAX_PROMPT_LENGTH) }] });

    // Gemini 3.8 Flash no longer accepts legacy sampling parameters such as temperature.
    const { response, modelUsed } = await generateWithFallback(ai, {
      preferredModel: "gemini-3.8-flash",
      contents,
      config: { systemInstruction },
    });

    const answer = String(response.text || "No response generated.").slice(0, MAX_OUTPUT_LENGTH);
    return res.status(200).json({
      answer,
      modelUsed,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    const isHighDemand = isTransientError(error);
    return res.status(isHighDemand ? 503 : 500).json({
      error: isHighDemand
        ? "This model is currently experiencing temporary high demand on Google servers. Automatic retries were attempted across fallback models. Please try again in a few seconds, or supply your personal Gemini API key in the panel settings."
        : error?.message || "Failed to process AI request",
      isHighDemand,
    });
  }
}
