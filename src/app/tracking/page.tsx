"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { ToastStack, type ToastMessage } from "@/components/ToastStack";
import { TrackingSection } from "@/components/TrackingSection";
import { CIVIC_QUOTES } from "@/data/constants";
import { useComplaints } from "@/hooks/useComplaints";
import { generatePDF } from "@/lib/pdf";
import type { Complaint } from "@/lib/types";

export default function TrackingPage() {
  const { complaints, updateStatus, remove } = useComplaints();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage["type"] = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const handlePdf = async (complaint: Complaint) => {
    try {
      await generatePDF(complaint);
      addToast("PDF downloaded.", "success");
    } catch {
      addToast("Failed to generate PDF.", "error");
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <ToastStack toasts={toasts} />

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/assets/road-pothole.jpg"
            alt="Road issue background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="relative p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Tracking</p>
            <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Follow every complaint stage</h1>
            <p className="mt-3 text-sm italic text-slate-200">{CIVIC_QUOTES[0]}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <TrackingSection
          complaints={complaints}
          highlightedId={null}
          onStatusChange={(id, status) => {
            updateStatus(id, status);
            addToast(`Status updated to ${status}.`, "success");
          }}
          onDelete={(id) => {
            remove(id);
            addToast("Complaint removed.", "info");
          }}
          onDownloadPdf={(complaint) => {
            void handlePdf(complaint);
          }}
        />
      </main>
    </div>
  );
}
