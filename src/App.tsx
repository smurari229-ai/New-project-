import React, { useState, useEffect, useRef, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { CodeEditor } from "./components/CodeEditor";
import { AIAssistant } from "./components/AIAssistant";
import { LanguageHub } from "./components/LanguageHub";
import { ShortcutsModal } from "./components/ShortcutsModal";
import { ToolsTextFormat } from "./components/tools/ToolsTextFormat";
import { ToolsMathCalculators } from "./components/tools/ToolsMathCalculators";
import { ToolsDataWeb } from "./components/tools/ToolsDataWeb";
import { ToolsAdvancedDev } from "./components/tools/ToolsAdvancedDev";
import { ToolCategory } from "./types";
import { safeStorageGet, safeStorageSet } from "./utils/helpers";
import { ALL_TOOLS_METADATA } from "./data/toolsMetadata";
import {
  Wrench,
  Sparkles,
  Zap,
  Globe2,
  Lock,
  ChevronDown,
  Layers,
  ArrowUp,
  SearchX,
  RotateCcw,
} from "lucide-react";

const TOOL_CATEGORY_COUNTS: Record<string, number> = {
  All: 150,
  Web: 12,
  Text: 20,
  Formatting: 9,
  Converters: 11,
  Security: 10,
  Encryption: 0,
  Hashes: 7,
  Math: 21,
  Time: 6,
  Color: 4,
  Generators: 6,
  HTML: 4,
  CSS: 17,
  JavaScript: 12,
  API: 3,
  Data: 1,
  DevOps: 2,
  Utilities: 5,
  Miscellaneous: 0,
};

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = safeStorageGet("csh_theme");
        if (saved) return saved === "dark";
        if (typeof window.matchMedia === "function") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
      }
    } catch {
      // Fallback cleanly
    }
    return false;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All");
  const [activeTab, setActiveTab] = useState<"tools" | "languages" | "editor" | "ai">("tools");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Cross-component communication state
  const [activeCode, setActiveCode] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("HTML/CSS/JS");
  const [incomingAiQuery, setIncomingAiQuery] = useState("");
  const activeCodeGetterRef = useRef<(() => { tab: string; code: string }) | null>(null);
  const applyCodeToEditorRef = useRef<((lang: string, code: string) => void) | null>(null);

  // Dynamically compute category counts from tools registry
  const dynamicCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: ALL_TOOLS_METADATA.length + 1, // +1 for Code Editor
    };
    for (const t of ALL_TOOLS_METADATA) {
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Compute number of matching tools for active search & category
  const matchingToolsCount = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_TOOLS_METADATA.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" || selectedCategory === t.category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        `#${t.id}`.includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }).length;
  }, [searchQuery, selectedCategory]);

  // Sync dark mode class
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        safeStorageSet("csh_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        safeStorageSet("csh_theme", "light");
      }
    } catch {
      // Fallback cleanly
    }
  }, [darkMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Shortcuts modal on "?" (when not typing in an input or textarea)
      if (
        e.key === "?" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
      // Toggle dark mode (Ctrl/Cmd + Shift + L)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setDarkMode((prev) => !prev);
      }
      // Focus Search (Ctrl/Cmd + Shift + F)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        const searchInput = document.getElementById("search-all-tools-input");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendCodeToAI = (code: string, language: string, promptText?: string) => {
    const query =
      promptText ||
      `Please review, explain, and optimize the following ${language} code:\n\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\``;
    setIncomingAiQuery(query);
    // Scroll to AI assistant
    document
      .getElementById("ai-assistant-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectLanguageFromHub = (lang: string) => {
    setActiveLanguage(lang);
    setActiveTab("editor");
  };

  const handleAskAIFromHub = (prompt: string) => {
    setIncomingAiQuery(prompt);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenShortcuts={() => setShowShortcuts(true)}
        categoryCounts={dynamicCategoryCounts}
        totalTools={ALL_TOOLS_METADATA.length + 1}
        onJumpToSection={scrollToSection}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero Section Banner */}
        <section
          id="hero-section"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-10 shadow-lg"
        >
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Full-Stack Developer Super Hub 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              150+ Coding Tools, Multi-Language Sandbox & AI Assistant
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Instantly format, convert, test, encrypt, and debug code. Includes a live
              in-browser execution sandbox for 65+ programming languages, plus Gemini AI coding copilot.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection("code-editor-section")}
                className="px-4 py-2.5 bg-white text-blue-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-blue-50 transition shadow-sm"
              >
                Open Code Sandbox
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("all-tools-grid")}
                className="px-4 py-2.5 bg-blue-700/60 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition"
              >
                Browse 150+ Tools
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("ai-assistant-section")}
                className="px-4 py-2.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Ask AI Copilot</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar in Hero */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-white">150+</div>
              <div className="text-xs text-blue-200">Developer Tools</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-white">65+</div>
              <div className="text-xs text-blue-200">Supported Languages</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-white">Gemini 2.5</div>
              <div className="text-xs text-blue-200">Server AI Engine</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-xs text-blue-200">Private & Secure</div>
            </div>
          </div>
        </section>

        {/* Section Tabs Quick Switcher */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => scrollToSection("all-tools-grid")}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition flex items-center space-x-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              <span>150 Tools Grid</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("code-editor-section")}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Multi-Language Sandbox</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("ai-assistant-section")}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Coding Assistant</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("languages-hub-section")}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition flex items-center space-x-1.5"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>65+ Languages</span>
            </button>
          </div>
        </div>

        {/* Core Workspace: Code Sandbox & AI Copilot in Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Multi-Language Code Editor (7 cols on lg) */}
          <div className="lg:col-span-7">
            <CodeEditor
              onSendToAI={handleSendCodeToAI}
              initialLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
              registerActiveCodeGetter={(fn) => {
                activeCodeGetterRef.current = fn;
              }}
              registerApplyCodeHandler={(fn) => {
                applyCodeToEditorRef.current = fn;
              }}
            />
          </div>

          {/* Right Column: AI Coding Assistant (5 cols on lg) */}
          <div className="lg:col-span-5">
            <AIAssistant
              incomingPrompt={incomingAiQuery}
              currentCode={activeCode}
              currentLanguage={activeLanguage}
              onApplyCodeToEditor={(lang, code) => {
                if (applyCodeToEditorRef.current) {
                  applyCodeToEditorRef.current(lang, code);
                }
                scrollToSection("code-editor-section");
              }}
              getActiveCode={() =>
                activeCodeGetterRef.current?.() || {
                  tab: activeLanguage,
                  code: activeCode,
                }
              }
            />
          </div>
        </div>

        {/* 65+ Programming Languages Catalog Section */}
        <LanguageHub
          onSelectLanguage={handleSelectLanguageFromHub}
          onAskAI={handleAskAIFromHub}
        />

        {/* 150+ Tools Section */}
        <section id="all-tools-grid" className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Developer Toolbox (Tools 2 – 150)
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {selectedCategory === "All" ? "All Categories" : selectedCategory}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {matchingToolsCount} {matchingToolsCount === 1 ? "tool" : "tools"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fast, responsive, zero-latency in-browser utilities for everyday engineering tasks
              </p>
            </div>

            {searchQuery && (
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                <span>
                  Filtered by:{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    "{searchQuery}"
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-rose-500 underline ml-1"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Tools Grid or Empty State */}
          {matchingToolsCount === 0 ? (
            <div className="my-8 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <SearchX className="w-7 h-7" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No developer tools found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {searchQuery
                    ? `No developer tools matched "${searchQuery}" in category "${selectedCategory}".`
                    : `No developer tools currently registered in category "${selectedCategory}".`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Search</span>
                  </button>
                )}
                {selectedCategory !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-300 dark:border-slate-700 transition"
                  >
                    View All Categories (150 tools)
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 w-full max-w-lg">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                  Popular Searches
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {[
                    "JSON",
                    "Base64",
                    "Regex",
                    "Hash",
                    "UUID",
                    "Color",
                    "SQL",
                    "JWT",
                    "Markdown",
                    "Epoch",
                    "Flexbox",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        setSelectedCategory("All");
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-xs text-slate-600 dark:text-slate-400 transition border border-slate-200 dark:border-slate-800"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Tools 2 - 20 (Text, Formatting, Conversion, Hashes) */}
              <ToolsTextFormat
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />

              {/* Tools 21 - 50 (Math, Calculations, Financial, Conversion) */}
              <ToolsMathCalculators
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />

              {/* Tools 51 - 100 (Data, Web, CSS, JSON, SEO, Dev Cheat Sheets) */}
              <ToolsDataWeb
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />

              {/* Tools 101 - 150 (Diff, Ciphers, Advanced Crypto, Modern CSS & JS Snippets) */}
              <ToolsAdvancedDev
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 pb-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-700 dark:text-slate-300">
            <button
              type="button"
              onClick={() => scrollToSection("hero-section")}
              className="hover:text-blue-600 transition"
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("code-editor-section")}
              className="hover:text-blue-600 transition"
            >
              Editor Sandbox
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("ai-assistant-section")}
              className="hover:text-blue-600 transition"
            >
              AI Coding Assistant
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("languages-hub-section")}
              className="hover:text-blue-600 transition"
            >
              Languages Hub
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("all-tools-grid")}
              className="hover:text-blue-600 transition"
            >
              150 Tools
            </button>
            <button
              type="button"
              onClick={() => setShowShortcuts(true)}
              className="hover:text-blue-600 transition"
            >
              Shortcuts (?)
            </button>
            <a
              href="/api/download/codebase-pdf"
              download="CodingSuperHub_Complete_SourceCode.pdf"
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 transition text-xs font-semibold"
              title="Download 188-page Full Codebase PDF"
            >
              <span>📄 Download Codebase PDF (188 Pages)</span>
            </a>
          </div>
          <p>
            Coding Super Hub &bull; 150+ developer tools, real-time code sandbox & Gemini AI integration.
          </p>
        </footer>
      </main>

      {/* Floating Back-to-Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg z-40 transition hover:scale-105"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
