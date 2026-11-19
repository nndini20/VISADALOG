import { LayoutDashboard, Inbox, Users, BookOpen, Heart, BarChart2, Download, ScrollText, Settings, LogOut, Menu, Shield } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"
import { PoweredBy } from "../shared/PoweredBy"
import type { InstitutionTheme } from "../../theme"

export type AdminTab = "overview" | "queue" | "residents" | "ledger" | "wellness" | "analytics" | "exports" | "audit" | "admin"

const navItems: { id: AdminTab; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "queue", label: "Report Queue", Icon: Inbox },
  { id: "residents", label: "Residents", Icon: Users },
  { id: "ledger", label: "The Ledger", Icon: BookOpen },
  { id: "wellness", label: "Wellness Checks", Icon: Heart },
  { id: "analytics", label: "Analytics", Icon: BarChart2 },
  { id: "exports", label: "Legal Exports", Icon: Download },
  { id: "audit", label: "Audit Log", Icon: ScrollText },
  { id: "admin", label: "Administration", Icon: Settings },
]

interface Props {
  theme: InstitutionTheme
  activeTab: AdminTab
  onTab: (t: AdminTab) => void
  onLogout: () => void
  children: ReactNode
}

function UCSBLogoSmall() {
  return (
    <div className="admin-brand-mark">
      <Shield size={17} strokeWidth={1.8} />
    </div>
  )
}

export default function AdminShell({ theme, activeTab, onTab, onLogout, children }: Props) {
  const [mobileNav, setMobileNav] = useState(false)

  const sidebar = (
    <div className="admin-sidebar-inner" style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.primaryColor }}>
      {/* Logo area */}
      <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
          <UCSBLogoSmall />
          <div>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.82rem", lineHeight: 1.2 }}>{theme.institutionShortName}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.65rem" }}>Residential Life</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: theme.secondaryColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: theme.primaryColor, flexShrink: 0 }}>DR</div>
          <div>
            <div style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>Dr. Rivera</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.62rem" }}>Resident Director</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {navItems.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              className={`admin-nav-item${active ? " is-active" : ""}`}
              key={id}
              onClick={() => { onTab(id); setMobileNav(false) }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 18px", background: active ? "rgba(255,255,255,0.14)" : "none", border: "none", cursor: "pointer", color: active ? "#ffffff" : "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: active ? 600 : 400, textAlign: "left", borderLeft: active ? `3px solid ${theme.secondaryColor}` : "3px solid transparent", transition: "all 0.15s" }}
              onMouseOver={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.85)" }}
              onMouseOut={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.6)" }}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem", marginBottom: "10px", padding: 0 }}>
          <LogOut size={13} /> Sign Out
        </button>
        <PoweredBy brand={theme.poweredBy} />
      </div>
    </div>
  )

  return (
    <div className="admin-shell" style={{ display: "flex", height: "100vh", background: "#f7f6f2" }}>
      {/* Desktop sidebar */}
      <div style={{ width: "210px", flexShrink: 0, display: "flex", flexDirection: "column" }} className="admin-sidebar hidden lg:flex">
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNav && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileNav(false)} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "220px" }}>
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="admin-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Mobile top bar */}
        <div className="admin-mobile-bar" style={{ background: theme.primaryColor, padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setMobileNav(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "2px", display: "flex" }}>
            <Menu size={20} />
          </button>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.88rem" }}>{theme.institutionShortName} Residential Life</span>
        </div>

        <div className="admin-scroll" style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
