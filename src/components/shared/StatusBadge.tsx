import type { ReportStatus } from "../../data"

const config: Record<ReportStatus, { color: string; bg: string }> = {
  New: { color: "#49719c", bg: "#ebf2f8" },
  "Under Review": { color: "#a96612", bg: "#fff4dc" },
  Resolved: { color: "#247a52", bg: "#eaf5ef" },
  Escalated: { color: "#c53d3d", bg: "#fcebea" },
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  const { color, bg } = config[status]
  return (
    <span style={{ color, background: bg, padding: "2px 9px", fontSize: "0.72rem", fontWeight: 600, borderRadius: "4px", whiteSpace: "nowrap" }}>
      {status}
    </span>
  )
}
