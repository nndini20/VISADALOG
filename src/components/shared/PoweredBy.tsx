interface Props {
  brand?: string
}

export function PoweredBy({ brand = "Visada" }: Props) {
  return (
    <span style={{ fontSize: "0.68rem", color: "#7a8392", letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span style={{ width: "14px", height: "14px", background: "linear-gradient(135deg, #003660 60%, #FEBC11 100%)", borderRadius: "3px", display: "inline-block", flexShrink: 0 }} />
      Securely powered by <strong style={{ color: "#586174" }}>{brand}</strong>
    </span>
  )
}
