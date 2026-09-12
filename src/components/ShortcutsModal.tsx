import React from "react";
import { X, Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { desc: "Ask AI Assistant", keys: ["Ctrl/Cmd", "Enter"] },
    { desc: "Run Active Editor Code", keys: ["Ctrl", "Shift", "R"] },
    { desc: "Copy Active Editor Code", keys: ["Ctrl", "Shift", "C"] },
    { desc: "Toggle Dark / Light Mode", keys: ["Ctrl", "Shift", "L"] },
    { desc: "Focus Tool Search Bar", keys: ["Ctrl", "Shift", "F"] },
    { desc: "Open / Close Shortcuts Help", keys: ["?"] },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {shortcuts.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-none"
            >
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {item.desc}
              </span>
              <div className="flex items-center space-x-1">
                {item.keys.map((k, idx) => (
                  <kbd
                    key={idx}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-[11px] shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
