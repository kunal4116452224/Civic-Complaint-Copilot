"use client";

import { motion } from "framer-motion";

interface ConfidenceBadgeProps {
  score: number;
  reasoning?: string;
  department?: string;
}

export function ConfidenceBadge({ score, reasoning, department }: ConfidenceBadgeProps) {
  const percentage = Math.round(score * 100);
  
  let color = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  if (score < 0.7) color = "text-amber-400 border-amber-500/30 bg-amber-500/10";
  if (score < 0.4) color = "text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <div className="group relative inline-block">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={`px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider flex items-center gap-1.5 cursor-help transition-colors ${color}`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            score > 0.7 ? "bg-emerald-400" : score > 0.4 ? "bg-amber-400" : "bg-red-400"
          }`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
            score > 0.7 ? "bg-emerald-500" : score > 0.4 ? "bg-amber-500" : "bg-red-500"
          }`}></span>
        </span>
        AI CONFIDENCE: {percentage}%
      </motion.div>

      {/* Tooltip */}
      {(reasoning || department) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-lg text-xs shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 block">
          {department && (
            <div className="mb-2 pb-2 border-b border-white/10">
              <span className="text-slate-400">Department:</span> <br/>
              <span className="font-semibold text-white">{department}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">— assigned based on issue type</p>
            </div>
          )}
          {reasoning && (
            <div>
              <div className="font-bold text-slate-300 mb-1 text-[10px] uppercase">Severity Reasoning</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{reasoning}</p>
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
}
