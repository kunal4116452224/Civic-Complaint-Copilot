"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

export default function LoginPage() {
    const auth = useAuth();
    const { t } = useLang();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("user");

    useEffect(() => {
        if (auth.ready && auth.isLoggedIn) {
            router.replace("/");
        }
    }, [auth.ready, auth.isLoggedIn, router]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        auth.login(name, email, role);
        router.push("/");
    };

    if (auth.ready && auth.isLoggedIn) return null;

    return (
        <div className="flex min-h-screen items-center justify-center px-4 pt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10">
                            <span className="text-2xl">🏛️</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white">{t("welcomeBack")}</h1>
                        <p className="mt-2 text-sm text-slate-400">{t("signInSubtitle")}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="login-name"
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                            >
                                {t("yourName")} <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="login-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t("namePlaceholder")}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="login-email"
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                            >
                                {t("email")} <span className="text-slate-600">{t("optional")}</span>
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("emailPlaceholder")}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                            />
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {t("selectRole")}
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRole("user")}
                                    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${role === "user"
                                            ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-200"
                                            : "border-white/10 bg-slate-950/70 text-slate-400 hover:bg-slate-800/70"
                                        }`}
                                >
                                    👤 {t("roleUser")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("admin")}
                                    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${role === "admin"
                                            ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-200"
                                            : "border-white/10 bg-slate-950/70 text-slate-400 hover:bg-slate-800/70"
                                        }`}
                                >
                                    🛡️ {t("roleAdmin")}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-cyan-400 hover:to-emerald-400 hover:shadow-cyan-500/25 active:scale-[0.98]"
                        >
                            {t("loginButton")}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-500">{t("noAccountNeeded")}</p>
                </div>
            </motion.div>
        </div>
    );
}
