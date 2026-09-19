export type RoadmapStage = {
  key: string;
  title: string;
  description: string;
  milestones: string[];
};

/** Fixed, opinionated placement roadmap. Milestones are checklists the student owns. */
export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    key: "foundation",
    title: "Foundations",
    description: "Pick one language and get comfortable writing code daily.",
    milestones: [
      "Choose a primary language (C++, Java or Python)",
      "Arrays, strings and time complexity basics",
      "Solve 50 easy problems",
      "Set up GitHub and push code regularly",
    ],
  },
  {
    key: "dsa",
    title: "DSA depth",
    description: "The core filter in most placement processes.",
    milestones: [
      "Linked lists, stacks and queues",
      "Trees, BST and heaps",
      "Graphs and shortest paths",
      "Dynamic programming patterns",
      "Solve 150 medium problems",
      "Two timed contests every month",
    ],
  },
  {
    key: "cs_core",
    title: "CS core subjects",
    description: "Interviewers test these alongside DSA, and they overlap with your semester syllabus.",
    milestones: [
      "DBMS: normalisation, indexing, transactions",
      "Operating systems: processes, scheduling, memory",
      "Computer networks: OSI, TCP/IP, HTTP",
      "OOP design and SOLID basics",
    ],
  },
  {
    key: "projects",
    title: "Projects that prove skill",
    description: "Two well-built projects beat ten tutorials.",
    milestones: [
      "Ship one full-stack project with auth and a database",
      "Deploy it on a public URL",
      "Write a clear README with screenshots",
      "Second project in your target domain",
    ],
  },
  {
    key: "profiles",
    title: "Resume and profiles",
    description: "Make your work easy to evaluate in 30 seconds.",
    milestones: [
      "One-page ATS-friendly resume",
      "LinkedIn headline, About and projects filled",
      "GitHub pinned repositories cleaned up",
      "Coding profile links added to your profile",
    ],
  },
  {
    key: "interview",
    title: "Apply and interview",
    description: "Convert preparation into offers.",
    milestones: [
      "Shortlist 20 target companies",
      "Track every application in the tracker",
      "Five mock interviews",
      "Prepare HR and behavioural answers",
      "Revise past interview questions of target companies",
    ],
  },
];

export function stageProgress(completed: string[] | null | undefined, stage: RoadmapStage) {
  const done = (completed ?? []).filter((m) => stage.milestones.includes(m)).length;
  return Math.round((done / stage.milestones.length) * 100);
}

export const OPPORTUNITY_CATEGORIES = [
  "Jobs",
  "Internships",
  "Hackathons",
  "Competitions",
  "Exams",
  "Scholarships",
] as const;

export type OpportunityCategory = (typeof OPPORTUNITY_CATEGORIES)[number];
