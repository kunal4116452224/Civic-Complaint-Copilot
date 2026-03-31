// ── Complaint ID generator ────────────────────────────────────────────────
// Format: CCC-{timestamp_base36}-{random3}
// Example: CCC-LK4F2-X9A

export function genId(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Array.from({ length: 3 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
      Math.floor(Math.random() * 36)
    )
  ).join("");
  return `CCC-${ts}-${rand}`;
}
