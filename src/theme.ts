export interface InstitutionTheme {
  institutionName: string
  institutionShortName: string
  primaryColor: string
  secondaryColor: string
  supportEmail: string
  supportPhone: string
  privacyLink: string
  ferpaLink: string
  accessibilityLink: string
  supportLink: string
  securityLink: string
  ssoButtonLabel: string
  ssoProvider: string
  poweredBy: string
  footerTagline: string
  loginTitle: string
  loginSubtitle: string
  residenceHalls: string[]
  roles: string[]
  reportCategories: string[]
  severityLabels: string[]
  ferpaNotice: string
  breakGlassLabel: string
}

export const ucsbTheme: InstitutionTheme = {
  institutionName: "UCSB Residential Life Reporting",
  institutionShortName: "UCSB",
  primaryColor: "#283D78",
  secondaryColor: "#D7DDEF",
  supportEmail: "reslife@ucsb.edu",
  supportPhone: "(805) 893-4790",
  privacyLink: "#",
  ferpaLink: "#",
  accessibilityLink: "#",
  supportLink: "#",
  securityLink: "#",
  ssoButtonLabel: "Sign in with UCSB NetID",
  ssoProvider: "Shibboleth",
  poweredBy: "Visada",
  footerTagline: "UCSB Residential Life Reporting",
  loginTitle: "UCSB Residential Life Reporting",
  loginSubtitle: "Secure incident documentation and residential-life support.",
  breakGlassLabel: "Emergency Administrator Login",
  residenceHalls: [
    "Santa Rosa Hall",
    "Anacapa Hall",
    "San Miguel Hall",
    "San Nicolas Hall",
    "Manzanita Village",
    "Residence Hall A",
  ],
  roles: [
    "Resident Assistant",
    "Resident Director",
    "Assistant Resident Director",
    "Area Coordinator",
    "Residential Life Director",
    "RA Support Coordinator",
    "UCSB System Administrator",
    "Legal & Compliance Reviewer",
  ],
  reportCategories: [
    "Noise Concern",
    "Alcohol-Related Incident",
    "Property Damage",
    "Resident Conflict",
    "Medical Concern",
    "Community Policy Concern",
    "Welfare Concern",
    "Other",
  ],
  severityLabels: ["Critical", "High", "Medium", "Low"],
  ferpaNotice:
    "This system manages student education records protected under the Family Educational Rights and Privacy Act (FERPA), 20 U.S.C. § 1232g. Access is restricted to authorized UCSB Residential Life personnel with a legitimate educational interest. Unauthorized disclosure is prohibited. By signing in, you acknowledge your FERPA obligations and agree to handle all records in accordance with UCSB policy.",
}

// Preview theme — demonstrates white-label reusability for another institution
export const calPolyPreviewTheme: Partial<InstitutionTheme> = {
  institutionName: "Cal Poly Housing & Residential Experience",
  institutionShortName: "Cal Poly",
  primaryColor: "#154734",
  secondaryColor: "#C8942A",
  supportEmail: "housing@calpoly.edu",
  supportPhone: "(805) 756-1226",
  ssoButtonLabel: "Sign in with Cal Poly Username",
  ssoProvider: "Cal Poly SSO",
  loginTitle: "Cal Poly Housing Incident Reporting",
  footerTagline: "Cal Poly Housing & Residential Experience",
}
