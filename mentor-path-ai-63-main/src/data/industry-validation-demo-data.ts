/**
 * INDUSTRY VALIDATION & SURVEYS — DEMO / PROTOTYPE DATA LAYER (LAYER C)
 * 
 * PROVENANCE STATEMENT:
 * This dataset provides simulated employer validation responses, industry survey findings,
 * and direct recruiter technical skill demand matrices.
 * 
 * Clearly marked as PROTOTYPE DATA calibrated against corporate campus hiring criteria,
 * IT-ITeS Sector Skills Council, and regional employer consortium inputs.
 */

export type SkillImportance = "Essential" | "Preferred" | "Not Relevant";

export interface EmployerSkillValidationItem {
  id: string;
  skillName: string;
  category: "Core Technical" | "Analytical" | "Tools & BI" | "Domain & Methods";
  defaultImportance: SkillImportance;
  // Market Observation (Scraped/Aggregated Job Postings)
  marketObservationPct: number; // e.g. 94% of postings list this
  marketObservationDemand: "Very High" | "High" | "Medium" | "Low";
  // Employer Direct Human Validation
  employerEssentialPct: number; // e.g. 96% of employers marked as Essential
  employerPreferredPct: number; // e.g. 4%
  employerNotRelevantPct: number; // e.g. 0%
  employerSampleCount: number; // number of validated enterprise responses
  divergenceFlag?: string; // note if employer validation differs from market postings
  rationale: string;
}

export interface EmergingSkillSuggestion {
  id: string;
  skillName: string;
  suggestedByCompany: string;
  timeframe: "Immediate (0-6 mo)" | "Short-Term (6-12 mo)" | "Medium-Term (1-2 yrs)";
  anticipatedImpact: string;
  suggestedRole: string;
  votesCount: number;
}

export interface EmployerRoleValidationRecord {
  roleTitle: string;
  sector: string;
  description: string;
  totalValidatedEmployers: number;
  lastUpdated: string;
  skills: EmployerSkillValidationItem[];
  commonComments: {
    id: string;
    company: string;
    reviewerTitle: string;
    comment: string;
    date: string;
  }[];
  divergenceSummary: string;
}

export interface IndustrySurveyCampaign {
  id: string;
  title: string;
  sector: string;
  status: "Active" | "Completed" | "Annual Report";
  responsesCount: number;
  targetSampleSize: number;
  completionRatePct: number;
  publicationDate: string;
  summary: string;
  respondentBreakdown: {
    gccProductMncPct: number;
    itServicesTier1Pct: number;
    growthStartupsPct: number;
  };
  keyConsensusFindings: string[];
}

export interface CompanySkillDemandMatrix {
  id: string;
  companyName: string;
  slug: string;
  industry: string;
  tier: "Tier 1 Product" | "Global Capability Center (GCC)" | "Enterprise IT & Consulting" | "FinTech / High Growth";
  campusIntakeTarget2026: number;
  targetRole: string;
  essentialSkills: string[];
  preferredSkills: string[];
  screeningMethod: string;
  medianCtcLpa: number;
  verifiedStatus: "MoU Active" | "Verified Requisition" | "Co-Designing Curriculum";
}

// ---------------------------------------------------------
// SECTION 10: RAW ROLE VALIDATION TEMPLATES
// ---------------------------------------------------------

export const RAW_EMPLOYER_ROLE_VALIDATIONS: Record<string, EmployerRoleValidationRecord> = {
  "Data Analyst": {
    roleTitle: "Data Analyst",
    sector: "Analytics, BI & FinTech",
    description: "Evaluates business metrics, builds analytical dashboards, formulates predictive queries, and translates raw operational datasets into strategic decisions.",
    totalValidatedEmployers: 64,
    lastUpdated: "2026-09-15",
    // Exact user requirement benchmark:
    // SQL -> Essential
    // Python -> Essential
    // Power BI -> Preferred
    // Statistics -> Preferred
    // Excel -> Essential
    skills: [
      {
        id: "da-sk-1",
        skillName: "SQL",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 92,
        marketObservationDemand: "Very High",
        employerEssentialPct: 96,
        employerPreferredPct: 4,
        employerNotRelevantPct: 0,
        employerSampleCount: 64,
        divergenceFlag: "Strongest technical filter: 96% of employers test complex queries, JOINs, and window functions in Round 1.",
        rationale: "Mandatory foundational skill for data extraction, warehouse aggregation, and relational querying across all enterprise environments.",
      },
      {
        id: "da-sk-2",
        skillName: "Python",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 88,
        marketObservationDemand: "High",
        employerEssentialPct: 91,
        employerPreferredPct: 9,
        employerNotRelevantPct: 0,
        employerSampleCount: 64,
        divergenceFlag: "Universal requirement for automation, data wrangling (Pandas), and exploratory data analysis (EDA).",
        rationale: "Essential for transforming raw datasets, handling non-relational schemas, and building repeatable data pipelines.",
      },
      {
        id: "da-sk-3",
        skillName: "Power BI",
        category: "Tools & BI",
        defaultImportance: "Preferred",
        marketObservationPct: 84,
        marketObservationDemand: "High",
        employerEssentialPct: 35,
        employerPreferredPct: 62,
        employerNotRelevantPct: 3,
        employerSampleCount: 64,
        divergenceFlag: "Divergence: While 84% of job postings mention BI tools, 62% of hiring managers treat it as 'Preferred' because internal BI tools can be taught if SQL foundations are solid.",
        rationale: "Highly valuable for client-facing executive dashboards and KPI reporting, but secondary to core query fluency.",
      },
      {
        id: "da-sk-4",
        skillName: "Statistics",
        category: "Analytical",
        defaultImportance: "Preferred",
        marketObservationPct: 65,
        marketObservationDemand: "Medium",
        employerEssentialPct: 28,
        employerPreferredPct: 68,
        employerNotRelevantPct: 4,
        employerSampleCount: 64,
        divergenceFlag: "Crucial for product analytics and A/B testing teams, but standard reporting roles require only foundational descriptive statistics.",
        rationale: "Applied inferential statistics, hypothesis testing, and variance analysis are preferred for data-driven experimentation.",
      },
      {
        id: "da-sk-5",
        skillName: "Excel",
        category: "Tools & BI",
        defaultImportance: "Essential",
        marketObservationPct: 78,
        marketObservationDemand: "High",
        employerEssentialPct: 86,
        employerPreferredPct: 14,
        employerNotRelevantPct: 0,
        employerSampleCount: 64,
        divergenceFlag: "Universal business communication tool: 86% of recruiters require advanced VLOOKUP/XLOOKUP, pivot modeling, and data hygiene.",
        rationale: "Essential for rapid ad-hoc auditing, business stakeholder presentations, and financial reconciliation workflows.",
      },
      {
        id: "da-sk-6",
        skillName: "Cloud Data Warehouses (Snowflake / BigQuery)",
        category: "Core Technical",
        defaultImportance: "Preferred",
        marketObservationPct: 68,
        marketObservationDemand: "High",
        employerEssentialPct: 24,
        employerPreferredPct: 70,
        employerNotRelevantPct: 6,
        employerSampleCount: 64,
        divergenceFlag: "High employer preference in GCCs and product startups moving off legacy on-prem servers.",
        rationale: "Preferred competency for operating directly inside modern enterprise cloud analytics stacks.",
      },
    ],
    commonComments: [
      {
        id: "c-001",
        company: "Accenture Data & AI Practice",
        reviewerTitle: "Associate Director - Campus Talent",
        comment: "Many campus graduates know basic SELECT syntax in SQL, but struggle with window functions (ROW_NUMBER, LEAD/LAG) and query optimization on multi-table JOINs. SQL must be taught with real enterprise volumes.",
        date: "2026-08-24",
      },
      {
        id: "c-002",
        company: "Swiggy Analytics",
        reviewerTitle: "Lead Analytics Manager",
        comment: "We test candidates on problem structuring and hypothesis formulation first. Tools like Power BI or Tableau take 2 weeks to learn on the job; deep SQL and analytical reasoning are the non-negotiables.",
        date: "2026-09-02",
      },
      {
        id: "c-003",
        company: "Mu Sigma / Fractal Analytics",
        reviewerTitle: "Principal Consultant",
        comment: "Strong endorsement for Excel plus Python. Candidates who can quickly prototype an analysis in Excel and then automate it via Python scripts stand out immediately in campus interviews.",
        date: "2026-08-30",
      },
    ],
    divergenceSummary: "Market job descriptions often treat Power BI as mandatory keyword filters, whereas direct employer validation reveals that SQL (96%) and Python (91%) are the genuine technical elimination gates. Employers overwhelmingly validate Power BI as a 'Preferred' tool that can be rapidly upskilled if core relational querying is mastered.",
  },

  "Full Stack Developer": {
    roleTitle: "Full Stack Developer",
    sector: "Enterprise Software & Cloud Platforms",
    description: "Designs, engineers, and deploys scalable web applications spanning reactive user interfaces, backend API services, and relational/document databases.",
    totalValidatedEmployers: 82,
    lastUpdated: "2026-09-12",
    skills: [
      {
        id: "fs-sk-1",
        skillName: "TypeScript",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 91,
        marketObservationDemand: "Very High",
        employerEssentialPct: 94,
        employerPreferredPct: 6,
        employerNotRelevantPct: 0,
        employerSampleCount: 82,
        divergenceFlag: "Strict enterprise standard: 94% of employers require TypeScript over vanilla JavaScript for production reliability.",
        rationale: "Strict typing is essential for large engineering teams maintaining enterprise codebases.",
      },
      {
        id: "fs-sk-2",
        skillName: "React / Modern Frontend Framework",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 95,
        marketObservationDemand: "Very High",
        employerEssentialPct: 92,
        employerPreferredPct: 8,
        employerNotRelevantPct: 0,
        employerSampleCount: 82,
        divergenceFlag: "Universal UI standard across product engineering and IT services.",
        rationale: "Component architecture, hooks, state management, and responsive layouts are mandatory.",
      },
      {
        id: "fs-sk-3",
        skillName: "Node.js / Backend REST APIs",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 89,
        marketObservationDemand: "High",
        employerEssentialPct: 88,
        employerPreferredPct: 12,
        employerNotRelevantPct: 0,
        employerSampleCount: 82,
        divergenceFlag: "Essential for building modular microservices and backend data contracts.",
        rationale: "Asynchronous I/O, middleware, JWT authentication, and API error handling.",
      },
      {
        id: "fs-sk-4",
        skillName: "Docker & Containerization",
        category: "Tools & BI",
        defaultImportance: "Preferred",
        marketObservationPct: 76,
        marketObservationDemand: "High",
        employerEssentialPct: 48,
        employerPreferredPct: 50,
        employerNotRelevantPct: 2,
        employerSampleCount: 82,
        divergenceFlag: "Growing rapidly from preferred to essential; enables local reproducible development environments.",
        rationale: "Containerizing services and running multi-container Docker Compose stacks locally.",
      },
      {
        id: "fs-sk-5",
        skillName: "Relational Database Design (PostgreSQL / MySQL)",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 86,
        marketObservationDemand: "High",
        employerEssentialPct: 90,
        employerPreferredPct: 10,
        employerNotRelevantPct: 0,
        employerSampleCount: 82,
        divergenceFlag: "Essential: candidates without schema design and indexing fundamentals fail live coding rounds.",
        rationale: "Normalization, ACID compliance, foreign keys, and indexing strategies.",
      },
    ],
    commonComments: [
      {
        id: "c-004",
        company: "Microsoft IDC",
        reviewerTitle: "Principal Engineering Manager",
        comment: "Students who only know how to build basic MERN tutorials without TypeScript or automated tests struggle in our code reviews. Emphasize type safety and component testing.",
        date: "2026-09-08",
      },
    ],
    divergenceSummary: "Market postings often list 20+ buzzwords; employers validate that TypeScript, relational schema modeling, and clean API design are the true critical criteria for entry-level engineering hires.",
  },

  "Cloud & DevOps Engineer": {
    roleTitle: "Cloud & DevOps Engineer",
    sector: "Infrastructure & Platform Engineering",
    description: "Automates continuous integration and delivery (CI/CD), orchestrates container clusters, and manages cloud infrastructure as code.",
    totalValidatedEmployers: 55,
    lastUpdated: "2026-09-10",
    skills: [
      {
        id: "cd-sk-1",
        skillName: "Linux & Shell Scripting",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 95,
        marketObservationDemand: "Very High",
        employerEssentialPct: 98,
        employerPreferredPct: 2,
        employerNotRelevantPct: 0,
        employerSampleCount: 55,
        divergenceFlag: "Uncompromising prerequisite: 98% of infrastructure engineering managers validate Linux CLI mastery as essential.",
        rationale: "Core operating system for all cloud instances, container runtime hosts, and deployment targets.",
      },
      {
        id: "cd-sk-2",
        skillName: "Docker & Kubernetes",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 92,
        marketObservationDemand: "Very High",
        employerEssentialPct: 90,
        employerPreferredPct: 10,
        employerNotRelevantPct: 0,
        employerSampleCount: 55,
        divergenceFlag: "Standard cloud native orchestration platform across all tier-1 engineering orgs.",
        rationale: "Writing Dockerfiles, managing container images, and deploying Pods, Deployments, and Services.",
      },
      {
        id: "cd-sk-3",
        skillName: "Terraform / Infrastructure as Code",
        category: "Tools & BI",
        defaultImportance: "Preferred",
        marketObservationPct: 78,
        marketObservationDemand: "High",
        employerEssentialPct: 42,
        employerPreferredPct: 54,
        employerNotRelevantPct: 4,
        employerSampleCount: 55,
        divergenceFlag: "Highly preferred in enterprise cloud migrations; expected for associate DevOps engineers.",
        rationale: "Declarative cloud provisioning on AWS/Azure/GCP with state file management.",
      },
      {
        id: "cd-sk-4",
        skillName: "CI/CD Automation (GitHub Actions / GitLab CI)",
        category: "Core Technical",
        defaultImportance: "Essential",
        marketObservationPct: 86,
        marketObservationDemand: "High",
        employerEssentialPct: 87,
        employerPreferredPct: 13,
        employerNotRelevantPct: 0,
        employerSampleCount: 55,
        divergenceFlag: "Essential: graduates must be capable of building automated test and deployment pipelines.",
        rationale: "Configuring pipeline YAML, automated testing steps, and artifact publication.",
      },
    ],
    commonComments: [
      {
        id: "c-005",
        company: "Amazon AWS",
        reviewerTitle: "Senior Solutions Architect",
        comment: "Certification is helpful, but hands-on Linux CLI and networking troubleshooting (DNS, subnets, security groups) is where freshers either pass or fail our technical loop.",
        date: "2026-09-05",
      },
    ],
    divergenceSummary: "Postings often ask for complex multi-cloud certifications; employers validate that strong Linux basics, Docker containerization, and Git CI/CD pipelines are the true essentials.",
  },
};

// ---------------------------------------------------------
// SECTION 9: RAW INDUSTRY SURVEYS
// ---------------------------------------------------------

export const RAW_INDUSTRY_SURVEYS: IndustrySurveyCampaign[] = [
  {
    id: "survey-2026-q3",
    title: "National Engineering Campus Hiring & Skill Alignment Survey 2026",
    sector: "All Technology Sectors (Enterprise IT, GCCs, Startups)",
    status: "Active",
    responsesCount: 148,
    targetSampleSize: 200,
    completionRatePct: 74,
    publicationDate: "2026-09-15",
    summary: "Annual flagship empirical survey assessing technical interview clearance rates, curriculum gaps, and entry-level CTC trajectories across 148 tech employers.",
    respondentBreakdown: {
      gccProductMncPct: 38,
      itServicesTier1Pct: 34,
      growthStartupsPct: 28,
    },
    keyConsensusFindings: [
      "78% of enterprise employers reported a shortage of freshers with practical SQL and relational debugging skills.",
      "84% of GCC hiring managers consider automated testing and Git collaboration more important than theoretical software engineering models.",
      "Median entry-level CTC offered to candidates with verified practical project portfolios is 42% higher than GPA-only candidates.",
      "68% of employers are actively willing to co-design and endorse university syllabus modules to accelerate hiring clearance.",
    ],
  },
  {
    id: "survey-fintech-2026",
    title: "BFSI & FinTech Data Analytics Talent Competency Benchmark",
    sector: "Banking, Financial Services & FinTech",
    status: "Completed",
    responsesCount: 62,
    targetSampleSize: 60,
    completionRatePct: 100,
    publicationDate: "2026-08-28",
    summary: "Dedicated study on quantitative and analytical skill requirements across financial institutions, payments unicorns, and credit rating agencies.",
    respondentBreakdown: {
      gccProductMncPct: 45,
      itServicesTier1Pct: 25,
      growthStartupsPct: 30,
    },
    keyConsensusFindings: [
      "SQL and Excel validated as 100% essential across all 62 financial institutions.",
      "Power BI and Tableau categorized as 'Preferred' because domain understanding of financial ratios is considered harder to teach than BI dashboards.",
      "Regulatory compliance and data privacy knowledge (DPDP Act) emerging as an essential non-technical competence.",
    ],
  },
  {
    id: "survey-cloud-2026",
    title: "Cloud Infrastructure, Containerization & SRE Hiring Outlook",
    sector: "Cloud Computing & Platform Engineering",
    status: "Annual Report",
    responsesCount: 95,
    targetSampleSize: 90,
    completionRatePct: 100,
    publicationDate: "2026-07-30",
    summary: "Longitudinal survey on production DevOps tools, microservice architectures, and junior platform engineer requisitions.",
    respondentBreakdown: {
      gccProductMncPct: 52,
      itServicesTier1Pct: 28,
      growthStartupsPct: 20,
    },
    keyConsensusFindings: [
      "91% of respondents identified Linux system fundamentals as the single biggest differentiator between hired and rejected candidates.",
      "Kubernetes adoption is now standard in 78% of product engineering teams hiring freshers.",
      "Demand for Terraform and Infrastructure as Code increased by +34% YoY.",
    ],
  },
];

// ---------------------------------------------------------
// SECTION 9: RAW COMPANY SKILL DEMAND MATRIX
// ---------------------------------------------------------

export const RAW_COMPANY_SKILL_DEMANDS: CompanySkillDemandMatrix[] = [
  {
    id: "csd-001",
    companyName: "Accenture",
    slug: "accenture",
    industry: "IT & Technology Consulting",
    tier: "Enterprise IT & Consulting",
    campusIntakeTarget2026: 450,
    targetRole: "Data Analyst / Associate Software Engineer",
    essentialSkills: ["SQL (Complex Joins & Aggregations)", "Python (Pandas & Scripting)", "Advanced Excel"],
    preferredSkills: ["Power BI", "Cloud Data Warehouse (Snowflake)", "Agile Delivery"],
    screeningMethod: "Cognitive Assessment + HackerRank SQL & Python Coding + Technical Interview",
    medianCtcLpa: 5.5,
    verifiedStatus: "Co-Designing Curriculum",
  },
  {
    id: "csd-002",
    companyName: "Microsoft IDC",
    slug: "microsoft",
    industry: "Enterprise Software & Cloud",
    tier: "Tier 1 Product",
    campusIntakeTarget2026: 45,
    targetRole: "Software Engineer (Full Stack / Cloud)",
    essentialSkills: ["Data Structures & Algorithms", "TypeScript / Modern C# / Java", "System Design Foundations", "Relational Databases"],
    preferredSkills: ["Azure Cloud Services", "Vector Search & LLM Integration", "Docker Containerization"],
    screeningMethod: "Online Coding (2 LeetCode Mediums) + 3 Technical Rounds (DSA, Design, Code Quality)",
    medianCtcLpa: 18.5,
    verifiedStatus: "Co-Designing Curriculum",
  },
  {
    id: "csd-003",
    companyName: "Swiggy",
    slug: "swiggy",
    industry: "Consumer Internet & Logistics",
    tier: "FinTech / High Growth",
    campusIntakeTarget2026: 35,
    targetRole: "Backend Software Engineer - 1",
    essentialSkills: ["Golang or Java", "Concurrency & Multithreading", "PostgreSQL / MySQL", "RESTful Architecture"],
    preferredSkills: ["Kafka Streaming", "Docker & Kubernetes", "Redis Caching"],
    screeningMethod: "Machine Coding Round (Build a working CLI/API service in 90 mins) + Data Structures + Culture",
    medianCtcLpa: 16.0,
    verifiedStatus: "MoU Active",
  },
  {
    id: "csd-004",
    companyName: "Amazon AWS",
    slug: "amazon",
    industry: "Cloud Platforms & Infrastructure",
    tier: "Tier 1 Product",
    campusIntakeTarget2026: 80,
    targetRole: "Cloud Support Associate / Systems Engineer",
    essentialSkills: ["Linux Operating Systems (Deep CLI)", "Networking (TCP/IP, DNS, Routing)", "Troubleshooting Methodology", "Python / Bash Scripting"],
    preferredSkills: ["AWS Core Services (EC2, S3, VPC)", "Docker", "Terraform"],
    screeningMethod: "Online Work Simulation + Live Linux Debugging & Scenario Round + Behavioral Bar Raiser",
    medianCtcLpa: 15.0,
    verifiedStatus: "Co-Designing Curriculum",
  },
  {
    id: "csd-005",
    companyName: "Tata Consultancy Services (TCS Digital)",
    slug: "tcs",
    industry: "IT Services & Solutions",
    tier: "Enterprise IT & Consulting",
    campusIntakeTarget2026: 600,
    targetRole: "Digital Systems Engineer",
    essentialSkills: ["Java or Python", "SQL Querying", "Foundational Problem Solving", "Web Architecture"],
    preferredSkills: ["Cloud Fundamentals", "React", "Automated Testing"],
    screeningMethod: "National Qualifier Test (NQT Digital Cadre) + Technical & HR Panel Interview",
    medianCtcLpa: 7.2,
    verifiedStatus: "MoU Active",
  },
];

// Raw emerging skill suggestions from employers
export const RAW_EMERGING_SKILL_SUGGESTIONS: EmergingSkillSuggestion[] = [
  {
    id: "es-001",
    skillName: "Agentic AI Orchestration (LangGraph / CrewAI)",
    suggestedByCompany: "Swiggy & Microsoft IDC",
    timeframe: "Immediate (0-6 mo)",
    anticipatedImpact: "Engineers who can build multi-agent autonomous tools are replacing basic chatbot builders.",
    suggestedRole: "Full Stack Developer / AI Engineer",
    votesCount: 42,
  },
  {
    id: "es-002",
    skillName: "DuckDB & Local OLAP Processing",
    suggestedByCompany: "Accenture Data Practice",
    timeframe: "Short-Term (6-12 mo)",
    anticipatedImpact: "Enables fast local analytics without launching expensive cloud warehouse clusters.",
    suggestedRole: "Data Analyst / Analytics Engineer",
    votesCount: 38,
  },
  {
    id: "es-003",
    skillName: "eBPF Linux Kernel Observability",
    suggestedByCompany: "Amazon AWS",
    timeframe: "Short-Term (6-12 mo)",
    anticipatedImpact: "Modern networking and security telemetry without invasive application code modification.",
    suggestedRole: "Cloud & DevOps Engineer",
    votesCount: 29,
  },
];

// =========================================================
// SECTION 11: STRUCTURED INDUSTRY SKILL SURVEY DATA MODELS
// =========================================================

export type ExpectedProficiency = "Foundational (Theory & Syntax)" | "Working / Production-Ready" | "Advanced (Architecture & Scale)";

export interface StructuredSurveySubmission {
  id: string;
  companyName: string;
  industry: string;
  companyTier: "Global Capability Center (GCC)" | "Tier 1 IT & Consulting" | "High-Growth Product Unicorn" | "Enterprise Tech";
  respondentTitle: string;
  submittedAt: string;
  // 6 Specified Survey Dimensions
  currentlyRequiredSkills: string[];
  skillsBecomingImportant: string[];
  skillsDeclining: string[];
  expectedProficiency: ExpectedProficiency;
  growingEntryLevelRoles: string[];
  expectedTools: string[];
  additionalComments?: string;
}

export const RAW_STRUCTURED_SURVEY_SUBMISSIONS: StructuredSurveySubmission[] = [
  {
    id: "subm-001",
    companyName: "Accenture India",
    industry: "IT & Technology Consulting",
    companyTier: "Tier 1 IT & Consulting",
    respondentTitle: "Director of Campus Hiring",
    submittedAt: "2026-09-14",
    currentlyRequiredSkills: ["SQL", "Python", "Advanced Excel", "Data Structures & Algorithms", "Relational Databases"],
    skillsBecomingImportant: ["Power BI", "Snowflake", "Applied Statistics", "Prompt Engineering"],
    skillsDeclining: ["Manual Regression Testing", "Legacy SOAP / XML", "AngularJS 1.x"],
    expectedProficiency: "Working / Production-Ready",
    growingEntryLevelRoles: ["Data Analyst", "Associate Software Engineer", "Cloud Support Associate"],
    expectedTools: ["Git / GitHub", "Docker", "PostgreSQL", "VS Code", "Postman"],
    additionalComments: "Freshers must be capable of independent SQL querying without relying on visual query builders.",
  },
  {
    id: "subm-002",
    companyName: "Microsoft India R&D",
    industry: "Enterprise Software & Cloud Platforms",
    companyTier: "Global Capability Center (GCC)",
    respondentTitle: "Principal Engineering Lead",
    submittedAt: "2026-09-12",
    currentlyRequiredSkills: ["TypeScript", "Data Structures & Algorithms", "System Design Foundations", "Relational Databases", "Linux CLI"],
    skillsBecomingImportant: ["Vector Databases & RAG", "Agentic AI Orchestration", "Rust Systems", "Micro-Frontends"],
    skillsDeclining: ["jQuery", "Vanilla JS Callback Patterns", "Legacy PHP"],
    expectedProficiency: "Working / Production-Ready",
    growingEntryLevelRoles: ["Full Stack Developer", "AI / Machine Learning Engineer", "Site Reliability Engineer"],
    expectedTools: ["Git / GitHub", "Docker", "Azure Developer CLI", "Playwright", "VS Code"],
    additionalComments: "High emphasis on writing unit tests and end-to-end integration tests using modern testing frameworks.",
  },
  {
    id: "subm-003",
    companyName: "Swiggy Engineering",
    industry: "Consumer Tech & Quick Commerce",
    companyTier: "High-Growth Product Unicorn",
    respondentTitle: "Staff Software Engineer - Infrastructure",
    submittedAt: "2026-09-10",
    currentlyRequiredSkills: ["Golang", "PostgreSQL", "Docker", "Linux CLI", "Git", "REST APIs"],
    skillsBecomingImportant: ["Kafka Streaming", "Kubernetes", "eBPF Observability", "Redis Caching"],
    skillsDeclining: ["Subversion (SVN)", "Apache Ant", "Manual QA"],
    expectedProficiency: "Working / Production-Ready",
    growingEntryLevelRoles: ["Backend Software Engineer", "Platform / DevOps Engineer"],
    expectedTools: ["Docker", "Git / GitHub", "Postman", "Linux Terminal", "Grafana"],
    additionalComments: "Our machine coding round tests candidates on building a clean modular service in 90 minutes. Clean code beats complex algorithms.",
  },
  {
    id: "subm-004",
    companyName: "Amazon AWS Support",
    industry: "Cloud Platforms",
    companyTier: "Global Capability Center (GCC)",
    respondentTitle: "Senior Solutions Architect",
    submittedAt: "2026-09-08",
    currentlyRequiredSkills: ["Linux CLI", "Computer Networks (TCP/IP, DNS)", "Bash Scripting", "Python", "Troubleshooting"],
    skillsBecomingImportant: ["Terraform (IaC)", "Container Orchestration", "Cloud Security / IAM"],
    skillsDeclining: ["On-Premise Server Hardware Maintenance", "Perl Scripting"],
    expectedProficiency: "Working / Production-Ready",
    growingEntryLevelRoles: ["Cloud Support Associate", "DevOps Engineer"],
    expectedTools: ["Linux Terminal", "AWS CLI", "Git / GitHub", "Wireshark"],
    additionalComments: "Deep networking fundamentals (subnets, route tables, DNS resolution) is the primary interview filter.",
  },
  {
    id: "subm-005",
    companyName: "TCS Digital",
    industry: "IT Services",
    companyTier: "Tier 1 IT & Consulting",
    respondentTitle: "Lead Technical Evaluator",
    submittedAt: "2026-09-05",
    currentlyRequiredSkills: ["Java / Object-Oriented Programming", "SQL", "HTML5 / CSS3", "Python", "Data Structures"],
    skillsBecomingImportant: ["React / TypeScript", "Cloud Fundamentals (AWS/Azure)", "Docker"],
    skillsDeclining: ["JSP / Servlets", "Struts Framework", "Desktop WinForms"],
    expectedProficiency: "Foundational (Theory & Syntax)",
    growingEntryLevelRoles: ["Digital Systems Engineer", "Junior Full Stack Developer"],
    expectedTools: ["Git / GitHub", "VS Code", "PostgreSQL", "Eclipse / IntelliJ"],
    additionalComments: "Candidates who clear the Digital Cadre exam demonstrate strong algorithmic fundamentals and clean relational schemas.",
  },
];

// Aggregation calculation helper
export interface AggregatedSurveyStats {
  totalResponses: number;
  currentlyRequiredSkills: { name: string; count: number; percentage: number }[];
  skillsBecomingImportant: { name: string; count: number; percentage: number }[];
  skillsDeclining: { name: string; count: number; percentage: number }[];
  expectedProficiencyBreakdown: { level: ExpectedProficiency; count: number; percentage: number }[];
  growingEntryLevelRoles: { role: string; count: number; percentage: number }[];
  expectedTools: { tool: string; count: number; percentage: number }[];
}

export function computeSurveyAnalytics(submissions: StructuredSurveySubmission[]): AggregatedSurveyStats {
  const total = submissions.length || 1;

  const countItems = (extractor: (s: StructuredSurveySubmission) => string[]) => {
    const map = new Map<string, number>();
    for (const sub of submissions) {
      for (const item of extractor(sub)) {
        map.set(item, (map.get(item) ?? 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  };

  const reqSkills = countItems((s) => s.currentlyRequiredSkills);
  const futureSkills = countItems((s) => s.skillsBecomingImportant);
  const declSkills = countItems((s) => s.skillsDeclining);
  const tools = countItems((s) => s.expectedTools).map((i) => ({ tool: i.name, count: i.count, percentage: i.percentage }));
  const roles = countItems((s) => s.growingEntryLevelRoles).map((i) => ({ role: i.name, count: i.count, percentage: i.percentage }));

  const profMap = new Map<ExpectedProficiency, number>();
  for (const s of submissions) {
    profMap.set(s.expectedProficiency, (profMap.get(s.expectedProficiency) ?? 0) + 1);
  }
  const profLevels: ExpectedProficiency[] = [
    "Working / Production-Ready",
    "Foundational (Theory & Syntax)",
    "Advanced (Architecture & Scale)",
  ];
  const profBreakdown = profLevels.map((level) => {
    const count = profMap.get(level) ?? 0;
    return {
      level,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });

  return {
    totalResponses: submissions.length,
    currentlyRequiredSkills: reqSkills,
    skillsBecomingImportant: futureSkills,
    skillsDeclining: declSkills,
    expectedProficiencyBreakdown: profBreakdown,
    growingEntryLevelRoles: roles,
    expectedTools: tools,
  };
}

// =========================================================
// SECTION 12: EXTENDED COMPANY SKILL DEMAND DATA MODELS
// =========================================================

export interface CompanyRoleDemand {
  roleTitle: string;
  experienceLevel: string; // e.g. "0 - 1 Years (Fresher Intake)"
  requiredSkills: string[];
  preferredSkills: string[];
  hiringTrend: "Surging (+30% YoY)" | "Growing (+15-25% YoY)" | "Stable Replacement" | "Selective Intake";
  validatedStatus: "Direct Employer Validated" | "Campus MoU Stated" | "Pending Employer Validation";
  openingsCount?: number;
  typicalAssessmentMethod: string;
}

export interface ExtendedCompanySkillDemand {
  companyId?: string;
  companyName: string;
  slug: string;
  industry: string;
  locations: string[];
  overallHiringTrend: string;
  experienceRequirements: string;
  validationProvenance: string;
  isDirectEmployerValidated: boolean;
  roles: CompanyRoleDemand[];
}

export const RAW_EXTENDED_COMPANY_DEMANDS: ExtendedCompanySkillDemand[] = [
  {
    companyName: "Accenture",
    slug: "accenture",
    industry: "IT & Technology Consulting",
    locations: ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai", "NCR"],
    overallHiringTrend: "+18% YoY Campus Intake (Surging Q3 2026)",
    experienceRequirements: "0 - 1 Years for Campus Hires; 1 - 3 Years for Lateral Associate Track",
    validationProvenance: "Direct Technical Benchmark co-designed via Campus MoU 2026-27 with Placement Cell.",
    isDirectEmployerValidated: true,
    roles: [
      {
        roleTitle: "Data Analyst",
        experienceLevel: "0 - 1 Years (Fresher)",
        requiredSkills: ["SQL (Complex Joins & Window Functions)", "Python (Pandas & Scripting)", "Advanced Excel (Pivots & Formulas)"],
        preferredSkills: ["Power BI Dashboarding", "Cloud Data Warehouses (Snowflake)", "Basic Probability"],
        hiringTrend: "Surging (+30% YoY)",
        validatedStatus: "Direct Employer Validated",
        openingsCount: 240,
        typicalAssessmentMethod: "HackerRank SQL Coding + Technical Panel Interview",
      },
      {
        roleTitle: "Associate Software Engineer",
        experienceLevel: "0 - 1 Years (Fresher)",
        requiredSkills: ["Object-Oriented Programming (Java / Python)", "Relational Database Concepts", "Data Structures & Algorithms"],
        preferredSkills: ["React / TypeScript", "REST API Development", "Cloud Fundamentals"],
        hiringTrend: "Growing (+15-25% YoY)",
        validatedStatus: "Direct Employer Validated",
        openingsCount: 210,
        typicalAssessmentMethod: "Cognitive Ability Test + 2 Coding Problems + Technical Viva",
      },
    ],
  },
  {
    companyName: "Microsoft IDC",
    slug: "microsoft",
    industry: "Enterprise Software & Cloud Platforms",
    locations: ["Hyderabad", "Bengaluru", "Noida"],
    overallHiringTrend: "Highly Selective Intake (+8% YoY, High Package Focus)",
    experienceRequirements: "0 - 1 Years (Campus Engineering Intake)",
    validationProvenance: "Verified Campus Intake Agreement 2026-27 & Azure Developer Relations technical rubric.",
    isDirectEmployerValidated: true,
    roles: [
      {
        roleTitle: "Software Engineer (Full Stack / Cloud)",
        experienceLevel: "0 - 1 Years (Fresher)",
        requiredSkills: ["Data Structures & Algorithms (Trees, Graphs, DP)", "TypeScript / Modern C# / Java", "System Design Fundamentals", "Relational Database Schema Design"],
        preferredSkills: ["Azure OpenAI & Vector Search", "Docker Containerization", "Microservices"],
        hiringTrend: "Selective Intake",
        validatedStatus: "Direct Employer Validated",
        openingsCount: 45,
        typicalAssessmentMethod: "2 LeetCode Mediums Online + 3 Deep Technical Architecture Rounds",
      },
    ],
  },
  {
    companyName: "Swiggy",
    slug: "swiggy",
    industry: "Consumer Internet & Quick Commerce",
    locations: ["Bengaluru", "Hyderabad", "Remote / Hybrid"],
    overallHiringTrend: "Focused High-Throughput Engineering Expansion (+22% YoY)",
    experienceRequirements: "0 - 1 Years (Campus SDE-1 Cohort)",
    validationProvenance: "Direct Engineering Assessment standards validated for Backend SDE-1 campus hires.",
    isDirectEmployerValidated: true,
    roles: [
      {
        roleTitle: "Backend Software Engineer - 1",
        experienceLevel: "0 - 1 Years (Fresher)",
        requiredSkills: ["Golang or Java", "Concurrency & Goroutines / Threads", "PostgreSQL / MySQL", "RESTful API Design"],
        preferredSkills: ["Kafka Event Streaming", "Docker & Kubernetes", "Redis Caching"],
        hiringTrend: "Growing (+15-25% YoY)",
        validatedStatus: "Direct Employer Validated",
        openingsCount: 35,
        typicalAssessmentMethod: "90-Min Machine Coding Round (Working Service Implementation) + Data Structures",
      },
    ],
  },
  {
    companyName: "Amazon AWS",
    slug: "amazon",
    industry: "Cloud Platforms & Infrastructure",
    locations: ["Bengaluru", "Hyderabad", "Pune"],
    overallHiringTrend: "Active Cloud Migration Requisition (+25% YoY)",
    experienceRequirements: "0 - 1 Years (Campus Support & Systems Track)",
    validationProvenance: "Validated against AWS Solutions Architect exam blueprint & campus recruiting guidelines.",
    isDirectEmployerValidated: true,
    roles: [
      {
        roleTitle: "Cloud Support Associate",
        experienceLevel: "0 - 1 Years (Fresher)",
        requiredSkills: ["Linux Operating Systems (Deep Command Line)", "Networking (TCP/IP, DNS, Routing)", "Troubleshooting Methodology", "Python / Bash Scripting"],
        preferredSkills: ["AWS Core Services (EC2, S3, VPC)", "Docker", "Terraform IaC"],
        hiringTrend: "Surging (+30% YoY)",
        validatedStatus: "Direct Employer Validated",
        openingsCount: 80,
        typicalAssessmentMethod: "Online Work Simulation + Live Linux CLI Debugging Session + Bar Raiser",
      },
    ],
  },
  {
    companyName: "Tata Consultancy Services (TCS Digital)",
    slug: "tcs",
    industry: "IT Services & Solutions",
    locations: ["Pan-India (Major IT Hubs & Delivery Centers)"],
    overallHiringTrend: "Mass Digital Intake (+12% YoY)",
    experienceRequirements: "0 - 1 Years (Digital Cadre Freshers)",
    validationProvenance: "Campus MoU Stated: National Qualifier Test (NQT Digital Cadre) benchmark.",
    isDirectEmployerValidated: true,
    roles: [
      {
        roleTitle: "Digital Systems Engineer",
        experienceLevel: "0 - 1 Years (Fresher)",
        requiredSkills: ["Java or Python", "SQL Querying", "Foundational Problem Solving", "Web Architecture Basics"],
        preferredSkills: ["Cloud Fundamentals", "React", "Automated Testing"],
        hiringTrend: "Growing (+15-25% YoY)",
        validatedStatus: "Campus MoU Stated",
        openingsCount: 600,
        typicalAssessmentMethod: "National Qualifier Test (NQT) + Technical Viva Panel",
      },
    ],
  },
  {
    companyName: "FinTech Enterprise Partner (Simulated)",
    slug: "fintech-partner",
    industry: "Banking & Financial Technology",
    locations: ["Mumbai", "Bengaluru"],
    overallHiringTrend: "Stable Replacement Hiring",
    experienceRequirements: "0 - 2 Years",
    validationProvenance: "Pending Direct Employer Validation (Data based on general campus notification).",
    isDirectEmployerValidated: false,
    roles: [
      {
        roleTitle: "Junior Quantitative Analyst",
        experienceLevel: "0 - 1 Years",
        requiredSkills: ["Python", "SQL", "Financial Mathematics Basics"],
        preferredSkills: ["Tableau", "Time Series Analysis"],
        hiringTrend: "Stable Replacement",
        validatedStatus: "Pending Employer Validation",
        openingsCount: 20,
        typicalAssessmentMethod: "Pending technical assessment confirmation",
      },
    ],
  },
];
