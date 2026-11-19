import { X } from "lucide-react"
import type { ReactNode } from "react"

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, children, wide }: Props) {
  if (!open) return null
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", width: wide ? "min(860px, 96vw)" : "min(520px, 96vw)", maxHeight: "90vh", overflow: "auto", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #e1e3e7" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#182033" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#7a8392", padding: "2px", borderRadius: "4px", display: "flex" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "22px", flex: 1 }}>{children}</div>
      </div>
    </div>
  )
}
