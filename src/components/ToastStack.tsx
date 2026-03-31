"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface ToastMessage {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastStackProps {
  toasts: ToastMessage[];
}

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div className="fixed right-4 top-4 z-[100] flex max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 20 }}
            className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                : toast.type === "error"
                ? "border-red-400/40 bg-red-500/15 text-red-100"
                : "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
