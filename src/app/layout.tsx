import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { CIVIC_QUOTES } from "@/data/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civic Complaint Copilot",
  description: "AI-powered civic issue reporting with guided filing and timeline-based tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var key = "ccc-theme";
                  var stored = localStorage.getItem(key);
                  var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                  if (theme === "dark") document.documentElement.classList.add("dark");
                  else document.documentElement.classList.remove("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen text-slate-900 antialiased dark:text-slate-100">
        <Navbar />
        {children}
        <footer className="border-t border-white/10 px-6 py-6 text-center text-xs italic text-slate-400">
          {CIVIC_QUOTES[3]}
        </footer>
      </body>
    </html>
  );
}
