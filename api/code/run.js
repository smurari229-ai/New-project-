import { createGemini, generateWithFallback, getApiKey, isTransientError, isQuotaError, checkRateLimit } from "../_lib/gemini.js";

const MAX_OUTPUT_LENGTH = 40_000;
const SUPPORTED_SIMULATED_LANGUAGES = new Set([
  "JavaScript",
  "TypeScript",
  "Alex",
  "Python",
  "HTML",
  "CSS",
  "Rust",
  "Go",
  "C++",
  "C",
  "C#",
  "Java",
  "Kotlin",
  "Swift",
  "Dart",
  "PHP",
  "Ruby",
  "R",
  "SQL",
  "Bash",
  "PowerShell",
  "Lua",
  "Julia",
  "Solidity",
  "Zig",
  "GraphQL",
  "JSON",
  "YAML",
  "Markdown",
  "Dockerfile",
  "Elixir",
  "Haskell",
  "Scala",
  "Perl",
  "Assembly",
  "WebAssembly",
  "Vyper",
  "GDScript",
  "Verilog",
  "VHDL",
  "Nim",
  "Fortran",
  "COBOL",
  "Objective-C",
  "F#",
  "OCaml",
  "Move",
  "HCL / Terraform",
  "Protocol Buffers"
]);

const MAX_NOTES_LENGTH = 2_000;
const MAX_EXECUTION_TIME_LENGTH = 100;

export default async function handler(req, res) {
  if (req.method !== "POST") {
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
    if (code.length > 10_000) {
      return res.status(400).json({ error: "Code exceeds the 10,000 character limit." });
    }
    if (
      typeof language !== "string" ||
      language.length > 100 ||
      !SUPPORTED_SIMULATED_LANGUAGES.has(language.trim())
    ) {
      return res.status(400).json({
        error: "Language is not supported by the advertised editor catalog.",
      });
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
    const prompt = `You are an AI-assisted virtual execution simulator, not a compiler or native runtime.
Simulate the expected behavior of the following ${language} code.
Do not claim that code was actually compiled or executed by a real language runtime.
Return a clearly simulated result with standard-output-like text, error-like text, and a simulated return code.
Never invent a real compiler/interpreter version, runtime version, or hardware execution detail.

Return ONLY a single valid JSON object with this exact schema:
{
  "stdout": "standard output string",
  "stderr": "error or warning string if any, otherwise empty string",
  "exitCode": 0,
  "executionTime": "0.05s",
  "notes": "brief simulation note; never a real compiler/runtime/version claim"
}

Do not include any other markdown or text outside the JSON object.

Code:
\`\`\`${language.toLowerCase()}
${code.slice(0, 10_000)}
\`\`\``;

    try {
      const { response, modelUsed } = await generateWithFallback(ai, {
        preferredModel: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json", thinkingConfig: { thinkingLevel: "low" } },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Virtual runtime returned an invalid response object.");
      }

      const stdout = typeof parsed.stdout === "string" ? parsed.stdout.slice(0, MAX_OUTPUT_LENGTH) : "";
      const stderr = typeof parsed.stderr === "string" ? parsed.stderr.slice(0, MAX_OUTPUT_LENGTH) : "";
      const numericExitCode = Number(parsed.exitCode);
      const exitCode = Number.isFinite(numericExitCode) ? Math.trunc(numericExitCode) : 1;
      const executionTime =
        typeof parsed.executionTime === "string" && parsed.executionTime.trim()
          ? parsed.executionTime.slice(0, MAX_EXECUTION_TIME_LENGTH)
          : "0.00s";
      const notes =
        typeof parsed.notes === "string" && parsed.notes.trim()
          ? parsed.notes.slice(0, MAX_NOTES_LENGTH)
          : `${language} virtual runtime (${modelUsed})`;

      return res.status(200).json({
        stdout,
        stderr,
        exitCode,
        executionTime,
        notes,
      });
    } catch (error) {
      if (isQuotaError(error)) {
        return res.status(429).json({
          stdout: "",
          stderr: "⚠️ Gemini usage quota/rate limit reached. The request was not retried across fallback models. Please wait for the quota window to reset or use your own Gemini API key.",
          exitCode: 1,
          executionTime: "0.00s",
          notes: "Gemini quota/rate limit",
        });
      }
      if (isTransientError(error)) {
        return res.status(503).json({
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
