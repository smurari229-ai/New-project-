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

// Valid models from @google/genai guidelines with high-throughput fallbacks
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

function isTransientError(error: any): boolean {
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

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.text) {
            contents.push({
              role: item.role === "bot" || item.role === "model" ? "model" : "user",
              parts: [{ text: String(item.text).slice(0, 4_000) }],
            });
          }
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

      const text = String(response.text || "No response generated.").slice(0, 40_000);
      return res.json({ answer: text, modelUsed });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      const isHighDemand = isTransientError(error);
      const userMessage = isHighDemand
        ? "This model is currently experiencing temporary high demand on Google servers. Automatic retries were attempted across fallback models. Please try again in a few seconds, or supply your personal Gemini API key in the panel settings."
        : (error?.message || "Failed to process AI request");
      return res.status(isHighDemand ? 503 : 500).json({
        error: userMessage,
        isHighDemand,
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
      if (typeof language !== "string" || language.length > 100) {
        return res.status(400).json({ error: "Language value is invalid" });
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
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a high-precision multi-language virtual compiler and execution runtime engine.
Simulate executing or compiling the following ${language} code.
Accurately compute standard output (stdout), runtime warnings, standard error (stderr), and process return code.

Return ONLY a single valid JSON object with this exact schema:
{
  "stdout": "standard output string",
  "stderr": "error or warning string if any, otherwise empty string",
  "exitCode": 0,
  "executionTime": "0.05s",
  "notes": "brief compiler/interpreter note (e.g. Python 3.12 or gcc 14.1)"
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
          config: { responseMimeType: "application/json" },
        });

        const raw = response.text || "{}";
        parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Virtual runtime returned an invalid response object.");
        }
        parsed.stdout = typeof parsed.stdout === "string" ? parsed.stdout.slice(0, 40_000) : "";
        parsed.stderr = typeof parsed.stderr === "string" ? parsed.stderr.slice(0, 40_000) : "";
        parsed.exitCode = Number.isFinite(Number(parsed.exitCode)) ? Math.trunc(Number(parsed.exitCode)) : 1;
        parsed.executionTime = typeof parsed.executionTime === "string" && parsed.executionTime.trim() ? parsed.executionTime.slice(0, 100) : "0.00s";
        parsed.notes = typeof parsed.notes === "string" && parsed.notes.trim() ? parsed.notes.slice(0, 2_000) : `${language} virtual runtime (${modelUsed})`;
      } catch (geminiErr: any) {
        if (isTransientError(geminiErr)) {
          return res.status(200).json({
            stdout: "",
            stderr: "⚠️ Notice: The virtual execution engine is temporarily under high demand on Google servers. Please wait a few seconds and click 'Run' again.",
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
        stderr: `Runner Error: ${error?.message || "Execution failed"}`.slice(0, 40_000),
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
