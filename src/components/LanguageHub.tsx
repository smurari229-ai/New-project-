import React, { useState, useEffect } from "react";
import { LANGUAGE_CATALOG } from "../data/languages";
import { LanguageInfo } from "../types";
import { safeCopyToClipboard } from "../utils/helpers";
import {
  Globe2,
  Search,
  Code2,
  Sparkles,
  X,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

interface LanguageHubProps {
  onSelectLanguage: (lang: string) => void;
  onAskAI: (query: string) => void;
}

export const LanguageHub: React.FC<LanguageHubProps> = ({
  onSelectLanguage,
  onAskAI,
}) => {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageInfo | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedLanguage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedLanguage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLanguage]);

  const filtered = LANGUAGE_CATALOG.filter((item) => {
    const q = search.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  const handleCopyCode = async (code?: string) => {
    if (!code) return;
    const ok = await safeCopyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleUseInEditor = (lang: LanguageInfo) => {
    onSelectLanguage(lang.name);
    setSelectedLanguage(null);
    document
      .getElementById("code-editor-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAskAI = (lang: LanguageInfo) => {
    onAskAI(
      `Teach me ${lang.name} (${lang.category}). Give me a structured guide covering:\n1. Core language paradigms & standout features\n2. Practical starter example\n3. Best real-world use cases & ecosystem tools`
    );
    setSelectedLanguage(null);
    document
      .getElementById("ai-assistant-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="languages-hub-section"
      className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm my-6 transition"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Programming Languages Hub
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {LANGUAGE_CATALOG.length} Languages
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse major programming, scripting, mobile, systems, hardware, and web formats with starter code
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search language (e.g. Rust, Go, SQL)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-4">
        {filtered.map((lang) => (
          <button
            key={lang.name}
            type="button"
            onClick={() => setSelectedLanguage(lang)}
            className="text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 hover:border-blue-300 dark:hover:border-blue-500/50 transition group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {lang.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {lang.category}
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No languages matched "{search}". Try searching for another name or category.
          </div>
        )}
      </div>

      {/* Language Modal */}
      {selectedLanguage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedLanguage(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedLanguage.name}
                  </h3>
                  {selectedLanguage.extension && (
                    <span className="px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700">
                      {selectedLanguage.extension}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {selectedLanguage.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLanguage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedLanguage.description ||
                "Versatile language supported in Coding Super Hub for development and learning."}
            </p>

            {selectedLanguage.starterCode && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Starter Code:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedLanguage.starterCode)}
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? "Copied!" : "Copy Snippet"}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                  {selectedLanguage.starterCode}
                </pre>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleUseInEditor(selectedLanguage)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition"
              >
                <Code2 className="w-4 h-4" />
                <span>Load in Editor</span>
              </button>

              <button
                type="button"
                onClick={() => handleAskAI(selectedLanguage)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Learn with AI Copilot</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
