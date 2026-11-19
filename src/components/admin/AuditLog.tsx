import { auditLog } from "../../data"
import type { InstitutionTheme } from "../../theme"
import { ScrollText } from "lucide-react"

interface Props { theme: InstitutionTheme }

const actionColors: Record<string, { color: string; bg: string }> = {
  REPORT_SUBMITTED:     { color: "#49719c", bg: "#ebf2f8" },
  REPORT_VIEWED:        { color: "#586174", bg: "#f2f3f5" },
  WELLNESS_CHECK_CLEARED: { color: "#247a52", bg: "#eaf5ef" },
  EXPORT_REQUESTED:     { color: "#a96612", bg: "#fff4dc" },
  EXPORT_APPROVED:      { color: "#247a52", bg: "#eaf5ef" },
  LOGIN:                { color: "#586174", bg: "#f2f3f5" },
  ROLE_UPDATED:         { color: "#65549b", bg: "#f1eef8" },
}

function formatTs(ts: string) {
  return ts.replace("T", " ").replace("Z", "")
}

export default function AuditLog({ theme }: Props) {
  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
          <ScrollText size={18} /> Audit Log
        </h1>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#586174" }}>{auditLog.length} entries · immutable record</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {auditLog.map((entry) => {
          const { color, bg } = actionColors[entry.action] ?? { color: "#586174", bg: "#f2f3f5" }
          return (
            <div key={entry.id} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, padding: "12px 13px" }}>
              {/* Top row: action badge + timestamp */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
                <span style={{ color, background: bg, padding: "3px 8px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 700, fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", flexShrink: 0 }}>
                  {entry.action}
                </span>
                <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.62rem", color: "#7a8392", textAlign: "right", lineHeight: 1.4 }}>
                  {formatTs(entry.timestamp).replace(" ", "\n")}
                </span>
              </div>
              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#182033" }}>{entry.actor}</span>
                  <span style={{ fontSize: "0.68rem", color: "#7a8392" }}>·</span>
                  <span style={{ fontSize: "0.72rem", color: "#586174" }}>{entry.role}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: "#586174" }}>Target:</span>
                  <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.7rem", color: "#586174", fontWeight: 600 }}>{entry.target}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.65rem", color: "#7a8392" }}>{entry.id}</span>
                  <span style={{ fontSize: "0.65rem", color: "#7a8392" }}>·</span>
                  <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.65rem", color: "#7a8392" }}>{entry.ipAddress}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 14, fontSize: "0.68rem", color: "#7a8392", textAlign: "center", lineHeight: 1.55 }}>
        Audit records are immutable and tamper-evident.<br />Retained 7 years per UCSB records policy.
      </div>
    </div>
  )
}
