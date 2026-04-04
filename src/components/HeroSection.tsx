"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_IMAGES, HERO_STATS } from "@/data/constants";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface HeroSectionProps {
  onReportClick: () => void;
  onNearbyClick: () => void;
}

const STAT_KEYS: Record<string, string> = {
  "Complaints resolved": "complaintsResolved",
  "Avg resolution time": "avgResolutionTime",
};

export function HeroSection({ onReportClick, onNearbyClick }: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const { t } = useLang();
  const auth = useAuth();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={HERO_IMAGES[index]}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGES[index]}
              alt={t("cityAlt")}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-center px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${auth.userRole === "admin" ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-200" : "border-white/20 bg-white/10 text-white/85"}`}
        >
          {auth.userRole === "admin" ? "🛡️ Admin Control Mode" : t("civicCopilot")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl"
        >
          {t("heroTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {auth.userRole !== "admin" && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onReportClick}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400"
            >
              {t("reportIssueNow")}
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onNearbyClick}
            className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            {t("viewNearbyComplaints")}
          </motion.button>
        </motion.div>
      </div>

      <div className="relative border-t border-white/15 bg-black/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-5 text-white md:grid-cols-2">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-300">{t(STAT_KEYS[stat.label] ?? stat.label)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
