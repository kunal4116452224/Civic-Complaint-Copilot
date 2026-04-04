"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BeforeAfterCard } from "@/components/BeforeAfterCard";
import { CIVIC_QUOTES, ISSUE_VISUALS } from "@/data/constants";
import { useLang } from "@/contexts/LanguageContext";

const showcase = [
  { key: "garbage", titleKey: "garbageCase" },
  { key: "pothole", titleKey: "potholeCase" },
  { key: "streetlight", titleKey: "streetlightCase" },
] as const;

export default function BeforeAfterPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen pt-24">
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/assets/120230660.avif"
            alt={t("beforeAfterLabel")}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="relative p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{t("beforeAfterLabel")}</p>
            <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">{t("beforeAfterTitle")}</h1>
            <p className="mt-3 text-sm italic text-slate-200">{t("quote3")}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-6 px-6 pb-16">
        {showcase.map((item, index) => {
          const visual = ISSUE_VISUALS[item.key];
          return (
            <motion.section
              key={item.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl"
            >
              <h2 className="text-xl font-bold text-white">{t(item.titleKey)}</h2>
              <BeforeAfterCard
                beforeLabel={t("currentSituation")}
                afterLabel={t("expectedResolution")}
                beforeImage={visual.before}
                afterImage={visual.after}
                className="shadow-xl"
              />
            </motion.section>
          );
        })}
      </main>
    </div>
  );
}
