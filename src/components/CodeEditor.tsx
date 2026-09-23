import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Copy,
  Trash2,
  Check,
  Sparkles,
  Download,
  Upload,
  Terminal,
  Eye,
  RefreshCw,
  FileCode,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { LANGUAGE_CATALOG } from "../data/languages";
import { safeCopyToClipboard, safeStorageGet } from "../utils/helpers";

interface CodeEditorProps {
  onSendToAI?: (code: string, language: string, promptText?: string) => void;
  selectedLanguage?: string;
  initialLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  registerActiveCodeGetter?: (fn: () => { tab: string; code: string }) => void;
  registerApplyCodeHandler?: (fn: (lang: string, code: string) => void) => void;
}

interface ConsoleLogItem {
  id: string;
  type: "info" | "warn" | "error" | "stdout" | "system";
  text: string;
  time: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  onSendToAI,
  selectedLanguage,
  initialLanguage = "HTML",
  onLanguageChange,
  registerActiveCodeGetter,
  registerApplyCodeHandler,
}) => {
  const [internalLang, setInternalLang] = useState(initialLanguage);
  const currentLang = selectedLanguage || internalLang;

  // Web tabs
  const [activeTab, setActiveTab] = useState<string>("html");
  const [htmlCode, setHtmlCode] = useState(
    `<div class="container">\n  <h1>🚀 Hello Coding Super Hub!</h1>\n  <p>Live, multi-language sandbox with instant execution and AI copilot.</p>\n  <button id="btn">Click Me</button>\n</div>`
  );
  const [cssCode, setCssCode] = useState(
    `body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  background: #f8fafc;\n  color: #0f172a;\n}\n.container {\n  max-width: 600px;\n  margin: 0 auto;\n  background: #ffffff;\n  padding: 24px;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.06);\n}\nh1 {\n  color: #2563eb;\n  margin-top: 0;\n}\nbutton {\n  background: #2563eb;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}`
  );
  const [jsCode, setJsCode] = useState(
    `const btn = document.getElementById("btn");\nbtn.addEventListener("click", () => {\n  console.log("Button clicked!");\n  alert("🎉 JavaScript is running smoothly in Coding Super Hub!");\n});\nconsole.log("Sandbox initialized at " + new Date().toLocaleTimeString());`
  );

  // Non-web language codes storage
  const [customCodes, setCustomCodes] = useState<Record<string, string>>({});

  // UI state
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<string>("");
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [outputTab, setOutputTab] = useState<"preview" | "terminal">("preview");
  const [terminalLogs, setTerminalLogs] = useState<ConsoleLogItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  const isWebLanguage = (lang: string) => {
    const l = lang.toLowerCase().trim();
    return l === "html" || l === "css" || l === "javascript";
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Get active code string
  const getCurrentCode = (): string => {
    if (isWebLanguage(currentLang)) {
      if (activeTab === "html") return htmlCode;
      if (activeTab === "css") return cssCode;
      return jsCode;
    }
    return customCodes[currentLang] || "";
  };

  // Set active code string
  const setCurrentCode = (newCode: string) => {
    if (isWebLanguage(currentLang)) {
      if (activeTab === "html") setHtmlCode(newCode);
      else if (activeTab === "css") setCssCode(newCode);
      else setJsCode(newCode);
    } else {
      setCustomCodes((prev) => ({ ...prev, [currentLang]: newCode }));
    }
  };

  // Expose active code getter to parent for AI assistant
  useEffect(() => {
    registerActiveCodeGetter?.(() => {
      const code = getCurrentCode();
      const tab = isWebLanguage(currentLang)
        ? activeTab.toUpperCase()
        : currentLang;
      return { tab, code };
    });
  }, [currentLang, activeTab, htmlCode, cssCode, jsCode, customCodes, registerActiveCodeGetter]);

  // Expose code applier so AI can paste snippets
  useEffect(() => {
    registerApplyCodeHandler?.((lang: string, code: string) => {
      const l = lang.toLowerCase().trim();
      if (l === "html") {
        setActiveTab("html");
        setHtmlCode(code);
        handleLanguageSelect("HTML");
      } else if (l === "css") {
        setActiveTab("css");
        setCssCode(code);
        handleLanguageSelect("CSS");
      } else if (l === "javascript" || l === "js") {
        setActiveTab("js");
        setJsCode(code);
        handleLanguageSelect("JavaScript");
      } else {
        // Find matching language
        const match = LANGUAGE_CATALOG.find(
          (item) => item.name.toLowerCase() === l
        );
        const targetLang = match ? match.name : currentLang;
        setInternalLang(targetLang);
        onLanguageChange?.(targetLang);
        setCustomCodes((prev) => ({ ...prev, [targetLang]: code }));
      }
      showToast(`Loaded ${lang} snippet into Code Editor`);
    });
  }, [currentLang, onLanguageChange, registerApplyCodeHandler]);

  // The sandbox intentionally omits allow-same-origin, so srcDoc has an opaque origin.
  // That makes a fixed targetOrigin unreliable; security therefore relies on the
  // expected iframe Window identity plus a strict message type/payload allowlist.
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.source !== previewFrameRef.current?.contentWindow) return;

      const data = e.data;
      if (!data || typeof data !== "object" || Array.isArray(data)) return;

      const allowedKeys = new Set(["type", "level", "text", "time"]);
      const keys = Object.keys(data);
      if (
        keys.some((key) => !allowedKeys.has(key)) ||
        data.type !== "csh_sandbox_console" ||
        (data.level !== "info" && data.level !== "warn" && data.level !== "error") ||
        typeof data.text !== "string" ||
        data.text.length > 4_000 ||
        (data.time !== undefined && (typeof data.time !== "string" || data.time.length > 100))
      ) {
        return;
      }

      const item: ConsoleLogItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: data.level,
        text: data.text,
        time: data.time || new Date().toLocaleTimeString(),
      };
      setTerminalLogs((prev) => [...prev.slice(-99), item]);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Sync line numbers scroll with textarea scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Cursor tracking
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value.substring(
      0,
      textareaRef.current.selectionStart
    );
    const lines = text.split("\n");
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  // Handle Tab key indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + "  " + val.substring(end);
      setCurrentCode(updated);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          updateCursorPosition();
        }
      }, 0);
    }
  };

  // Execution: Native web vs Multi-language virtual runner
  const runCode = async () => {
    const nowStr = new Date().toLocaleTimeString();
    setLastRunTime(nowStr);

    if (isWebLanguage(currentLang)) {
      // In-browser Web Sandbox
      try {
        const consoleTrap = `
          <script>
            (function() {
              function formatArg(a) {
                if (typeof a === 'object') {
                  try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
                }
                return String(a);
              }
              var _log = console.log, _warn = console.warn, _error = console.error;
              function send(level, args) {
                try {
                  var str = Array.from(args).map(formatArg).join(' ');
                  // srcDoc is sandboxed without allow-same-origin, so its origin is opaque.
                  // A stable targetOrigin is unavailable; the parent strictly validates
                  // the expected iframe Window and the message schema before consuming it.
                  window.parent.postMessage({ type: 'csh_sandbox_console', level: level, text: str.slice(0, 4000), time: new Date().toLocaleTimeString() }, '*');
                } catch(e) {}
              }
              console.log = function() { send('info', arguments); _log.apply(console, arguments); };
              console.warn = function() { send('warn', arguments); _warn.apply(console, arguments); };
              console.error = function() { send('error', arguments); _error.apply(console, arguments); };
              window.onerror = function(msg, url, line) {
                send('error', ['Uncaught Error (' + line + '): ' + msg]);
              };
            })();
          <\\/script>`;

        const generated = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>${cssCode}</style>
  </head>
  <body>
    ${htmlCode}
    ${consoleTrap}
    <script>
      try {
        ${jsCode.replace(/<\/script/gi, "<\\/script")}
      } catch(err) {
        console.error(err);
        var errDiv = document.createElement("div");
        errDiv.style.color = "#ef4444";
        errDiv.style.padding = "10px";
        errDiv.style.background = "#fee2e2";
        errDiv.style.borderRadius = "6px";
        errDiv.style.marginTop = "12px";
        errDiv.textContent = "Runtime Error: " + (err && err.message ? err.message : String(err));
        document.body.appendChild(errDiv);
      }
    <\\/script>
  </body>
</html>`;
        setSrcDoc(generated);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Non-Web Language (Python, C++, Rust, Go, Java, Bash, etc.)
      const codeToRun = getCurrentCode();
      if (!codeToRun.trim()) {
        showToast("Please write code before running.");
        return;
      }

      setIsRunning(true);
      setOutputTab("terminal");
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "system",
          text: `▶ Running ${currentLang} via simulated virtual execution engine (AI-powered)...`,
          time: nowStr,
        },
      ]);

      try {
        const customApiKey = safeStorageGet("csh_custom_key") || undefined;
        const res = await fetch("/api/code/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: currentLang,
            code: codeToRun,
            customApiKey,
          }),
        });
        let data: any;
        try {
          data = await res.json();
        } catch {
          if (res.status === 404) {
            data = {
              stdout: "",
              stderr: "Notice: The backend multi-language execution server is not running on this static host (e.g. GitHub Pages). HTML/CSS/JS sandbox executes 100% in your browser. For Python/C++/Go execution, run the app locally with 'npm run dev' or deploy to Render/Railway.",
              exitCode: 1,
              executionTime: "0.00s",
              notes: "Static Host (No Backend)",
            };
          } else {
            throw new Error(`Server returned HTTP status ${res.status}`);
          }
        }

        const newLogs: ConsoleLogItem[] = [];
        if (data.notes) {
          newLogs.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "system",
            text: `[Environment: ${data.notes}]`,
            time: nowStr,
          });
        }
        if (data.stdout && data.stdout.trim()) {
          newLogs.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "stdout",
            text: data.stdout.trim(),
            time: nowStr,
          });
        }
        if (data.stderr && data.stderr.trim()) {
          newLogs.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "error",
            text: data.stderr.trim(),
            time: nowStr,
          });
        }
        newLogs.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "system",
          text: `✔ Process finished with exit code ${data.exitCode ?? 0} (${data.executionTime || "0.04s"})`,
          time: nowStr,
        });

        setTerminalLogs((prev) => [...prev, ...newLogs]);
      } catch (err: any) {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "error",
            text: `Execution failed: ${err?.message || String(err)}`,
            time: nowStr,
          },
        ]);
      } finally {
        setIsRunning(false);
      }
    }
  };

  useEffect(() => {
    runCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    let fullBundle: string;
    if (isWebLanguage(currentLang)) {
      fullBundle = `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}\n\n// JavaScript\n${jsCode}`;
    } else {
      fullBundle = getCurrentCode();
    }
    const ok = await safeCopyToClipboard(fullBundle);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const isTextLanguage = (langName: string): boolean => {
    if (!langName) return false;
    const lower = langName.trim().toLowerCase();
    if (
      lower === "text" ||
      lower === "plain text" ||
      lower === "plaintext" ||
      lower === "txt" ||
      lower === "markdown" ||
      lower === "md" ||
      lower === "documentation" ||
      lower === "notes"
    ) {
      return true;
    }

    const catalogItem = LANGUAGE_CATALOG.find(
      (l) => l.name.toLowerCase() === lower
    );
    if (catalogItem) {
      const cat = catalogItem.category.toLowerCase();
      if (cat.includes("documentation") || cat.includes("text")) {
        return true;
      }
    }
    return false;
  };

  const getExportFileName = (langName: string, tab: string): string => {
    const l = langName.toLowerCase().trim();
    if (l === "html") {
      if (tab === "html") return "index.html";
      if (tab === "css") return "styles.css";
      return "script.js";
    }
    const extMap: Record<string, string> = {
      python: "main.py",
      javascript: "script.js",
      typescript: "index.ts",
      "c++": "main.cpp",
      c: "main.c",
      "c#": "Program.cs",
      java: "Main.java",
      rust: "main.rs",
      go: "main.go",
      php: "index.php",
      ruby: "main.rb",
      swift: "main.swift",
      kotlin: "Main.kt",
      bash: "script.sh",
      sql: "query.sql",
      json: "data.json",
      markdown: "document.md",
      yaml: "config.yaml",
      html: "index.html",
      css: "styles.css",
    };
    if (extMap[l]) return extMap[l];
    return isTextLanguage(langName)
      ? "notes.txt"
      : `${l.replace(/[^a-z0-9]/gi, "_") || "code"}.txt`;
  };

  const handleExportFile = () => {
    const currentCode = getCurrentCode();
    const fileName = getExportFileName(currentLang, activeTab);

    const blob = new Blob([currentCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 1500);
  };

  // Import / Open file
  const processUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (typeof content !== "string") return;

      const fileName = file.name.toLowerCase();
      let detectedLang = currentLang;

      // Extension to language mapper
      if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
        detectedLang = "HTML";
        setActiveTab("html");
        setHtmlCode(content);
      } else if (fileName.endsWith(".css")) {
        detectedLang = "CSS";
        setActiveTab("css");
        setCssCode(content);
      } else if (
        fileName.endsWith(".js") ||
        fileName.endsWith(".mjs") ||
        fileName.endsWith(".cjs")
      ) {
        detectedLang = "JavaScript";
        setActiveTab("js");
        setJsCode(content);
      } else {
        const extMap: Record<string, string> = {
          ".py": "Python",
          ".ts": "TypeScript",
          ".tsx": "TypeScript",
          ".rs": "Rust",
          ".go": "Go",
          ".cpp": "C++",
          ".cc": "C++",
          ".c": "C",
          ".cs": "C#",
          ".java": "Java",
          ".kt": "Kotlin",
          ".swift": "Swift",
          ".php": "PHP",
          ".rb": "Ruby",
          ".sh": "Bash",
          ".sql": "SQL",
          ".json": "JSON",
          ".md": "Markdown",
          ".yaml": "YAML",
          ".yml": "YAML",
          ".txt": "Plain Text",
        };

        for (const [ext, lName] of Object.entries(extMap)) {
          if (fileName.endsWith(ext)) {
            detectedLang = lName;
            break;
          }
        }
        setCustomCodes((prev) => ({ ...prev, [detectedLang]: content }));
      }

      setInternalLang(detectedLang);
      onLanguageChange?.(detectedLang);
      showToast(`Imported "${file.name}" (${content.split("\n").length} lines)`);
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processUploadedFile(files[0]);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    const target = selectedLanguage || initialLanguage;
    if (target && target !== internalLang) {
      setInternalLang(target);
      loadLanguageStarter(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, initialLanguage]);

  const loadLanguageStarter = (langName: string) => {
    const found = LANGUAGE_CATALOG.find(
      (l) => l.name.toLowerCase() === langName.toLowerCase()
    );
    if (!found || !found.starterCode) return;

    if (langName.toLowerCase() === "html") {
      setActiveTab("html");
      setHtmlCode(found.starterCode);
    } else if (langName.toLowerCase() === "css") {
      setActiveTab("css");
      setCssCode(found.starterCode);
    } else if (langName.toLowerCase() === "javascript") {
      setActiveTab("js");
      setJsCode(found.starterCode);
    } else {
      setCustomCodes((prev) => ({
        ...prev,
        [langName]: prev[langName] || found.starterCode || "",
      }));
    }
  };

  const handleClear = () => {
    if (isWebLanguage(currentLang)) {
      if (activeTab === "html") setHtmlCode("");
      else if (activeTab === "css") setCssCode("");
      else setJsCode("");
    } else {
      setCustomCodes((prev) => ({ ...prev, [currentLang]: "" }));
    }
  };

  const handleLanguageSelect = (langName: string) => {
    setInternalLang(langName);
    onLanguageChange?.(langName);
    loadLanguageStarter(langName);
  };

  const activeCode = getCurrentCode();
  const lineCount = Math.max(1, activeCode.split("\n").length);
  const charCount = activeCode.length;

  return (
    <div
      id="code-editor-section"
      className={`relative bg-white dark:bg-slate-800/90 rounded-2xl border ${
        isDragging
          ? "border-dashed border-blue-500 ring-2 ring-blue-500/20"
          : "border-slate-200 dark:border-slate-700"
      } p-5 shadow-sm my-6 transition`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input for Open File */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".txt,.html,.htm,.css,.js,.mjs,.cjs,.ts,.tsx,.py,.cpp,.c,.cs,.go,.rs,.java,.kt,.swift,.php,.rb,.sh,.json,.md,.sql,.yaml,.yml"
      />

      {/* Drag overlay notice */}
      {isDragging && (
        <div className="absolute inset-0 z-50 rounded-2xl bg-blue-600/10 backdrop-blur-xs flex items-center justify-center pointer-events-none">
          <div className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm shadow-xl flex items-center space-x-2">
            <Upload className="w-5 h-5 animate-bounce" />
            <span>Drop file here to import into Code Editor</span>
          </div>
        </div>
      )}

      {/* Toast message */}
      {toastMsg && (
        <div className="absolute top-3 right-5 z-40 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-lg border border-slate-700 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              #1
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Online Code Editor & Runner
            </h2>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                isWebLanguage(currentLang)
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              }`}
            >
              {isWebLanguage(currentLang) ? "Native In-Browser Sandbox" : "AI Virtual Simulation Runner"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isWebLanguage(currentLang)
              ? "Live browser execution for HTML, CSS & JavaScript with console interceptor"
              : `Simulated execution for ${currentLang} via AI virtual compiler engine with stdout/stderr`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currentLang}
            onChange={(e) => handleLanguageSelect(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            {LANGUAGE_CATALOG.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name} ({lang.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        {/* Language Tabs */}
        {isWebLanguage(currentLang) ? (
          <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("html")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "html"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("css")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "css"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              CSS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("js")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "js"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              JavaScript
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm">
              <FileCode className="w-3.5 h-3.5" />
              <span>{currentLang} Code</span>
            </div>
            <button
              type="button"
              onClick={() => handleLanguageSelect("HTML")}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 underline"
            >
              Switch to Web (HTML/CSS/JS)
            </button>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Run Code Button */}
          <button
            type="button"
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-semibold shadow-sm transition"
            title="Execute code (Ctrl+Enter)"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>

          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-600 transition"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>

          {/* Open / Import File */}
          <button
            type="button"
            id="openFileBtn"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-600 transition"
            title="Import or drag & drop a code file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Open File</span>
          </button>

          {/* Export as File */}
          <button
            type="button"
            id="exportAsFileBtn"
            aria-label="Export as File"
            onClick={handleExportFile}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-600 transition"
            title={`Export as .${isTextLanguage(currentLang) ? "txt" : "code"} file`}
          >
            {exported ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exported ? "Exported!" : "Export as File"}</span>
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-600 transition"
            title="Clear active tab"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          {/* Ask AI */}
          <button
            type="button"
            onClick={() => {
              const active = getCurrentCode();
              const lang = isWebLanguage(currentLang)
                ? activeTab.toUpperCase()
                : currentLang;
              onSendToAI?.(
                active,
                lang,
                `Explain, debug, and review this ${lang} code:\n\n\`\`\`${lang.toLowerCase()}\n${active}\n\`\`\``
              );
            }}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers & Tab Indentation */}
      <div className="mt-3 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shadow-inner">
        <div className="flex relative">
          {/* Line Numbers Gutter */}
          <div
            ref={lineNumbersRef}
            className="py-3.5 pl-3 pr-2 select-none text-right font-mono text-xs text-slate-500 bg-slate-950/70 border-r border-slate-800 overflow-hidden shrink-0"
            style={{ minWidth: "42px", maxHeight: "240px" }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            ref={textareaRef}
            id="mainCodeTextarea"
            value={activeCode}
            onChange={(e) => {
              setCurrentCode(e.target.value);
              updateCursorPosition();
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onScroll={handleScroll}
            rows={9}
            className="w-full font-mono text-sm py-3.5 px-3 bg-transparent text-slate-100 focus:outline-none resize-y leading-6 selection:bg-blue-600/40"
            placeholder={`Write ${isWebLanguage(currentLang) ? activeTab.toUpperCase() : currentLang} code here (press Tab to indent)...`}
            spellCheck={false}
          />
        </div>

        {/* Editor Status Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/90 border-t border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-3">
            <span>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
            <span>•</span>
            <span>
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Tab: 2 spaces</span>
            <span>•</span>
            <span className="text-blue-400 font-semibold">{currentLang}</span>
          </div>
        </div>
      </div>

      {/* Output Panel: Live Preview & Terminal / Console */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2 text-xs">
          {/* Output Mode Switcher */}
          <div className="flex items-center space-x-1 p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            {isWebLanguage(currentLang) && (
              <button
                type="button"
                onClick={() => setOutputTab("preview")}
                className={`px-3 py-1 rounded-md transition flex items-center space-x-1.5 ${
                  outputTab === "preview"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Live Preview</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setOutputTab("terminal")}
              className={`px-3 py-1 rounded-md transition flex items-center space-x-1.5 ${
                outputTab === "terminal" || !isWebLanguage(currentLang)
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Terminal & Console</span>
              {terminalLogs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">
                  {terminalLogs.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
            {outputTab === "terminal" && terminalLogs.length > 0 && (
              <button
                type="button"
                onClick={() => setTerminalLogs([])}
                className="hover:text-rose-500 text-[11px] underline"
              >
                Clear Terminal
              </button>
            )}
            {lastRunTime && <span>Executed: {lastRunTime}</span>}
          </div>
        </div>

        {/* View 1: Live Web Preview iframe */}
        {isWebLanguage(currentLang) && outputTab === "preview" && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white shadow-inner">
            <iframe
              id="liveOutput"
              ref={previewFrameRef}
              title="Live Output Preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-modals"
              className="w-full h-64 border-none bg-white"
            />
          </div>
        )}

        {/* View 2: Terminal / Console Output */}
        {(outputTab === "terminal" || !isWebLanguage(currentLang)) && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs overflow-hidden shadow-inner">
            <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-slate-300">
                  {isWebLanguage(currentLang)
                    ? "Sandbox Console Log"
                    : `${currentLang} Standard Output (Stdout/Stderr)`}
                </span>
              </div>
              <span className="text-slate-500">Interactive Stream</span>
            </div>

            <div className="p-3 h-64 overflow-y-auto space-y-1 text-slate-200 scrollbar-thin">
              {terminalLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-1 italic text-xs">
                  <Terminal className="w-6 h-6 stroke-1 text-slate-600" />
                  <span>No output yet. Click "Run Code" to execute.</span>
                </div>
              ) : (
                terminalLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
                    <span className="text-slate-600 select-none text-[10px] shrink-0 pt-0.5">
                      {log.time}
                    </span>
                    {log.type === "system" && (
                      <span className="text-indigo-400 font-semibold">{log.text}</span>
                    )}
                    {log.type === "stdout" && (
                      <span className="text-emerald-300 whitespace-pre-wrap">{log.text}</span>
                    )}
                    {log.type === "info" && (
                      <span className="text-blue-300 whitespace-pre-wrap">{log.text}</span>
                    )}
                    {log.type === "warn" && (
                      <span className="text-amber-300 whitespace-pre-wrap">{log.text}</span>
                    )}
                    {log.type === "error" && (
                      <span className="text-rose-400 whitespace-pre-wrap">{log.text}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
