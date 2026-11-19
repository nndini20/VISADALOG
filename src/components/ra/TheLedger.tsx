import { useState } from "react"
import { Plus, BookOpen, Mic, ArrowUpRight } from "lucide-react"
import { ledgerEntries } from "../../data"
import type { LedgerEntry } from "../../data"
import type { InstitutionTheme } from "../../theme"

interface Props {
  theme: InstitutionTheme
  onConvertToReport?: (entry: { location: string; notes: string; hall: string }) => void
}

const tagColors: Record<string, { color: string; bg: string; border: string }> = {
  Positive: { color: "#247a52", bg: "#eaf5ef", border: "#bddbc9" },
  Neutral:  { color: "#586174", bg: "#f2f3f5", border: "#e1e3e7" },
  Concern:  { color: "#a96612", bg: "#fff4dc", border: "#f0d8a8" },
}

export default function TheLedger({ theme, onConvertToReport }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [newTag, setNewTag] = useState<"Positive" | "Neutral" | "Concern">("Neutral")
  const [voiceActive, setVoiceActive] = useState(false)
  const [entries, setEntries] = useState<LedgerEntry[]>(
    ledgerEntries.filter(e => e.raName === "Jordan M.")
  )
  const [convertConfirm, setConvertConfirm] = useState<LedgerEntry | null>(null)

  function triggerVoice() {
    setVoiceActive(true)
    setTimeout(() => {
      setNewNote("Floor walk complete. Two residents in the lounge playing board games — positive community atmosphere. Checked all exits and common areas. No concerns noted. Bulletin board updated with upcoming events.")
      setVoiceActive(false)
    }, 2200)
  }

  function addEntry() {
    if (!newNote.trim()) return
    setEntries(prev => [{
      id: `LED-${Date.now()}`,
      hall: "Santa Rosa Hall",
      floor: "Floor 3",
      raName: "Jordan M.",
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      note: newNote,
      tag: newTag,
    }, ...prev])
    setNewNote("")
    setNewTag("Neutral")
    setShowForm(false)
  }

  function handleConvert(entry: LedgerEntry) {
    if (!onConvertToReport) return
    setConvertConfirm(null)
    onConvertToReport({ location: entry.floor, notes: entry.note, hall: entry.hall })
  }

  return (
    <div style={{ padding: "18px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={17} /> The Ledger
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: "0.73rem", color: "#586174" }}>Floor observations · Santa Rosa Hall, Floor 3</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: theme.primaryColor, color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}
        >
          <Plus size={13} /> Add Entry
        </button>
      </div>

      {/* Add entry form */}
      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, padding: 15, marginBottom: 14 }}>
          <div style={{ fontSize: "0.73rem", fontWeight: 600, color: "#182033", marginBottom: 7 }}>New floor observation</div>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="What did you observe on your floor walk? Keep it brief and factual."
            style={{ width: "100%", height: 80, padding: 10, border: "1px solid #e1e3e7", borderRadius: 6, fontSize: "0.81rem", fontFamily: "inherit", resize: "none", boxSizing: "border-box", marginBottom: 9, outline: "none" }}
          />
          {/* Voice input */}
          <button
            onClick={triggerVoice}
            disabled={voiceActive}
            style={{ width: "100%", background: voiceActive ? "#ebf2f8" : "#f2f3f5", border: `1px solid ${voiceActive ? "#cddfeb" : "#e1e3e7"}`, borderRadius: 6, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, cursor: voiceActive ? "default" : "pointer", fontSize: "0.74rem", color: voiceActive ? "#49719c" : "#586174", fontFamily: "inherit", marginBottom: 9 }}
          >
            <Mic size={13} style={voiceActive ? { animation: "pulse 1s ease-in-out infinite" } : {}} />
            {voiceActive ? "● Transcribing..." : "Use voice instead"}
          </button>
          {/* Tags */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {(["Positive", "Neutral", "Concern"] as const).map(t => (
              <button
                key={t}
                onClick={() => setNewTag(t)}
                style={{ background: newTag === t ? tagColors[t].bg : "#f2f3f5", border: `1px solid ${newTag === t ? tagColors[t].border : "#e1e3e7"}`, color: newTag === t ? tagColors[t].color : "#586174", borderRadius: 5, padding: "5px 10px", fontSize: "0.71rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addEntry} style={{ flex: 1, background: theme.primaryColor, color: "#fff", border: "none", borderRadius: 6, padding: "9px", fontSize: "0.81rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save Entry</button>
            <button onClick={() => { setShowForm(false); setNewNote(""); setNewTag("Neutral") }} style={{ background: "#f2f3f5", border: "none", borderRadius: 6, padding: "9px 14px", fontSize: "0.81rem", cursor: "pointer", fontFamily: "inherit", color: "#586174" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Convert confirmation */}
      {convertConfirm && (
        <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: 8, padding: 13, marginBottom: 13 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#49719c", marginBottom: 6 }}>Convert to Incident Report?</div>
          <p style={{ margin: "0 0 10px", fontSize: "0.72rem", color: "#49719c", lineHeight: 1.5 }}>
            This ledger entry will be pre-filled into a new incident report for review and submission. You can edit all fields before submitting.
          </p>
          <div style={{ display: "flex", gap: 7 }}>
            <button onClick={() => handleConvert(convertConfirm)} style={{ background: "#49719c", color: "#fff", border: "none", borderRadius: 5, padding: "6px 13px", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Yes, convert</button>
            <button onClick={() => setConvertConfirm(null)} style={{ background: "none", border: "1px solid #cddfeb", borderRadius: 5, padding: "6px 11px", fontSize: "0.72rem", color: "#586174", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Entry list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.map(e => {
          const { color, bg, border } = tagColors[e.tag]
          return (
            <div key={e.id} style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, padding: "12px 13px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontSize: "0.67rem", color: "#7a8392" }}>{e.date} · {e.time}</span>
                <span style={{ color, background: bg, border: `1px solid ${border}`, padding: "2px 7px", borderRadius: 4, fontSize: "0.67rem", fontWeight: 600 }}>{e.tag}</span>
              </div>
              <p style={{ margin: "0 0 9px", fontSize: "0.8rem", color: "#182033", lineHeight: 1.6 }}>{e.note}</p>
              {onConvertToReport && e.tag === "Concern" && (
                <button
                  onClick={() => setConvertConfirm(e)}
                  style={{ background: "none", border: "1px solid #cddfeb", borderRadius: 5, padding: "4px 9px", fontSize: "0.68rem", fontWeight: 600, color: "#49719c", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}
                >
                  <ArrowUpRight size={11} /> Convert to Incident Report
                </button>
              )}
            </div>
          )
        })}
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }`}</style>
    </div>
  )
}
