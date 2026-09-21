import { createGemini, generateWithFallback, getApiKey, isTransientError, checkRateLimit } from "../_lib/gemini.js";

const MAX_CODE_LENGTH = 10_000;
const MAX_LANGUAGE_LENGTH = 100;
const MAX_OUTPUT_LENGTH = 40_000;
const MAX_NOTES_LENGTH = 2_000;
const MAX_EXECUTION_TIME_LENGTH = 100;

function parseRuntimeResponse(raw) {
  const text = String(raw || "{}").trim();
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
    if (fenced) return JSON.parse(fenced);
    const objectStart = text.indexOf("{");
    const objectEnd = text.lastIndexOf("}");
    if (objectStart >= 0 && objectEnd > objectStart) {
      return JSON.parse(text.slice(objectStart, objectEnd + 1));
    }
    throw new Error("Virtual runtime returned invalid JSON.");
  }
}

function responsePayload(language, parsed, modelUsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Virtual runtime returned an invalid response object.");
  }

  const numericExitCode = Number(parsed.exitCode);
  return {
    stdout: typeof parsed.stdout === "string" ? parsed.stdout.slice(0, MAX_OUTPUT_LENGTH) : "",
    stderr: typeof parsed.stderr === "string" ? parsed.stderr.slice(0, MAX_OUTPUT_LENGTH) : "",
    exitCode: Number.isFinite(numericExitCode) ? Math.trunc(numericExitCode) : 1,
    executionTime:
      typeof parsed.executionTime === "string" && parsed.executionTime.trim()
        ? parsed.executionTime.slice(0, MAX_EXECUTION_TIME_LENGTH)
        : "0.00s",
    notes:
      typeof parsed.notes === "string" && parsed.notes.trim()
        ? parsed.notes.slice(0, MAX_NOTES_LENGTH)
        : `${language} virtual runtime (${modelUsed})`,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rate = checkRateLimit(req, "code-run", 10, 60_000);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfter));
    return res.status(429).json({ error: "Too many code-run requests. Please retry shortly." });
  }

  try {
    const { language = "text", code, customApiKey } = req.body || {};
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Code is required to run." });
    }
    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({ error: "Code exceeds the 10,000 character limit." });
    }
    if (typeof language !== "string" || !language.trim() || language.length > MAX_LANGUAGE_LENGTH) {
      return res.status(400).json({ error: "Language value is invalid." });
    }

    const apiKey = getApiKey(customApiKey);
    if (!apiKey) {
      return res.status(400).json({
        stdout: "",
        stderr: "Notice: Please configure GEMINI_API_KEY or enter your custom key in the AI Copilot panel to run non-browser languages.",
        exitCode: 1,
        executionTime: "0.00s",
        notes: "Configuration required",
      });
    }

    const ai = createGemini(apiKey);
    const normalizedLanguage = language.trim();
    const prompt = `You are a high-precision multi-language virtual compiler and execution runtime engine.
Simulate executing or compiling the following ${normalizedLanguage} code.
Accurately compute standard output (stdout), runtime warnings, standard error (stderr), and process return code.

Return ONLY a single valid JSON object with this exact schema:
{
  "stdout": "standard output string",
  "stderr": "error or warning string if any, otherwise empty string",
  "exitCode": 0,
  "executionTime": "0.05s",
  "notes": "brief compiler/interpreter note"
}

Do not include any other markdown or text outside the JSON object.

Code:
\`\`\`${normalizedLanguage.toLowerCase()}
${code.trim()}
\`\`\``;

    try {
      const { response, modelUsed } = await generateWithFallback(ai, {
        preferredModel: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });
      return res.status(200).json(responsePayload(normalizedLanguage, parseRuntimeResponse(response.text), modelUsed));
    } catch (error) {
      if (isTransientError(error)) {
        return res.status(200).json({
          stdout: "",
          stderr: "⚠️ Notice: The virtual execution engine is temporarily under high demand on Google servers. Please wait a few seconds and click 'Run' again.",
          exitCode: 1,
          executionTime: "0.00s",
          notes: "High demand spike - Retry available",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Code runner API error:", error);
    return res.status(500).json({
      stdout: "",
      stderr: `Runner Error: ${error?.message || "Execution failed"}`.slice(0, MAX_OUTPUT_LENGTH),
      exitCode: 1,
      executionTime: "0.00s",
      notes: "Execution halted",
    });
  }
}
