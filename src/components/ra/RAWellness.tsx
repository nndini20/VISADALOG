import { useState } from "react"
import { Heart, Check, Smile, Meh, BatteryLow, LifeBuoy } from "lucide-react"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

const moodOptions = [
  { label: "Doing great", Icon: Smile, color: "#247a52" },
  { label: "Okay", Icon: Meh, color: "#49719c" },
  { label: "A bit drained", Icon: BatteryLow, color: "#a96612" },
  { label: "Need support", Icon: LifeBuoy, color: "#c53d3d" },
]

const resources = [
  { name: "UCSB Counseling & Psych Services", contact: "(805) 893-4411", note: "Same-day crisis appointments available" },
  { name: "UCSB Student Health", contact: "(805) 893-3371", note: "Walk-in hours Mon–Fri 8am–5pm" },
  { name: "RA Support Coordinator", contact: "rasupport@ucsb.edu", note: "Your direct wellness contact" },
  { name: "Crisis Text Line", contact: "Text HOME to 741741", note: "24/7 confidential support" },
]

export default function RAWellness({ theme }: Props) {
  const [mood, setMood] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="wellness-page" style={{ padding: "20px 16px" }}>
      <div className="wellness-header" style={{ textAlign: "center", marginBottom: "22px" }}>
        <div className="wellness-header-icon" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f1eef8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Heart size={22} color="#65549b" fill="#65549b" />
        </div>
        <div className="wellness-header-copy">
          <h2 style={{ margin: "0 0 6px", fontFamily: "'Inter:Semi Bold', Inter, sans-serif", color: theme.primaryColor, fontSize: "1.2rem" }}>RA Wellness Check-In</h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#586174", lineHeight: 1.6 }}>
            This check-in is for you — confidential and separate from any incident reports. Your wellbeing matters.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="wellness-success" style={{ textAlign: "center", padding: "24px", background: "#eaf5ef", borderRadius: "10px", border: "1px solid #bddbc9" }}>
          <Check size={28} color="#247a52" style={{ marginBottom: "10px" }} />
          <div style={{ fontWeight: 700, color: "#247a52", marginBottom: "6px" }}>Check-in recorded.</div>
          <div style={{ fontSize: "0.82rem", color: "#247a52" }}>Your RA Support Coordinator has been notified. Take care of yourself tonight.</div>
        </div>
      ) : (
        <>
          <div className="wellness-panel" style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "8px", padding: "16px", marginBottom: "14px" }}>
            <div className="wellness-panel-title" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#182033", marginBottom: "10px" }}>How are you feeling?</div>
            <div className="wellness-mood-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {moodOptions.map(({ label, Icon, color }) => (
                <button className={`wellness-mood-option${mood === label ? " is-selected" : ""}`} key={label} onClick={() => setMood(label)} style={{ background: mood === label ? "#edf0f8" : "#f2f3f5", border: `1.5px solid ${mood === label ? theme.primaryColor : "#e1e3e7"}`, borderRadius: "7px", padding: "12px 8px", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                  <Icon size={24} strokeWidth={1.8} color={mood === label ? theme.primaryColor : color} style={{ marginBottom: "6px" }} />
                  <div style={{ fontSize: "0.72rem", fontWeight: 500, color: mood === label ? theme.primaryColor : "#586174" }}>{label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="wellness-panel" style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "8px", padding: "16px", marginBottom: "14px" }}>
            <div className="wellness-panel-title" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#182033", marginBottom: "6px" }}>Anything you'd like to share?</div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional — your RA Support Coordinator will follow up if you need it."
              style={{ width: "100%", height: "70px", padding: "10px", border: "1px solid #e1e3e7", borderRadius: "6px", fontSize: "0.82rem", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            className="wellness-submit"
            onClick={() => mood && setSubmitted(true)}
            disabled={!mood}
            style={{ width: "100%", background: mood ? theme.primaryColor : "#e1e3e7", color: mood ? "#fff" : "#7a8392", border: "none", borderRadius: "7px", padding: "13px", fontSize: "0.9rem", fontWeight: 600, cursor: mood ? "pointer" : "default", fontFamily: "inherit", marginBottom: "22px" }}
          >
            Submit Check-In
          </button>
        </>
      )}

      {/* Resources */}
      <div className="wellness-resources">
        <h3 style={{ margin: "0 0 12px", fontSize: "0.78rem", fontWeight: 600, color: "#586174", textTransform: "uppercase", letterSpacing: "0.06em" }}>Support Resources</h3>
        <div className="wellness-resource-grid" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {resources.map(r => (
            <div className="wellness-resource-card" key={r.name} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "7px", padding: "12px 14px" }}>
              <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#182033", marginBottom: "2px" }}>{r.name}</div>
              <div style={{ fontSize: "0.75rem", color: theme.primaryColor, fontWeight: 500, marginBottom: "2px" }}>{r.contact}</div>
              <div style={{ fontSize: "0.72rem", color: "#586174" }}>{r.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
