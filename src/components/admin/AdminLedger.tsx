import { ledgerEntries } from "../../data"
import type { InstitutionTheme } from "../../theme"
import { BookOpen } from "lucide-react"

interface Props { theme: InstitutionTheme }

const tagColors: Record<string, { color: string; bg: string; border: string }> = {
  Positive: { color: "#247a52", bg: "#eaf5ef", border: "#bddbc9" },
  Neutral: { color: "#586174", bg: "#f2f3f5", border: "#e1e3e7" },
  Concern: { color: "#a96612", bg: "#fff4dc", border: "#f0d8a8" },
}

export default function AdminLedger({ theme }: Props) {
  const byHall: Record<string, typeof ledgerEntries> = {}
  ledgerEntries.forEach(e => {
    if (!byHall[e.hall]) byHall[e.hall] = []
    byHall[e.hall].push(e)
  })

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif", display: "flex", alignItems: "center", gap: "10px" }}>
          <BookOpen size={20} /> The Ledger
        </h1>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#586174" }}>Floor observation log — all RAs · {ledgerEntries.length} entries</p>
      </div>

      {Object.entries(byHall).map(([hall, entries]) => (
        <div key={hall} style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "0.82rem", fontWeight: 600, color: "#586174", textTransform: "uppercase", letterSpacing: "0.06em" }}>{hall}</h3>
          <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "10px", overflow: "hidden" }}>
            {entries.map((e, i) => {
              const { color, bg, border } = tagColors[e.tag]
              return (
                <div key={e.id} style={{ padding: "13px 14px", borderBottom: i < entries.length - 1 ? "1px solid #f2f3f5" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.65rem", color: "#7a8392" }}>{e.date} · {e.time}</span>
                      <span style={{ fontSize: "0.65rem", color: "#7a8392" }}>{e.floor} · {e.raName}</span>
                    </div>
                    <span style={{ color, background: bg, border: `1px solid ${border}`, padding: "2px 7px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: 600, flexShrink: 0 }}>{e.tag}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#182033", lineHeight: 1.6 }}>{e.note}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
