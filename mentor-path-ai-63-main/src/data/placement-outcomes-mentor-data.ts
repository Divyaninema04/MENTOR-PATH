/**
 * PLACEMENT OUTCOMES, AI MENTOR CONTEXT & OPPORTUNITY SKILL MATCHING ENGINE
 * 
 * Supports:
 * - Section 19: AI Mentor (10 data sources, explicit provenance tags [VERIFIED DATA], [PLATFORM CALCULATION], [AI RECOMMENDATION])
 * - Section 20: Upgrade Opportunities (Skill matching, match %, missing skills, eligibility, source)
 * - Section 21: Applications (Linked opportunity, required skills, student skill gaps, 5 canonical outcomes)
 * - Section 22: Placement Outcome Feedback Loop (Market demand -> Training -> Student -> Opportunity -> Application -> Outcome)
 */

// =========================================================
// SECTION 19: AI MENTOR 10-SOURCE CONTEXT & PROVENANCE MODELS
// =========================================================

export type ProvenanceType = "VERIFIED_DATA" | "PLATFORM_CALCULATION" | "AI_RECOMMENDATION";

export interface ProvenanceSection {
  type: ProvenanceType;
  label: string;
  badgeTone: string;
  content: string[];
}

export interface MentorPrecomputedAnswer {
  question: string;
  summaryHeadline: string;
  sections: ProvenanceSection[];
}

export interface DataSourceStatus {
  sourceKey: string;
  title: string;
  pillar: "Market" | "Curriculum" | "Industry" | "Employability";
  status: "Connected" | "Synced";
  summaryText: string;
}

export const MENTOR_DATA_SOURCES: DataSourceStatus[] = [
  {
    sourceKey: "profile",
    title: "1. Student Profile",
    pillar: "Employability",
    status: "Connected",
    summaryText: "B.Tech Computer Science, 3rd Year (Sem 5), CGPA 8.42, Savitribai Phule Pune University",
  },
  {
    sourceKey: "academics",
    title: "2. Academic Coursework",
    pillar: "Curriculum",
    status: "Synced",
    summaryText: "CS501 DBMS (Grade A), CS201 Python Lab (Grade A), MA201 Engg Math. 18 lab hrs completed.",
  },
  {
    sourceKey: "resume",
    title: "3. Resume Signals",
    pillar: "Employability",
    status: "Connected",
    summaryText: "Kaggle EDA project indexed; zero Power BI or enterprise cloud references detected.",
  },
  {
    sourceKey: "skills",
    title: "4. Verified & Declared Skills",
    pillar: "Employability",
    status: "Synced",
    summaryText: "Python (Intermediate), Relational DBs (Intermediate), SQL (Basic), Excel (Intermediate).",
  },
  {
    sourceKey: "target_role",
    title: "5. Target Role Benchmark",
    pillar: "Market",
    status: "Connected",
    summaryText: "Data Analyst (Primary Benchmark), Cloud & DevOps Engineer (Secondary).",
  },
  {
    sourceKey: "market_demand",
    title: "6. Current Market Demand",
    pillar: "Market",
    status: "Synced",
    summaryText: "42,100 active Data Analyst openings; SQL (94%), Python (88%), Power BI (84%) demand frequency.",
  },
  {
    sourceKey: "skill_gaps",
    title: "7. Evaluated Skill Gaps",
    pillar: "Curriculum",
    status: "Synced",
    summaryText: "SQL: Advanced vs Basic (High Gap); Power BI: Intermediate vs None (Critical Gap).",
  },
  {
    sourceKey: "roadmap",
    title: "8. Career Roadmap",
    pillar: "Employability",
    status: "Connected",
    summaryText: "7-Stage Market Pipeline active; Stage 1 diagnosed, Stage 2 learning modules pending.",
  },
  {
    sourceKey: "opportunities",
    title: "9. Verified Opportunities",
    pillar: "Industry",
    status: "Synced",
    summaryText: "14 verified campus MoUs and requisitions active (Accenture ₹7.5L, Barclays ₹9.5L, Swiggy ₹14L).",
  },
  {
    sourceKey: "applications",
    title: "10. Application Outcomes",
    pillar: "Employability",
    status: "Connected",
    summaryText: "5 tracked applications across Applied, Shortlisted, Interview, and Selected stages.",
  },
];

export const MENTOR_CURATED_ANSWERS: Record<string, MentorPrecomputedAnswer> = {
  "What should I learn next?": {
    question: "What should I learn next?",
    summaryHeadline: "Immediate Priority: Power BI & DAX Modeling, followed by Advanced SQL Window Functions.",
    sections: [
      {
        type: "VERIFIED_DATA",
        label: "VERIFIED DATA (Institutional & Profile Facts)",
        badgeTone: "bg-emerald-600 text-white",
        content: [
          "Your academic transcript CS501 DBMS confirms coverage of relational algebra and basic SQL SELECT queries, but zero curriculum hours for Business Intelligence tools.",
          "Your current verified profile contains no project or credential evidence for Power BI or DAX.",
          "Verified campus hiring partner Accenture Data Practice explicitly mandates interactive dashboarding for Round 1 portfolio clearance.",
        ],
      },
      {
        type: "PLATFORM_CALCULATION",
        label: "PLATFORM CALCULATION (Empirical Gap Indices)",
        badgeTone: "bg-blue-600 text-white",
        content: [
          "Power BI Skill Deficit: Market Requirement (Intermediate) vs Student Current Level (None) = CRITICAL GAP (Deficit Severity: 100%).",
          "SQL Window Functions Deficit: Market Requirement (Advanced) vs Student Current Level (Basic) = HIGH GAP (Deficit Severity: 68%).",
          "Learning Power BI first unlocks 84% of active campus requisitions within 16 contact hours.",
        ],
      },
      {
        type: "AI_RECOMMENDATION",
        label: "AI RECOMMENDATION (Actionable Career Intervention)",
        badgeTone: "bg-purple-600 text-white",
        content: [
          "Adopt the '16-Week Accelerated SQL & Power BI Boot Camp' module directly into your Career Roadmap.",
          "Dedicate this week to Power BI Desktop fundamentals: connect a PostgreSQL database, author 3 core measures in DAX (CALCULATE, DIVIDE, RELATED), and publish a public report.",
          "Schedule 45 minutes daily for HackerRank SQL Window Function drills (RANK, DENSE_RANK, LEAD, LAG).",
        ],
      },
    ],
  },
  "Which skills are most important for my target role?": {
    question: "Which skills are most important for my target role?",
    summaryHeadline: "For Data Analyst: SQL Window Functions (94%), Python Wrangling (88%), and Power BI (84%).",
    sections: [
      {
        type: "VERIFIED_DATA",
        label: "VERIFIED DATA (Labour Market & Employer Verification)",
        badgeTone: "bg-emerald-600 text-white",
        content: [
          "Labour Market Intelligence indexed 42,100 active Data Analyst job postings across Pune, Bengaluru, and Mumbai.",
          "Employer Validation shows 98% consensus from surveyed technical recruiters (Accenture, Barclays, Swiggy) rating SQL Window Functions as 'Mandatory'.",
          "Campus placement partner MoUs specify minimum 7.0 CGPA and practical SQL coding round passing criteria.",
        ],
      },
      {
        type: "PLATFORM_CALCULATION",
        label: "PLATFORM CALCULATION (Weight Matrix & Relative Priority)",
        badgeTone: "bg-blue-600 text-white",
        content: [
          "Relative Requisition Weight: SQL (Rank 1 • 94% frequency), Python Pandas (Rank 2 • 88%), Power BI / Tableau (Rank 3 • 84%), Inferential Statistics (Rank 4 • 68%).",
          "Regional Median CTC Delta: Candidates possessing both SQL + Power BI secure a +₹2.4 LPA median package premium over pure Python candidates.",
        ],
      },
      {
        type: "AI_RECOMMENDATION",
        label: "AI RECOMMENDATION (Strategic Skill Focus)",
        badgeTone: "bg-purple-600 text-white",
        content: [
          "Do not spend time learning C++ or low-level algorithms for this role; direct 70% of prep time to SQL CTEs, window functions, and business metric formulations.",
          "Ensure your resume projects highlight business outcomes (e.g. 'Reduced churn by 14% via cohort analysis') rather than purely academic code snippets.",
        ],
      },
    ],
  },
  "Why is Power BI recommended?": {
    question: "Why is Power BI recommended?",
    summaryHeadline: "Power BI is your largest single screening blocker: 84% employer demand vs. 0% profile presence.",
    sections: [
      {
        type: "VERIFIED_DATA",
        label: "VERIFIED DATA (Audit Trail & Verification Sources)",
        badgeTone: "bg-emerald-600 text-white",
        content: [
          "Your uploaded resume scan confirms 0 matches for 'Power BI', 'DAX', 'Tableau', or 'Business Intelligence'.",
          "University academic syllabus (SPPU B.Tech CS 2024 scheme) contains zero credit hours for interactive enterprise visualization.",
          "Recruiter Job Descriptions for Barclays Pune GSC and Accenture explicitly require interactive dashboard portfolio links.",
        ],
      },
      {
        type: "PLATFORM_CALCULATION",
        label: "PLATFORM CALCULATION (Diagnostic Gap Severity)",
        badgeTone: "bg-blue-600 text-white",
        content: [
          "Evaluated Gap: Market Requirement (Intermediate) vs. Student Current Level (None) → CRITICAL GAP.",
          "Candidates with a verified live Power BI portfolio link exhibit a 3.4x higher interview callback rate (71% vs 18%).",
          "Shortlist probability without Power BI drops to 22% for Tier-1 analytics requisitions.",
        ],
      },
      {
        type: "AI_RECOMMENDATION",
        label: "AI RECOMMENDATION (Closing the Gap)",
        badgeTone: "bg-purple-600 text-white",
        content: [
          "Download Power BI Desktop (Academic License is 100% free for students).",
          "Build a portfolio dashboard analyzing real E-Commerce transactional data.",
          "Host the report on NovyPro or GitHub Pages and attach the live hyperlink to your ATS resume in PlacementPilot.",
        ],
      },
    ],
  },
  "What skills am I missing compared with current market requirements?": {
    question: "What skills am I missing compared with current market requirements?",
    summaryHeadline: "Two critical deficits: Power BI (Complete absence) and Advanced SQL Window Functions (Theory only).",
    sections: [
      {
        type: "VERIFIED_DATA",
        label: "VERIFIED DATA (Active Workspace Comparison)",
        badgeTone: "bg-emerald-600 text-white",
        content: [
          "Verified Profile Skills: Python (Intermediate), Relational Databases (Intermediate), Excel (Intermediate).",
          "Verified Missing Profile Entries: Power BI, Advanced DAX, Docker, AWS S3/Cloud Storage, Inferential Statistics (Hypothesis Testing).",
          "Academic Syllabus CS501 verified: Contains SQL DDL/DML, but omits analytical windowing syntax.",
        ],
      },
      {
        type: "PLATFORM_CALCULATION",
        label: "PLATFORM CALCULATION (Multi-Factor Gap Evaluation)",
        badgeTone: "bg-blue-600 text-white",
        content: [
          "1. Power BI: Required = Intermediate | Current = None → Gap: CRITICAL (Deficit: 100%).",
          "2. SQL Window Functions: Required = Advanced | Current = Basic → Gap: HIGH (Deficit: 68%).",
          "3. Applied Statistics: Required = Intermediate | Current = Basic → Gap: MODERATE (Deficit: 45%).",
          "4. Python Pandas: Required = Intermediate | Current = Intermediate → Gap: LOW (Aligned).",
        ],
      },
      {
        type: "AI_RECOMMENDATION",
        label: "AI RECOMMENDATION (Prioritized Learning Order)",
        badgeTone: "bg-purple-600 text-white",
        content: [
          "Sprint 1 (Week 1-2): Complete 16 hours Power BI Desktop & DAX fundamentals.",
          "Sprint 2 (Week 3-4): Master SQL Window Functions (RANK, DENSE_RANK, NTILE, LAG/LEAD).",
          "Sprint 3 (Week 5): Implement two-sample t-tests and Chi-Square tests in Python for product analytics viva preparation.",
        ],
      },
    ],
  },
  "Which opportunities match my current skills?": {
    question: "Which opportunities match my current skills?",
    summaryHeadline: "Highest skill match: Accenture Associate Data Analyst (75% match) & Barclays Data Practice (60% match).",
    sections: [
      {
        type: "VERIFIED_DATA",
        label: "VERIFIED DATA (Live Verified Opportunities)",
        badgeTone: "bg-emerald-600 text-white",
        content: [
          "Accenture India Data Practice: Verified MoU partner • Package: ₹7.5 LPA • Role: Associate Data Analyst • Eligibility: CGPA ≥ 7.0, CS/IT branches (You qualify).",
          "Barclays Pune GSC: Verified campus requisition • Package: ₹9.5 LPA • Role: Graduate Analytics Analyst • Location: Hinjawadi, Pune.",
          "Tata Consultancy Services (TCS Digital): Package: ₹7.2 LPA • National Qualifier Test active.",
        ],
      },
      {
        type: "PLATFORM_CALCULATION",
        label: "PLATFORM CALCULATION (Live Skill Match Percentage)",
        badgeTone: "bg-blue-600 text-white",
        content: [
          "Accenture Data Practice: 75% Match (You have Python, Relational DBs, Excel; Missing: SQL Window Functions).",
          "TCS Digital Analytics: 70% Match (You have Python, Core CS, DBMS; Missing: Timed Machine Coding speed).",
          "Barclays Pune GSC: 60% Match (You have Python, DBMS; Missing: Power BI & DAX Modeling).",
        ],
      },
      {
        type: "AI_RECOMMENDATION",
        label: "AI RECOMMENDATION (Application Strategy)",
        badgeTone: "bg-purple-600 text-white",
        content: [
          "Apply immediately to Accenture Data Practice: you satisfy the 7.0 CGPA criteria and possess 75% of the core competencies.",
          "Before taking the Barclays technical assessment, spend 7 days completing the Power BI DAX portfolio project to boost match rate to 90%.",
          "Track both applications in the Applications tab to monitor progression stages.",
        ],
      },
    ],
  },
  "Which skill gap should I prioritize?": {
    question: "Which skill gap should I prioritize?",
    summaryHeadline: "Prioritize Power BI first for immediate resume screening, followed rapidly by SQL Window Functions.",
    sections: [
      {
        type: "VERIFIED_DATA",
        label: "VERIFIED DATA (Empirical Hiring Gateways)",
        badgeTone: "bg-emerald-600 text-white",
        content: [
          "Stage 1 Gate (ATS Resume Filtering): Automated filters search for 'Power BI' or 'Tableau'. Candidates lacking both are rejected before human review at 84% of GCCs.",
          "Stage 2 Gate (Machine Coding Round): 94% of interview tests consist of 3-5 SQL queries requiring window functions and CTEs.",
        ],
      },
      {
        type: "PLATFORM_CALCULATION",
        label: "PLATFORM CALCULATION (ROI & Effort Matrix)",
        badgeTone: "bg-blue-600 text-white",
        content: [
          "Power BI Acquisition Velocity: ~16 hours to reach intermediate portfolio competency (Highest ROI per hour invested).",
          "SQL Window Functions Velocity: ~14 hours to achieve HackerRank Medium fluency.",
          "Closing both gaps raises your overall institutional employability index from 68% to 94%.",
        ],
      },
      {
        type: "AI_RECOMMENDATION",
        label: "AI RECOMMENDATION (Two-Week Intensive Sprint)",
        badgeTone: "bg-purple-600 text-white",
        content: [
          "Days 1-7: Complete Power BI dashboard and commit to NovyPro portfolio.",
          "Days 8-14: Solve 25 SQL Window function queries on PostgreSQL schema.",
          "Day 15: Take the PlacementPilot 90-minute timed technical mock assessment.",
        ],
      },
    ],
  },
};

// =========================================================
// SECTION 20: OPPORTUNITY SKILL MATCHING ENGINE
// =========================================================

export interface OpportunitySkillRequirement {
  skill: string;
  importance: "Mandatory" | "Preferred";
  proficiencyNeeded: "Basic" | "Intermediate" | "Advanced";
}

export const OPPORTUNITY_SKILL_REQUIREMENTS: Record<string, OpportunitySkillRequirement[]> = {
  "Data Analyst": [
    { skill: "SQL (Window Functions)", importance: "Mandatory", proficiencyNeeded: "Advanced" },
    { skill: "Python (Pandas / NumPy)", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Power BI / Tableau", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Relational Database Design", importance: "Preferred", proficiencyNeeded: "Intermediate" },
    { skill: "Applied Statistics", importance: "Preferred", proficiencyNeeded: "Intermediate" },
  ],
  "Associate Data Analyst": [
    { skill: "SQL (Window Functions)", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Python (Pandas)", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Power BI / Tableau", importance: "Preferred", proficiencyNeeded: "Basic" },
    { skill: "Excel", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
  ],
  "Software Development Engineer": [
    { skill: "Data Structures & Algorithms", importance: "Mandatory", proficiencyNeeded: "Advanced" },
    { skill: "Java / C++ / Python", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Relational Database Design", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Git / GitHub", importance: "Preferred", proficiencyNeeded: "Basic" },
  ],
  "Full Stack Developer": [
    { skill: "React / TypeScript", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Node.js / Express", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "PostgreSQL / MongoDB", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Docker", importance: "Preferred", proficiencyNeeded: "Basic" },
  ],
  "Cloud & DevOps Engineer": [
    { skill: "Linux CLI & Shell Scripting", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Docker & Containerization", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "AWS / Azure Cloud Fundamentals", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "CI/CD Pipelines", importance: "Preferred", proficiencyNeeded: "Basic" },
  ],
  Default: [
    { skill: "Problem Solving", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Communication", importance: "Mandatory", proficiencyNeeded: "Intermediate" },
    { skill: "Core Technical Skills", importance: "Preferred", proficiencyNeeded: "Basic" },
  ],
};

export function evaluateOpportunitySkillMatch(
  title: string,
  category: string,
  studentSkills: string[] = ["Python", "Relational Databases", "Excel"]
): {
  requiredSkills: OpportunitySkillRequirement[];
  matchingSkills: string[];
  missingSkills: OpportunitySkillRequirement[];
  matchPercentage: number;
  matchTier: "High Match (≥70%)" | "Moderate Match (40-69%)" | "Low Match (<40%)";
} {
  const normTitle = title.toLowerCase();
  let requirements = OPPORTUNITY_SKILL_REQUIREMENTS["Data Analyst"];

  if (normTitle.includes("cloud") || normTitle.includes("devops")) {
    requirements = OPPORTUNITY_SKILL_REQUIREMENTS["Cloud & DevOps Engineer"];
  } else if (normTitle.includes("full stack") || normTitle.includes("frontend") || normTitle.includes("web")) {
    requirements = OPPORTUNITY_SKILL_REQUIREMENTS["Full Stack Developer"];
  } else if (normTitle.includes("software") || normTitle.includes("sde") || normTitle.includes("developer")) {
    requirements = OPPORTUNITY_SKILL_REQUIREMENTS["Software Development Engineer"];
  } else if (normTitle.includes("associate") || normTitle.includes("intern")) {
    requirements = OPPORTUNITY_SKILL_REQUIREMENTS["Associate Data Analyst"];
  }

  const matching: string[] = [];
  const missing: OpportunitySkillRequirement[] = [];

  requirements.forEach((req) => {
    const isMatch = studentSkills.some((s) =>
      req.skill.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(req.skill.split(" ")[0].toLowerCase())
    );
    if (isMatch) {
      matching.push(req.skill);
    } else {
      missing.push(req);
    }
  });

  const matchPercentage = Math.round((matching.length / requirements.length) * 100);
  const matchTier =
    matchPercentage >= 70
      ? "High Match (≥70%)"
      : matchPercentage >= 40
      ? "Moderate Match (40-69%)"
      : "Low Match (<40%)";

  return {
    requiredSkills: requirements,
    matchingSkills: matching,
    missingSkills: missing,
    matchPercentage,
    matchTier,
  };
}

// =========================================================
// SECTION 21: APPLICATIONS WITH CONNECTED GAPS & OUTCOMES
// =========================================================

export type CanonicalOutcome = "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected";

export interface EnrichedApplication {
  id: string;
  companyName: string;
  role: string;
  opportunityId?: string;
  opportunityTitle?: string;
  packageLpa: number | null;
  location: string | null;
  appliedDate: string;
  outcomeStatus: CanonicalOutcome;
  requiredSkills: string[];
  studentSkillGapsAtApplication: string[];
  notes: string | null;
}

export const RAW_ENRICHED_APPLICATIONS: EnrichedApplication[] = [
  {
    id: "app-001",
    companyName: "Accenture India Data Practice",
    role: "Associate Data Analyst",
    opportunityId: "opp-acc-01",
    opportunityTitle: "Associate Data Analyst Campus Requisition 2026",
    packageLpa: 7.5,
    location: "Pune (Hinjawadi)",
    appliedDate: "2026-08-14",
    outcomeStatus: "Interview",
    requiredSkills: ["SQL (Window Functions)", "Python (Pandas)", "Power BI", "Excel"],
    studentSkillGapsAtApplication: ["Power BI (None)", "SQL Window Functions (Basic)"],
    notes: "Round 1 Online Assessment cleared (88% score). Technical interview scheduled for Next Tuesday.",
  },
  {
    id: "app-002",
    companyName: "Barclays Pune Global Service Centre",
    role: "Graduate Analytics Analyst",
    opportunityId: "opp-bar-01",
    opportunityTitle: "Graduate Analytics Analyst Cohort",
    packageLpa: 9.5,
    location: "Pune (Kharadi)",
    appliedDate: "2026-08-20",
    outcomeStatus: "Shortlisted",
    requiredSkills: ["SQL Window Functions", "Power BI / DAX", "Inferential Statistics"],
    studentSkillGapsAtApplication: ["Power BI DAX (None)", "A/B Testing Methodology"],
    notes: "Resume screened and shortlisted for 90-minute live machine coding round.",
  },
  {
    id: "app-003",
    companyName: "Tata Consultancy Services (TCS)",
    role: "TCS Digital Data Practice",
    packageLpa: 7.2,
    location: "Mumbai / Pune",
    appliedDate: "2026-07-28",
    outcomeStatus: "Selected",
    requiredSkills: ["Python", "Relational Databases", "Core CS"],
    studentSkillGapsAtApplication: ["None - Foundational requirements met"],
    notes: "Official campus offer letter received! Joining date confirmed post-graduation.",
  },
  {
    id: "app-004",
    companyName: "Swiggy Product Analytics",
    role: "Junior Product Analyst",
    opportunityId: "opp-swg-01",
    opportunityTitle: "Early Careers Product Analyst Program",
    packageLpa: 14.0,
    location: "Bengaluru / Remote",
    appliedDate: "2026-08-02",
    outcomeStatus: "Rejected",
    requiredSkills: ["SQL Window Functions", "Power BI", "A/B Testing Statistics"],
    studentSkillGapsAtApplication: ["Power BI absent on resume", "No statistical experimentation projects"],
    notes: "Rejected in initial resume ATS filter due to missing BI dashboard link and A/B testing coursework.",
  },
  {
    id: "app-005",
    companyName: "Cognizant Technology Solutions",
    role: "GenC Next Data Engineer",
    packageLpa: 6.8,
    location: "Pune (Hinjawadi)",
    appliedDate: "2026-09-01",
    outcomeStatus: "Applied",
    requiredSkills: ["SQL", "Python", "Cloud Fundamentals"],
    studentSkillGapsAtApplication: ["AWS Cloud certification pending"],
    notes: "Application submitted via college placement portal. Awaiting OA test link.",
  },
];

// =========================================================
// SECTION 22: PLACEMENT OUTCOME FEEDBACK LOOP ANALYTICS
// =========================================================

export interface SkillOutcomeCorrelation {
  skillName: string;
  category: string;
  withSkillShortlistRatePct: number;
  withoutSkillShortlistRatePct: number;
  correlationDelta: number; // e.g. +54%
  interviewConversionMultiplier: string; // e.g. "3.4x"
  sampleCohortSize: number;
  statisticalCaveat: string;
}

export interface TrainingProgrammeEfficacy {
  programmeName: string;
  provider: string;
  intakeGraduates: number;
  placementClearanceRatePct: number;
  averageStartingCtcLpa: number;
  syllabusAlignmentScorePct: number;
  topRecruitersHiring: string[];
  keyStrengths: string;
}

export interface DifficultSkillAcquisitionMetric {
  skillName: string;
  category: string;
  initialFailureRatePct: number; // e.g. 64% fail on attempt 1
  avgHoursToCompetency: number;
  primaryStudentStumblingBlock: string;
  recommendedPedagogy: string;
}

export interface ShiftingRoleRequirement {
  roleName: string;
  sector: string;
  risingSkills: { skill: string; growthPct: number; driver: string }[];
  decliningSkills: { skill: string; dropPct: number; driver: string }[];
  strategicImplication: string;
}

export const OUTCOME_SKILL_CORRELATIONS: SkillOutcomeCorrelation[] = [
  {
    skillName: "SQL (Window Functions & CTEs)",
    category: "Core Technical",
    withSkillShortlistRatePct: 78.4,
    withoutSkillShortlistRatePct: 24.2,
    correlationDelta: 54.2,
    interviewConversionMultiplier: "3.2x",
    sampleCohortSize: 1240,
    statisticalCaveat: "High empirical correlation with clearing Round 1 timed machine assessments. Does not guarantee cultural interview clearance.",
  },
  {
    skillName: "Power BI & Interactive DAX",
    category: "Analytics & BI",
    withSkillShortlistRatePct: 71.2,
    withoutSkillShortlistRatePct: 18.5,
    correlationDelta: 52.7,
    interviewConversionMultiplier: "3.8x",
    sampleCohortSize: 980,
    statisticalCaveat: "Correlates strongly with resume ATS shortlisting and executive manager rounds across GCC analytics employers.",
  },
  {
    skillName: "Docker & Containerized Microservices",
    category: "DevOps & Cloud",
    withSkillShortlistRatePct: 68.0,
    withoutSkillShortlistRatePct: 31.8,
    correlationDelta: 36.2,
    interviewConversionMultiplier: "2.1x",
    sampleCohortSize: 840,
    statisticalCaveat: "Observed correlation with systems engineering shortlists; highly co-linear with Linux CLI fluency.",
  },
  {
    skillName: "Python Automated ETL Pipelines",
    category: "Data Engineering",
    withSkillShortlistRatePct: 82.5,
    withoutSkillShortlistRatePct: 46.1,
    correlationDelta: 36.4,
    interviewConversionMultiplier: "1.8x",
    sampleCohortSize: 1100,
    statisticalCaveat: "Correlates with project review clearance when backed by a verifiable GitHub repository with commit history.",
  },
];

export const TRAINING_PROGRAMME_EFFICACY: TrainingProgrammeEfficacy[] = [
  {
    programmeName: "PG Certificate in Applied Data Analytics & Cloud Warehousing",
    provider: "COEP Tech University & NSDC Industry Cohort",
    intakeGraduates: 240,
    placementClearanceRatePct: 88.5,
    averageStartingCtcLpa: 8.4,
    syllabusAlignmentScorePct: 92.4,
    topRecruitersHiring: ["Accenture", "Barclays", "Infosys Topaz", "Swiggy"],
    keyStrengths: "Integrated weekly PostgreSQL machine coding drills + mandatory published NovyPro Power BI portfolio.",
  },
  {
    programmeName: "16-Week Accelerated SQL & Power BI Boot Camp",
    provider: "Maharashtra State Skill University (MSSU)",
    intakeGraduates: 380,
    placementClearanceRatePct: 84.2,
    averageStartingCtcLpa: 7.6,
    syllabusAlignmentScorePct: 94.0,
    topRecruitersHiring: ["Tata Consultancy Services", "Cognizant", "LTIMindtree"],
    keyStrengths: "Daily timed query sprints on 1M+ row datasets simulating Tier-1 corporate screening rounds.",
  },
  {
    programmeName: "Standard 4-Year B.Tech Computer Engineering (Legacy Curriculum)",
    provider: "State Affiliated Engineering Colleges",
    intakeGraduates: 4200,
    placementClearanceRatePct: 42.1,
    averageStartingCtcLpa: 5.2,
    syllabusAlignmentScorePct: 58.0,
    topRecruitersHiring: ["Mass Service IT Recruiter Pool"],
    keyStrengths: "Strong theoretical foundational computer science; major 2-year syllabus lag behind active employer stacks.",
  },
];

export const DIFFICULT_SKILL_ACQUISITIONS: DifficultSkillAcquisitionMetric[] = [
  {
    skillName: "SQL Query Execution Plans & Index Optimization",
    category: "Database Engineering",
    initialFailureRatePct: 64.2,
    avgHoursToCompetency: 28,
    primaryStudentStumblingBlock: "Students memorize SELECT syntax without understanding B-Tree page reads, sequential scans, or memory buffer pools.",
    recommendedPedagogy: "Pairwise EXPLAIN ANALYZE visualizer labs using PostgreSQL on un-indexed vs composite-indexed tables.",
  },
  {
    skillName: "Power BI DAX Context Transition & CALCULATE",
    category: "Business Intelligence",
    initialFailureRatePct: 58.6,
    avgHoursToCompetency: 24,
    primaryStudentStumblingBlock: "Confusion between Row Context and Filter Context when writing CALCULATE with ALLSELECTED or Time Intelligence filters.",
    recommendedPedagogy: "Visual matrix step-through worksheets demonstrating exact filter table propagation before authoring DAX code.",
  },
  {
    skillName: "Distributed Docker Networking & Compose Volumes",
    category: "Cloud & Infrastructure",
    initialFailureRatePct: 52.0,
    avgHoursToCompetency: 22,
    primaryStudentStumblingBlock: "Persistent storage mount permissions and container-to-container DNS resolution errors.",
    recommendedPedagogy: "Interactive sandboxes spinning up a multi-container full-stack application (React + Node + PostgreSQL).",
  },
];

export const SHIFTING_ROLE_REQUIREMENTS: ShiftingRoleRequirement[] = [
  {
    roleName: "Data Analyst",
    sector: "IT & Digital Services",
    risingSkills: [
      { skill: "Power BI & Cloud Data Warehousing (Snowflake)", growthPct: 114, driver: "Transition from local spreadsheets to automated cloud executive dashboards." },
      { skill: "Python Automated Wrangling (Pandas/Polars)", growthPct: 88, driver: "Mandate for automated reproducible data pipelines over manual cleansing." },
      { skill: "SQL Window Functions & CTEs", growthPct: 62, driver: "Direct in-database transformation replacing application-tier scripting." },
    ],
    decliningSkills: [
      { skill: "Static Microsoft Excel VBA / Macros", dropPct: -62, driver: "Replaced by cloud BI and automated Python scripts." },
      { skill: "Manual Copy-Paste CSV Reporting", dropPct: -74, driver: "Automated via scheduled cloud queries and DirectQuery." },
      { skill: "On-Premises Access Databases", dropPct: -82, driver: "Decommissioned across 90%+ enterprise tech stacks." },
    ],
    strategicImplication: "Training colleges must immediately eliminate VBA from coursework and redirect teaching contact hours to Power BI and SQL Window Functions.",
  },
  {
    roleName: "Cloud & Infrastructure Engineer",
    sector: "Technology Infrastructure",
    risingSkills: [
      { skill: "Terraform Infrastructure-as-Code (IaC)", growthPct: 128, driver: "Zero tolerance for manual GUI console provisioning in production." },
      { skill: "Kubernetes & Container Orchestration", growthPct: 95, driver: "Enterprise standardization on containerized microservices." },
    ],
    decliningSkills: [
      { skill: "Manual Virtual Machine Provisioning", dropPct: -58, driver: "Full automation via IaC." },
      { skill: "Bare-Metal Server Maintenance", dropPct: -72, driver: "Migration to hyperscaler cloud environments (AWS/Azure)." },
    ],
    strategicImplication: "Infrastructure syllabi must replace manual OS installation labs with scripted cloud deployment exercises.",
  },
];
