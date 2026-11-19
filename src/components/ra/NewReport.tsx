import { useState, useEffect, useRef } from "react"
import type { CSSProperties, ChangeEvent } from "react"
import { Mic, Camera, ChevronRight, ChevronLeft, Sparkles, Check, AlertTriangle, WifiOff, RotateCcw, X, Heart, Smile, Activity, LifeBuoy, CloudRain } from "lucide-react"
import { SeverityBadge } from "../shared/SeverityBadge"
import type { InstitutionTheme } from "../../theme"
import type { Severity } from "../../data"

interface Props {
  theme: InstitutionTheme
  onComplete: () => void
  initialDraft?: { location: string; notes: string; hall?: string } | null
}

const DRAFT_KEY = "visada-report-draft"
const steps = ["Location & Type", "Narrative & Evidence", "AI Review", "Confirm Severity", "Review & Submit", "Wellness"]

interface StructuredFields {
  location: string
  timeOfIncident: string
  personsInvolved: string
  actionsTaken: string
  outcome: string
  followUpNeeded: boolean
}

export default function NewReport({ theme, onComplete, initialDraft }: Props) {
  const [step, setStep] = useState(0)
  const [showDraftBanner, setShowDraftBanner] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [isQueued, setIsQueued] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Step 0
  const [hall, setHall] = useState(initialDraft?.hall ?? "")
  const [location, setLocation] = useState(initialDraft?.location ?? "")
  const [category, setCategory] = useState("")
  const [incidentTime, setIncidentTime] = useState("23:14")

  // Step 1
  const [narrative, setNarrative] = useState(initialDraft?.notes ?? "")
  const [voiceActive, setVoiceActive] = useState(false)
  const [photos, setPhotos] = useState<Array<{ name: string; url: string }>>([])
  const photoRef = useRef<HTMLInputElement>(null)

  // Step 2
  const [aiLoading, setAiLoading] = useState(false)
  const [aiDone, setAiDone] = useState(false)
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({})
  const [structured, setStructured] = useState<StructuredFields>({
    location: "", timeOfIncident: "", personsInvolved: "",
    actionsTaken: "", outcome: "", followUpNeeded: false,
  })

  // Step 3
  const [severity, setSeverity] = useState<Severity>("Medium")
  const [overrideReason, setOverrideReason] = useState("")
  const [severityChanged, setSeverityChanged] = useState(false)

  // Step 5
  const [wellnessMood, setWellnessMood] = useState<string | null>(null)
  const [wellnessNote, setWellnessNote] = useState("")

  // Draft recovery on mount
  useEffect(() => {
    if (initialDraft) return
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      try {
        const d = JSON.parse(saved)
        if (d.hall || d.narrative) setShowDraftBanner(true)
      } catch { /* ignore */ }
    }
  }, [initialDraft])

  // Auto-save draft
  useEffect(() => {
    if (submitted || isQueued) return
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ hall, location, category, narrative, incidentTime }))
  }, [hall, location, category, narrative, incidentTime, submitted, isQueued])

  function recoverDraft() {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}")
      if (d.hall) setHall(d.hall)
      if (d.location) setLocation(d.location)
      if (d.category) setCategory(d.category)
      if (d.narrative) setNarrative(d.narrative)
      if (d.incidentTime) setIncidentTime(d.incidentTime)
    } catch { /* ignore */ }
    setShowDraftBanner(false)
  }

  function triggerVoice() {
    setVoiceActive(true)
    setTimeout(() => {
      setNarrative("Responded to a noise complaint on the third floor. Found a gathering of approximately 8 residents in the common lounge area. Observed open containers consistent with alcohol. Residents were cooperative when asked to disperse. No medical intervention required. Documentation completed during shift.")
      setVoiceActive(false)
    }, 2400)
  }

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach(f => {
      setPhotos(prev => [...prev, { name: f.name, url: URL.createObjectURL(f) }])
    })
  }

  function next() {
    if (step === 1 && !aiDone) {
      setAiLoading(true)
      setTimeout(() => {
        setStructured({
          location: location || "Third Floor Common Lounge",
          timeOfIncident: incidentTime,
          personsInvolved: "Approximately 6–8 residents",
          actionsTaken: "Documented the situation and asked residents to comply with community standards",
          outcome: "Residents were cooperative; situation de-escalated without further intervention",
          followUpNeeded: category === "Alcohol-Related Incident" || category === "Medical Concern",
        })
        setAiLoading(false)
        setAiDone(true)
        setStep(2)
      }, 2400)
      return
    }
    if (step < steps.length - 1) setStep(s => s + 1)
  }

  function back() { if (step > 0) setStep(s => s - 1) }

  function handleSubmit() {
    localStorage.removeItem(DRAFT_KEY)
    isOffline ? setIsQueued(true) : setSubmitted(true)
  }

  const canNext =
    step === 0 ? !!(hall && location && category) :
    step === 1 ? narrative.length > 20 :
    step === 5 ? !!wellnessMood : true

  const aiSummary = `A ${category || "noise"} situation was documented at ${structured.location || location || "the hall"} on ${hall || "campus"}. ${structured.personsInvolved ? `${structured.personsInvolved} were involved.` : ""} ${structured.actionsTaken ? `Actions taken: ${structured.actionsTaken}.` : ""} ${structured.outcome ? `Outcome: ${structured.outcome}.` : ""} ${followUpAnswers.notified ? `Staff notification: ${followUpAnswers.notified}.` : ""}`.replace(/\s+/g, " ").trim()

  const followUpQs = narrative.length > 20 ? [
    { id: "notified", q: "Were any RD or staff members notified of this incident?" },
    { id: "medical", q: "Did any residents require or request medical attention?" },
    { id: "ids", q: "Were the involved residents' IDs verified?" },
  ] : []

  // ── Queued / Submitted confirmation screens ────────────────────────────────
  if (isQueued) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center", height: "100%" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff4dc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <WifiOff size={28} color="#a96612" />
      </div>
      <h2 style={{ margin: "0 0 8px", fontFamily: "'Inter:Semi Bold', Inter, sans-serif", color: "#a96612", fontSize: "1.3rem" }}>Report Queued</h2>
      <p style={{ color: "#586174", fontSize: "0.85rem", margin: "0 0 6px", lineHeight: 1.6 }}>
        Reference <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontWeight: 600 }}>RPT-2026-0892</span> is saved locally and will be submitted automatically when connectivity is restored.
      </p>
      <p style={{ color: "#7a8392", fontSize: "0.78rem", margin: "0 0 24px" }}>Queued reports are encrypted on-device.</p>
      <button onClick={onComplete} style={submitBtnStyle(theme)}>Back to Home</button>
    </div>
  )

  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center", height: "100%" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#eaf5ef", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Check size={28} color="#247a52" />
      </div>
      <h2 style={{ margin: "0 0 8px", fontFamily: "'Inter:Semi Bold', Inter, sans-serif", color: theme.primaryColor, fontSize: "1.3rem" }}>Report Submitted</h2>
      <p style={{ color: "#586174", fontSize: "0.85rem", margin: "0 0 4px", lineHeight: 1.6 }}>
        Report <span style={{ fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', monospace", fontWeight: 600 }}>RPT-2026-0892</span> is in the administrator review queue.
      </p>
      <p style={{ color: "#7a8392", fontSize: "0.75rem", margin: "0 0 24px" }}>Audit record created · encrypted in transit</p>
      <button onClick={onComplete} style={submitBtnStyle(theme)}>Back to Home</button>
    </div>
  )

  // ── Main wizard ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Offline banner */}
      {isOffline && (
        <div style={{ background: "#fff4dc", borderBottom: "1px solid #f0d8a8", padding: "7px 14px", display: "flex", alignItems: "center", gap: 7 }}>
          <WifiOff size={12} color="#a96612" />
          <span style={{ fontSize: "0.7rem", color: "#a96612", flex: 1 }}>Offline — report will be queued when you submit</span>
          <button onClick={() => setIsOffline(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#a96612", fontSize: "0.7rem", fontWeight: 700, padding: 0, fontFamily: "inherit" }}>Reconnect</button>
        </div>
      )}

      {/* Draft recovery banner */}
      {showDraftBanner && (
        <div style={{ background: "#ebf2f8", borderBottom: "1px solid #cddfeb", padding: "12px 14px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#49719c", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}>
            <RotateCcw size={12} /> Unsaved Draft Found
          </div>
          <p style={{ margin: "0 0 8px", fontSize: "0.71rem", color: "#49719c", lineHeight: 1.5 }}>You have an unfinished report from a previous session.</p>
          <div style={{ display: "flex", gap: 7 }}>
            <button onClick={recoverDraft} style={{ background: "#49719c", color: "#fff", border: "none", borderRadius: 4, padding: "5px 12px", fontSize: "0.71rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Recover Draft</button>
            <button onClick={() => { localStorage.removeItem(DRAFT_KEY); setShowDraftBanner(false) }} style={{ background: "none", border: "1px solid #cddfeb", borderRadius: 4, padding: "5px 12px", fontSize: "0.71rem", color: "#586174", cursor: "pointer", fontFamily: "inherit" }}>Start Fresh</button>
          </div>
        </div>
      )}

      {/* Progress bar + header */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, background: i <= step ? theme.primaryColor : "#e1e3e7", borderRadius: 2, transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "0.67rem", color: "#7a8392", fontWeight: 500, marginBottom: 2 }}>Step {step + 1} of {steps.length}</div>
            <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: theme.primaryColor }}>{steps[step]}</h3>
          </div>
          <button
            onClick={() => setIsOffline(o => !o)}
            style={{ background: isOffline ? "#fff4dc" : "#f2f3f5", border: `1px solid ${isOffline ? "#f0d8a8" : "#e1e3e7"}`, borderRadius: 5, padding: "3px 7px", fontSize: "0.62rem", fontWeight: 600, color: isOffline ? "#a96612" : "#7a8392", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontFamily: "inherit" }}
          >
            <WifiOff size={9} /> {isOffline ? "Offline" : "Test offline"}
          </button>
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>

        {/* ── Step 0: Location & Type ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {initialDraft && (
              <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: 6, padding: "9px 12px", fontSize: "0.72rem", color: "#49719c", display: "flex", gap: 6, alignItems: "center" }}>
                <RotateCcw size={11} /> Pre-filled from ledger entry — complete remaining fields
              </div>
            )}
            <div>
              <label style={lbl}>Residence Hall</label>
              <select value={hall} onChange={e => setHall(e.target.value)} style={sel}>
                <option value="">Select hall...</option>
                {theme.residenceHalls.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Specific Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Third Floor Lounge, Room 312" style={inp} />
            </div>
            <div>
              <label style={lbl}>Incident Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={sel}>
                <option value="">Select category...</option>
                {theme.reportCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Approximate Time</label>
              <input type="time" value={incidentTime} onChange={e => setIncidentTime(e.target.value)} style={inp} />
            </div>
          </div>
        )}

        {/* ── Step 1: Narrative & Evidence ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={lbl}>Describe what happened</label>
              <textarea
                value={narrative}
                onChange={e => setNarrative(e.target.value)}
                placeholder="Describe the incident in your own words — who was involved, what you observed, what actions you took, and any immediate outcomes."
                style={{ ...inp, height: 148, resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={triggerVoice}
                  disabled={voiceActive}
                  style={{ flex: 1, background: voiceActive ? "#ebf2f8" : "#fff", border: `1px solid ${voiceActive ? "#cddfeb" : "#e1e3e7"}`, borderRadius: 6, padding: "9px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, cursor: voiceActive ? "default" : "pointer", fontSize: "0.75rem", color: voiceActive ? "#49719c" : theme.primaryColor, fontFamily: "inherit", fontWeight: 500 }}
                >
                  <Mic size={14} style={voiceActive ? { animation: "pulse 1s ease-in-out infinite" } : {}} />
                  {voiceActive ? "● Transcribing..." : "Voice input"}
                </button>
              </div>
            </div>

            {/* Photo capture */}
            <div>
              <label style={lbl}>Photos <span style={{ color: "#7a8392", fontWeight: 400 }}>(optional)</span></label>
              <div
                onClick={() => photoRef.current?.click()}
                style={{ border: "1.5px dashed #cdd1d8", borderRadius: 8, padding: "18px 16px", textAlign: "center", cursor: "pointer", background: "#f2f3f5" }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = theme.primaryColor }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#cdd1d8" }}
              >
                <Camera size={18} style={{ color: "#7a8392", marginBottom: 5 }} />
                <div style={{ fontSize: "0.75rem", color: "#586174" }}>Tap to capture or upload a photo</div>
                <div style={{ fontSize: "0.64rem", color: "#7a8392", marginTop: 2 }}>JPEG · PNG · HEIC — encrypted in transit</div>
              </div>
              <input ref={photoRef} type="file" accept="image/*" capture="environment" multiple onChange={handlePhoto} style={{ display: "none" }} />
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 8 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: 6, overflow: "hidden", aspectRatio: "1", background: "#e1e3e7" }}>
                      <img src={p.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                        style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                      >
                        <X size={10} color="#fff" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 2: AI Review ── */}
        {step === 2 && (
          <div>
            {aiLoading ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${theme.primaryColor}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
                <div style={{ fontSize: "0.88rem", color: theme.primaryColor, fontWeight: 600 }}>Generating AI summary...</div>
                <div style={{ fontSize: "0.75rem", color: "#586174", marginTop: 4 }}>Structuring your report with AI assistance</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {/* Side-by-side: raw vs structured */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Left: raw narrative */}
                  <div style={{ background: "#f2f3f5", border: "1px solid #e1e3e7", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#7a8392", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Your narrative</div>
                    <p style={{ margin: 0, fontSize: "0.73rem", color: "#586174", lineHeight: 1.65 }}>{narrative}</p>
                    {photos.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: "0.62rem", color: "#7a8392", display: "flex", alignItems: "center", gap: 4 }}>
                        <Camera size={9} /> {photos.length} photo{photos.length > 1 ? "s" : ""} attached
                      </div>
                    )}
                  </div>
                  {/* Right: editable structured fields */}
                  <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#49719c", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <Sparkles size={10} /> AI-Structured
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {([
                        ["location", "Location"],
                        ["timeOfIncident", "Time"],
                        ["personsInvolved", "Persons involved"],
                        ["actionsTaken", "Actions taken"],
                        ["outcome", "Outcome"],
                      ] as [keyof StructuredFields, string][]).map(([key, label]) => (
                        <div key={key}>
                          <div style={{ fontSize: "0.58rem", fontWeight: 600, color: "#586174", marginBottom: 2 }}>{label}</div>
                          <input
                            value={structured[key] as string}
                            onChange={e => setStructured(prev => ({ ...prev, [key]: e.target.value }))}
                            style={{ width: "100%", padding: "4px 7px", border: "1px solid #cddfeb", borderRadius: 4, fontSize: "0.7rem", fontFamily: "inherit", background: "#fff", boxSizing: "border-box", color: "#182033" }}
                          />
                        </div>
                      ))}
                      <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.68rem", color: "#182033", cursor: "pointer", marginTop: 2 }}>
                        <input
                          type="checkbox"
                          checked={structured.followUpNeeded}
                          onChange={e => setStructured(prev => ({ ...prev, followUpNeeded: e.target.checked }))}
                        />
                        Flag for follow-up
                      </label>
                    </div>
                  </div>
                </div>

                {/* AI follow-up questions */}
                {followUpQs.length > 0 && (
                  <div style={{ background: "#fff4dc", border: "1px solid #f0d8a8", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a96612", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                      <AlertTriangle size={12} /> A few more details will strengthen this report
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {followUpQs.map(fq => (
                        <div key={fq.id}>
                          <div style={{ fontSize: "0.71rem", color: "#a96612", marginBottom: 4 }}>{fq.q}</div>
                          <input
                            value={followUpAnswers[fq.id] ?? ""}
                            onChange={e => setFollowUpAnswers(prev => ({ ...prev, [fq.id]: e.target.value }))}
                            placeholder="Optional — your answer..."
                            style={{ width: "100%", padding: "6px 9px", border: "1px solid #f0d8a8", borderRadius: 5, fontSize: "0.73rem", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Confirm Severity ── */}
        {step === 3 && (
          <div>
            <div style={{ background: "#fff4dc", border: "1px solid #f0d8a8", borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", color: "#a96612", fontSize: "0.76rem", fontWeight: 600, marginBottom: 6 }}>
                <AlertTriangle size={12} /> AI suggests:&nbsp;<SeverityBadge severity="Medium" size="sm" />
              </div>
              <p style={{ margin: 0, fontSize: "0.73rem", color: "#a96612", lineHeight: 1.55 }}>
                Review and confirm this assessment. Your judgment as the on-scene RA is authoritative and takes precedence over the AI suggestion.
              </p>
            </div>
            <label style={lbl}>Confirm or override severity</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(["Critical", "High", "Medium", "Low"] as Severity[]).map(s => (
                <button
                  key={s}
                  onClick={() => { setSeverity(s); setSeverityChanged(s !== "Medium") }}
                  style={{ background: severity === s ? "#edf0f8" : "#fff", border: `1.5px solid ${severity === s ? theme.primaryColor : "#e1e3e7"}`, borderRadius: 7, padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit" }}
                >
                  <SeverityBadge severity={s} />
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    {s === "Medium" && <span style={{ fontSize: "0.6rem", color: "#49719c", background: "#ebf2f8", padding: "2px 5px", borderRadius: 3, fontWeight: 600 }}>AI suggestion</span>}
                    {severity === s && <Check size={15} color={theme.primaryColor} />}
                  </div>
                </button>
              ))}
            </div>
            {severityChanged && (
              <div style={{ marginTop: 12, background: "#eaf5ef", border: "1px solid #bddbc9", borderRadius: 7, padding: "10px 12px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#247a52", marginBottom: 5 }}>Override reason <span style={{ color: "#7a8392", fontWeight: 400 }}>(optional but recommended)</span></div>
                <input
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  placeholder="Brief reason for overriding the AI suggestion..."
                  style={{ ...inp, fontSize: "0.78rem", padding: "7px 10px", borderColor: "#bddbc9" }}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Review & Submit ── */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: 8, overflow: "hidden" }}>
              {([
                { label: "Report ID", value: "RPT-2026-0892 (pending)", mono: true },
                { label: "Hall & Location", value: `${hall || "Santa Rosa Hall"} · ${location || "Third Floor Lounge"}` },
                { label: "Category", value: category || "Alcohol-Related Incident" },
                { label: "Severity", value: <SeverityBadge severity={severity} size="sm" /> },
                { label: "Date & Time", value: `2026-07-22 · ${incidentTime}` },
                { label: "Reported by", value: "Jordan M. (RA-014)" },
                ...(photos.length > 0 ? [{ label: "Attachments", value: `${photos.length} photo${photos.length > 1 ? "s" : ""}` }] : []),
              ] as { label: string; value: unknown; mono?: boolean }[]).map(({ label, value, mono }, i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < arr.length - 1 ? "1px solid #f2f3f5" : "none" }}>
                  <span style={{ fontSize: "0.73rem", color: "#586174" }}>{label}</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 500, fontFamily: mono ? "Menlo, Monaco, Consolas, 'Liberation Mono', monospace" : "inherit", color: "#182033" }}>{value as string}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#ebf2f8", border: "1px solid #cddfeb", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#49719c", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={10} /> AI-Generated Summary
              </div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#182033", lineHeight: 1.65 }}>{aiSummary || "Complete the AI review step to generate a summary."}</p>
            </div>

            {isOffline && (
              <div style={{ background: "#fff4dc", border: "1px solid #f0d8a8", borderRadius: 7, padding: "10px 12px", display: "flex", gap: 7, alignItems: "center" }}>
                <WifiOff size={13} color="#a96612" />
                <span style={{ fontSize: "0.72rem", color: "#a96612" }}>Offline — this report will be queued for submission</span>
              </div>
            )}

            <div style={{ fontSize: "0.69rem", color: "#7a8392", textAlign: "center" }}>
              Submitting creates an immutable FERPA-compliant audit record.
            </div>
          </div>
        )}

        {/* ── Step 5: Wellness ── */}
        {step === 5 && (
          <div>
            <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
              <Heart size={28} color="#65549b" fill="#f1eef8" style={{ marginBottom: 8 }} />
              <h3 style={{ margin: "0 0 6px", fontFamily: "'Inter:Semi Bold', Inter, sans-serif", color: theme.primaryColor, fontSize: "1.1rem" }}>How are you doing?</h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#586174", lineHeight: 1.6 }}>This check-in is confidential and not part of the incident report.</p>
            </div>
            <label style={lbl}>How are you feeling right now?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "I'm doing well", Icon: Smile, color: "#247a52" },
                { label: "A bit stressed", Icon: Activity, color: "#a96612" },
                { label: "Need support", Icon: LifeBuoy, color: "#c53d3d" },
                { label: "It was tough", Icon: CloudRain, color: "#65549b" },
              ].map(({ label, Icon, color }) => (
                <button
                  key={label}
                  onClick={() => setWellnessMood(label)}
                  style={{ background: wellnessMood === label ? "#edf0f8" : "#fff", border: `1.5px solid ${wellnessMood === label ? theme.primaryColor : "#e1e3e7"}`, borderRadius: 7, padding: "12px 10px", fontSize: "0.76rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: wellnessMood === label ? theme.primaryColor : "#586174", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
                >
                  <Icon size={22} strokeWidth={1.8} color={wellnessMood === label ? theme.primaryColor : color} />
                  {label}
                </button>
              ))}
            </div>
            <label style={lbl}>Anything to share? <span style={{ color: "#7a8392", fontWeight: 400 }}>(optional)</span></label>
            <textarea value={wellnessNote} onChange={e => setWellnessNote(e.target.value)} placeholder="Anything you'd like your RA Support Coordinator to know..." style={{ ...inp, height: 80, resize: "none" }} />
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ padding: "11px 16px", background: "#fff", borderTop: "1px solid #e1e3e7", display: "flex", gap: 9 }}>
        {step > 0 && (
          <button onClick={back} style={{ background: "#f2f3f5", border: "none", borderRadius: 7, padding: "11px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#586174", fontFamily: "inherit", fontWeight: 500, fontSize: "0.85rem" }}>
            <ChevronLeft size={15} /> Back
          </button>
        )}
        <button
          onClick={() => { if (step === steps.length - 1) handleSubmit(); else next() }}
          disabled={!canNext}
          style={{ flex: 1, background: canNext ? (isOffline && step === 4 ? "#a96612" : theme.primaryColor) : "#e1e3e7", color: canNext ? "#fff" : "#7a8392", border: "none", borderRadius: 7, padding: "11px 16px", fontSize: "0.88rem", fontWeight: 600, cursor: canNext ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}
        >
          {step === steps.length - 1 ? "Complete Check-In" :
           step === 1 ? "Generate AI Summary" :
           isOffline && step === 4 ? "Queue for Submission" :
           step === 4 ? "Submit Report" : "Continue"}
          {step < steps.length - 1 && step !== 4 && <ChevronRight size={15} />}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
      `}</style>
    </div>
  )
}

function submitBtnStyle(theme: InstitutionTheme): CSSProperties {
  return { background: theme.primaryColor, color: "#fff", border: "none", borderRadius: 7, padding: "12px 28px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem" }
}

const lbl: CSSProperties = { display: "block", fontSize: "0.73rem", fontWeight: 600, color: "#182033", marginBottom: 5 }
const inp: CSSProperties = { width: "100%", padding: "9px 11px", border: "1px solid #e1e3e7", borderRadius: 6, fontSize: "0.85rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", color: "#182033" }
const sel: CSSProperties = { ...inp, background: "#fff", cursor: "pointer" }
