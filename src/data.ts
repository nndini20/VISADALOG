export type Severity = "Critical" | "High" | "Medium" | "Low"
export type ReportStatus = "New" | "Under Review" | "Resolved" | "Escalated"

export interface Report {
  id: string
  residentId: string
  residentDisplay: string
  hall: string
  location: string
  category: string
  severity: Severity
  status: ReportStatus
  raName: string
  raId: string
  date: string
  time: string
  narrative: string
  aiSummary: string
  aiSeveritySuggestion: Severity
  confirmedBySeverity: Severity
  wellnessChecked: boolean
}

export interface LedgerEntry {
  id: string
  hall: string
  floor: string
  raName: string
  date: string
  time: string
  note: string
  tag: "Positive" | "Neutral" | "Concern"
}

export interface Resident {
  id: string
  display: string
  hall: string
  room: string
  reportCount: number
  lastIncident: string
  wellnessFlag: boolean
}

export interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  role: string
  action: string
  target: string
  ipAddress: string
}

export interface WellnessFlag {
  residentId: string
  residentDisplay: string
  hall: string
  reportCount: number
  lastIncident: string
  flagReason: string
  checkedIn: boolean
  checkedInBy?: string
  checkedInAt?: string
}

export const residents: Resident[] = [
  { id: "R-1042", display: "Resident #1042", hall: "Santa Rosa Hall", room: "312", reportCount: 4, lastIncident: "2026-07-18", wellnessFlag: true },
  { id: "R-2087", display: "Resident #2087", hall: "Anacapa Hall", room: "205", reportCount: 2, lastIncident: "2026-07-20", wellnessFlag: false },
  { id: "R-3301", display: "Resident #3301", hall: "San Miguel Hall", room: "118", reportCount: 3, lastIncident: "2026-07-15", wellnessFlag: true },
  { id: "R-4450", display: "Resident #4450", hall: "Santa Rosa Hall", room: "407", reportCount: 1, lastIncident: "2026-07-21", wellnessFlag: false },
  { id: "R-5512", display: "Resident #5512", hall: "Anacapa Hall", room: "310", reportCount: 1, lastIncident: "2026-07-19", wellnessFlag: false },
  { id: "R-6670", display: "Resident #6670", hall: "San Nicolas Hall", room: "222", reportCount: 2, lastIncident: "2026-07-17", wellnessFlag: false },
]

export const reports: Report[] = [
  {
    id: "RPT-2026-0891",
    residentId: "R-1042",
    residentDisplay: "Resident #1042",
    hall: "Santa Rosa Hall",
    location: "Third Floor Lounge",
    category: "Alcohol-Related Incident",
    severity: "High",
    status: "Under Review",
    raName: "Jordan M.",
    raId: "RA-014",
    date: "2026-07-22",
    time: "23:14",
    narrative: "Responded to a noise complaint on the third floor. Found a gathering of approximately 8 residents. Observed open containers consistent with alcohol in a common area. Residents were cooperative. No medical intervention required. Documentation completed per protocol.",
    aiSummary: "An alcohol-related gathering was observed in the Santa Rosa third-floor lounge involving approximately 8 residents. Open containers were visible. The situation was de-escalated without medical involvement. The reporting RA documented the incident within the same shift.",
    aiSeveritySuggestion: "High",
    confirmedBySeverity: "High",
    wellnessChecked: true,
  },
  {
    id: "RPT-2026-0890",
    residentId: "R-3301",
    residentDisplay: "Resident #3301",
    hall: "San Miguel Hall",
    location: "Room 118",
    category: "Welfare Concern",
    severity: "Critical",
    status: "Escalated",
    raName: "Alex T.",
    raId: "RA-009",
    date: "2026-07-21",
    time: "02:31",
    narrative: "Resident appeared distressed during a routine floor check. Expressed feelings of hopelessness and had not attended classes in several days. Contacted on-call Resident Director immediately. CAPS referral initiated. Room door was not locked and resident agreed to speak with RD.",
    aiSummary: "A welfare check revealed a resident expressing significant emotional distress, including hopelessness and social withdrawal. On-call RD was notified and CAPS referral was initiated during the same night. The resident was cooperative and agreed to meet with professional staff.",
    aiSeveritySuggestion: "Critical",
    confirmedBySeverity: "Critical",
    wellnessChecked: true,
  },
  {
    id: "RPT-2026-0889",
    residentId: "R-2087",
    residentDisplay: "Resident #2087",
    hall: "Anacapa Hall",
    location: "East Courtyard",
    category: "Noise Concern",
    severity: "Low",
    status: "Resolved",
    raName: "Sam L.",
    raId: "RA-021",
    date: "2026-07-21",
    time: "22:50",
    narrative: "Noise complaint received from neighboring room. Knocked on door, resident was playing music at high volume. Resident immediately turned it down and apologized. No further issues during shift.",
    aiSummary: "Noise complaint resolved after a brief conversation with the resident. Immediate compliance observed. No escalation required.",
    aiSeveritySuggestion: "Low",
    confirmedBySeverity: "Low",
    wellnessChecked: false,
  },
  {
    id: "RPT-2026-0888",
    residentId: "R-4450",
    residentDisplay: "Resident #4450",
    hall: "Santa Rosa Hall",
    location: "Building 4 Third Floor",
    category: "Property Damage",
    severity: "Medium",
    status: "New",
    raName: "Jordan M.",
    raId: "RA-014",
    date: "2026-07-21",
    time: "18:05",
    narrative: "Discovered a broken window on the third-floor study room door. Cause unclear. Facilities notified. Area secured with caution tape. No injuries reported. Will follow up with residents on that floor.",
    aiSummary: "Property damage noted on a study room door window. Facilities has been notified and the area is secured. Cause is undetermined. No injuries involved.",
    aiSeveritySuggestion: "Medium",
    confirmedBySeverity: "Medium",
    wellnessChecked: false,
  },
  {
    id: "RPT-2026-0887",
    residentId: "R-6670",
    residentDisplay: "Resident #6670",
    hall: "San Nicolas Hall",
    location: "Room 222",
    category: "Resident Conflict",
    severity: "Medium",
    status: "Under Review",
    raName: "Casey P.",
    raId: "RA-033",
    date: "2026-07-20",
    time: "20:12",
    narrative: "Two roommates reported an ongoing conflict about cleanliness and shared space. Both parties were interviewed separately. Mediation session scheduled with the ARD for next week. No physical confrontation occurred.",
    aiSummary: "Roommate conflict over shared space and cleanliness habits. Both residents engaged with the RA constructively. Formal mediation scheduled. No physical altercation.",
    aiSeveritySuggestion: "Medium",
    confirmedBySeverity: "Medium",
    wellnessChecked: false,
  },
  {
    id: "RPT-2026-0886",
    residentId: "R-5512",
    residentDisplay: "Resident #5512",
    hall: "Anacapa Hall",
    location: "Community Lounge",
    category: "Medical Concern",
    severity: "High",
    status: "Resolved",
    raName: "Alex T.",
    raId: "RA-009",
    date: "2026-07-19",
    time: "01:45",
    narrative: "Resident was found unresponsive in the community lounge. 911 was called immediately. EMS arrived within 6 minutes. Resident was conscious and alert upon EMS arrival. Family was notified by RD. Resident transported to Cottage Hospital for observation.",
    aiSummary: "Medical emergency involving an unresponsive resident in the community lounge. EMS was called and arrived promptly. Resident regained responsiveness. Family was notified and the resident was transported for evaluation.",
    aiSeveritySuggestion: "Critical",
    confirmedBySeverity: "High",
    wellnessChecked: true,
  },
  {
    id: "RPT-2026-0885",
    residentId: "R-1042",
    residentDisplay: "Resident #1042",
    hall: "Santa Rosa Hall",
    location: "Room 312",
    category: "Community Policy Concern",
    severity: "Low",
    status: "Resolved",
    raName: "Jordan M.",
    raId: "RA-014",
    date: "2026-07-18",
    time: "14:20",
    narrative: "Resident had an unauthorized guest who had been staying for more than three days. Resident was reminded of the guest policy. Guest departed the same day. Policy reminder form issued.",
    aiSummary: "Unauthorized long-term guest situation addressed. Resident acknowledged the policy and the guest departed voluntarily. Policy reminder issued.",
    aiSeveritySuggestion: "Low",
    confirmedBySeverity: "Low",
    wellnessChecked: false,
  },
  {
    id: "RPT-2026-0884",
    residentId: "R-3301",
    residentDisplay: "Resident #3301",
    hall: "San Miguel Hall",
    location: "Residence Hall A, Floor 2",
    category: "Noise Concern",
    severity: "Low",
    status: "Resolved",
    raName: "Sam L.",
    raId: "RA-021",
    date: "2026-07-17",
    time: "23:55",
    narrative: "Noise complaint from Room 118 neighbor. Music and raised voices. Knocked, residents complied immediately. Reminded of quiet hours policy.",
    aiSummary: "Brief noise complaint resolved with a single door knock. Residents complied and quiet hours were maintained for the remainder of the shift.",
    aiSeveritySuggestion: "Low",
    confirmedBySeverity: "Low",
    wellnessChecked: false,
  },
]

export const ledgerEntries: LedgerEntry[] = [
  { id: "LED-001", hall: "Santa Rosa Hall", floor: "Floor 3", raName: "Jordan M.", date: "2026-07-22", time: "22:00", note: "Floor was calm. One resident asked about laundry machine availability. Checked all common areas — no concerns.", tag: "Positive" },
  { id: "LED-002", hall: "Anacapa Hall", floor: "Floor 2", raName: "Alex T.", date: "2026-07-22", time: "21:45", note: "Group of students studying in the lounge. Positive energy. One resident mentioned feeling homesick — noted for follow-up.", tag: "Neutral" },
  { id: "LED-003", hall: "San Miguel Hall", floor: "Floor 1", raName: "Sam L.", date: "2026-07-22", time: "20:30", note: "Noticed R-3301 had not left their room all day per neighbor's comment. Will check in tomorrow morning.", tag: "Concern" },
  { id: "LED-004", hall: "Santa Rosa Hall", floor: "Floor 4", raName: "Jordan M.", date: "2026-07-21", time: "23:00", note: "Quiet floor. Community bulletin board updated with wellness resources. Residents engaged positively.", tag: "Positive" },
  { id: "LED-005", hall: "Anacapa Hall", floor: "Floor 3", raName: "Casey P.", date: "2026-07-21", time: "22:15", note: "Noticed the common bathroom had a clogged drain. Submitted a facilities request. Advised floor residents.", tag: "Neutral" },
  { id: "LED-006", hall: "San Nicolas Hall", floor: "Floor 2", raName: "Casey P.", date: "2026-07-20", time: "21:00", note: "Shift was uneventful. Residents checked in after a campus event. All in good spirits.", tag: "Positive" },
  { id: "LED-007", hall: "Santa Rosa Hall", floor: "Floor 3", raName: "Jordan M.", date: "2026-07-20", time: "00:10", note: "Heard brief raised voices from Room 308 around midnight. Knocked — situation diffused. Not incident-level.", tag: "Neutral" },
]

export const wellnessFlags: WellnessFlag[] = [
  {
    residentId: "R-1042",
    residentDisplay: "Resident #1042",
    hall: "Santa Rosa Hall",
    reportCount: 4,
    lastIncident: "2026-07-22",
    flagReason: "4 incidents in 30 days — automatic threshold exceeded",
    checkedIn: false,
  },
  {
    residentId: "R-3301",
    residentDisplay: "Resident #3301",
    hall: "San Miguel Hall",
    reportCount: 3,
    lastIncident: "2026-07-21",
    flagReason: "Welfare Concern escalated — CAPS referral active",
    checkedIn: true,
    checkedInBy: "Dr. Rivera, ARD",
    checkedInAt: "2026-07-22 09:15",
  },
]

export const auditLog: AuditEntry[] = [
  { id: "AUD-9901", timestamp: "2026-07-22T23:47:02Z", actor: "Jordan M.", role: "Resident Assistant", action: "REPORT_SUBMITTED", target: "RPT-2026-0891", ipAddress: "172.16.4.12" },
  { id: "AUD-9900", timestamp: "2026-07-22T09:33:15Z", actor: "Dr. Rivera", role: "Resident Director", action: "REPORT_VIEWED", target: "RPT-2026-0890", ipAddress: "10.0.1.55" },
  { id: "AUD-9899", timestamp: "2026-07-22T09:30:44Z", actor: "Dr. Rivera", role: "Resident Director", action: "WELLNESS_CHECK_CLEARED", target: "R-3301", ipAddress: "10.0.1.55" },
  { id: "AUD-9898", timestamp: "2026-07-21T14:10:00Z", actor: "M. Chen", role: "Legal & Compliance Reviewer", action: "EXPORT_REQUESTED", target: "EXPORT-2026-0031", ipAddress: "10.0.2.88" },
  { id: "AUD-9897", timestamp: "2026-07-21T02:45:11Z", actor: "Alex T.", role: "Resident Assistant", action: "REPORT_SUBMITTED", target: "RPT-2026-0890", ipAddress: "172.16.4.19" },
  { id: "AUD-9896", timestamp: "2026-07-21T02:31:03Z", actor: "Alex T.", role: "Resident Assistant", action: "LOGIN", target: "SESSION", ipAddress: "172.16.4.19" },
  { id: "AUD-9895", timestamp: "2026-07-20T20:30:00Z", actor: "Casey P.", role: "Resident Assistant", action: "REPORT_SUBMITTED", target: "RPT-2026-0887", ipAddress: "172.16.4.33" },
  { id: "AUD-9894", timestamp: "2026-07-20T08:15:22Z", actor: "Admin Console", role: "UCSB System Administrator", action: "ROLE_UPDATED", target: "RA-033", ipAddress: "10.0.0.10" },
  { id: "AUD-9893", timestamp: "2026-07-19T01:52:01Z", actor: "Alex T.", role: "Resident Assistant", action: "REPORT_SUBMITTED", target: "RPT-2026-0886", ipAddress: "172.16.4.19" },
  { id: "AUD-9892", timestamp: "2026-07-18T09:00:00Z", actor: "Dr. Nguyen", role: "Residential Life Director", action: "EXPORT_APPROVED", target: "EXPORT-2026-0030", ipAddress: "10.0.1.10" },
]

// Analytics data for recharts
export const weeklyReportData = [
  { week: "Jun 23", Critical: 0, High: 1, Medium: 2, Low: 3 },
  { week: "Jun 30", Critical: 1, High: 0, Medium: 3, Low: 2 },
  { week: "Jul 7", Critical: 0, High: 2, Medium: 1, Low: 4 },
  { week: "Jul 14", Critical: 0, High: 1, Medium: 2, Low: 3 },
  { week: "Jul 21", Critical: 1, High: 2, Medium: 2, Low: 2 },
]

export const hallReportData = [
  { hall: "Santa Rosa", reports: 4 },
  { hall: "Anacapa", reports: 3 },
  { hall: "San Miguel", reports: 2 },
  { hall: "San Nicolas", reports: 1 },
  { hall: "Manzanita", reports: 1 },
]

export const categoryData = [
  { name: "Noise Concern", value: 3 },
  { name: "Alcohol-Related", value: 2 },
  { name: "Welfare Concern", value: 2 },
  { name: "Resident Conflict", value: 1 },
  { name: "Property Damage", value: 1 },
  { name: "Medical Concern", value: 1 },
]

export const residentHistoryData: Record<string, Array<{ month: string; reports: number }>> = {
  "R-1042": [
    { month: "Apr", reports: 0 },
    { month: "May", reports: 1 },
    { month: "Jun", reports: 1 },
    { month: "Jul", reports: 4 },
  ],
  "R-3301": [
    { month: "Apr", reports: 0 },
    { month: "May", reports: 0 },
    { month: "Jun", reports: 1 },
    { month: "Jul", reports: 3 },
  ],
  "R-2087": [
    { month: "Apr", reports: 0 },
    { month: "May", reports: 0 },
    { month: "Jun", reports: 0 },
    { month: "Jul", reports: 2 },
  ],
}
