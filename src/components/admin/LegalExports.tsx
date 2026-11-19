import { useState } from "react"
import { Shield, AlertTriangle, Download, Check } from "lucide-react"
import { Modal } from "../shared/Modal"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

export default function LegalExports({ theme }: Props) {
  const [ferpaAck, setFerpaAck] = useState(false)
  const [dateFrom, setDateFrom] = useState("2026-06-01")
  const [dateTo, setDateTo] = useState("2026-07-22")
  const [hall, setHall] = useState("All Halls")
  const [severity, setSeverity] = useState("All")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [exported, setExported] = useState(false)

  function handleExport() {
    setConfirmOpen(false)
    setExported(true)
    setTimeout(() => setExported(false), 5000)
  }

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>Legal Exports</h1>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#586174" }}>FERPA-compliant data export for authorized purposes</p>
      </div>

      {/* Role gate display */}
      <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: "8px", padding: "14px 18px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <Shield size={16} color="#49719c" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: "0.78rem", color: "#49719c" }}>
          <strong>Access granted:</strong> Legal &amp; Compliance Reviewer role required. This export is fully audited. Unauthorized use is a FERPA violation.
        </div>
      </div>

      {/* FERPA acknowledgment */}
      {!ferpaAck ? (
        <div style={{ background: "#fcebea", border: "1px solid #efcecc", borderRadius: "10px", padding: "22px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <AlertTriangle size={20} color="#c53d3d" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: "#c53d3d", fontSize: "0.95rem", marginBottom: "8px" }}>FERPA Disclosure Requirement</div>
              <p style={{ margin: "0 0 10px", fontSize: "0.82rem", color: "#7a2638", lineHeight: 1.65 }}>
                You are about to access student education records protected under the Family Educational Rights and Privacy Act (FERPA). Exported data must be used only for the stated authorized purpose and may not be re-disclosed without appropriate authorization. You are responsible for ensuring secure handling and proper disposal of all exported data.
              </p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#7a2638" }}>
                This action will be recorded in the audit log with your identity, timestamp, and IP address.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFerpaAck(true)}
            style={{ background: theme.primaryColor, color: "#fff", border: "none", borderRadius: "7px", padding: "11px 20px", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            I acknowledge my FERPA obligations — Proceed
          </button>
        </div>
      ) : (
        <div>
          {exported && (
            <div style={{ background: "#eaf5ef", border: "1px solid #bddbc9", borderRadius: "7px", padding: "13px 16px", marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center", color: "#247a52", fontSize: "0.82rem" }}>
              <Check size={15} /> Export generated — EXPORT-2026-0032. Download link sent to your UCSB email. Audit entry logged.
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "10px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: "0.9rem", fontWeight: 700, color: "#182033" }}>Export Scope</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={labelStyle}>Date From</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Date To</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Residence Hall</label>
              <select value={hall} onChange={e => setHall(e.target.value)} style={inputStyle}>
                {["All Halls", "Santa Rosa Hall", "Anacapa Hall", "San Miguel Hall", "San Nicolas Hall"].map(h => <option key={h}>{h}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Minimum Severity</label>
              <select value={severity} onChange={e => setSeverity(e.target.value)} style={inputStyle}>
                {["All", "Critical Only", "High and Above", "Medium and Above"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ background: "#f2f3f5", borderRadius: "6px", padding: "12px 14px", marginBottom: "16px", fontSize: "0.75rem", color: "#586174", lineHeight: 1.6 }}>
              Export will include: incident narratives, AI summaries, severity assessments, hall and location data, RA identifiers, dates and times. Resident identifiers are pseudonymized per UCSB policy unless a legal subpoena has been received.
            </div>

            <button
              onClick={() => setConfirmOpen(true)}
              style={{ background: theme.primaryColor, color: "#fff", border: "none", borderRadius: "7px", padding: "12px 20px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Download size={16} /> Generate Export
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Export Request">
        <div>
          <p style={{ fontSize: "0.85rem", color: "#182033", lineHeight: 1.65, marginBottom: "16px" }}>
            You are requesting a FERPA-protected data export. This action is irreversible and will be permanently recorded in the audit log. Are you sure you want to proceed?
          </p>
          <div style={{ fontSize: "0.78rem", color: "#586174", marginBottom: "18px" }}>
            <strong>Scope:</strong> {hall} · {dateFrom} to {dateTo} · {severity}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleExport} style={{ flex: 1, background: theme.primaryColor, color: "#fff", border: "none", borderRadius: "7px", padding: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem" }}>Confirm &amp; Generate</button>
            <button onClick={() => setConfirmOpen(false)} style={{ flex: 1, background: "#f2f3f5", border: "none", borderRadius: "7px", padding: "11px", cursor: "pointer", fontFamily: "inherit", color: "#586174", fontSize: "0.88rem" }}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#182033", marginBottom: "6px" }
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #e1e3e7", borderRadius: "6px", fontSize: "0.82rem", fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }
