// ── Authority mapping — deterministic, never from AI ──────────────────────
export const AUTHORITY_MAP: Record<string, string> = {
  garbage: "Municipal Corporation",
  pothole: "Public Works Department (PWD)",
  sewage: "Water & Sewer Board",
  streetlight: "Electricity Department",
  road_damage: "Public Works Department (PWD)",
  flooding: "Water & Sewer Board",
  noise: "Municipal Corporation",
  illegal_construction: "Municipal Corporation",
  other: "Municipal Corporation",
};

export const ISSUE_ICONS: Record<string, string> = {
  garbage: "🗑️",
  pothole: "🕳️",
  sewage: "🚰",
  streetlight: "💡",
  road_damage: "🛣️",
  flooding: "🌊",
  noise: "🔊",
  illegal_construction: "🏗️",
  other: "📋",
};

export const SEV_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  low: { color: "text-emerald-400", bg: "bg-emerald-400/20", label: "Low" },
  medium: { color: "text-amber-400", bg: "bg-amber-400/20", label: "Medium" },
  high: { color: "text-red-400", bg: "bg-red-400/20", label: "High" },
};

export const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Submitted: { color: "text-blue-400", bg: "bg-blue-400/20" },
  "In Progress": { color: "text-amber-400", bg: "bg-amber-400/20" },
  Resolved: { color: "text-emerald-400", bg: "bg-emerald-400/20" },
};

export const VALID_ISSUE_TYPES = Object.keys(AUTHORITY_MAP);
export const VALID_SEVERITIES = ["low", "medium", "high"];
export const STATUSES = ["Submitted", "In Progress", "Resolved"] as const;

// Mock nearby issues for dashboard
export const NEARBY_ISSUES = [
  {
    id: "CCC-DEMO-001",
    issue_type: "pothole",
    severity: "high",
    title: "Large pothole near Central Market",
    location: "MG Road, Sector 14",
    status: "In Progress" as const,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "CCC-DEMO-002",
    issue_type: "streetlight",
    severity: "medium",
    title: "Street light not working for 3 days",
    location: "Park Avenue, Block C",
    status: "Submitted" as const,
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "CCC-DEMO-003",
    issue_type: "garbage",
    severity: "low",
    title: "Garbage not collected since Monday",
    location: "Green Colony, Lane 4",
    status: "Resolved" as const,
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];
