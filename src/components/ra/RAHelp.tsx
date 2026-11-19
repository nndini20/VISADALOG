import { Phone, Mail, ExternalLink, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

const faqs = [
  { q: "What incidents require immediate escalation?", a: "Always call 911 for medical emergencies, fire, or immediate physical danger. Contact your on-call RD immediately for welfare concerns, physical altercations, or any situation where a resident's safety is at risk." },
  { q: "When should I use The Ledger vs. a full report?", a: "Use The Ledger for low-level floor observations that don't rise to the level of a policy violation — a resident seeming withdrawn, an unusual noise that resolved, a general floor concern. Use a full report for any actual policy violation, safety concern, or incident requiring administrative follow-up." },
  { q: "What is FERPA and why does it matter?", a: "FERPA (Family Educational Rights and Privacy Act) protects the privacy of student education records. Any information you document in this system is a student education record. You must not share it outside authorized channels, and access is limited to those with a legitimate educational interest." },
  { q: "What happens after I submit a report?", a: "Your report enters the Residential Life review queue. The relevant RD or ARD reviews it and determines next steps. You may be contacted for follow-up. All actions are logged in the audit trail." },
]

export default function RAHelp({ theme }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: "1.15rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>Help & Support</h2>
      <p style={{ margin: "0 0 20px", fontSize: "0.75rem", color: "#586174" }}>Resources and guidance for Resident Assistants</p>

      {/* Emergency banner */}
      <div style={{ background: "#fcebea", border: "1px solid #efcecc", borderRadius: "8px", padding: "14px 16px", marginBottom: "18px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#c53d3d", marginBottom: "4px" }}>Emergency? Call 911 First.</div>
        <div style={{ fontSize: "0.78rem", color: "#7a2638", lineHeight: 1.5 }}>For any immediate safety threat, medical emergency, or active danger — call 911 immediately. Then notify your on-call RD.</div>
      </div>

      {/* Contact cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "22px" }}>
        {[
          { name: "On-Call Resident Director", contact: "(805) 893-9999", type: "phone", note: "Available 24/7 during the academic year" },
          { name: "RA Support Coordinator", contact: "rasupport@ucsb.edu", type: "email", note: "For non-emergency RA wellbeing concerns" },
          { name: "Campus Support Line", contact: theme.supportPhone, type: "phone", note: theme.supportEmail },
        ].map(({ name, contact, type, note }) => (
          <div key={name} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "8px", padding: "13px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", background: "#edf0f8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {type === "phone" ? <Phone size={16} color={theme.primaryColor} /> : <Mail size={16} color={theme.primaryColor} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#182033" }}>{name}</div>
              <div style={{ fontSize: "0.78rem", color: theme.primaryColor, fontWeight: 500 }}>{contact}</div>
              <div style={{ fontSize: "0.68rem", color: "#7a8392" }}>{note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h3 style={{ margin: "0 0 12px", fontSize: "0.78rem", fontWeight: 600, color: "#586174", textTransform: "uppercase", letterSpacing: "0.06em" }}>Frequently Asked Questions</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "7px", overflow: "hidden" }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#182033", paddingRight: "12px" }}>{faq.q}</span>
              {openFaq === i ? <ChevronUp size={15} color="#586174" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="#586174" style={{ flexShrink: 0 }} />}
            </button>
            {openFaq === i && (
              <div style={{ padding: "0 14px 12px", fontSize: "0.78rem", color: "#586174", lineHeight: 1.65, borderTop: "1px solid #f2f3f5" }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Privacy footer */}
      <div style={{ background: "#f2f3f5", border: "1px solid #e1e3e7", borderRadius: "8px", padding: "14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <Shield size={16} color="#586174" style={{ flexShrink: 0, marginTop: "1px" }} />
        <div style={{ fontSize: "0.72rem", color: "#586174", lineHeight: 1.6 }}>
          All data in this system is protected under FERPA. <a href={theme.ferpaLink} style={{ color: theme.primaryColor }}>Read the full notice <ExternalLink size={10} style={{ display: "inline" }} /></a>
        </div>
      </div>
    </div>
  )
}
