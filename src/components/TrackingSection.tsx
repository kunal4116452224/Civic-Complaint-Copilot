"use client";

import { motion } from "framer-motion";
import { STATUSES } from "@/config/authorities";
import { TRACKING_STAGES } from "@/data/constants";
import type { Complaint } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";

interface TrackingSectionProps {
  complaints: Complaint[];
  highlightedId?: string | null;
  onStatusChange: (id: string, status: Complaint["status"]) => void;
  onDelete: (id: string) => void;
  onDownloadPdf: (complaint: Complaint) => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function stageTimestamp(baseIso: string, stageKey: (typeof TRACKING_STAGES)[number]["key"]) {
  const base = new Date(baseIso).getTime();
  if (stageKey === "Submitted") return new Date(base).toISOString();
  if (stageKey === "In Progress") return new Date(base + 6 * 60 * 60 * 1000).toISOString();
  return new Date(base + 48 * 60 * 60 * 1000).toISOString();
}

function statusIndex(status: Complaint["status"]): number {
  if (status === "Submitted") return 0;
  if (status === "In Progress") return 1;
  return 2;
}

export function TrackingSection({
  complaints,
  highlightedId,
  onStatusChange,
  onDelete,
  onDownloadPdf,
}: TrackingSectionProps) {
  const { t } = useLang();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
        <h2 className="text-2xl font-bold text-white">{t("complaintTracking")}</h2>
        <p className="mt-1 text-sm text-slate-300">{t("trackProgressDesc")}</p>
      </div>

      {complaints.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-300">
          {t("noComplaintsTracked")}
        </div>
      ) : (
        complaints.map((complaint, index) => {
          const currentIndex = statusIndex(complaint.status);
          const isHighlighted = complaint.id === highlightedId;
          return (
            <motion.article
              key={complaint.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border p-5 shadow-xl transition ${isHighlighted
                ? "border-emerald-400/60 bg-emerald-500/10"
                : "border-white/10 bg-slate-900/70"
                }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{complaint.id}</p>
                  <h3 className="mt-1 text-lg font-bold text-white">{complaint.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{complaint.location}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={complaint.status}
                    onChange={(event) =>
                      onStatusChange(complaint.id, event.target.value as Complaint["status"])
                    }
                    className="rounded-xl border border-white/20 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {t("status" + status.replace(/\s+/g, ""))}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => onDownloadPdf(complaint)}
                    className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(complaint.id)}
                    className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {TRACKING_STAGES.map((stage, stageIndex) => {
                  const completed = stageIndex <= currentIndex;
                  const timestamp = stageTimestamp(complaint.timestamp, stage.key);
                  return (
                    <div key={stage.key} className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${completed ? "bg-emerald-400 text-emerald-950" : "bg-slate-700 text-slate-200"
                            }`}
                        >
                          {stage.icon}
                        </span>
                        <p className="text-sm font-semibold text-white">{t("status" + stage.key.replace(/\s+/g, ""))}</p>
                      </div>
                      <p className="text-xs text-slate-300">
                        {completed ? formatTime(timestamp) : t("pendingUpdate")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.article>
          );
        })
      )}
    </section>
  );
}
