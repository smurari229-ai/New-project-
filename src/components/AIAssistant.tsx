import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { AIChatMessage } from "../types";
import { safeStorageGet, safeStorageSet, safeStorageRemove } from "../utils/helpers";
import {
  Bot,
  Sparkles,
  Send,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Code2,
  Wrench,
  BookOpen,
  Check,
  Copy,
  ArrowRight,
} from "lucide-react";

interface AIAssistantProps {
  currentLanguage?: string;
  incomingPrompt?: string;
  currentCode?: string;
  getActiveCode?: () => { tab: string; code: string };
  onApplyCodeToEditor?: (tab: string, code: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  currentLanguage = "JavaScript",
  incomingPrompt,
  currentCode = "",
  getActiveCode,
  onApplyCodeToEditor,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showKeyText, setShowKeyText] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>(
    "Ready: Powered by Gemini AI via full-stack server integration."
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const getActiveCodeSafe = () => {
    if (getActiveCode) {
      try {
        return getActiveCode();
      } catch {
        // fallback
      }
    }
    if (currentCode) {
      return { tab: currentLanguage || "Code", code: currentCode };
    }
    return { tab: "Code", code: "" };
  };

  useEffect(() => {
    const saved = safeStorageGet("csh_custom_key");
    if (saved) setCustomKey(saved);

    const savedHistory = safeStorageGet("csh_ai_messages");
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch {
        // ignore
      }
    } else {
      setMessages([
        {
          role: "bot",
          text: `👋 Hello! I am **Coding Super AI**, your developer copilot for **Coding Super Hub**.\n\nI can:\n- 🛠 **Debug and fix code** from your live editor\n- 📖 **Explain complex algorithms** and modern syntax\n- ⚡ **Generate production-ready code** in 40+ programming languages\n- 🔄 **Refactor and optimize performance**\n\nTry clicking **Explain Code**, **Fix Current Code**, or type any coding question below!`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (incomingPrompt && incomingPrompt.trim()) {
      handleSend(incomingPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingPrompt]);

  const saveKey = (val: string) => {
    setCustomKey(val);
    if (val.trim()) {
      safeStorageSet("csh_custom_key", val.trim());
      setStatusMsg("Custom Gemini key saved locally in this browser.");
    } else {
      safeStorageRemove("csh_custom_key");
      setStatusMsg("Using default server-side Gemini configuration.");
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || prompt).trim();
    if (!textToSend) return;

    const userMessage: AIChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: Date.now(),
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setPrompt("");
    setLoading(true);
    setStatusMsg("⏳ Coding Super AI is generating response...");

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          history: updated.slice(-6),
          language: currentLanguage,
          customApiKey: customKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reach AI service");
      }

      const botMessage: AIChatMessage = {
        role: "bot",
        text: data.answer || "No response received.",
        timestamp: Date.now(),
      };

      const finalMessages = [...updated, botMessage];
      setMessages(finalMessages);
      safeStorageSet(
        "csh_ai_messages",
        JSON.stringify(finalMessages.slice(-16))
      );
      setStatusMsg("✅ Response generated successfully.");
    } catch (err: any) {
      const errMsg = err?.message || "An unexpected error occurred.";
      const isHighDemand =
        errMsg.includes("high demand") ||
        errMsg.includes("503") ||
        errMsg.includes("temporarily") ||
        errMsg.includes("try again later");

      const tipText = isHighDemand
        ? "Google Cloud Gemini servers are currently experiencing a temporary peak load spike. Please wait a few seconds and try sending your prompt again, or enter your personal Gemini API key in the panel settings."
        : "Verify network connection or check if your API key or quota is active.";

      const errorBotMessage: AIChatMessage = {
        role: "bot",
        text: `⚠️ **Service Notice:** ${errMsg}\n\n*Action:* ${tipText}`,
        timestamp: Date.now(),
      };
      setMessages([...updated, errorBotMessage]);
      setStatusMsg(`⚠️ Service Notice: ${errMsg.slice(0, 100)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainCode = () => {
    const active = getActiveCodeSafe();
    if (!active.code.trim()) {
      setStatusMsg("❌ The active editor tab is empty. Write or paste code first.");
      return;
    }
    const query = `Analyze and explain this ${active.tab} code in ${currentLanguage}:\n\n\`\`\`${active.tab.toLowerCase()}\n${active.code}\n\`\`\`\n\nExplain how it works, potential bugs or edge cases, and suggested best-practice improvements.`;
    handleSend(query);
  };

  const handleFixCode = () => {
    const active = getActiveCodeSafe();
    if (!active.code.trim()) {
      setStatusMsg("❌ The active editor tab is empty. Write or paste code first.");
      return;
    }
    const query = `Please debug and fix this ${active.tab} code in ${currentLanguage}:\n\n\`\`\`${active.tab.toLowerCase()}\n${active.code}\n\`\`\`\n\nIdentify all syntax, logic, or runtime issues, provide a brief bullet list of what was wrong, and return the complete corrected code.`;
    handleSend(query);
  };

  const handleGenerateCode = () => {
    const p = prompt.trim();
    if (!p) {
      setPrompt(`Write a clean, responsive, production-ready ${currentLanguage} snippet for: `);
      setStatusMsg("ℹ️ Please finish describing what you want to generate, then press Ask AI.");
      return;
    }
    handleSend(`Generate production-ready ${currentLanguage} code for: ${p}. Include brief explanation and usage instructions.`);
  };

  const clearChat = () => {
    setMessages([]);
    safeStorageRemove("csh_ai_messages");
    setStatusMsg("Chat history cleared.");
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div
      id="ai-assistant-section"
      className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-900/60 p-5 shadow-xl text-white my-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-900/50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🤖 Coding Super AI</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                gemini-3.8-flash
              </span>
            </h2>
            <p className="text-xs text-indigo-200/80">
              Explain, debug, generate, and optimize code in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-900/50 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 transition"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{customKey ? "Custom Key Active" : "API Key Settings"}</span>
          </button>
          <button
            type="button"
            onClick={clearChat}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Key input drawer if requested */}
      {showKeyInput && (
        <div className="mt-3 p-3 bg-indigo-950/70 rounded-xl border border-indigo-800/60 text-xs flex flex-wrap items-center gap-2">
          <span className="text-indigo-200">Custom Gemini Key (Optional):</span>
          <div className="relative flex-1 min-w-[220px]">
            <input
              type={showKeyText ? "text" : "password"}
              value={customKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder="Leave empty to use automatic server key..."
              className="w-full pl-3 pr-8 py-1.5 bg-slate-900 border border-indigo-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowKeyText(!showKeyText)}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
            >
              {showKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {customKey && (
            <button
              type="button"
              onClick={() => saveKey("")}
              className="px-2 py-1 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded border border-rose-700"
            >
              Reset to Server Key
            </button>
          )}
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="mt-4 h-72 overflow-y-auto rounded-xl bg-slate-950/90 border border-indigo-950/80 p-4 space-y-3 font-sans text-sm scrollbar-thin">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-xl px-4 py-2.5 relative group ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none shadow-md"
                  : "bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none shadow-md"
              }`}
            >
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap font-sans leading-relaxed break-words text-sm">
                  {msg.text}
                </div>
              ) : (
                <div className="markdown-body font-sans leading-relaxed break-words text-sm text-slate-100">
                  <Markdown
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const lang = match ? match[1] : "";
                        const codeString = String(children).replace(/\n$/, "");

                        if (!inline && (match || codeString.includes("\n"))) {
                          return (
                            <div className="my-2.5 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 text-left">
                              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 text-xs text-slate-300 font-mono border-b border-slate-700/50">
                                <span className="uppercase font-bold text-blue-400">
                                  {lang || "code"}
                                </span>
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(codeString);
                                      setStatusMsg("Code block copied to clipboard!");
                                      setTimeout(
                                        () =>
                                          setStatusMsg(
                                            "Ready: Powered by Gemini AI via full-stack server integration."
                                          ),
                                        2000
                                      );
                                    }}
                                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] transition"
                                    title="Copy code snippet"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </button>
                                  {onApplyCodeToEditor && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onApplyCodeToEditor(
                                          lang || currentLanguage || "JavaScript",
                                          codeString
                                        );
                                        setStatusMsg(
                                          `Loaded ${lang || "code"} snippet into active editor.`
                                        );
                                      }}
                                      className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition"
                                      title="Load snippet into active editor"
                                    >
                                      <ArrowRight className="w-3 h-3" />
                                      <span>Apply to Editor</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                              <pre className="p-3 text-xs font-mono overflow-x-auto text-slate-100 leading-relaxed bg-slate-950/90">
                                <code>{children}</code>
                              </pre>
                            </div>
                          );
                        }
                        return (
                          <code
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                      },
                      ul({ children }) {
                        return (
                          <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                        );
                      },
                      ol({ children }) {
                        return (
                          <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                        );
                      },
                      h1({ children }) {
                        return (
                          <h1 className="text-base font-bold text-white mb-2 mt-3">{children}</h1>
                        );
                      },
                      h2({ children }) {
                        return (
                          <h2 className="text-sm font-bold text-white mb-1.5 mt-2.5">
                            {children}
                          </h2>
                        );
                      },
                      h3({ children }) {
                        return (
                          <h3 className="text-xs font-bold text-blue-300 mb-1 mt-2">
                            {children}
                          </h3>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </Markdown>
                </div>
              )}

              <button
                type="button"
                onClick={() => copyMessage(msg.text, idx)}
                className="absolute top-2 right-2 p-1 rounded bg-black/40 text-slate-300 opacity-0 group-hover:opacity-100 transition hover:bg-black/60"
                title="Copy message"
              >
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-indigo-300 text-xs italic py-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-100" />
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-200" />
            <span>Coding Super AI is thinking...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Action shortcuts */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={loading || !prompt.trim()}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow-md transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        <button
          type="button"
          onClick={handleExplainCode}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-800/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 text-xs font-medium transition"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Explain Active Tab</span>
        </button>

        <button
          type="button"
          onClick={handleFixCode}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-800/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 text-xs font-medium transition"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Fix Active Tab</span>
        </button>

        <button
          type="button"
          onClick={handleGenerateCode}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-800/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 text-xs font-medium transition"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Generate Code</span>
        </button>
      </div>

      {/* Input textarea */}
      <div className="mt-3 relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything or request refactoring (Ctrl+Enter to send)..."
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 placeholder-slate-500 rounded-xl border border-indigo-900/80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none font-mono"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={loading || !prompt.trim()}
          className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Status Bar */}
      <div className="mt-2 text-xs text-indigo-300/80 flex items-center justify-between">
        <span>{statusMsg}</span>
        <span className="hidden sm:inline text-indigo-400/60 font-mono text-[11px]">
          Shortcuts: Ctrl+Enter to send
        </span>
      </div>
    </div>
  );
};
