import { DataTrustTier, DataTrustMetadata } from "@/components/data-trust/data-trust";

// ==============================================================================
// 1. DATA TRUST SCHEMA INTERFACES
// ==============================================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
  data_trust_tier: DataTrustTier;
  source_name: string;
  source_url?: string;
  verification_status: string;
}

export interface SectorEntity extends BaseEntity {
  code: string;
  name: string;
  description: string;
  priority_level: "critical" | "high" | "medium" | "low";
}

export interface DistrictEntity extends BaseEntity {
  state: string;
  district_code: string;
  district_name: string;
  division: string;
  tier: string;
  industrial_zone: string;
}

export interface JobRoleEntity extends BaseEntity {
  sector_id: string;
  code: string;
  title: string;
  description: string;
  entry_level_salary: number;
  growth_rate_pct: number;
}

export interface SkillEntity extends BaseEntity {
  name: string;
  category: "programming" | "database" | "cloud" | "soft_skill" | "domain" | "analytics";
  is_emerging: boolean;
  rarity_index: number;
}

export interface EmployerValidationEntity extends BaseEntity {
  employer_name: string;
  role_title: string;
  skill_name: string;
  requirement_type: "essential" | "preferred" | "missing_observed" | "emerging";
  expected_proficiency: "basic" | "intermediate" | "advanced";
  comments: string;
}

export interface TrainingProgrammeEntity extends BaseEntity {
  institution_name: string;
  course_title: string;
  district_name: string;
  annual_capacity: number;
  enrolled_count: number;
  placement_rate_pct: number;
}

export interface TrainerGapEntity extends BaseEntity {
  skill_name: string;
  current_trainers: number;
  required_trainers: number;
  trainer_gap: number;
  urgency: "critical" | "high" | "moderate";
}

export interface InfrastructureRequirementEntity extends BaseEntity {
  programme_name: string;
  category: "computer_systems" | "software" | "cloud_labs" | "database_environments" | "licenses";
  item_name: string;
  current_specification: string;
  recommended_specification: string;
  gap_level: "critical" | "high" | "moderate" | "aligned";
  gap_rationale: string;
  est_total_capex_inr: number;
}

export interface CurriculumGapSummary extends BaseEntity {
  course_title: string;
  detected_gaps: string[];
  alignment_score_pct: number;
  recommended_modules: string[];
}

// ==============================================================================
// 2. SEEDED DATA & PRECOMPUTED METRICS BY ROLE
// ==============================================================================

export const SEEDED_SECTORS: SectorEntity[] = [
  {
    id: "sec-it",
    code: "IT_ITES",
    name: "Information Technology & ITES",
    description: "Software engineering, cloud infrastructure, AI systems, data analytics.",
    priority_level: "critical",
    data_trust_tier: "verified_external",
    source_name: "Ministry of Electronics and Information Technology (MeitY)",
    source_url: "https://www.meity.gov.in",
    verification_status: "verified",
    created_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "sec-bfsi",
    code: "BFSI",
    name: "Banking, Financial Services & Insurance",
    description: "FinTech, algorithmic risk modeling, enterprise database operations.",
    priority_level: "high",
    data_trust_tier: "verified_external",
    source_name: "Reserve Bank of India Skill Registry",
    verification_status: "verified",
    created_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "sec-mfg",
    code: "MFG_AUTO",
    name: "Automotive & Advanced Manufacturing",
    description: "IoT telemetry, embedded firmware, industrial automation.",
    priority_level: "high",
    data_trust_tier: "verified_external",
    source_name: "Automotive Skills Development Council (ASDC)",
    verification_status: "verified",
    created_at: "2026-01-10T00:00:00Z",
  },
];

export const SEEDED_DISTRICT_METRICS: Array<{
  district_name: string;
  tier: string;
  demand_score: number;
  active_openings: number;
  training_capacity: number;
  trainer_deficit: number;
  curriculum_gap_index: number;
  top_demanded_skills: string[];
  infrastructure_gap_inr_lakhs: number;
  metadata: DataTrustMetadata;
}> = [
  {
    district_name: "Pune",
    tier: "Tier 1 (Industrial & IT Hub)",
    demand_score: 94.2,
    active_openings: 42800,
    training_capacity: 18500,
    trainer_deficit: 142,
    curriculum_gap_index: 28.5,
    top_demanded_skills: ["SQL Window Functions", "Power BI", "Docker", "Python", "AWS Cloud"],
    infrastructure_gap_inr_lakhs: 148.5,
    metadata: {
      tier: "verified_external",
      source: "Maharashtra Industrial Development Corporation (MIDC) & Nasscom",
      sourceUrl: "https://midcindia.org",
      collectionDate: "2026-08-15",
      lastUpdated: "2026-09-18",
      geographicCoverage: "Pune Metropolitan Region",
      dataType: "Official Regional Employment Telemetry",
      verificationStatus: "Verified & Audited",
    },
  },
  {
    district_name: "Mumbai & Thane",
    tier: "Tier 1 (Financial Capital)",
    demand_score: 91.5,
    active_openings: 56200,
    training_capacity: 22400,
    trainer_deficit: 168,
    curriculum_gap_index: 31.2,
    top_demanded_skills: ["Financial Analytics", "Python", "Enterprise DAX", "Cybersecurity"],
    infrastructure_gap_inr_lakhs: 192.0,
    metadata: {
      tier: "verified_external",
      source: "Directorate of Employment & Self Employment, Mumbai",
      collectionDate: "2026-08-20",
      lastUpdated: "2026-09-17",
      geographicCoverage: "Mumbai & Thane District",
      dataType: "Regional Labour Bureau Audit",
      verificationStatus: "Verified",
    },
  },
  {
    district_name: "Nagpur",
    tier: "Tier 2 (Emerging Logistics & IT)",
    demand_score: 78.4,
    active_openings: 14600,
    training_capacity: 9200,
    trainer_deficit: 84,
    curriculum_gap_index: 44.0,
    top_demanded_skills: ["Relational SQL", "Java Full-Stack", "Linux CLI", "Power BI"],
    infrastructure_gap_inr_lakhs: 112.5,
    metadata: {
      tier: "verified_external",
      source: "Vidarbha Industries Association (VIA)",
      collectionDate: "2026-07-28",
      lastUpdated: "2026-09-15",
      geographicCoverage: "Vidarbha / Nagpur District",
      dataType: "Industry Cluster Survey",
      verificationStatus: "Verified",
    },
  },
  {
    district_name: "Nashik",
    tier: "Tier 2 (Manufacturing & AgriTech)",
    demand_score: 72.8,
    active_openings: 11200,
    training_capacity: 7600,
    trainer_deficit: 62,
    curriculum_gap_index: 48.6,
    top_demanded_skills: ["Python Automation", "Quality Control BI", "Embedded IoT"],
    infrastructure_gap_inr_lakhs: 94.0,
    metadata: {
      tier: "demo_prototype",
      source: "Nashik District Skill Committee (Pilot Dataset)",
      collectionDate: "2026-08-01",
      lastUpdated: "2026-09-10",
      geographicCoverage: "Nashik District",
      dataType: "Prototype Extrapolation",
      verificationStatus: "Model Prototype",
    },
  },
  {
    district_name: "Chhatrapati Sambhajinagar (Aurangabad)",
    tier: "Tier 2 (Auto & Engineering)",
    demand_score: 69.1,
    active_openings: 9800,
    training_capacity: 6400,
    trainer_deficit: 58,
    curriculum_gap_index: 52.1,
    top_demanded_skills: ["Data Analytics", "PLC Automation", "SQL"],
    infrastructure_gap_inr_lakhs: 86.0,
    metadata: {
      tier: "demo_prototype",
      source: "Marathwada Skill Registry (Pilot Dataset)",
      collectionDate: "2026-08-01",
      lastUpdated: "2026-09-10",
      geographicCoverage: "Aurangabad Industrial Belt",
      dataType: "Prototype Extrapolation",
      verificationStatus: "Model Prototype",
    },
  },
];

// ==============================================================================
// 3. ROLE-SPECIFIC DASHBOARD AGGREGATE PROVIDERS
// ==============================================================================

export function getTrainingProviderDashboardData() {
  return {
    curriculumAlignmentPct: 74.2,
    totalAssessedCourses: 14,
    criticalCurriculumGaps: [
      {
        course: "B.Tech Computer Science (Semester 5 Database Lab)",
        gapSkill: "SQL Window Functions & Index Tuning",
        urgency: "critical",
        status: "Missing from practical lab manual",
        remedyAction: "Add 14-hour SQL Window Functions Module",
      },
      {
        course: "Diploma in Information Technology (Final Year)",
        gapSkill: "Power BI Desktop & Enterprise DAX",
        urgency: "critical",
        status: "Zero BI tooling coverage",
        remedyAction: "Integrate Microsoft Power BI Academic Sandbox",
      },
      {
        course: "Data Science Specialization Track",
        gapSkill: "Applied Inferential Statistics & A/B Testing",
        urgency: "high",
        status: "Only theoretical formulas; no Python statsmodels",
        remedyAction: "Adopt Practical Hypothesis Testing Lab",
      },
    ],
    courseHealthScores: [
      { course: "Database Engineering & SQL", healthScore: 68.4, attendance: "88%", passRate: "72%", benchmark: "85%" },
      { course: "Business Analytics & BI", healthScore: 59.2, attendance: "82%", passRate: "64%", benchmark: "85%" },
      { course: "Full-Stack Web Architectures", healthScore: 84.6, attendance: "94%", passRate: "89%", benchmark: "85%" },
      { course: "Cloud DevOps & Containers", healthScore: 62.8, attendance: "80%", passRate: "66%", benchmark: "85%" },
    ],
    trainerGapSummary: {
      totalRequiredTrainers: 480,
      totalCurrentTrainers: 245,
      netDeficit: 235,
      deficitRatePct: 48.9,
      upcomingToTCohorts: 4,
    },
    recommendationsCount: 12,
  };
}

export function getEmployerDashboardData() {
  return {
    hiringSeason: "Campus Placement Q3-Q4 2026",
    activeIndustryPartners: 48,
    validatedSkillsCount: 184,
    surveysSubmitted: 36,
    topDemandedSkills: [
      { skill: "SQL (Window Functions & Indexing)", essentialPct: 94.2, preferredPct: 5.8, hiringHike: "+42.5%" },
      { skill: "Power BI & Enterprise DAX", essentialPct: 86.4, preferredPct: 13.6, hiringHike: "+68.0%" },
      { skill: "Python (Pandas / Vectorized ETL)", essentialPct: 88.0, preferredPct: 12.0, hiringHike: "+38.4%" },
      { skill: "Docker & Container Basics", essentialPct: 64.5, preferredPct: 35.5, hiringHike: "+52.0%" },
      { skill: "Applied Inferential Statistics", essentialPct: 58.2, preferredPct: 41.8, hiringHike: "+26.8%" },
    ],
    recentEmployerValidations: [
      {
        employer: "Accenture India Data Practice",
        role: "Associate Data Analyst",
        essentialSkills: ["SQL Window Functions", "Power BI", "Excel Advanced"],
        comment: "Essential for 2026 batch: candidates must write raw SQL queries under timed pressure.",
        date: "2026-09-15",
      },
      {
        employer: "Barclays Pune GSC",
        role: "Graduate Data Analyst",
        essentialSkills: ["SQL", "Python ETL", "Inferential Statistics"],
        comment: "Prefer candidates with verifiable GitHub project repositories and DAX portfolio links.",
        date: "2026-09-12",
      },
      {
        employer: "Swiggy Logistics Analytics",
        role: "Product Analyst",
        essentialSkills: ["SQL", "A/B Testing", "Python"],
        comment: "Testing statistical hypothesis formulation is mandatory for our final shortlist.",
        date: "2026-09-08",
      },
    ],
    emergingToolsRadar: ["Snowflake Cloud Data Warehouse", "dbt (Data Build Tool)", "Supabase Vector / Embeddings", "Apache Superset"],
  };
}

export function getAdminGovernmentDashboardData() {
  return {
    jurisdiction: "State of Maharashtra — Skill Development Department",
    totalDistrictProfiles: 36,
    activeMonitoringDistricts: 5,
    statewideDemandVolume: 134600,
    statewideTrainingCapacity: 64100,
    statewideCapacityGap: 70500,
    totalTrainerDeficit: 514,
    statewideLabCapexRequirementLakhs: 633.0,
    topPrioritySectors: [
      { name: "Information Technology & ITES", share: "48.2%", shortageSeverity: "Critical" },
      { name: "Automotive & EV Manufacturing", share: "24.6%", shortageSeverity: "High" },
      { name: "Banking & Financial Services (BFSI)", share: "18.4%", shortageSeverity: "Moderate" },
      { name: "Healthcare & MedTech Logistics", share: "8.8%", shortageSeverity: "Moderate" },
    ],
    districts: SEEDED_DISTRICT_METRICS,
  };
}
