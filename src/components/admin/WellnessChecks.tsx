import { useState } from "react"
import { Heart, CheckCircle, AlertTriangle } from "lucide-react"
import { wellnessFlags as initialFlags } from "../../data"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

export default function WellnessChecks({ theme }: Props) {
  const [flags, setFlags] = useState(initialFlags)

  function markCheckedIn(residentId: string) {
    setFlags(f => f.map(w =>
      w.residentId === residentId
        ? { ...w, checkedIn: true, checkedInBy: "Dr. Rivera, RD", checkedInAt: new Date().toISOString().slice(0, 16).replace("T", " ") }
        : w
    ))
  }

  const pending = flags.filter(w => !w.checkedIn)
  const completed = flags.filter(w => w.checkedIn)

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif", display: "flex", alignItems: "center", gap: "10px" }}>
          <Heart size={20} /> Wellness Checks
        </h1>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#586174" }}>Threshold-based resident wellness monitoring</p>
      </div>

      {/* Threshold info */}
      <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: "8px", padding: "14px 18px", marginBottom: "24px" }}>
        <div style={{ fontSize: "0.78rem", color: "#49719c", fontWeight: 600, marginBottom: "4px" }}>Automatic flagging criteria</div>
        <div style={{ fontSize: "0.75rem", color: "#49719c", lineHeight: 1.6 }}>
          Residents are flagged when: 3+ reports in 30 days · any Critical incident · welfare escalation in past 14 days
        </div>
      </div>

      {pending.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "0.8rem", fontWeight: 600, color: "#a96612", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertTriangle size={14} /> Pending ({pending.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pending.map(w => (
              <div key={w.residentId} style={{ background: "#fff", border: "1px solid #f0d8a8", borderRadius: "9px", padding: "18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                  <div>
                    <div style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontWeight: 700, fontSize: "0.88rem", color: theme.primaryColor, marginBottom: "3px" }}>{w.residentDisplay}</div>
                    <div style={{ fontSize: "0.78rem", color: "#586174", marginBottom: "6px" }}>{w.hall}</div>
                    <div style={{ fontSize: "0.78rem", color: "#a96612", fontWeight: 500 }}>{w.flagReason}</div>
                    <div style={{ fontSize: "0.72rem", color: "#7a8392", marginTop: "3px" }}>{w.reportCount} reports · last incident {w.lastIncident}</div>
                  </div>
                  <button
                    onClick={() => markCheckedIn(w.residentId)}
                    style={{ background: "#247a52", color: "#fff", border: "none", borderRadius: "6px", padding: "9px 14px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <CheckCircle size={14} /> Mark Checked In
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 style={{ margin: "0 0 12px", fontSize: "0.8rem", fontWeight: 600, color: "#247a52", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle size={14} /> Completed ({completed.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {completed.map(w => (
              <div key={w.residentId} style={{ background: "#eaf5ef", border: "1px solid #bddbc9", borderRadius: "8px", padding: "14px 18px" }}>
                <div style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontWeight: 600, fontSize: "0.82rem", color: "#247a52", marginBottom: "2px" }}>{w.residentDisplay}</div>
                <div style={{ fontSize: "0.75rem", color: "#586174" }}>{w.hall}</div>
                <div style={{ fontSize: "0.72rem", color: "#247a52", marginTop: "5px" }}>
                  Checked in by {w.checkedInBy} · {w.checkedInAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && completed.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#7a8392", fontSize: "0.88rem" }}>No wellness flags at this time. All residents are within normal thresholds.</div>
      )}
    </div>
  )
}
