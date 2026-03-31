"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Action {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  perform: () => void;
}

export function CommandPalette({ isOpen, setIsOpen, actions }: { 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
  actions: Action[];
}) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredActions.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
      }
      if (e.key === "Enter" && filteredActions[selectedIndex]) {
        e.preventDefault();
        filteredActions[selectedIndex].perform();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [isOpen, filteredActions, selectedIndex, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-xl glass rounded-2xl overflow-hidden pointer-events-auto shadow-2xl border-white/20"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <span className="text-xl opacity-50">🔍</span>
                <input
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500"
                />
                <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] text-slate-400 font-mono">ESC</kbd>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredActions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm italic">
                    No matching commands found...
                  </div>
                ) : (
                  filteredActions.map((action, i) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.perform();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                        i === selectedIndex ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{action.icon}</span>
                        <span className="font-medium">{action.label}</span>
                      </div>
                      {action.shortcut && (
                        <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono opacity-50">
                          {action.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="p-3 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <div className="flex gap-4">
                  <span><kbd className="bg-white/5 px-1 rounded">↑↓</kbd> Navigate</span>
                  <span><kbd className="bg-white/5 px-1 rounded">Enter</kbd> Select</span>
                </div>
                <span>Command Palette v1.0</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
