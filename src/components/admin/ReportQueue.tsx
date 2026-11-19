import { useState } from "react"
import { Search, Sparkles, Circle, ChevronRight } from "lucide-react"
import { SeverityBadge } from "../shared/SeverityBadge"
import { StatusBadge } from "../shared/StatusBadge"
import { Modal } from "../shared/Modal"
import { reports } from "../../data"
import type { Report, Severity } from "../../data"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

export default function ReportQueue({ theme }: Props) {
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState<Severity | "All">("All")
  const [selected, setSelected] = useState<Report | null>(null)
  const [readIds, setReadIds] = useState<Set<string>>(new Set(["RPT-2026-0889", "RPT-2026-0885", "RPT-2026-0884"]))

  const sorted = [...reports].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    return order[a.severity] - order[b.severity]
  })

  const filtered = sorted.filter(r => {
    const matchSev = severityFilter === "All" || r.severity === severityFilter
    const q = search.toLowerCase()
    const matchSearch = !search || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.hall.toLowerCase().includes(q) || r.residentDisplay.toLowerCase().includes(q) || r.raName.toLowerCase().includes(q)
    return matchSev && matchSearch
  })

  const unreadCount = filtered.filter(r => !readIds.has(r.id)).length

  function openReport(r: Report) {
    setReadIds(prev => new Set([...prev, r.id]))
    setSelected(r)
  }

  return (
    <div style={{ padding: "20px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
          <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>Report Queue</h1>
          {unreadCount > 0 && (
            <span style={{ background: "#c53d3d", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{unreadCount} unread</span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#586174" }}>{reports.length} reports · sorted by severity</p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#7a8392" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reports..."
          style={{ width: "100%", padding: "9px 10px 9px 30px", border: "1px solid #e1e3e7", borderRadius: 7, fontSize: "0.82rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
        />
      </div>

      {/* Severity filter chips */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
        {(["All", "Critical", "High", "Medium", "Low"] as const).map(s => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            style={{ padding: "5px 11px", borderRadius: 20, border: "1px solid #e1e3e7", background: severityFilter === s ? theme.primaryColor : "#fff", color: severityFilter === s ? "#fff" : "#586174", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Card list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(r => {
          const isUnread = !readIds.has(r.id)
          return (
            <button
              key={r.id}
              onClick={() => openReport(r)}
              style={{ background: "#fff", border: `1px solid ${isUnread ? "#cddfeb" : "#e1e3e7"}`, borderRadius: 9, padding: "12px 13px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 10, alignItems: "flex-start" }}
            >
              {/* Unread dot */}
              <div style={{ paddingTop: 3, flexShrink: 0 }}>
                {isUnread ? <Circle size={7} fill="#49719c" color="#49719c" /> : <span style={{ display: "block", width: 7 }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
                  <SeverityBadge severity={r.severity} size="sm" />
                  <StatusBadge status={r.status} />
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: isUnread ? 700 : 600, color: "#182033", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.category}</div>
                <div style={{ fontSize: "0.75rem", color: "#586174", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.hall}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.65rem", color: "#7a8392" }}>{r.id}</span>
                  <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.65rem", color: "#7a8392" }}>{r.residentId}</span>
                  <span style={{ fontSize: "0.65rem", color: "#7a8392", marginLeft: "auto" }}>{r.date}</span>
                </div>
              </div>
              <ChevronRight size={14} color="#cdd1d8" style={{ flexShrink: 0, marginTop: 2 }} />
            </button>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#7a8392", fontSize: "0.84rem" }}>No reports match your filters.</div>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.id ?? ""}>
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* AI Summary */}
            <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: 8, padding: 13 }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center", color: "#49719c", fontSize: "0.68rem", fontWeight: 700, marginBottom: 7 }}>
                <Sparkles size={11} /> AI Summary
              </div>
              <p style={{ margin: 0, fontSize: "0.81rem", lineHeight: 1.75, color: "#182033" }}>{selected.aiSummary}</p>
            </div>

            {/* Meta */}
            <div style={{ background: "#fff", border: "1px solid #f2f3f5", borderRadius: 8, overflow: "hidden" }}>
              {[
                { label: "Hall & Location", value: `${selected.hall} · ${selected.location}` },
                { label: "Category", value: selected.category },
                { label: "Date & Time", value: `${selected.date} · ${selected.time}` },
                { label: "Resident", value: selected.residentDisplay, mono: true },
                { label: "Reported by", value: `${selected.raName} (${selected.raId})` },
                { label: "AI suggestion", value: selected.aiSeveritySuggestion, isSev: true },
                { label: "Confirmed", value: selected.confirmedBySeverity, isSev: true },
              ].map(({ label, value, mono, isSev }, i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", borderBottom: i < arr.length - 1 ? "1px solid #f2f3f5" : "none" }}>
                  <span style={{ fontSize: "0.69rem", color: "#586174" }}>{label}</span>
                  <span style={{ fontSize: "0.76rem", fontWeight: 500, fontFamily: mono ? "Menlo, Monaco, Consolas, 'Liberation Mono', monospace" : "inherit" }}>
                    {isSev ? <SeverityBadge severity={value as Severity} size="sm" /> : value}
                  </span>
                </div>
              ))}
            </div>

            {/* Full narrative */}
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#586174", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Narrative</div>
              <p style={{ margin: "0 0 12px", fontSize: "0.83rem", lineHeight: 1.8, color: "#182033" }}>{selected.narrative}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <StatusBadge status={selected.status} />
                {selected.wellnessChecked && <span style={{ fontSize: "0.69rem", color: "#247a52", fontWeight: 600 }}>✓ RA wellness checked</span>}
              </div>
            </div>

            <div style={{ padding: "10px 12px", background: "#f2f3f5", borderRadius: 7, fontSize: "0.68rem", color: "#7a8392", lineHeight: 1.55 }}>
              Access logged to audit trail per FERPA requirements.
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
