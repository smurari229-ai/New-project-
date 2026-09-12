import React, { useState } from "react";
import { ToolCategory } from "../types";
import { Copy, Check } from "lucide-react";

interface ToolCardProps {
  id: number;
  title: string;
  category: ToolCategory;
  description?: string;
  children: React.ReactNode;
  output?: string | React.ReactNode;
  copyText?: string;
  isError?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Web: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
  Text: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  Formatting: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  Converters: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
  Security: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  Encryption: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
  Hashes: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  Math: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  Time: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
  Color: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
  Generators: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  HTML: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  CSS: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  JavaScript: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20",
  API: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/20",
  Data: "bg-lime-500/10 text-lime-700 dark:text-lime-300 border-lime-500/20",
  DevOps: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  Utilities: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  Miscellaneous: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20",
};

export const ToolCard: React.FC<ToolCardProps> = ({
  id,
  title,
  category,
  description,
  children,
  output,
  copyText,
  isError,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = copyText || (typeof output === "string" ? output : "");
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const badgeColor =
    CATEGORY_COLORS[category] ||
    "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";

  return (
    <div
      id={`tool-${id}`}
      data-tool-id={id}
      data-category={category}
      className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Header: Number, Title, Category Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                #{id}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
                {title}
              </h3>
            </div>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <span
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border whitespace-nowrap ${badgeColor}`}
          >
            {category}
          </span>
        </div>

        {/* Tool Interactive Form Body */}
        <div className="space-y-3 mt-3">{children}</div>
      </div>

      {/* Result Output Container if present */}
      {output !== undefined && output !== null && output !== "" && (
        <div className="mt-4 relative group">
          <div
            className={`p-3.5 rounded-xl text-xs font-mono whitespace-pre-wrap break-words leading-relaxed border transition ${
              isError
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-900"
                : "bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80"
            }`}
          >
            {output}
          </div>

          {(copyText || typeof output === "string") && (
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm opacity-80 hover:opacity-100 transition text-[11px]"
              title="Copy Output"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
