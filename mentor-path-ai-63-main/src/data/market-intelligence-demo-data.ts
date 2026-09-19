/**
 * LABOUR MARKET INTELLIGENCE — PROTOTYPE / DEMO DATA LAYER
 * 
 * IMPORTANT ARCHITECTURAL & ETHICAL NOTICE:
 * This file contains strictly labelled PROTOTYPE / SIMULATED data designed to model
 * national and state-level Labour Market Intelligence (LMI) signals.
 * 
 * It is isolated in this data layer so that when live, verified API feeds
 * (e.g., National Career Service / MoLE, State Skill Development Missions, or Enterprise Feeds)
 * are connected, this file can be swapped without modifying UI components.
 * 
 * Every statistic displayed in the application must cite this dataset provenance.
 */

export interface DatasetProvenance {
  datasetName: string;
  isPrototype: boolean;
  version: string;
  lastUpdated: string;
  sourceAttribution: string;
  sampleSizePostings: number;
  sampleSizeEmployers: number;
  methodology: string;
}

export const DATASET_PROVENANCE: DatasetProvenance = {
  datasetName: "India National Labour Market Intelligence Prototype (LMI-Q3-2026)",
  isPrototype: true,
  version: "2026.3-prototype",
  lastUpdated: "2026-09-15",
  sourceAttribution: "Prototype / Simulated Dataset (Calibrated against State Skill Development Missions & Tech Employment Exchanges)",
  sampleSizePostings: 142850,
  sampleSizeEmployers: 18240,
  methodology: "Simulated aggregation combining normalized job postings across tier-1, tier-2 tech clusters, employer talent requisitions, and curriculum gap analyses.",
};

// Filter Option Definitions
export interface FilterOptions {
  states: string[];
  districtsByState: Record<string, string[]>;
  citiesByDistrict: Record<string, string[]>;
  sectors: string[];
  industriesBySector: Record<string, string[]>;
  roles: string[];
  timePeriods: string[];
}

export const FILTER_OPTIONS: FilterOptions = {
  states: [
    "All States",
    "Karnataka",
    "Maharashtra",
    "Telangana",
    "Tamil Nadu",
    "Delhi NCR",
    "Uttar Pradesh",
    "Gujarat",
  ],
  districtsByState: {
    "Karnataka": ["All Districts", "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dakshina Kannada"],
    "Maharashtra": ["All Districts", "Pune", "Mumbai Suburban", "Thane", "Nagpur"],
    "Telangana": ["All Districts", "Hyderabad", "Rangareddy", "Medchal-Malkajgiri"],
    "Tamil Nadu": ["All Districts", "Chennai", "Coimbatore", "Chengalpattu", "Kanchipuram"],
    "Delhi NCR": ["All Districts", "New Delhi", "Gurugram", "Faridabad"],
    "Uttar Pradesh": ["All Districts", "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Lucknow", "Kanpur"],
    "Gujarat": ["All Districts", "Ahmedabad", "Gandhinagar", "Vadodara", "Surat"],
  },
  citiesByDistrict: {
    "Bengaluru Urban": ["All Cities", "Bengaluru (Electronic City)", "Bengaluru (Whitefield)", "Bengaluru (ORR Tech Corridor)", "Bengaluru (Koramangala)"],
    "Pune": ["All Cities", "Pune (Hinjawadi)", "Pune (Magarpatta)", "Pune (Viman Nagar)", "Pune (Kharadi)"],
    "Mumbai Suburban": ["All Cities", "Mumbai (BKC)", "Mumbai (Andheri East)", "Navi Mumbai", "Airoli"],
    "Hyderabad": ["All Cities", "Hyderabad (Hitec City)", "Hyderabad (Gachibowli)", "Hyderabad (Madhapur)"],
    "Chennai": ["All Cities", "Chennai (OMR Corridor)", "Chennai (Guindy)", "Chennai (Taramani)"],
    "Gautam Buddha Nagar (Noida)": ["All Cities", "Noida (Sector 62)", "Noida (Sector 126/135)", "Greater Noida"],
    "Gurugram": ["All Cities", "Gurugram (Cyber City)", "Gurugram (Golf Course Rd)", "Gurugram (Sohna Rd)"],
    "Ahmedabad": ["All Cities", "GIFT City", "Ahmedabad (S.G. Highway)", "Gandhinagar Tech Zone"],
  },
  sectors: [
    "All Sectors",
    "Information Technology & Cloud",
    "Banking, Financial Services & Insurance (BFSI)",
    "Core Engineering & High-Tech Manufacturing",
    "Healthcare, Bio-Tech & Pharma",
    "E-Commerce, Retail Tech & Logistics",
    "CleanTech, Renewable Energy & EV",
  ],
  industriesBySector: {
    "Information Technology & Cloud": ["All Industries", "Enterprise SaaS", "Cloud Platforms & Infrastructure", "Cybersecurity & DefTech", "AI Products & Agents"],
    "Banking, Financial Services & Insurance (BFSI)": ["All Industries", "Digital Banking & Payments", "Algorithmic & Quantitative Trading", "InsurTech", "WealthTech"],
    "Core Engineering & High-Tech Manufacturing": ["All Industries", "Semiconductor & Embedded Systems", "Automotive & Connected Mobility", "Aerospace & Avionics", "Robotics & Industrial Automation"],
    "Healthcare, Bio-Tech & Pharma": ["All Industries", "HealthTech & Clinical Software", "Bio-Informatics & Genomics", "MedTech Devices"],
    "E-Commerce, Retail Tech & Logistics": ["All Industries", "Quick Commerce Platforms", "Supply Chain Automation", "Retail Analytics & CRM"],
    "CleanTech, Renewable Energy & EV": ["All Industries", "Electric Vehicle Powertrain & BMS", "Smart Grid & Solar Systems", "Battery Tech & Energy Storage"],
  },
  roles: [
    "All Roles",
    "Full Stack Software Engineer",
    "Cloud & DevOps Engineer",
    "Data Engineer & Big Data Architect",
    "AI / Machine Learning Engineer",
    "Cybersecurity & Security Operations Analyst",
    "Backend Systems Engineer (Go/Rust/Java)",
    "Frontend & Mobile Engineer (React/React Native)",
    "Embedded Systems & Firmware Engineer",
  ],
  timePeriods: [
    "Last 30 Days",
    "Last 90 Days (Q3 2026)",
    "Last 6 Months",
    "Last 1 Year",
  ],
};

// Core Data Structures
export interface MonthlyDemandPoint {
  month: string;
  totalPostings: number;
  itPostings: number;
  bfsiPostings: number;
  coreEngPostings: number;
  otherPostings: number;
}

export interface SkillProficiencySplit {
  beginnerPct: number;     // 0-1 yrs expectations (syntax, basics, unit tests)
  intermediatePct: number; // 1-3 yrs expectations (system design, debugging, APIs)
  advancedPct: number;     // 3-5 yrs expectations (perf tuning, architecture, distributed)
  expertPct: number;       // 5+ yrs expectations (domain mastery, RFCs, internals)
}

export interface DemandedSkill {
  name: string;
  category: "Language" | "Framework" | "Cloud/DevOps" | "Database" | "Architecture" | "Data/AI" | "Security";
  demandCount: number;
  demandSharePct: number;
  yoyGrowthPct: number;
  associatedRoles: string[];
  associatedSectors: string[];
  proficiencySplit: SkillProficiencySplit;
  curriculumStatus: "Commonly Taught" | "Partially Covered" | "Severe Curriculum Gap";
}

export interface EmergingSkill {
  name: string;
  category: string;
  velocityPct: number;        // Quarter over Quarter surge
  currentPostings: number;
  adoptionMaturity: "Exploratory" | "Early Adopter" | "Rapid Mainstream Growth";
  keyDrivers: string;
  curriculumLagMonths: number; // Time academia is lagging behind industry demand
  sampleCompaniesHiring: string[];
  suggestedPrerequisites: string[];
}

export interface DecliningSkill {
  name: string;
  category: string;
  declinePct: number;         // YoY drop
  reason: string;
  replacementSkill: string;
  transitionAdvice: string;
}

export interface GrowingRole {
  role: string;
  sector: string;
  demandVolume: number;
  yoyGrowthPct: number;
  salaryRangeLPA: {
    entryMin: number;
    entryMax: number;
    medianExperienced: number;
  };
  primaryHiringDistricts: string[];
  keyRequiredSkills: string[];
  freshersEligible: boolean;
}

export interface DistrictDemand {
  state: string;
  district: string;
  postingsCount: number;
  sharePct: number;
  primarySector: string;
  topRole: string;
  avgFresherLPA: number;
  growthRatePct: number;
}

export interface ExperienceRequirement {
  tier: "Entry-Level / Freshers (0-1 yrs)" | "Associate / Junior (1-3 yrs)" | "Mid-Level (3-5 yrs)" | "Senior / Lead (5+ yrs)";
  percentage: number;
  postingCount: number;
  description: string;
}

export interface FilterState {
  state: string;
  district: string;
  city: string;
  sector: string;
  industry: string;
  role: string;
  timePeriod: string;
}

// Master Raw Datasets (Prototype)
export const RAW_DEMAND_TRENDS: MonthlyDemandPoint[] = [
  { month: "Oct 2025", totalPostings: 9840, itPostings: 5410, bfsiPostings: 1840, coreEngPostings: 1530, otherPostings: 1060 },
  { month: "Nov 2025", totalPostings: 10250, itPostings: 5690, bfsiPostings: 1920, coreEngPostings: 1580, otherPostings: 1060 },
  { month: "Dec 2025", totalPostings: 9910, itPostings: 5380, bfsiPostings: 1890, coreEngPostings: 1610, otherPostings: 1030 },
  { month: "Jan 2026", totalPostings: 11420, itPostings: 6350, bfsiPostings: 2180, coreEngPostings: 1790, otherPostings: 1100 },
  { month: "Feb 2026", totalPostings: 12150, itPostings: 6820, bfsiPostings: 2310, coreEngPostings: 1860, otherPostings: 1160 },
  { month: "Mar 2026", totalPostings: 13080, itPostings: 7390, bfsiPostings: 2490, coreEngPostings: 1980, otherPostings: 1220 },
  { month: "Apr 2026", totalPostings: 12640, itPostings: 7080, bfsiPostings: 2410, coreEngPostings: 1950, otherPostings: 1200 },
  { month: "May 2026", totalPostings: 13420, itPostings: 7590, bfsiPostings: 2580, coreEngPostings: 2040, otherPostings: 1210 },
  { month: "Jun 2026", totalPostings: 14190, itPostings: 8120, bfsiPostings: 2710, coreEngPostings: 2110, otherPostings: 1250 },
  { month: "Jul 2026", totalPostings: 14950, itPostings: 8640, bfsiPostings: 2830, coreEngPostings: 2190, otherPostings: 1290 },
  { month: "Aug 2026", totalPostings: 15380, itPostings: 8910, bfsiPostings: 2910, coreEngPostings: 2240, otherPostings: 1320 },
  { month: "Sep 2026 (Est)", totalPostings: 15820, itPostings: 9180, bfsiPostings: 3010, coreEngPostings: 2290, otherPostings: 1340 },
];

export const RAW_DEMANDED_SKILLS: DemandedSkill[] = [
  {
    name: "Python",
    category: "Language",
    demandCount: 42150,
    demandSharePct: 29.5,
    yoyGrowthPct: 28.4,
    associatedRoles: ["AI / Machine Learning Engineer", "Data Engineer & Big Data Architect", "Backend Systems Engineer (Go/Rust/Java)"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)", "Healthcare, Bio-Tech & Pharma"],
    proficiencySplit: { beginnerPct: 25, intermediatePct: 45, advancedPct: 24, expertPct: 6 },
    curriculumStatus: "Commonly Taught",
  },
  {
    name: "SQL & Relational Databases (PostgreSQL)",
    category: "Database",
    demandCount: 39800,
    demandSharePct: 27.8,
    yoyGrowthPct: 18.2,
    associatedRoles: ["Data Engineer & Big Data Architect", "Full Stack Software Engineer", "Backend Systems Engineer (Go/Rust/Java)"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)", "E-Commerce, Retail Tech & Logistics"],
    proficiencySplit: { beginnerPct: 30, intermediatePct: 48, advancedPct: 18, expertPct: 4 },
    curriculumStatus: "Commonly Taught",
  },
  {
    name: "React & Next.js",
    category: "Framework",
    demandCount: 36400,
    demandSharePct: 25.5,
    yoyGrowthPct: 22.7,
    associatedRoles: ["Full Stack Software Engineer", "Frontend & Mobile Engineer (React/React Native)"],
    associatedSectors: ["Information Technology & Cloud", "E-Commerce, Retail Tech & Logistics", "Banking, Financial Services & Insurance (BFSI)"],
    proficiencySplit: { beginnerPct: 22, intermediatePct: 52, advancedPct: 22, expertPct: 4 },
    curriculumStatus: "Partially Covered",
  },
  {
    name: "Docker & Containerization",
    category: "Cloud/DevOps",
    demandCount: 33100,
    demandSharePct: 23.2,
    yoyGrowthPct: 34.6,
    associatedRoles: ["Cloud & DevOps Engineer", "Full Stack Software Engineer", "Backend Systems Engineer (Go/Rust/Java)"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)", "Core Engineering & High-Tech Manufacturing"],
    proficiencySplit: { beginnerPct: 28, intermediatePct: 46, advancedPct: 21, expertPct: 5 },
    curriculumStatus: "Severe Curriculum Gap",
  },
  {
    name: "AWS / Cloud Infrastructure (EC2, S3, IAM, Lambda)",
    category: "Cloud/DevOps",
    demandCount: 31200,
    demandSharePct: 21.8,
    yoyGrowthPct: 31.0,
    associatedRoles: ["Cloud & DevOps Engineer", "Data Engineer & Big Data Architect", "Full Stack Software Engineer"],
    associatedSectors: ["Information Technology & Cloud", "E-Commerce, Retail Tech & Logistics", "CleanTech, Renewable Energy & EV"],
    proficiencySplit: { beginnerPct: 20, intermediatePct: 45, advancedPct: 28, expertPct: 7 },
    curriculumStatus: "Severe Curriculum Gap",
  },
  {
    name: "TypeScript",
    category: "Language",
    demandCount: 29850,
    demandSharePct: 20.9,
    yoyGrowthPct: 38.5,
    associatedRoles: ["Full Stack Software Engineer", "Frontend & Mobile Engineer (React/React Native)", "Backend Systems Engineer (Go/Rust/Java)"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)"],
    proficiencySplit: { beginnerPct: 26, intermediatePct: 49, advancedPct: 20, expertPct: 5 },
    curriculumStatus: "Partially Covered",
  },
  {
    name: "System Design & Distributed Architecture",
    category: "Architecture",
    demandCount: 27900,
    demandSharePct: 19.5,
    yoyGrowthPct: 24.1,
    associatedRoles: ["Backend Systems Engineer (Go/Rust/Java)", "Cloud & DevOps Engineer", "Full Stack Software Engineer"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)", "E-Commerce, Retail Tech & Logistics"],
    proficiencySplit: { beginnerPct: 12, intermediatePct: 40, advancedPct: 38, expertPct: 10 },
    curriculumStatus: "Partially Covered",
  },
  {
    name: "Kubernetes & Orchestration",
    category: "Cloud/DevOps",
    demandCount: 24300,
    demandSharePct: 17.0,
    yoyGrowthPct: 42.0,
    associatedRoles: ["Cloud & DevOps Engineer", "Backend Systems Engineer (Go/Rust/Java)"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)"],
    proficiencySplit: { beginnerPct: 15, intermediatePct: 42, advancedPct: 33, expertPct: 10 },
    curriculumStatus: "Severe Curriculum Gap",
  },
  {
    name: "Data Structures & Algorithmic Problem Solving",
    category: "Architecture",
    demandCount: 46200,
    demandSharePct: 32.3,
    yoyGrowthPct: 9.5,
    associatedRoles: ["All Roles", "Full Stack Software Engineer", "Backend Systems Engineer (Go/Rust/Java)", "AI / Machine Learning Engineer"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)"],
    proficiencySplit: { beginnerPct: 35, intermediatePct: 45, advancedPct: 16, expertPct: 4 },
    curriculumStatus: "Commonly Taught",
  },
  {
    name: "Apache Kafka / Event-Driven Messaging",
    category: "Architecture",
    demandCount: 19800,
    demandSharePct: 13.9,
    yoyGrowthPct: 36.2,
    associatedRoles: ["Backend Systems Engineer (Go/Rust/Java)", "Data Engineer & Big Data Architect"],
    associatedSectors: ["Banking, Financial Services & Insurance (BFSI)", "E-Commerce, Retail Tech & Logistics", "Information Technology & Cloud"],
    proficiencySplit: { beginnerPct: 14, intermediatePct: 44, advancedPct: 34, expertPct: 8 },
    curriculumStatus: "Severe Curriculum Gap",
  },
  {
    name: "Go (Golang)",
    category: "Language",
    demandCount: 17400,
    demandSharePct: 12.2,
    yoyGrowthPct: 47.8,
    associatedRoles: ["Backend Systems Engineer (Go/Rust/Java)", "Cloud & DevOps Engineer"],
    associatedSectors: ["Information Technology & Cloud", "Banking, Financial Services & Insurance (BFSI)"],
    proficiencySplit: { beginnerPct: 22, intermediatePct: 48, advancedPct: 24, expertPct: 6 },
    curriculumStatus: "Severe Curriculum Gap",
  },
  {
    name: "Cybersecurity & OWASP Top 10",
    category: "Security",
    demandCount: 16200,
    demandSharePct: 11.3,
    yoyGrowthPct: 39.4,
    associatedRoles: ["Cybersecurity & Security Operations Analyst", "Backend Systems Engineer (Go/Rust/Java)"],
    associatedSectors: ["Banking, Financial Services & Insurance (BFSI)", "Information Technology & Cloud", "Healthcare, Bio-Tech & Pharma"],
    proficiencySplit: { beginnerPct: 20, intermediatePct: 47, advancedPct: 26, expertPct: 7 },
    curriculumStatus: "Partially Covered",
  },
];

export const RAW_EMERGING_SKILLS: EmergingSkill[] = [
  {
    name: "Agentic AI & Multi-Agent Frameworks (LangGraph, CrewAI)",
    category: "Data/AI",
    velocityPct: 142.5,
    currentPostings: 7850,
    adoptionMaturity: "Rapid Mainstream Growth",
    keyDrivers: "Transition from simple prompt engineering to autonomous cognitive enterprise workflows.",
    curriculumLagMonths: 24,
    sampleCompaniesHiring: ["Microsoft IDC", "Swiggy", "PhonePe", "Infosys Topaz", "Persistent"],
    suggestedPrerequisites: ["Python", "AsyncIO", "REST/gRPC APIs", "Vector Embeddings"],
  },
  {
    name: "Vector Databases & RAG Architecture (pgvector, Milvus, Pinecone)",
    category: "Database",
    velocityPct: 118.2,
    currentPostings: 9420,
    adoptionMaturity: "Rapid Mainstream Growth",
    keyDrivers: "Enterprise private data retrieval grounding for LLM hallucination prevention.",
    curriculumLagMonths: 20,
    sampleCompaniesHiring: ["Zoho", "Postman", "Razorpay", "Adobe India", "TCS AI Labs"],
    suggestedPrerequisites: ["SQL & Relational Databases", "Linear Algebra Basics", "Python"],
  },
  {
    name: "Rust Systems Programming & Memory Safety",
    category: "Language",
    velocityPct: 88.6,
    currentPostings: 6180,
    adoptionMaturity: "Early Adopter",
    keyDrivers: "High-throughput cloud proxies, Linux kernel modules, WebAssembly, and EV firmware.",
    curriculumLagMonths: 30,
    sampleCompaniesHiring: ["Cloudflare", "Ola Electric", "Amazon Web Services", "Qualcomm", "Brave"],
    suggestedPrerequisites: ["C/C++ Memory Management", "Concurrency Concepts", "Data Structures"],
  },
  {
    name: "eBPF & Kernel-Level Observability",
    category: "Cloud/DevOps",
    velocityPct: 76.4,
    currentPostings: 3820,
    adoptionMaturity: "Early Adopter",
    keyDrivers: "Zero-overhead network security monitoring and microservice distributed tracing.",
    curriculumLagMonths: 36,
    sampleCompaniesHiring: ["Cisco", "Datadog", "Red Hat", "Jio Platforms", "Flipkart"],
    suggestedPrerequisites: ["Operating Systems Internals", "Linux CLI", "Networking Protocols"],
  },
  {
    name: "dbt (data build tool) & Analytics Engineering",
    category: "Data/AI",
    velocityPct: 71.0,
    currentPostings: 5490,
    adoptionMaturity: "Rapid Mainstream Growth",
    keyDrivers: "Shift towards modular, version-controlled SQL data transformation pipelines.",
    curriculumLagMonths: 18,
    sampleCompaniesHiring: ["Zepto", "CRED", "MakeMyTrip", "HDFC Bank Digital", "Mu Sigma"],
    suggestedPrerequisites: ["Advanced SQL", "Git", "Data Warehousing (Snowflake/BigQuery)"],
  },
  {
    name: "Edge AI & Embedded TinyML",
    category: "Architecture",
    velocityPct: 64.8,
    currentPostings: 4310,
    adoptionMaturity: "Exploratory",
    keyDrivers: "On-device inference for connected automotive, robotics, and industrial IoT without latency.",
    curriculumLagMonths: 28,
    sampleCompaniesHiring: ["Bosch India", "Texas Instruments", "Ather Energy", "L&T Technology Services"],
    suggestedPrerequisites: ["C/Embedded C", "Microcontrollers", "TensorFlow Lite"],
  },
];

export const RAW_DECLINING_SKILLS: DecliningSkill[] = [
  {
    name: "AngularJS (1.x Legacy)",
    category: "Framework",
    declinePct: -68.4,
    reason: "Official end-of-life, architectural obsolescence, migration to modern component paradigms.",
    replacementSkill: "React 19 / Next.js or modern Angular (v18+)",
    transitionAdvice: "Retain TypeScript and component lifecycle knowledge; re-anchor in reactive state and modern bundlers.",
  },
  {
    name: "Legacy jQuery-centric DOM Manipulation",
    category: "Library",
    declinePct: -54.2,
    reason: "Standard modern browser ECMAScript APIs and declarative UI frameworks made jQuery redundant.",
    replacementSkill: "Modern Vanilla JavaScript (ES2024+) & TypeScript",
    transitionAdvice: "Focus on DOM Web APIs (`fetch`, `querySelector`), native promises, and declarative UI libraries.",
  },
  {
    name: "SOAP & XML-RPC Web Services",
    category: "Architecture",
    declinePct: -48.0,
    reason: "High payload overhead, verbosity; superseded by REST, gRPC, and GraphQL.",
    replacementSkill: "gRPC (Protobuf) & RESTful OpenAPI specifications",
    transitionAdvice: "Translate schema contracts to Protocol Buffers and high-performance RPC protocols.",
  },
  {
    name: "Manual Regression QA & Manual Test Scripting",
    category: "Testing",
    declinePct: -44.5,
    reason: "Shift-left engineering requires test automation embedded directly into CI/CD pipelines.",
    replacementSkill: "Playwright / Cypress + PyTest / JUnit Automation",
    transitionAdvice: "Learn automated headless browser scripting, API test suites, and GitHub Actions integration.",
  },
  {
    name: "On-Premises Monolithic SVN / CVS Version Control",
    category: "Tooling",
    declinePct: -58.1,
    reason: "Ubiquitous adoption of distributed Git-based workflows and cloud pull-request governance.",
    replacementSkill: "Git & Trunk-Based CI/CD Development",
    transitionAdvice: "Master branching strategies, rebase workflows, and GitOps concepts.",
  },
];

export const RAW_GROWING_ROLES: GrowingRole[] = [
  {
    role: "AI / Machine Learning Engineer",
    sector: "Information Technology & Cloud",
    demandVolume: 18450,
    yoyGrowthPct: 52.8,
    salaryRangeLPA: { entryMin: 8.5, entryMax: 16.0, medianExperienced: 28.5 },
    primaryHiringDistricts: ["Bengaluru Urban", "Hyderabad", "Pune", "Gurugram"],
    keyRequiredSkills: ["Python", "PyTorch / TensorFlow", "LangChain / Multi-Agent", "Vector DBs", "Docker"],
    freshersEligible: true,
  },
  {
    role: "Cloud & DevOps Engineer",
    sector: "Information Technology & Cloud",
    demandVolume: 22100,
    yoyGrowthPct: 37.4,
    salaryRangeLPA: { entryMin: 6.5, entryMax: 12.0, medianExperienced: 22.0 },
    primaryHiringDistricts: ["Bengaluru Urban", "Hyderabad", "Pune", "Chennai", "Noida"],
    keyRequiredSkills: ["Docker", "Kubernetes", "AWS / Cloud", "Terraform", "Linux & CI/CD"],
    freshersEligible: true,
  },
  {
    role: "Full Stack Software Engineer",
    sector: "Information Technology & Cloud",
    demandVolume: 34800,
    yoyGrowthPct: 24.6,
    salaryRangeLPA: { entryMin: 6.0, entryMax: 11.5, medianExperienced: 19.5 },
    primaryHiringDistricts: ["Bengaluru Urban", "Pune", "Hyderabad", "Mumbai Suburban", "Gurugram"],
    keyRequiredSkills: ["React / Next.js", "TypeScript", "Node.js / Go", "SQL / PostgreSQL", "System Design"],
    freshersEligible: true,
  },
  {
    role: "Data Engineer & Big Data Architect",
    sector: "Banking, Financial Services & Insurance (BFSI)",
    demandVolume: 19300,
    yoyGrowthPct: 32.1,
    salaryRangeLPA: { entryMin: 7.0, entryMax: 13.0, medianExperienced: 24.0 },
    primaryHiringDistricts: ["Mumbai Suburban", "Bengaluru Urban", "Hyderabad", "Chennai"],
    keyRequiredSkills: ["Python", "Apache Spark", "SQL / PostgreSQL", "Kafka", "Data Warehousing"],
    freshersEligible: true,
  },
  {
    role: "Cybersecurity & Security Operations Analyst",
    sector: "Banking, Financial Services & Insurance (BFSI)",
    demandVolume: 12600,
    yoyGrowthPct: 35.8,
    salaryRangeLPA: { entryMin: 6.5, entryMax: 11.0, medianExperienced: 21.0 },
    primaryHiringDistricts: ["Mumbai Suburban", "Bengaluru Urban", "Gurugram", "Hyderabad"],
    keyRequiredSkills: ["Network Security", "OWASP Top 10", "SIEM (Splunk/Sentinel)", "Linux", "Python Scripting"],
    freshersEligible: true,
  },
  {
    role: "Embedded Systems & Firmware Engineer",
    sector: "Core Engineering & High-Tech Manufacturing",
    demandVolume: 11400,
    yoyGrowthPct: 29.3,
    salaryRangeLPA: { entryMin: 5.5, entryMax: 10.5, medianExperienced: 18.0 },
    primaryHiringDistricts: ["Bengaluru Urban", "Pune", "Chennai", "Ahmedabad"],
    keyRequiredSkills: ["Embedded C / C++", "RTOS", "CAN / SPI / I2C Protocols", "ARM Cortex", "Debugging"],
    freshersEligible: true,
  },
];

export const RAW_DISTRICT_DEMAND: DistrictDemand[] = [
  { state: "Karnataka", district: "Bengaluru Urban", postingsCount: 46800, sharePct: 32.8, primarySector: "Information Technology & Cloud", topRole: "Full Stack Software Engineer", avgFresherLPA: 7.8, growthRatePct: 26.4 },
  { state: "Maharashtra", district: "Pune", postingsCount: 22400, sharePct: 15.7, primarySector: "Information Technology & Cloud", topRole: "Cloud & DevOps Engineer", avgFresherLPA: 6.5, growthRatePct: 24.1 },
  { state: "Telangana", district: "Hyderabad", postingsCount: 20100, sharePct: 14.1, primarySector: "Information Technology & Cloud", topRole: "AI / Machine Learning Engineer", avgFresherLPA: 7.2, growthRatePct: 28.5 },
  { state: "Maharashtra", district: "Mumbai Suburban", postingsCount: 15900, sharePct: 11.1, primarySector: "Banking, Financial Services & Insurance (BFSI)", topRole: "Data Engineer & Big Data Architect", avgFresherLPA: 7.0, growthRatePct: 19.8 },
  { state: "Tamil Nadu", district: "Chennai", postingsCount: 13800, sharePct: 9.7, primarySector: "Core Engineering & High-Tech Manufacturing", topRole: "Full Stack Software Engineer", avgFresherLPA: 6.2, growthRatePct: 21.3 },
  { state: "Delhi NCR", district: "Gurugram", postingsCount: 11200, sharePct: 7.8, primarySector: "E-Commerce, Retail Tech & Logistics", topRole: "Full Stack Software Engineer", avgFresherLPA: 7.5, growthRatePct: 25.0 },
  { state: "Uttar Pradesh", district: "Gautam Buddha Nagar (Noida)", postingsCount: 7850, sharePct: 5.5, primarySector: "Information Technology & Cloud", topRole: "Cloud & DevOps Engineer", avgFresherLPA: 6.0, growthRatePct: 22.9 },
  { state: "Gujarat", district: "Ahmedabad", postingsCount: 4800, sharePct: 3.3, primarySector: "Banking, Financial Services & Insurance (BFSI)", topRole: "Cybersecurity & Security Operations Analyst", avgFresherLPA: 5.8, growthRatePct: 31.2 },
];

export const RAW_EXPERIENCE_REQUIREMENTS: ExperienceRequirement[] = [
  {
    tier: "Entry-Level / Freshers (0-1 yrs)",
    percentage: 26.5,
    postingCount: 37855,
    description: "Campus drives, junior software engineers, graduate engineer trainees, and associate roles.",
  },
  {
    tier: "Associate / Junior (1-3 yrs)",
    percentage: 34.2,
    postingCount: 48855,
    description: "Engineers with hands-on production code experience, framework fluency, and basic system design.",
  },
  {
    tier: "Mid-Level (3-5 yrs)",
    percentage: 27.8,
    postingCount: 39712,
    description: "Independent feature owners, microservice architects, distributed systems developers.",
  },
  {
    tier: "Senior / Lead (5+ yrs)",
    percentage: 11.5,
    postingCount: 16428,
    description: "Tech leads, principal engineers, engineering managers, and cloud architects.",
  },
];

// Calculation and Filtering Utility
export interface FilteredMarketIntelligence {
  filter: FilterState;
  provenance: DatasetProvenance;
  totalPostings: number;
  overallGrowthRatePct: number;
  activeCompaniesCount: number;
  demandTrends: MonthlyDemandPoint[];
  topSkills: DemandedSkill[];
  emergingSkills: EmergingSkill[];
  decliningSkills: DecliningSkill[];
  growingRoles: GrowingRole[];
  districtDemand: DistrictDemand[];
  experienceRequirements: ExperienceRequirement[];
  topDemandedSkill: string;
  fastestGrowingRole: string;
}

export function filterMarketData(filter: FilterState): FilteredMarketIntelligence {
  // Compute multiplier based on active filters to simulate slice aggregations
  let multiplier = 1.0;
  if (filter.state && filter.state !== "All States") multiplier *= 0.45;
  if (filter.district && filter.district !== "All Districts") multiplier *= 0.65;
  if (filter.sector && filter.sector !== "All Sectors") multiplier *= 0.50;
  if (filter.role && filter.role !== "All Roles") multiplier *= 0.35;
  if (filter.timePeriod === "Last 30 Days") multiplier *= 0.28;
  else if (filter.timePeriod === "Last 90 Days (Q3 2026)") multiplier *= 0.58;
  else if (filter.timePeriod === "Last 6 Months") multiplier *= 0.78;

  const totalPostings = Math.max(850, Math.round(DATASET_PROVENANCE.sampleSizePostings * multiplier));
  const activeCompaniesCount = Math.max(120, Math.round(DATASET_PROVENANCE.sampleSizeEmployers * multiplier));

  // Filter skills matching sector or role if specified
  let skills = [...RAW_DEMANDED_SKILLS];
  if (filter.role && filter.role !== "All Roles") {
    skills = skills.filter((s) => s.associatedRoles.includes(filter.role) || s.associatedRoles.includes("All Roles"));
    if (skills.length < 5) skills = RAW_DEMANDED_SKILLS.slice(0, 7);
  }
  if (filter.sector && filter.sector !== "All Sectors") {
    skills = skills.filter((s) => s.associatedSectors.includes(filter.sector));
    if (skills.length < 5) skills = RAW_DEMANDED_SKILLS.slice(0, 7);
  }

  // Adjusted skill counts
  const adjustedSkills: DemandedSkill[] = skills.map((s) => ({
    ...s,
    demandCount: Math.max(140, Math.round(s.demandCount * multiplier)),
  }));

  // Filter districts if state specified
  let districts = [...RAW_DISTRICT_DEMAND];
  if (filter.state && filter.state !== "All States") {
    districts = districts.filter((d) => d.state === filter.state);
    if (districts.length === 0) districts = RAW_DISTRICT_DEMAND.slice(0, 3);
  }

  // Filter growing roles
  let growingRoles = [...RAW_GROWING_ROLES];
  if (filter.sector && filter.sector !== "All Sectors") {
    const matched = growingRoles.filter((r) => r.sector === filter.sector);
    if (matched.length > 0) growingRoles = matched;
  }
  if (filter.role && filter.role !== "All Roles") {
    const matched = growingRoles.filter((r) => r.role === filter.role);
    if (matched.length > 0) growingRoles = matched;
  }

  // Filter trends
  const demandTrends = RAW_DEMAND_TRENDS.map((p) => ({
    ...p,
    totalPostings: Math.round(p.totalPostings * multiplier),
    itPostings: Math.round(p.itPostings * multiplier),
    bfsiPostings: Math.round(p.bfsiPostings * multiplier),
    coreEngPostings: Math.round(p.coreEngPostings * multiplier),
    otherPostings: Math.round(p.otherPostings * multiplier),
  }));

  // Top metrics
  const topDemandedSkill = adjustedSkills[0]?.name ?? "Python";
  const fastestGrowingRole = growingRoles.sort((a, b) => b.yoyGrowthPct - a.yoyGrowthPct)[0]?.role ?? "AI / Machine Learning Engineer";

  return {
    filter,
    provenance: DATASET_PROVENANCE,
    totalPostings,
    overallGrowthRatePct: 27.4,
    activeCompaniesCount,
    demandTrends,
    topSkills: adjustedSkills,
    emergingSkills: RAW_EMERGING_SKILLS,
    decliningSkills: RAW_DECLINING_SKILLS,
    growingRoles,
    districtDemand: districts,
    experienceRequirements: RAW_EXPERIENCE_REQUIREMENTS,
    topDemandedSkill,
    fastestGrowingRole,
  };
}

// Cross-Layer Student Employability Bridge
export interface StudentMarketAlignmentReport {
  studentSkills: string[];
  matchedSkills: DemandedSkill[];
  missingHighDemandSkills: DemandedSkill[];
  missingEmergingSkills: EmergingSkill[];
  curriculumGaps: DemandedSkill[];
  alignmentScorePct: number;
  focusRole: string | null;
  recommendedRoadmapActions: {
    skill: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM";
    reason: string;
    targetRole: string;
  }[];
}

export function evaluateStudentMarketAlignment({
  userSkills = [],
  userSubjects = [],
  marketData,
  preferredRoles = [],
}: {
  userSkills: string[] | null | undefined;
  userSubjects: { name: string; interview_topics?: string[] | null }[] | null | undefined;
  marketData: FilteredMarketIntelligence;
  preferredRoles?: string[] | null;
}): StudentMarketAlignmentReport {
  const normSkills = new Set((userSkills ?? []).map((s) => s.toLowerCase().trim()));
  const normSubjects = new Set(
    (userSubjects ?? []).flatMap((sub) => [
      sub.name.toLowerCase().trim(),
      ...(sub.interview_topics ?? []).map((t) => t.toLowerCase().trim()),
    ]),
  );

  const matchedSkills: DemandedSkill[] = [];
  const missingHighDemandSkills: DemandedSkill[] = [];
  const curriculumGaps: DemandedSkill[] = [];

  marketData.topSkills.forEach((skill) => {
    const sName = skill.name.toLowerCase();
    const isStudentHas = normSkills.has(sName) || Array.from(normSkills).some((userSkill) => sName.includes(userSkill) || userSkill.includes(sName));
    const isSubjectCovers = normSubjects.has(sName) || Array.from(normSubjects).some((sub) => sName.includes(sub) || sub.includes(sName));

    if (isStudentHas) {
      matchedSkills.push(skill);
    } else {
      missingHighDemandSkills.push(skill);
    }

    if (!isSubjectCovers && skill.curriculumStatus === "Severe Curriculum Gap") {
      curriculumGaps.push(skill);
    }
  });

  const missingEmergingSkills = marketData.emergingSkills.filter((em) => {
    const emName = em.name.toLowerCase();
    return !Array.from(normSkills).some((userSkill) => emName.includes(userSkill));
  });

  // Calculate alignment score
  const totalTopSkills = Math.max(1, marketData.topSkills.length);
  const matchedCount = matchedSkills.length;
  const rawScore = Math.round((matchedCount / totalTopSkills) * 100);
  const alignmentScorePct = Math.min(100, Math.max(15, rawScore));

  const focusRole = preferredRoles?.[0] ?? marketData.fastestGrowingRole;

  // Generate actionable roadmap recommendations
  const recommendedRoadmapActions = missingHighDemandSkills.slice(0, 4).map((skill, index) => ({
    skill: skill.name,
    priority: index === 0 ? ("CRITICAL" as const) : index < 3 ? ("HIGH" as const) : ("MEDIUM" as const),
    reason: `${skill.demandSharePct}% of active market postings require proficiency in ${skill.name}.`,
    targetRole: skill.associatedRoles[0] ?? focusRole,
  }));

  return {
    studentSkills: userSkills ?? [],
    matchedSkills,
    missingHighDemandSkills,
    missingEmergingSkills,
    curriculumGaps,
    alignmentScorePct,
    focusRole,
    recommendedRoadmapActions,
  };
}

// ---------------------------------------------------------------------------------------
// SECTION 3: SKILL TRENDS & 4-BUCKET EVIDENCE-BASED CLASSIFICATION DATASET
// ---------------------------------------------------------------------------------------

export type SkillClassification = "Emerging" | "Growing" | "Stable" | "Declining / Low observed demand";

export interface SkillEvidenceItem {
  id: string;
  name: string;
  category: string;
  classification: SkillClassification;
  evidenceLabel: "Emerging" | "Growing" | "Stable" | "Low observed demand" | "Declining observed demand" | "Curriculum review recommended";
  currentPostings: number;
  yoyGrowthPct: number;
  velocityRank: number;
  evidenceSummary: string;
  evidencePoints: string[];
  hiringSectors: { sector: string; pct: number }[];
  trendTimeline: { quarter: string; postings: number; index: number }[];
  replacementOrComplement?: string;
  curriculumAdvice: string;
}

export const SKILL_TREND_DATASET: SkillEvidenceItem[] = [
  // 1. Emerging
  {
    id: "agentic-ai",
    name: "Agentic AI & Cognitive Workflows",
    category: "Data/AI",
    classification: "Emerging",
    evidenceLabel: "Emerging",
    currentPostings: 7850,
    yoyGrowthPct: 142.5,
    velocityRank: 1,
    evidenceSummary: "Rapid inflection point observed across Q1-Q3 2026 enterprise talent requisitions as firms migrate from conversational chat interfaces to autonomous multi-agent tool execution.",
    evidencePoints: [
      "Job postings requesting LangGraph, CrewAI, or AutoGen surged from 1,200 in Q1 2025 to 7,850 in Q3 2026.",
      "Primary demand originates from SaaS automation, banking risk operations, and developer productivity tools.",
      "Less than 4% of current tier-1/2 engineering curricula contain hands-on agentic system modules.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 62 },
      { sector: "BFSI & FinTech", pct: 24 },
      { sector: "Healthcare & Life Sciences", pct: 14 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 1200, index: 15 },
      { quarter: "Q2 2025", postings: 2100, index: 26 },
      { quarter: "Q3 2025", postings: 3240, index: 41 },
      { quarter: "Q4 2025", postings: 4500, index: 57 },
      { quarter: "Q1 2026", postings: 5800, index: 73 },
      { quarter: "Q2 2026", postings: 6900, index: 87 },
      { quarter: "Q3 2026", postings: 7850, index: 100 },
    ],
    replacementOrComplement: "Complementary to Python, AsyncIO, and Vector DBs",
    curriculumAdvice: "Curriculum review recommended: Integrate 2-week multi-agent architecture lab into advanced elective courses.",
  },
  {
    id: "vector-dbs-rag",
    name: "Vector Databases & RAG Architecture",
    category: "Database",
    classification: "Emerging",
    evidenceLabel: "Emerging",
    currentPostings: 9420,
    yoyGrowthPct: 118.2,
    velocityRank: 2,
    evidenceSummary: "Substantial acceleration driven by enterprise need to ground LLMs on proprietary knowledge repositories with sub-second hybrid retrieval.",
    evidencePoints: [
      "Observed postings specifying pgvector, Pinecone, Milvus, or Qdrant expanded by 118% year-over-year.",
      "High overlap with traditional relational database engineering and embedding pipeline design.",
      "78% of enterprise AI teams require hybrid BM25 + dense vector retrieval competencies.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 58 },
      { sector: "E-Commerce & Retail Tech", pct: 22 },
      { sector: "BFSI & FinTech", pct: 20 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 1800, index: 19 },
      { quarter: "Q2 2025", postings: 3100, index: 32 },
      { quarter: "Q3 2025", postings: 4320, index: 45 },
      { quarter: "Q4 2025", postings: 5900, index: 62 },
      { quarter: "Q1 2026", postings: 7200, index: 76 },
      { quarter: "Q2 2026", postings: 8400, index: 89 },
      { quarter: "Q3 2026", postings: 9420, index: 100 },
    ],
    replacementOrComplement: "Built atop SQL / Relational Foundations",
    curriculumAdvice: "Introduce pgvector extension hands-on modules in existing DBMS university labs.",
  },
  {
    id: "rust-systems",
    name: "Rust Systems & Memory Safety",
    category: "Language",
    classification: "Emerging",
    evidenceLabel: "Emerging",
    currentPostings: 6180,
    yoyGrowthPct: 88.6,
    velocityRank: 3,
    evidenceSummary: "Steady adoption across low-latency financial systems, cloud infrastructure runtimes, and automotive EV firmware.",
    evidencePoints: [
      "Listings for Rust developers grew by 88% YoY across cybersecurity, cloud proxies, and embedded Linux domains.",
      "Major tech employers actively migrating performance-critical C++ services to Rust to eliminate memory safety vulnerabilities.",
    ],
    hiringSectors: [
      { sector: "Core Engineering & High-Tech", pct: 44 },
      { sector: "Information Technology & Cloud", pct: 36 },
      { sector: "CleanTech & EV", pct: 20 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 1400, index: 22 },
      { quarter: "Q2 2025", postings: 2200, index: 35 },
      { quarter: "Q3 2025", postings: 3270, index: 52 },
      { quarter: "Q4 2025", postings: 4100, index: 66 },
      { quarter: "Q1 2026", postings: 4850, index: 78 },
      { quarter: "Q2 2026", postings: 5500, index: 88 },
      { quarter: "Q3 2026", postings: 6180, index: 100 },
    ],
    replacementOrComplement: "Transition path from C/C++ memory paradigms",
    curriculumAdvice: "Introduce Rust ownership semantics in Systems Programming and OS electives.",
  },
  {
    id: "ebpf-observability",
    name: "eBPF Kernel-Level Observability",
    category: "Cloud/DevOps",
    classification: "Emerging",
    evidenceLabel: "Emerging",
    currentPostings: 3820,
    yoyGrowthPct: 76.4,
    velocityRank: 4,
    evidenceSummary: "Surge in cloud infrastructure and security teams seeking zero-overhead network packet monitoring directly in the Linux kernel.",
    evidencePoints: [
      "Demand concentrated among high-scale microservices, cloud monitoring vendors, and telecom networks.",
      "High prerequisite requirements in Linux internals and C systems programming.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 78 },
      { sector: "BFSI & FinTech", pct: 22 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 950, index: 24 },
      { quarter: "Q2 2025", postings: 1400, index: 36 },
      { quarter: "Q3 2025", postings: 2160, index: 56 },
      { quarter: "Q4 2025", postings: 2750, index: 71 },
      { quarter: "Q1 2026", postings: 3100, index: 81 },
      { quarter: "Q2 2026", postings: 3500, index: 91 },
      { quarter: "Q3 2026", postings: 3820, index: 100 },
    ],
    curriculumAdvice: "Ideal for advanced final-year cloud networking and operating systems capstone projects.",
  },

  // 2. Growing
  {
    id: "python-ecosystem",
    name: "Python Ecosystem",
    category: "Language",
    classification: "Growing",
    evidenceLabel: "Growing",
    currentPostings: 42150,
    yoyGrowthPct: 28.4,
    velocityRank: 5,
    evidenceSummary: "Mainstream expansion sustained by machine learning, data engineering, and backend microservice adoption across all industries.",
    evidencePoints: [
      "Continues as the single most requested programming language across campus hiring and lateral requisitions.",
      "Year-over-year posting volumes expanded by 28.4%, with increasing emphasis on async performance and type hinting.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 48 },
      { sector: "BFSI & FinTech", pct: 28 },
      { sector: "Healthcare & Life Sciences", pct: 14 },
      { sector: "Core Engineering", pct: 10 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 29000, index: 68 },
      { quarter: "Q2 2025", postings: 31500, index: 74 },
      { quarter: "Q3 2025", postings: 32800, index: 77 },
      { quarter: "Q4 2025", postings: 35200, index: 83 },
      { quarter: "Q1 2026", postings: 37900, index: 89 },
      { quarter: "Q2 2026", postings: 40100, index: 95 },
      { quarter: "Q3 2026", postings: 42150, index: 100 },
    ],
    curriculumAdvice: "Curriculum presence is high; strengthen practical async, data modeling, and production packaging.",
  },
  {
    id: "docker-containers",
    name: "Docker & Container Architecture",
    category: "Cloud/DevOps",
    classification: "Growing",
    evidenceLabel: "Growing",
    currentPostings: 33100,
    yoyGrowthPct: 34.6,
    velocityRank: 6,
    evidenceSummary: "Universal baseline for modern software deployment, microservice isolation, and CI/CD automation pipelines.",
    evidencePoints: [
      "Over 33,000 active postings list containerization as an essential qualification, growing at 34.6% YoY.",
      "Severe gap in college curriculum where deployments are still taught using bare-metal localhost runtimes.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 54 },
      { sector: "BFSI & FinTech", pct: 26 },
      { sector: "E-Commerce & Retail Tech", pct: 20 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 21500, index: 64 },
      { quarter: "Q2 2025", postings: 23800, index: 71 },
      { quarter: "Q3 2025", postings: 24600, index: 74 },
      { quarter: "Q4 2025", postings: 26900, index: 81 },
      { quarter: "Q1 2026", postings: 29100, index: 87 },
      { quarter: "Q2 2026", postings: 31200, index: 94 },
      { quarter: "Q3 2026", postings: 33100, index: 100 },
    ],
    curriculumAdvice: "Curriculum review recommended: Mandate Dockerfile containerization for all semester project submissions.",
  },
  {
    id: "react-nextjs",
    name: "React 19 & Next.js Ecosystem",
    category: "Framework",
    classification: "Growing",
    evidenceLabel: "Growing",
    currentPostings: 36400,
    yoyGrowthPct: 22.7,
    velocityRank: 7,
    evidenceSummary: "Dominant frontend web standard in production, transitioning towards server-side rendering (SSR) and server actions.",
    evidencePoints: [
      "Consistently demanded across product startups and digital enterprise re-platforming initiatives.",
      "22.7% YoY growth in requisitions specifying React with modern TypeScript conventions.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 52 },
      { sector: "E-Commerce & Retail Tech", pct: 30 },
      { sector: "BFSI & FinTech", pct: 18 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 26400, index: 72 },
      { quarter: "Q2 2025", postings: 28100, index: 77 },
      { quarter: "Q3 2025", postings: 29600, index: 81 },
      { quarter: "Q4 2025", postings: 31800, index: 87 },
      { quarter: "Q1 2026", postings: 33400, index: 91 },
      { quarter: "Q2 2026", postings: 34900, index: 95 },
      { quarter: "Q3 2026", postings: 36400, index: 100 },
    ],
    curriculumAdvice: "Upgrade existing Web Technology syllabus from legacy DOM scripting to modern component workflows.",
  },
  {
    id: "kubernetes-orchestration",
    name: "Kubernetes & Cloud Orchestration",
    category: "Cloud/DevOps",
    classification: "Growing",
    evidenceLabel: "Growing",
    currentPostings: 24300,
    yoyGrowthPct: 42.0,
    velocityRank: 8,
    evidenceSummary: "Enterprise cloud standard for managing container clusters, multi-region failovers, and auto-scaling.",
    evidencePoints: [
      "Postings increased 42% YoY, spreading from specialized DevOps roles into senior backend engineering requisitions.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 60 },
      { sector: "BFSI & FinTech", pct: 30 },
      { sector: "Healthcare & Life Sciences", pct: 10 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 14800, index: 60 },
      { quarter: "Q2 2025", postings: 16500, index: 67 },
      { quarter: "Q3 2025", postings: 17100, index: 70 },
      { quarter: "Q4 2025", postings: 19200, index: 79 },
      { quarter: "Q1 2026", postings: 21100, index: 86 },
      { quarter: "Q2 2026", postings: 22800, index: 93 },
      { quarter: "Q3 2026", postings: 24300, index: 100 },
    ],
    curriculumAdvice: "Introduce Helm chart deployments and service mesh concepts in cloud computing electives.",
  },

  // 3. Stable
  {
    id: "sql-relational-db",
    name: "SQL & Relational Databases (PostgreSQL)",
    category: "Database",
    classification: "Stable",
    evidenceLabel: "Stable",
    currentPostings: 39800,
    yoyGrowthPct: 18.2,
    velocityRank: 9,
    evidenceSummary: "Bedrock foundational competency for all software engineering disciplines, exhibiting consistent long-term replacement and growth hiring.",
    evidencePoints: [
      "Required in over 85% of software engineering technical interviews.",
      "Healthy demand trajectory with low volatility across all 8 major monitored industrial sectors.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 42 },
      { sector: "BFSI & FinTech", pct: 36 },
      { sector: "E-Commerce & Retail Tech", pct: 22 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 31200, index: 78 },
      { quarter: "Q2 2025", postings: 32600, index: 81 },
      { quarter: "Q3 2025", postings: 33600, index: 84 },
      { quarter: "Q4 2025", postings: 35100, index: 88 },
      { quarter: "Q1 2026", postings: 36800, index: 92 },
      { quarter: "Q2 2026", postings: 38400, index: 96 },
      { quarter: "Q3 2026", postings: 39800, index: 100 },
    ],
    curriculumAdvice: "Well-represented in university DBMS courses; expand coverage into query execution plans and indexing optimizations.",
  },
  {
    id: "dsa-algorithms",
    name: "Data Structures & Algorithmic Problem Solving",
    category: "Architecture",
    classification: "Stable",
    evidenceLabel: "Stable",
    currentPostings: 46200,
    yoyGrowthPct: 9.5,
    velocityRank: 10,
    evidenceSummary: "Universal campus recruitment screening gate across enterprise IT, product engineering, and quantitative trading.",
    evidencePoints: [
      "Present in 94% of online assessment test screening benchmarks.",
      "Maintains stable requisition volume with low displacement risk.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 50 },
      { sector: "BFSI & FinTech", pct: 30 },
      { sector: "Core Engineering", pct: 20 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 41000, index: 88 },
      { quarter: "Q2 2025", postings: 41800, index: 90 },
      { quarter: "Q3 2025", postings: 42200, index: 91 },
      { quarter: "Q4 2025", postings: 43500, index: 94 },
      { quarter: "Q1 2026", postings: 44200, index: 95 },
      { quarter: "Q2 2026", postings: 45300, index: 98 },
      { quarter: "Q3 2026", postings: 46200, index: 100 },
    ],
    curriculumAdvice: "Maintain strong algorithmic fundamentals while pairing with real-world system I/O constraints.",
  },
  {
    id: "linux-systems",
    name: "Linux Systems & CLI Environment",
    category: "Architecture",
    classification: "Stable",
    evidenceLabel: "Stable",
    currentPostings: 28400,
    yoyGrowthPct: 11.0,
    velocityRank: 11,
    evidenceSummary: "Core operational foundation across cloud servers, continuous integration runners, and production debugging.",
    evidencePoints: [
      "Essential requirement across both development and infrastructure engineering roles.",
      "Stable year-over-year requisition volume with zero downward inflection.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 52 },
      { sector: "BFSI & FinTech", pct: 28 },
      { sector: "Core Engineering", pct: 20 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 24500, index: 86 },
      { quarter: "Q2 2025", postings: 25100, index: 88 },
      { quarter: "Q3 2025", postings: 25600, index: 90 },
      { quarter: "Q4 2025", postings: 26400, index: 92 },
      { quarter: "Q1 2026", postings: 27100, index: 95 },
      { quarter: "Q2 2026", postings: 27800, index: 97 },
      { quarter: "Q3 2026", postings: 28400, index: 100 },
    ],
    curriculumAdvice: "Ensure all computer labs utilize native Linux shells rather than GUI-only development environments.",
  },

  // 4. Declining / Low Observed Demand
  {
    id: "angularjs-1x",
    name: "AngularJS (1.x Legacy)",
    category: "Framework",
    classification: "Declining / Low observed demand",
    evidenceLabel: "Declining observed demand",
    currentPostings: 1450,
    yoyGrowthPct: -68.4,
    velocityRank: 12,
    evidenceSummary: "Substantial contraction in active hiring requisitions following end-of-life status. Listings are predominantly legacy maintenance roles.",
    evidencePoints: [
      "Requisition volume fell from 4,600 in Q1 2025 to 1,450 in Q3 2026 (-68.4% YoY).",
      "No major new enterprise projects initiated on AngularJS 1.x in monitored sector datasets.",
      "Enterprises actively funding complete migrations to React/Next.js or modern Angular v18+.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 65 },
      { sector: "BFSI & FinTech", pct: 35 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 4600, index: 100 },
      { quarter: "Q2 2025", postings: 3800, index: 82 },
      { quarter: "Q3 2025", postings: 3200, index: 69 },
      { quarter: "Q4 2025", postings: 2600, index: 56 },
      { quarter: "Q1 2026", postings: 2100, index: 45 },
      { quarter: "Q2 2026", postings: 1750, index: 38 },
      { quarter: "Q3 2026", postings: 1450, index: 31 },
    ],
    replacementOrComplement: "Migrate to React 19, Next.js, or Modern Angular (v18+)",
    curriculumAdvice: "Curriculum review recommended: Remove AngularJS 1.x from legacy web coursework; re-allocate lecture hours to modern component models.",
  },
  {
    id: "legacy-jquery",
    name: "Legacy jQuery Direct DOM Scripting",
    category: "Framework",
    classification: "Declining / Low observed demand",
    evidenceLabel: "Low observed demand",
    currentPostings: 2890,
    yoyGrowthPct: -54.2,
    velocityRank: 13,
    evidenceSummary: "Diminishing hiring presence in modern product teams. Modern browser standards (ES2024+, Fetch API) have largely superseded the library.",
    evidencePoints: [
      "Only 2,890 active postings specify jQuery, primarily in legacy content management system maintenance.",
      "54.2% reduction in observed demand over the last 12 months.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 55 },
      { sector: "E-Commerce & Retail Tech", pct: 45 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 6300, index: 100 },
      { quarter: "Q2 2025", postings: 5400, index: 85 },
      { quarter: "Q3 2025", postings: 4700, index: 74 },
      { quarter: "Q4 2025", postings: 4100, index: 65 },
      { quarter: "Q1 2026", postings: 3600, index: 57 },
      { quarter: "Q2 2026", postings: 3200, index: 50 },
      { quarter: "Q3 2026", postings: 2890, index: 45 },
    ],
    replacementOrComplement: "Modern Vanilla JavaScript (ES2024+) & TypeScript",
    curriculumAdvice: "Curriculum review recommended: Teach native DOM Web APIs and declarative React states instead of jQuery selectors.",
  },
  {
    id: "soap-xml-services",
    name: "SOAP & XML-RPC Web Services",
    category: "Architecture",
    classification: "Declining / Low observed demand",
    evidenceLabel: "Low observed demand",
    currentPostings: 2150,
    yoyGrowthPct: -48.0,
    velocityRank: 14,
    evidenceSummary: "Observed listings restricted to legacy banking core integrations; modern greenfield architectures overwhelmingly prefer REST and gRPC.",
    evidencePoints: [
      "Demand contracted 48% YoY as legacy banking platforms wrap SOAP endpoints in modern microservice proxies.",
      "High payload verbosity and lack of typed streaming limit modern adoption.",
    ],
    hiringSectors: [
      { sector: "BFSI & FinTech", pct: 75 },
      { sector: "Information Technology & Cloud", pct: 25 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 4150, index: 100 },
      { quarter: "Q2 2025", postings: 3650, index: 87 },
      { quarter: "Q3 2025", postings: 3200, index: 77 },
      { quarter: "Q4 2025", postings: 2900, index: 69 },
      { quarter: "Q1 2026", postings: 2600, index: 62 },
      { quarter: "Q2 2026", postings: 2350, index: 56 },
      { quarter: "Q3 2026", postings: 2150, index: 51 },
    ],
    replacementOrComplement: "gRPC (Protobuf) & RESTful OpenAPI specifications",
    curriculumAdvice: "Curriculum review recommended: Teach Protocol Buffers, gRPC, and REST instead of WSDL/SOAP in networking and distributed systems.",
  },
  {
    id: "manual-regression-qa",
    name: "Manual Regression Testing",
    category: "Testing",
    classification: "Declining / Low observed demand",
    evidenceLabel: "Curriculum review recommended",
    currentPostings: 3120,
    yoyGrowthPct: -44.5,
    velocityRank: 15,
    evidenceSummary: "Recruitment requisitions increasingly mandate automated test frameworks (Playwright, Cypress, PyTest) integrated directly into CI/CD pipelines.",
    evidencePoints: [
      "Pure manual test execution roles have contracted by 44.5% across monitored hiring exchanges.",
      "Firms requiring SDETs (Software Development Engineers in Test) with coding proficiency rather than checklist testers.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 60 },
      { sector: "BFSI & FinTech", pct: 25 },
      { sector: "E-Commerce & Retail Tech", pct: 15 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 5600, index: 100 },
      { quarter: "Q2 2025", postings: 4900, index: 87 },
      { quarter: "Q3 2025", postings: 4400, index: 78 },
      { quarter: "Q4 2025", postings: 4000, index: 71 },
      { quarter: "Q1 2026", postings: 3650, index: 65 },
      { quarter: "Q2 2026", postings: 3350, index: 59 },
      { quarter: "Q3 2026", postings: 3120, index: 55 },
    ],
    replacementOrComplement: "Playwright / Cypress / PyTest Test Automation",
    curriculumAdvice: "Curriculum review recommended: Shift Software Engineering testing labs from writing manual test-cases to authoring automated unit and E2E suites.",
  },
  {
    id: "monolithic-svn-cvs",
    name: "Monolithic SVN / CVS Version Control",
    category: "Architecture",
    classification: "Declining / Low observed demand",
    evidenceLabel: "Low observed demand",
    currentPostings: 980,
    yoyGrowthPct: -58.1,
    velocityRank: 16,
    evidenceSummary: "Near-total industry convergence on distributed Git-based workflows and cloud pull-request code reviews.",
    evidencePoints: [
      "Fewer than 1,000 active postings mention SVN or CVS across national employment databases.",
      "58.1% year-over-year decline in observed demand.",
    ],
    hiringSectors: [
      { sector: "Information Technology & Cloud", pct: 60 },
      { sector: "Core Engineering", pct: 40 },
    ],
    trendTimeline: [
      { quarter: "Q1 2025", postings: 2350, index: 100 },
      { quarter: "Q2 2025", postings: 1950, index: 82 },
      { quarter: "Q3 2025", postings: 1650, index: 70 },
      { quarter: "Q4 2025", postings: 1400, index: 59 },
      { quarter: "Q1 2026", postings: 1200, index: 51 },
      { quarter: "Q2 2026", postings: 1080, index: 45 },
      { quarter: "Q3 2026", postings: 980, index: 41 },
    ],
    replacementOrComplement: "Git & Trunk-Based CI/CD Development",
    curriculumAdvice: "Ensure all freshmen students are onboarded to Git and GitHub/GitLab repositories on Day 1.",
  },
];

