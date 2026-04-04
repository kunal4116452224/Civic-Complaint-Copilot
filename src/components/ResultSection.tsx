"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { ISSUE_ICONS, SEV_CONFIG, STATUS_CONFIG } from "@/config/authorities";
import { ISSUE_VISUALS } from "@/data/constants";
import type { Complaint } from "@/lib/types";

const BeforeAfterCard = dynamic(
  () => import("@/components/BeforeAfterCard").then((module) => module.BeforeAfterCard),
  {
    loading: () => <div className="skeleton h-72 w-full rounded-2xl" />,
    ssr: false,
  }
);

import { useLang } from "@/contexts/LanguageContext";

interface NearbyIssue {
  id: string;
  issue_type: string;
  severity: string;
  title: string;
  location: string;
  status: "Submitted" | "In Progress" | "Resolved";
  timestamp: string;
}

interface ResultSectionProps {
  result: Complaint;
  rawText: string;
  rawLocation: string;
  titleDraft: string;
  descriptionDraft: string;
  authorityReason: string;
  nearbyIssues: NearbyIssue[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onOpenPdfPreview: () => void;
  onSubmitAndTrack: () => void;
}

export function ResultSection({
  result,
  rawText,
  rawLocation,
  titleDraft,
  descriptionDraft,
  authorityReason,
  nearbyIssues,
  onTitleChange,
  onDescriptionChange,
  onOpenPdfPreview,
  onSubmitAndTrack,
}: ResultSectionProps) {
  const { t } = useLang();
  const visual = ISSUE_VISUALS[result.issue_type] ?? ISSUE_VISUALS.other;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            {t("detectedIssue")}: {t(result.issue_type) || result.issue_type.replace(/_/g, " ")}
          </span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
            {t("suggestedAuthority")}: {t(result.department) || result.department}
          </span>
          <ConfidenceBadge score={result.confidence ?? 0.8} reasoning={result.reasoning} department={result.department} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("reasonForSelection")}</p>
            <p className="text-sm text-slate-200">{authorityReason}</p>
            <p className="mt-2 text-xs text-slate-400">{result.reasoning ?? t("mappedAnalysis")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("aiIssueSummary")}</p>
            <p className="text-sm text-slate-200">{result.issue_summary}</p>
          </div>
        </div>
      </div>

      <BeforeAfterCard
        beforeLabel={t("currentSituation")}
        afterLabel={t("expectedResolution")}
        beforeImage={visual.before}
        afterImage={visual.after}
        beforeAlt={t("currentCivicState")}
        afterAlt={t("expectedCivicResolution")}
        className="shadow-xl"
      />

      <BeforeAfterCard
        beforeLabel={t("rawUserInput")}
        afterLabel={t("aiStructuredComplaint")}
        className="shadow-xl"
        beforeContent={
          <div className="h-auto p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("inputText")}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {rawText.trim() || t("photoOnlyComplaint")}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("locationLabel")}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{rawLocation}</p>
          </div>
        }
        afterContent={
          <div className="h-auto p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">{t("generatedTitle")}</p>
            <input
              value={titleDraft}
              onChange={(event) => onTitleChange(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-cyan-400/60"
            />

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan-300">{t("complaintBody")}</p>
            <textarea
              value={descriptionDraft}
              onChange={(event) => onDescriptionChange(event.target.value)}
              rows={Math.max(10, descriptionDraft.split("\n").length + Math.ceil(descriptionDraft.length / 90) + 2)}
              className="mt-2 h-auto w-full resize-y overflow-hidden whitespace-pre-wrap rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm leading-relaxed text-white outline-none focus:border-cyan-400/60"
            />
          </div>
        }
      />

      <div className="flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPdfPreview}
          className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
        >
          {t("downloadPdf")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onSubmitAndTrack}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400"
        >
          {t("submitAndTrack")}
        </motion.button>
      </div>

      <div id="nearby-section" className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-white">{t("similarNearby")}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {nearbyIssues.map((issue) => {
            const severity = SEV_CONFIG[issue.severity];
            const status = STATUS_CONFIG[issue.status];
            return (
              <div key={issue.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm">{ISSUE_ICONS[issue.issue_type] ?? "!"}</span>
                  <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${severity?.bg ?? "bg-white/10"} ${severity?.color ?? "text-slate-200"}`}>
                    {severity?.label ?? issue.severity}
                  </span>
                  <span className={`ml-auto rounded px-2 py-0.5 text-[11px] font-semibold ${status?.bg ?? "bg-white/10"} ${status?.color ?? "text-slate-200"}`}>
                    {issue.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{issue.title}</p>
                <p className="mt-1 text-xs text-slate-300">{issue.location}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
