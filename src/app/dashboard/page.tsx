"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CIVIC_QUOTES } from "@/data/constants";
import { useComplaints } from "@/hooks/useComplaints";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const { t } = useLang();
  const { complaints, stats, updateStatus } = useComplaints();

  useEffect(() => {
    if (auth.ready && !auth.isLoggedIn) {
      router.replace("/login");
    }
  }, [auth.ready, auth.isLoggedIn, router]);

  // Filter complaints based on role
  const filteredComplaints = useMemo(() => {
    if (auth.userRole === "admin") return complaints;
    return complaints.filter(
      (c) => c.submittedBy === auth.userName || !c.submittedBy
    );
  }, [complaints, auth.userRole, auth.userName]);

  const filteredStats = useMemo(() => ({
    total: filteredComplaints.length,
    pending: filteredComplaints.filter((c) => c.status !== "Resolved").length,
    resolved: filteredComplaints.filter((c) => c.status === "Resolved").length,
  }), [filteredComplaints]);

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

      <main className="mx-auto max-w-6xl space-y-6 px-6 pb-16">
        <section className="grid gap-4 md:grid-cols-3">
          <motion.article whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">{t("totalComplaints")}</p>
            <p className="mt-2 text-3xl font-bold text-white">{filteredStats.total}</p>
          </motion.article>
          <motion.article whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">{t("resolved")}</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{filteredStats.resolved}</p>
          </motion.article>
          <motion.article whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">{t("pending")}</p>
            <p className="mt-2 text-3xl font-bold text-amber-300">{filteredStats.pending}</p>
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
            <div className="space-y-3">
              {recent.map((complaint) => (
                <article key={complaint.id} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{complaint.title}</h3>
                    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${complaint.status === "Resolved"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : complaint.status === "In Progress"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-white/10 text-slate-200"
                      }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">{complaint.location}</p>

                  {/* Admin: show submittedBy + status controls */}
                  {auth.userRole === "admin" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {complaint.submittedBy && (
                        <span className="text-xs text-slate-400">
                          {t("submittedBy")}: <span className="font-semibold text-slate-300">{complaint.submittedBy}</span>
                        </span>
                      )}
                      <div className="ml-auto flex gap-2">
                        {complaint.status !== "In Progress" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(complaint.id, "In Progress")}
                            className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 transition hover:bg-amber-500/20"
                          >
                            {t("markInProgress")}
                          </button>
                        )}
                        {complaint.status !== "Resolved" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(complaint.id, "Resolved")}
                            className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                          >
                            {t("markResolved")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
