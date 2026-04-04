"use client";

import { useState, FormEvent, useCallback } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

export default function ContactPage() {
    const { t } = useLang();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (!name.trim() || !message.trim()) return;
            setSent(true);
            setName("");
            setEmail("");
            setMessage("");
            setTimeout(() => setSent(false), 4000);
        },
        [name, message]
    );

    return (
        <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg"
            >
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10">
                            <span className="text-2xl">✉️</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white">{t("contactUs")}</h1>
                        <p className="mt-2 text-sm text-slate-400">{t("contactSubtitle")}</p>
                    </div>

                    {/* Toast */}
                    {sent && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-center text-sm font-semibold text-emerald-300"
                        >
                            ✅ {t("messageSent")}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="contact-name"
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                            >
                                {t("yourName")} <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="contact-name"
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
                                htmlFor="contact-email"
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                            >
                                {t("email")} <span className="text-slate-600">{t("optional")}</span>
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("emailPlaceholder")}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contact-message"
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
                            >
                                {t("yourMessage")} <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="contact-message"
                                required
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t("messagePlaceholder")}
                                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-emerald-400 hover:to-cyan-400 hover:shadow-emerald-500/25 active:scale-[0.98]"
                        >
                            {t("sendMessage")}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
