import React, { useState } from "react";
import { ToolCard } from "../ToolCard";
import { ToolCategory } from "../../types";
import {
  safeBase64Encode,
  safeBase64Decode,
  generateUUIDv4,
  textToSlug,
  decodeJWTToken,
} from "../../utils/helpers";

interface ToolsProps {
  searchQuery: string;
  selectedCategory: ToolCategory;
}

export const ToolsTextFormat: React.FC<ToolsProps> = ({
  searchQuery,
  selectedCategory,
}) => {
  // Helper to check filter visibility
  const isVisible = (id: number, title: string, category: ToolCategory, keywords: string[] = []) => {
    const matchesCategory = selectedCategory === "All" || selectedCategory === category;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      title.toLowerCase().includes(q) ||
      category.toLowerCase().includes(q) ||
      `#${id}`.includes(q) ||
      keywords.some((k) => k.toLowerCase().includes(q))
    );
  };

  // Tool 2 - Text Case Converter
  const [t2Input, setT2Input] = useState("Hello World! Welcome to Coding Super Hub.");
  const [t2Output, setT2Output] = useState("");

  // Tool 3 - Word & Character Counter
  const [t3Input, setT3Input] = useState("Coding Super Hub provides over 150 developer tools in one place.");

  // Tool 4 - JSON Formatter
  const [t4Input, setT4Input] = useState('{"name":"Coding Super Hub","tools":150,"fast":true}');
  const [t4Output, setT4Output] = useState("");
  const [t4Error, setT4Error] = useState(false);

  // Tool 5 - Base64
  const [t5Input, setT5Input] = useState("Developer Superpowers 🚀");
  const [t5Output, setT5Output] = useState("");
  const [t5Error, setT5Error] = useState(false);

  // Tool 6 - URL Encoder / Decoder
  const [t6Input, setT6Input] = useState("https://example.com/search?q=developer tools & code=100%");
  const [t6Output, setT6Output] = useState("");

  // Tool 7 - Password Generator
  const [t7Length, setT7Length] = useState(16);
  const [t7Output, setT7Output] = useState("");

  // Tool 8 - Color Converter
  const [t8Hex, setT8Hex] = useState("#2563eb");
  const [t8Output, setT8Output] = useState("");

  // Tool 9 - Timestamp Converter
  const [t9Ts, setT9Ts] = useState(String(Math.floor(Date.now() / 1000)));
  const [t9Date, setT9Date] = useState("");
  const [t9Output, setT9Output] = useState("");

  // Tool 10 - HTML Entity Encoder / Decoder
  const [t10Input, setT10Input] = useState('<div class="badge">Coding & Design</div>');
  const [t10Output, setT10Output] = useState("");

  // Tool 11 - UUID Generator
  const [t11Output, setT11Output] = useState("");

  // Tool 12 - Text to Slug
  const [t12Input, setT12Input] = useState("10 Super Fast Ways to Code in 2026!");
  const [t12Output, setT12Output] = useState("");

  // Tool 13 - Regex Tester
  const [t13Pattern, setT13Pattern] = useState("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
  const [t13Flags, setT13Flags] = useState("i");
  const [t13Text, setT13Text] = useState("developer@example.com");
  const [t13Output, setT13Output] = useState("");

  // Tool 14 - HTML Previewer
  const [t14Input, setT14Input] = useState(
    `<div style="padding:16px;background:#e0f2fe;color:#0369a1;border-radius:8px;font-family:sans-serif;"><h3>HTML Preview Active</h3><p>Instant sandbox rendering.</p></div>`
  );

  // Tool 15 - CSS Gradient Generator
  const [t15Color1, setT15Color1] = useState("#2563eb");
  const [t15Color2, setT15Color2] = useState("#9333ea");
  const [t15Angle, setT15Angle] = useState(90);

  // Tool 16 - Markdown Previewer
  const [t16Input, setT16Input] = useState(
    `# Coding Super Hub\n\n**Feature List:**\n- 150 Tools\n- *Markdown parser*\n- \`Code snippets\`\n\n> "Craftsmanship in every pixel"`
  );

  // Tool 17 - Number Base Converter
  const [t17Input, setT17Input] = useState("255");
  const [t17From, setT17From] = useState(10);
  const [t17To, setT17To] = useState(16);
  const [t17Output, setT17Output] = useState("");

  // Tool 18 - JWT Decoder
  const [t18Input, setT18Input] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik11cmFyaSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [t18Output, setT18Output] = useState("");
  const [t18Error, setT18Error] = useState(false);

  // Tool 19 - Code Minifier
  const [t19Input, setT19Input] = useState("body {\n  margin: 0;\n  padding: 0;\n}");
  const [t19Type, setT19Type] = useState<"html" | "css" | "js">("css");
  const [t19Output, setT19Output] = useState("");

  // Tool 20 - Lorem Ipsum Generator
  const [t20Count, setT20Count] = useState(3);
  const [t20Output, setT20Output] = useState("");

  return (
    <>
      {/* TOOL 2 - Text Case Converter */}
      {isVisible(2, "Text Case Converter", "Text", ["uppercase", "lowercase", "titlecase", "camelcase", "slug"]) && (
        <ToolCard
          id={2}
          title="Text Case Converter"
          category="Text"
          description="Convert text into UPPERCASE, lowercase, Title Case, camelCase, or snake_case"
          output={t2Output}
        >
          <textarea
            value={t2Input}
            onChange={(e) => setT2Input(e.target.value)}
            rows={3}
            placeholder="Enter text here..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setT2Output(t2Input.toUpperCase())}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              UPPERCASE
            </button>
            <button
              type="button"
              onClick={() => setT2Output(t2Input.toLowerCase())}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              lowercase
            </button>
            <button
              type="button"
              onClick={() =>
                setT2Output(
                  t2Input
                    .toLowerCase()
                    .split(" ")
                    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
                    .join(" ")
                )
              }
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              Title Case
            </button>
            <button
              type="button"
              onClick={() =>
                setT2Output(
                  t2Input
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                )
              }
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              camelCase
            </button>
            <button
              type="button"
              onClick={() =>
                setT2Output(
                  t2Input
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                )
              }
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              snake_case
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 3 - Word & Character Counter */}
      {isVisible(3, "Word & Character Counter", "Text", ["words", "chars", "length", "reading time"]) && (
        <ToolCard
          id={3}
          title="Word & Character Counter"
          category="Text"
          description="Real-time statistics for words, characters, whitespace, and reading estimate"
        >
          <textarea
            value={t3Input}
            onChange={(e) => setT3Input(e.target.value)}
            rows={3}
            placeholder="Type or paste your text..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Words</span>
              <strong className="text-base text-blue-600 dark:text-blue-400">
                {t3Input.trim() ? t3Input.trim().split(/\s+/).length : 0}
              </strong>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Characters</span>
              <strong className="text-base text-slate-900 dark:text-slate-100">
                {t3Input.length}
              </strong>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">No Spaces</span>
              <strong className="text-base text-slate-900 dark:text-slate-100">
                {t3Input.replace(/\s/g, "").length}
              </strong>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Read Time</span>
              <strong className="text-base text-slate-900 dark:text-slate-100">
                ~{Math.max(1, Math.ceil((t3Input.trim().split(/\s+/).length || 0) / 200))}m
              </strong>
            </div>
          </div>
        </ToolCard>
      )}

      {/* TOOL 4 - JSON Formatter */}
      {isVisible(4, "JSON Formatter", "Formatting", ["pretty", "minify", "json", "beautify"]) && (
        <ToolCard
          id={4}
          title="JSON Formatter & Minifier"
          category="Formatting"
          description="Format with 2-space indentation or minify JSON payloads"
          output={t4Output}
          isError={t4Error}
        >
          <textarea
            value={t4Input}
            onChange={(e) => setT4Input(e.target.value)}
            rows={3}
            placeholder='{"key": "value"}'
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                try {
                  const parsed = JSON.parse(t4Input);
                  setT4Output(JSON.stringify(parsed, null, 2));
                  setT4Error(false);
                } catch (e: any) {
                  setT4Output("❌ Invalid JSON: " + e.message);
                  setT4Error(true);
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              Format (Pretty)
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  const parsed = JSON.parse(t4Input);
                  setT4Output(JSON.stringify(parsed));
                  setT4Error(false);
                } catch (e: any) {
                  setT4Output("❌ Invalid JSON: " + e.message);
                  setT4Error(true);
                }
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs"
            >
              Minify
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 5 - Base64 Encoder / Decoder */}
      {isVisible(5, "Base64 Encoder / Decoder", "Converters", ["btoa", "atob", "encode", "decode"]) && (
        <ToolCard
          id={5}
          title="Base64 Encoder / Decoder"
          category="Converters"
          description="UTF-8 safe Base64 encoding and decoding"
          output={t5Output}
          isError={t5Error}
        >
          <textarea
            value={t5Input}
            onChange={(e) => setT5Input(e.target.value)}
            rows={3}
            placeholder="Enter plain text or base64..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                try {
                  setT5Output(safeBase64Encode(t5Input));
                  setT5Error(false);
                } catch {
                  setT5Output("❌ Encoding error");
                  setT5Error(true);
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  setT5Output(safeBase64Decode(t5Input));
                  setT5Error(false);
                } catch {
                  setT5Output("❌ Invalid Base64 string");
                  setT5Error(true);
                }
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs"
            >
              Decode
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 6 - URL Encoder / Decoder */}
      {isVisible(6, "URL Encoder / Decoder", "Converters", ["uri", "encodeuricomponent"]) && (
        <ToolCard
          id={6}
          title="URL Encoder / Decoder"
          category="Converters"
          description="Encode query parameters or decode URL-encoded components"
          output={t6Output}
        >
          <textarea
            value={t6Input}
            onChange={(e) => setT6Input(e.target.value)}
            rows={3}
            placeholder="Enter URL or text..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setT6Output(encodeURIComponent(t6Input))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              Encode URL
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  setT6Output(decodeURIComponent(t6Input));
                } catch {
                  setT6Output("❌ Invalid encoded URL string");
                }
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs"
            >
              Decode URL
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 7 - Password Generator */}
      {isVisible(7, "Password Generator", "Security", ["password", "random", "generator"]) && (
        <ToolCard
          id={7}
          title="Password Generator"
          category="Security"
          description="Generate cryptographically secure randomized passwords"
          output={t7Output}
        >
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 dark:text-slate-400">Length:</label>
            <input
              type="number"
              min={6}
              max={128}
              value={t7Length}
              onChange={(e) => setT7Length(Number(e.target.value))}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|";
                const array = new Uint32Array(Math.max(6, Math.min(128, t7Length)));
                crypto.getRandomValues(array);
                const pwd = Array.from(array, (x) => chars[x % chars.length]).join("");
                setT7Output(pwd);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium"
            >
              Generate Password
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 8 - Color Converter */}
      {isVisible(8, "Color Converter", "Color", ["hex", "rgb", "hsl"]) && (
        <ToolCard
          id={8}
          title="Color Converter (HEX to RGB & HSL)"
          category="Color"
          description="Convert hex colors to RGB and HSL with interactive color picker"
          output={t8Output}
        >
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={t8Hex}
              onChange={(e) => setT8Hex(e.target.value)}
              className="w-10 h-8 rounded border border-slate-300 cursor-pointer"
            />
            <input
              type="text"
              value={t8Hex}
              onChange={(e) => setT8Hex(e.target.value)}
              placeholder="#2563eb"
              className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const hex = t8Hex.trim();
                if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                  setT8Output("❌ Enter a valid 6-digit hex like #2563eb");
                  return;
                }
                const r = parseInt(hex.substring(1, 3), 16);
                const g = parseInt(hex.substring(3, 5), 16);
                const b = parseInt(hex.substring(5, 7), 16);
                setT8Output(`HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nCSS: rgba(${r}, ${g}, ${b}, 1)`);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 9 - Timestamp Converter */}
      {isVisible(9, "Timestamp Converter", "Time", ["unix", "epoch", "date"]) && (
        <ToolCard
          id={9}
          title="Unix Timestamp Converter"
          category="Time"
          description="Convert between Unix epoch timestamps and human-readable dates"
          output={t9Output}
        >
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={t9Ts}
                onChange={(e) => setT9Ts(e.target.value)}
                placeholder="Unix timestamp e.g. 1750000000"
                className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  const val = Number(t9Ts.trim());
                  if (!Number.isFinite(val)) {
                    setT9Output("❌ Enter valid numeric timestamp");
                    return;
                  }
                  const ms = t9Ts.length <= 10 ? val * 1000 : val;
                  const d = new Date(ms);
                  setT9Output(`UTC: ${d.toUTCString()}\nLocal: ${d.toLocaleString()}\nISO: ${d.toISOString()}`);
                }}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
              >
                Timestamp → Date
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={t9Date}
                onChange={(e) => setT9Date(e.target.value)}
                className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (!t9Date) {
                    setT9Output("❌ Select a date");
                    return;
                  }
                  const d = new Date(t9Date);
                  setT9Output(`Seconds: ${Math.floor(d.getTime() / 1000)}\nMilliseconds: ${d.getTime()}`);
                }}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs"
              >
                Date → Timestamp
              </button>
            </div>
          </div>
        </ToolCard>
      )}

      {/* TOOL 10 - HTML Entity Encoder / Decoder */}
      {isVisible(10, "HTML Entity Encoder / Decoder", "HTML", ["entities", "escape", "unescape"]) && (
        <ToolCard
          id={10}
          title="HTML Entity Encoder / Decoder"
          category="HTML"
          description="Convert reserved HTML characters to HTML entities (&amp;, &lt;, &gt;, &quot;)"
          output={t10Output}
        >
          <textarea
            value={t10Input}
            onChange={(e) => setT10Input(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                const encoded = t10Input
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#39;");
                setT10Output(encoded);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => {
                const doc = new DOMParser().parseFromString(t10Input, "text/html");
                setT10Output(doc.documentElement.textContent || "");
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs"
            >
              Decode
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 11 - UUID Generator */}
      {isVisible(11, "UUID Generator", "Generators", ["uuid", "guid", "v4"]) && (
        <ToolCard
          id={11}
          title="UUID v4 Generator"
          category="Generators"
          description="Generate RFC 4122 compliant version 4 UUIDs"
          output={t11Output}
        >
          <button
            type="button"
            onClick={() => setT11Output(generateUUIDv4())}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
          >
            Generate New UUID
          </button>
        </ToolCard>
      )}

      {/* TOOL 12 - Text to Slug */}
      {isVisible(12, "Text to Slug Converter", "Text", ["slug", "url", "seo"]) && (
        <ToolCard
          id={12}
          title="Text to Slug Converter"
          category="Text"
          description="Convert post titles into SEO-friendly URL slugs"
          output={t12Output}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t12Input}
              onChange={(e) => setT12Input(e.target.value)}
              placeholder="Enter title..."
              className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
            />
            <button
              type="button"
              onClick={() => setT12Output(textToSlug(t12Input))}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 13 - Regex Tester */}
      {isVisible(13, "Regex Tester", "Text", ["regular expression", "match"]) && (
        <ToolCard
          id={13}
          title="Regex Tester"
          category="Text"
          description="Test JavaScript regular expressions against input strings"
          output={t13Output}
        >
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={t13Pattern}
                onChange={(e) => setT13Pattern(e.target.value)}
                placeholder="Regex pattern..."
                className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
              />
              <input
                type="text"
                value={t13Flags}
                onChange={(e) => setT13Flags(e.target.value)}
                placeholder="Flags (gi)"
                className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <input
              type="text"
              value={t13Text}
              onChange={(e) => setT13Text(e.target.value)}
              placeholder="Test string..."
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                try {
                  const reg = new RegExp(t13Pattern, t13Flags);
                  const matches = t13Text.match(reg);
                  if (matches) {
                    setT13Output(`✅ Match found!\nMatches: ${matches.join(", ")}`);
                  } else {
                    setT13Output("❌ No match found.");
                  }
                } catch (e: any) {
                  setT13Output("❌ Invalid regex: " + e.message);
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Test Regex
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 14 - HTML Previewer */}
      {isVisible(14, "HTML Previewer", "HTML", ["sandbox", "preview", "iframe"]) && (
        <ToolCard
          id={14}
          title="HTML Previewer"
          category="HTML"
          description="Live sandbox preview of custom HTML snippets"
        >
          <textarea
            value={t14Input}
            onChange={(e) => setT14Input(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="mt-2 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white">
            <iframe
              srcDoc={t14Input}
              sandbox="allow-scripts"
              title="HTML Sandbox Preview"
              className="w-full h-32 border-none"
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 15 - CSS Gradient Generator */}
      {isVisible(15, "CSS Gradient Generator", "CSS", ["gradient", "linear-gradient"]) && (
        <ToolCard
          id={15}
          title="CSS Gradient Generator"
          category="CSS"
          description="Interactive two-color linear gradient builder"
          output={`background: linear-gradient(${t15Angle}deg, ${t15Color1}, ${t15Color2});`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-600 dark:text-slate-400">Color 1:</label>
              <input
                type="color"
                value={t15Color1}
                onChange={(e) => setT15Color1(e.target.value)}
                className="w-8 h-7 rounded border cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-600 dark:text-slate-400">Color 2:</label>
              <input
                type="color"
                value={t15Color2}
                onChange={(e) => setT15Color2(e.target.value)}
                className="w-8 h-7 rounded border cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-600 dark:text-slate-400">Angle:</label>
              <input
                type="number"
                min={0}
                max={360}
                value={t15Angle}
                onChange={(e) => setT15Angle(Number(e.target.value))}
                className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              />
              <span className="text-xs text-slate-500">deg</span>
            </div>
          </div>
          <div
            className="w-full h-14 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner mt-2"
            style={{
              background: `linear-gradient(${t15Angle}deg, ${t15Color1}, ${t15Color2})`,
            }}
          />
        </ToolCard>
      )}

      {/* TOOL 16 - Markdown Previewer */}
      {isVisible(16, "Markdown Previewer", "Formatting", ["markdown", "md", "preview"]) && (
        <ToolCard
          id={16}
          title="Markdown Previewer"
          category="Formatting"
          description="Live formatting of headings, lists, bold text, and code"
        >
          <textarea
            value={t16Input}
            onChange={(e) => setT16Input(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1.5 text-slate-800 dark:text-slate-200">
            {t16Input.split("\n").map((line, idx) => {
              if (line.startsWith("# ")) {
                return <h3 key={idx} className="text-sm font-bold text-blue-600 dark:text-blue-400">{line.slice(2)}</h3>;
              }
              if (line.startsWith("## ")) {
                return <h4 key={idx} className="text-xs font-bold text-slate-800 dark:text-slate-200">{line.slice(3)}</h4>;
              }
              if (line.startsWith("- ")) {
                return <li key={idx} className="ml-4 list-disc">{line.slice(2)}</li>;
              }
              if (line.startsWith("> ")) {
                return <blockquote key={idx} className="pl-3 border-l-2 border-blue-500 italic text-slate-500">{line.slice(2)}</blockquote>;
              }
              return <p key={idx}>{line}</p>;
            })}
          </div>
        </ToolCard>
      )}

      {/* TOOL 17 - Number Base Converter */}
      {isVisible(17, "Number Base Converter", "Math", ["binary", "decimal", "hexadecimal", "octal"]) && (
        <ToolCard
          id={17}
          title="Number Base Converter"
          category="Math"
          description="Convert numbers between Decimal, Binary, Hex, and Octal bases"
          output={t17Output}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={t17Input}
              onChange={(e) => setT17Input(e.target.value)}
              placeholder="Value"
              className="w-28 text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <span className="text-xs text-slate-500">From:</span>
            <select
              value={t17From}
              onChange={(e) => setT17From(Number(e.target.value))}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value={10}>Decimal (10)</option>
              <option value={2}>Binary (2)</option>
              <option value={16}>Hexadecimal (16)</option>
              <option value={8}>Octal (8)</option>
            </select>
            <span className="text-xs text-slate-500">To:</span>
            <select
              value={t17To}
              onChange={(e) => setT17To(Number(e.target.value))}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value={16}>Hexadecimal (16)</option>
              <option value={10}>Decimal (10)</option>
              <option value={2}>Binary (2)</option>
              <option value={8}>Octal (8)</option>
            </select>
            <button
              type="button"
              onClick={() => {
                const num = parseInt(t17Input.trim(), t17From);
                if (isNaN(num)) {
                  setT17Output("❌ Invalid input for selected source base");
                } else {
                  setT17Output(num.toString(t17To).toUpperCase());
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 18 - JWT Decoder */}
      {isVisible(18, "JWT Decoder", "Security", ["jwt", "token", "payload", "json web token"]) && (
        <ToolCard
          id={18}
          title="JWT Decoder"
          category="Security"
          description="Inspect header, claims payload, and expiration timestamp of JSON Web Tokens"
          output={t18Output}
          isError={t18Error}
        >
          <textarea
            value={t18Input}
            onChange={(e) => setT18Input(e.target.value)}
            rows={3}
            placeholder="Paste JWT here..."
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                const res = decodeJWTToken(t18Input);
                const expInfo =
                  res.isExpired !== undefined
                    ? res.isExpired
                      ? "\n⚠️ Token is EXPIRED"
                      : "\n✅ Token is currently ACTIVE"
                    : "";
                setT18Output(
                  `HEADER:\n${JSON.stringify(res.header, null, 2)}\n\nPAYLOAD:\n${JSON.stringify(
                    res.payload,
                    null,
                    2
                  )}${expInfo}\n\n(Note: Decoded locally; signature verification requires private key)`
                );
                setT18Error(false);
              } catch (e: any) {
                setT18Output("❌ " + e.message);
                setT18Error(true);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Decode JWT
          </button>
        </ToolCard>
      )}

      {/* TOOL 19 - Code Minifier */}
      {isVisible(19, "HTML/CSS/JS Minifier", "Formatting", ["minify", "compress", "strip"]) && (
        <ToolCard
          id={19}
          title="HTML / CSS / JS Minifier"
          category="Formatting"
          description="Strip comments and redundant whitespace from code"
          output={t19Output}
        >
          <textarea
            value={t19Input}
            onChange={(e) => setT19Input(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
          />
          <div className="flex gap-2">
            <select
              value={t19Type}
              onChange={(e) => setT19Type(e.target.value as any)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="css">CSS</option>
              <option value="html">HTML</option>
              <option value="js">JavaScript</option>
            </select>
            <button
              type="button"
              onClick={() => {
                let out = t19Input;
                if (t19Type === "html") {
                  out = out.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
                } else if (t19Type === "css") {
                  out = out.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
                } else {
                  out = out.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "").replace(/\s+/g, " ").trim();
                }
                setT19Output(out);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Minify
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 20 - Lorem Ipsum Generator */}
      {isVisible(20, "Lorem Ipsum Generator", "Generators", ["lorem", "ipsum", "placeholder text"]) && (
        <ToolCard
          id={20}
          title="Lorem Ipsum Generator"
          category="Generators"
          description="Generate placeholder filler paragraphs for layouts and mockups"
          output={t20Output}
        >
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 dark:text-slate-400">Paragraphs:</label>
            <input
              type="number"
              min={1}
              max={15}
              value={t20Count}
              onChange={(e) => setT20Count(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const sample = [
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
                  "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.",
                ];
                const res = Array.from(
                  { length: Math.max(1, Math.min(15, t20Count)) },
                  (_, i) => sample[i % sample.length]
                ).join("\n\n");
                setT20Output(res);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Lorem
            </button>
          </div>
        </ToolCard>
      )}
    </>
  );
};
