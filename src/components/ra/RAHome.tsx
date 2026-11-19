import { useState } from "react"
import { FilePlus, CheckCircle, Clock, AlertTriangle, Moon, LifeBuoy, X, Send } from "lucide-react"
import { SeverityBadge } from "../shared/SeverityBadge"
import { reports } from "../../data"
import type { InstitutionTheme } from "../../theme"
import type { RATab } from "./RAShell"

interface Props {
  theme: InstitutionTheme
  onTab: (t: RATab) => void
}

export default function RAHome({ theme, onTab }: Props) {
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportType, setSupportType] = useState("")
  const [supportNote, setSupportNote] = useState("")
  const [supportSent, setSupportSent] = useState(false)

  const myReports = reports.filter(r => r.raId === "RA-014").slice(0, 3)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  function sendSupportRequest() {
    setSupportSent(true)
    setTimeout(() => { setSupportOpen(false); setSupportSent(false); setSupportType(""); setSupportNote("") }, 2000)
  }

  return (
    <div className="ra-home" style={{ padding: "18px 16px" }}>
      {/* Greeting */}
      <div className="ra-home-hero" style={{ marginBottom: 20 }}>
        <div className="ra-shift-pill" style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <Moon size={15} style={{ color: theme.primaryColor }} />
          <span style={{ fontSize: "0.76rem", color: "#586174" }}>Shift in progress · Santa Rosa Hall, Floor 3</span>
        </div>
        <h2 style={{ margin: "0 0 2px", fontSize: "1.25rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>{greeting}, Jordan.</h2>
        <p style={{ margin: 0, fontSize: "0.79rem", color: "#586174" }}>Thursday, July 22 · 11:14 PM</p>
      </div>

      {/* Shift summary cards */}
      <div className="ra-metric-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Reports this shift", value: "1", icon: <FilePlus size={15} />, color: theme.primaryColor },
          { label: "Pending wellness", value: "0", icon: <CheckCircle size={15} />, color: "#247a52" },
          { label: "Open incidents", value: "2", icon: <AlertTriangle size={15} />, color: "#a96612" },
          { label: "Floor checks", value: "3", icon: <Clock size={15} />, color: "#586174" },
        ].map(({ label, value, icon, color }) => (
          <div className="ra-metric-card" key={label} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, padding: "13px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ color, display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", fontWeight: 500 }}>{icon}{label}</div>
            <div style={{ fontSize: "1.55rem", fontWeight: 700, color: "#182033", lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Primary CTA */}
      <button
        className="ra-primary-action"
        onClick={() => onTab("new-report")}
        style={{ width: "100%", background: theme.primaryColor, color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit", marginBottom: 10 }}
      >
        <FilePlus size={17} /> Document New Incident
      </button>

      {/* RA Support Request */}
      <button
        className="ra-secondary-action"
        onClick={() => setSupportOpen(true)}
        style={{ width: "100%", background: "#fff", color: "#586174", border: "1px solid #e1e3e7", borderRadius: 8, padding: "11px", fontSize: "0.84rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit", marginBottom: 20 }}
      >
        <LifeBuoy size={16} style={{ color: "#a96612" }} /> Request RA Support
      </button>

      {/* Recent reports */}
      <h3 className="ra-section-title" style={{ margin: "0 0 10px", fontSize: "0.76rem", fontWeight: 700, color: "#7a8392", textTransform: "uppercase", letterSpacing: "0.07em" }}>Recent Reports</h3>
      <div className="ra-report-list" style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {myReports.map(r => (
          <div className="ra-report-card" key={r.id} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, padding: "12px 13px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", color: "#7a8392" }}>{r.id}</span>
              <SeverityBadge severity={r.severity} size="sm" />
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "#182033", marginBottom: 2 }}>{r.category}</div>
            <div style={{ fontSize: "0.7rem", color: "#586174" }}>{r.hall} · {r.date}</div>
          </div>
        ))}
      </div>

      {/* Wellness prompt */}
      <div className="ra-wellness-card" style={{ background: "#eaf5ef", border: "1px solid #bddbc9", borderRadius: 8, padding: 13 }}>
        <div style={{ fontSize: "0.81rem", fontWeight: 600, color: "#247a52", marginBottom: 3 }}>How are you doing tonight?</div>
        <div style={{ fontSize: "0.73rem", color: "#247a52", marginBottom: 9 }}>RAs matter too. Check in with yourself.</div>
        <button onClick={() => onTab("wellness")} style={{ background: "#247a52", color: "#fff", border: "none", borderRadius: 5, padding: "7px 13px", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Open Wellness Check-In
        </button>
      </div>

      {/* Support Request Modal */}
      {supportOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#fff", borderRadius: "14px 14px 0 0", width: "100%", maxWidth: 480, margin: "0 auto", padding: "20px 20px 32px", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>Request RA Support</h3>
                <p style={{ margin: "3px 0 0", fontSize: "0.73rem", color: "#586174" }}>Your RA Support Coordinator will be notified</p>
              </div>
              <button onClick={() => setSupportOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={18} color="#586174" />
              </button>
            </div>

            {supportSent ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#eaf5ef", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <CheckCircle size={22} color="#247a52" />
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#247a52" }}>Support request sent</div>
                <div style={{ fontSize: "0.76rem", color: "#586174", marginTop: 4 }}>Your coordinator will follow up soon</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Type of support needed</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {["Incident debrief", "Escalation guidance", "Emotional support", "Policy question", "Other"].map(t => (
                      <button
                        key={t}
                        onClick={() => setSupportType(t)}
                        style={{ background: supportType === t ? "#edf0f8" : "#f2f3f5", border: `1.5px solid ${supportType === t ? theme.primaryColor : "#e1e3e7"}`, borderRadius: 7, padding: "10px 13px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem", color: supportType === t ? theme.primaryColor : "#182033", fontWeight: supportType === t ? 600 : 400 }}
                      >
                        {t}
                        {supportType === t && <CheckCircle size={15} color={theme.primaryColor} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Additional context <span style={{ color: "#7a8392", fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    value={supportNote}
                    onChange={e => setSupportNote(e.target.value)}
                    placeholder="Brief description of what's going on..."
                    style={{ width: "100%", height: 80, padding: 10, border: "1px solid #e1e3e7", borderRadius: 6, fontSize: "0.82rem", fontFamily: "inherit", resize: "none", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
                <div style={{ background: "#f2f3f5", border: "1px solid #e1e3e7", borderRadius: 7, padding: "10px 13px", marginBottom: 16 }}>
                  <div style={{ fontSize: "0.7rem", color: "#586174", lineHeight: 1.55 }}>
                    <strong style={{ color: "#182033" }}>Confidential.</strong> This request goes only to your RA Support Coordinator and is not included in any resident incident records.
                  </div>
                </div>
                <button
                  onClick={sendSupportRequest}
                  disabled={!supportType}
                  style={{ width: "100%", background: supportType ? theme.primaryColor : "#e1e3e7", color: supportType ? "#fff" : "#7a8392", border: "none", borderRadius: 7, padding: "12px", fontSize: "0.88rem", fontWeight: 600, cursor: supportType ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}
                >
                  <Send size={15} /> Send Support Request
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const lbl = { display: "block", fontSize: "0.73rem", fontWeight: 600, color: "#182033", marginBottom: 6 } as const
