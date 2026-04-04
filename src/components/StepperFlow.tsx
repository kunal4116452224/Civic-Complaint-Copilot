"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

interface Step {
  title: string;
  description: string;
}

interface StepperFlowProps {
  steps: Step[];
  activeStep: number;
  unlockedStep: number;
  onStepClick: (index: number) => void;
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  hideActions?: boolean;
}

export function StepperFlow({
  steps,
  activeStep,
  unlockedStep,
  onStepClick,
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  nextLabel,
  hideActions = false,
}: StepperFlowProps) {
  const { t } = useLang();
  const progress = (activeStep / (steps.length - 1)) * 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <ol className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isComplete = index < activeStep;
          const isClickable = index <= unlockedStep;
          return (
            <li key={step.title}>
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`w-full rounded-xl border p-3 text-left transition ${isActive
                  ? "border-emerald-400/60 bg-emerald-500/10"
                  : isComplete
                    ? "border-cyan-400/30 bg-cyan-500/10"
                    : "border-white/10 bg-white/[0.02]"
                  } ${isClickable ? "hover:border-white/30" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isActive
                      ? "bg-emerald-400 text-emerald-950"
                      : isComplete
                        ? "bg-cyan-400 text-cyan-950"
                        : "bg-slate-700 text-slate-200"
                      }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">{t(step.title)}</span>
                </div>
                <p className="text-xs text-slate-300">{t(step.description)}</p>
              </button>
            </li>
          );
        })}
      </ol>

      {!hideActions && (
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("backToEdit")}
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {nextLabel}
          </motion.button>
        </div>
      )}
    </div>
  );
}
