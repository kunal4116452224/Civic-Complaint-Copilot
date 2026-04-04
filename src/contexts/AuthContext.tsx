"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "ccc-user";

export type UserRole = "admin" | "user";

interface AuthUser {
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextValue {
    isLoggedIn: boolean;
    userName: string;
    userEmail: string;
    userRole: UserRole;
    ready: boolean;
    login: (name: string, email: string, role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [ready, setReady] = useState(false);

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as AuthUser;
                if (parsed.name) {
                    // Backwards compat: default role to "user" if missing
                    if (!parsed.role) parsed.role = "user";
                    setUser(parsed);
                }
            }
        } catch {
            // ignore corrupt storage
        }
        setReady(true);
    }, []);

    const login = (name: string, email: string, role: UserRole) => {
        const data: AuthUser = { name: name.trim(), email: email.trim(), role };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!user,
                userName: user?.name ?? "",
                userEmail: user?.email ?? "",
                userRole: user?.role ?? "user",
                ready,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
