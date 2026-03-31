import { NextRequest, NextResponse } from "next/server";

// ── Authority mapping — deterministic, never from AI ──────────────────────
const AUTHORITY_MAP: Record<string, string> = {
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

const VALID_TYPES = Object.keys(AUTHORITY_MAP);
const VALID_SEV = ["low", "medium", "high"];

// ── ID generator ──────────────────────────────────────────────────────────
function genId(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Array.from({ length: 3 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36))
  ).join("");
  return `CCC-${ts}-${rand}`;
}

// ── Call Anthropic Claude ─────────────────────────────────────────────────
async function callClaude(
  messages: Array<{ role: string; content: unknown }>,
  systemPrompt: string
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  // Extract text from content blocks
  const textBlock = data.content?.find(
    (b: { type: string }) => b.type === "text"
  );
  return textBlock?.text || "";
}

// ── Robust JSON parser ────────────────────────────────────────────────────
function parseJSON<T>(text: string): T {
  const cleaned = text.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in AI response");
    return JSON.parse(match[0]);
  }
}

type EscalatePayload = {
  id: string;
  department: string;
  title: string;
  issue_summary: string;
  location: string;
  [key: string]: unknown;
};

function isEscalatePayload(payload: unknown): payload is EscalatePayload {
  if (!payload || typeof payload !== "object") return false;
  const value = payload as Record<string, unknown>;
  return (
    typeof value.id === "string" &&
    typeof value.department === "string" &&
    typeof value.title === "string" &&
    typeof value.issue_summary === "string" &&
    typeof value.location === "string"
  );
}

// ── POST /api/analyze ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = "analyze", text, location, landmark, imageB64, imageMime, payload } = body as {
      mode?: "analyze" | "escalate" | "translate";
      text?: string;
      location?: string;
      landmark?: string;
      imageB64?: string;
      imageMime?: string;
      payload?: EscalatePayload | { description?: string };
    };

    // ── MODE: TRANSLATE ─────────────────────────────────────────────────
    if (mode === "translate") {
      const translateSystem = `You are a formal translator for civic complaints. 
Translate the provided text to Hindi (Devanagari script) while maintaining a highly formal tone.
Keep any Complaint IDs (starting with CCC-) and specific locations in English if they are technical (e.g., MG Road, Sector 14).
Return ONLY valid JSON: { "translated_text": "..." }`;
      const translateText =
        payload &&
        typeof payload === "object" &&
        "description" in payload &&
        typeof payload.description === "string"
          ? payload.description
          : "";

      if (!translateText.trim()) {
        return NextResponse.json({ error: "Description is required for translation" }, { status: 400 });
      }
      
      const translateResponse = await callClaude(
        [{ role: "user", content: `Translate this formal complaint to Hindi: ${translateText}` }],
        translateSystem
      );
      
      const result = parseJSON<{ translated_text: string }>(translateResponse);
      return NextResponse.json(result);
    }

    // ── MODE: ESCALATE ─────────────────────────────────────────────────
    if (mode === "escalate") {
      const escalateSystem = `You are an expert in civic advocacy. Write a formal escalation/reminder letter for an unresolved complaint.
Return ONLY valid JSON:
{
  "title": "Escalation: [Original Title]",
  "description": "Formal 3-paragraph escalation letter. Start with 'This is a formal reminder regarding Complaint ID: [ID]'. Tone should be firm, urgent, and professional. Mention that the issue is still unresolved and needs immediate attention from [Department]. Target 500 characters."
}
Rules:
- Be polite but very firm
- Mention the specific department and ID
- End with a request for a status update within 48 hours`;

      if (!isEscalatePayload(payload)) {
        return NextResponse.json({ error: "Invalid escalation payload" }, { status: 400 });
      }

      const original = payload;
      const escalateResponse = await callClaude(
        [{ role: "user", content: `Escalate this complaint:
ID: ${original.id}
Department: ${original.department}
Title: ${original.title}
Issue: ${original.issue_summary}
Location: ${original.location}` }],
        escalateSystem
      );

      const result = parseJSON<{ title: string; description: string }>(escalateResponse);
      return NextResponse.json({ ...original, ...result, id: original.id + "-ESC", status: "In Progress" });
    }

    // ── MODE: ANALYZE (Original Logic + Confidence) ──────────────────────
    if (!text && !imageB64) {
      return NextResponse.json(
        { error: "Please provide a description or an image" },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    // ── STEP 1: Classify (Updated with Confidence) ──────────────────────
    const classifySystem = `You are a civic issue triage officer. Analyze the report and classify it.
Return ONLY valid JSON:
{
  "issue_type": "garbage, pothole, sewage, streetlight, road_damage, flooding, noise, illegal_construction, other",
  "severity": "low, medium, high",
  "issue_summary": "1-2 sentence summary",
  "confidence": 0.0 to 1.0,
  "reasoning": "Briefly state why (e.g., 'Detected wastewater and odor keywords')"
}
Rules:
- If only an image is provided, describe it first in issue_summary
- High severity = safety risk`;

    const classifyContent: unknown[] = [];
    if (imageB64 && imageMime) {
      classifyContent.push({
        type: "image",
        source: { type: "base64", media_type: imageMime, data: imageB64 },
      });
    }
    classifyContent.push({
      type: "text",
      text: text
        ? `Issue report: ${text}\nLocation: ${location}${landmark ? `\nNear: ${landmark}` : ""}`
        : `Analyze this image of a civic issue at: ${location}`,
    });

    const classifyResponse = await callClaude(
      [{ role: "user", content: classifyContent }],
      classifySystem
    );

    const classification = parseJSON<{
      issue_type: string;
      severity: string;
      issue_summary: string;
      confidence: number;
      reasoning: string;
    }>(classifyResponse);

    // Sanitize
    if (!VALID_TYPES.includes(classification.issue_type)) classification.issue_type = "other";
    if (!VALID_SEV.includes(classification.severity)) classification.severity = "medium";

    // ── STEP 2: Generate Formal Complaint ───────────────────────────────
    const department = AUTHORITY_MAP[classification.issue_type] || "Municipal Corporation";

    const generateSystem = `You are a formal complaint writer. Return ONLY valid JSON:
{
  "title": "Concise title",
  "description": "Formal body (Dear Sir/Madam...). Polished, professional tone. Max 500 chars."
}`;

    const generateResponse = await callClaude(
      [
        {
          role: "user",
          content: `Generate formal complaint for: ${classification.issue_summary}\nType: ${classification.issue_type}\nLocation: ${location}\nDepartment: ${department}`,
        },
      ],
      generateSystem
    );

    const complaint = parseJSON<{ title: string; description: string }>(generateResponse);

    // Enforce limits
    if (complaint.title.length > 80) complaint.title = complaint.title.slice(0, 77) + "...";
    if (complaint.description.length > 2000) complaint.description = complaint.description.slice(0, 1997) + "...";

    return NextResponse.json({
      id: genId(),
      ...classification,
      ...complaint,
      department,
      location: location || "",
      landmark: landmark || "",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Analysis failed" }, { status: 500 });
  }
}
