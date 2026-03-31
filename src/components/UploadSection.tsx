"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { type ChangeEvent, type DragEvent, type RefObject } from "react";
import type { FormState } from "@/lib/types";

interface UploadSectionProps {
  form: FormState;
  isDragging: boolean;
  isAnalyzing: boolean;
  locationLoading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onFormChange: (field: "text" | "location" | "landmark", value: string) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onReplaceImage: () => void;
  onDetectLocation: () => void;
}

export function UploadSection({
  form,
  isDragging,
  isAnalyzing,
  locationLoading,
  inputRef,
  onFormChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemoveImage,
  onReplaceImage,
  onDetectLocation,
}: UploadSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Upload Evidence</h2>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Browse files
          </button>
        </div>

        <motion.div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          animate={
            isDragging
              ? { borderColor: "rgba(52, 211, 153, 0.9)", boxShadow: "0 0 0 3px rgba(52, 211, 153, 0.2)" }
              : { borderColor: "rgba(148, 163, 184, 0.3)", boxShadow: "0 0 0 0 rgba(52, 211, 153, 0)" }
          }
          className="relative flex min-h-56 items-center justify-center rounded-2xl border-2 border-dashed bg-slate-950/50 p-4"
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

          {form.imgSrc ? (
            <div className="relative h-56 w-full overflow-hidden rounded-xl">
              <Image
                src={form.imgSrc}
                alt="Uploaded civic issue"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={onReplaceImage}
                  className="rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/85"
                >
                  Replace image
                </button>
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="rounded-lg bg-red-500/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-100">Drag and drop a civic issue image</p>
              <p className="mt-1 text-xs text-slate-400">PNG, JPG, WEBP supported</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 rounded-2xl bg-slate-900/70 p-4 backdrop-blur-sm">
              <div className="h-full w-full space-y-3">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-28 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-white">Describe the Issue</h2>

        <label className="mb-1 block text-sm font-semibold text-slate-200">Issue details</label>
        <textarea
          value={form.text}
          onChange={(event) => onFormChange("text", event.target.value)}
          rows={7}
          placeholder="Example: Pothole near bus stop causes accidents during rain."
          className="mb-4 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none transition focus:border-emerald-400/60"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-200">Location</label>
            <input
              value={form.location}
              onChange={(event) => onFormChange("location", event.target.value)}
              placeholder="Street, area, city"
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none transition focus:border-emerald-400/60"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-200">Landmark (optional)</label>
            <input
              value={form.landmark}
              onChange={(event) => onFormChange("landmark", event.target.value)}
              placeholder="Near metro station"
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none transition focus:border-emerald-400/60"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onDetectLocation}
          className="mt-4 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {locationLoading ? "Detecting location..." : "Use current location"}
        </button>
      </div>
    </motion.section>
  );
}
