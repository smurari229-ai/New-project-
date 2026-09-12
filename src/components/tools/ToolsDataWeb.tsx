import React, { useState } from "react";
import { ToolCard } from "../ToolCard";
import { ToolCategory } from "../../types";
import { sha256Hex, hmacSha256Hex } from "../../utils/crypto";
import {
  jsonToCsv,
  csvToJson,
  morseEncode,
  morseDecode,
  textToBinaryString,
  binaryStringToText,
  generateUUIDv4,
} from "../../utils/helpers";

interface ToolsProps {
  searchQuery: string;
  selectedCategory: ToolCategory;
}

export const ToolsDataWeb: React.FC<ToolsProps> = ({
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

  // Tool 51 - JSON Validator
  const [t51In, setT51In] = useState('{"status": "ok", "count": 10}');
  const [t51Out, setT51Out] = useState("");
  const [t51Err, setT51Err] = useState(false);

  // Tool 52 - JSON to CSV
  const [t52In, setT52In] = useState('[{"name":"Alice","age":28},{"name":"Bob","age":34}]');
  const [t52Out, setT52Out] = useState("");

  // Tool 53 - CSV to JSON
  const [t53In, setT53In] = useState("name,age\nAlice,28\nBob,34");
  const [t53Out, setT53Out] = useState("");

  // Tool 54 - JSON Sorter
  const [t54In, setT54In] = useState('{"zebra":1,"apple":2,"mango":3}');
  const [t54Out, setT54Out] = useState("");

  // Tool 55 - XML Formatter
  const [t55In, setT55In] = useState("<root><user><name>Dev</name><role>Admin</role></user></root>");
  const [t55Out, setT55Out] = useState("");

  // Tool 56 - Text Sorter
  const [t56In, setT56In] = useState("Banana\nApple\nOrange\nMango");
  const [t56Out, setT56Out] = useState("");

  // Tool 57 - Duplicate Line Remover
  const [t57In, setT57In] = useState("Line A\nLine B\nLine A\nLine C\nLine B");
  const [t57Out, setT57Out] = useState("");

  // Tool 58 - Line Counter
  const [t58In, setT58In] = useState("One\nTwo\nThree\nFour\nFive");

  // Tool 59 - Whitespace Cleaner
  const [t59In, setT59In] = useState("  Clean    excessive    spacing   and   tabs.   ");
  const [t59Out, setT59Out] = useState("");

  // Tool 60 - Reverse Text
  const [t60In, setT60In] = useState("Coding Super Hub");
  const [t60Out, setT60Out] = useState("");

  // Tool 61 - Palindrome Checker
  const [t61In, setT61In] = useState("A man a plan a canal Panama");
  const [t61Out, setT61Out] = useState("");

  // Tool 62 - Anagram Checker
  const [t62A, setT62A] = useState("listen");
  const [t62B, setT62B] = useState("silent");
  const [t62Out, setT62Out] = useState("");

  // Tool 63 - Word Frequency
  const [t63In, setT63In] = useState("code build test code deploy code");
  const [t63Out, setT63Out] = useState("");

  // Tool 64 - Text Deduplicator
  const [t64In, setT64In] = useState("apple banana apple orange banana");
  const [t64Out, setT64Out] = useState("");

  // Tool 65 - Character Frequency
  const [t65In, setT65In] = useState("developer");
  const [t65Out, setT65Out] = useState("");

  // Tool 66 - Morse Code
  const [t66In, setT66In] = useState("SOS HELLO");
  const [t66Out, setT66Out] = useState("");

  // Tool 67 - Binary Text
  const [t67In, setT67In] = useState("AI");
  const [t67Out, setT67Out] = useState("");

  // Tool 68 - SHA-256
  const [t68In, setT68In] = useState("secure_password_123");
  const [t68Out, setT68Out] = useState("");

  // Tool 69 - URL Parser
  const [t69In, setT69In] = useState("https://api.github.com:443/repos/octocat/Hello-World?filter=active#section-1");
  const [t69Out, setT69Out] = useState("");

  // Tool 70 - Query String Parser
  const [t70In, setT70In] = useState("category=tech&page=2&sort=desc&tag=react&tag=node");
  const [t70Out, setT70Out] = useState("");

  // Tool 71 - Browser Information
  const [t71Out, setT71Out] = useState("");

  // Tool 72 - Screen Info
  const [t72Out, setT72Out] = useState("");

  // Tool 73 - Meta Tag Generator
  const [t73Title, setT73Title] = useState("Coding Super Hub");
  const [t73Desc, setT73Desc] = useState("150+ developer tools & AI coding assistant in one app");
  const [t73Out, setT73Out] = useState("");

  // Tool 74 - HTML Boilerplate Generator
  const [t74Out, setT74Out] = useState("");

  // Tool 75 - CSS Reset Generator
  const [t75Out, setT75Out] = useState("");

  // Tool 76 - CSS Flexbox Generator
  const [t76Justify, setT76Justify] = useState("center");
  const [t76Align, setT76Align] = useState("center");
  const [t76Dir, setT76Dir] = useState("row");

  // Tool 77 - CSS Grid Generator
  const [t77Cols, setT77Cols] = useState(3);
  const [t77Gap, setT77Gap] = useState(16);

  // Tool 78 - Box Shadow Generator
  const [t78X, setT78X] = useState(0);
  const [t78Y, setT78Y] = useState(10);
  const [t78Blur, setT78Blur] = useState(15);
  const [t78Spread, setT78Spread] = useState(-3);

  // Tool 79 - Border Radius Generator
  const [t79Radius, setT79Radius] = useState(16);

  // Tool 80 - CSS Clamp Generator
  const [t80Min, setT80Min] = useState("1rem");
  const [t80Val, setT80Val] = useState("2.5vw");
  const [t80Max, setT80Max] = useState("2rem");

  // Tool 81 - PX to REM
  const [t81Px, setT81Px] = useState("16");
  const [t81Rem, setT81Rem] = useState("1");
  const [t81Out, setT81Out] = useState("");

  // Tool 82 - Aspect Ratio Calculator
  const [t82W, setT82W] = useState("1920");
  const [t82H, setT82H] = useState("1080");
  const [t82Out, setT82Out] = useState("");

  // Tool 83 - Random Color Generator
  const [t83Out, setT83Out] = useState("#2563eb");

  // Tool 84 - Color Contrast
  const [t84Fg, setT84Fg] = useState("#ffffff");
  const [t84Bg, setT84Bg] = useState("#2563eb");
  const [t84Out, setT84Out] = useState("");

  // Tool 85 - Data URI Generator
  const [t85In, setT85In] = useState("console.log('Hello World!');");
  const [t85Out, setT85Out] = useState("");

  // Tool 86 - Favicon Generator
  const [t86Href, setT86Href] = useState("/favicon.ico");
  const [t86Out, setT86Out] = useState("");

  // Tool 87 - Robots.txt Generator
  const [t87Site, setT87Site] = useState("https://example.com");
  const [t87Out, setT87Out] = useState("");

  // Tool 88 - Sitemap XML Generator
  const [t88Site, setT88Site] = useState("https://example.com");
  const [t88Out, setT88Out] = useState("");

  // Tool 89 - Gitignore Generator
  const [t89Type, setT89Type] = useState("node");
  const [t89Out, setT89Out] = useState("");

  // Tool 90 - README Generator
  const [t90Name, setT90Name] = useState("My Project");
  const [t90Desc, setT90Desc] = useState("A powerful project built with TypeScript.");
  const [t90Out, setT90Out] = useState("");

  // Tool 91 - JS Function Generator
  const [t91Name, setT91Name] = useState("fetchUserData");
  const [t91Args, setT91Args] = useState("userId, token");
  const [t91Out, setT91Out] = useState("");

  // Tool 92 - Fetch API Snippet
  const [t92Url, setT92Url] = useState("https://api.example.com/data");
  const [t92Method, setT92Method] = useState("GET");
  const [t92Out, setT92Out] = useState("");

  // Tool 93 - SQL Formatter
  const [t93In, setT93In] = useState("SELECT id, name, email FROM users WHERE status = 'active' ORDER BY created_at DESC;");
  const [t93Out, setT93Out] = useState("");

  // Tool 94 - SQL String Escaper
  const [t94In, setT94In] = useState("O'Reilly; DROP TABLE users;");
  const [t94Out, setT94Out] = useState("");

  // Tool 95 - Date Formatter
  const [t95Date, setT95Date] = useState("2026-06-15T12:00:00");
  const [t95Out, setT95Out] = useState("");

  // Tool 96 - Unix Timestamp Now
  const [t96Out, setT96Out] = useState("");

  // Tool 97 - HMAC SHA-256
  const [t97Key, setT97Key] = useState("secret_key_42");
  const [t97Msg, setT97Msg] = useState("payload_message");
  const [t97Out, setT97Out] = useState("");

  // Tool 98 - UUID Bulk Generator
  const [t98Count, setT98Count] = useState(5);
  const [t98Out, setT98Out] = useState("");

  // Tool 99 - HTTP Status Lookup
  const [t99Code, setT99Code] = useState("200");
  const [t99Out, setT99Out] = useState("");

  // Tool 100 - Dev Cheat Sheet
  const [t100Topic, setT100Topic] = useState("git");
  const [t100Out, setT100Out] = useState("");

  return (
    <>
      {/* TOOL 51 - JSON Validator */}
      {isVisible(51, "JSON Validator", "Data", ["json", "validate", "syntax"]) && (
        <ToolCard
          id={51}
          title="JSON Validator"
          category="Data"
          description="Validate JSON string and show pinpoint syntax error positions"
          output={t51Out}
          isError={t51Err}
        >
          <textarea
            value={t51In}
            onChange={(e) => setT51In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                JSON.parse(t51In);
                setT51Out("✅ Valid JSON syntax!");
                setT51Err(false);
              } catch (e: any) {
                setT51Out("❌ " + e.message);
                setT51Err(true);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Validate JSON
          </button>
        </ToolCard>
      )}

      {/* TOOL 52 - JSON to CSV */}
      {isVisible(52, "JSON to CSV", "Converters", ["csv", "table", "export"]) && (
        <ToolCard
          id={52}
          title="JSON to CSV Converter"
          category="Converters"
          description="Convert an array of JSON objects to standard CSV format"
          output={t52Out}
        >
          <textarea
            value={t52In}
            onChange={(e) => setT52In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                setT52Out(jsonToCsv(t52In));
              } catch (e: any) {
                setT52Out("❌ " + e.message);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Convert to CSV
          </button>
        </ToolCard>
      )}

      {/* TOOL 53 - CSV to JSON */}
      {isVisible(53, "CSV to JSON", "Converters", ["csv to json", "table"]) && (
        <ToolCard
          id={53}
          title="CSV to JSON Converter"
          category="Converters"
          description="Parse comma-separated values into JSON records"
          output={t53Out}
        >
          <textarea
            value={t53In}
            onChange={(e) => setT53In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                setT53Out(JSON.stringify(csvToJson(t53In), null, 2));
              } catch (e: any) {
                setT53Out("❌ " + e.message);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Convert to JSON
          </button>
        </ToolCard>
      )}

      {/* TOOL 54 - JSON Sorter */}
      {isVisible(54, "JSON Sorter", "Formatting", ["sort keys", "alphabetical"]) && (
        <ToolCard
          id={54}
          title="JSON Key Sorter"
          category="Formatting"
          description="Sort all keys in a JSON object alphabetically"
          output={t54Out}
        >
          <textarea
            value={t54In}
            onChange={(e) => setT54In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                const parsed = JSON.parse(t54In);
                const sortKeys = (obj: any): any => {
                  if (typeof obj !== "object" || obj === null) return obj;
                  if (Array.isArray(obj)) return obj.map(sortKeys);
                  return Object.keys(obj)
                    .sort()
                    .reduce((acc: any, key: string) => {
                      acc[key] = sortKeys(obj[key]);
                      return acc;
                    }, {});
                };
                setT54Out(JSON.stringify(sortKeys(parsed), null, 2));
              } catch (e: any) {
                setT54Out("❌ " + e.message);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Sort Keys
          </button>
        </ToolCard>
      )}

      {/* TOOL 55 - XML Formatter */}
      {isVisible(55, "XML Formatter", "Formatting", ["xml", "pretty", "indent"]) && (
        <ToolCard
          id={55}
          title="XML Formatter"
          category="Formatting"
          description="Beautify XML structures with indentation"
          output={t55Out}
        >
          <textarea
            value={t55In}
            onChange={(e) => setT55In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                const reg = /(>)(<)(\/*)/g;
                let formatted = t55In.replace(reg, "$1\r\n$2$3");
                let pad = 0;
                const lines = formatted.split("\r\n").map((node) => {
                  let indent = 0;
                  if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                  } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) pad -= 1;
                  } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 1;
                  } else {
                    indent = 0;
                  }
                  const padding = "  ".repeat(pad);
                  pad += indent;
                  return padding + node;
                });
                setT55Out(lines.join("\n"));
              } catch (e: any) {
                setT55Out("❌ " + e.message);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Format XML
          </button>
        </ToolCard>
      )}

      {/* TOOL 56 - Text Sorter */}
      {isVisible(56, "Text Sorter", "Text", ["sort lines", "alphabetical"]) && (
        <ToolCard
          id={56}
          title="Text Line Sorter"
          category="Text"
          description="Sort lines alphabetically A-Z or Z-A"
          output={t56Out}
        >
          <textarea
            value={t56In}
            onChange={(e) => setT56In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const lines = t56In.split("\n").sort((a, b) => a.localeCompare(b));
                setT56Out(lines.join("\n"));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Sort A-Z
            </button>
            <button
              type="button"
              onClick={() => {
                const lines = t56In.split("\n").sort((a, b) => b.localeCompare(a));
                setT56Out(lines.join("\n"));
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              Sort Z-A
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 57 - Duplicate Line Remover */}
      {isVisible(57, "Duplicate Line Remover", "Text", ["dedupe", "unique"]) && (
        <ToolCard
          id={57}
          title="Duplicate Line Remover"
          category="Text"
          description="Filter out repeated lines to keep unique entries"
          output={t57Out}
        >
          <textarea
            value={t57In}
            onChange={(e) => setT57In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const lines = Array.from(new Set(t57In.split("\n")));
              setT57Out(lines.join("\n"));
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Remove Duplicates
          </button>
        </ToolCard>
      )}

      {/* TOOL 58 - Line Counter */}
      {isVisible(58, "Line Counter", "Text", ["lines", "empty lines"]) && (
        <ToolCard
          id={58}
          title="Line & Non-Empty Line Counter"
          category="Text"
          description="Count total lines and non-blank lines"
        >
          <textarea
            value={t58In}
            onChange={(e) => setT58In(e.target.value)}
            rows={3}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex gap-4 pt-1 text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Total Lines: <strong>{t58In ? t58In.split("\n").length : 0}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Non-Empty Lines:{" "}
              <strong>{t58In.split("\n").filter((l) => l.trim() !== "").length}</strong>
            </span>
          </div>
        </ToolCard>
      )}

      {/* TOOL 59 - Whitespace Cleaner */}
      {isVisible(59, "Whitespace Cleaner", "Text", ["whitespace", "trim", "collapse"]) && (
        <ToolCard
          id={59}
          title="Whitespace Cleaner"
          category="Text"
          description="Collapse consecutive spaces and trim edges"
          output={t59Out}
        >
          <textarea
            value={t59In}
            onChange={(e) => setT59In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => setT59Out(t59In.replace(/\s+/g, " ").trim())}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Clean Whitespace
          </button>
        </ToolCard>
      )}

      {/* TOOL 60 - Reverse Text */}
      {isVisible(60, "Reverse Text", "Text", ["reverse", "backwards"]) && (
        <ToolCard
          id={60}
          title="Reverse Text"
          category="Text"
          description="Invert text character by character"
          output={t60Out}
        >
          <input
            type="text"
            value={t60In}
            onChange={(e) => setT60In(e.target.value)}
            className="w-full text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => setT60Out(t60In.split("").reverse().join(""))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Reverse
          </button>
        </ToolCard>
      )}

      {/* TOOL 61 - Palindrome Checker */}
      {isVisible(61, "Palindrome Checker", "Text", ["palindrome"]) && (
        <ToolCard
          id={61}
          title="Palindrome Checker"
          category="Text"
          description="Check if text reads the same backwards"
          output={t61Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t61In}
              onChange={(e) => setT61In(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const clean = t61In.toLowerCase().replace(/[^a-z0-9]/g, "");
                const isPal = clean === clean.split("").reverse().join("");
                setT61Out(isPal ? `✅ "${t61In}" is a Palindrome!` : `❌ "${t61In}" is NOT a Palindrome.`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Check
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 62 - Anagram Checker */}
      {isVisible(62, "Anagram Checker", "Text", ["anagram"]) && (
        <ToolCard
          id={62}
          title="Anagram Checker"
          category="Text"
          description="Determine if two words contain identical letters"
          output={t62Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t62A}
              onChange={(e) => setT62A(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              placeholder="Word 1"
            />
            <input
              type="text"
              value={t62B}
              onChange={(e) => setT62B(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              placeholder="Word 2"
            />
            <button
              type="button"
              onClick={() => {
                const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
                const isAna = norm(t62A) === norm(t62B);
                setT62Out(isAna ? `✅ "${t62A}" and "${t62B}" are Anagrams!` : `❌ Not Anagrams.`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Check
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 63 - Word Frequency Counter */}
      {isVisible(63, "Word Frequency Counter", "Text", ["frequency", "occurrence"]) && (
        <ToolCard
          id={63}
          title="Word Frequency Counter"
          category="Text"
          description="Compute count of each word in text"
          output={t63Out}
        >
          <textarea
            value={t63In}
            onChange={(e) => setT63In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const words = t63In.toLowerCase().match(/\b\w+\b/g) || [];
              const map: Record<string, number> = {};
              words.forEach((w) => (map[w] = (map[w] || 0) + 1));
              const res = Object.entries(map)
                .sort((a, b) => b[1] - a[1])
                .map(([w, c]) => `${w}: ${c}`)
                .join(", ");
              setT63Out(res || "No words detected");
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Count Frequency
          </button>
        </ToolCard>
      )}

      {/* TOOL 64 - Text Deduplicator */}
      {isVisible(64, "Text Deduplicator", "Text", ["dedup words"]) && (
        <ToolCard
          id={64}
          title="Word Deduplicator"
          category="Text"
          description="Remove duplicate words while preserving order"
          output={t64Out}
        >
          <input
            type="text"
            value={t64In}
            onChange={(e) => setT64In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const words = t64In.trim().split(/\s+/);
              setT64Out(Array.from(new Set(words)).join(" "));
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Deduplicate Words
          </button>
        </ToolCard>
      )}

      {/* TOOL 65 - Character Frequency */}
      {isVisible(65, "Character Frequency", "Text", ["letters count"]) && (
        <ToolCard
          id={65}
          title="Character Frequency"
          category="Text"
          description="Count occurrences of each letter"
          output={t65Out}
        >
          <input
            type="text"
            value={t65In}
            onChange={(e) => setT65In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const map: Record<string, number> = {};
              for (const ch of t65In) {
                if (ch.trim()) map[ch] = (map[ch] || 0) + 1;
              }
              const res = Object.entries(map)
                .sort((a, b) => b[1] - a[1])
                .map(([c, n]) => `'${c}': ${n}`)
                .join(", ");
              setT65Out(res || "No characters");
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Count Letters
          </button>
        </ToolCard>
      )}

      {/* TOOL 66 - Morse Code */}
      {isVisible(66, "Morse Code Converter", "Converters", ["morse", "telegraph"]) && (
        <ToolCard
          id={66}
          title="Morse Code Converter"
          category="Converters"
          description="Translate text to Morse code and decode Morse to text"
          output={t66Out}
        >
          <input
            type="text"
            value={t66In}
            onChange={(e) => setT66In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setT66Out(morseEncode(t66In))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Encode to Morse
            </button>
            <button
              type="button"
              onClick={() => setT66Out(morseDecode(t66In))}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              Decode Morse
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 67 - Binary Text Converter */}
      {isVisible(67, "Binary Text Converter", "Converters", ["binary text", "ascii binary"]) && (
        <ToolCard
          id={67}
          title="Binary Text Converter"
          category="Converters"
          description="Convert text to 8-bit binary and decode back"
          output={t67Out}
        >
          <input
            type="text"
            value={t67In}
            onChange={(e) => setT67In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setT67Out(textToBinaryString(t67In))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Text → Binary
            </button>
            <button
              type="button"
              onClick={() => setT67Out(binaryStringToText(t67In))}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              Binary → Text
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 68 - SHA-256 Hash */}
      {isVisible(68, "SHA-256 Hash Generator", "Hashes", ["sha256", "checksum"]) && (
        <ToolCard
          id={68}
          title="SHA-256 Hash Generator"
          category="Hashes"
          description="Generate standard 256-bit cryptographic digest"
          output={t68Out}
        >
          <input
            type="text"
            value={t68In}
            onChange={(e) => setT68In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={async () => setT68Out(await sha256Hex(t68In))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Compute SHA-256
          </button>
        </ToolCard>
      )}

      {/* TOOL 69 - URL Parser */}
      {isVisible(69, "URL Parser", "Web", ["url breakdown", "protocol", "pathname"]) && (
        <ToolCard
          id={69}
          title="URL Component Parser"
          category="Web"
          description="Deconstruct URL into protocol, host, port, path, query, hash"
          output={t69Out}
        >
          <input
            type="text"
            value={t69In}
            onChange={(e) => setT69In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              try {
                const u = new URL(t69In);
                setT69Out(
                  `Protocol: ${u.protocol}\nHost: ${u.host}\nHostname: ${u.hostname}\nPort: ${u.port || "default"}\nPathname: ${u.pathname}\nSearch: ${u.search}\nHash: ${u.hash}`
                );
              } catch (e: any) {
                setT69Out("❌ " + e.message);
              }
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Parse URL
          </button>
        </ToolCard>
      )}

      {/* TOOL 70 - Query String Parser */}
      {isVisible(70, "Query String Parser", "Web", ["querystring", "params"]) && (
        <ToolCard
          id={70}
          title="URL Query String Parser"
          category="Web"
          description="Parse URL query search parameters into JSON"
          output={t70Out}
        >
          <input
            type="text"
            value={t70In}
            onChange={(e) => setT70In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const sp = new URLSearchParams(t70In);
              const obj: Record<string, any> = {};
              sp.forEach((val, key) => {
                if (obj[key]) {
                  if (Array.isArray(obj[key])) obj[key].push(val);
                  else obj[key] = [obj[key], val];
                } else {
                  obj[key] = val;
                }
              });
              setT70Out(JSON.stringify(obj, null, 2));
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Parse Query Params
          </button>
        </ToolCard>
      )}

      {/* TOOL 71 - Browser Information */}
      {isVisible(71, "Browser Information", "Utilities", ["browser", "user-agent", "platform"]) && (
        <ToolCard
          id={71}
          title="Browser & Platform Information"
          category="Utilities"
          description="Inspect active client browser properties"
          output={t71Out}
        >
          <button
            type="button"
            onClick={() => {
              setT71Out(
                `User-Agent: ${navigator.userAgent}\nLanguage: ${navigator.language}\nOnline: ${
                  navigator.onLine ? "Yes" : "No"
                }\nCookies Enabled: ${navigator.cookieEnabled ? "Yes" : "No"}\nPlatform: ${navigator.platform}`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Get Browser Info
          </button>
        </ToolCard>
      )}

      {/* TOOL 72 - Screen & Viewport Info */}
      {isVisible(72, "Screen & Viewport Info", "Utilities", ["resolution", "viewport"]) && (
        <ToolCard
          id={72}
          title="Screen & Viewport Resolution"
          category="Utilities"
          description="Inspect monitor resolution and window viewport size"
          output={t72Out}
        >
          <button
            type="button"
            onClick={() => {
              setT72Out(
                `Screen Resolution: ${window.screen.width} x ${window.screen.height}\nAvailable Screen: ${
                  window.screen.availWidth
                } x ${window.screen.availHeight}\nWindow Inner Size: ${window.innerWidth} x ${
                  window.innerHeight
                }\nDevice Pixel Ratio: ${window.devicePixelRatio}`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Inspect Viewport
          </button>
        </ToolCard>
      )}

      {/* TOOL 73 - Meta Tag Generator */}
      {isVisible(73, "Meta Tag Generator", "Web", ["seo", "html meta", "opengraph"]) && (
        <ToolCard
          id={73}
          title="HTML Meta Tag Generator"
          category="Web"
          description="Generate responsive SEO and OpenGraph meta elements"
          output={t73Out}
        >
          <div className="space-y-2">
            <input
              type="text"
              value={t73Title}
              onChange={(e) => setT73Title(e.target.value)}
              placeholder="Page Title"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t73Desc}
              onChange={(e) => setT73Desc(e.target.value)}
              placeholder="Meta Description"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT73Out(
                  `<title>${t73Title}</title>\n<meta name="description" content="${t73Desc}">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta property="og:title" content="${t73Title}">\n<meta property="og:description" content="${t73Desc}">`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Tags
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 74 - HTML Boilerplate Generator */}
      {isVisible(74, "HTML Boilerplate Generator", "HTML", ["template", "html5"]) && (
        <ToolCard
          id={74}
          title="HTML5 Boilerplate Template"
          category="HTML"
          description="Starter HTML5 document structure with viewport and UTF-8 charset"
          output={t74Out}
        >
          <button
            type="button"
            onClick={() => {
              setT74Out(
                `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="script.js"></script>\n</body>\n</html>`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate HTML5 Boilerplate
          </button>
        </ToolCard>
      )}

      {/* TOOL 75 - CSS Reset Generator */}
      {isVisible(75, "CSS Reset Generator", "CSS", ["reset", "normalize", "box-sizing"]) && (
        <ToolCard
          id={75}
          title="Modern CSS Reset Snippet"
          category="CSS"
          description="Production modern CSS reset including border-box and margin zero"
          output={t75Out}
        >
          <button
            type="button"
            onClick={() => {
              setT75Out(
                `*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nhtml, body {\n  height: 100%;\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n}\n\nimg, picture, video, canvas, svg {\n  display: block;\n  max-width: 100%;\n}`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate CSS Reset
          </button>
        </ToolCard>
      )}

      {/* TOOL 76 - CSS Flexbox Generator */}
      {isVisible(76, "CSS Flexbox Generator", "CSS", ["flex", "justify-content", "align-items"]) && (
        <ToolCard
          id={76}
          title="CSS Flexbox Generator"
          category="CSS"
          description="Visual helper to generate flex layout rules"
          output={`display: flex;\nflex-direction: ${t76Dir};\njustify-content: ${t76Justify};\nalign-items: ${t76Align};`}
        >
          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={t76Dir}
              onChange={(e) => setT76Dir(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="row">row</option>
              <option value="column">column</option>
              <option value="row-reverse">row-reverse</option>
            </select>
            <select
              value={t76Justify}
              onChange={(e) => setT76Justify(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="flex-start">justify: flex-start</option>
              <option value="center">justify: center</option>
              <option value="space-between">justify: space-between</option>
              <option value="space-around">justify: space-around</option>
              <option value="flex-end">justify: flex-end</option>
            </select>
            <select
              value={t76Align}
              onChange={(e) => setT76Align(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="stretch">align: stretch</option>
              <option value="center">align: center</option>
              <option value="flex-start">align: flex-start</option>
              <option value="flex-end">align: flex-end</option>
            </select>
          </div>
        </ToolCard>
      )}

      {/* TOOL 77 - CSS Grid Generator */}
      {isVisible(77, "CSS Grid Generator", "CSS", ["grid", "columns"]) && (
        <ToolCard
          id={77}
          title="CSS Grid Generator"
          category="CSS"
          description="Generate CSS Grid template columns and gap rules"
          output={`display: grid;\ngrid-template-columns: repeat(${t77Cols}, 1fr);\ngap: ${t77Gap}px;`}
        >
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span>Columns:</span>
              <input
                type="number"
                min={1}
                max={12}
                value={t77Cols}
                onChange={(e) => setT77Cols(Number(e.target.value))}
                className="w-14 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Gap (px):</span>
              <input
                type="number"
                min={0}
                max={64}
                value={t77Gap}
                onChange={(e) => setT77Gap(Number(e.target.value))}
                className="w-14 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          </div>
        </ToolCard>
      )}

      {/* TOOL 78 - Box Shadow Generator */}
      {isVisible(78, "Box Shadow Generator", "CSS", ["shadow", "box-shadow"]) && (
        <ToolCard
          id={78}
          title="CSS Box Shadow Generator"
          category="CSS"
          description="Tune offset, blur, and spread with live CSS output"
          output={`box-shadow: ${t78X}px ${t78Y}px ${t78Blur}px ${t78Spread}px rgba(0, 0, 0, 0.1);`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span>X ({t78X}px)</span>
              <input
                type="range"
                min={-30}
                max={30}
                value={t78X}
                onChange={(e) => setT78X(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <span>Y ({t78Y}px)</span>
              <input
                type="range"
                min={-30}
                max={30}
                value={t78Y}
                onChange={(e) => setT78Y(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <span>Blur ({t78Blur}px)</span>
              <input
                type="range"
                min={0}
                max={50}
                value={t78Blur}
                onChange={(e) => setT78Blur(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <span>Spread ({t78Spread}px)</span>
              <input
                type="range"
                min={-20}
                max={20}
                value={t78Spread}
                onChange={(e) => setT78Spread(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div
            className="w-24 h-12 bg-white dark:bg-slate-700 rounded-lg mx-auto mt-2 border border-slate-200 dark:border-slate-600"
            style={{
              boxShadow: `${t78X}px ${t78Y}px ${t78Blur}px ${t78Spread}px rgba(0,0,0,0.15)`,
            }}
          />
        </ToolCard>
      )}

      {/* TOOL 79 - Border Radius Generator */}
      {isVisible(79, "Border Radius Generator", "CSS", ["rounded", "border-radius"]) && (
        <ToolCard
          id={79}
          title="CSS Border Radius Generator"
          category="CSS"
          description="Adjust rounded corners smoothly"
          output={`border-radius: ${t79Radius}px;`}
        >
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={64}
              value={t79Radius}
              onChange={(e) => setT79Radius(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs font-mono">{t79Radius}px</span>
          </div>
        </ToolCard>
      )}

      {/* TOOL 80 - CSS Clamp Generator */}
      {isVisible(80, "CSS Clamp Generator", "CSS", ["clamp", "fluid typography"]) && (
        <ToolCard
          id={80}
          title="CSS clamp() Fluid Value Generator"
          category="CSS"
          description="Generate responsive fluid sizing using CSS clamp()"
          output={`font-size: clamp(${t80Min}, ${t80Val}, ${t80Max});`}
        >
          <div className="flex gap-2 text-xs">
            <input
              type="text"
              value={t80Min}
              onChange={(e) => setT80Min(e.target.value)}
              placeholder="Min e.g. 1rem"
              className="w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t80Val}
              onChange={(e) => setT80Val(e.target.value)}
              placeholder="Val e.g. 2.5vw"
              className="w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t80Max}
              onChange={(e) => setT80Max(e.target.value)}
              placeholder="Max e.g. 2rem"
              className="w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 81 - PX <-> REM Converter */}
      {isVisible(81, "PX <-> REM Converter", "Converters", ["px to rem", "rem to px"]) && (
        <ToolCard
          id={81}
          title="PX to REM Converter"
          category="Converters"
          description="Convert pixel units to root em (rem) with 16px baseline"
          output={t81Out}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={t81Px}
              onChange={(e) => setT81Px(e.target.value)}
              placeholder="Pixels (px)"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const px = Number(t81Px);
                setT81Out(`${px}px = ${(px / 16).toFixed(3)}rem`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              PX → REM
            </button>
            <input
              type="number"
              value={t81Rem}
              onChange={(e) => setT81Rem(e.target.value)}
              placeholder="REM"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const rem = Number(t81Rem);
                setT81Out(`${rem}rem = ${rem * 16}px`);
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-semibold"
            >
              REM → PX
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 82 - Aspect Ratio Calculator */}
      {isVisible(82, "Aspect Ratio Calculator", "Math", ["aspect ratio", "16:9", "4:3"]) && (
        <ToolCard
          id={82}
          title="Aspect Ratio Calculator"
          category="Math"
          description="Compute proportional ratio (e.g. 16:9) and greatest common divisor"
          output={t82Out}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={t82W}
              onChange={(e) => setT82W(e.target.value)}
              placeholder="Width"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <span>:</span>
            <input
              type="number"
              value={t82H}
              onChange={(e) => setT82H(e.target.value)}
              placeholder="Height"
              className="w-24 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const w = Number(t82W);
                const h = Number(t82H);
                const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
                const divisor = gcd(w, h);
                setT82Out(`Ratio: ${w / divisor}:${h / divisor} (${(w / h).toFixed(2)})`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Calculate Ratio
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 83 - Random Color Generator */}
      {isVisible(83, "Random Color Generator", "Color", ["random color", "hex"]) && (
        <ToolCard
          id={83}
          title="Random Color Generator"
          category="Color"
          description="Generate random HEX color codes"
          output={t83Out}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const hex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
                setT83Out(hex);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Pick Random Color
            </button>
            <div
              className="w-10 h-6 rounded border border-slate-300 shadow-xs"
              style={{ background: t83Out }}
            />
          </div>
        </ToolCard>
      )}

      {/* TOOL 84 - Color Contrast Checker */}
      {isVisible(84, "Color Contrast Checker", "Color", ["contrast ratio", "wcag"]) && (
        <ToolCard
          id={84}
          title="WCAG Color Contrast Checker"
          category="Color"
          description="Check contrast ratio between foreground and background colors"
          output={t84Out}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">Text:</span>
            <input
              type="color"
              value={t84Fg}
              onChange={(e) => setT84Fg(e.target.value)}
              className="w-8 h-6 rounded border cursor-pointer"
            />
            <span className="text-xs">BG:</span>
            <input
              type="color"
              value={t84Bg}
              onChange={(e) => setT84Bg(e.target.value)}
              className="w-8 h-6 rounded border cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                const getL = (hex: string) => {
                  const rgb = [
                    parseInt(hex.slice(1, 3), 16) / 255,
                    parseInt(hex.slice(3, 5), 16) / 255,
                    parseInt(hex.slice(5, 7), 16) / 255,
                  ].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
                  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
                };
                const l1 = getL(t84Fg);
                const l2 = getL(t84Bg);
                const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
                const passAA = ratio >= 4.5 ? "✅ AA Normal Pass" : "❌ AA Normal Fail";
                setT84Out(`Ratio: ${ratio.toFixed(2)}:1\n${passAA}`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Check Ratio
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 85 - Data URI Generator */}
      {isVisible(85, "Data URI Generator", "Converters", ["data uri", "base64 text"]) && (
        <ToolCard
          id={85}
          title="Data URI Generator"
          category="Converters"
          description="Convert text into standard data:text/plain;base64 URIs"
          output={t85Out}
        >
          <input
            type="text"
            value={t85In}
            onChange={(e) => setT85In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const b64 = btoa(unescape(encodeURIComponent(t85In)));
              setT85Out(`data:text/plain;charset=utf-8;base64,${b64}`);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Data URI
          </button>
        </ToolCard>
      )}

      {/* TOOL 86 - Favicon HTML Generator */}
      {isVisible(86, "Favicon HTML Generator", "HTML", ["favicon", "icon"]) && (
        <ToolCard
          id={86}
          title="Favicon HTML Tag Generator"
          category="HTML"
          description="Generate link rel tags for standard and apple touch favicons"
          output={t86Out}
        >
          <input
            type="text"
            value={t86Href}
            onChange={(e) => setT86Href(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              setT86Out(
                `<link rel="icon" type="image/x-icon" href="${t86Href}">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Favicon Links
          </button>
        </ToolCard>
      )}

      {/* TOOL 87 - Robots.txt Generator */}
      {isVisible(87, "Robots.txt Generator", "Web", ["robots", "crawler"]) && (
        <ToolCard
          id={87}
          title="Robots.txt Generator"
          category="Web"
          description="Generate crawler directive file with sitemap pointer"
          output={t87Out}
        >
          <input
            type="text"
            value={t87Site}
            onChange={(e) => setT87Site(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              setT87Out(
                `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /private/\n\nSitemap: ${t87Site}/sitemap.xml`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Robots.txt
          </button>
        </ToolCard>
      )}

      {/* TOOL 88 - Sitemap XML Generator */}
      {isVisible(88, "Sitemap XML Generator", "Web", ["sitemap", "xml"]) && (
        <ToolCard
          id={88}
          title="Sitemap.xml Generator"
          category="Web"
          description="Create indexable XML sitemap template"
          output={t88Out}
        >
          <input
            type="text"
            value={t88Site}
            onChange={(e) => setT88Site(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const now = new Date().toISOString().split("T")[0];
              setT88Out(
                `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${t88Site}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`
              );
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Generate Sitemap.xml
          </button>
        </ToolCard>
      )}

      {/* TOOL 89 - Gitignore Generator */}
      {isVisible(89, "Gitignore Generator", "DevOps", ["gitignore", "git"]) && (
        <ToolCard
          id={89}
          title=".gitignore Generator"
          category="DevOps"
          description="Generate standard .gitignore for Node.js, Python, or React"
          output={t89Out}
        >
          <div className="flex gap-2">
            <select
              value={t89Type}
              onChange={(e) => setT89Type(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="node">Node.js / React</option>
              <option value="python">Python</option>
              <option value="general">General macOS/Windows</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (t89Type === "node") {
                  setT89Out("node_modules/\ndist/\nbuild/\n.env\n.env.local\n*.log\n.DS_Store");
                } else if (t89Type === "python") {
                  setT89Out("__pycache__/\n*.py[cod]\n*$py.class\n.venv/\nenv/\n*.log\n.env");
                } else {
                  setT89Out(".DS_Store\nThumbs.db\n*.tmp\n.vscode/\n.idea/");
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate .gitignore
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 90 - README Generator */}
      {isVisible(90, "README Generator", "DevOps", ["readme", "markdown"]) && (
        <ToolCard
          id={90}
          title="README.md Starter Generator"
          category="DevOps"
          description="Generate well-formatted project README template"
          output={t90Out}
        >
          <div className="space-y-2">
            <input
              type="text"
              value={t90Name}
              onChange={(e) => setT90Name(e.target.value)}
              placeholder="Project Name"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t90Desc}
              onChange={(e) => setT90Desc(e.target.value)}
              placeholder="Short Description"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT90Out(
                  `# ${t90Name}\n\n${t90Desc}\n\n## Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n## License\n\nMIT`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate README
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 91 - JS Function Generator */}
      {isVisible(91, "JS Function Generator", "JavaScript", ["function template", "snippet"]) && (
        <ToolCard
          id={91}
          title="JavaScript Function Snippet Generator"
          category="JavaScript"
          description="Generate modern async / arrow function declarations"
          output={t91Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t91Name}
              onChange={(e) => setT91Name(e.target.value)}
              placeholder="Function Name"
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t91Args}
              onChange={(e) => setT91Args(e.target.value)}
              placeholder="Arguments"
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT91Out(
                  `export const ${t91Name} = async (${t91Args}) => {\n  try {\n    // Implementation logic here\n    return true;\n  } catch (error) {\n    console.error("Error in ${t91Name}:", error);\n    throw error;\n  }\n};`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 92 - Fetch API Snippet */}
      {isVisible(92, "Fetch API Snippet", "JavaScript", ["fetch", "ajax", "api call"]) && (
        <ToolCard
          id={92}
          title="Fetch API Snippet Generator"
          category="JavaScript"
          description="Generate fetch() calls with async/await and response checks"
          output={t92Out}
        >
          <div className="flex gap-2">
            <select
              value={t92Method}
              onChange={(e) => setT92Method(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={t92Url}
              onChange={(e) => setT92Url(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                setT92Out(
                  `const res = await fetch("${t92Url}", {\n  method: "${t92Method}",\n  headers: { "Content-Type": "application/json" },\n});\nif (!res.ok) throw new Error("Request failed with status " + res.status);\nconst data = await res.json();\nconsole.log(data);`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate Fetch
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 93 - SQL Formatter */}
      {isVisible(93, "SQL Formatter", "Formatting", ["sql", "query"]) && (
        <ToolCard
          id={93}
          title="SQL Query Formatter"
          category="Formatting"
          description="Capitalize and indent standard SQL keywords"
          output={t93Out}
        >
          <textarea
            value={t93In}
            onChange={(e) => setT93In(e.target.value)}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const keywords = [
                "SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "LIMIT",
                "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "INSERT INTO", "VALUES",
                "UPDATE", "SET", "DELETE FROM"
              ];
              let res = t93In;
              keywords.forEach((k) => {
                const regex = new RegExp(`\\b${k}\\b`, "gi");
                res = res.replace(regex, `\n${k}`);
              });
              setT93Out(res.trim());
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Format SQL
          </button>
        </ToolCard>
      )}

      {/* TOOL 94 - SQL String Escaper */}
      {isVisible(94, "SQL String Escaper", "Security", ["sql injection", "escape single quote"]) && (
        <ToolCard
          id={94}
          title="SQL String Escaper"
          category="Security"
          description="Escape single quotes and special characters for SQL literals"
          output={t94Out}
        >
          <input
            type="text"
            value={t94In}
            onChange={(e) => setT94In(e.target.value)}
            className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
          />
          <button
            type="button"
            onClick={() => setT94Out(t94In.replace(/'/g, "''").replace(/\\/g, "\\\\"))}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Escape String
          </button>
        </ToolCard>
      )}

      {/* TOOL 95 - Date Formatter */}
      {isVisible(95, "Date Formatter", "Time", ["date format", "iso", "utc"]) && (
        <ToolCard
          id={95}
          title="Date Formatter"
          category="Time"
          description="Display date in ISO, UTC, and locale variations"
          output={t95Out}
        >
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={t95Date}
              onChange={(e) => setT95Date(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const d = new Date(t95Date);
                setT95Out(
                  `ISO: ${d.toISOString()}\nUTC: ${d.toUTCString()}\nDate: ${d.toDateString()}\nTime: ${d.toTimeString()}\nLocale: ${d.toLocaleString()}`
                );
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Format Date
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 96 - Unix Timestamp Now */}
      {isVisible(96, "Unix Timestamp Now", "Time", ["current epoch", "now"]) && (
        <ToolCard
          id={96}
          title="Current Unix Timestamp (Epoch)"
          category="Time"
          description="Get accurate current Unix timestamp in seconds and milliseconds"
          output={t96Out}
        >
          <button
            type="button"
            onClick={() => {
              const now = Date.now();
              setT96Out(`Seconds: ${Math.floor(now / 1000)}\nMilliseconds: ${now}`);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
          >
            Get Current Epoch
          </button>
        </ToolCard>
      )}

      {/* TOOL 97 - HMAC SHA-256 */}
      {isVisible(97, "HMAC SHA-256 Generator", "Hashes", ["hmac", "secret signature"]) && (
        <ToolCard
          id={97}
          title="HMAC SHA-256 Generator"
          category="Hashes"
          description="Create cryptographic HMAC signature using key and payload"
          output={t97Out}
        >
          <div className="space-y-2">
            <input
              type="text"
              value={t97Key}
              onChange={(e) => setT97Key(e.target.value)}
              placeholder="Secret Key"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <input
              type="text"
              value={t97Msg}
              onChange={(e) => setT97Msg(e.target.value)}
              placeholder="Message / Payload"
              className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={async () => setT97Out(await hmacSha256Hex(t97Key, t97Msg))}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate HMAC
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 98 - UUID Bulk Generator */}
      {isVisible(98, "UUID Bulk Generator", "Generators", ["multiple uuids", "bulk guid"]) && (
        <ToolCard
          id={98}
          title="Bulk UUID Generator"
          category="Generators"
          description="Generate multiple RFC 4122 v4 UUIDs at once"
          output={t98Out}
        >
          <div className="flex items-center gap-2">
            <label className="text-xs">Count:</label>
            <input
              type="number"
              min={1}
              max={50}
              value={t98Count}
              onChange={(e) => setT98Count(Number(e.target.value))}
              className="w-16 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const list = Array.from(
                  { length: Math.min(50, Math.max(1, t98Count)) },
                  () => generateUUIDv4()
                );
                setT98Out(list.join("\n"));
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Generate
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 99 - HTTP Status Code Lookup */}
      {isVisible(99, "HTTP Status Code Lookup", "API", ["status code", "200", "404", "500"]) && (
        <ToolCard
          id={99}
          title="HTTP Status Code Lookup"
          category="API"
          description="Lookup standard RFC HTTP status codes and explanations"
          output={t99Out}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={t99Code}
              onChange={(e) => setT99Code(e.target.value)}
              placeholder="e.g. 200, 404, 500"
              className="w-28 text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
            <button
              type="button"
              onClick={() => {
                const map: Record<string, string> = {
                  "200": "200 OK: Standard successful HTTP request.",
                  "201": "201 Created: New resource successfully created.",
                  "204": "204 No Content: Request succeeded with no content returned.",
                  "301": "301 Moved Permanently: Resource URL permanently changed.",
                  "302": "302 Found: Temporary redirection to new URI.",
                  "304": "304 Not Modified: Cached response is still valid.",
                  "400": "400 Bad Request: Invalid syntax or missing required parameters.",
                  "401": "401 Unauthorized: Authentication credentials required or invalid.",
                  "403": "403 Forbidden: Server understood request but refuses authorization.",
                  "404": "404 Not Found: Requested resource could not be located.",
                  "409": "409 Conflict: Request conflicts with current state of resource.",
                  "429": "429 Too Many Requests: Rate limiting triggered.",
                  "500": "500 Internal Server Error: Unexpected server failure.",
                  "502": "502 Bad Gateway: Upstream gateway received invalid response.",
                  "503": "503 Service Unavailable: Server currently overloaded or in maintenance.",
                };
                setT99Out(map[t99Code.trim()] || `HTTP ${t99Code}: Consult RFC 9110 specification.`);
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Lookup
            </button>
          </div>
        </ToolCard>
      )}

      {/* TOOL 100 - Developer Cheat Sheet */}
      {isVisible(100, "Developer Cheat Sheet", "Utilities", ["cheat sheet", "git", "docker", "linux"]) && (
        <ToolCard
          id={100}
          title="Developer Cheat Sheet Reference"
          category="Utilities"
          description="Instant command references for Git, Docker, and Linux terminal"
          output={t100Out}
        >
          <div className="flex gap-2">
            <select
              value={t100Topic}
              onChange={(e) => setT100Topic(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            >
              <option value="git">Git Commands</option>
              <option value="docker">Docker Commands</option>
              <option value="linux">Linux Bash Commands</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (t100Topic === "git") {
                  setT100Out(
                    "git status\ngit add .\ngit commit -m 'feat: message'\ngit pull --rebase\ngit push origin main\ngit branch -a\ngit checkout -b feature-branch\ngit merge branch"
                  );
                } else if (t100Topic === "docker") {
                  setT100Out(
                    "docker build -t app:latest .\ndocker run -p 3000:3000 app:latest\ndocker ps\ndocker stop <container_id>\ndocker compose up -d\ndocker logs -f <container_id>"
                  );
                } else {
                  setT100Out(
                    "ls -la\ncd /path/to/dir\nmkdir -p new_folder\nrm -rf target_folder\nps aux | grep node\nkill -9 <PID>\nchmod +x script.sh\ncurl -I https://example.com"
                  );
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
            >
              Load Cheat Sheet
            </button>
          </div>
        </ToolCard>
      )}
    </>
  );
};
