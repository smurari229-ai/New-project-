import { createGemini, generateWithFallback, getApiKey, isTransientError } from "../_lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, history = [], language = "javascript", customApiKey } = req.body || {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
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

    const contents = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item && item.text) {
          contents.push({
            role: item.role === "bot" || item.role === "model" ? "model" : "user",
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }
    contents.push({ role: "user", parts: [{ text: prompt.trim() }] });

    const { response, modelUsed } = await generateWithFallback(ai, {
      preferredModel: "gemini-3.8-flash",
      contents,
      config: { systemInstruction, temperature: 0.7 },
    });

    return res.status(200).json({
      answer: response.text || "No response generated.",
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
