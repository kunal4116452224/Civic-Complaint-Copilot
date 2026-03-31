import { NEARBY_ISSUES } from "@/config/authorities";

export const HERO_IMAGES = [
  "/assets/temporary-workers-lift-waste-across-ap-cities.avif",
  "/assets/road-pothole.jpg",
  "/assets/A-non-functioning-street-light-at-southern-bypass-_1690134239324.jpg",
];

export const HERO_STATS = [
  { label: "Complaints resolved", value: "1200+" },
  { label: "Avg resolution time", value: "2.3 days" },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report Issue" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tracking", label: "Track Complaints" },
  { href: "/before-after", label: "Before/After" },
];

export const CIVIC_QUOTES = [
  "Clean city, responsible citizens.",
  "Your complaint can change your street.",
  "Do not ignore - report.",
  "Small civic actions create safer neighborhoods.",
];

export const FLOW_STEPS = [
  {
    title: "Upload Image / Describe Issue",
    description: "Add a clear photo, issue text, and location details.",
  },
  {
    title: "AI Analysis",
    description: "Issue type, severity, and authority are detected automatically.",
  },
  {
    title: "Review Generated Complaint",
    description: "Edit the title and body before final submission.",
  },
  {
    title: "Submit & Track",
    description: "Save and monitor status updates on a timeline.",
  },
];

export const ANALYSIS_PHASES = [
  "Scanning your civic report",
  "Detecting issue category and severity",
  "Mapping responsible authority",
  "Drafting formal complaint language",
];

export const ISSUE_VISUALS: Record<string, { before: string; after: string }> = {
  garbage: {
    before:
      "/assets/deccanherald_import_sites_dh_files_articleimages_2021_11_23_file7ij9p86czts1m9ie0mad-1053848-1637687556.jpg",
    after: "/assets/Add-a-heading-100.avif",
  },
  pothole: {
    before: "/assets/pot.jpg",
    after: "/assets/126326244.avif",
  },
  streetlight: {
    before:
      "/assets/A-non-functioning-street-light-at-southern-bypass-_1690134239324.jpg",
    after: "/assets/367515.png",
  },
  road_damage: {
    before: "/assets/road-pothole.jpg",
    after: "/assets/126326244.avif",
  },
  flooding: {
    before: "/assets/5616.avif",
    after: "/assets/16.jpg",
  },
  sewage: {
    before: "/assets/Image-Source-@-15.jpg",
    after: "/assets/120230660.avif",
  },
  noise: {
    before: "/assets/3079e5c261a81f02d5f02cc83ac7b7b9.jpg",
    after: "/assets/16.jpg",
  },
  illegal_construction: {
    before: "/assets/367515.png",
    after: "/assets/16.jpg",
  },
  other: {
    before: "/assets/3079e5c261a81f02d5f02cc83ac7b7b9.jpg",
    after: "/assets/16.jpg",
  },
};

export const TRACKING_STAGES = [
  { key: "Submitted", label: "Submitted", icon: "S" },
  { key: "In Progress", label: "In Progress", icon: "P" },
  { key: "Resolved", label: "Resolved", icon: "R" },
] as const;

export { NEARBY_ISSUES };
