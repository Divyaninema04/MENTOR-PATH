/**
 * TRAINING & CURRICULUM ALIGNMENT — PROTOTYPE / DEMO DATA LAYER (LAYER B)
 * 
 * PROVENANCE STATEMENT:
 * This dataset provides simulated institutional telemetry calibrated against
 * AICTE Model Curricula, National Skills Qualification Framework (NSQF) standards,
 * and academic Board of Studies benchmarks.
 * 
 * Clearly marked as PROTOTYPE / DEMO DATA so it can be swapped with live
 * University ERP / LMS APIs (e.g. Canvas, Moodle, or Institutional Accreditation Systems).
 */

export interface CurriculumSubjectMapping {
  id: string;
  code: string;
  name: string;
  semester: number;
  branch: string;
  credits: number;
  theoryHours: number;
  labHours: number;
  industryRelevancePct: number;
  mappedMarketSkills: string[];
  uncoveredIndustryDemands: string[];
  alignmentStatus: "Strongly Aligned" | "Partially Aligned" | "Curriculum Review Recommended";
  syllabusLastRevisedYear: number;
}

// ---------------------------------------------------------
// SECTION 5: CURRICULUM ALIGNMENT ENGINE TYPES & DEFINITIONS
// ---------------------------------------------------------

export type MarketDemandLevel = "Very High" | "High" | "Medium" | "Low";
export type CurriculumCoverageLevel = "Covered" | "Partial" | "Missing";
export type AlignmentGapStatus = "CRITICAL GAP" | "MODERATE GAP" | "ALIGNED";

export interface SkillAlignmentItem {
  skill: string;
  category: "Core Technical" | "Analytical" | "Tooling & Frameworks" | "Domain & Methodological";
  marketDemand: MarketDemandLevel;
  marketDemandScore: number; // 0 - 100
  curriculumCoverage: CurriculumCoverageLevel;
  curriculumCoverageScore: number; // 0 - 100
  gapStatus: AlignmentGapStatus;
  jobPostingsCount: number;
  syllabusNotes: string;
  suggestedAction: string;
}

export interface CurriculumAlignmentResult {
  course: string;
  programme: string;
  sector: string;
  role: string;
  district: string;
  overallAlignmentIndex: number;
  criticalGapsCount: number;
  moderateGapsCount: number;
  alignedCount: number;
  theoryToLabRatio: string;
  recommendedIntervention: string;
  skills: SkillAlignmentItem[];
}

// ---------------------------------------------------------
// SECTION 6: COURSE HEALTH SYSTEM TYPES & DEFINITIONS
// ---------------------------------------------------------

export type CourseHealthStatus =
  | "Industry Aligned"
  | "Needs Revision"
  | "Significant Skill Gap"
  | "Low Observed Market Relevance"
  | "Potential Oversupply Risk";

export interface SkillDriver {
  skill: string;
  impact: "Positive Driver" | "Severe Drag" | "Moderate Drag" | "Oversupplied";
  reason: string;
}

export interface CourseHealthRecord {
  id: string;
  courseName: string;
  degree: string;
  department: string;
  enrolledStudents: number;
  graduatingBatch: string;
  healthScore: number; // 0-100
  status: CourseHealthStatus;
  
  // Mandatory 5-Point Explainable Telemetry
  marketEvidence: string;
  skillsCausingStatus: SkillDriver[];
  demandTrend: {
    direction: "Surging" | "Growing" | "Stable" | "Declining" | "Saturated";
    percentageChange: number; // e.g. +42%, -18%
    timeframe: string;
    summary: string;
  };
  curriculumCoverage: {
    overallCoveragePct: number;
    lastRevisedYear: number;
    theoryHours: number;
    labPracticalHours: number;
    keyModulesMissing: string[];
    keyModulesCovered: string[];
  };
  recommendation: {
    actionType: "Board of Studies Action" | "Module Injection" | "Capacity Rationalization" | "Elective Overhaul";
    title: string;
    description: string;
    targetTimeline: string;
    expectedImpact: string;
  };

  placementVelocityPct: number;
  fresherMedianCtcLpa: number;
  regionalHiringRatio: string;
}

export interface CourseHealthDiagnostic {
  programId: string;
  programName: string;
  degree: string;
  enrolledStudents: number;
  healthScorePct: number;
  industryRelevanceIndex: number; // 0-100
  practicalLabRatioPct: number;   // e.g. 42%
  syllabusFreshnessScore: number; // 0-100
  placementVelocityPct: number;   // % placed within 6 months
  criticalGapsCount: number;
  boardOfStudiesStatus: "Compliant" | "Revision Overdue" | "Intervention Required";
  topStrength: string;
  topRiskFactor: string;
}

export interface QualificationStandard {
  nsqfLevel: number;
  roleTitle: string;
  qualificationCode: string;
  awardingBody: string;
  equivalentAcademicDegree: string;
  requiredCreditPoints: number;
  mappedTechnicalSkills: string[];
  coreCompetencies: string[];
  curriculumReadinessScore: number;
}

export interface CurriculumRecommendation {
  id: string;
  type: "Inject New Module" | "De-Emphasize Topic" | "Upgrade Lab Hands-On" | "Capstone Project Brief";
  targetSubject: string;
  targetSemester: number;
  title: string;
  justification: string;
  marketEvidenceBasis: string;
  suggestedContactHours: number;
  priority: "Immediate (Next Semester)" | "Medium-Term" | "Elective Addition";
  advocatingEmployers: string[];
}

export interface TrainingCapacityMetric {
  facilityName: string;
  category: "Computing Labs" | "Faculty Upskilling" | "Cloud Infrastructure" | "Mentorship Bandwidth";
  currentCapacity: number;
  targetCapacity: number;
  utilizationRatePct: number;
  unit: string;
  status: "Optimal" | "Constrained" | "Upgrades Required";
  actionNote: string;
}

// 1. Raw Curriculum Alignment Data
export const RAW_CURRICULUM_SUBJECTS: CurriculumSubjectMapping[] = [
  {
    id: "sub-101",
    code: "CS501",
    name: "Database Management Systems",
    semester: 5,
    branch: "Computer Science & Engineering",
    credits: 4,
    theoryHours: 45,
    labHours: 30,
    industryRelevancePct: 84,
    mappedMarketSkills: ["SQL & Relational Databases", "Normalization", "Indexing & Query Plans", "Transactions (ACID)"],
    uncoveredIndustryDemands: ["Vector Databases (pgvector)", "Distributed Sharding", "Columnar Storage"],
    alignmentStatus: "Strongly Aligned",
    syllabusLastRevisedYear: 2024,
  },
  {
    id: "sub-102",
    code: "CS502",
    name: "Operating Systems & Concurrency",
    semester: 5,
    branch: "Computer Science & Engineering",
    credits: 4,
    theoryHours: 45,
    labHours: 30,
    industryRelevancePct: 76,
    mappedMarketSkills: ["Linux Systems & CLI", "Processes & Threads", "Memory Management", "File Systems"],
    uncoveredIndustryDemands: ["Docker Container Isolation", "cgroups & Linux Namespaces", "eBPF Observability"],
    alignmentStatus: "Partially Aligned",
    syllabusLastRevisedYear: 2023,
  },
  {
    id: "sub-103",
    code: "CS601",
    name: "Web Technologies & Systems",
    semester: 6,
    branch: "Computer Science & Engineering",
    credits: 3,
    theoryHours: 30,
    labHours: 30,
    industryRelevancePct: 48,
    mappedMarketSkills: ["HTML5/CSS3", "JavaScript Syntax", "REST Basics", "Client-Server Model"],
    uncoveredIndustryDemands: ["React 19 & Next.js", "TypeScript Strict Typing", "Modern Serverless APIs", "GraphQL / gRPC"],
    alignmentStatus: "Curriculum Review Recommended",
    syllabusLastRevisedYear: 2021,
  },
  {
    id: "sub-104",
    code: "CS602",
    name: "Computer Networks & Distributed Protocols",
    semester: 6,
    branch: "Computer Science & Engineering",
    credits: 4,
    theoryHours: 45,
    labHours: 15,
    industryRelevancePct: 78,
    mappedMarketSkills: ["TCP/IP", "DNS & Routing", "HTTP/1.1 & HTTP/2", "Socket Programming"],
    uncoveredIndustryDemands: ["TLS 1.3 & Zero Trust", "gRPC over HTTP/2", "Cloud CDN & Anycast Architecture"],
    alignmentStatus: "Partially Aligned",
    syllabusLastRevisedYear: 2024,
  },
  {
    id: "sub-105",
    code: "CS701",
    name: "Software Engineering & Quality Assurance",
    semester: 7,
    branch: "Computer Science & Engineering",
    credits: 3,
    theoryHours: 45,
    labHours: 0,
    industryRelevancePct: 42,
    mappedMarketSkills: ["Waterfall & Agile SDLC", "UML Diagrams", "Black-Box Testing"],
    uncoveredIndustryDemands: ["CI/CD Pipeline Automation", "Playwright / Cypress Automated Testing", "GitOps", "Unit Test-Driven Development (TDD)"],
    alignmentStatus: "Curriculum Review Recommended",
    syllabusLastRevisedYear: 2020,
  },
  {
    id: "sub-106",
    code: "CS703",
    name: "Cloud Computing & DevOps Elective",
    semester: 7,
    branch: "Computer Science & Engineering",
    credits: 3,
    theoryHours: 30,
    labHours: 30,
    industryRelevancePct: 91,
    mappedMarketSkills: ["Docker", "Kubernetes", "AWS Infrastructure", "Terraform Infrastructure as Code"],
    uncoveredIndustryDemands: ["Multi-Region Service Mesh", "Edge Computing"],
    alignmentStatus: "Strongly Aligned",
    syllabusLastRevisedYear: 2025,
  },
];

// 2. Raw Course Health Data
export const RAW_COURSE_HEALTH: CourseHealthDiagnostic[] = [
  {
    programId: "btech-cse",
    programName: "B.Tech Computer Science & Engineering",
    degree: "Undergraduate (4 Years)",
    enrolledStudents: 480,
    healthScorePct: 82,
    industryRelevanceIndex: 86,
    practicalLabRatioPct: 44,
    syllabusFreshnessScore: 88,
    placementVelocityPct: 91.5,
    criticalGapsCount: 2,
    boardOfStudiesStatus: "Compliant",
    topStrength: "Robust algorithmic foundations and strong cloud elective offerings.",
    topRiskFactor: "Web technology and software QA testing coursework lags behind modern industry automation standards.",
  },
  {
    programId: "btech-aids",
    programName: "B.Tech Artificial Intelligence & Data Science",
    degree: "Undergraduate (4 Years)",
    enrolledStudents: 180,
    healthScorePct: 88,
    industryRelevanceIndex: 94,
    practicalLabRatioPct: 52,
    syllabusFreshnessScore: 95,
    placementVelocityPct: 94.0,
    criticalGapsCount: 1,
    boardOfStudiesStatus: "Compliant",
    topStrength: "High practical lab hours with Python, PyTorch, and cloud vector data stores.",
    topRiskFactor: "Need to introduce cognitive multi-agent orchestration frameworks before Q1 2027.",
  },
  {
    programId: "btech-ece",
    programName: "B.Tech Electronics & Communication Engineering",
    degree: "Undergraduate (4 Years)",
    enrolledStudents: 320,
    healthScorePct: 71,
    industryRelevanceIndex: 72,
    practicalLabRatioPct: 38,
    syllabusFreshnessScore: 68,
    placementVelocityPct: 79.2,
    criticalGapsCount: 4,
    boardOfStudiesStatus: "Revision Overdue",
    topStrength: "Strong analog circuit foundations and microcontroller basics.",
    topRiskFactor: "Insufficient exposure to RTOS, modern ARM Cortex debugging, CAN bus for EV applications, and Rust for embedded.",
  },
  {
    programId: "btech-it",
    programName: "B.Tech Information Technology",
    degree: "Undergraduate (4 Years)",
    enrolledStudents: 240,
    healthScorePct: 78,
    industryRelevanceIndex: 81,
    practicalLabRatioPct: 45,
    syllabusFreshnessScore: 76,
    placementVelocityPct: 86.8,
    criticalGapsCount: 3,
    boardOfStudiesStatus: "Compliant",
    topStrength: "Good database and enterprise Java foundations.",
    topRiskFactor: "Software quality assurance syllabi heavily focus on manual checklists rather than automated CI/CD suites.",
  },
  {
    programId: "btech-mech",
    programName: "B.Tech Mechanical Engineering (EV Specialization)",
    degree: "Undergraduate (4 Years)",
    enrolledStudents: 220,
    healthScorePct: 65,
    industryRelevanceIndex: 67,
    practicalLabRatioPct: 35,
    syllabusFreshnessScore: 60,
    placementVelocityPct: 69.4,
    criticalGapsCount: 5,
    boardOfStudiesStatus: "Intervention Required",
    topStrength: "Thermodynamics and CAD/CAM fundamentals.",
    topRiskFactor: "Electric vehicle powertrain modeling, battery management systems (BMS), and embedded software integration require urgent board revision.",
  },
];

// 3. Raw Qualification Mapping Data (NSQF Standards)
export const RAW_QUALIFICATION_MAPPINGS: QualificationStandard[] = [
  {
    nsqfLevel: 6,
    roleTitle: "Software Developer (Full Stack)",
    qualificationCode: "SSC/Q0501",
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    equivalentAcademicDegree: "B.Tech / B.E. in Computer Science or Allied Disciplines",
    requiredCreditPoints: 160,
    mappedTechnicalSkills: ["React / Modern TypeScript", "SQL & Relational DBs", "REST / gRPC APIs", "Git Version Control", "Docker"],
    coreCompetencies: ["Write and debug modular clean code", "Implement API endpoints", "Write automated unit tests", "Adhere to OWASP security basics"],
    curriculumReadinessScore: 84,
  },
  {
    nsqfLevel: 7,
    roleTitle: "Cloud & DevOps Solutions Architect",
    qualificationCode: "SSC/Q8301",
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    equivalentAcademicDegree: "M.Tech / B.Tech with Professional Elective Specialization",
    requiredCreditPoints: 180,
    mappedTechnicalSkills: ["Docker & Kubernetes", "AWS / Cloud Infrastructure", "Terraform / IaC", "CI/CD Pipeline Automation", "Linux Internals"],
    coreCompetencies: ["Architect scalable distributed systems", "Automate blue-green deployment pipelines", "Monitor multi-region cluster telemetry"],
    curriculumReadinessScore: 72,
  },
  {
    nsqfLevel: 7,
    roleTitle: "AI & Machine Learning Specialist",
    qualificationCode: "SSC/Q8102",
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    equivalentAcademicDegree: "B.Tech AI/DS or Master of Computer Applications (MCA)",
    requiredCreditPoints: 180,
    mappedTechnicalSkills: ["Python", "PyTorch / Deep Learning", "Vector Databases & RAG", "Agentic AI Frameworks", "Linear Algebra"],
    coreCompetencies: ["Design and evaluate transformer architectures", "Deploy LLMs with retrieval augmentation", "Manage training inference bottlenecks"],
    curriculumReadinessScore: 78,
  },
  {
    nsqfLevel: 6,
    roleTitle: "Cybersecurity & SOC Analyst",
    qualificationCode: "SSC/Q0901",
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    equivalentAcademicDegree: "B.Tech CSE / IT with Security Specialization",
    requiredCreditPoints: 160,
    mappedTechnicalSkills: ["Network Security Protocols", "OWASP Top 10 Vulnerabilities", "SIEM (Splunk/Sentinel)", "Linux CLI", "Python Scripting"],
    coreCompetencies: ["Investigate intrusion alerts", "Perform static and dynamic application vulnerability audits", "Enforce zero-trust configurations"],
    curriculumReadinessScore: 68,
  },
];

// 4. Raw Curriculum Recommendations Data
export const RAW_CURRICULUM_RECOMMENDATIONS: CurriculumRecommendation[] = [
  {
    id: "rec-001",
    type: "Inject New Module",
    targetSubject: "Database Management Systems (CS501)",
    targetSemester: 5,
    title: "Vector Embeddings & Hybrid Search (pgvector Module)",
    justification: "Market demand for vector databases expanded by 118% YoY. Adding a 6-hour hands-on module allows students to implement hybrid text + embedding retrieval directly inside familiar PostgreSQL environments.",
    marketEvidenceBasis: "9,420 active enterprise job postings require vector store competency (Q3 2026).",
    suggestedContactHours: 6,
    priority: "Immediate (Next Semester)",
    advocatingEmployers: ["Swiggy", "Postman", "Zoho", "PhonePe", "Infosys"],
  },
  {
    id: "rec-002",
    type: "De-Emphasize Topic",
    targetSubject: "Software Engineering (CS701)",
    targetSemester: 7,
    title: "Transition Manual Regression Checklists to Automated Playwright/PyTest Suites",
    justification: "Pure manual regression testing postings decreased by 44.5% YoY, while automated testing and SDET requisitions grew by 35%. Course hours should be re-allocated to writing CI/CD-driven automated test scripts.",
    marketEvidenceBasis: "Only 3,120 manual QA postings observed vs 24,000+ automation roles.",
    suggestedContactHours: 12,
    priority: "Immediate (Next Semester)",
    advocatingEmployers: ["Razorpay", "CRED", "Flipkart", "TCS Digital"],
  },
  {
    id: "rec-003",
    type: "Upgrade Lab Hands-On",
    targetSubject: "Web Technologies (CS601)",
    targetSemester: 6,
    title: "Replace Legacy DOM/jQuery Labs with Modern TypeScript & React 19 Components",
    justification: "Legacy jQuery postings fell by 54.2% YoY, while React/Next.js and TypeScript requisitions command over 36,000 openings.",
    marketEvidenceBasis: "36,400 postings specify React/Next.js with TypeScript.",
    suggestedContactHours: 18,
    priority: "Immediate (Next Semester)",
    advocatingEmployers: ["Swiggy", "Microsoft IDC", "Zepto", "Accenture"],
  },
  {
    id: "rec-004",
    type: "Capstone Project Brief",
    targetSubject: "Cloud Computing Elective (CS703)",
    targetSemester: 8,
    title: "Multi-Agent System Orchestration with Observability",
    justification: "Agentic AI is the fastest growing skill competency in the national labor market (+142.5% velocity). A multi-agent capstone provides tangible portfolio evidence during campus hiring.",
    marketEvidenceBasis: "7,850 active postings in Q3 2026; high recruiter premium.",
    suggestedContactHours: 24,
    priority: "Medium-Term",
    advocatingEmployers: ["Swiggy", "PhonePe", "Persistent", "Adobe India"],
  },
];

// 5. Raw Training Capacity Data
export const RAW_TRAINING_CAPACITY: TrainingCapacityMetric[] = [
  {
    facilityName: "High-Performance AI & Cloud Computing Lab",
    category: "Computing Labs",
    currentCapacity: 120,
    targetCapacity: 180,
    utilizationRatePct: 88,
    unit: "Workstations with Dedicated GPU Sandboxes",
    status: "Constrained",
    actionNote: "Evening batch hours required to accommodate surging AI/DS elective enrollment.",
  },
  {
    facilityName: "Faculty Cloud & AI Industry Certification Program",
    category: "Faculty Upskilling",
    currentCapacity: 34,
    targetCapacity: 55,
    utilizationRatePct: 62,
    unit: "Certified Professors & Lab Instructors",
    status: "Upgrades Required",
    actionNote: "18 faculty members scheduled for NASSCOM/AWS Cloud Architecture training in winter recess.",
  },
  {
    facilityName: "Enterprise Cloud Sandbox Credit Grant",
    category: "Cloud Infrastructure",
    currentCapacity: 750,
    targetCapacity: 1000,
    utilizationRatePct: 75,
    unit: "Active Student Cloud Sandbox Accounts",
    status: "Optimal",
    actionNote: "Covers automated CI/CD builds, Docker registries, and PostgreSQL cloud instances.",
  },
  {
    facilityName: "Alumni Industry Mentor Network",
    category: "Mentorship Bandwidth",
    currentCapacity: 45,
    targetCapacity: 80,
    utilizationRatePct: 92,
    unit: "Active Senior Industry Mentors",
    status: "Constrained",
    actionNote: "Current ratio is 18 students per mentor; target is 10:1 for final-year placement cohorts.",
  },
];

// =========================================================
// SECTION 5: CURRICULUM ALIGNMENT ENGINE PRESETS & ENGINE
// =========================================================

export const ALIGNMENT_COURSES = [
  "Data Analytics",
  "Full-Stack Software Engineering",
  "Cloud & DevOps Engineering",
  "Artificial Intelligence & Machine Learning",
  "Embedded Systems & IoT",
  "Electric Vehicle Powertrain Engineering",
] as const;

export const ALIGNMENT_PROGRAMMES = [
  "B.Tech Computer Science (4-Year)",
  "B.Tech AI & Data Science (4-Year)",
  "PG Diploma in Business Analytics (1-Year)",
  "Vocational IT Certificate (NSQF Level 6)",
  "Polytechnic Diploma in Computer Engineering (3-Year)",
] as const;

export const ALIGNMENT_SECTORS = [
  "IT & Software Services",
  "Financial Services & FinTech",
  "Automotive & CleanTech",
  "Healthcare & Life Sciences",
  "Manufacturing & Supply Chain",
] as const;

export const ALIGNMENT_ROLES = [
  "Data Analyst",
  "Data Engineer",
  "Full Stack Developer",
  "Cloud Architect",
  "Machine Learning Engineer",
  "Embedded Firmware Engineer",
] as const;

export const ALIGNMENT_DISTRICTS = [
  "Bengaluru Urban (Karnataka)",
  "Hyderabad (Telangana)",
  "Pune (Maharashtra)",
  "Chennai (Tamil Nadu)",
  "Delhi NCR (National Capital Region)",
  "Mumbai Metropolitan (Maharashtra)",
] as const;

// Base skill matrices per course
const BASE_COURSE_SKILLS: Record<string, SkillAlignmentItem[]> = {
  "Data Analytics": [
    {
      skill: "SQL",
      category: "Core Technical",
      marketDemand: "Very High",
      marketDemandScore: 95,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 15,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 42100,
      syllabusNotes: "Relational database course CS501 is theoretical; complex analytic queries, window functions (OVER/PARTITION BY), and CTEs are missing from hands-on syllabus.",
      suggestedAction: "Inject mandatory 14-hour SQL Window Functions & Analytics Lab module into semester 5 coursework.",
    },
    {
      skill: "Python",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 88,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 85,
      gapStatus: "ALIGNED",
      jobPostingsCount: 38400,
      syllabusNotes: "Thoroughly covered in CS201 Python Lab (Pandas, NumPy, data cleaning, Matplotlib / Seaborn visualization).",
      suggestedAction: "Maintain syllabus; introduce optional Polars / vectorized processing elective in semester 6.",
    },
    {
      skill: "Power BI",
      category: "Tooling & Frameworks",
      marketDemand: "High",
      marketDemandScore: 84,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 5,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 29800,
      syllabusNotes: "Zero business intelligence (BI) dashboarding tools present in university model curricula. Students rely on external non-accredited tutorials.",
      suggestedAction: "Add 15-hour interactive dashboarding workshop covering DAX expressions, data modeling, and automated executive reporting.",
    },
    {
      skill: "Statistics",
      category: "Analytical",
      marketDemand: "Medium",
      marketDemandScore: 68,
      curriculumCoverage: "Partial",
      curriculumCoverageScore: 55,
      gapStatus: "MODERATE GAP",
      jobPostingsCount: 19400,
      syllabusNotes: "Formal probability, distributions, and calculus covered in Engineering Mathematics III, but lacks practical hypothesis testing and A/B test analysis in Python/R.",
      suggestedAction: "Update Math III tutorial sessions to include Python SciPy practical hypothesis testing on real-world business datasets.",
    },
    {
      skill: "Excel",
      category: "Tooling & Frameworks",
      marketDemand: "High",
      marketDemandScore: 78,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 82,
      gapStatus: "ALIGNED",
      jobPostingsCount: 31200,
      syllabusNotes: "VLOOKUP/XLOOKUP, pivot tables, and financial formula modeling covered in first-year IT lab exercises.",
      suggestedAction: "Syllabus meets baseline enterprise requirements. Add 2 hours on Power Query automated ETL.",
    },
    {
      skill: "Tableau",
      category: "Tooling & Frameworks",
      marketDemand: "Medium",
      marketDemandScore: 62,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 10,
      gapStatus: "MODERATE GAP",
      jobPostingsCount: 16500,
      syllabusNotes: "Modern enterprise storytelling with Tableau Desktop is not included in current academic credits.",
      suggestedAction: "Offer self-paced Tableau student sandbox license with capstone project verification.",
    },
    {
      skill: "Snowflake & Cloud Warehousing",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 81,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 0,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 22400,
      syllabusNotes: "Syllabus teaches only local SQLite/MySQL on localhost; cloud data warehousing and serverless SQL query optimization are entirely absent.",
      suggestedAction: "Provide 10-hour cloud credit grant on Snowflake/BigQuery for analytical batch querying.",
    },
    {
      skill: "Data Storytelling & Executive Presentations",
      category: "Domain & Methodological",
      marketDemand: "Medium",
      marketDemandScore: 64,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 72,
      gapStatus: "ALIGNED",
      jobPostingsCount: 14800,
      syllabusNotes: "Covered in Technical Communication and semester 7 capstone project defense rubric.",
      suggestedAction: "Keep aligned; require business stakeholders in project evaluation panels.",
    },
  ],
  "Full-Stack Software Engineering": [
    {
      skill: "Modern TypeScript",
      category: "Core Technical",
      marketDemand: "Very High",
      marketDemandScore: 96,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 20,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 46200,
      syllabusNotes: "Only legacy untyped JavaScript (ES5) taught in CS601 Web Technologies; strict TypeScript types and generics omitted.",
      suggestedAction: "Transition Web Technologies course to strict TypeScript 5.x throughout all lab exercises.",
    },
    {
      skill: "React 19 & Next.js",
      category: "Tooling & Frameworks",
      marketDemand: "Very High",
      marketDemandScore: 92,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 10,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 41800,
      syllabusNotes: "Syllabus continues to test HTML5 DOM manipulation and legacy jQuery; component lifecycle and server components absent.",
      suggestedAction: "Replace jQuery syllabus with modern React 19 component architecture and server-side routing.",
    },
    {
      skill: "Node.js & Express REST APIs",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 84,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 80,
      gapStatus: "ALIGNED",
      jobPostingsCount: 34500,
      syllabusNotes: "Covered in elective module with practical CRUD API building and middleware routing.",
      suggestedAction: "Syllabus aligned with mid-tier product company requirements.",
    },
    {
      skill: "Docker & Containerization",
      category: "Tooling & Frameworks",
      marketDemand: "High",
      marketDemandScore: 86,
      curriculumCoverage: "Partial",
      curriculumCoverageScore: 40,
      gapStatus: "MODERATE GAP",
      jobPostingsCount: 31900,
      syllabusNotes: "Docker is mentioned as a 2-hour theoretical lecture without hands-on multi-stage Dockerfile builds.",
      suggestedAction: "Mandate Docker containerized submission for all software laboratory assignments.",
    },
    {
      skill: "Automated Testing (Playwright / Jest)",
      category: "Domain & Methodological",
      marketDemand: "High",
      marketDemandScore: 79,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 15,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 24700,
      syllabusNotes: "QA syllabus teaches manual test case templates on spreadsheets rather than automated end-to-end testing scripts.",
      suggestedAction: "Inject 8 hours of automated end-to-end testing with Playwright into Software Engineering (CS701).",
    },
    {
      skill: "Git & Collaborative Pull Requests",
      category: "Tooling & Frameworks",
      marketDemand: "High",
      marketDemandScore: 82,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 88,
      gapStatus: "ALIGNED",
      jobPostingsCount: 39000,
      syllabusNotes: "Students submit labs via GitHub/GitLab with branch protection and code review rubric.",
      suggestedAction: "Maintain practice; introduce automated GitHub Actions CI check.",
    },
  ],
  "Cloud & DevOps Engineering": [
    {
      skill: "Kubernetes Orchestration",
      category: "Core Technical",
      marketDemand: "Very High",
      marketDemandScore: 94,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 15,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 32400,
      syllabusNotes: "Cloud elective CS703 touches basic virtual machines (EC2) but omits Pods, Deployments, and Helm charts.",
      suggestedAction: "Introduce 16-hour K3s hands-on cluster lab in CS703 Cloud Computing elective.",
    },
    {
      skill: "Terraform & Infrastructure as Code",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 86,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 10,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 26100,
      syllabusNotes: "Cloud infrastructure is provisioned manually via web console rather than declarative IaC manifests.",
      suggestedAction: "Add Terraform HCL module to teach reproducible cloud provisioning.",
    },
    {
      skill: "Linux Internals & Bash Scripting",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 88,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 85,
      gapStatus: "ALIGNED",
      jobPostingsCount: 35600,
      syllabusNotes: "Solidly grounded in CS502 Operating Systems with shell scripting and process management.",
      suggestedAction: "High alignment with campus recruiter expectations.",
    },
    {
      skill: "CI/CD Pipeline Automation",
      category: "Tooling & Frameworks",
      marketDemand: "High",
      marketDemandScore: 83,
      curriculumCoverage: "Partial",
      curriculumCoverageScore: 45,
      gapStatus: "MODERATE GAP",
      jobPostingsCount: 28900,
      syllabusNotes: "Basic Jenkins covered, but GitHub Actions, GitLab CI, and container scanning are omitted.",
      suggestedAction: "Modernize Jenkins labs to GitHub Actions workflows with secret management.",
    },
  ],
  "Artificial Intelligence & Machine Learning": [
    {
      skill: "Vector Databases & RAG Architecture",
      category: "Core Technical",
      marketDemand: "Very High",
      marketDemandScore: 97,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 10,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 28400,
      syllabusNotes: "AI courses focus exclusively on classical ML (SVMs, Decision Trees); modern embeddings and retrieval augmentation absent.",
      suggestedAction: "Inject 12-hour hands-on module building LangChain / LlamaIndex RAG pipelines with pgvector.",
    },
    {
      skill: "PyTorch & Deep Learning",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 89,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 82,
      gapStatus: "ALIGNED",
      jobPostingsCount: 31200,
      syllabusNotes: "Covered in B.Tech AI/DS 6th semester Deep Learning laboratory using GPU workstations.",
      suggestedAction: "Strongly aligned. Expand to include LoRA parameter-efficient fine-tuning.",
    },
    {
      skill: "Multi-Agent AI Frameworks",
      category: "Tooling & Frameworks",
      marketDemand: "Very High",
      marketDemandScore: 91,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 5,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 18900,
      syllabusNotes: "Surging recruiter demand (+142.5% YoY velocity) completely unrepresented in current curriculum.",
      suggestedAction: "Add capstone project option focused on multi-agent collaboration and tool-calling.",
    },
    {
      skill: "Linear Algebra & Optimization",
      category: "Analytical",
      marketDemand: "Medium",
      marketDemandScore: 72,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 90,
      gapStatus: "ALIGNED",
      jobPostingsCount: 22100,
      syllabusNotes: "Rigorous mathematical foundation in semester 2 & 3 engineering math syllabus.",
      suggestedAction: "Excellent academic foundation; keep connected to gradient descent implementations.",
    },
  ],
  "Electric Vehicle Powertrain Engineering": [
    {
      skill: "Battery Management Systems (BMS)",
      category: "Core Technical",
      marketDemand: "Very High",
      marketDemandScore: 93,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 15,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 14200,
      syllabusNotes: "Mechanical engineering syllabus covers IC engine thermodynamics; lithium-ion thermal runaway & BMS telemetry absent.",
      suggestedAction: "Urgent Board of Studies action: Inject 20-hour BMS firmware & state-of-charge (SoC) estimation module.",
    },
    {
      skill: "CAN Bus & Automotive Telemetry",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 85,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 20,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 12800,
      syllabusNotes: "Microcontroller course covers general UART/SPI; automotive CAN/LIN bus protocols not in lab syllabus.",
      suggestedAction: "Procure CAN bus transceivers for embedded lab and add hands-on packet sniffing exercises.",
    },
    {
      skill: "MATLAB & Simulink Powertrain Modeling",
      category: "Tooling & Frameworks",
      marketDemand: "High",
      marketDemandScore: 82,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 78,
      gapStatus: "ALIGNED",
      jobPostingsCount: 16400,
      syllabusNotes: "Simulink dynamic system modeling taught in 6th semester control systems lab.",
      suggestedAction: "Well aligned. Expand model templates to include dual-motor EV configurations.",
    },
  ],
  "Embedded Systems & IoT": [
    {
      skill: "FreeRTOS & Real-Time Kernels",
      category: "Core Technical",
      marketDemand: "Very High",
      marketDemandScore: 92,
      curriculumCoverage: "Missing",
      curriculumCoverageScore: 20,
      gapStatus: "CRITICAL GAP",
      jobPostingsCount: 19800,
      syllabusNotes: "Only bare-metal superloop programming on 8051/AVR taught; real-time task scheduling and semaphores absent.",
      suggestedAction: "Upgrade lab boards to ESP32/ARM Cortex-M and mandate FreeRTOS multitasking lab modules.",
    },
    {
      skill: "Embedded C / Modern C++",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 89,
      curriculumCoverage: "Covered",
      curriculumCoverageScore: 84,
      gapStatus: "ALIGNED",
      jobPostingsCount: 28400,
      syllabusNotes: "Solidly covered across programming fundamentals and microcontrollers courses.",
      suggestedAction: "Maintain rigor; introduce static code analysis tools (MISRA C guidelines).",
    },
    {
      skill: "BLE & Wi-Fi IoT Protocols",
      category: "Core Technical",
      marketDemand: "High",
      marketDemandScore: 81,
      curriculumCoverage: "Partial",
      curriculumCoverageScore: 45,
      gapStatus: "MODERATE GAP",
      jobPostingsCount: 17200,
      syllabusNotes: "MQTT covered in theory; low-power Bluetooth (BLE) GATT profiles omitted from lab work.",
      suggestedAction: "Add hands-on BLE beacon and sensor telemetry broadcast practicals.",
    },
  ],
};

/**
 * Evaluates Curriculum Alignment dynamically based on the 5 selector dimensions
 */
export function evaluateCurriculumAlignment(
  course: string,
  programme: string,
  sector: string,
  role: string,
  district: string
): CurriculumAlignmentResult {
  const baseSkills = BASE_COURSE_SKILLS[course] ?? BASE_COURSE_SKILLS["Data Analytics"];

  // District-level demand adjustment multiplier
  const districtMultiplier = district.includes("Bengaluru")
    ? 1.12
    : district.includes("Hyderabad")
    ? 1.08
    : district.includes("Pune")
    ? 1.05
    : 1.0;

  const evaluatedSkills: SkillAlignmentItem[] = baseSkills.map((item) => {
    const adjustedDemandScore = Math.min(100, Math.round(item.marketDemandScore * districtMultiplier));
    const adjustedPostings = Math.round(item.jobPostingsCount * districtMultiplier);

    // Calculate gap status rigorously based on user specification
    let gapStatus: AlignmentGapStatus = "ALIGNED";
    if (
      (item.marketDemand === "Very High" || item.marketDemand === "High") &&
      item.curriculumCoverage === "Missing"
    ) {
      gapStatus = "CRITICAL GAP";
    } else if (
      (item.marketDemand === "Medium" && item.curriculumCoverage === "Missing") ||
      (item.marketDemand === "High" && item.curriculumCoverage === "Partial") ||
      (item.marketDemand === "Medium" && item.curriculumCoverage === "Partial")
    ) {
      gapStatus = "MODERATE GAP";
    } else if (item.curriculumCoverage === "Covered") {
      gapStatus = "ALIGNED";
    } else {
      gapStatus = "MODERATE GAP";
    }

    return {
      ...item,
      marketDemandScore: adjustedDemandScore,
      jobPostingsCount: adjustedPostings,
      gapStatus,
    };
  });

  const criticalGapsCount = evaluatedSkills.filter((s) => s.gapStatus === "CRITICAL GAP").length;
  const moderateGapsCount = evaluatedSkills.filter((s) => s.gapStatus === "MODERATE GAP").length;
  const alignedCount = evaluatedSkills.filter((s) => s.gapStatus === "ALIGNED").length;

  const totalCoverageScore = evaluatedSkills.reduce((acc, s) => acc + s.curriculumCoverageScore, 0);
  const totalDemandScore = evaluatedSkills.reduce((acc, s) => acc + s.marketDemandScore, 0);
  const overallAlignmentIndex = Math.round((totalCoverageScore / totalDemandScore) * 100);

  return {
    course,
    programme,
    sector,
    role,
    district,
    overallAlignmentIndex,
    criticalGapsCount,
    moderateGapsCount,
    alignedCount,
    theoryToLabRatio: "58 : 42 (Theory Hrs : Lab Practical Hrs)",
    recommendedIntervention:
      criticalGapsCount > 0
        ? `Immediate syllabus intervention required: Inject missing core modules for ${criticalGapsCount} critical competency areas before the upcoming academic Board of Studies meeting.`
        : "Curriculum is well aligned with current quarterly industry hiring requisitions.",
    skills: evaluatedSkills,
  };
}

// =========================================================
// SECTION 6: COURSE HEALTH SYSTEM WITH EXPLAINABLE TELEMETRY
// =========================================================

export const RAW_COURSE_HEALTH_RECORDS: CourseHealthRecord[] = [
  {
    id: "prog-001",
    courseName: "B.Tech Artificial Intelligence & Data Science",
    degree: "Undergraduate (4-Year B.Tech)",
    department: "Department of AI & Computational Technologies",
    enrolledStudents: 180,
    graduatingBatch: "Class of 2027",
    healthScore: 91,
    status: "Industry Aligned",
    marketEvidence:
      "Regional demand in Bengaluru & Hyderabad surged by +52.8% YoY with 42,000+ postings requiring Python, PyTorch, and RAG architectures. Campus recruiters offered a median fresher CTC of ₹9.8 LPA with 94.2% placement clearance within 6 months.",
    skillsCausingStatus: [
      {
        skill: "PyTorch & Deep Learning Foundations",
        impact: "Positive Driver",
        reason: "Students build and evaluate custom neural architectures from scratch in semester 5 lab exercises.",
      },
      {
        skill: "Cloud AI & Vector Stores",
        impact: "Positive Driver",
        reason: "Direct integration of pgvector and cloud API sandboxes into semester 6 syllabus.",
      },
      {
        skill: "Multi-Agent Systems",
        impact: "Moderate Drag",
        reason: "Agentic orchestration is surging in industry (+142.5%), which requires introduction into capstone project briefs.",
      },
    ],
    demandTrend: {
      direction: "Surging",
      percentageChange: 52.8,
      timeframe: "YoY Q3 2025 - Q3 2026",
      summary: "Extreme expansion across Enterprise Software, BFSI FinTech, and AI SaaS startups.",
    },
    curriculumCoverage: {
      overallCoveragePct: 89,
      lastRevisedYear: 2025,
      theoryHours: 420,
      labPracticalHours: 480,
      keyModulesMissing: ["Cognitive Multi-Agent Orchestration", "GPU Distributed Cluster Sharding"],
      keyModulesCovered: ["Python Data Science", "PyTorch / Transformers", "Relational & Vector DBs", "Applied Statistics"],
    },
    recommendation: {
      actionType: "Module Injection",
      title: "Introduce Multi-Agent Orchestration Capstone Elective",
      description: "Supplement the 7th-semester Deep Learning elective with 15 contact hours on Agentic AI frameworks to maintain premier institutional alignment.",
      targetTimeline: "Academic Session Spring 2027",
      expectedImpact: "Projected to increase tier-1 product company placement offers by +18%.",
    },
    placementVelocityPct: 94.2,
    fresherMedianCtcLpa: 9.8,
    regionalHiringRatio: "1 opening per 1.4 graduates (High Demand)",
  },
  {
    id: "prog-002",
    courseName: "B.Tech Information Technology",
    degree: "Undergraduate (4-Year B.Tech)",
    department: "Department of Information Technology",
    enrolledStudents: 240,
    graduatingBatch: "Class of 2027",
    healthScore: 74,
    status: "Needs Revision",
    marketEvidence:
      "While overall IT requisitions remain stable (+8.5% YoY), companies have largely phased out manual testing and legacy Java servlet roles, replacing them with requirements for Playwright automation and Spring Boot / TypeScript microservices.",
    skillsCausingStatus: [
      {
        skill: "Manual Software QA Testing",
        impact: "Severe Drag",
        reason: "Coursework still spends 30 lecture hours teaching manual spreadsheet test plans while recruiters demand automated CI/CD test automation.",
      },
      {
        skill: "Legacy Java Servlets / JSP",
        impact: "Severe Drag",
        reason: "Server-side web technologies syllabus has not been updated since 2021, leading to interview rejections during technical screening.",
      },
      {
        skill: "Relational Database Fundamentals",
        impact: "Positive Driver",
        reason: "SQL query optimization and ACID transaction handling remain well taught and respected by recruiters.",
      },
    ],
    demandTrend: {
      direction: "Stable",
      percentageChange: 8.5,
      timeframe: "YoY Q3 2025 - Q3 2026",
      summary: "Core enterprise IT hiring remains solid, but job descriptions demand modern automation pipelines.",
    },
    curriculumCoverage: {
      overallCoveragePct: 68,
      lastRevisedYear: 2021,
      theoryHours: 520,
      labPracticalHours: 360,
      keyModulesMissing: ["Automated Testing with Playwright/Cypress", "TypeScript & React 19", "Microservices with Spring Boot"],
      keyModulesCovered: ["Core Java", "Database Management", "Computer Networks", "Operating Systems"],
    },
    recommendation: {
      actionType: "Board of Studies Action",
      title: "Comprehensive Modernization of Web Tech & Software QA Syllabi",
      description: "Convene Board of Studies to phase out JSP/Servlets in favor of modern REST/gRPC architectures and replace manual QA labs with automated testing scripts.",
      targetTimeline: "Immediate - Board Meeting November 2026",
      expectedImpact: "Closes 3 critical syllabus gaps and brings program alignment from 68% to 85%.",
    },
    placementVelocityPct: 82.5,
    fresherMedianCtcLpa: 6.8,
    regionalHiringRatio: "1 opening per 3.2 graduates (Moderate Competition)",
  },
  {
    id: "prog-003",
    courseName: "B.Tech Electronics & Communication (IoT & Embedded)",
    degree: "Undergraduate (4-Year B.Tech)",
    department: "Department of Electronics & Communication Engineering",
    enrolledStudents: 320,
    graduatingBatch: "Class of 2027",
    healthScore: 66,
    status: "Significant Skill Gap",
    marketEvidence:
      "Automotive embedded systems and IoT device hiring grew by +24.2% YoY driven by EV manufacturing clusters in Pune and Chennai. However, only 38% of graduates cleared technical screening due to lack of practical RTOS and CAN bus experience.",
    skillsCausingStatus: [
      {
        skill: "CAN Bus Protocol & Automotive Telemetry",
        impact: "Severe Drag",
        reason: "Recruiters from Tata Motors, Ather, and Bosch require CAN bus debugging, which is completely absent from the current university curriculum.",
      },
      {
        skill: "FreeRTOS Multitasking",
        impact: "Severe Drag",
        reason: "Labs use 8-bit microcontrollers with basic delay loops rather than real-time kernels and task synchronization.",
      },
      {
        skill: "Analog Circuit Fundamentals",
        impact: "Positive Driver",
        reason: "Strong foundation in signal processing and semiconductor physics.",
      },
    ],
    demandTrend: {
      direction: "Growing",
      percentageChange: 24.2,
      timeframe: "YoY Q3 2025 - Q3 2026",
      summary: "High industry demand in electric mobility, consumer electronics, and industrial smart sensors.",
    },
    curriculumCoverage: {
      overallCoveragePct: 56,
      lastRevisedYear: 2022,
      theoryHours: 560,
      labPracticalHours: 320,
      keyModulesMissing: ["FreeRTOS Kernel Architecture", "CAN Bus / OBD-II Diagnostics", "ARM Cortex-M Debugging (JTAG/SWD)"],
      keyModulesCovered: ["Microprocessors & Microcontrollers (8051)", "Analog Communication", "Digital Signal Processing"],
    },
    recommendation: {
      actionType: "Elective Overhaul",
      title: "Procure ARM Cortex/ESP32 Boards & Overhaul Embedded Lab Syllabus",
      description: "Replace legacy 8051 boards with ARM Cortex-M4 development kits. Introduce 30 hours of hands-on FreeRTOS task scheduling and automotive bus protocol analysis.",
      targetTimeline: "Academic Session Spring 2027",
      expectedImpact: "Projected to lift embedded core placement conversion from 38% to 72%.",
    },
    placementVelocityPct: 71.0,
    fresherMedianCtcLpa: 5.5,
    regionalHiringRatio: "1 opening per 2.6 graduates (Available Demand, Skill Constrained)",
  },
  {
    id: "prog-004",
    courseName: "B.Sc Applied Computing (Legacy Desktop Track)",
    degree: "Undergraduate (3-Year B.Sc)",
    department: "Department of Computer Applications & Sciences",
    enrolledStudents: 140,
    graduatingBatch: "Class of 2027",
    healthScore: 41,
    status: "Low Observed Market Relevance",
    marketEvidence:
      "Enterprise job postings requiring legacy desktop computing (Visual Basic, WinForms, monolithic desktop apps) have collapsed by -38.5% YoY. Campus recruitment for this program experienced a 60% decline in visiting employers over the past two seasons.",
    skillsCausingStatus: [
      {
        skill: "Visual Basic / WinForms Architecture",
        impact: "Severe Drag",
        reason: "Monolithic desktop GUI programming has virtually zero observed hiring demand in the 2026 campus recruitment market.",
      },
      {
        skill: "Local Access Database File Management",
        impact: "Severe Drag",
        reason: "Syllabus teaches local .mdb files instead of client-server cloud databases or distributed data stores.",
      },
      {
        skill: "Basic Procedural C Programming",
        impact: "Moderate Drag",
        reason: "Useful basic syntax, but taught in isolation without object-oriented patterns, version control, or modern tooling.",
      },
    ],
    demandTrend: {
      direction: "Declining",
      percentageChange: -38.5,
      timeframe: "YoY Q3 2025 - Q3 2026",
      summary: "Rapidly shrinking demand as enterprises migrate all remaining legacy tools to modern web and cloud platforms.",
    },
    curriculumCoverage: {
      overallCoveragePct: 34,
      lastRevisedYear: 2018,
      theoryHours: 480,
      labPracticalHours: 240,
      keyModulesMissing: ["Web Technologies & REST", "Cloud Fundamentals", "Modern Relational SQL", "Git Version Control"],
      keyModulesCovered: ["Procedural Programming in C", "Desktop Database Tools", "Fundamentals of Computing"],
    },
    recommendation: {
      actionType: "Board of Studies Action",
      title: "Fundamental Restructuring into B.Sc Cloud & Web Applications",
      description: "De-commission the legacy desktop syllabus. Re-brand and overhaul the degree track to focus on modern full-stack web development, Linux systems, and cloud fundamentals.",
      targetTimeline: "Immediate Board Action - Academic Year 2027-28 Intake",
      expectedImpact: "Avoids academic obsolescence and restores graduate employability from under 40% to parity with standard IT cohorts.",
    },
    placementVelocityPct: 38.2,
    fresherMedianCtcLpa: 3.2,
    regionalHiringRatio: "1 opening per 14.8 graduates (Severely Depressed Market Demand)",
  },
  {
    id: "prog-005",
    courseName: "Bachelor of Computer Applications (Generic Web Track)",
    degree: "Undergraduate (3-Year BCA)",
    department: "School of Computer Science & Applications",
    enrolledStudents: 360,
    graduatingBatch: "Class of 2027",
    healthScore: 58,
    status: "Potential Oversupply Risk",
    marketEvidence:
      "Over 34,000 BCA graduates compete annually in the regional corridor for only 2,800 entry-level junior web positions. Entry-level junior web developer openings fell by -12.0% as automation and AI coding co-pilots reduce headcount needs for basic HTML/CSS coders.",
    skillsCausingStatus: [
      {
        skill: "Basic HTML/CSS & Vanilla JavaScript",
        impact: "Oversupplied",
        reason: "Massively oversupplied in the entry-level talent pool; companies filter candidates using full-stack frameworks, backend APIs, and cloud databases.",
      },
      {
        skill: "Lack of TypeScript or Cloud Deployment",
        impact: "Severe Drag",
        reason: "Graduates cannot build end-to-end applications or deploy to modern cloud environments, causing extreme resume drop-off.",
      },
      {
        skill: "Responsive Design Foundations",
        impact: "Positive Driver",
        reason: "Students understand CSS layout fundamentals, Flexbox, and basic web styling conventions.",
      },
    ],
    demandTrend: {
      direction: "Saturated",
      percentageChange: -12.0,
      timeframe: "YoY Q3 2025 - Q3 2026",
      summary: "Severe regional labor market saturation: graduate output exceeds qualified entry-level vacancies by a factor of 12x.",
    },
    curriculumCoverage: {
      overallCoveragePct: 52,
      lastRevisedYear: 2022,
      theoryHours: 500,
      labPracticalHours: 340,
      keyModulesMissing: ["Cloud Deployment (AWS/Vercel)", "Backend API Engineering (Node/Express)", "Relational Databases & SQL"],
      keyModulesCovered: ["HTML5 / CSS3", "Client-side JavaScript", "Web Authoring Tools"],
    },
    recommendation: {
      actionType: "Capacity Rationalization",
      title: "Mandate Full-Stack & Cloud Specialization Tracks",
      description: "Differentiate graduates by requiring students to declare an advanced specialization (e.g. Full-Stack MERN, Cloud Infrastructure, or Data Engineering) rather than graduating with generic basic web skills.",
      targetTimeline: "Academic Session Autumn 2027",
      expectedImpact: "Breaks graduates out of saturated tier-3 commodity candidate pools and raises interview conversion by +35%.",
    },
    placementVelocityPct: 62.4,
    fresherMedianCtcLpa: 4.1,
    regionalHiringRatio: "1 opening per 12.1 graduates (High Oversupply)",
  },
  {
    id: "prog-006",
    courseName: "B.Tech Computer Science & Engineering (Core)",
    degree: "Undergraduate (4-Year B.Tech)",
    department: "Department of Computer Science & Engineering",
    enrolledStudents: 480,
    graduatingBatch: "Class of 2027",
    healthScore: 84,
    status: "Industry Aligned",
    marketEvidence:
      "Core CSE remains the most sought-after campus degree with 68,000+ national enterprise requisitions. Algorithm and system design foundations provide resilient placement conversion across tech majors.",
    skillsCausingStatus: [
      {
        skill: "Data Structures & Algorithms",
        impact: "Positive Driver",
        reason: "Deep foundational preparation in competitive coding, trees, graphs, and dynamic programming.",
      },
      {
        skill: "Distributed Systems & Cloud Elective",
        impact: "Positive Driver",
        reason: "Strong student enrollment in Docker and cloud architecture electives.",
      },
      {
        skill: "Automated QA & Modern TypeScript",
        impact: "Moderate Drag",
        reason: "Core web technologies course still lags behind production frameworks.",
      },
    ],
    demandTrend: {
      direction: "Growing",
      percentageChange: 18.4,
      timeframe: "YoY Q3 2025 - Q3 2026",
      summary: "Steady, robust hiring across product engineering, consulting, and enterprise cloud migration.",
    },
    curriculumCoverage: {
      overallCoveragePct: 82,
      lastRevisedYear: 2024,
      theoryHours: 480,
      labPracticalHours: 420,
      keyModulesMissing: ["TypeScript End-to-End Testing", "Vector Databases"],
      keyModulesCovered: ["Data Structures & Algorithms", "Operating Systems", "DBMS", "Computer Networks"],
    },
    recommendation: {
      actionType: "Module Injection",
      title: "Introduce TypeScript and Vector DB modules into core electives",
      description: "Add 12 hours of modern web stack and vector search practicals into 6th and 7th semester coursework.",
      targetTimeline: "Academic Session Spring 2027",
      expectedImpact: "Enhances average placement package to ₹8.5+ LPA.",
    },
    placementVelocityPct: 91.5,
    fresherMedianCtcLpa: 8.2,
    regionalHiringRatio: "1 opening per 1.8 graduates (Strong Hiring Demand)",
  },
];

// =========================================================
// SECTION 7: CURRICULUM RECOMMENDATION ENGINE (EXPLAINABLE)
// =========================================================

export interface ExplainableCurriculumRecommendation {
  id: string;
  courseId: string;
  courseName: string;
  detectedGaps: string[];
  title: string;
  recommendationType: "Module Injection" | "Hands-on Project" | "Assessment Modernization" | "Elective Overhaul";
  priority: "Immediate (Next Semester)" | "High" | "Medium-Term";
  
  // Mandatory explainable fields:
  reason: string;
  supportingMarketEvidence: string;
  relatedRoles: string[];
  suggestedLearningOutcome: string;
  suggestedAssessment: string;
  
  // AI Deep Explanation & Context:
  aiExplanation: {
    pedagogicalRationale: string;
    industryDeficitContext: string;
    implementationRoadmap: string;
  };
  suggestedContactHours: number;
  advocatingEmployers: string[];
}

export const RAW_EXPLAINABLE_RECOMMENDATIONS: ExplainableCurriculumRecommendation[] = [
  // User's exact Example Course: Data Analytics
  {
    id: "rec-da-001",
    courseId: "course-da",
    courseName: "Data Analytics",
    detectedGaps: ["SQL", "Power BI", "Applied Statistics"],
    title: "1. Add SQL for Data Analytics Module (Analytical Queries, CTEs & Window Functions)",
    recommendationType: "Module Injection",
    priority: "Immediate (Next Semester)",
    reason:
      "Enterprise data teams expect fresh analyst recruits to write complex multi-table analytical queries, common table expressions (CTEs), and window functions (RANK, DENSE_RANK, LEAD, LAG). The current academic syllabus only teaches basic single-table SELECT and theoretical normalization.",
    supportingMarketEvidence:
      "42,100 active Q3 2026 data analyst postings explicitly require advanced SQL. Recruiters report that 64% of campus candidates fail live SQL query technical screens due to lack of practical window function experience.",
    relatedRoles: ["Data Analyst", "Business Intelligence Analyst", "Product Analyst", "Data Operations Specialist"],
    suggestedLearningOutcome:
      "Students will be able to construct optimized analytical SQL queries using window functions, write robust CTEs for multi-stage aggregation, and optimize query plans for million-row datasets.",
    suggestedAssessment:
      "Timed hands-on SQL query lab exam executing live analytical queries on a PostgreSQL enterprise e-commerce database schema.",
    aiExplanation: {
      pedagogicalRationale:
        "Shifts database pedagogy from declarative storage theory to active analytical data transformation, mirroring real-world workflow in modern product analytics teams.",
      industryDeficitContext:
        "The gap between classroom relational algebra and enterprise analytics SQL is the single largest reason for fresher interview rejection in analytics hiring.",
      implementationRoadmap:
        "Allocate 14 contact hours in 5th-semester database lab: 6 hours on CTEs/Subqueries, 6 hours on Window Functions, and 2 hours on Query Plan Optimization.",
    },
    suggestedContactHours: 14,
    advocatingEmployers: ["Swiggy", "Flipkart", "CRED", "PhonePe", "Tiger Analytics", "Mu Sigma"],
  },
  {
    id: "rec-da-002",
    courseId: "course-da",
    courseName: "Data Analytics",
    detectedGaps: ["SQL", "Power BI", "Applied Statistics"],
    title: "2. Add Power BI Business Intelligence & DAX Data Modeling Module",
    recommendationType: "Module Injection",
    priority: "Immediate (Next Semester)",
    reason:
      "Business Intelligence tools are mandatory in over 70% of entry-level corporate analyst job specifications. Students currently receive zero institutional exposure to BI tools and are forced to rely on fragmented non-accredited online tutorials.",
    supportingMarketEvidence:
      "29,800 active job descriptions in Bengaluru, Hyderabad, and Delhi NCR demand Microsoft Power BI or Tableau proficiency for fresher analyst positions.",
    relatedRoles: ["BI Developer", "Operations Analyst", "Financial Analyst", "Marketing Analytics Lead"],
    suggestedLearningOutcome:
      "Students will build interactive star-schema analytical models, formulate DAX calculations (CALCULATE, FILTER, RELATED), and deploy automated executive reporting dashboards.",
    suggestedAssessment:
      "Submission of a published Power BI workspace analyzing a multi-year retail supply chain dataset with dynamic cross-filtering and drill-through KPIs.",
    aiExplanation: {
      pedagogicalRationale:
        "Connects raw database querying with visual executive decision-making, providing students with immediate tangible portfolio assets for campus interviews.",
      industryDeficitContext:
        "Recruiters demand candidates who can translate executive business questions into visual dashboards without requiring multi-month corporate onboarding.",
      implementationRoadmap:
        "Introduce 16 hours of dedicated lab practicals using student Microsoft 365 / Power BI Desktop licenses.",
    },
    suggestedContactHours: 16,
    advocatingEmployers: ["Deloitte", "KPMG", "EY", "Accenture", "Lenskart", "Amazon"],
  },
  {
    id: "rec-da-003",
    courseId: "course-da",
    courseName: "Data Analytics",
    detectedGaps: ["SQL", "Power BI", "Applied Statistics"],
    title: "3. Add Applied Statistics & Hypothesis Testing Component",
    recommendationType: "Module Injection",
    priority: "High",
    reason:
      "While students take formal Engineering Mathematics with pure probability calculus, they lack practical understanding of hypothesis testing (p-values, z-tests, t-tests, ANOVA) applied to product A/B tests and user retention telemetry.",
    supportingMarketEvidence:
      "19,400 analytics postings mandate understanding of experimentation frameworks and statistical significance in product decision making.",
    relatedRoles: ["Product Analyst", "Growth Analyst", "Experimentation Specialist", "Risk Analyst"],
    suggestedLearningOutcome:
      "Formulate statistical hypotheses, execute two-sample t-tests and chi-squared tests in Python SciPy, and correctly interpret confidence intervals for commercial business telemetry.",
    suggestedAssessment:
      "Practical notebook assignment conducting a statistical A/B test analysis on e-commerce checkout funnel conversion rates.",
    aiExplanation: {
      pedagogicalRationale:
        "Transforms abstract probability math into an intuitive scientific toolkit for empirical product experimentation and commercial risk assessment.",
      industryDeficitContext:
        "Candidates frequently confuse correlation with causation and misinterpret p-values during product analytics case interviews.",
      implementationRoadmap:
        "Infuse 10 hours of applied statistical computing into existing Math III / Data Mining lab curriculum.",
    },
    suggestedContactHours: 10,
    advocatingEmployers: ["MakeMyTrip", "Urban Company", "Zerodha", "Zomato", "Fractal Analytics"],
  },
  {
    id: "rec-da-004",
    courseId: "course-da",
    courseName: "Data Analytics",
    detectedGaps: ["SQL", "Power BI", "Applied Statistics"],
    title: "4. Add Industry-Oriented Capstone Project (E-Commerce Customer Retention Cohort)",
    recommendationType: "Hands-on Project",
    priority: "Immediate (Next Semester)",
    reason:
      "Students typically present generic academic projects (e.g. standard Iris dataset or Titanic classification). Recruiters require demonstrable proof of tackling messy, real-world business analytics scenarios.",
    supportingMarketEvidence:
      "88% of tech analytics interview loops require portfolio code review or a presentation of an end-to-end data project during final technical interviews.",
    relatedRoles: ["Data Analyst", "Customer Analytics Associate", "Growth Analyst"],
    suggestedLearningOutcome:
      "Execute an end-to-end analytics lifecycle: raw SQL extraction, data cleansing in Python, cohort retention analysis, and stakeholder dashboard presentation.",
    suggestedAssessment:
      "Public GitHub repository with documentation, reproducible Jupyter notebook, interactive dashboard, and a 5-minute video executive brief.",
    aiExplanation: {
      pedagogicalRationale:
        "Project-based learning provides synthesizing evidence of competencies across database querying, statistical evaluation, and visual business communication.",
      industryDeficitContext:
        "Standard textbook projects fail to distinguish candidates; real-world cohort retention projects demonstrate immediate enterprise readiness.",
      implementationRoadmap:
        "24 lab contact hours across 6th semester or final-year mini-project milestone.",
    },
    suggestedContactHours: 24,
    advocatingEmployers: ["Blinkit", "JioCinema", "Nykaa", "InMobi", "Paytm"],
  },
  {
    id: "rec-da-005",
    courseId: "course-da",
    courseName: "Data Analytics",
    detectedGaps: ["SQL", "Power BI", "Applied Statistics"],
    title: "5. Update Practical Assessment: Live Code Review & Interactive Dashboard Defense",
    recommendationType: "Assessment Modernization",
    priority: "High",
    reason:
      "Traditional written pen-and-paper exams on SQL syntax fail to evaluate whether students can debug broken queries or defend data insights under executive scrutiny.",
    supportingMarketEvidence:
      "Industry recruitment panels test candidates through live coding pairs and case defense rather than written multiple-choice examinations.",
    relatedRoles: ["All Analytics & Data Roles"],
    suggestedLearningOutcome:
      "Articulate analytical methodologies verbally, defend data cleaning decisions, and adapt live SQL queries in response to dynamic interviewer inquiries.",
    suggestedAssessment:
      "15-minute live oral defense of an interactive analytical dashboard before an industry-accredited academic jury.",
    aiExplanation: {
      pedagogicalRationale:
        "Aligns academic examination rubrics with authentic industry evaluation standards, removing the disconnect between grades and employability.",
      industryDeficitContext:
        "Students with 9+ CGPA frequently stumble in interview defense because traditional exams never required oral defense of analytical assumptions.",
      implementationRoadmap:
        "Adopt as semester end lab examination rubric replacing 50% of the theoretical pen-and-paper component.",
    },
    suggestedContactHours: 6,
    advocatingEmployers: ["NASSCOM IT-ITeS SSC", "AICTE Model Curriculum Board", "Infosys", "Wipro"],
  },

  // Additional Course: Full-Stack Software Engineering
  {
    id: "rec-fs-001",
    courseId: "course-fs",
    courseName: "Full-Stack Software Engineering",
    detectedGaps: ["TypeScript", "Next.js & React 19", "Automated Testing"],
    title: "Inject Strict TypeScript 5.x into Web Engineering Syllabi",
    recommendationType: "Module Injection",
    priority: "Immediate (Next Semester)",
    reason:
      "92% of enterprise web development teams mandate strict TypeScript over untyped JavaScript to prevent runtime bugs. Current curriculum teaches only ES5 script tags.",
    supportingMarketEvidence:
      "46,200 active postings in India specify TypeScript proficiency as a non-negotiable hiring criterion.",
    relatedRoles: ["Frontend Engineer", "Full Stack Developer", "Software Engineer"],
    suggestedLearningOutcome:
      "Write strongly typed React components, build type-safe API contracts with Zod, and leverage generics for reusable software modules.",
    suggestedAssessment:
      "Build a TypeScript-strict full-stack dashboard with zero type assertion bypasses (`any`).",
    aiExplanation: {
      pedagogicalRationale:
        "Encourages defensive programming and architectural thinking early in the student software engineering lifecycle.",
      industryDeficitContext:
        "Enterprises incur massive retraining overheads teaching TypeScript syntax to fresh campus recruits who only know untyped JavaScript.",
      implementationRoadmap:
        "Replace 16 hours of legacy HTML/DOM labs with TypeScript strict development.",
    },
    suggestedContactHours: 16,
    advocatingEmployers: ["Razorpay", "CRED", "Postman", "Swiggy"],
  },
  {
    id: "rec-fs-002",
    courseId: "course-fs",
    courseName: "Full-Stack Software Engineering",
    detectedGaps: ["Automated Testing", "CI/CD"],
    title: "Replace Manual QA Spreadsheets with Automated Playwright Testing Suites",
    recommendationType: "Assessment Modernization",
    priority: "Immediate (Next Semester)",
    reason:
      "Manual software testing roles have dropped by 44.5% YoY, while Software Development Engineers in Test (SDET) and automation engineers command top fresher salary premiums.",
    supportingMarketEvidence:
      "24,700 automation testing postings observed in Q3 2026 vs only 3,120 manual testing openings.",
    relatedRoles: ["SDET", "Full Stack Engineer", "QA Automation Engineer"],
    suggestedLearningOutcome:
      "Write automated end-to-end browser tests in Playwright, implement unit tests in Vitest/Jest, and integrate test suites into GitHub Actions CI pipelines.",
    suggestedAssessment:
      "Automated CI check verifying that student pull requests achieve >80% test coverage before grading.",
    aiExplanation: {
      pedagogicalRationale:
        "Embeds test-driven development (TDD) as a natural habit rather than an afterthought.",
      industryDeficitContext:
        "Modern CI/CD environments automatically reject code without passing automated tests; students must experience this constraint before graduation.",
      implementationRoadmap:
        "Inject 12 contact hours into Software Engineering (CS701).",
    },
    suggestedContactHours: 12,
    advocatingEmployers: ["BrowserStack", "Postman", "Flipkart", "TCS Digital"],
  },
];

// =========================================================
// SECTION 8: QUALIFICATION & COURSE MAPPING SYSTEM
// =========================================================

export interface TrainingCourseOption {
  courseName: string;
  programmeType: string;
  duration: string;
  institutionType: string;
  alignmentPct: number;
}

export interface RoleQualificationCourseMapping {
  id: string;
  role: string;
  roleCategory: string;
  requiredSkills: string[];
  qualificationTitle: string;
  qualificationCode: string;
  nsqfLevel: number;
  awardingBody: string;
  trainingCourses: TrainingCourseOption[];
  minimumEligibility: string;
  updatedAt: string;
}

export const RAW_ROLE_QUALIFICATION_MAPPINGS: RoleQualificationCourseMapping[] = [
  // User's exact Example: Data Analyst
  {
    id: "map-001",
    role: "Data Analyst",
    roleCategory: "Analytics & Business Intelligence",
    requiredSkills: ["SQL", "Python", "Statistics", "Power BI", "Excel", "Data Visualization"],
    qualificationTitle: "Associate Data Analyst Qualification Pack",
    qualificationCode: "SSC/Q8102",
    nsqfLevel: 6,
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    minimumEligibility: "Bachelor's Degree in Engineering, Mathematics, Statistics, Computer Applications, or equivalent",
    trainingCourses: [
      {
        courseName: "PG Diploma in Business Analytics & Intelligence",
        programmeType: "Postgraduate Diploma",
        duration: "1 Year (Full-time)",
        institutionType: "University Department / Autonomous Institute",
        alignmentPct: 92,
      },
      {
        courseName: "B.Tech Artificial Intelligence & Data Science",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "Affiliated Engineering College",
        alignmentPct: 88,
      },
      {
        courseName: "Certificate in Applied Data Analytics & Power BI",
        programmeType: "Vocational Certificate (NSQF-6)",
        duration: "6 Months",
        institutionType: "National Skill Training Institute (NSTI)",
        alignmentPct: 85,
      },
      {
        courseName: "B.Tech Computer Science & Engineering (Data Analytics Track)",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "University Department",
        alignmentPct: 81,
      },
    ],
    updatedAt: "2026-09-15",
  },
  {
    id: "map-002",
    role: "Full Stack Software Developer",
    roleCategory: "Software Engineering & Architecture",
    requiredSkills: ["Modern TypeScript", "React 19 & Next.js", "Node.js REST/gRPC", "Docker", "SQL Databases", "Git"],
    qualificationTitle: "Software Developer - Full Stack Specialization",
    qualificationCode: "SSC/Q0501",
    nsqfLevel: 6,
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    minimumEligibility: "B.Tech / B.E. / BCA / B.Sc Computer Science or equivalent technical diploma",
    trainingCourses: [
      {
        courseName: "B.Tech Computer Science & Engineering",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "University Department / Engineering College",
        alignmentPct: 86,
      },
      {
        courseName: "Vocational Diploma in Full-Stack Web Technologies",
        programmeType: "Vocational Diploma (NSQF-6)",
        duration: "1 Year",
        institutionType: "Polytechnic / Skill University",
        alignmentPct: 89,
      },
      {
        courseName: "B.Tech Information Technology",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "Affiliated College",
        alignmentPct: 78,
      },
    ],
    updatedAt: "2026-09-12",
  },
  {
    id: "map-003",
    role: "Cloud Solutions Architect",
    roleCategory: "Cloud Infrastructure & DevOps",
    requiredSkills: ["Docker & Kubernetes", "AWS / Azure Infrastructure", "Terraform / IaC", "CI/CD Automation", "Linux Internals"],
    qualificationTitle: "Cloud Infrastructure & DevOps Solutions Architect",
    qualificationCode: "SSC/Q8301",
    nsqfLevel: 7,
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    minimumEligibility: "B.Tech in CSE/IT/ECE or M.Tech with minimum 1 year specialized practical training",
    trainingCourses: [
      {
        courseName: "M.Tech Cloud Computing & Distributed Systems",
        programmeType: "Postgraduate Degree",
        duration: "2 Years",
        institutionType: "National Institute of Technology (NIT)",
        alignmentPct: 94,
      },
      {
        courseName: "B.Tech CSE with Cloud Computing Professional Elective",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "Autonomous Engineering College",
        alignmentPct: 82,
      },
      {
        courseName: "Advanced PG Certificate in Cloud Architecture & DevOps",
        programmeType: "Executive Certificate",
        duration: "9 Months",
        institutionType: "Center of Excellence in Cloud Computing",
        alignmentPct: 91,
      },
    ],
    updatedAt: "2026-09-18",
  },
  {
    id: "map-004",
    role: "AI & Machine Learning Specialist",
    roleCategory: "Artificial Intelligence & Cognitive Computing",
    requiredSkills: ["Python", "PyTorch / Transformers", "Vector Databases & RAG", "Linear Algebra", "Multi-Agent AI", "MLOps"],
    qualificationTitle: "Artificial Intelligence Specialist Qualification Pack",
    qualificationCode: "SSC/Q8104",
    nsqfLevel: 7,
    awardingBody: "IT-ITeS Sector Skills Council (NASSCOM / NSDC)",
    minimumEligibility: "B.Tech / M.Tech in CS/AI/Data Science, MCA with mathematics background",
    trainingCourses: [
      {
        courseName: "B.Tech Artificial Intelligence & Data Science",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "University Department",
        alignmentPct: 92,
      },
      {
        courseName: "M.Tech Computational Intelligence & Data Science",
        programmeType: "Postgraduate Degree",
        duration: "2 Years",
        institutionType: "State Technical University",
        alignmentPct: 95,
      },
      {
        courseName: "PG Diploma in Applied Generative AI & Machine Learning",
        programmeType: "Postgraduate Diploma",
        duration: "1 Year",
        institutionType: "AI Innovation Center",
        alignmentPct: 89,
      },
    ],
    updatedAt: "2026-09-10",
  },
  {
    id: "map-005",
    role: "Electric Vehicle Powertrain Engineer",
    roleCategory: "Automotive & Electric Mobility",
    requiredSkills: ["Battery Management Systems (BMS)", "CAN Bus Telemetry", "MATLAB / Simulink", "Embedded C", "Thermal Management"],
    qualificationTitle: "Automotive Electric Vehicle Embedded Systems Specialist",
    qualificationCode: "ASDC/Q4001",
    nsqfLevel: 6,
    awardingBody: "Automotive Skills Development Council (ASDC)",
    minimumEligibility: "B.Tech in Mechanical, Automobile, Electrical, or Electronics Engineering",
    trainingCourses: [
      {
        courseName: "B.Tech Mechanical Engineering (EV Specialization)",
        programmeType: "Undergraduate Degree",
        duration: "4 Years",
        institutionType: "Autonomous Engineering College",
        alignmentPct: 76,
      },
      {
        courseName: "Advanced Diploma in Electric Vehicle Engineering & BMS",
        programmeType: "Postgraduate Diploma",
        duration: "1 Year",
        institutionType: "Automotive Research Institute",
        alignmentPct: 93,
      },
      {
        courseName: "Certificate in Automotive Embedded & CAN Protocol",
        programmeType: "Vocational Certificate",
        duration: "6 Months",
        institutionType: "Industrial Training Center",
        alignmentPct: 87,
      },
    ],
    updatedAt: "2026-09-14",
  },
];

// =========================================================
// SECTION 9: TRAINING CAPACITY & LAB BANDWIDTH DATA MODELS
// =========================================================

export interface FacultyCertificationRecord {
  id: string;
  name: string;
  department: string;
  title: string;
  credentials: string[];
  validUntil: string;
  status: "Active" | "Renewal Pending" | "In Training";
  menteeCapacity: number;
  activeMentees: number;
  domain: string;
  contactEmail: string;
}

export interface ComputingLabQuota {
  id: string;
  name: string;
  category: "AI & High Performance" | "Cloud Sandboxes" | "Systems & Embedded" | "Software Engineering";
  totalWorkstations: number;
  gpuAcceleratedWorkstations: number;
  cloudSandboxQuota: number;
  activeUtilizationPct: number;
  peakTimeSlot: string;
  bottleneckSeverity: "Optimal" | "Constrained" | "Critical";
  specs: string;
  activeCourses: string[];
  hourlySchedule: {
    morningSlotPct: number; // 8am - 12pm
    afternoonSlotPct: number; // 12pm - 4pm
    eveningSlotPct: number; // 4pm - 8pm
  };
}

export interface LabBottleneckAlert {
  id: string;
  labName: string;
  severity: "Critical" | "Warning" | "Info";
  timeWindow: string;
  description: string;
  suggestedRemediation: string;
  affectedStudentsCount: number;
}

export interface IndustryValidationRecord {
  id: string;
  companyName: string;
  slug: string;
  industry: string;
  mouStatus: "Active Campus MoU" | "Strategic Talent Partner" | "Curriculum Co-Designer";
  verifiedHiringSignalsCount: number;
  coDevelopedModules: string[];
  nsqfAlignmentLevel: number;
  hiringConfidenceScore: number;
  verifiedMinCtcLpa: number;
  verifiedMaxCtcLpa: number;
  lastValidationDate: string;
  provenanceStatement: string;
}

export interface StudentSkillGapBreakdown {
  roleTitle: string;
  sector: string;
  overallMatchPct: number;
  curriculumCoveredSkills: {
    skill: string;
    depth: string;
    coveredInCourse: string;
  }[];
  personalAcquiredSkills: {
    skill: string;
    proficiency: "Beginner" | "Intermediate" | "Advanced";
    verified: boolean;
  }[];
  criticalMarketGaps: {
    skill: string;
    demandLevel: "Very High" | "High" | "Medium";
    priority: "Immediate" | "Recommended";
    recommendedModule: string;
    suggestedContactHours: number;
    interventionId: string;
  }[];
  feedbackTelemetry: {
    employabilityReadinessIndex: number;
    projectedInterviewConversionRate: number;
    regionalMedianCtcDelta: string;
  };
}

// ---------------------------------------------------------
// SECTION 9: RAW DATASETS FOR TRAINING CAPACITY & READINESS
// ---------------------------------------------------------

export const RAW_FACULTY_CERTIFICATIONS: FacultyCertificationRecord[] = [
  {
    id: "fac-001",
    name: "Dr. Arvind Subramaniam",
    department: "Computer Science & Engineering",
    title: "Professor & Lab Director",
    credentials: ["AWS Certified Solutions Architect Professional", "NVIDIA DLI GenAI Educator"],
    validUntil: "2027-11",
    status: "Active",
    menteeCapacity: 25,
    activeMentees: 22,
    domain: "Distributed Cloud Architecture & GenAI",
    contactEmail: "arvind.s@eng.edu",
  },
  {
    id: "fac-002",
    name: "Dr. Meenakshi Sundaram",
    department: "Artificial Intelligence & Data Science",
    title: "Associate Professor",
    credentials: ["Google Cloud Professional Data Engineer", "TensorFlow Certified Developer"],
    validUntil: "2027-04",
    status: "Active",
    menteeCapacity: 20,
    activeMentees: 19,
    domain: "Applied Machine Learning & Vector Search",
    contactEmail: "meenakshi.s@eng.edu",
  },
  {
    id: "fac-003",
    name: "Prof. Rajeshwari Nair",
    department: "Information Technology",
    title: "Assistant Professor",
    credentials: ["Certified Kubernetes Administrator (CKA)", "Linux Foundation LFCS"],
    validUntil: "2026-10",
    status: "Renewal Pending",
    menteeCapacity: 20,
    activeMentees: 16,
    domain: "DevOps & Container Orchestration",
    contactEmail: "rajeshwari.n@eng.edu",
  },
  {
    id: "fac-004",
    name: "Prof. Karthik Venkatesh",
    department: "Electronics & Communication",
    title: "Assistant Professor",
    credentials: ["Arm Accredited Engineer (AAE)", "AICTE-ATAL IoT Hardware Specialist"],
    validUntil: "2028-02",
    status: "Active",
    menteeCapacity: 18,
    activeMentees: 17,
    domain: "Embedded Firmware & CAN Telemetry",
    contactEmail: "karthik.v@eng.edu",
  },
  {
    id: "fac-005",
    name: "Dr. Deepa Kulkarni",
    department: "Computer Science & Engineering",
    title: "Associate Professor",
    credentials: ["Microsoft Certified: Azure AI Engineer Associate"],
    validUntil: "2027-08",
    status: "Active",
    menteeCapacity: 22,
    activeMentees: 20,
    domain: "Data Analytics & Enterprise BI",
    contactEmail: "deepa.k@eng.edu",
  },
  {
    id: "fac-006",
    name: "Prof. Vikram Singhania",
    department: "Information Technology",
    title: "Senior Lecturer",
    credentials: ["Enrolled in NASSCOM Cloud Architecture Cohort"],
    validUntil: "2026-12",
    status: "In Training",
    menteeCapacity: 15,
    activeMentees: 8,
    domain: "Full-Stack Web & Microservices",
    contactEmail: "vikram.s@eng.edu",
  },
];

export const RAW_COMPUTING_LAB_QUOTAS: ComputingLabQuota[] = [
  {
    id: "lab-gpu-01",
    name: "Turing High-Performance AI & Cloud Cluster",
    category: "AI & High Performance",
    totalWorkstations: 60,
    gpuAcceleratedWorkstations: 60,
    cloudSandboxQuota: 300,
    activeUtilizationPct: 92,
    peakTimeSlot: "14:00 - 17:00 (Afternoon Peak)",
    bottleneckSeverity: "Critical",
    specs: "NVIDIA RTX 4080 Super (16GB VRAM), Dual Xeon, 64GB RAM, 10Gbps LAN",
    activeCourses: ["B.Tech AI & Data Science", "Deep Learning Elective", "Final Year Capstone"],
    hourlySchedule: {
      morningSlotPct: 74,
      afternoonSlotPct: 96,
      eveningSlotPct: 82,
    },
  },
  {
    id: "lab-cloud-02",
    name: "Distributed Systems & Cloud Computing Lab",
    category: "Cloud Sandboxes",
    totalWorkstations: 90,
    gpuAcceleratedWorkstations: 30,
    cloudSandboxQuota: 450,
    activeUtilizationPct: 78,
    peakTimeSlot: "10:00 - 13:00 (Morning Slot)",
    bottleneckSeverity: "Constrained",
    specs: "Intel Core i7-14700, 32GB RAM, AWS Educate & Azure Student Credit Sandboxes",
    activeCourses: ["B.Tech Computer Science", "DevOps & Cloud Architecture", "Full-Stack Web"],
    hourlySchedule: {
      morningSlotPct: 88,
      afternoonSlotPct: 75,
      eveningSlotPct: 62,
    },
  },
  {
    id: "lab-embed-03",
    name: "Automotive Embedded & IoT Hardware Test Bench",
    category: "Systems & Embedded",
    totalWorkstations: 32,
    gpuAcceleratedWorkstations: 8,
    cloudSandboxQuota: 100,
    activeUtilizationPct: 84,
    peakTimeSlot: "11:00 - 15:00",
    bottleneckSeverity: "Constrained",
    specs: "CAN Bus Protocol Analyzers, STM32 ARM Cortex Kits, Rigol Digital Oscilloscopes",
    activeCourses: ["B.Tech Electronics & Comm", "EV Powertrain Specialization"],
    hourlySchedule: {
      morningSlotPct: 82,
      afternoonSlotPct: 90,
      eveningSlotPct: 54,
    },
  },
  {
    id: "lab-soft-04",
    name: "Ada Lovelace Software Engineering & Database Lab",
    category: "Software Engineering",
    totalWorkstations: 120,
    gpuAcceleratedWorkstations: 15,
    cloudSandboxQuota: 600,
    activeUtilizationPct: 68,
    peakTimeSlot: "09:00 - 12:00",
    bottleneckSeverity: "Optimal",
    specs: "AMD Ryzen 7 7700, 32GB RAM, Local Docker Daemons, PostgreSQL Server Instances",
    activeCourses: ["Database Management Systems", "Algorithms & Problem Solving", "Web Technologies"],
    hourlySchedule: {
      morningSlotPct: 72,
      afternoonSlotPct: 66,
      eveningSlotPct: 58,
    },
  },
];

export const RAW_BOTTLENECK_ALERTS: LabBottleneckAlert[] = [
  {
    id: "alert-001",
    labName: "Turing High-Performance AI & Cloud Cluster",
    severity: "Critical",
    timeWindow: "Weekdays 14:00 - 17:00",
    description: "Workstation contention is at 96%. Final-year AI/DS capstone teams experiencing queue delays on GPU training jobs.",
    suggestedRemediation: "Enable remote job queuing on AWS cloud sandbox credits during peak afternoon slots to offload on-prem VRAM demand.",
    affectedStudentsCount: 68,
  },
  {
    id: "alert-002",
    labName: "Automotive Embedded & IoT Hardware Test Bench",
    severity: "Warning",
    timeWindow: "Tuesdays & Thursdays",
    description: "16 physical CAN bus analyzer test benches shared between 64 registered students in EV Powertrain elective (4:1 student-to-bench ratio).",
    suggestedRemediation: "Introduce hybrid MATLAB/Simulink virtual hardware simulation stations for preliminary testing before bench time.",
    affectedStudentsCount: 64,
  },
  {
    id: "alert-003",
    labName: "Distributed Systems & Cloud Computing Lab",
    severity: "Warning",
    timeWindow: "Monthly Credit Renewal",
    description: "AWS cloud credit sandbox allocation reached 78% consumption on day 18 of the billing cycle.",
    suggestedRemediation: "Implement automated shutdown policies on unused container instances after 30 minutes of developer inactivity.",
    affectedStudentsCount: 140,
  },
];

// ---------------------------------------------------------
// LAYER C: RAW INDUSTRY VALIDATION DATA
// ---------------------------------------------------------

export const RAW_INDUSTRY_VALIDATIONS: IndustryValidationRecord[] = [
  {
    id: "ind-001",
    companyName: "Accenture",
    slug: "accenture",
    industry: "IT & Technology Consulting",
    mouStatus: "Strategic Talent Partner",
    verifiedHiringSignalsCount: 240,
    coDevelopedModules: ["SQL for Enterprise Data Analytics", "Power BI Executive Reporting"],
    nsqfAlignmentLevel: 6,
    hiringConfidenceScore: 94,
    verifiedMinCtcLpa: 4.8,
    verifiedMaxCtcLpa: 11.5,
    lastValidationDate: "2026-08-20",
    provenanceStatement: "Verified through Campus Recruitment MoU 2026-27 & co-developed Data Analytics curriculum pack.",
  },
  {
    id: "ind-002",
    companyName: "Microsoft IDC",
    slug: "microsoft",
    industry: "Enterprise Software & Cloud Platforms",
    mouStatus: "Curriculum Co-Designer",
    verifiedHiringSignalsCount: 45,
    coDevelopedModules: ["Vector Search & Azure OpenAI Integration", "Distributed Cloud Architecture"],
    nsqfAlignmentLevel: 7,
    hiringConfidenceScore: 96,
    verifiedMinCtcLpa: 16.0,
    verifiedMaxCtcLpa: 28.0,
    lastValidationDate: "2026-09-02",
    provenanceStatement: "Direct technical evaluation benchmark co-designed with Azure Developer Relations and Campus Talent team.",
  },
  {
    id: "ind-003",
    companyName: "Swiggy",
    slug: "swiggy",
    industry: "Consumer Internet & Quick Commerce",
    mouStatus: "Active Campus MoU",
    verifiedHiringSignalsCount: 38,
    coDevelopedModules: ["High-Throughput Go & Docker Microservices", "Kafka Real-Time Streaming"],
    nsqfAlignmentLevel: 6,
    hiringConfidenceScore: 91,
    verifiedMinCtcLpa: 14.0,
    verifiedMaxCtcLpa: 22.0,
    lastValidationDate: "2026-08-28",
    provenanceStatement: "Verified hiring criteria backed by engineering assessment standards for Backend SDE-1 fresher hires.",
  },
  {
    id: "ind-004",
    companyName: "Amazon AWS",
    slug: "amazon",
    industry: "Cloud Infrastructure & E-Commerce",
    mouStatus: "Curriculum Co-Designer",
    verifiedHiringSignalsCount: 85,
    coDevelopedModules: ["Cloud Architecture & DevOps CI/CD Lab", "Containerized Deployment on Kubernetes"],
    nsqfAlignmentLevel: 6,
    hiringConfidenceScore: 95,
    verifiedMinCtcLpa: 15.5,
    verifiedMaxCtcLpa: 26.0,
    lastValidationDate: "2026-09-10",
    provenanceStatement: "Sponsored institutional cloud credits and validated curriculum alignment against AWS Solutions Architect exam blueprint.",
  },
  {
    id: "ind-005",
    companyName: "Tata Consultancy Services (TCS Digital)",
    slug: "tcs",
    industry: "IT Services & Digital Engineering",
    mouStatus: "Active Campus MoU",
    verifiedHiringSignalsCount: 380,
    coDevelopedModules: ["Full-Stack TypeScript & REST APIs", "Applied SQL & Relational Schema Design"],
    nsqfAlignmentLevel: 5,
    hiringConfidenceScore: 89,
    verifiedMinCtcLpa: 3.8,
    verifiedMaxCtcLpa: 7.5,
    lastValidationDate: "2026-08-15",
    provenanceStatement: "Direct campus intake agreement covering national qualifier test (NQT) exemptions for top-aligned cohorts.",
  },
];

// ---------------------------------------------------------
// LAYER D: STUDENT SKILL GAP ALIGNMENT TELEMETRY
// ---------------------------------------------------------

export const RAW_STUDENT_SKILL_ALIGNMENTS: Record<string, StudentSkillGapBreakdown> = {
  "Data Analyst": {
    roleTitle: "Data Analyst",
    sector: "Analytics & Business Intelligence",
    overallMatchPct: 62,
    curriculumCoveredSkills: [
      { skill: "Python Programming", depth: "Comprehensive (Core CS Course)", coveredInCourse: "CS201: Data Structures with Python" },
      { skill: "Spreadsheets & Excel", depth: "Comprehensive (Business Lab)", coveredInCourse: "IT104: Computational Tools Lab" },
      { skill: "Foundational Probability", depth: "Theoretical Only (Partial)", coveredInCourse: "MA202: Discrete Mathematics & Probability" },
    ],
    personalAcquiredSkills: [
      { skill: "Python", proficiency: "Intermediate", verified: true },
      { skill: "Excel", proficiency: "Advanced", verified: true },
      { skill: "Basic Statistics", proficiency: "Intermediate", verified: false },
    ],
    criticalMarketGaps: [
      {
        skill: "SQL & Relational Querying",
        demandLevel: "Very High",
        priority: "Immediate",
        recommendedModule: "Add SQL for Data Analytics (30 Contact Hrs)",
        suggestedContactHours: 30,
        interventionId: "rec-da-001",
      },
      {
        skill: "Power BI / Tableau Dashboarding",
        demandLevel: "High",
        priority: "Immediate",
        recommendedModule: "Add Power BI Business Intelligence Lab (24 Contact Hrs)",
        suggestedContactHours: 24,
        interventionId: "rec-da-002",
      },
      {
        skill: "Applied Inferential Statistics & A/B Testing",
        demandLevel: "High",
        priority: "Recommended",
        recommendedModule: "Applied Statistical Hypothesis Testing Workshop (18 Contact Hrs)",
        suggestedContactHours: 18,
        interventionId: "rec-da-003",
      },
    ],
    feedbackTelemetry: {
      employabilityReadinessIndex: 68,
      projectedInterviewConversionRate: 42,
      regionalMedianCtcDelta: "+₹2.8 LPA upon completing SQL & Power BI",
    },
  },
  "Full Stack Developer": {
    roleTitle: "Full Stack Developer",
    sector: "Software Engineering & Cloud Services",
    overallMatchPct: 71,
    curriculumCoveredSkills: [
      { skill: "HTML5 / CSS3 & Core Web", depth: "Comprehensive (Semester 4)", coveredInCourse: "CS403: Web Technologies" },
      { skill: "Database Management & SQL", depth: "Theoretical (Semester 5)", coveredInCourse: "CS501: DBMS" },
      { skill: "Java / Object-Oriented Design", depth: "Comprehensive (Semester 3)", coveredInCourse: "CS302: Object-Oriented Software" },
    ],
    personalAcquiredSkills: [
      { skill: "JavaScript", proficiency: "Intermediate", verified: true },
      { skill: "React", proficiency: "Intermediate", verified: true },
      { skill: "Git / GitHub", proficiency: "Advanced", verified: true },
    ],
    criticalMarketGaps: [
      {
        skill: "Production TypeScript & Strict Typing",
        demandLevel: "Very High",
        priority: "Immediate",
        recommendedModule: "TypeScript Full-Stack Architecture Module (20 Contact Hrs)",
        suggestedContactHours: 20,
        interventionId: "rec-fs-001",
      },
      {
        skill: "Docker Containerization & CI/CD Pipelines",
        demandLevel: "High",
        priority: "Immediate",
        recommendedModule: "Containerized Application Deployment Lab (18 Contact Hrs)",
        suggestedContactHours: 18,
        interventionId: "rec-fs-002",
      },
      {
        skill: "Automated Integration Testing (Playwright / Vitest)",
        demandLevel: "High",
        priority: "Recommended",
        recommendedModule: "Automated QA & Test Driven Development (16 Contact Hrs)",
        suggestedContactHours: 16,
        interventionId: "rec-fs-003",
      },
    ],
    feedbackTelemetry: {
      employabilityReadinessIndex: 76,
      projectedInterviewConversionRate: 58,
      regionalMedianCtcDelta: "+₹3.4 LPA upon Docker & TypeScript mastery",
    },
  },
  "Cloud & DevOps Engineer": {
    roleTitle: "Cloud & DevOps Engineer",
    sector: "Infrastructure & Platform Engineering",
    overallMatchPct: 54,
    curriculumCoveredSkills: [
      { skill: "Linux Operating System Concepts", depth: "Comprehensive (Semester 4)", coveredInCourse: "CS401: Operating Systems" },
      { skill: "Computer Networks & TCP/IP", depth: "Comprehensive (Semester 5)", coveredInCourse: "CS502: Computer Networks" },
    ],
    personalAcquiredSkills: [
      { skill: "Linux Bash", proficiency: "Intermediate", verified: true },
      { skill: "Basic Docker", proficiency: "Beginner", verified: false },
    ],
    criticalMarketGaps: [
      {
        skill: "Terraform / Infrastructure as Code",
        demandLevel: "Very High",
        priority: "Immediate",
        recommendedModule: "IaC with Terraform on AWS (24 Contact Hrs)",
        suggestedContactHours: 24,
        interventionId: "rec-cd-001",
      },
      {
        skill: "Kubernetes Cluster Administration",
        demandLevel: "Very High",
        priority: "Immediate",
        recommendedModule: "Production Kubernetes & Service Mesh (28 Contact Hrs)",
        suggestedContactHours: 28,
        interventionId: "rec-cd-002",
      },
      {
        skill: "Prometheus & Grafana Observability",
        demandLevel: "High",
        priority: "Recommended",
        recommendedModule: "Cloud Observability & Log Telemetry (16 Contact Hrs)",
        suggestedContactHours: 16,
        interventionId: "rec-cd-003",
      },
    ],
    feedbackTelemetry: {
      employabilityReadinessIndex: 59,
      projectedInterviewConversionRate: 35,
      regionalMedianCtcDelta: "+₹4.2 LPA upon Kubernetes certification",
    },
  },
};


