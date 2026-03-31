import { NextRequest, NextResponse } from "next/server";
import { parseJSON } from "@/lib/parseJSON";

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
const VALID_SEV = ["low", "medium", "high"] as const;

function genId(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Array.from({ length: 3 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36))
  ).join("");
  return `CCC-${ts}-${rand}`;
}

type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

async function callGroq(messages: GroqMessage[], maxTokens = 1024): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errBody}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Groq response did not include message content");
  }

  return content;
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = "analyze", text, location, landmark, imageB64, payload } = body as {
      mode?: "analyze" | "escalate" | "translate";
      text?: string;
      location?: string;
      landmark?: string;
      imageB64?: string;
      payload?: EscalatePayload | { description?: string };
    };

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
    }

    if (mode === "translate") {
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

      const translateResponse = await callGroq([
        {
          role: "system",
          content:
            "You are a formal translator for civic complaints. Translate to Hindi (Devanagari), keep IDs like CCC- and technical locations in English. Return only valid JSON: {\"translated_text\":\"...\"}.",
        },
        { role: "user", content: `Translate this formal complaint to Hindi:\n${translateText}` },
      ]);

      const parsed = parseJSON<{ translated_text?: string }>(translateResponse);
      if (!parsed.translated_text || typeof parsed.translated_text !== "string") {
        throw new Error("Invalid translation response JSON");
      }

      return NextResponse.json({ translated_text: parsed.translated_text });
    }

    if (mode === "escalate") {
      if (!isEscalatePayload(payload)) {
        return NextResponse.json({ error: "Invalid escalation payload" }, { status: 400 });
      }

      const original = payload;
      const escalateResponse = await callGroq([
        {
          role: "system",
          content:
            "You are an expert in civic advocacy. Write a formal escalation/reminder letter for an unresolved complaint. Return only valid JSON: {\"title\":\"Escalation: [Original Title]\",\"description\":\"Formal 3-paragraph escalation letter. Start with 'This is a formal reminder regarding Complaint ID: [ID]'. Tone firm, urgent, professional. Mention unresolved issue, immediate attention from [Department], and request status update within 48 hours.\"}",
        },
        {
          role: "user",
          content: `Escalate this complaint:\nID: ${original.id}\nDepartment: ${original.department}\nTitle: ${original.title}\nIssue: ${original.issue_summary}\nLocation: ${original.location}`,
        },
      ]);

      const parsed = parseJSON<{ title?: string; description?: string }>(escalateResponse);
      if (!parsed.title || !parsed.description) {
        throw new Error("Invalid escalation response JSON");
      }

      return NextResponse.json({
        ...original,
        title: parsed.title,
        description: parsed.description,
        id: `${original.id}-ESC`,
        status: "In Progress",
      });
    }

    if (!text && !imageB64) {
      return NextResponse.json({ error: "Please provide a description or an image" }, { status: 400 });
    }

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    const classifyResponse = await callGroq([
      {
        role: "system",
        content:
          "You are a civic issue triage officer. Classify the report and return only valid JSON with this exact schema: {\"issue_type\":\"garbage|pothole|sewage|streetlight|road_damage|flooding|noise|illegal_construction|other\",\"severity\":\"low|medium|high\",\"issue_summary\":\"...\",\"confidence\":0.0,\"reasoning\":\"...\"}. Keep reasoning brief.",
      },
      {
        role: "user",
        content: [
          `Issue report: ${text || "(no text provided)"}`,
          `Location: ${location}`,
          landmark ? `Near: ${landmark}` : "",
          imageB64 ? "Image provided: yes (text-only model; classify from available context)." : "Image provided: no",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ]);

    const classification = parseJSON<{
      issue_type?: string;
      severity?: string;
      issue_summary?: string;
      confidence?: number;
      reasoning?: string;
    }>(classifyResponse);

    let issue_type = typeof classification.issue_type === "string" ? classification.issue_type : "other";
    let severity = typeof classification.severity === "string" ? classification.severity : "medium";

    if (!VALID_TYPES.includes(issue_type)) issue_type = "other";
    if (!VALID_SEV.includes(severity as (typeof VALID_SEV)[number])) severity = "medium";

    const issue_summary =
      typeof classification.issue_summary === "string" && classification.issue_summary.trim()
        ? classification.issue_summary.trim()
        : "Civic issue reported at the provided location.";

    const confidence =
      typeof classification.confidence === "number" && Number.isFinite(classification.confidence)
        ? Math.min(1, Math.max(0, classification.confidence))
        : 0.5;

    const reasoning =
      typeof classification.reasoning === "string" && classification.reasoning.trim()
        ? classification.reasoning.trim()
        : "Classified using available report details.";

    const department = AUTHORITY_MAP[issue_type] || "Municipal Corporation";

    const generateResponse = await callGroq([
      {
        role: "system",
        content:
          "You are a formal complaint writer. Return only valid JSON with this exact schema: {\"title\":\"...\",\"description\":\"formal complaint\"}. Keep title concise and description polished, professional, and under 500 characters when possible.",
      },
      {
        role: "user",
        content: [
          `Issue summary: ${issue_summary}`,
          `Issue type: ${issue_type}`,
          `Severity: ${severity}`,
          `Location: ${location}`,
          `Department: ${department}`,
        ].join("\n"),
      },
    ]);

    const complaint = parseJSON<{ title?: string; description?: string }>(generateResponse);

    let title = typeof complaint.title === "string" && complaint.title.trim() ? complaint.title.trim() : "Civic Issue Complaint";
    let description =
      typeof complaint.description === "string" && complaint.description.trim()
        ? complaint.description.trim()
        : "Dear Sir/Madam, I am writing to report a civic issue at the stated location and request prompt resolution.";

    if (title.length > 80) title = `${title.slice(0, 77)}...`;
    if (description.length > 2000) description = `${description.slice(0, 1997)}...`;

    return NextResponse.json({
      id: genId(),
      issue_type,
      severity,
      issue_summary,
      confidence,
      reasoning,
      title,
      description,
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
