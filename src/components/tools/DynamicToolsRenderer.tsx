import React, { useEffect, useMemo, useRef, useState } from "react";
import { ToolCard } from "../ToolCard";
import type { DynamicTool } from "../../data/tools850/definitions";
import { ToolCategory } from "../../types";
import { Play, RotateCcw, ChevronDown } from "lucide-react";

interface DynamicToolsRendererProps {
  searchQuery: string;
  selectedCategory: ToolCategory;
}

const PAGE_SIZE = 36;

export const DynamicToolsRenderer: React.FC<DynamicToolsRendererProps> = ({
  searchQuery,
  selectedCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [tools, setTools] = useState<DynamicTool[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  // The 850-tool registry is the largest client-side payload. Keep it out of
  // the initial bundle and load it only when the tools section is approaching
  // the viewport (or when the browser does not support IntersectionObserver).
  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearViewport || tools) return;

    let cancelled = false;
    import("../../data/tools850")
      .then(({ ALL_850_TOOLS }) => {
        if (!cancelled) setTools(ALL_850_TOOLS);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [nearViewport, tools]);

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    const q = searchQuery.toLowerCase().trim();
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === "All" || selectedCategory === tool.category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        `#${tool.id}`.includes(q) ||
        String(tool.id) === q ||
        (tool.description && tool.description.toLowerCase().includes(q)) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    });
  }, [tools, searchQuery, selectedCategory]);

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
  }, [searchQuery, selectedCategory]);

  const displayedTools = filteredTools.slice(0, visibleLimit);

  return (
    <div ref={containerRef} className="space-y-6" aria-busy={!tools && !loadError}>
      {!tools && !loadError && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Preparing the 850-tool registry…
          </p>
        </div>
      )}

      {loadError && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-6 text-center">
          <p className="text-xs text-rose-700 dark:text-rose-300">
            The dynamic tool registry could not be loaded. Please refresh and try again.
          </p>
        </div>
      )}

      {tools && displayedTools.length === 0 ? null : tools ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedTools.map((tool) => <DynamicToolItem key={tool.id} tool={tool} />)}
          </div>
          {visibleLimit < filteredTools.length && (
            <div className="flex flex-col items-center justify-center pt-6 pb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Showing {displayedTools.length} of {filteredTools.length} matching tools
              </p>
              <button
                type="button"
                onClick={() => setVisibleLimit((prev) => prev + PAGE_SIZE)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>Load More Tools ({filteredTools.length - visibleLimit} remaining)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

interface DynamicToolItemProps { tool: DynamicTool; }

const DynamicToolItem: React.FC<DynamicToolItemProps> = ({ tool }) => {
  const initialValue1 = tool.default1 ?? (tool.inputType === "select-text" ? tool.options?.[0]?.value ?? "" : "");
  const [val1, setVal1] = useState<string>(initialValue1);
  const [val2, setVal2] = useState<string>(tool.default2 ?? "");
  // Defer the initial sample calculation until the browser is idle so the
  // first 36 visible cards do not all execute synchronously during render.
  // This preserves the existing default output without blocking first paint.
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const runInitial = () => {
      if (cancelled) return;
      try {
        setOutput(tool.run(initialValue1, tool.default2 ?? ""));
        setIsError(false);
      } catch {
        setOutput("");
        setIsError(false);
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(runInitial, { timeout: 1000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(runInitial, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [tool, initialValue1]);

  const execute = (v1 = val1, v2 = val2) => {
    try {
      setOutput(tool.run(v1, v2));
      setIsError(false);
    } catch (err: any) {
      setOutput("Execution Error: " + (err?.message || "Invalid input"));
      setIsError(true);
    }
  };

  const handleReset = () => {
    const d1 = tool.default1 ?? (tool.inputType === "select-text" ? tool.options?.[0]?.value ?? "" : "");
    const d2 = tool.default2 ?? "";
    setVal1(d1); setVal2(d2); execute(d1, d2);
  };

  return (
    <ToolCard id={tool.id} title={tool.title} category={tool.category}
      description={tool.description} output={output} copyText={output} isError={isError}>
      <div className="space-y-3">
        {tool.inputType === "action" ? (
          <button
            type="button"
            onClick={() => execute("", "")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{tool.actionLabel || "Run Tool"}</span>
          </button>
        ) : tool.inputType === "textarea" ? (
          <div>
            {tool.label1 && <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{tool.label1}</label>}
            <textarea value={val1} onChange={(e) => { const v=e.target.value; setVal1(v); execute(v,val2); }} rows={3}
              placeholder={tool.placeholder || "Enter text or code..."}
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ) : tool.inputType === "two-inputs" ? (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{tool.label1 || "Input 1"}</label>
              <input type="text" value={val1} onChange={(e) => { const v=e.target.value; setVal1(v); execute(v,val2); }}
                placeholder={tool.placeholder || "Enter value..."}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{tool.label2 || "Input 2"}</label>
              <input type="text" value={val2} onChange={(e) => { const v=e.target.value; setVal2(v); execute(val1,v); }}
                placeholder={tool.placeholder2 || "Enter value..."}
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        ) : tool.inputType === "select-text" ? (
          <div>
            {tool.label1 && <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{tool.label1}</label>}
            <select
              value={val1}
              onChange={(e) => { const v = e.target.value; setVal1(v); execute(v, val2); }}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(tool.options || []).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            {tool.label1 && <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{tool.label1}</label>}
            <input type={tool.inputType === "number" ? "number" : "text"} value={val1}
              onChange={(e) => { const v=e.target.value; setVal1(v); execute(v,val2); }}
              placeholder={tool.placeholder || "Enter value..."}
              className="w-full text-xs font-mono p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          {tool.inputType !== "action" && (
            <button type="button" onClick={() => execute(val1,val2)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer">
              <Play className="w-3.5 h-3.5" /><span>Run Tool</span>
            </button>
          )}
          <button type="button" onClick={handleReset} title="Reset to default sample" className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer">
            <RotateCcw className="w-3 h-3" /><span>Reset</span>
          </button>
        </div>
      </div>
    </ToolCard>
  );
};
