import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { weeklyReportData, hallReportData, categoryData } from "../../data"
import type { InstitutionTheme } from "../../theme"

interface Props { theme: InstitutionTheme }

const SEVERITY_COLORS = { Critical: "#7a2638", High: "#c53d3d", Medium: "#a96612", Low: "#7a8392" }
const CATEGORY_COLORS = ["#003660", "#49719c", "#0891b2", "#a96612", "#c53d3d", "#247a52"]

export default function Analytics({ theme }: Props) {
  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: "0 0 3px", fontSize: "1.2rem", fontWeight: 700, color: theme.primaryColor, fontFamily: "'Inter:Semi Bold', Inter, sans-serif" }}>Analytics</h1>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#586174" }}>Trend data · June–July 2026</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Weekly by severity */}
        <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Reports by Severity — Weekly</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyReportData} barSize={14}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#7a8392" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#7a8392" }} axisLine={false} tickLine={false} width={20} />
              <Tooltip contentStyle={{ fontSize: "0.75rem", borderRadius: "6px" }} />
              <Legend wrapperStyle={{ fontSize: "0.72rem", paddingTop: "8px" }} />
              {(["Critical", "High", "Medium", "Low"] as const).map(s => (
                <Bar key={s} dataKey={s} stackId="a" fill={SEVERITY_COLORS[s]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reports by hall */}
        <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Reports by Hall</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hallReportData} layout="vertical" barSize={14}>
              <XAxis type="number" tick={{ fontSize: 11, fill: "#7a8392" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="hall" tick={{ fontSize: 11, fill: "#586174" }} axisLine={false} tickLine={false} width={72} />
              <Tooltip contentStyle={{ fontSize: "0.75rem", borderRadius: "6px" }} />
              <Bar dataKey="reports" fill={theme.primaryColor} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Incident Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} paddingAngle={2}>
                {categoryData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "0.75rem", borderRadius: "6px" }} />
              <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly trend line */}
        <div style={{ background: "#fff", border: "1px solid #e1e3e7", borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "0.88rem", fontWeight: 700, color: "#182033" }}>Total Weekly Reports — Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyReportData.map(d => ({ week: d.week, total: d.Critical + d.High + d.Medium + d.Low }))}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#7a8392" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#7a8392" }} axisLine={false} tickLine={false} width={20} />
              <Tooltip contentStyle={{ fontSize: "0.75rem", borderRadius: "6px" }} />
              <Line type="monotone" dataKey="total" stroke={theme.primaryColor} strokeWidth={2} dot={{ fill: theme.primaryColor, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
