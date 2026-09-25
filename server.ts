import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const MAX_JSON_BODY = "512kb";
const MAX_PROMPT_LENGTH = 20_000;
const MAX_CODE_LENGTH = 10_000;
const MAX_CUSTOM_KEY_LENGTH = 256;
const MAX_OUTPUT_LENGTH = 40_000;
const MAX_HISTORY_ITEM_LENGTH = 4_000;
const MAX_HISTORY_CONTEXT_LENGTH = 18_000;

const SUPPORTED_SIMULATED_LANGUAGES = new Set([
  "JavaScript", "TypeScript", "Python", "HTML", "CSS", "Rust", "Go", "C++", "C", "C#",
  "Java", "Kotlin", "Swift", "Dart", "PHP", "Ruby", "R", "SQL", "Bash", "PowerShell",
  "Lua", "Julia", "Solidity", "Zig", "GraphQL", "JSON", "YAML", "Markdown", "Dockerfile",
  "Elixir", "Haskell", "Scala", "Perl", "Assembly", "WebAssembly", "Vyper", "GDScript",
  "Verilog", "VHDL", "Nim", "Fortran", "COBOL", "Objective-C", "F#", "OCaml", "Move",
  "HCL / Terraform", "Protocol Buffers"
]);

// Valid models from @google/genai guidelines with high-throughput fallbacks
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

function getGeminiErrorInfo(error: any) {
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

function isQuotaError(error: any): boolean {
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

function isTransientError(error: any): boolean {
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

function getClientIp(req: express.Request): string {
  return String(req.ip || req.socket.remoteAddress || "unknown").trim() || "unknown";
}

// Lightweight per-instance protection for Render/local full-stack deployments.
// Vercel API routes have their own limiter; this keeps the alternate server path
// from exposing an unbounded Gemini request surface.
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(req: express.Request, scope: string, limit: number, windowMs = 60_000) {
  const now = Date.now();
  const key = `${scope}:${getClientIp(req)}`;
  const existing = rateLimitBuckets.get(key);
  if (!existing || now >= existing.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets) {
    if (now >= bucket.resetAt) rateLimitBuckets.delete(key);
  }
}, 5 * 60_000).unref();

function validateApiInput(promptOrCode: unknown, customApiKey: unknown, maxLength: number) {
  if (typeof promptOrCode !== "string" || !promptOrCode.trim()) return "Input is required";
  if (promptOrCode.length > maxLength) return `Input exceeds the ${maxLength.toLocaleString()} character limit`;
  if (customApiKey !== undefined && customApiKey !== null) {
    if (typeof customApiKey !== "string" || customApiKey.length > MAX_CUSTOM_KEY_LENGTH) {
      return "Custom API key is invalid or too long";
    }
  }
  return null;
}

async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    preferredModel?: string;
  }
) {
  const preferred = params.preferredModel || "gemini-3.8-flash";
  const modelsToTry = [
    preferred,
    ...CANDIDATE_MODELS.filter((m) => m !== preferred),
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return { response, modelUsed: model };
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[Gemini API] Attempt ${attempt} on model "${model}" failed: ${err?.message || err}`
        );

        if (isQuotaError(err)) {
          // A quota/rate-limit error will not be fixed by retrying across
          // models; doing so can multiply project-level quota consumption.
          throw err;
        }
        if (isTransientError(err)) {
          // Exponential backoff with jitter before retry or next model
          const delayMs = attempt === 1 ? 600 + Math.random() * 400 : 1200;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          // If fatal error (e.g. invalid key format), don't keep retrying
          throw err;
        }
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json({ limit: MAX_JSON_BODY }));

  // Match the hardened Vercel response policy on the alternate Express path.
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-Frame-Options", "DENY");
    const scriptSrc = process.env.NODE_ENV === "production" ? "script-src 'self';" : "script-src 'self' 'unsafe-inline';";
    res.setHeader("Content-Security-Policy", "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; " + scriptSrc + " style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://ipapi.co; frame-src 'self' blob:;");
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Coding Super Hub API" });
  });

  // Server-side Gemini AI generation endpoint
  app.post("/api/ai/ask", async (req, res) => {
    const rate = checkRateLimit(req, "ai-ask", 20);
    if (!rate.allowed) {
      res.setHeader("Retry-After", String(rate.retryAfter));
      return res.status(429).json({ error: "Too many AI requests. Please retry shortly." });
    }

    try {
      const { prompt, history = [], language = "javascript", customApiKey } = req.body || {};
      const validationError = validateApiInput(prompt, customApiKey, MAX_PROMPT_LENGTH);
      if (validationError) return res.status(400).json({ error: validationError });
      if (typeof language !== "string" || language.length > 100) {
        return res.status(400).json({ error: "Language value is invalid" });
      }

      const apiKey =
        (typeof customApiKey === "string" && customApiKey.trim()) ||
        process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error:
            "No Gemini API key available. Please configure GEMINI_API_KEY in the environment or provide a key in the AI Assistant panel.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          timeout: 30_000,
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are Coding Super AI inside Coding Super Hub — an all-in-one developer workspace with 1,000 developer tools, a multi-language editor, and language catalog.
Selected language context: ${language}.
Your goal:
- Act as a senior, highly competent full-stack coding copilot.
- Give accurate, modern, runnable code when asked.
- When debugging, pinpoint the exact root cause, explain clearly in brief points, and provide the complete corrected code.
- Keep explanations structured, concise, and easy to scan.
- Return Markdown with language-tagged code blocks.`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

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

      contents.push({
        role: "user",
        parts: [{ text: prompt.trim().slice(0, MAX_PROMPT_LENGTH) }],
      });

      const { response, modelUsed } = await generateWithFallback(ai, {
        preferredModel: "gemini-3.8-flash",
        contents,
        config: { systemInstruction },
      });

      const text = String(response.text || "No response generated.").slice(0, MAX_OUTPUT_LENGTH);
      return res.json({ answer: text, modelUsed });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      const isHighDemand = isTransientError(error);
      const isQuota = isQuotaError(error);
      const userMessage = isQuota
        ? "Gemini usage quota/rate limit has been reached. The request was not retried across fallback models. Please wait for the quota window to reset or use your own Gemini API key."
        : isHighDemand
          ? "This model is currently experiencing temporary high demand on Google servers. Automatic retries were attempted across fallback models. Please try again in a few seconds, or supply your personal Gemini API key in the panel settings."
          : (error?.message || "Failed to process AI request");
      return res.status(isQuota ? 429 : isHighDemand ? 503 : 500).json({
        error: userMessage,
        isHighDemand,
        isQuota,
      });
    }
  });

  // Multi-Language Code Runner Endpoint. This is intentionally AI-assisted
  // simulation, not a native compiler/runtime sandbox.
  app.post("/api/code/run", async (req, res) => {
    const rate = checkRateLimit(req, "code-run", 10);
    if (!rate.allowed) {
      res.setHeader("Retry-After", String(rate.retryAfter));
      return res.status(429).json({ error: "Too many code-run requests. Please retry shortly." });
    }

    try {
      const { language = "text", code, customApiKey } = req.body || {};
      const validationError = validateApiInput(code, customApiKey, MAX_CODE_LENGTH);
      if (validationError) return res.status(400).json({ error: validationError });
      if (
        typeof language !== "string" ||
        language.length > 100 ||
        !SUPPORTED_SIMULATED_LANGUAGES.has(language.trim())
      ) {
        return res.status(400).json({ error: "Language is not supported by the advertised editor catalog." });
      }

      const apiKey =
        (typeof customApiKey === "string" && customApiKey.trim()) ||
        process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          stdout: "",
          stderr: "Notice: Please configure GEMINI_API_KEY or enter your custom key in the AI Copilot panel to run non-browser languages.",
          exitCode: 1,
          executionTime: "0.00s",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          timeout: 30_000,
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are an AI-assisted virtual execution simulator, not a compiler or native runtime.
Simulate the expected behavior of the following ${language} code.
Do not claim that code was actually compiled or executed by a real language runtime.\nReturn a clearly simulated result with standard-output-like text, error-like text, and a simulated return code.\nNever invent a real compiler/interpreter version, runtime version, or hardware execution detail.

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
${code.trim().slice(0, MAX_CODE_LENGTH)}
\`\`\``;

      let parsed;
      try {
        const { response, modelUsed } = await generateWithFallback(ai, {
          preferredModel: "gemini-3.8-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { responseMimeType: "application/json", thinkingConfig: { thinkingLevel: "low" } },
        });

        const raw = response.text || "{}";
        parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Virtual runtime returned an invalid response object.");
        }
        parsed.stdout = typeof parsed.stdout === "string" ? parsed.stdout.slice(0, MAX_OUTPUT_LENGTH) : "";
        parsed.stderr = typeof parsed.stderr === "string" ? parsed.stderr.slice(0, MAX_OUTPUT_LENGTH) : "";
        parsed.exitCode = Number.isFinite(Number(parsed.exitCode)) ? Math.trunc(Number(parsed.exitCode)) : 1;
        parsed.executionTime = typeof parsed.executionTime === "string" && parsed.executionTime.trim() ? parsed.executionTime.slice(0, 100) : "0.00s";
        parsed.notes = typeof parsed.notes === "string" && parsed.notes.trim() ? parsed.notes.slice(0, 2_000) : `${language} simulation (${modelUsed}); AI-estimated output, not native execution`;
      } catch (geminiErr: any) {
        if (isQuotaError(geminiErr)) {
          return res.status(429).json({
            stdout: "",
            stderr: "⚠️ Gemini usage quota/rate limit reached. The request was not retried across fallback models. Please wait for the quota window to reset or use your own Gemini API key.",
            exitCode: 1,
            executionTime: "0.00s",
            notes: "Gemini quota/rate limit",
          });
        }
        if (isTransientError(geminiErr)) {
          return res.status(503).json({
            stdout: "",
            stderr: "⚠️ Notice: The virtual execution simulation is temporarily under high demand on Google servers. Please wait a few seconds and click 'Run' again.",
            exitCode: 1,
            executionTime: "0.00s",
            notes: "High demand spike - Retry available",
          });
        }
        throw geminiErr;
      }

      return res.json(parsed);
    } catch (error: any) {
      console.error("Code runner API error:", error);
      return res.status(500).json({
        stdout: "",
        stderr: `Runner Error: ${error?.message || "Execution failed"}`.slice(0, MAX_OUTPUT_LENGTH),
        exitCode: 1,
        executionTime: "0.00s",
        notes: "Execution halted",
      });
    }
  });

  // Download Full Codebase PDF Endpoint
  app.get("/api/download/codebase-pdf", (_req, res) => {
    const pdfPath = path.join(process.cwd(), "public", "CodingSuperHub_Complete_SourceCode.pdf");
    if (fs.existsSync(pdfPath)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="CodingSuperHub_Complete_SourceCode.pdf"'
      );
      const stream = fs.createReadStream(pdfPath);
      stream.pipe(res);
    } else {
      res.status(404).json({ error: "Codebase PDF not found. Please generate it first." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coding Super Hub server running on port ${PORT}`);
  });
}

startServer();
