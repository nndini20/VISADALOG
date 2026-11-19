import { useState } from "react"
import type { CSSProperties } from "react"
import { ucsbTheme, calPolyPreviewTheme } from "../../theme"
import type { InstitutionTheme } from "../../theme"
import { Settings, Eye } from "lucide-react"

interface Props { theme: InstitutionTheme }

function MiniLoginPreview({ t }: { t: Partial<InstitutionTheme> & { primaryColor: string; secondaryColor: string } }) {
  return (
    <div style={{ background: "#f7f6f2", border: "1px solid #e1e3e7", borderRadius: "8px", overflow: "hidden", fontFamily: "inherit" }}>
      <div style={{ background: t.primaryColor, padding: "14px", textAlign: "center" }}>
        <div style={{ width: "28px", height: "28px", background: t.secondaryColor, borderRadius: "4px", margin: "0 auto 7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", fontWeight: 700, color: t.primaryColor }}>
          {t.institutionShortName?.slice(0, 2) ?? "UC"}
        </div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.72rem", lineHeight: 1.3 }}>{t.loginTitle ?? t.institutionName}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.6rem", marginTop: "2px" }}>Secure incident documentation</div>
      </div>
      <div style={{ padding: "11px" }}>
        <div style={{ background: t.primaryColor, color: "#fff", borderRadius: "5px", padding: "7px", textAlign: "center", fontSize: "0.67rem", fontWeight: 600, marginBottom: "7px" }}>{t.ssoButtonLabel ?? "Sign in with SSO"}</div>
        <div style={{ fontSize: "0.6rem", color: "#7a8392", textAlign: "center" }}>{t.supportEmail}</div>
      </div>
    </div>
  )
}

export default function Administration({ theme }: Props) {
  const [showPreview, setShowPreview] = useState(false)
  const [editName, setEditName] = useState(theme.institutionName)
  const [editPrimary, setEditPrimary] = useState(theme.primaryColor)
  const [editSecondary, setEditSecondary] = useState(theme.secondaryColor)
  const [editSSO, setEditSSO] = useState(theme.ssoButtonLabel)
  const [editEmail, setEditEmail] = useState(theme.supportEmail)

  const previewTheme = {
    ...theme,
    institutionName: editName,
    primaryColor: editPrimary,
    secondaryColor: editSecondary,
    ssoButtonLabel: editSSO,
    supportEmail: editEmail,
    loginTitle: editName,
  }

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
          <Settings size={17} /> Administration
        </h1>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#586174" }}>Platform configuration · System Administrator</p>
      </div>

      {/* Brand config form */}
      <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 10, padding: 16, marginBottom: 14 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Institution Branding</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={lbl}>Institution Name</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>SSO Button Label</label>
            <input value={editSSO} onChange={e => setEditSSO(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Support Email</label>
            <input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={inp} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={lbl}>Primary Color</label>
              <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <input type="color" value={editPrimary} onChange={e => setEditPrimary(e.target.value)} style={{ width: 34, height: 30, padding: "2px", border: "1px solid #e1e3e7", borderRadius: 4, cursor: "pointer", flexShrink: 0 }} />
                <input value={editPrimary} onChange={e => setEditPrimary(e.target.value)} style={{ ...inp, flex: 1, fontSize: "0.72rem" }} />
              </div>
            </div>
            <div>
              <label style={lbl}>Accent Color</label>
              <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <input type="color" value={editSecondary} onChange={e => setEditSecondary(e.target.value)} style={{ width: 34, height: 30, padding: "2px", border: "1px solid #e1e3e7", borderRadius: 4, cursor: "pointer", flexShrink: 0 }} />
                <input value={editSecondary} onChange={e => setEditSecondary(e.target.value)} style={{ ...inp, flex: 1, fontSize: "0.72rem" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live login preview */}
      <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 10, padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Login Preview</h3>
          <button onClick={() => setShowPreview(!showPreview)} style={{ background: "none", border: "none", fontSize: "0.73rem", color: theme.primaryColor, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
            <Eye size={12} /> {showPreview ? "Hide" : "Compare"}
          </button>
        </div>
        <MiniLoginPreview t={previewTheme} />
      </div>

      {/* White-label comparison */}
      {showPreview && (
        <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <h3 style={{ margin: "0 0 5px", fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>White-Label Preview</h3>
          <p style={{ margin: "0 0 14px", fontSize: "0.76rem", color: "#586174" }}>The same interface, rebranded for another institution.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#586174", marginBottom: 7 }}>Current · {ucsbTheme.institutionShortName}</div>
              <MiniLoginPreview t={ucsbTheme} />
            </div>
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#586174", marginBottom: 7 }}>Preview · {calPolyPreviewTheme.institutionShortName}</div>
              <MiniLoginPreview t={{ ...ucsbTheme, ...calPolyPreviewTheme, primaryColor: calPolyPreviewTheme.primaryColor!, secondaryColor: calPolyPreviewTheme.secondaryColor! }} />
            </div>
          </div>
          <div style={{ marginTop: 12, background: "#f2f3f5", borderRadius: 6, padding: "10px 12px", fontSize: "0.72rem", color: "#586174", lineHeight: 1.6 }}>
            Only the <strong>theme config</strong> changes between institutions. All components, AI workflows, audit controls, and FERPA handling stay identical.
          </div>
        </div>
      )}

      {/* Role management */}
      <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 10, padding: 16 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Active Roles</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            { role: "Resident Assistant", count: 24, color: "#49719c" },
            { role: "Resident Director", count: 4, color: "#003660" },
            { role: "Assistant Resident Director", count: 3, color: "#003660" },
            { role: "Area Coordinator", count: 2, color: "#586174" },
            { role: "Legal & Compliance Reviewer", count: 1, color: "#a96612" },
            { role: "UCSB System Administrator", count: 2, color: "#c53d3d" },
          ].map(({ role, count, color }) => (
            <div key={role} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "#f2f3f5", borderRadius: 6 }}>
              <span style={{ fontSize: "0.79rem", color: "#182033" }}>{role}</span>
              <span style={{ fontSize: "0.69rem", fontWeight: 700, color, background: `${color}18`, padding: "2px 7px", borderRadius: 4, flexShrink: 0, marginLeft: 8 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const lbl: CSSProperties = { display: "block", fontSize: "0.71rem", fontWeight: 600, color: "#182033", marginBottom: 5 }
const inp: CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #e1e3e7", borderRadius: 5, fontSize: "0.81rem", fontFamily: "inherit", boxSizing: "border-box" }
