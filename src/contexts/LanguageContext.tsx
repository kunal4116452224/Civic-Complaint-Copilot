"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import TEXT, { type Lang } from "@/data/translations";

const LANG_KEY = "ccc-lang";

interface LanguageContextValue {
    language: Lang;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Lang>("en");

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LANG_KEY);
            if (stored === "en" || stored === "hi") {
                setLanguage(stored);
            }
        } catch {
            // ignore
        }
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage((prev) => {
            const next: Lang = prev === "en" ? "hi" : "en";
            localStorage.setItem(LANG_KEY, next);
            return next;
        });
    }, []);

    const t = useCallback(
        (key: string): string => {
            return TEXT[language][key] ?? TEXT.en[key] ?? key;
        },
        [language]
    );

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLang must be used within LanguageProvider");
    return ctx;
}
