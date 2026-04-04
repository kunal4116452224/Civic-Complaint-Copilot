// ── Core TypeScript interfaces ────────────────────────────────────────────

export interface Complaint {
  id: string;
  issue_type: string;
  severity: string;
  issue_summary: string;
  title: string;
  description: string;
  location: string;
  landmark?: string;
  department: string;
  status: "Submitted" | "In Progress" | "Resolved";
  timestamp: string;
  confidence?: number;
  reasoning?: string;
  imageSrc?: string | null;
  submittedBy?: string;
}

export interface FormState {
  text: string;
  location: string;
  landmark: string;
  imageB64: string | null;
  imageMime: string | null;
  imgSrc: string | null;
}

export interface ClassificationResult {
  issue_type: string;
  severity: string;
  issue_summary: string;
}

export interface ComplaintGenResult {
  title: string;
  description: string;
}

export interface AnalyzeResponse {
  id: string;
  issue_type: string;
  severity: string;
  issue_summary: string;
  title: string;
  description: string;
  department: string;
  location: string;
  landmark: string;
  timestamp: string;
}

export type Screen = "home" | "report" | "processing" | "result" | "dashboard";
