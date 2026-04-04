"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BeforeAfterCard } from "@/components/BeforeAfterCard";
import { HeroSection } from "@/components/HeroSection";
import { CIVIC_QUOTES, ISSUE_VISUALS, NEARBY_ISSUES } from "@/data/constants";
import { ISSUE_ICONS } from "@/config/authorities";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { t } = useLang();
  const auth = useAuth();

  useEffect(() => {
    if (auth.ready && auth.isLoggedIn && auth.userRole === "admin") {
      router.replace("/dashboard");
    }
  }, [auth.ready, auth.isLoggedIn, auth.userRole, router]);

  const highlights = [
    {
      href: "/report",
      titleKey: "guidedSubmission",
      descKey: "guidedSubmissionDesc",
      image: "/assets/Image-Source-@-15.jpg",
    },
    {
      href: "/dashboard",
      titleKey: "performanceDashboard",
      descKey: "performanceDashboardDesc",
      image: "/assets/3079e5c261a81f02d5f02cc83ac7b7b9.jpg",
    },
    {
      href: "/tracking",
      titleKey: "timelineTracking",
      descKey: "timelineTrackingDesc",
      image: "/assets/temporary-workers-lift-waste-across-ap-cities.avif",
    },
  ];

  if (auth.userRole === "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <p className="text-sm text-slate-400">Redirecting to admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        onReportClick={() => router.push("/report")}
        onNearbyClick={() => router.push("/tracking")}
      />

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-12">
        <p className="text-center text-sm italic text-slate-400">{t("quote1")}</p>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => (
            <motion.article
              key={item.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="relative overflow-hidden rounded-2xl border border-white/10"
            >
              <Image src={item.image} alt={t(item.titleKey)} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative p-5">
                <h2 className="text-lg font-bold text-white">{t(item.titleKey)}</h2>
                <p className="mt-2 text-sm text-slate-200">{t(item.descKey)}</p>
                <Link
                  href={item.href}
                  className="mt-4 inline-block rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  {t("open")}
                </Link>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-bold text-white">{t("beforeAfterSpotlight")}</h3>
            <Link href="/before-after" className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10">
              {t("viewFullGallery")}
            </Link>
          </div>
          <BeforeAfterCard
            beforeLabel={t("currentSituation")}
            afterLabel={t("expectedResolution")}
            beforeImage={ISSUE_VISUALS.garbage.before}
            afterImage={ISSUE_VISUALS.garbage.after}
          />
          <p className="text-xs italic text-slate-400">{t("quote2")}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white">{t("nearbySnapshot")}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {NEARBY_ISSUES.map((issue, idx) => {
              const demoKeys = ["nearbyPothole", "nearbyStreetlight", "nearbyGarbage"];
              const locKeys = ["mgRoad", "parkAvenue", "greenColony"];
              const statusKeys: Record<string, string> = {
                "Submitted": "statusSubmitted",
                "In Progress": "statusInProgress",
                "Resolved": "statusResolved"
              };

              return (
                <div key={issue.id} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-sm font-semibold text-white">
                    <span className="mr-2">{ISSUE_ICONS[issue.issue_type] ?? "!"}</span>
                    {t(demoKeys[idx])}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">{t(locKeys[idx])}</p>
                  <p className="mt-2 text-xs text-slate-400">{t(statusKeys[issue.status])}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
