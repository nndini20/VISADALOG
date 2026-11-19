import { Home, FilePlus, BookOpen, FileText, Heart, HelpCircle } from "lucide-react"
import type { ReactNode } from "react"
import type { InstitutionTheme } from "../../theme"

export type RATab = "home" | "new-report" | "ledger" | "my-reports" | "wellness" | "help"

const tabs: { id: RATab; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "new-report", label: "New Report", Icon: FilePlus },
  { id: "ledger", label: "The Ledger", Icon: BookOpen },
  { id: "my-reports", label: "My Reports", Icon: FileText },
  { id: "wellness", label: "Wellness", Icon: Heart },
  { id: "help", label: "Help", Icon: HelpCircle },
]

interface Props {
  theme: InstitutionTheme
  activeTab: RATab
  onTab: (t: RATab) => void
  onLogout: () => void
  children: ReactNode
}

export default function RAShell({ theme, activeTab, onTab, onLogout, children }: Props) {
  return (
    <div className="ra-shell" style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: "480px", margin: "0 auto", background: "#f7f6f2", position: "relative" }}>
      {/* Top bar */}
      <div className="ra-topbar" style={{ background: theme.primaryColor, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.88rem" }}>{theme.institutionShortName} Residential Life</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.68rem" }}>Resident Assistant Portal</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: theme.secondaryColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: theme.primaryColor }}>JM</div>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "0.68rem", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontFamily: "inherit" }}>Sign Out</button>
        </div>
      </div>

      {/* Content area */}
      <div className="ra-content" style={{ flex: 1, overflowY: "auto", paddingBottom: "72px" }}>
        {children}
      </div>

      {/* Bottom tab bar */}
      <div className="ra-tabbar" style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "480px", background: "#ffffff", borderTop: "1px solid #e1e3e7", display: "flex", zIndex: 100 }}>
        {tabs.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              className={`ra-tab${active ? " is-active" : ""}`}
              key={id}
              onClick={() => onTab(id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px 10px", background: "none", border: "none", cursor: "pointer", color: active ? theme.primaryColor : "#7a8392", transition: "color 0.15s", fontFamily: "inherit" }}
            >
              <Icon size={18} />
              <span style={{ fontSize: "0.58rem", marginTop: "3px", fontWeight: active ? 600 : 400 }}>{label}</span>
              {active && <div style={{ width: "20px", height: "2px", background: theme.primaryColor, borderRadius: "1px", marginTop: "4px" }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
