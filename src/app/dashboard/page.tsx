"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CIVIC_QUOTES } from "@/data/constants";
import { useComplaints } from "@/hooks/useComplaints";

export default function DashboardPage() {
  const { complaints, stats } = useComplaints();
  const recent = complaints.slice(0, 6);

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
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Dashboard</p>
            <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Complaint Performance Overview</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-200">{CIVIC_QUOTES[1]}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-6 px-6 pb-16">
        <section className="grid gap-4 md:grid-cols-3">
          <motion.article whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total Complaints</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
          </motion.article>
          <motion.article whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{stats.resolved}</p>
          </motion.article>
          <motion.article whileHover={{ y: -3 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-300">{stats.pending}</p>
          </motion.article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">Recent Complaints</h2>
            <Link href="/report" className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10">
              Report New Issue
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-6 text-center">
              <p className="text-sm text-slate-300">No complaints submitted yet.</p>
              <p className="mt-2 text-xs italic text-slate-400">{CIVIC_QUOTES[2]}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((complaint) => (
                <article key={complaint.id} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{complaint.title}</h3>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-slate-200">{complaint.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">{complaint.location}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
