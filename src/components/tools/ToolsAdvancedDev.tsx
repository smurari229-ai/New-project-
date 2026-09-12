import React, { useState } from "react";
import { ToolCard } from "../ToolCard";
import { ToolCategory } from "../../types";
import {
  sha1Hex,
  sha384Hex,
  sha512Hex,
  hmacSha512Hex,
  simpleMd5,
} from "../../utils/crypto";
import {
  rot13,
  rot47,
  caesarCipher,
  stringToHex,
  hexToString,
} from "../../utils/helpers";

interface ToolsProps {
  searchQuery: string;
  selectedCategory: ToolCategory;
}

export const ToolsAdvancedDev: React.FC<ToolsProps> = ({
  searchQuery,
  selectedCategory,
}) => {
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

  // 101 - Text Diff
  const [t101A, setT101A] = useState("Hello World\nCoding is great");
  const [t101B, setT101B] = useState("Hello World!\nCoding is super great");
  const [t101Out, setT101Out] = useState("");

  // 102 - Text Joiner
  const [t102In, setT102In] = useState("apple\nbanana\norange");
  const [t102Delim, setT102Delim] = useState(", ");
  const [t102Out, setT102Out] = useState("");

  // 103 - Line Break Converter
  const [t103In, setT103In] = useState("First Line\r\nSecond Line\r\nThird Line");
  const [t103Out, setT103Out] = useState("");

  // 104 - Tabs <-> Spaces
  const [t104In, setT104In] = useState("    const x = 10;\n    const y = 20;");
  const [t104Out, setT104Out] = useState("");

  // 105 - Indent Formatter
  const [t105In, setT105In] = useState("function test() {\nreturn true;\n}");
  const [t105Out, setT105Out] = useState("");

  // 106 - Text Extractor
  const [t106In, setT106In] = useState("Contact us at support@example.com or admin@hub.dev for assistance.");
  const [t106Out, setT106Out] = useState("");

  // 107 - Text Trimmer
  const [t107In, setT107In] = useState("   Leading and trailing whitespace   ");
  const [t107Out, setT107Out] = useState("");

  // 108 - Number List Generator
  const [t108Start, setT108Start] = useState(1);
  const [t108End, setT108End] = useState(10);
  const [t108Step, setT108Step] = useState(1);
  const [t108Out, setT108Out] = useState("");

  // 109 - Text Padding Generator
  const [t109In, setT109In] = useState("42");
  const [t109Len, setT109Len] = useState(6);
  const [t109Char, setT109Char] = useState("0");
  const [t109Out, setT109Out] = useState("");

  // 110 - Text Wrap Converter
  const [t110In, setT110In] = useState("Coding Super Hub provides developers with over 150 real-time tools for daily workflows.");
  const [t110Width, setT110Width] = useState(30);
  const [t110Out, setT110Out] = useState("");

  // 111 - MD5
  const [t111In, setT111In] = useState("secret_message");
  const [t111Out, setT111Out] = useState("");

  // 112 - SHA-1
  const [t112In, setT112In] = useState("git commit message");
  const [t112Out, setT112Out] = useState("");

  // 113 - SHA-384
  const [t113In, setT113In] = useState("subresource_integrity_check");
  const [t113Out, setT113Out] = useState("");

  // 114 - SHA-512
  const [t114In, setT114In] = useState("high_security_hash");
  const [t114Out, setT114Out] = useState("");

  // 115 - HMAC SHA-512
  const [t115Key, setT115Key] = useState("secret_key_512");
  const [t115Msg, setT115Msg] = useState("payload_data");
  const [t115Out, setT115Out] = useState("");

  // 116 - Hex Encoder / Decoder
  const [t116In, setT116In] = useState("Super Hub");
  const [t116Out, setT116Out] = useState("");

  // 117 - ROT13
  const [t117In, setT117In] = useState("Hello World");
  const [t117Out, setT117Out] = useState("");

  // 118 - ROT47
  const [t118In, setT118In] = useState("Hello World 123!");
  const [t118Out, setT118Out] = useState("");

  // 119 - Caesar Cipher
  const [t119In, setT119In] = useState("ATTACK AT DAWN");
  const [t119Shift, setT119Shift] = useState(3);
  const [t119Out, setT119Out] = useState("");

  // 120 - AES-GCM Key Generator
  const [t120Out, setT120Out] = useState("");

  // 121 - HTTP Header Generator
  const [t121Type, setT121Type] = useState("cors");
  const [t121Out, setT121Out] = useState("");

  // 122 - cURL Request Builder
  const [t122Url, setT122Url] = useState("https://api.example.com/items");
  const [t122Method, setT122Method] = useState("POST");
  const [t122Data, setT122Data] = useState('{"title": "Tool"}');
  const [t122Out, setT122Out] = useState("");

  // 123 - HTTP Response Header Viewer
  const [t123Out, setT123Out] = useState("");

  // 124 - MIME Type Lookup
  const [t124Ext, setT124Ext] = useState("json");
  const [t124Out, setT124Out] = useState("");

  // 125 - User-Agent Parser
  const [t125Ua, setT125Ua] = useState(typeof navigator !== "undefined" ? navigator.userAgent : "");
  const [t125Out, setT125Out] = useState("");

  // 126 - URL Shortener Slug Generator
  const [t126Url, setT126Url] = useState("https://ai.studio/build/app");
  const [t126Out, setT126Out] = useState("");

  // 127 - Open Graph Meta Generator
  const [t127Title, setT127Title] = useState("Coding Super Hub");
  const [t127Img, setT127Img] = useState("https://example.com/og.png");
  const [t127Out, setT127Out] = useState("");

  // 128 - Twitter Card Generator
  const [t128Title, setT128Title] = useState("Coding Super Hub");
  const [t128Handle, setT128Handle] = useState("@developer");
  const [t128Out, setT128Out] = useState("");

  // 129 - Canonical URL Generator
  const [t129Url, setT129Url] = useState("https://example.com/page");
  const [t129Out, setT129Out] = useState("");

  // 130 - Web App Manifest Generator
  const [t130Name, setT130Name] = useState("Coding Super Hub");
  const [t130Color, setT130Color] = useState("#2563eb");
  const [t130Out, setT130Out] = useState("");

  // 131 - CSS Button Generator
  const [t131Bg, setT131Bg] = useState("#2563eb");
  const [t131Color, setT131Color] = useState("#ffffff");
  const [t131Radius, setT131Radius] = useState(8);

  // 132 - CSS Text Shadow Generator
  const [t132X, setT132X] = useState(2);
  const [t132Y, setT132Y] = useState(2);
  const [t132Blur, setT132Blur] = useState(4);

  // 133 - CSS Animation Keyframe Generator
  const [t133Name, setT133Name] = useState("fadeInUp");
  const [t133Out, setT133Out] = useState("");

  // 134 - CSS Transform Generator
  const [t134Rot, setT134Rot] = useState(15);
  const [t134Scale, setT134Scale] = useState(1.1);

  // 135 - CSS Transition Generator
  const [t135Prop, setT135Prop] = useState("all");
  const [t135Duration, setT135Duration] = useState("0.3s");
  const [t135Ease, setT135Ease] = useState("ease-in-out");

  // 136 - CSS Filter Generator
  const [t136Blur, setT136Blur] = useState(0);
  const [t136Brightness, setT136Brightness] = useState(100);
  const [t136Contrast, setT136Contrast] = useState(100);

  // 137 - CSS Glassmorphism Generator
  const [t137Blur, setT137Blur] = useState(12);
  const [t137Opacity, setT137Opacity] = useState(0.2);

  // 138 - CSS Neumorphism Generator
  const [t138Dist, setT138Dist] = useState(8);
  const [t138Blur, setT138Blur] = useState(16);

  // 139 - CSS Triangle Generator
  const [t139Dir, setT139Dir] = useState("up");
  const [t139Size, setT139Size] = useState(16);
  const [t139Color, setT139Color] = useState("#2563eb");

  // 140 - CSS Spinner Generator
  const [t140Size, setT140Size] = useState(32);
  const [t140Color, setT140Color] = useState("#2563eb");

  // 141 - JS Deep Clone Helper
  const [t141In, setT141In] = useState('{"user": {"name": "Dev", "roles": ["admin"]}}');
  const [t141Out, setT141Out] = useState("");

  // 142 - JS Array Generator
  const [t142Len, setT142Len] = useState(10);
  const [t142Out, setT142Out] = useState("");

  // 143 - Array Methods Cheat Sheet
  const [t143Method, setT143Method] = useState("map");
  const [t143Out, setT143Out] = useState("");

  // 144 - Date Helper Snippets
  const [t144Type, setT144Type] = useState("diff");
  const [t144Out, setT144Out] = useState("");

  // 145 - Debounce Function Snippet
  const [t145Out, setT145Out] = useState("");

  // 146 - Throttle Function Snippet
  const [t146Out, setT146Out] = useState("");

  // 147 - Event Listener Snippet
  const [t147Event, setT147Event] = useState("click");
  const [t147Target, setT147Target] = useState("myButton");
  const [t147Out, setT147Out] = useState("");

  // 148 - DOM Selector Generator
  const [t148Selector, setT148Selector] = useState(".nav-item");
  const [t148Out, setT148Out] = useState("");

  // 149 - LocalStorage Code Helper
  const [t149Key, setT149Key] = useState("app_settings");
  const [t149Out, setT149Out] = useState("");

  // 150 - SessionStorage Code Helper
  const [t150Key, setT150Key] = useState("auth_session");
  const [t150Out, setT150Out] = useState("");

  return (
    <>
      {/* TOOL 101 - Text Diff Checker */}
      {isVisible(101, "Text Diff Checker", "Text", ["diff", "compare", "changes"]) && (
        <ToolCard
          id={101}
          title="Text Diff Checker"
          category="Text"
          description="Compare two text blocks side-by-side to highlight additions and deletions"
          output={t101Out}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <textarea
              value={t101A}
              onChange={(e) => setT101A(e.target.value)}
              rows={3}
              placeholder="Original text..."
              className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <textarea
              value={t101B}
              onChange={(e) => setT101B(e.target.value)}
              rows={3}
              placeholder="Modified text..."
              className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const linesA = t101A.split("\n");
              const linesB = t101B.split("\n");
              const max = Math.max(linesA.length, linesB.length);
              const diff: string[] = [];
              for (let i = 0; i < max; i++) {
                const a = linesA[i];
                const b = linesB[i];
                if (a === b) {
                  diff.push(`  [Line ${i + 1}] ${a || ""}`);
                } else {
                  if (a !== undefined) diff.push(`- [Line ${i + 1}] ${a}`);
                  if (b !== undefined) diff.push(`+ [Line ${i + 1}] ${b}`);
                }
              }
              setT101Out(diff.join("\n"));
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Compare Text
          </button>
        </ToolCard>
      )}

      {/* TOOL 102 - Text Joiner */}
      {isVisible(102, "Text Joiner", "Text", ["join", "delimiter", "combine"]) && (
        <ToolCard
          id={102}
          title="Text Line Joiner"
          category="Text"
          description="Merge multiple lines using custom delimiter (e.g. comma, pipe, semicolon)"
          output={t102Out}
        >
          <textarea
            value={t102In}
            onChange={(e) => setT102In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={t102Delim}
              onChange={(e) => setT102Delim(e.target.value)}
              placeholder="Delimiter"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT102Out(t102In.split("\n").join(t102Delim));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Join Lines
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 103 - Line Break Converter */}
      {isVisible(103, "Line Break Converter", "Formatting", ["crlf", "lf", "windows", "unix"]) && (
        <ToolCard
          id={103}
          title="Line Break Converter (CRLF <-> LF)"
          category="Formatting"
          description="Convert between Windows (CRLF) and Unix / Linux (LF) line terminators"
          output={t103Out}
        >
          <textarea
            value={t103In}
            onChange={(e) => setT103In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const lf = t103In.replace(/\r\n/g, "\n");
                setT103Out(`Normalized to Unix (LF) - Length: ${lf.length} chars`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Convert to LF (Unix)
            </button>
            <button
              type="button"
              onClick={() => {
                const crlf = t103In.replace(/\r?\n/g, "\r\n");
                setT103Out(`Normalized to Windows (CRLF) - Length: ${crlf.length} chars`);
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              Convert to CRLF (Windows)
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 104 - Tabs <-> Spaces */}
      {isVisible(104, "Tabs <-> Spaces Converter", "Formatting", ["tabs", "spaces", "indentation"]) && (
        <ToolCard
          id={104}
          title="Tabs to Spaces Converter"
          category="Formatting"
          description="Convert tab indents to 2/4 spaces or vice-versa"
          output={t104Out}
        >
          <textarea
            value={t104In}
            onChange={(e) => setT104In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setT104Out(t104In.replace(/\t/g, "  "))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Tabs → 2 Spaces
            </button>
            <button
              type="button"
              onClick={() => setT104Out(t104In.replace(/\t/g, "    "))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Tabs → 4 Spaces
            </button>
            <button
              type="button"
              onClick={() => setT104Out(t104In.replace(/ {4}/g, "\t"))}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              4 Spaces → Tabs
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 105 - Indent Formatter */}
      {isVisible(105, "Indent Formatter", "Formatting", ["indent", "add spaces"]) && (
        <ToolCard
          id={105}
          title="Text Indent Formatter"
          category="Formatting"
          description="Prefix all lines with uniform indentation"
          output={t105Out}
        >
          <textarea
            value={t105In}
            onChange={(e) => setT105In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              setT105Out(t105In.split("\n").map((l) => "  " + l).join("\n"));
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Indent +2 Spaces
          </button>
        </ToolCard>
      )}

      {/* TOOL 106 - Text Extractor */}
      {isVisible(106, "Text Extractor", "Text", ["emails", "links", "urls"]) && (
        <ToolCard
          id={106}
          title="Email & URL Extractor"
          category="Text"
          description="Extract all email addresses and web URLs from unstructured text"
          output={t106Out}
        >
          <textarea
            value={t106In}
            onChange={(e) => setT106In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const emails = t106In.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
              const urls = t106In.match(/https?:\/\/[^\s]+/g) || [];
              setT106Out(`Emails Found:\n${emails.join("\n") || "None"}\n\nURLs Found:\n${urls.join("\n") || "None"}`);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Extract Links & Emails
          </button>
        </ToolCard>
      )}

      {/* TOOL 107 - Text Trimmer */}
      {isVisible(107, "Text Trimmer", "Text", ["trim", "strip spaces"]) && (
        <ToolCard
          id={107}
          title="Text Line Trimmer"
          category="Text"
          description="Trim leading and trailing spaces from every individual line"
          output={t107Out}
        >
          <textarea
            value={t107In}
            onChange={(e) => setT107In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              setT107Out(t107In.split("\n").map((l) => l.trim()).join("\n"));
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Trim Each Line
          </button>
        </ToolCard>
      )}

      {/* TOOL 108 - Number List Generator */}
      {isVisible(108, "Number List Generator", "Generators", ["sequence", "range", "numbers"]) && (
        <ToolCard
          id={108}
          title="Sequential Number List Generator"
          category="Generators"
          description="Generate list of numbers from start to end with step size"
          output={t108Out}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={t108Start}
              onChange={(e) => setT108Start(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              placeholder="Start"
            />
            <span className="text-xs">to</span>
            <input
              type="number"
              value={t108End}
              onChange={(e) => setT108End(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              placeholder="End"
            />
            <span className="text-xs">step:</span>
            <input
              type="number"
              min={1}
              value={t108Step}
              onChange={(e) => setT108Step(Number(e.target.value))}
              className="w-14 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const step = Math.max(1, t108Step);
                const nums: number[] = [];
                for (let i = t108Start; i <= t108End; i += step) nums.push(i);
                setT108Out(nums.join(", "));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 109 - Text Padding Generator */}
      {isVisible(109, "Text Padding Generator", "Text", ["padstart", "padend", "zero-fill"]) && (
        <ToolCard
          id={109}
          title="Text Padding (PadStart / PadEnd)"
          category="Text"
          description="Pad strings with characters up to target length"
          output={t109Out}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={t109In}
              onChange={(e) => setT109In(e.target.value)}
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              min={1}
              max={30}
              value={t109Len}
              onChange={(e) => setT109Len(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              maxLength={1}
              value={t109Char}
              onChange={(e) => setT109Char(e.target.value)}
              className="w-10 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-center"
            />
            <button
              type="button"
              onClick={() => setT109Out(t109In.padStart(t109Len, t109Char))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Pad Start
            </button>
            <button
              type="button"
              onClick={() => setT109Out(t109In.padEnd(t109Len, t109Char))}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              Pad End
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 110 - Text Wrap Converter */}
      {isVisible(110, "Text Wrap Converter", "Text", ["word wrap", "column width"]) && (
        <ToolCard
          id={110}
          title="Text Word-Wrap at N Columns"
          category="Text"
          description="Break long paragraphs into lines of fixed character width"
          output={t110Out}
        >
          <textarea
            value={t110In}
            onChange={(e) => setT110In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs">Max width:</span>
            <input
              type="number"
              min={10}
              max={120}
              value={t110Width}
              onChange={(e) => setT110Width(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const words = t110In.split(" ");
                const lines: string[] = [];
                let cur = "";
                words.forEach((w) => {
                  if ((cur + " " + w).trim().length <= t110Width) {
                    cur = (cur + " " + w).trim();
                  } else {
                    if (cur) lines.push(cur);
                    cur = w;
                  }
                });
                if (cur) lines.push(cur);
                setT110Out(lines.join("\n"));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Wrap Text
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 111 - MD5 Hash */}
      {isVisible(111, "MD5 Hash Generator", "Hashes", ["md5", "checksum"]) && (
        <ToolCard
          id={111}
          title="MD5 Hash Generator"
          category="Hashes"
          description="Calculate 128-bit MD5 checksum for input text"
          output={t111Out}
        >
          <input
            type="text"
            value={t111In}
            onChange={(e) => setT111In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => setT111Out(simpleMd5(t111In))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Compute MD5
          </button>
        </ToolCard>
      )}

      {/* TOOL 112 - SHA-1 Hash */}
      {isVisible(112, "SHA-1 Hash Generator", "Hashes", ["sha1", "git hash"]) && (
        <ToolCard
          id={112}
          title="SHA-1 Hash Generator"
          category="Hashes"
          description="Generate standard 160-bit cryptographic hash"
          output={t112Out}
        >
          <input
            type="text"
            value={t112In}
            onChange={(e) => setT112In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={async () => setT112Out(await sha1Hex(t112In))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Compute SHA-1
          </button>
        </ToolCard>
      )}

      {/* TOOL 113 - SHA-384 Hash */}
      {isVisible(113, "SHA-384 Hash Generator", "Hashes", ["sha384", "sri"]) && (
        <ToolCard
          id={113}
          title="SHA-384 Hash Generator"
          category="Hashes"
          description="Generate 384-bit cryptographic hash digest"
          output={t113Out}
        >
          <input
            type="text"
            value={t113In}
            onChange={(e) => setT113In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={async () => setT113Out(await sha384Hex(t113In))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Compute SHA-384
          </button>
        </ToolCard>
      )}

      {/* TOOL 114 - SHA-512 Hash */}
      {isVisible(114, "SHA-512 Hash Generator", "Hashes", ["sha512"]) && (
        <ToolCard
          id={114}
          title="SHA-512 Hash Generator"
          category="Hashes"
          description="Generate 512-bit maximum strength cryptographic hash"
          output={t114Out}
        >
          <input
            type="text"
            value={t114In}
            onChange={(e) => setT114In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={async () => setT114Out(await sha512Hex(t114In))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Compute SHA-512
          </button>
        </ToolCard>
      )}

      {/* TOOL 115 - HMAC SHA-512 */}
      {isVisible(115, "HMAC SHA-512 Generator", "Hashes", ["hmac sha512"]) && (
        <ToolCard
          id={115}
          title="HMAC SHA-512 Generator"
          category="Hashes"
          description="Create high-security HMAC authentication tag"
          output={t115Out}
        >
          <div className="space-y-2">
            <input
              type="text"
              value={t115Key}
              onChange={(e) => setT115Key(e.target.value)}
              placeholder="Key"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t115Msg}
              onChange={(e) => setT115Msg(e.target.value)}
              placeholder="Message"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={async () => setT115Out(await hmacSha512Hex(t115Key, t115Msg))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate HMAC SHA-512
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 116 - Hex Encoder / Decoder */}
      {isVisible(116, "Hex Encoder / Decoder", "Converters", ["hex to text", "text to hex"]) && (
        <ToolCard
          id={116}
          title="Hexadecimal Text Encoder / Decoder"
          category="Converters"
          description="Convert strings into hexadecimal byte pairs and decode back"
          output={t116Out}
        >
          <input
            type="text"
            value={t116In}
            onChange={(e) => setT116In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setT116Out(stringToHex(t116In))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Encode to Hex
            </button>
            <button
              type="button"
              onClick={() => setT116Out(hexToString(t116In))}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              Decode from Hex
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 117 - ROT13 */}
      {isVisible(117, "ROT13 Encoder / Decoder", "Security", ["rot13", "caesar"]) && (
        <ToolCard
          id={117}
          title="ROT13 Cipher"
          category="Security"
          description="Rotate letters by 13 positions (symmetric cipher)"
          output={t117Out}
        >
          <input
            type="text"
            value={t117In}
            onChange={(e) => setT117In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => setT117Out(rot13(t117In))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Apply ROT13
          </button>
        </ToolCard>
      )}

      {/* TOOL 118 - ROT47 */}
      {isVisible(118, "ROT47 Encoder / Decoder", "Security", ["rot47", "ascii rotate"]) && (
        <ToolCard
          id={118}
          title="ROT47 Cipher"
          category="Security"
          description="Rotate ASCII printable characters between 33 and 126 by 47"
          output={t118Out}
        >
          <input
            type="text"
            value={t118In}
            onChange={(e) => setT118In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => setT118Out(rot47(t118In))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Apply ROT47
          </button>
        </ToolCard>
      )}

      {/* TOOL 119 - Caesar Cipher */}
      {isVisible(119, "Caesar Cipher", "Security", ["caesar", "shift"]) && (
        <ToolCard
          id={119}
          title="Caesar Cipher with Custom Shift"
          category="Security"
          description="Shift alphabetic letters forward or backward by custom integer"
          output={t119Out}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={t119In}
              onChange={(e) => setT119In(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              min={-25}
              max={25}
              value={t119Shift}
              onChange={(e) => setT119Shift(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-center"
            />
            <button
              type="button"
              onClick={() => setT119Out(caesarCipher(t119In, t119Shift))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Encrypt / Shift
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 120 - AES-GCM Key Generator */}
      {isVisible(120, "AES-GCM Key Generator", "Security", ["aes", "key", "web crypto"]) && (
        <ToolCard
          id={120}
          title="AES-GCM 256-Bit Cryptographic Key Generator"
          category="Security"
          description="Generate cryptographically random 256-bit AES symmetric key in Hex"
          output={t120Out}
        >
          <button
            type="button"
            onClick={() => {
              const arr = new Uint8Array(32);
              crypto.getRandomValues(arr);
              const hex = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
              setT120Out(`AES-256 Key (Hex):\n${hex}\n\nIV / Nonce (12-byte):\n${Array.from(arr.slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("")}`);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Key & IV
          </button>
        </ToolCard>
      )}

      {/* TOOL 121 - HTTP Header Generator */}
      {isVisible(121, "HTTP Header Generator", "Security", ["cors", "csp", "security headers"]) && (
        <ToolCard
          id={121}
          title="Security HTTP Headers Generator"
          category="Security"
          description="Generate CORS, CSP, and HSTS headers for production servers"
          output={t121Out}
        >
          <div className="flex gap-2">
            <select
              value={t121Type}
              onChange={(e) => setT121Type(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="cors">CORS Headers</option>
              <option value="csp">Content-Security-Policy</option>
              <option value="hsts">Strict-Transport-Security (HSTS)</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (t121Type === "cors") {
                  setT121Out(
                    "Access-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\nAccess-Control-Allow-Headers: Content-Type, Authorization"
                  );
                } else if (t121Type === "csp") {
                  setT121Out(
                    "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
                  );
                } else {
                  setT121Out(
                    "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY"
                  );
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Headers
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 122 - cURL Request Builder */}
      {isVisible(122, "cURL Request Builder", "API", ["curl", "bash http"]) && (
        <ToolCard
          id={122}
          title="cURL Command Generator"
          category="API"
          description="Generate terminal cURL commands for API calls"
          output={t122Out}
        >
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={t122Method}
                onChange={(e) => setT122Method(e.target.value)}
                className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={t122Url}
                onChange={(e) => setT122Url(e.target.value)}
                className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const body = t122Method !== "GET" ? ` -H "Content-Type: application/json" -d '${t122Data}'` : "";
                setT122Out(`curl -X ${t122Method} "${t122Url}"${body}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate cURL
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 123 - HTTP Response Header Viewer */}
      {isVisible(123, "HTTP Response Header Viewer", "API", ["headers", "inspect"]) && (
        <ToolCard
          id={123}
          title="HTTP Response Header Inspector"
          category="API"
          description="Display standard response header schema and cache instructions"
          output={t123Out}
        >
          <button
            type="button"
            onClick={() => {
              setT123Out(
                "HTTP/1.1 200 OK\nDate: " +
                  new Date().toUTCString() +
                  "\nContent-Type: application/json; charset=utf-8\nCache-Control: public, max-age=3600\nETag: W/\"33a-1cd9aa\"\nVary: Accept-Encoding\nConnection: keep-alive"
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Show Example Headers
          </button>
        </ToolCard>
      )}

      {/* TOOL 124 - MIME Type Lookup */}
      {isVisible(124, "MIME Type Lookup", "Web", ["mime", "content-type", "extension"]) && (
        <ToolCard
          id={124}
          title="MIME Type Lookup"
          category="Web"
          description="Find Content-Type MIME strings for common file extensions"
          output={t124Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t124Ext}
              onChange={(e) => setT124Ext(e.target.value)}
              placeholder="e.g. json, png, pdf, mp4"
              className="w-32 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const map: Record<string, string> = {
                  json: "application/json",
                  html: "text/html",
                  css: "text/css",
                  js: "application/javascript",
                  ts: "application/typescript",
                  png: "image/png",
                  jpg: "image/jpeg",
                  jpeg: "image/jpeg",
                  svg: "image/svg+xml",
                  pdf: "application/pdf",
                  zip: "application/zip",
                  mp4: "video/mp4",
                  mp3: "audio/mpeg",
                  woff2: "font/woff2",
                };
                const clean = t124Ext.trim().toLowerCase().replace(/^\./, "");
                setT124Out(map[clean] || `Unknown MIME type for .${clean}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Lookup MIME
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 125 - User-Agent Parser */}
      {isVisible(125, "User-Agent Parser", "Utilities", ["user-agent", "browser engine"]) && (
        <ToolCard
          id={125}
          title="User-Agent Parser"
          category="Utilities"
          description="Inspect browser engine and OS version tokens from UA string"
          output={t125Out}
        >
          <textarea
            value={t125Ua}
            onChange={(e) => setT125Ua(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const isChrome = /Chrome/.test(t125Ua) && !/Edg/.test(t125Ua);
              const isFirefox = /Firefox/.test(t125Ua);
              const isSafari = /Safari/.test(t125Ua) && !/Chrome/.test(t125Ua);
              const isEdge = /Edg/.test(t125Ua);
              const isMobile = /Mobile|Android|iPhone/.test(t125Ua);
              setT125Out(
                `Browser: ${
                  isChrome
                    ? "Google Chrome"
                    : isFirefox
                    ? "Mozilla Firefox"
                    : isSafari
                    ? "Apple Safari"
                    : isEdge
                    ? "Microsoft Edge"
                    : "Other / Unknown"
                }\nDevice Category: ${isMobile ? "Mobile / Tablet" : "Desktop"}`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Parse User-Agent
          </button>
        </ToolCard>
      )}

      {/* TOOL 126 - URL Shortener Slug Generator */}
      {isVisible(126, "URL Shortener Generator", "Web", ["shortener", "hashid", "slug"]) && (
        <ToolCard
          id={126}
          title="URL Shortener Hash Slug Generator"
          category="Web"
          description="Generate base62 short slug from destination URL"
          output={t126Out}
        >
          <input
            type="text"
            value={t126Url}
            onChange={(e) => setT126Url(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              let hash = 0;
              for (let i = 0; i < t126Url.length; i++) {
                hash = (hash << 5) - hash + t126Url.charCodeAt(i);
                hash |= 0;
              }
              const slug = Math.abs(hash).toString(36).slice(0, 6);
              setT126Out(`Short Slug: ${slug}\nExample URL: https://hub.to/${slug}`);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Slug
          </button>
        </ToolCard>
      )}

      {/* TOOL 127 - Open Graph Meta Generator */}
      {isVisible(127, "Open Graph Meta Generator", "Web", ["og:image", "facebook", "linkedin"]) && (
        <ToolCard
          id={127}
          title="Open Graph Social Preview Meta Tags"
          category="Web"
          description="Generate standard og:title, og:image, and og:type tags"
          output={t127Out}
        >
          <div className="space-y-2">
            <input
              type="text"
              value={t127Title}
              onChange={(e) => setT127Title(e.target.value)}
              placeholder="Title"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t127Img}
              onChange={(e) => setT127Img(e.target.value)}
              placeholder="Image URL"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT127Out(
                  `<meta property="og:type" content="website">\n<meta property="og:title" content="${t127Title}">\n<meta property="og:image" content="${t127Img}">`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate OG Meta
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 128 - Twitter Card Generator */}
      {isVisible(128, "Twitter Card Generator", "Web", ["twitter:card", "social cards"]) && (
        <ToolCard
          id={128}
          title="Twitter / X Card Meta Tags"
          category="Web"
          description="Generate summary_large_image card tags"
          output={t128Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t128Title}
              onChange={(e) => setT128Title(e.target.value)}
              placeholder="Title"
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t128Handle}
              onChange={(e) => setT128Handle(e.target.value)}
              placeholder="@handle"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT128Out(
                  `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:site" content="${t128Handle}">\n<meta name="twitter:title" content="${t128Title}">`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 129 - Canonical URL Generator */}
      {isVisible(129, "Canonical URL Generator", "Web", ["canonical", "duplicate content"]) && (
        <ToolCard
          id={129}
          title="Canonical Link Element Generator"
          category="Web"
          description="Generate link rel=canonical tags to avoid search engine duplicate indexing"
          output={t129Out}
        >
          <input
            type="text"
            value={t129Url}
            onChange={(e) => setT129Url(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => setT129Out(`<link rel="canonical" href="${t129Url}">`)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Canonical Link
          </button>
        </ToolCard>
      )}

      {/* TOOL 130 - Web Manifest Generator */}
      {isVisible(130, "Web Manifest Generator", "Web", ["manifest.json", "pwa"]) && (
        <ToolCard
          id={130}
          title="Web App Manifest.json Generator"
          category="Web"
          description="Create standard PWA manifest definition"
          output={t130Out}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={t130Name}
              onChange={(e) => setT130Name(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="color"
              value={t130Color}
              onChange={(e) => setT130Color(e.target.value)}
              className="w-8 h-7 rounded border cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                setT130Out(
                  JSON.stringify(
                    {
                      name: t130Name,
                      short_name: t130Name.slice(0, 12),
                      start_url: "/",
                      display: "standalone",
                      background_color: "#ffffff",
                      theme_color: t130Color,
                    },
                    null,
                    2
                  )
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Manifest
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 131 - CSS Button Generator */}
      {isVisible(131, "CSS Button Generator", "CSS", ["button styles", "custom button"]) && (
        <ToolCard
          id={131}
          title="CSS Button Style Generator"
          category="CSS"
          description="Generate button CSS with live preview"
          output={`background-color: ${t131Bg};\ncolor: ${t131Color};\nborder-radius: ${t131Radius}px;\npadding: 8px 16px;\nborder: none;\ncursor: pointer;`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="color"
              value={t131Bg}
              onChange={(e) => setT131Bg(e.target.value)}
              className="w-8 h-7 rounded border cursor-pointer"
            />
            <input
              type="color"
              value={t131Color}
              onChange={(e) => setT131Color(e.target.value)}
              className="w-8 h-7 rounded border cursor-pointer"
            />
            <input
              type="range"
              min={0}
              max={24}
              value={t131Radius}
              onChange={(e) => setT131Radius(Number(e.target.value))}
              className="w-24"
            />
            <button
              type="button"
              style={{
                backgroundColor: t131Bg,
                color: t131Color,
                borderRadius: `${t131Radius}px`,
              }}
              className="px-4 py-1.5 text-xs font-semibold shadow-sm ml-auto"
            >
              Sample Button
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 132 - CSS Text Shadow Generator */}
      {isVisible(132, "CSS Text Shadow Generator", "CSS", ["text-shadow", "typography glow"]) && (
        <ToolCard
          id={132}
          title="CSS Text Shadow Generator"
          category="CSS"
          description="Configure text-shadow with offsets and blur radius"
          output={`text-shadow: ${t132X}px ${t132Y}px ${t132Blur}px rgba(0, 0, 0, 0.5);`}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={t132X}
              onChange={(e) => setT132X(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t132Y}
              onChange={(e) => setT132Y(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="number"
              value={t132Blur}
              onChange={(e) => setT132Blur(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 133 - CSS Animation Keyframe Generator */}
      {isVisible(133, "CSS Animation Generator", "CSS", ["@keyframes", "animation"]) && (
        <ToolCard
          id={133}
          title="CSS @keyframes Animation Generator"
          category="CSS"
          description="Create smooth CSS animation keyframes"
          output={t133Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t133Name}
              onChange={(e) => setT133Name(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT133Out(
                  `@keyframes ${t133Name} {\n  0% {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.animated {\n  animation: ${t133Name} 0.5s ease-out forwards;\n}`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Keyframes
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 134 - CSS Transform Generator */}
      {isVisible(134, "CSS Transform Generator", "CSS", ["rotate", "scale", "transform"]) && (
        <ToolCard
          id={134}
          title="CSS Transform Generator (Rotate & Scale)"
          category="CSS"
          description="Configure 2D transform matrix rules"
          output={`transform: rotate(${t134Rot}deg) scale(${t134Scale});`}
        >
          <div className="flex items-center gap-3 text-xs">
            <span>Rot:</span>
            <input
              type="range"
              min={-180}
              max={180}
              value={t134Rot}
              onChange={(e) => setT134Rot(Number(e.target.value))}
              className="w-28"
            />
            <span>Scale:</span>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={t134Scale}
              onChange={(e) => setT134Scale(Number(e.target.value))}
              className="w-28"
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 135 - CSS Transition Generator */}
      {isVisible(135, "CSS Transition Generator", "CSS", ["transition", "timing-function"]) && (
        <ToolCard
          id={135}
          title="CSS Transition Generator"
          category="CSS"
          description="Generate smooth transition property definitions"
          output={`transition: ${t135Prop} ${t135Duration} ${t135Ease};`}
        >
          <div className="flex gap-2 text-xs">
            <input
              type="text"
              value={t135Prop}
              onChange={(e) => setT135Prop(e.target.value)}
              className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t135Duration}
              onChange={(e) => setT135Duration(e.target.value)}
              className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <select
              value={t135Ease}
              onChange={(e) => setT135Ease(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
              <option value="linear">linear</option>
            </select>
          </div>
        </ToolCard>
      )}

      {/* TOOL 136 - CSS Filter Generator */}
      {isVisible(136, "CSS Filter Generator", "CSS", ["filter", "blur", "brightness"]) && (
        <ToolCard
          id={136}
          title="CSS Filter Generator"
          category="CSS"
          description="Tune blur, brightness, and contrast filters"
          output={`filter: blur(${t136Blur}px) brightness(${t136Brightness}%) contrast(${t136Contrast}%);`}
        >
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span>Blur ({t136Blur}px)</span>
              <input
                type="range"
                min={0}
                max={20}
                value={t136Blur}
                onChange={(e) => setT136Blur(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <span>Bright ({t136Brightness}%)</span>
              <input
                type="range"
                min={50}
                max={150}
                value={t136Brightness}
                onChange={(e) => setT136Brightness(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <span>Contrast ({t136Contrast}%)</span>
              <input
                type="range"
                min={50}
                max={150}
                value={t136Contrast}
                onChange={(e) => setT136Contrast(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </ToolCard>
      )}

      {/* TOOL 137 - CSS Glassmorphism Generator */}
      {isVisible(137, "CSS Glassmorphism Generator", "CSS", ["glassmorphism", "backdrop-filter"]) && (
        <ToolCard
          id={137}
          title="CSS Glassmorphism Generator"
          category="CSS"
          description="Generate frosted glass card styles with backdrop blur"
          output={`background: rgba(255, 255, 255, ${t137Opacity});\nbackdrop-filter: blur(${t137Blur}px);\n-webkit-backdrop-filter: blur(${t137Blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.3);`}
        >
          <div className="flex items-center gap-3 text-xs">
            <span>Blur:</span>
            <input
              type="range"
              min={1}
              max={30}
              value={t137Blur}
              onChange={(e) => setT137Blur(Number(e.target.value))}
              className="w-24"
            />
            <span>Opacity:</span>
            <input
              type="range"
              min={0.05}
              max={0.8}
              step={0.05}
              value={t137Opacity}
              onChange={(e) => setT137Opacity(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 138 - CSS Neumorphism Generator */}
      {isVisible(138, "CSS Neumorphism Generator", "CSS", ["neumorphism", "soft ui"]) && (
        <ToolCard
          id={138}
          title="CSS Neumorphism Soft UI Generator"
          category="CSS"
          description="Create dual-shadow soft extruded surface styles"
          output={`background: #e0e5ec;\nbox-shadow: ${t138Dist}px ${t138Dist}px ${t138Blur}px #a3b1c6, -${t138Dist}px -${t138Dist}px ${t138Blur}px #ffffff;`}
        >
          <div className="flex items-center gap-3 text-xs">
            <span>Distance:</span>
            <input
              type="range"
              min={2}
              max={20}
              value={t138Dist}
              onChange={(e) => setT138Dist(Number(e.target.value))}
              className="w-24"
            />
            <span>Blur:</span>
            <input
              type="range"
              min={4}
              max={30}
              value={t138Blur}
              onChange={(e) => setT138Blur(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 139 - CSS Triangle Generator */}
      {isVisible(139, "CSS Triangle Generator", "CSS", ["triangle", "border hack"]) && (
        <ToolCard
          id={139}
          title="CSS Pure Border Triangle Generator"
          category="CSS"
          description="Generate clean CSS border arrows without images"
          output={`width: 0;\nheight: 0;\nborder-left: ${t139Size}px solid ${t139Dir === "right" ? t139Color : "transparent"};\nborder-right: ${t139Size}px solid ${t139Dir === "left" ? t139Color : "transparent"};\nborder-bottom: ${t139Size}px solid ${t139Dir === "up" ? t139Color : "transparent"};\nborder-top: ${t139Size}px solid ${t139Dir === "down" ? t139Color : "transparent"};`}
        >
          <div className="flex items-center gap-2 text-xs">
            <select
              value={t139Dir}
              onChange={(e) => setT139Dir(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
            <input
              type="number"
              min={4}
              max={64}
              value={t139Size}
              onChange={(e) => setT139Size(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="color"
              value={t139Color}
              onChange={(e) => setT139Color(e.target.value)}
              className="w-8 h-7 rounded border cursor-pointer"
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 140 - CSS Spinner Generator */}
      {isVisible(140, "CSS Spinner Generator", "CSS", ["spinner", "loading"]) && (
        <ToolCard
          id={140}
          title="CSS Circular Loading Spinner"
          category="CSS"
          description="Generate lightweight animated loading spinner"
          output={`.spinner {\n  width: ${t140Size}px;\n  height: ${t140Size}px;\n  border: 4px solid rgba(0, 0, 0, 0.1);\n  border-top-color: ${t140Color};\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}`}
        >
          <div className="flex items-center gap-2 text-xs">
            <input
              type="number"
              min={16}
              max={80}
              value={t140Size}
              onChange={(e) => setT140Size(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="color"
              value={t140Color}
              onChange={(e) => setT140Color(e.target.value)}
              className="w-8 h-7 rounded border cursor-pointer"
            />
            <div
              className="rounded-full animate-spin border-4 border-slate-200 ml-auto"
              style={{
                width: `${t140Size}px`,
                height: `${t140Size}px`,
                borderTopColor: t140Color,
              }}
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 141 - JS Deep Clone Helper */}
      {isVisible(141, "JS Deep Clone Helper", "JavaScript", ["clone", "structuredclone", "deep copy"]) && (
        <ToolCard
          id={141}
          title="JavaScript Deep Clone & Formatter"
          category="JavaScript"
          description="Deep clone complex nested data structures with structuredClone"
          output={t141Out}
        >
          <textarea
            value={t141In}
            onChange={(e) => setT141In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                const parsed = JSON.parse(t141In);
                const cloned = structuredClone(parsed);
                setT141Out(`// Cloned via structuredClone:\n${JSON.stringify(cloned, null, 2)}`);
              } catch (e: any) {
                setT141Out("❌ " + e.message);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Deep Clone
          </button>
        </ToolCard>
      )}

      {/* TOOL 142 - JS Array Generator */}
      {isVisible(142, "JS Array Generator", "JavaScript", ["array.from", "fill"]) && (
        <ToolCard
          id={142}
          title="JavaScript Array.from Generator"
          category="JavaScript"
          description="Create initialized arrays of length N"
          output={t142Out}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={100}
              value={t142Len}
              onChange={(e) => setT142Len(Number(e.target.value))}
              className="w-20 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const arr = Array.from({ length: t142Len }, (_, i) => i + 1);
                setT142Out(JSON.stringify(arr));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Array
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 143 - Array Methods Cheat Sheet */}
      {isVisible(143, "Array Methods Cheat Sheet", "JavaScript", ["map", "filter", "reduce", "find"]) && (
        <ToolCard
          id={143}
          title="JS Array Methods Quick Reference"
          category="JavaScript"
          description="Essential code patterns for array transformations"
          output={t143Out}
        >
          <div className="flex gap-2">
            <select
              value={t143Method}
              onChange={(e) => setT143Method(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="map">.map()</option>
              <option value="filter">.filter()</option>
              <option value="reduce">.reduce()</option>
              <option value="find">.find()</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (t143Method === "map") {
                  setT143Out("const doubled = numbers.map(n => n * 2);");
                } else if (t143Method === "filter") {
                  setT143Out("const evens = numbers.filter(n => n % 2 === 0);");
                } else if (t143Method === "reduce") {
                  setT143Out("const sum = numbers.reduce((acc, curr) => acc + curr, 0);");
                } else {
                  setT143Out("const user = users.find(u => u.id === targetId);");
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Show Example
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 144 - Date Helper Snippets */}
      {isVisible(144, "Date Helper Snippets", "JavaScript", ["date difference", "add days"]) && (
        <ToolCard
          id={144}
          title="JavaScript Date Calculation Snippets"
          category="JavaScript"
          description="Copyable snippets for adding days and calculating duration differences"
          output={t144Out}
        >
          <div className="flex gap-2">
            <select
              value={t144Type}
              onChange={(e) => setT144Type(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="diff">Days Difference</option>
              <option value="add">Add N Days</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (t144Type === "diff") {
                  setT144Out("const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));");
                } else {
                  setT144Out("const future = new Date();\nfuture.setDate(future.getDate() + 7);");
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Snippet
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 145 - Debounce Function Snippet */}
      {isVisible(145, "Debounce Function Snippet", "JavaScript", ["debounce", "rate limit", "search input"]) && (
        <ToolCard
          id={145}
          title="JavaScript Debounce Function Snippet"
          category="JavaScript"
          description="Delay function execution until typing or actions pause"
          output={t145Out}
        >
          <button
            type="button"
            onClick={() => {
              setT145Out(
                `function debounce(fn, delay = 300) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Debounce
          </button>
        </ToolCard>
      )}

      {/* TOOL 146 - Throttle Function Snippet */}
      {isVisible(146, "Throttle Function Snippet", "JavaScript", ["throttle", "scroll performance"]) && (
        <ToolCard
          id={146}
          title="JavaScript Throttle Function Snippet"
          category="JavaScript"
          description="Enforce maximum execution frequency for scroll and resize events"
          output={t146Out}
        >
          <button
            type="button"
            onClick={() => {
              setT146Out(
                `function throttle(fn, limit = 200) {\n  let waiting = false;\n  return function (...args) {\n    if (!waiting) {\n      fn.apply(this, args);\n      waiting = true;\n      setTimeout(() => (waiting = false), limit);\n    }\n  };\n}`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Throttle
          </button>
        </ToolCard>
      )}

      {/* TOOL 147 - Event Listener Snippet */}
      {isVisible(147, "Event Listener Snippet", "JavaScript", ["addeventlistener", "dom event"]) && (
        <ToolCard
          id={147}
          title="DOM Event Listener Generator"
          category="JavaScript"
          description="Generate event listeners with cleanup patterns"
          output={t147Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t147Target}
              onChange={(e) => setT147Target(e.target.value)}
              placeholder="Element variable"
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <select
              value={t147Event}
              onChange={(e) => setT147Event(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="click">click</option>
              <option value="submit">submit</option>
              <option value="keydown">keydown</option>
              <option value="change">change</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setT147Out(
                  `const handler = (event) => {\n  console.log("${t147Event} triggered", event);\n};\n${t147Target}.addEventListener("${t147Event}", handler);\n\n// Cleanup when unmounting:\n// ${t147Target}.removeEventListener("${t147Event}", handler);`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 148 - DOM Selector Generator */}
      {isVisible(148, "DOM Selector Generator", "JavaScript", ["queryselector", "queryselectorall"]) && (
        <ToolCard
          id={148}
          title="DOM Query Selector Generator"
          category="JavaScript"
          description="Generate type-safe DOM querying code"
          output={t148Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t148Selector}
              onChange={(e) => setT148Selector(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT148Out(
                  `// Single element:\nconst element = document.querySelector("${t148Selector}");\n\n// Multiple elements as Array:\nconst items = Array.from(document.querySelectorAll("${t148Selector}"));`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 149 - LocalStorage Code Helper */}
      {isVisible(149, "LocalStorage Code Helper", "JavaScript", ["localstorage", "json storage"]) && (
        <ToolCard
          id={149}
          title="LocalStorage Type-Safe Storage Helper"
          category="JavaScript"
          description="Read and write JSON objects to browser localStorage"
          output={t149Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t149Key}
              onChange={(e) => setT149Key(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT149Out(
                  `// Save item:\nlocalStorage.setItem("${t149Key}", JSON.stringify(data));\n\n// Retrieve item:\nconst raw = localStorage.getItem("${t149Key}");\nconst data = raw ? JSON.parse(raw) : null;`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Code
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 150 - SessionStorage Code Helper */}
      {isVisible(150, "SessionStorage Code Helper", "JavaScript", ["sessionstorage", "tab session"]) && (
        <ToolCard
          id={150}
          title="SessionStorage Code Helper"
          category="JavaScript"
          description="Read and write session-scoped tab storage"
          output={t150Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t150Key}
              onChange={(e) => setT150Key(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT150Out(
                  `// Save session:\nsessionStorage.setItem("${t150Key}", JSON.stringify(sessionData));\n\n// Clear on logout:\nsessionStorage.removeItem("${t150Key}");`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Code
            </button>
          </div>
        </ToolCard>
      )}
    </>
  );
};
