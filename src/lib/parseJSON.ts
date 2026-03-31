// ── Robust JSON extraction from AI responses ──────────────────────────────
// Claude sometimes wraps JSON in markdown fences or prose. This handles all cases.

export function parseJSON<T = Record<string, unknown>>(text: string): T {
  // Strip markdown code fences
  const cleaned = text.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Extract first JSON object if wrapped in prose
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(`No JSON object found in response: ${cleaned.slice(0, 200)}`);
    }
    return JSON.parse(match[0]) as T;
  }
}
