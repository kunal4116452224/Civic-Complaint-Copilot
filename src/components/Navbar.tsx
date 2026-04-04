"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CIVIC_QUOTES, NAV_LINKS } from "@/data/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

const THEME_KEY = "ccc-theme";

// Map nav link labels to translation keys
const NAV_LABEL_KEYS: Record<string, string> = {
  Home: "home",
  "Report Issue": "reportIssue",
  Dashboard: "dashboard",
  "Admin Panel": "adminPanel",
  "Track Complaints": "trackComplaints",
  "Before/After": "beforeAfter",
  Contact: "contact",
};

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

export function Navbar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { language, toggleLanguage, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  const roleBadge = auth.isLoggedIn ? (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${auth.userRole === "admin"
        ? "bg-indigo-500/20 text-indigo-300"
        : "bg-blue-500/20 text-blue-300"
        }`}
    >
      {auth.userRole === "admin" ? t("roleAdmin") : t("roleUser")}
    </span>
  ) : null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${scrolled
        ? "border-slate-200/80 bg-white/85 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85"
        : "border-transparent bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900 dark:text-white">
          Civic Complaint Copilot
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {NAV_LINKS.filter(link => {
            if (auth.userRole === "admin") return false; // Hide all standard links for admin
            return true;
          }).map((link) => {
            const active = pathname === link.href;
            const labelKey = NAV_LABEL_KEYS[link.label] ?? link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${active
                  ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-200"
                  : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
              >
                {t(labelKey)}
              </Link>
            );
          })}

          {auth.userRole === "admin" && (
            <Link
              href="/dashboard"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${pathname === "/dashboard"
                ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-200"
                : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
            >
              {t("adminPanel")}
            </Link>
          )}

          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-2.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-300"
          >
            {language === "en" ? "हिंदी" : "EN"}
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-300 bg-slate-100/70 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
          >
            {theme === "dark" ? t("lightMode") : t("darkMode")}
          </button>

          {/* Auth section */}
          {auth.isLoggedIn ? (
            <>
              <span className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-700 dark:text-cyan-200">
                {t("welcome")}, {auth.userName} {roleBadge}
              </span>
              <button
                type="button"
                onClick={auth.logout}
                className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/20 dark:text-red-300"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-500/20 dark:text-cyan-200"
            >
              {t("login")}
            </Link>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg border border-slate-300 bg-slate-100/80 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10 md:hidden"
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-slate-200 bg-white/95 px-6 pb-4 pt-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.filter(link => {
                if (auth.userRole === "admin") return false;
                return true;
              }).map((link) => {
                const active = pathname === link.href;
                const labelKey = NAV_LABEL_KEYS[link.label] ?? link.label;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${active
                      ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-200"
                      : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                      }`}
                  >
                    {t(labelKey)}
                  </Link>
                );
              })}

              {auth.userRole === "admin" && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${pathname === "/dashboard"
                    ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-200"
                    : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                >
                  {t("adminPanel")}
                </Link>
              )}

              {/* Language toggle */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="mt-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-300"
              >
                {language === "en" ? "हिंदी में बदलें" : "Switch to EN"}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="mt-1 rounded-lg border border-slate-300 bg-slate-100/70 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
              >
                {theme === "dark" ? t("switchToLight") : t("switchToDark")}
              </button>

              {auth.isLoggedIn ? (
                <>
                  <p className="mt-2 flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
                    {t("welcome")}, {auth.userName} {roleBadge}
                  </p>
                  <button
                    type="button"
                    onClick={() => { auth.logout(); setMobileOpen(false); }}
                    className="mt-1 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/20 dark:text-red-300"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-center text-sm font-semibold text-cyan-700 transition hover:bg-cyan-500/20 dark:text-cyan-200"
                >
                  {t("login")}
                </Link>
              )}
            </div>
            <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">{CIVIC_QUOTES[0]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
