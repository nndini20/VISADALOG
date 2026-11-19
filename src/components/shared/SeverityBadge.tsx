import { AlertTriangle, AlertCircle, Info, Minus } from "lucide-react"
import type { Severity } from "../../data"

const config: Record<Severity, { color: string; bg: string; border: string; Icon: React.FC<{ size?: number }> }> = {
  Critical: { color: "#7a2638", bg: "#f7e9ed", border: "#e3c7cf", Icon: AlertCircle },
  High: { color: "#c53d3d", bg: "#fcebea", border: "#efcecc", Icon: AlertTriangle },
  Medium: { color: "#a96612", bg: "#fff4dc", border: "#f0d8a8", Icon: Info },
  Low: { color: "#586174", bg: "#f2f3f5", border: "#e1e3e7", Icon: Minus },
}

interface Props {
  severity: Severity
  size?: "sm" | "md"
}

export function SeverityBadge({ severity, size = "md" }: Props) {
  const { color, bg, border, Icon } = config[severity]
  const padding = size === "sm" ? "2px 7px" : "3px 10px"
  const fontSize = size === "sm" ? "0.7rem" : "0.75rem"
  return (
    <span
      style={{ color, background: bg, border: `1px solid ${border}`, padding, fontSize, fontWeight: 600, borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "inherit", letterSpacing: "0.02em" }}
    >
      <Icon size={size === "sm" ? 10 : 12} />
      {severity}
    </span>
  )
}
