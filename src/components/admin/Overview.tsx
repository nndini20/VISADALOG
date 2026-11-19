import { AlertCircle, AlertTriangle, Info, Minus, TrendingUp, Users, CheckCircle } from "lucide-react"
import { SeverityBadge } from "../shared/SeverityBadge"
import { StatusBadge } from "../shared/StatusBadge"
import { reports, wellnessFlags } from "../../data"
import type { InstitutionTheme } from "../../theme"
import type { AdminTab } from "./AdminShell"

interface Props {
  theme: InstitutionTheme
  onTab: (t: AdminTab) => void
}

export default function Overview({ theme, onTab }: Props) {
  const sorted = [...reports].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    return order[a.severity] - order[b.severity]
  })
  const top5 = sorted.slice(0, 5)
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 }
  reports.forEach(r => counts[r.severity]++)

  return (
    <div className="overview-page" style={{ padding: "20px 16px" }}>
      <div className="overview-header" style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>Overview</h1>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#586174" }}>Residential Life Dashboard · UCSB · July 2026</p>
      </div>

      {/* Metric cards */}
      <div className="overview-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Total Reports", value: reports.length, icon: <TrendingUp size={18} />, sub: "last 30 days", color: theme.primaryColor },
          { label: "Critical / High", value: counts.Critical + counts.High, icon: <AlertCircle size={18} />, sub: `${counts.Critical} critical, ${counts.High} high`, color: "#c53d3d" },
          { label: "Wellness Flags", value: wellnessFlags.length, icon: <Users size={18} />, sub: `${wellnessFlags.filter(w => !w.checkedIn).length} pending`, color: "#a96612" },
          { label: "Resolved", value: reports.filter(r => r.status === "Resolved").length, icon: <CheckCircle size={18} />, sub: "this month", color: "#247a52" },
        ].map(({ label, value, icon, sub, color }) => (
          <div className="overview-metric-card" key={label} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "9px", padding: "18px", position: "relative", overflow: "hidden" }}>
            <div style={{ color, marginBottom: "8px" }}>{icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#182033", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#182033", marginTop: "4px" }}>{label}</div>
            <div style={{ fontSize: "0.68rem", color: "#7a8392", marginTop: "2px" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Severity breakdown */}
      <div className="overview-severity-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px" }}>
        {(["Critical", "High", "Medium", "Low"] as const).map(s => {
          const icons = { Critical: <AlertCircle size={14} />, High: <AlertTriangle size={14} />, Medium: <Info size={14} />, Low: <Minus size={14} /> }
          const colors = { Critical: "#7a2638", High: "#c53d3d", Medium: "#a96612", Low: "#586174" }
          const bgs = { Critical: "#f7e9ed", High: "#fcebea", Medium: "#fff4dc", Low: "#f2f3f5" }
          return (
            <div className="overview-severity-card" key={s} style={{ background: bgs[s], border: `1px solid ${colors[s]}22`, borderRadius: "8px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ color: colors[s] }}>{icons[s]}</div>
              <div>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: colors[s], lineHeight: 1 }}>{counts[s]}</div>
                <div style={{ fontSize: "0.72rem", color: colors[s], fontWeight: 500 }}>{s}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Priority queue preview */}
      <div className="overview-queue" style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "10px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f2f3f5" }}>
          <h3 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Priority Report Queue</h3>
          <button onClick={() => onTab("queue")} style={{ background: "none", border: "none", fontSize: "0.75rem", color: theme.primaryColor, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>View all →</button>
        </div>
        <div>
          {top5.map((r, i) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 20px", borderBottom: i < top5.length - 1 ? "1px solid #f2f3f5" : "none" }}>
              <SeverityBadge severity={r.severity} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#182033", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.category} — {r.hall}</div>
                <div style={{ fontSize: "0.68rem", color: "#7a8392", fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace" }}>{r.id} · {r.date}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Wellness flags */}
      {wellnessFlags.some(w => !w.checkedIn) && (
        <div className="overview-wellness" style={{ background: "#fff4dc", border: "1px solid #f0d8a8", borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <AlertTriangle size={16} color="#a96612" />
            <h3 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: "#a96612" }}>Wellness Check Reminders</h3>
          </div>
          {wellnessFlags.filter(w => !w.checkedIn).map(w => (
            <div key={w.residentId} style={{ background: "#fff", border: "1px solid #f0d8a8", borderRadius: "7px", padding: "12px", marginBottom: "8px" }}>
              <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#182033", marginBottom: "2px" }}>{w.residentDisplay} · {w.hall}</div>
              <div style={{ fontSize: "0.72rem", color: "#a96612" }}>{w.flagReason}</div>
            </div>
          ))}
          <button onClick={() => onTab("wellness")} style={{ background: "#a96612", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: "4px" }}>
            Manage Wellness Checks
          </button>
        </div>
      )}
    </div>
  )
}
