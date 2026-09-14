import React from "react";
import { ToolCategory } from "../types";
import {
  Code2,
  Search,
  Moon,
  Sun,
  Bot,
  Keyboard,
  Globe2,
  Sparkles,
  Terminal,
  FileDown,
} from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  categoryCounts?: Record<string, number>;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenShortcuts: () => void;
  onJumpToSection?: (sectionId: string) => void;
  totalTools?: number;
}

const CATEGORIES: ToolCategory[] = [
  "All",
  "Web",
  "Text",
  "Formatting",
  "Converters",
  "Security",
  "Encryption",
  "Hashes",
  "Math",
  "Time",
  "Color",
  "Generators",
  "HTML",
  "CSS",
  "JavaScript",
  "Code",
  "API",
  "Data",
  "DevOps",
  "AI",
  "Audio",
  "Utilities",
  "Miscellaneous",
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  darkMode,
  onToggleDarkMode,
  onOpenShortcuts,
  onJumpToSection,
  totalTools = 150,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top brand & actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Coding Super Hub
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {totalTools} Tools
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI Copilot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All-in-one developer workspace, editor, and 48 language hub
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onJumpToSection?.("ai-assistant-section")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-medium transition"
              title="Jump to Coding Super AI"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Super AI</span>
            </button>

            <button
              type="button"
              onClick={() => onJumpToSection?.("code-editor-section")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
              title="Jump to Live Code Editor"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>

            <button
              type="button"
              onClick={() => onJumpToSection?.("languages-hub-section")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
              title="Jump to 48 Languages Hub"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Languages</span>
            </button>

            <a
              href="/api/download/codebase-pdf"
              download="CodingSuperHub_Complete_SourceCode.pdf"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-semibold transition"
              title="Download Full Source Code as PDF (188 Pages)"
              id="download-codebase-pdf-btn"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Code PDF</span>
            </a>

            <button
              type="button"
              onClick={onOpenShortcuts}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Keyboard shortcuts (?)"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400" />
              )}
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="toolSearchInput"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 150 tools by name, utility (e.g. jwt, hash, base64, bmi, regex, uuid, flexbox)..."
            className="w-full pl-9 pr-24 py-2 bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 rounded">
              Ctrl+Shift+F
            </kbd>
          </div>
        </div>

        {/* Category Pills Scroller */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "All" ? totalTools : (categoryCounts?.[cat] ?? 0);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-blue-800/80 text-blue-100"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
