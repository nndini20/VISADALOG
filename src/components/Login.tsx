import { useState } from "react"
import { Shield, Lock, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { PoweredBy } from "./shared/PoweredBy"
import type { InstitutionTheme } from "../theme"

interface Props {
  theme: InstitutionTheme
  onLogin: (role: "ra" | "admin") => void
}

function UCSBCrest({ size = 48 }: { size?: number }) {
  return (
    <div className="login-mark" style={{ width: size, height: size }}>
      <Shield size={size * 0.48} strokeWidth={1.8} />
    </div>
  )
}

export default function Login({ theme, onLogin }: Props) {
  const [ferpaOpen, setFerpaOpen] = useState(false)
  const [breakGlass, setBreakGlass] = useState(false)
  const [bgEmail, setBgEmail] = useState("")
  const [bgPass, setBgPass] = useState("")

  return (
    <div className="login-page" style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f7f6f2 0%, #edf0f8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      {/* Card */}
      <div className="login-card" style={{ background: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 32px rgba(0,54,96,0.10)", width: "100%", maxWidth: "420px", overflow: "hidden" }}>
        {/* Navy header band */}
        <div className="login-brand" style={{ background: theme.primaryColor, padding: "28px 32px 22px", textAlign: "center" }}>
          <UCSBCrest size={52} />
          <h1 style={{ color: "#ffffff", margin: "14px 0 4px", fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3 }}>{theme.loginTitle}</h1>
          <p style={{ color: "rgba(255,255,255,0.72)", margin: 0, fontSize: "0.82rem", lineHeight: 1.5 }}>{theme.loginSubtitle}</p>
        </div>

        {/* Body */}
        <div className="login-body" style={{ padding: "28px 32px" }}>
          {/* Demo role selector */}
          <div className="login-demo" style={{ background: "#fff4dc", border: "1px solid #f0d8a8", borderRadius: "6px", padding: "10px 14px", marginBottom: "20px", fontSize: "0.78rem", color: "#a96612" }}>
            <strong>Demo mode:</strong> Choose a role to explore the platform
          </div>

          <button
            className="login-action login-action-primary"
            onClick={() => onLogin("ra")}
            style={{ width: "100%", background: theme.primaryColor, color: "#ffffff", border: "none", borderRadius: "7px", padding: "13px 16px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px", fontFamily: "inherit", transition: "opacity 0.15s" }}
            onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >
            <Shield size={18} />
            {theme.ssoButtonLabel} — as RA
          </button>

          <button
            className="login-action login-action-secondary"
            onClick={() => onLogin("admin")}
            style={{ width: "100%", background: "transparent", color: theme.primaryColor, border: `1.5px solid ${theme.primaryColor}`, borderRadius: "7px", padding: "12px 16px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit", transition: "background 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.background = "#edf0f8" }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent" }}
          >
            <Shield size={18} />
            {theme.ssoButtonLabel} — as Administrator
          </button>

          {/* Secure session indicator */}
          <div className="login-security" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginTop: "14px", color: "#586174", fontSize: "0.73rem" }}>
            <Lock size={11} />
            Secure session · {theme.ssoProvider} authentication
          </div>

          {/* FERPA accordion */}
          <div className="login-disclosure" style={{ marginTop: "20px", border: "1px solid #e1e3e7", borderRadius: "6px", overflow: "hidden" }}>
            <button
              onClick={() => setFerpaOpen(!ferpaOpen)}
              style={{ width: "100%", background: "#f2f3f5", border: "none", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "0.78rem", color: "#586174", fontFamily: "inherit", fontWeight: 500 }}
            >
              <span>FERPA &amp; Privacy Notice</span>
              {ferpaOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {ferpaOpen && (
              <div style={{ padding: "12px 14px", fontSize: "0.72rem", color: "#586174", lineHeight: 1.6, borderTop: "1px solid #e1e3e7" }}>
                {theme.ferpaNotice}
              </div>
            )}
          </div>

          {/* Break-glass emergency admin */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={() => setBreakGlass(!breakGlass)}
              style={{ background: "none", border: "none", fontSize: "0.72rem", color: "#7a8392", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}
            >
              {theme.breakGlassLabel}
            </button>
          </div>
          {breakGlass && (
            <div style={{ marginTop: "12px", padding: "14px", background: "#fcebea", border: "1px solid #efcecc", borderRadius: "6px" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "10px", color: "#c53d3d", fontSize: "0.73rem" }}>
                <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: "1px" }} />
                For authorized personnel only. This access is fully audited.
              </div>
              <input value={bgEmail} onChange={e => setBgEmail(e.target.value)} placeholder="Administrator email" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e1e3e7", borderRadius: "5px", fontSize: "0.82rem", marginBottom: "7px", fontFamily: "inherit" }} />
              <input value={bgPass} onChange={e => setBgPass(e.target.value)} type="password" placeholder="Emergency passphrase" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e1e3e7", borderRadius: "5px", fontSize: "0.82rem", marginBottom: "10px", fontFamily: "inherit" }} />
              <button
                onClick={() => onLogin("admin")}
                style={{ width: "100%", background: "#c53d3d", color: "#fff", border: "none", borderRadius: "5px", padding: "9px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                Emergency Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer" style={{ marginTop: "24px", textAlign: "center" }}>
        <p style={{ color: "#586174", fontSize: "0.8rem", margin: "0 0 6px", fontWeight: 600 }}>{theme.footerTagline}</p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "10px" }}>
          {[
            { label: "Privacy", href: theme.privacyLink },
            { label: "FERPA Notice", href: theme.ferpaLink },
            { label: "Accessibility", href: theme.accessibilityLink },
            { label: "Support", href: theme.supportLink },
            { label: "Security", href: theme.securityLink },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ color: "#7a8392", fontSize: "0.72rem", textDecoration: "none" }}
              onMouseOver={e => (e.currentTarget.style.color = "#586174")}
              onMouseOut={e => (e.currentTarget.style.color = "#7a8392")}>
              {label}
            </a>
          ))}
        </div>
        <PoweredBy brand={theme.poweredBy} />
      </footer>
    </div>
  )
}
