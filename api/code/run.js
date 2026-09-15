import { createGemini, generateWithFallback, getApiKey, isTransientError } from "../_lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { language = "text", code, customApiKey } = req.body || {};
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Code is required to run." });
    }

    const apiKey = getApiKey(customApiKey);
    if (!apiKey) {
      return res.status(400).json({
        stdout: "",
        stderr: "Notice: Please configure GEMINI_API_KEY or enter your custom key in the AI Copilot panel to run non-browser languages.",
        exitCode: 1,
        executionTime: "0.00s",
      });
    }

    const ai = createGemini(apiKey);
    const prompt = `You are a high-precision multi-language virtual compiler and execution runtime engine.
Simulate executing or compiling the following ${language} code.
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
\`\`\`${language.toLowerCase()}
${code.slice(0, 10000)}
\`\`\``;

    try {
      const { response, modelUsed } = await generateWithFallback(ai, {
        preferredModel: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (!parsed.notes) parsed.notes = `${language} virtual runtime (${modelUsed})`;
      return res.status(200).json(parsed);
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
      stderr: `Runner Error: ${error?.message || "Execution failed"}`,
      exitCode: 1,
      executionTime: "0.00s",
      notes: "Execution halted",
    });
  }
}
