"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepperFlow } from "@/components/StepperFlow";
import { UploadSection } from "@/components/UploadSection";
import { ToastStack, type ToastMessage } from "@/components/ToastStack";
import { AUTHORITY_MAP } from "@/config/authorities";
import { ANALYSIS_PHASES, FLOW_STEPS, NEARBY_ISSUES } from "@/data/constants";
import { useComplaints } from "@/hooks/useComplaints";
import { useGeolocation } from "@/hooks/useGeolocation";
import { generatePDF } from "@/lib/pdf";
import type { Complaint, FormState } from "@/lib/types";

const ResultSection = dynamic(
  () => import("@/components/ResultSection").then((module) => module.ResultSection),
  { loading: () => <div className="skeleton h-96 w-full rounded-2xl" /> }
);

const TrackingSection = dynamic(
  () => import("@/components/TrackingSection").then((module) => module.TrackingSection),
  { loading: () => <div className="skeleton h-72 w-full rounded-2xl" /> }
);

interface GenerateResponse {
  id: string;
  issue_type: string;
  severity: string;
  issue_summary: string;
  title: string;
  description: string;
  authority: string;
  timestamp: string;
  confidence?: number;
  reasoning?: string;
  fallback?: boolean;
}

interface FlowState {
  step: number;
  form: FormState;
  result: Complaint | null;
  titleDraft: string;
  descriptionDraft: string;
  isAnalyzing: boolean;
  analysisPhase: number;
  isDragging: boolean;
  error: string | null;
  showPdfPreview: boolean;
  highlightedComplaintId: string | null;
}

type FlowAction =
  | { type: "SET_FORM_FIELD"; payload: { field: "text" | "location" | "landmark"; value: string } }
  | { type: "SET_IMAGE"; payload: { imageB64: string; imageMime: string; imgSrc: string } }
  | { type: "CLEAR_IMAGE" }
  | { type: "SET_DRAGGING"; payload: boolean }
  | { type: "SET_STEP"; payload: number }
  | { type: "START_ANALYSIS" }
  | { type: "SET_ANALYSIS_PHASE"; payload: number }
  | { type: "ANALYSIS_SUCCESS"; payload: Complaint }
  | { type: "ANALYSIS_ERROR"; payload: string }
  | { type: "UPDATE_DRAFT"; payload: { title?: string; description?: string } }
  | { type: "SET_RESULT"; payload: Complaint }
  | { type: "OPEN_PDF_PREVIEW" }
  | { type: "CLOSE_PDF_PREVIEW" }
  | { type: "SET_HIGHLIGHT"; payload: string | null }
  | { type: "CLEAR_ERROR" };

const initialForm: FormState = {
  text: "",
  location: "",
  landmark: "",
  imageB64: null,
  imageMime: null,
  imgSrc: null,
};

const initialState: FlowState = {
  step: 0,
  form: initialForm,
  result: null,
  titleDraft: "",
  descriptionDraft: "",
  isAnalyzing: false,
  analysisPhase: 0,
  isDragging: false,
  error: null,
  showPdfPreview: false,
  highlightedComplaintId: null,
};

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "SET_FORM_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.payload.field]: action.payload.value },
      };
    case "SET_IMAGE":
      return {
        ...state,
        form: {
          ...state.form,
          imageB64: action.payload.imageB64,
          imageMime: action.payload.imageMime,
          imgSrc: action.payload.imgSrc,
        },
      };
    case "CLEAR_IMAGE":
      return {
        ...state,
        form: { ...state.form, imageB64: null, imageMime: null, imgSrc: null },
      };
    case "SET_DRAGGING":
      return { ...state, isDragging: action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "START_ANALYSIS":
      return {
        ...state,
        step: 1,
        isAnalyzing: true,
        analysisPhase: 0,
        error: null,
      };
    case "SET_ANALYSIS_PHASE":
      return { ...state, analysisPhase: action.payload };
    case "ANALYSIS_SUCCESS":
      return {
        ...state,
        result: action.payload,
        titleDraft: action.payload.title,
        descriptionDraft: action.payload.description,
        isAnalyzing: false,
        step: 2,
        analysisPhase: ANALYSIS_PHASES.length - 1,
        error: null,
      };
    case "ANALYSIS_ERROR":
      return {
        ...state,
        step: 1,
        isAnalyzing: false,
        error: action.payload,
      };
    case "UPDATE_DRAFT":
      return {
        ...state,
        titleDraft: action.payload.title ?? state.titleDraft,
        descriptionDraft: action.payload.description ?? state.descriptionDraft,
      };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "OPEN_PDF_PREVIEW":
      return { ...state, showPdfPreview: true };
    case "CLOSE_PDF_PREVIEW":
      return { ...state, showPdfPreview: false };
    case "SET_HIGHLIGHT":
      return { ...state, highlightedComplaintId: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

function compressImage(file: File, maxWidth = 1280): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxWidth / image.width);
      const canvas = document.createElement("canvas");
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.84);
      URL.revokeObjectURL(image.src);
      resolve({ base64: dataUrl.split(",")[1], mime: "image/jpeg" });
    };
    image.onerror = () => reject(new Error("Image processing failed"));
    image.src = URL.createObjectURL(file);
  });
}

export function ReportFlow() {
  const [state, dispatch] = useReducer(flowReducer, initialState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const flowRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const imageUrlRef = useRef<string | null>(null);

  const { complaints, save, updateStatus, remove } = useComplaints();
  const geo = useGeolocation();

  const addToast = useCallback((message: string, type: ToastMessage["type"] = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    if (geo.address) {
      dispatch({ type: "SET_FORM_FIELD", payload: { field: "location", value: geo.address } });
    }
    if (geo.error) {
      addToast(geo.error, "error");
    }
  }, [geo.address, geo.error, addToast]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const canAnalyze = useMemo(() => {
    return Boolean((state.form.text.trim() || state.form.imageB64) && state.form.location.trim());
  }, [state.form.text, state.form.imageB64, state.form.location]);

  const unlockedStep = useMemo(() => {
    let max = 0;
    if (state.isAnalyzing || state.error || state.result) max = 1;
    if (state.result) max = 2;
    if (state.step === 3 || state.highlightedComplaintId) max = 3;
    return max;
  }, [state.isAnalyzing, state.error, state.result, state.step, state.highlightedComplaintId]);

  const finalComplaint = useMemo(() => {
    if (!state.result) return null;
    return {
      ...state.result,
      title: state.titleDraft.trim() || state.result.title,
      description: state.descriptionDraft.trim() || state.result.description,
    };
  }, [state.result, state.titleDraft, state.descriptionDraft]);

  const handleImageFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        addToast("Please upload a valid image file.", "error");
        return;
      }
      try {
        const { base64, mime } = await compressImage(file);
        const src = URL.createObjectURL(file);
        if (imageUrlRef.current) {
          URL.revokeObjectURL(imageUrlRef.current);
        }
        imageUrlRef.current = src;
        dispatch({ type: "SET_IMAGE", payload: { imageB64: base64, imageMime: mime, imgSrc: src } });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Image processing failed";
        addToast(message, "error");
      }
    },
    [addToast]
  );

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) {
      addToast("Please add issue details and location before analysis.", "error");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "START_ANALYSIS" });
    let phase = 0;
    const phaseTimer = window.setInterval(() => {
      phase = (phase + 1) % ANALYSIS_PHASES.length;
      dispatch({
        type: "SET_ANALYSIS_PHASE",
        payload: phase,
      });
    }, 1100);

    try {
      const descriptionInput =
        state.form.text.trim() ||
        `Photo-based civic issue reported at ${state.form.location}${state.form.landmark ? ` near ${state.form.landmark}` : ""}.`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          input: descriptionInput,
          location: state.form.location,
          landmark: state.form.landmark,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unable to generate complaint draft." }));
        throw new Error(errorData.error ?? `Generation failed (${response.status})`);
      }

      const data: GenerateResponse = await response.json();
      const complaint: Complaint = {
        id: data.id,
        issue_type: data.issue_type || "other",
        severity: data.severity || "medium",
        issue_summary: data.issue_summary || "Civic issue reported by citizen.",
        title: data.title,
        description: data.description,
        department: data.authority || "Municipal Corporation",
        location: state.form.location,
        landmark: state.form.landmark || "",
        timestamp: data.timestamp || new Date().toISOString(),
        status: "Submitted",
        confidence: data.confidence,
        reasoning: data.reasoning,
        imageSrc: state.form.imgSrc,
      };

      dispatch({ type: "ANALYSIS_SUCCESS", payload: complaint });
      if (data.fallback) {
        addToast("AI service unavailable. Loaded a fallback complaint draft.", "info");
      } else {
        addToast("AI analysis complete. Review your complaint draft.", "success");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        addToast("Analysis cancelled.", "info");
        return;
      }
      const message = error instanceof Error ? error.message : "Analysis failed";
      dispatch({ type: "ANALYSIS_ERROR", payload: message });
      addToast(message, "error");
    } finally {
      window.clearInterval(phaseTimer);
      abortRef.current = null;
    }
  }, [
    canAnalyze,
    addToast,
    state.form.imgSrc,
    state.form.landmark,
    state.form.location,
    state.form.text,
  ]);

  const handleSubmitAndTrack = useCallback(() => {
    if (!finalComplaint) return;
    const exists = complaints.some((complaint) => complaint.id === finalComplaint.id);
    if (!exists) {
      save(finalComplaint);
    }
    dispatch({ type: "SET_RESULT", payload: finalComplaint });
    dispatch({ type: "SET_HIGHLIGHT", payload: finalComplaint.id });
    dispatch({ type: "SET_STEP", payload: 3 });
    addToast("Complaint saved and tracking started.", "success");
  }, [addToast, complaints, finalComplaint, save]);

  const handleDownloadPdf = useCallback(
    async (complaint: Complaint) => {
      try {
        await generatePDF(complaint);
        addToast("Official complaint PDF downloaded.", "success");
      } catch {
        addToast("Failed to generate PDF.", "error");
      }
    },
    [addToast]
  );

  const handleRemoveImage = useCallback(() => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
    dispatch({ type: "CLEAR_IMAGE" });
  }, []);

  const handleNext = useCallback(() => {
    if (state.step === 0) {
      void handleAnalyze();
      return;
    }
    if (state.step === 2) {
      handleSubmitAndTrack();
    }
  }, [state.step, handleAnalyze, handleSubmitAndTrack]);

  const handleBack = useCallback(() => {
    if (state.step === 1) {
      abortRef.current?.abort();
      dispatch({ type: "CLEAR_ERROR" });
      dispatch({ type: "SET_STEP", payload: 0 });
      return;
    }
    if (state.step === 2) {
      dispatch({ type: "SET_STEP", payload: 0 });
      return;
    }
    if (state.step === 3) {
      dispatch({ type: "SET_STEP", payload: 2 });
    }
  }, [state.step]);

  const nextLabel = state.step === 0 ? "Analyze Issue" : "Submit & Track";
  const canGoNext = state.step === 0 ? canAnalyze : state.step === 2;
  const canGoBack = state.step > 0;

  const authorityReason = finalComplaint
    ? `${AUTHORITY_MAP[finalComplaint.issue_type] ?? finalComplaint.department} handles ${finalComplaint.issue_type.replace(/_/g, " ")} reports in this zone.`
    : "";

  return (
    <div className="min-h-screen bg-slate-950/70 pb-20 pt-24 text-slate-100">
      <ToastStack toasts={toasts} />
      <section className="mx-auto mb-8 max-w-6xl px-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Complaint Filing</p>
          <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Report a civic issue in 4 guided steps</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Upload proof, let AI prepare the official complaint, and track authority updates without losing your current workflow.
          </p>
          <p className="mt-4 text-xs italic text-slate-400">&quot;Your complaint can change your street.&quot;</p>
        </div>
      </section>

      <main ref={flowRef} className="mx-auto w-full max-w-6xl px-6 py-20">
        <StepperFlow
          steps={FLOW_STEPS}
          activeStep={state.step}
          unlockedStep={unlockedStep}
          onStepClick={(index) => {
            if (index === 1 && !state.isAnalyzing && !state.error) return;
            if (index === 3 && !state.highlightedComplaintId) return;
            dispatch({ type: "SET_STEP", payload: index });
          }}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={nextLabel}
          hideActions={state.step === 1 || state.step === 3}
        />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {state.step === 0 && (
              <motion.div key="upload" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <UploadSection
                  form={state.form}
                  isDragging={state.isDragging}
                  isAnalyzing={state.isAnalyzing}
                  locationLoading={geo.loading}
                  inputRef={fileInputRef}
                  onFormChange={(field, value) => dispatch({ type: "SET_FORM_FIELD", payload: { field, value } })}
                  onDragOver={(event: DragEvent<HTMLDivElement>) => {
                    event.preventDefault();
                    dispatch({ type: "SET_DRAGGING", payload: true });
                  }}
                  onDragLeave={() => dispatch({ type: "SET_DRAGGING", payload: false })}
                  onDrop={(event: DragEvent<HTMLDivElement>) => {
                    event.preventDefault();
                    dispatch({ type: "SET_DRAGGING", payload: false });
                    const file = event.dataTransfer.files?.[0];
                    if (file) {
                      void handleImageFile(file);
                    }
                  }}
                  onFileChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleImageFile(file);
                    }
                    event.target.value = "";
                  }}
                  onRemoveImage={handleRemoveImage}
                  onReplaceImage={() => fileInputRef.current?.click()}
                  onDetectLocation={geo.detect}
                />
              </motion.div>
            )}

            {state.step === 1 && (
              <motion.section
                key="analysis"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-xl"
              >
                {state.error ? (
                  <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-bold text-white">Analysis failed</h2>
                    <p className="text-sm text-red-200">{state.error}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: "CLEAR_ERROR" });
                          void handleAnalyze();
                        }}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                      >
                        Retry analysis
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: "CLEAR_ERROR" });
                          dispatch({ type: "SET_STEP", payload: 0 });
                        }}
                        className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Back to edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                    <div>
                      <h2 className="text-2xl font-bold text-white">AI is preparing your complaint</h2>
                      <p className="mt-2 text-slate-300">{ANALYSIS_PHASES[state.analysisPhase]}</p>
                      <div className="mt-4 space-y-2">
                        {ANALYSIS_PHASES.map((phase, index) => (
                          <div key={phase} className="flex items-center gap-2 text-sm">
                            <span
                              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                                index <= state.analysisPhase
                                  ? "bg-emerald-400 text-emerald-950"
                                  : "bg-slate-700 text-slate-200"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className={index <= state.analysisPhase ? "text-slate-100" : "text-slate-400"}>{phase}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <div className="skeleton h-4 w-1/2" />
                      <div className="mt-3 space-y-3">
                        <div className="skeleton h-24 w-full" />
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-4/5" />
                        <div className="skeleton h-4 w-2/3" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.section>
            )}

            {state.step === 2 && finalComplaint && (
              <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <ResultSection
                  result={finalComplaint}
                  rawText={state.form.text}
                  rawLocation={state.form.location}
                  titleDraft={state.titleDraft}
                  descriptionDraft={state.descriptionDraft}
                  authorityReason={authorityReason}
                  nearbyIssues={NEARBY_ISSUES}
                  onTitleChange={(value) => dispatch({ type: "UPDATE_DRAFT", payload: { title: value } })}
                  onDescriptionChange={(value) => dispatch({ type: "UPDATE_DRAFT", payload: { description: value } })}
                  onOpenPdfPreview={() => dispatch({ type: "OPEN_PDF_PREVIEW" })}
                  onSubmitAndTrack={handleSubmitAndTrack}
                />
              </motion.div>
            )}

            {state.step === 3 && (
              <motion.div key="tracking" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <TrackingSection
                  complaints={complaints}
                  highlightedId={state.highlightedComplaintId}
                  onStatusChange={(id, status) => {
                    updateStatus(id, status);
                    addToast(`Status updated to ${status}.`, "success");
                  }}
                  onDelete={(id) => {
                    remove(id);
                    addToast("Complaint removed from tracker.", "info");
                  }}
                  onDownloadPdf={(complaint) => {
                    void handleDownloadPdf(complaint);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {state.showPdfPreview && finalComplaint && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Official Complaint PDF Preview</h3>
            <p className="mt-1 text-sm text-slate-300">Review the content before downloading.</p>

            <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Complaint ID</p>
              <p className="text-sm font-semibold text-white">{finalComplaint.id}</p>
              <p className="text-xs uppercase tracking-wide text-slate-400">Subject</p>
              <p className="text-sm font-semibold text-white">{finalComplaint.title}</p>
              <p className="text-xs uppercase tracking-wide text-slate-400">Body</p>
              <p className="h-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                {finalComplaint.description}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-400">Department</p>
              <p className="text-sm text-slate-200">{AUTHORITY_MAP[finalComplaint.issue_type] ?? finalComplaint.department}</p>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: "CLOSE_PDF_PREVIEW" })}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleDownloadPdf(finalComplaint);
                  dispatch({ type: "CLOSE_PDF_PREVIEW" });
                }}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-400"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
