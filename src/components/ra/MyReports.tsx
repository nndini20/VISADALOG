import { SeverityBadge } from "../shared/SeverityBadge"
import { StatusBadge } from "../shared/StatusBadge"
import { reports } from "../../data"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

export default function MyReports({ theme }: Props) {
  const myReports = reports.filter(r => r.raId === "RA-014")

  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: "1.15rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>My Reports</h2>
      <p style={{ margin: "0 0 16px", fontSize: "0.75rem", color: "#586174" }}>{myReports.length} reports · Jordan M. · RA-014</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {myReports.map(r => (
          <div key={r.id} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "8px", padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.68rem", color: "#586174" }}>{r.id}</span>
              <SeverityBadge severity={r.severity} size="sm" />
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#182033", marginBottom: "3px" }}>{r.category}</div>
            <div style={{ fontSize: "0.75rem", color: "#586174", marginBottom: "8px" }}>{r.hall} · {r.location} · {r.date}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <StatusBadge status={r.status} />
              {r.wellnessChecked && (
                <span style={{ fontSize: "0.68rem", color: "#247a52", fontWeight: 500 }}>✓ Wellness checked</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
