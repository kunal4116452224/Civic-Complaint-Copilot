"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BeforeAfterCard } from "@/components/BeforeAfterCard";
import { CIVIC_QUOTES, ISSUE_VISUALS } from "@/data/constants";

const showcase = [
  { key: "garbage", title: "Solid waste complaint outcome" },
  { key: "pothole", title: "Road damage repair tracking" },
  { key: "streetlight", title: "Streetlight restoration case" },
] as const;

export default function BeforeAfterPage() {
  return (
    <div className="min-h-screen pt-24">
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/assets/120230660.avif"
            alt="Civic progress banner"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="relative p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Before & After</p>
            <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Visual proof of complaint impact</h1>
            <p className="mt-3 text-sm italic text-slate-200">{CIVIC_QUOTES[2]}</p>
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
              <h2 className="text-xl font-bold text-white">{item.title}</h2>
              <BeforeAfterCard
                beforeLabel="Current Situation"
                afterLabel="Expected Resolution"
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
