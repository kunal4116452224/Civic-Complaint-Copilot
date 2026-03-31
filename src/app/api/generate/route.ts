import { NextResponse } from "next/server";
import { AUTHORITY_MAP, VALID_ISSUE_TYPES, VALID_SEVERITIES } from "@/config/authorities";
import { genId } from "@/lib/id";

type GroqStructured = {
  title?: string;
  description?: string;
  issue_type?: string;
  severity?: string;
  issue_summary?: string;
  authority?: string;
  confidence?: number;
  reasoning?: string;
};

const GROQ_SYSTEM_PROMPT = `
You are a civic complaint generator that produces detailed, official complaints for municipal authorities.

Your job:
Expand the user's short input into a COMPLETE, PROFESSIONAL complaint.

STRICT FORMAT:

Subject: <clear and specific title>

Description:
Write a detailed paragraph explaining:
- What the issue is
- Exact condition (garbage, debris, blockage, etc.)
- Surroundings (roadside, residential area, traffic impact)
- Hygiene problems (foul smell, insects, health risk)
- Safety risks (accidents, obstruction)

Requested Action:
- Immediate removal of all waste and debris
- Cleaning and sanitation of the affected area
- Installation of proper waste disposal facilities (dustbins)
- Regular monitoring to prevent recurrence
- Enforcement against illegal dumping (if applicable)

Impact:
Explain clearly:
- Traffic disruption
- Risk to pedestrians and drivers
- Health hazards due to unhygienic conditions
- Negative effect on public environment

Rules:
- Minimum 120–180 words total
- Formal and official tone
- Always expand input (never short)
- Add realistic civic details even if user input is brief
- Do NOT leave sections empty
- Do NOT shorten explanation
`;
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
] as const;

type GroqMessage = {
  role: "system" | "user";
  content: string;
};

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

async function requestGroq(messages: GroqMessage[], apiKey: string): Promise<string> {
  let lastErrorText = "";

  for (const model of GROQ_MODELS) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return data.choices?.[0]?.message?.content || "";
    }

    lastErrorText = await response.text();
    console.log(`Groq Error (${model}):`, lastErrorText);
  }

  throw new Error(lastErrorText || "Groq API failed");
}

function inferIssueType(input: string): string {
  const text = input.toLowerCase();
  if (text.includes("garbage") || text.includes("waste") || text.includes("dump")) return "garbage";
  if (text.includes("pothole")) return "pothole";
  if (text.includes("sewage") || text.includes("drain") || text.includes("wastewater")) return "sewage";
  if (text.includes("streetlight") || text.includes("street light") || text.includes("lamp")) return "streetlight";
  if (text.includes("road damage") || text.includes("broken road")) return "road_damage";
  if (text.includes("flood") || text.includes("waterlogging")) return "flooding";
  if (text.includes("noise") || text.includes("loud")) return "noise";
  if (text.includes("construction")) return "illegal_construction";
  return "other";
}

function inferSeverity(input: string): string {
  const text = input.toLowerCase();
  if (text.includes("accident") || text.includes("danger") || text.includes("injury") || text.includes("urgent")) return "high";
  if (text.includes("blocked") || text.includes("overflow") || text.includes("risk")) return "medium";
  return "low";
}

function normalizeStructuredComplaint(
  raw: string,
  input: string,
  location = "",
  landmark = ""
) {
  const clean = raw.trim();
  const subjectMatch = clean.match(/^\s*Subject:\s*(.+)$/im);
  const descriptionMatch = clean.match(/Description:\s*([\s\S]*?)\n\s*Requested Action:/i);
  const impactMatch = clean.match(/Impact:\s*([\s\S]*)$/i);
  const actionBlockMatch = clean.match(/Requested Action:\s*([\s\S]*?)\n\s*Impact:/i);
  const actionLines = (actionBlockMatch?.[1] || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  const fallbackSubject = `Complaint regarding civic issue${location ? ` at ${location}` : ""}`;
  const fallbackDescription =
    `A civic issue has been observed${location ? ` at ${location}` : ""}${landmark ? ` near ${landmark}` : ""}. ` +
    `${input.trim() || "The condition is causing inconvenience and potential public risk."}`;
  const fallbackActions = [
    "Inspect the location at the earliest.",
    "Deploy the concerned maintenance team for corrective work.",
    "Implement immediate safety and hygiene measures for residents.",
  ];
  const fallbackImpact =
    "This issue affects public safety, hygiene, and daily movement, and requires timely municipal intervention.";

  const subject = subjectMatch?.[1]?.trim() || fallbackSubject;
  const description = descriptionMatch?.[1]?.trim() || fallbackDescription;
  const actions = [...actionLines, ...fallbackActions].slice(0, 3);
  const impact = impactMatch?.[1]?.trim() || fallbackImpact;

  const formatted =
    `Subject: ${subject}\n\n` +
    `Description:\n${description}\n\n` +
    `Requested Action:\n` +
    actions.map((action) => `- ${action}`).join("\n") +
    `\n\nImpact:\n${impact}`;

  return { subject, description: formatted, issue_summary: description, impact };
}

function buildFallback(input: string, location = "", landmark = "", reason?: string) {
  const baseText = input.trim() || `Civic issue reported at ${location || "unspecified location"}.`;
  const issueSummary = baseText.length > 180 ? `${baseText.slice(0, 177)}...` : baseText;

  const title = `Complaint regarding civic issue${location ? ` at ${location}` : ""}`.trim();
  const descriptionText =
    `A civic issue has been observed${location ? ` at ${location}` : ""}${landmark ? ` near ${landmark}` : ""}. ` +
    `${issueSummary}`;
  const requestedActions = [
    "Inspect the affected location at the earliest.",
    "Deploy the concerned maintenance team for corrective action.",
    "Implement immediate temporary safety and sanitation measures.",
  ];
  const impactText =
    "This issue creates public inconvenience and can affect safety, hygiene, and day-to-day movement if not resolved promptly.";
  const structuredComplaint =
    `Subject: ${title}\n\n` +
    `Description:\n${descriptionText}\n\n` +
    `Requested Action:\n${requestedActions.map((action) => `- ${action}`).join("\n")}\n\n` +
    `Impact:\n${impactText}`;

  return {
    id: genId(),
    complaint: structuredComplaint,
    title,
    description: structuredComplaint,
    issue_type: "other",
    severity: "medium",
    issue_summary: issueSummary,
    authority: "Municipal Corporation",
    confidence: 0.72,
    reasoning: reason || "Generated fallback draft because AI service was unavailable.",
    timestamp: new Date().toISOString(),
    fallback: true,
  };
}

function sanitizeStructured(
  parsed: GroqStructured,
  input: string,
  location = "",
  landmark = ""
) {
  const safeType =
    parsed.issue_type && VALID_ISSUE_TYPES.includes(parsed.issue_type)
      ? parsed.issue_type
      : "other";
  const safeSeverity =
    parsed.severity && VALID_SEVERITIES.includes(parsed.severity)
      ? parsed.severity
      : "medium";
  const safeAuthority = parsed.authority || AUTHORITY_MAP[safeType] || "Municipal Corporation";
  const safeDescription =
    parsed.description?.trim() ||
    `Dear Sir/Madam,\n\nPlease address this civic issue reported at ${location || "the mentioned location"}${landmark ? ` near ${landmark}` : ""}.\n\nRegards,\nCitizen`;
  const safeTitle = parsed.title?.trim() || `Complaint regarding ${safeType.replace(/_/g, " ")}`;
  const safeSummary =
    parsed.issue_summary?.trim() ||
    (input.trim().length > 180 ? `${input.trim().slice(0, 177)}...` : input.trim());
  const safeConfidence =
    typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
      ? Math.max(0.1, Math.min(0.99, parsed.confidence))
      : 0.9;

  return {
    id: genId(),
    complaint: safeDescription,
    title: safeTitle,
    description: safeDescription,
    issue_type: safeType,
    severity: safeSeverity,
    issue_summary: safeSummary,
    authority: safeAuthority,
    confidence: safeConfidence,
    reasoning: parsed.reasoning || "Classified and structured through Groq response.",
    timestamp: new Date().toISOString(),
    fallback: false,
  };
}

export async function POST(req: Request) {
  try {
    const { input, location = "", landmark = "" } = (await req.json()) as {
      input?: string;
      location?: string;
      landmark?: string;
    };

    const normalizedInput = (input || "").trim();
    if (!normalizedInput) {
      return NextResponse.json(
        { error: "Input is required for complaint generation." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    const hasPlaceholderKey =
      apiKey === "YOUR_NEW_API_KEY_HERE" || apiKey === "YOUR_KEY_HERE";

    if (!apiKey || hasPlaceholderKey) {
      return NextResponse.json(
        buildFallback(
          normalizedInput,
          location,
          landmark,
          hasPlaceholderKey
            ? "GROQ_API_KEY still uses placeholder value."
            : "Missing GROQ_API_KEY on server."
        ),
        { status: 200 }
      );
    }

    const messages: GroqMessage[] = [
      {
        role: "system",
        content: GROQ_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `User reported issue:
${normalizedInput}

Generate a complete civic complaint with full details and expansion.`,
      },
    ];

    let content = await requestGroq(messages, apiKey);

    if (countWords(content) < 100) {
      const retryMessages: GroqMessage[] = [
        ...messages,
        {
          role: "user",
          content:
            "The previous output was too short. Regenerate in the same strict format with 120-180 words and complete details.",
        },
      ];
      content = await requestGroq(retryMessages, apiKey);
    }

    const normalized = normalizeStructuredComplaint(content, normalizedInput, location, landmark);
    const inferredType = inferIssueType(normalizedInput);
    const inferredSeverity = inferSeverity(normalizedInput);

    const parsed: GroqStructured = {
      title: normalized.subject,
      description: normalized.description,
      issue_type: inferredType,
      severity: inferredSeverity,
      issue_summary: normalized.issue_summary,
      authority: AUTHORITY_MAP[inferredType] || "Municipal Corporation",
      confidence: 0.92,
      reasoning: "Generated using Groq structured civic complaint format.",
    };

    return NextResponse.json(sanitizeStructured(parsed, normalizedInput, location, landmark));
  } catch (error) {
    console.error("Groq API route error:", error);
    return NextResponse.json(
      buildFallback(
        "General civic issue reported by user.",
        "",
        "",
        "Unexpected server error while generating complaint."
      ),
      { status: 200 }
    );
  }
}
