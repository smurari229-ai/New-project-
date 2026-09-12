import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

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
  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Coding Super Hub API" });
  });

  // Server-side Gemini AI generation endpoint
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { prompt, history = [], language = "javascript", customApiKey } = req.body;

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
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

      const systemInstruction = `You are Coding Super AI inside Coding Super Hub — an all-in-one developer workspace with 150+ developer tools, a multi-language editor, and language catalog.
Selected language context: ${language}.
Your goal:
- Act as a senior, highly competent full-stack coding copilot.
- Give accurate, modern, runnable code when asked.
- When debugging, pinpoint the exact root cause, explain clearly in brief points, and provide the complete corrected code.
- Keep explanations structured, concise, and easy to scan.
- Return Markdown with language-tagged code blocks.`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      // Add conversation history if present
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

      // Add current user prompt
      contents.push({
        role: "user",
        parts: [{ text: prompt.trim() }],
      });

      const { response, modelUsed } = await generateWithFallback(ai, {
        preferredModel: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "No response generated.";
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

  // Multi-Language Code Runner Endpoint (Python, C++, Rust, Go, Java, Bash, PHP, etc.)
  app.post("/api/code/run", async (req, res) => {
    try {
      const { language = "text", code, customApiKey } = req.body;
      if (!code || typeof code !== "string" || !code.trim()) {
        return res.status(400).json({ error: "Code is required to run." });
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
${code.slice(0, 10000)}
\`\`\``;

      let parsed;
      try {
        const { response, modelUsed } = await generateWithFallback(ai, {
          preferredModel: "gemini-3.8-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });

        const raw = response.text || "{}";
        parsed = JSON.parse(raw);
        if (!parsed.notes) {
          parsed.notes = `${language} virtual runtime (${modelUsed})`;
        }
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
        stderr: `Runner Error: ${error?.message || "Execution failed"}`,
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
