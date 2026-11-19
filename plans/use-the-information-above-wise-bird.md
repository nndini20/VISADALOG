# VISADALOG — UCSB Residential Life Reporting Platform

## Context

The user wants to build the VISADALOG platform described in the pilot plan: a white-label incident reporting and residential-life support platform for universities, configured and branded for UC Santa Barbara. The current `src/App.tsx` is a placeholder dot-grid demo. This replaces it entirely with a production-grade multi-view application.

## Aesthetic Direction

- **Ground**: White/light-neutral surfaces (`#f8fafc`), UCSB navy primary (`#003660`), gold accent (`#FEBC11`), clear dark text
- **Severity palette**: Red (`#DC2626`) for critical, Amber (`#D97706`) for high, Blue (`#2563EB`) for medium, Slate for low — always paired with icons and text labels, never color alone
- **Green** (`#16A34A`) only for confirmed completion / success states
- **Typography**: Inter for body/UI, DM Serif Display for section headings where warmth is needed, JetBrains Mono for IDs, timestamps, audit codes
- **Radius**: `0.375rem` (moderate, not bubbly)
- **Layout**: CSS Grid for page structure, Flexbox for component internals; generous whitespace; clear hierarchy

## Architecture

### Files to create / modify

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root shell — holds view state machine, renders active view |
| `src/theme.ts` | White-label config object (institution, colors, contacts, SSO label, etc.) |
| `src/data.ts` | Realistic fictional UCSB sample data |
| `src/components/Login.tsx` | UCSB SSO login page (mobile + desktop) |
| `src/components/ra/RAShell.tsx` | Mobile RA navigation shell |
| `src/components/ra/Home.tsx` | RA home — recent reports, shift summary, quick actions |
| `src/components/ra/NewReport.tsx` | Incident report form — voice/text/photo, AI summary, severity confirm |
| `src/components/ra/TheLedger.tsx` | Floor observation log (lower-level entries) |
| `src/components/ra/MyReports.tsx` | RA's submitted reports list |
| `src/components/ra/Wellness.tsx` | Post-submission wellness check-in |
| `src/components/ra/Help.tsx` | Campus support, FERPA info, emergency contacts |
| `src/components/admin/AdminShell.tsx` | Desktop admin navigation shell (sidebar) |
| `src/components/admin/Overview.tsx` | Dashboard — severity-ranked queue snapshot, key metrics |
| `src/components/admin/ReportQueue.tsx` | Full sortable/filterable report queue |
| `src/components/admin/Residents.tsx` | Resident history, pattern charts (recharts) |
| `src/components/admin/AdminLedger.tsx` | Admin view of floor observation log |
| `src/components/admin/WellnessChecks.tsx` | Threshold-based wellness-check reminders |
| `src/components/admin/Analytics.tsx` | Trend charts (recharts) |
| `src/components/admin/LegalExports.tsx` | FERPA-aware export with role gate |
| `src/components/admin/AuditLog.tsx` | Timestamped audit activity log |
| `src/components/admin/Administration.tsx` | Brand settings, role management, brand-swap preview |
| `src/components/shared/` | SeverityBadge, FERPABanner, PoweredByBadge, Modal, etc. |
| `src/index.css` | Tailwind import + CSS custom properties for theme tokens |

### White-label config (`src/theme.ts`)

```ts
export const ucsbTheme = {
  institutionName: "UCSB Residential Life",
  institutionShortName: "UCSB",
  institutionLogo: null, // placeholder SVG crest inline
  primaryColor: "#003660",
  secondaryColor: "#FEBC11",
  supportEmail: "reslife@ucsb.edu",
  supportPhone: "(805) 893-4790",
  privacyLink: "https://www.ucsb.edu/privacy",
  ssoButtonLabel: "Sign in with UCSB NetID",
  ssoProvider: "Shibboleth",
  poweredBy: "Visada",
  footerText: "UCSB Residential Life Reporting",
  residenceHalls: ["Santa Rosa Hall", "Anacapa Hall", "San Miguel Hall", ...],
  roles: ["Resident Assistant", "Resident Director", ...],
  reportCategories: ["Noise Concern", "Alcohol-Related Incident", ...],
  severityLabels: ["Critical", "High", "Medium", "Low"],
  ferpaNotice: "...",
}
```

## View State Machine (App.tsx)

```
type AppView = 
  | { screen: 'login' }
  | { screen: 'ra'; tab: RATab }
  | { screen: 'admin'; tab: AdminTab }
```

The login page has a role selector for the demo (RA / Administrator) so both experiences are accessible without real SSO.

## Key Feature Details

### Login Page
- UCSB logo placeholder (SVG shield crest inline)
- Title: "UCSB Residential Life Reporting"
- Subtitle: "Secure incident documentation and residential-life support"
- Primary CTA: "Sign in with UCSB NetID" (Shibboleth)
- Collapsible emergency admin login (break-glass, less prominent)
- FERPA notice inline (collapsible)
- Footer: campus support link, secure-session padlock indicator, "Powered by Visada"

### RA New Report Flow
- Step 1: Location/type selection (hall, floor, room, category)
- Step 2: Narrative input — text area with simulated voice-to-text button, photo attach button
- Step 3: AI-generated structured summary (simulated, shown in a "Reviewing with AI..." loading state then revealed)
- Step 4: AI severity suggestion (e.g., "Medium — Noise Concern") with mandatory RA confirm/override
- Step 5: Review & submit
- Step 6: Post-submission wellness check-in (short form: "How are you doing after this incident?")

### The Ledger
- Simple dated observation log for floor notes below the incident threshold
- Add entry form with location, note text, mood tag
- List view sorted by date, filterable by floor

### Admin Report Queue
- Severity-ranked table with SeverityBadge, resident pseudonym, hall, RA, date, status
- Click row → detail slide-over with AI summary + full report side-by-side
- Filters: severity, hall, date range, status, RA

### Residents View
- Search/select resident (by pseudonym ID in demo)
- History timeline of reports + ledger entries
- recharts line chart for report frequency over time

### Wellness Checks
- Threshold-based list: residents flagged by report count/recency
- Manual override to mark "checked in" with timestamp

### Analytics
- recharts bar/line charts: reports by severity per week, by hall, by category
- Date range picker (simulated)

### Administration / Brand Preview
- Live-editable brand config form (institution name, colors, SSO label)
- Side-by-side "current" vs "preview with new branding" comparison panel
- Demonstrates white-label reusability

### Audit Log
- Timestamped table of all system actions (report viewed, export requested, login, etc.)
- JetBrains Mono for event codes and timestamps

### Legal Exports
- FERPA disclosure warning before proceeding
- Export scope selector (date range, halls, severity)
- Role gate display (Legal/Compliance Reviewer badge required)
- Simulated "Generate Export" with confirmation modal

## Dependencies to install

- `recharts` — for analytics and resident history charts (not yet in package.json)
- `lucide-react` — icons (not yet in package.json)

## Shared Components

- `SeverityBadge` — icon + color + text label (never color alone)
- `FERPABanner` — dismissible FERPA notice strip
- `PoweredByBadge` — subtle "Powered by Visada" attribution
- `Modal` — accessible modal overlay
- `AuditEntry` — formatted audit log row

## Responsive Behavior

- RA experience: mobile-first, max-width ~480px shell, bottom tab bar
- Admin experience: desktop-first, left sidebar nav, collapsible to top bar at <1024px
- Login: centered card, works on both

## Sample Data (src/data.ts)

Realistic fictional data:
- ~12 reports spanning last 30 days, mix of severities and halls
- ~6 residents (pseudonymous: "Resident #1042", etc.)
- ~4 RAs ("Jordan M.", "Alex T.", etc.)
- ~20 ledger entries
- ~15 audit log entries
- Wellness check flags for 2 residents

## Verification

1. Dev server is already running — preview in the Figma Make panel
2. Navigate through: Login → RA (all 6 tabs) → Login → Admin (all 9 tabs)
3. Test New Report flow end-to-end (all 6 steps including wellness check-in)
4. Test admin Report Queue row click → detail slide-over
5. Test Administration brand-swap preview
6. Test Analytics recharts render
7. Verify FERPA banner on Legal Exports
8. Confirm all severity labels use icon + color + text (never color alone)
9. Confirm "Powered by Visada" appears in login footer and admin footer only (not RA nav)
10. Confirm UCSB branding is not hard-coded into shared components (all via theme config)
