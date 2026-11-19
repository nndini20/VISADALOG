import { useEffect, useState } from "react"
import { Lock, Clock } from "lucide-react"

interface Props {
  onStaySignedIn: () => void
  onSignOut: () => void
  warningAt?: number
}

export function SessionTimeout({ onStaySignedIn, onSignOut, warningAt = 120 }: Props) {
  const [countdown, setCountdown] = useState(warningAt)

  useEffect(() => {
    if (countdown <= 0) { onSignOut(); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, onSignOut])

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60
  const urgency = countdown <= 30

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,22,54,0.65)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: urgency ? "#fcebea" : "#f2f3f5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          {urgency ? <Lock size={24} color="#c53d3d" /> : <Clock size={24} color="#586174" />}
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700, color: "#182033", fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>
          Session Expiring Soon
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: "0.84rem", color: "#586174", lineHeight: 1.6 }}>
          Your session will expire due to inactivity. To protect FERPA-protected records, you will be signed out automatically.
        </p>

        {/* Countdown display */}
        <div style={{ background: urgency ? "#fcebea" : "#f2f3f5", border: `1px solid ${urgency ? "#efcecc" : "#e1e3e7"}`, borderRadius: 8, padding: "16px", marginBottom: 20 }}>
          <div style={{ fontSize: "0.71rem", fontWeight: 600, color: urgency ? "#c53d3d" : "#7a8392", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Signing out in
          </div>
          <div style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "2rem", fontWeight: 700, color: urgency ? "#c53d3d" : "#182033", letterSpacing: "0.05em" }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
          <button
            onClick={onStaySignedIn}
            style={{ background: "#003660", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Stay Signed In
          </button>
          <button
            onClick={onSignOut}
            style={{ background: "none", color: "#586174", border: "1px solid #e1e3e7", borderRadius: 8, padding: "11px", fontSize: "0.84rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
          >
            Sign Out Now
          </button>
        </div>

        <p style={{ margin: "16px 0 0", fontSize: "0.69rem", color: "#7a8392", lineHeight: 1.55 }}>
          This security measure protects student education records under FERPA. Any unsaved progress in active forms will be preserved as a draft.
        </p>
      </div>
    </div>
  )
}
