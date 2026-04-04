"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CIVIC_QUOTES } from "@/data/constants";
import { useComplaints } from "@/hooks/useComplaints";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import type { Complaint } from "@/lib/types";

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const { t } = useLang();
  const { complaints, stats: globalStats, updateStatus, remove } = useComplaints();
  const [filter, setFilter] = useState<Complaint["status"] | "All">("All");
  const [staticData, setStaticData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data/complaints.json")
      .then(res => res.json())
      .then(data => setStaticData(data))
      .catch(err => console.error("Error loading analytics data:", err));
  }, []);

  const analyticsStats = useMemo(() => {
    if (staticData.length === 0) return null;
    const total = staticData.length;
    const resolved = staticData.filter(c => c.status === "Resolved").length;
    const rejected = staticData.filter(c => c.status === "Rejected").length;
    return {
      total,
      resolvedRate: Math.round((resolved / total) * 100),
      rejectionRate: Math.round((rejected / total) * 100)
    };
  }, [staticData]);

  useEffect(() => {
    if (auth.ready && !auth.isLoggedIn) {
      router.replace("/login");
    }
  }, [auth.ready, auth.isLoggedIn, router]);

  // Filter complaints based on role
  const filteredComplaints = useMemo(() => {
    let list = auth.userRole === "admin" ? complaints : complaints.filter((c) => c.submittedBy === auth.userName || !c.submittedBy);
    if (filter !== "All") {
      list = list.filter((c) => c.status === filter);
    }
    return list;
  }, [complaints, auth.userRole, auth.userName, filter]);

  const adminStats = useMemo(() => {
    const base = auth.userRole === "admin" ? complaints : complaints.filter((c) => c.submittedBy === auth.userName || !c.submittedBy);
    return {
      total: base.length,
      submitted: base.filter((c) => c.status === "Submitted").length,
      inProgress: base.filter((c) => c.status === "In Progress").length,
      resolved: base.filter((c) => c.status === "Resolved").length,
    };
  }, [complaints, auth.userRole, auth.userName]);

  const recent = filteredComplaints.slice(0, 6);

  if (!auth.ready || !auth.isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <p className="text-sm text-slate-400">{t("checkingAuth")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/assets/temporary-workers-lift-waste-across-ap-cities.avif"
            alt="Civic dashboard header"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
          <div className="relative p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{t("dashboardLabel")}</p>
            <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">{t("complaintOverview")}</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-200">{CIVIC_QUOTES[1]}</p>
            {auth.userRole === "admin" && (
              <span className="mt-3 inline-block rounded-md bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-300">
                🛡️ {t("roleAdmin")}
              </span>
            )}
          </div>
        </div>
      </section>

      {auth.userRole === "admin" && analyticsStats && (
        <section className="mx-auto mt-8 max-w-6xl px-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{t("analyticsOverview") || "Analytics Overview"}</h2>
                <p className="text-sm text-slate-400">Municipal performance and distribution insights</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Resolution Rate</p>
                  <p className="text-xl font-bold text-emerald-400">{analyticsStats.resolvedRate}%</p>
                </div>
                <div className="text-right border-l border-white/10 pl-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Rejection Rate</p>
                  <p className="text-xl font-bold text-rose-400">{analyticsStats.rejectionRate}%</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/50 p-2">
                <Image src="/graphs/status.png" alt="Status Distribution" width={400} height={300} className="rounded-lg h-auto w-full" />
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/50 p-2">
                <Image src="/graphs/type.png" alt="Complaint Types" width={400} height={300} className="rounded-lg h-auto w-full" />
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/50 p-2">
                <Image src="/graphs/location.png" alt="Location Hotspots" width={400} height={300} className="rounded-lg h-auto w-full" />
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-6xl space-y-6 px-6 pb-16">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.article
            onClick={() => setFilter("All")}
            whileHover={{ y: -3 }}
            className={`cursor-pointer rounded-2xl border p-5 shadow-xl transition-all ${filter === "All" ? "border-cyan-400/50 bg-cyan-500/10" : "border-white/10 bg-slate-900/70"}`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{t("totalComplaints")}</p>
            <p className="mt-2 text-3xl font-bold text-white">{adminStats.total}</p>
          </motion.article>
          <motion.article
            onClick={() => setFilter("Submitted")}
            whileHover={{ y: -3 }}
            className={`cursor-pointer rounded-2xl border p-5 shadow-xl transition-all ${filter === "Submitted" ? "border-rose-400/50 bg-rose-500/10" : "border-white/10 bg-slate-900/70"}`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{t("statusSubmitted")}</p>
            <p className="mt-2 text-3xl font-bold text-rose-300">{adminStats.submitted}</p>
          </motion.article>
          <motion.article
            onClick={() => setFilter("In Progress")}
            whileHover={{ y: -3 }}
            className={`cursor-pointer rounded-2xl border p-5 shadow-xl transition-all ${filter === "In Progress" ? "border-amber-400/50 bg-amber-500/10" : "border-white/10 bg-slate-900/70"}`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{t("statusInProgress")}</p>
            <p className="mt-2 text-3xl font-bold text-amber-300">{adminStats.inProgress}</p>
          </motion.article>
          <motion.article
            onClick={() => setFilter("Resolved")}
            whileHover={{ y: -3 }}
            className={`cursor-pointer rounded-2xl border p-5 shadow-xl transition-all ${filter === "Resolved" ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-slate-900/70"}`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{t("statusResolved")}</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{adminStats.resolved}</p>
          </motion.article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">
              {auth.userRole === "admin" ? t("allComplaints") : t("myComplaints")}
            </h2>
            <Link href="/report" className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10">
              {t("reportNewIssue")}
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-6 text-center">
              <p className="text-sm text-slate-300">{t("noComplaints")}</p>
              <p className="mt-2 text-xs italic text-slate-400">{CIVIC_QUOTES[2]}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredComplaints.map((complaint) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={complaint.id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 p-4 transition-all hover:bg-slate-950/90"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {complaint.imageSrc ? (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                          <Image src={complaint.imageSrc} alt="Thumbnail" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-slate-900/50 text-2xl">
                          🏛️
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-bold text-white sm:text-base">{complaint.title}</h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${complaint.status === "Resolved"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : complaint.status === "In Progress"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-rose-500/20 text-rose-300"
                            }`}>
                            {t("status" + complaint.status.replace(/\s+/g, ""))}
                          </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <span className="opacity-70">📍</span> {complaint.location}
                        </p>

                        {/* Progress Bar Visual */}
                        <div className="mt-4 flex gap-1">
                          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${complaint.status === "Submitted" || complaint.status === "In Progress" || complaint.status === "Resolved" ? "bg-rose-500" : "bg-slate-800"}`} />
                          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${complaint.status === "In Progress" || complaint.status === "Resolved" ? "bg-amber-500" : "bg-slate-800"}`} />
                          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${complaint.status === "Resolved" ? "bg-emerald-500" : "bg-slate-800"}`} />
                        </div>
                      </div>
                    </div>

                    {auth.userRole === "admin" && (
                      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          {complaint.submittedBy && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                              <span className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px]">👤</span>
                              {complaint.submittedBy}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-600">•</span>
                          <span className="text-[11px] text-slate-500">{new Date(complaint.timestamp).toLocaleDateString()}</span>
                        </div>

                        <div className="flex gap-2">
                          {complaint.status === "Submitted" && (
                            <button
                              onClick={() => updateStatus(complaint.id, "In Progress")}
                              className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold text-amber-300 transition hover:bg-amber-500/20"
                            >
                              {t("markInProgress")}
                            </button>
                          )}
                          {complaint.status !== "Resolved" && (
                            <button
                              onClick={() => updateStatus(complaint.id, "Resolved")}
                              className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                            >
                              {t("markResolved")}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(t("confirmDelete"))) remove(complaint.id);
                            }}
                            className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-[11px] font-bold text-rose-300 transition hover:bg-rose-500/20"
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
