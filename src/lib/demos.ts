/* ------------------------------------------------------------------ */
/* CoReLink — one real discharge case, walked step-by-step 01 → 04.    */
/* Content + copy mirror the product screenshots (Intake / Summary /   */
/* Match / Plan). The InteractiveDemo renders faithful light replicas. */
/* ------------------------------------------------------------------ */

export type Confidence = "high" | "good" | "confirm" | "unknown";
export type MatchVariant = "verified" | "confirm" | "unreachable";

export type CaseField = { label: string; value: string; ok?: boolean };

export type NeedItem = {
  n: string;
  label: string;
  owner: "patient" | "caregiver";
  urgent?: boolean;
};

export type SummaryCard = {
  label: string;
  value: string;
  level: Confidence;
  action?: "confirm" | "add";
};

export type MatchResource = {
  name: string;
  meta: string;
  phone?: string;
  variant: MatchVariant;
  why: string;
  source?: string;
};

export type MatchGroup = {
  need: string;
  urgent?: boolean;
  count: string;
  resources: MatchResource[];
};

export type PlanTask = { name: string; meta: string; variant: MatchVariant };

export const CASE = {
  caseLabel: "Case · Travis County · ZIP 78744",

  /* 01 — Intake */
  intakeChips: [
    "Discharge planning",
    "Recent fall",
    "Dementia care",
    "Transportation",
    "Medication help",
    "Home safety",
  ],
  intakeNote:
    "Home visit today — patient is 72, Travis County, ZIP 78744. Being discharged Friday after a fall and needs a ride home from the hospital. She can't afford her blood-pressure medication this month, Medicare only. Spanish spoken at home. Her daughter is the main caregiver and is completely overwhelmed.",
  caseFile: [
    { label: "Location", value: "Travis County · ZIP 78744", ok: true },
    { label: "Language", value: "Spanish", ok: true },
    { label: "Insurance", value: "Medicare only, Limited Income", ok: true },
    { label: "Urgency", value: "None / Routine", ok: false },
  ] as CaseField[],
  readyToReview: ["Location found", "Support needs detected"],
  helpful: ["Language preference", "Insurance status"],

  /* shared prioritized needs */
  needs: [
    { n: "1", label: "Transportation: hospital → home", owner: "patient", urgent: true },
    { n: "2", label: "Affordable medications", owner: "patient" },
    { n: "3", label: "Home safety modifications", owner: "patient" },
    { n: "4", label: "Meal prep & personal care", owner: "patient" },
    { n: "5", label: "Caregiver support & respite", owner: "caregiver" },
  ] as NeedItem[],

  /* 02 — Summary */
  summary: [
    { label: "Location", value: "Travis County · ZIP 78744", level: "high" },
    { label: "Language — please confirm", value: "Spanish", level: "confirm", action: "confirm" },
    { label: "Insurance", value: "Medicare only, Limited Income", level: "good" },
    {
      label: "Income / budget — unknown",
      value: "Affects eligibility for Central Health MAP & sliding-scale programs.",
      level: "unknown",
      action: "add",
    },
  ] as SummaryCard[],
  masked: "3 items auto-masked — [NAME] ×2 · [PHONE]",

  /* 03 — Match */
  needsCoverage: [
    { label: "Transportation from hospital", count: "2 added" },
    { label: "Affordable medication", count: "1 added" },
    { label: "Home safety modification", count: "1 added" },
    { label: "Caregiver support & respite", count: "1 added" },
  ],
  filters: ["Spanish available ✓", "Free / low-cost", "≤ 10 mi", "Verified only"],
  planDraft: [
    "ETA Transportation LLC",
    "Suvida Healthcare",
    "Central Health MAP",
    "Austin–Travis County EMS",
    "AGE of Central Texas",
  ],
  matches: [
    {
      need: "Transportation from hospital",
      urgent: true,
      count: "2 matches",
      resources: [
        {
          name: "ETA Transportation LLC",
          meta: "Wheelchair & ambulatory rides, Austin metro",
          phone: "(737) 272-8472",
          variant: "verified",
          why: "Serves ZIP 78744 · accepts Medicare · Spanish phone line · free quote",
          source: "etatransportationtx.com",
        },
        {
          name: "Suvida Healthcare",
          meta: "Spanish-first senior clinic, transport for patients",
          phone: "888-478-8432",
          variant: "confirm",
          why: "“Established patients only” — verify enrollment. Spanish-first care. Serves area.",
          source: "suvidahealthcare.com",
        },
      ],
    },
    {
      need: "Affordable medications",
      count: "2 matches",
      resources: [
        {
          name: "Central Health MAP",
          meta: "Medical Access Program, Travis County",
          phone: "512-978-8130",
          variant: "verified",
          why: "Low-income Rx coverage · Travis Co. residents · eligibility needs income info",
          source: "centralhealth.net",
        },
        {
          name: "Families First Social Services",
          meta: "Public-assistance help for Spanish speakers",
          variant: "unreachable",
          why: "Details may be outdated. We'll retry automatically.",
        },
      ],
    },
    {
      need: "Home safety modifications",
      count: "1 match",
      resources: [
        {
          name: "Austin–Travis County EMS",
          meta: "Free home-safety assessment and fall prevention",
          phone: "EMSFallPrevention@austintexas.gov",
          variant: "verified",
          why: "Free · home visit · fall risk assessment · grab bar recommendations",
          source: "austintexas.gov",
        },
      ],
    },
    {
      need: "Caregiver support & respite",
      count: "1 match",
      resources: [
        {
          name: "AGE of Central Texas",
          meta: "Spanish-language caregiver support group, Thursdays 10am",
          phone: "512-451-4611",
          variant: "verified",
          why: "Free · Spanish group · Thursdays 10am · support & education",
          source: "ageofcentraltx.org",
        },
      ],
    },
  ] as MatchGroup[],

  /* 04 — Plan */
  plan: {
    today: [
      { name: "ETA Transportation LLC", meta: "(737) 272-8472 · Transportation from hospital", variant: "verified" },
      { name: "Suvida Healthcare", meta: "888-478-8432 · Transportation from hospital", variant: "confirm" },
    ] as PlanTask[],
    week: [
      { name: "Central Health MAP", meta: "512-978-8130 · Affordable medications", variant: "verified" },
      { name: "Austin–Travis County EMS", meta: "EMSFallPrevention@austintexas.gov · Home safety modifications", variant: "verified" },
      { name: "AGE of Central Texas", meta: "512-451-4611 · Caregiver support & respite", variant: "verified" },
    ] as PlanTask[],
    handoff: {
      en: {
        title: "Care plan — this week",
        sub: "For the family of [NAME] · prepared by your CHW · July 3, 2026",
        todayLabel: "TODAY — BEFORE DISCHARGE",
        weekLabel: "THIS WEEK",
        today: [
          { label: "Transportation home", big: "ETA Transportation LLC · (737) 272-8472" },
          { label: "Transportation home", big: "Suvida Healthcare · 888-478-8432" },
        ],
        week: [
          { name: "Central Health MAP", meta: "512-978-8130 · Affordable medications" },
          { name: "Austin–Travis County EMS", meta: "EMSFallPrevention@austintexas.gov · Home safety modifications" },
          { name: "AGE of Central Texas", meta: "512-451-4611 · Caregiver support & respite", accent: true },
        ],
        foot: "Verify details with each provider. Prepared with CoReLink — suggestions come from public sources.",
      },
      es: {
        title: "Plan de cuidado — esta semana",
        sub: "Para la familia de [NOMBRE] · preparado por su CHW · 3 de julio de 2026",
        todayLabel: "HOY — ANTES DEL ALTA",
        weekLabel: "ESTA SEMANA",
        today: [
          { label: "Transporte del hospital a casa", big: "ETA Transportation LLC · (737) 272-8472" },
          { label: "Transporte del hospital a casa", big: "Suvida Healthcare · 888-478-8432" },
        ],
        week: [
          { name: "Central Health MAP", meta: "512-978-8130 · Affordable medications" },
          { name: "Austin–Travis County EMS", meta: "EMSFallPrevention@austintexas.gov · Home safety modifications" },
          { name: "AGE of Central Texas", meta: "512-451-4611 · Caregiver support & respite", accent: true },
        ],
        foot: "Verifique la información con cada proveedor. Preparado con CoReLink — las sugerencias provienen de fuentes públicas.",
      },
    },
  },
};

export type StepMeta = { key: string; num: string; title: string };

export const STEPS: StepMeta[] = [
  { key: "intake", num: "01", title: "Intake" },
  { key: "summary", num: "02", title: "Summary" },
  { key: "match", num: "03", title: "Match" },
  { key: "plan", num: "04", title: "Plan" },
];
