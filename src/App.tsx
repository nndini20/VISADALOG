import { useState, useEffect, useCallback, useRef } from "react"
import { ucsbTheme } from "./theme"
import Login from "./components/Login"
import RAShell, { type RATab } from "./components/ra/RAShell"
import RAHome from "./components/ra/RAHome"
import NewReport from "./components/ra/NewReport"
import TheLedger from "./components/ra/TheLedger"
import MyReports from "./components/ra/MyReports"
import RAWellness from "./components/ra/RAWellness"
import RAHelp from "./components/ra/RAHelp"
import AdminShell, { type AdminTab } from "./components/admin/AdminShell"
import Overview from "./components/admin/Overview"
import ReportQueue from "./components/admin/ReportQueue"
import Residents from "./components/admin/Residents"
import AdminLedger from "./components/admin/AdminLedger"
import WellnessChecks from "./components/admin/WellnessChecks"
import Analytics from "./components/admin/Analytics"
import LegalExports from "./components/admin/LegalExports"
import AuditLog from "./components/admin/AuditLog"
import Administration from "./components/admin/Administration"
import { SessionTimeout } from "./components/shared/SessionTimeout"

type Screen = "login" | "ra" | "admin"

// Idle timeout: warn at 13 min, auto-logout at 15 min
const IDLE_WARNING_AFTER = 13 * 60 * 1000  // 13 minutes
const IDLE_TOTAL = 15 * 60 * 1000          // 15 minutes

export default function App() {
  const [screen, setScreen] = useState<Screen>("login")
  const [raTab, setRaTab] = useState<RATab>("home")
  const [adminTab, setAdminTab] = useState<AdminTab>("overview")
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const [ledgerDraft, setLedgerDraft] = useState<{ location: string; notes: string; hall: string } | null>(null)

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const theme = ucsbTheme

  const resetTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    if (warnTimer.current) clearTimeout(warnTimer.current)
    setShowTimeoutWarning(false)
    if (screen === "login") return
    warnTimer.current = setTimeout(() => setShowTimeoutWarning(true), IDLE_WARNING_AFTER)
    idleTimer.current = setTimeout(() => { handleLogout(); setShowTimeoutWarning(false) }, IDLE_TOTAL)
  }, [screen])

  useEffect(() => {
    resetTimers()
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"]
    events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }))
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimers))
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (warnTimer.current) clearTimeout(warnTimer.current)
    }
  }, [resetTimers])

  function handleLogin(role: "ra" | "admin") {
    setScreen(role === "ra" ? "ra" : "admin")
  }

  function handleLogout() {
    setScreen("login")
    setRaTab("home")
    setAdminTab("overview")
    setLedgerDraft(null)
    setShowTimeoutWarning(false)
  }

  function handleLedgerConvert(entry: { location: string; notes: string; hall: string }) {
    setLedgerDraft(entry)
    setRaTab("new-report")
  }

  if (screen === "login") {
    return <Login theme={theme} onLogin={handleLogin} />
  }

  return (
    <>
      {showTimeoutWarning && (
        <SessionTimeout
          onStaySignedIn={resetTimers}
          onSignOut={handleLogout}
          warningAt={120}
        />
      )}

      {screen === "ra" ? (
        <RAShell theme={theme} activeTab={raTab} onTab={setRaTab} onLogout={handleLogout}>
          {raTab === "home" && <RAHome theme={theme} onTab={setRaTab} />}
          {raTab === "new-report" && (
            <NewReport
              theme={theme}
              initialDraft={ledgerDraft}
              onComplete={() => { setLedgerDraft(null); setRaTab("home") }}
            />
          )}
          {raTab === "ledger" && (
            <TheLedger theme={theme} onConvertToReport={handleLedgerConvert} />
          )}
          {raTab === "my-reports" && <MyReports theme={theme} />}
          {raTab === "wellness" && <RAWellness theme={theme} />}
          {raTab === "help" && <RAHelp theme={theme} />}
        </RAShell>
      ) : (
        <AdminShell theme={theme} activeTab={adminTab} onTab={setAdminTab} onLogout={handleLogout}>
          {adminTab === "overview" && <Overview theme={theme} onTab={setAdminTab} />}
          {adminTab === "queue" && <ReportQueue theme={theme} />}
          {adminTab === "residents" && <Residents theme={theme} />}
          {adminTab === "ledger" && <AdminLedger theme={theme} />}
          {adminTab === "wellness" && <WellnessChecks theme={theme} />}
          {adminTab === "analytics" && <Analytics theme={theme} />}
          {adminTab === "exports" && <LegalExports theme={theme} />}
          {adminTab === "audit" && <AuditLog theme={theme} />}
          {adminTab === "admin" && <Administration theme={theme} />}
        </AdminShell>
      )}
    </>
  )
}
