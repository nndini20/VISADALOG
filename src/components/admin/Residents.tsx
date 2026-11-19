import { useState } from "react"
import { Search, BookOpen, FileText, ChevronLeft, ChevronRight, GitCompare } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { SeverityBadge } from "../shared/SeverityBadge"
import { residents, reports, ledgerEntries, residentHistoryData } from "../../data"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

const tagColors: Record<string, { color: string; bg: string; border: string }> = {
  Positive: { color: "#247a52", bg: "#eaf5ef", border: "#bddbc9" },
  Neutral:  { color: "#586174", bg: "#f2f3f5", border: "#e1e3e7" },
  Concern:  { color: "#a96612", bg: "#fff4dc", border: "#f0d8a8" },
}

export default function Residents({ theme }: Props) {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [compareId, setCompareId] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [timelineTab, setTimelineTab] = useState<"all" | "incidents" | "ledger">("all")

  const filtered = residents.filter(r =>
    !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.hall.toLowerCase().includes(search.toLowerCase())
  )

  const compareResident = compareMode ? residents.find(r => r.id === compareId) : null

  function getResidentReports(id: string) {
    return reports.filter(r => r.residentId === id)
  }
  function getResidentLedger(hall: string) {
    return ledgerEntries.filter(e => e.hall === hall)
  }

  function getTimeline(id: string, hall: string) {
    const incidentEvents = getResidentReports(id).map(r => ({
      type: "incident" as const, date: r.date, time: r.time, id: r.id,
      severity: r.severity, category: r.category, summary: r.aiSummary,
    }))
    const ledgerEvents = getResidentLedger(hall).map(e => ({
      type: "ledger" as const, date: e.date, time: e.time, id: e.id,
      tag: e.tag, note: e.note, raName: e.raName,
    }))
    const combined =
      timelineTab === "incidents" ? incidentEvents :
      timelineTab === "ledger" ? ledgerEvents :
      [...incidentEvents, ...ledgerEvents]
    return combined.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
  }

  function ResidentDetail({ resId }: { resId: string }) {
    const res = residents.find(r => r.id === resId)
    if (!res) return null
    const historyData = residentHistoryData[resId] ?? []
    const timeline = getTimeline(resId, res.hall)

    return (
      <div>
        {/* Back button */}
        <button
          onClick={() => { setSelectedId(null); setCompareId(null); setCompareMode(false) }}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: theme.primaryColor, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 14, padding: 0 }}
        >
          <ChevronLeft size={16} /> All Residents
        </button>

        {/* Header card */}
        <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "1.05rem", fontWeight: 700, color: theme.primaryColor }}>{res.id}</div>
              <div style={{ fontSize: "0.74rem", color: "#586174", marginTop: 2 }}>{res.hall} · Room {res.room}</div>
            </div>
            {res.wellnessFlag && (
              <span style={{ background: "#fff4dc", color: "#a96612", border: "1px solid #f0d8a8", fontSize: "0.67rem", fontWeight: 700, padding: "3px 8px", borderRadius: 5 }}>Wellness Flag</span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
            {[
              { label: "Incidents", value: res.reportCount.toString() },
              { label: "Last incident", value: res.lastIncident.slice(5) },
              { label: "Ledger entries", value: getResidentLedger(res.hall).length.toString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "#f2f3f5", borderRadius: 6, padding: "8px 9px" }}>
                <div style={{ fontSize: "0.58rem", color: "#7a8392", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#182033" }}>{value}</div>
              </div>
            ))}
          </div>

          {historyData.length > 0 && (
            <>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#7a8392", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Incident frequency</div>
              <ResponsiveContainer width="100%" height={110}>
                <LineChart data={historyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#7a8392" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#7a8392" }} axisLine={false} tickLine={false} width={18} />
                  <Tooltip contentStyle={{ fontSize: "0.72rem", borderRadius: 6, border: "1px solid #e1e3e7" }} />
                  <Line type="monotone" dataKey="reports" stroke={theme.primaryColor} strokeWidth={2} dot={{ fill: theme.primaryColor, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Compare with another resident */}
        {!compareMode && (
          <button
            onClick={() => setCompareMode(true)}
            style={{ width: "100%", background: "#f2f3f5", border: "1px solid #e1e3e7", borderRadius: 7, padding: "9px", fontSize: "0.76rem", fontWeight: 500, color: "#586174", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14 }}
          >
            <GitCompare size={13} /> Compare with another resident
          </button>
        )}

        {/* Comparison picker */}
        {compareMode && !compareResident && (
          <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: 8, padding: 12, marginBottom: 14 }}>
            <div style={{ fontSize: "0.73rem", fontWeight: 700, color: "#49719c", marginBottom: 8 }}>Select a resident to compare</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {residents.filter(r => r.id !== resId).map(r => (
                <button
                  key={r.id}
                  onClick={() => setCompareId(r.id)}
                  style={{ background: "#fff", border: "1px solid #cddfeb", borderRadius: 6, padding: "8px 11px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.76rem", fontWeight: 600, color: "#49719c" }}>{r.id}</span>
                  <span style={{ fontSize: "0.69rem", color: "#586174" }}>{r.hall.split(" ")[0]}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setCompareMode(false)} style={{ marginTop: 8, background: "none", border: "none", color: "#7a8392", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        )}

        {/* Comparison header */}
        {compareResident && (
          <div style={{ background: "#eaf5ef", border: "1px solid #bddbc9", borderRadius: 8, padding: "10px 13px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "0.73rem", color: "#247a52", fontWeight: 600 }}>
              <GitCompare size={12} style={{ display: "inline", marginRight: 5 }} />
              Comparing {res.id} + {compareResident.id}
            </div>
            <button onClick={() => { setCompareMode(false); setCompareId(null) }} style={{ background: "none", border: "none", color: "#7a8392", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
          </div>
        )}

        {/* Comparison mini-card */}
        {compareResident && (
          <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.88rem", fontWeight: 700, color: "#247a52" }}>{compareResident.id}</span>
              {compareResident.wellnessFlag && <span style={{ background: "#fff4dc", color: "#a96612", border: "1px solid #f0d8a8", fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>Flag</span>}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#586174", marginBottom: 8 }}>{compareResident.hall} · Room {compareResident.room}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {[
                { label: "Incidents", value: compareResident.reportCount.toString() },
                { label: "Last", value: compareResident.lastIncident.slice(5) },
                { label: "Ledger", value: getResidentLedger(compareResident.hall).length.toString() },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#f2f3f5", borderRadius: 5, padding: "6px 8px" }}>
                  <div style={{ fontSize: "0.56rem", color: "#7a8392", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#182033" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline tab switcher */}
        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
          {(["all", "incidents", "ledger"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTimelineTab(tab)}
              style={{ flex: 1, padding: "7px 6px", borderRadius: 7, border: "1px solid #e1e3e7", background: timelineTab === tab ? theme.primaryColor : "#fff", color: timelineTab === tab ? "#fff" : "#586174", fontSize: "0.7rem", fontWeight: timelineTab === tab ? 600 : 400, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
            >
              {tab === "all" ? "All" : tab === "incidents" ? <><FileText size={11} /> Incidents</> : <><BookOpen size={11} /> Ledger</>}
            </button>
          ))}
        </div>

        {/* Timeline cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {timeline.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#7a8392", fontSize: "0.81rem" }}>No records found.</div>
          ) : (
            timeline.map(event => (
              <div key={event.id} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, padding: "11px 13px" }}>
                {event.type === "incident" ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <FileText size={11} color="#7a8392" />
                      <SeverityBadge severity={event.severity} size="sm" />
                      <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.62rem", color: "#7a8392", marginLeft: "auto" }}>{event.date}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#182033", marginBottom: 3 }}>{event.category}</div>
                    <div style={{ fontSize: "0.71rem", color: "#586174", lineHeight: 1.55 }}>{event.summary.slice(0, 120)}…</div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <BookOpen size={11} color="#7a8392" />
                      {(() => {
                        const tag = (event as { tag: string }).tag
                        const tc = tagColors[tag] ?? tagColors.Neutral
                        return <span style={{ color: tc.color, background: tc.bg, border: `1px solid ${tc.border}`, fontSize: "0.62rem", fontWeight: 600, padding: "1px 6px", borderRadius: 4 }}>{tag}</span>
                      })()}
                      <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.62rem", color: "#7a8392", marginLeft: "auto" }}>{event.date}</span>
                    </div>
                    <div style={{ fontSize: "0.71rem", color: "#586174", lineHeight: 1.55 }}>{(event as { note: string }).note}</div>
                    <div style={{ fontSize: "0.62rem", color: "#7a8392", marginTop: 4 }}>{(event as { raName: string }).raName}</div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Show detail view (push-style navigation on mobile)
  if (selectedId) {
    return (
      <div style={{ padding: "20px 16px" }}>
        <ResidentDetail resId={selectedId} />
      </div>
    )
  }

  // Show list view
  return (
    <div style={{ padding: "20px 16px" }}>
      <h1 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>Residents</h1>
      <p style={{ margin: "0 0 14px", fontSize: "0.78rem", color: "#586174" }}>Anonymized resident records</p>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#7a8392" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or hall..." style={{ width: "100%", padding: "8px 10px 8px 29px", border: "1px solid #e1e3e7", borderRadius: 7, fontSize: "0.81rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, padding: "12px 13px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.8rem", fontWeight: 700, color: theme.primaryColor }}>{r.id}</span>
                {r.wellnessFlag && <span style={{ background: "#fff4dc", color: "#a96612", fontSize: "0.6rem", fontWeight: 700, padding: "1px 5px", borderRadius: 3 }}>⚑ Wellness</span>}
              </div>
              <div style={{ fontSize: "0.73rem", color: "#586174" }}>{r.hall} · Room {r.room}</div>
              <div style={{ fontSize: "0.69rem", color: "#7a8392", marginTop: 2 }}>{r.reportCount} incident{r.reportCount !== 1 ? "s" : ""} · last {r.lastIncident}</div>
            </div>
            <ChevronRight size={15} color="#cdd1d8" style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  )
}

