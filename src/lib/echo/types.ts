export type SupportLevel = "Low" | "Medium" | "High";

export type LearningProfile = {
  reading: SupportLevel;
  focus: SupportLevel;
  sequencing: SupportLevel;
  visual: SupportLevel;
  chunking: SupportLevel;
  summary: string;
  adaptations: string[];
  createdAt: string;
};

export type AILevel = "Beginner" | "Intermediate" | "Advanced";

export type StudentInfo = {
  name: string;
  level: string;
  aiLevel?: AILevel;
  goal?: string;
  formats: string[];
  sessionMinutes: number;
};

export type KnowledgeSignal = {
  id: string;
  label: string;
  category: "Mastery" | "Pacing" | "Cognitive" | "Format";
  value: string;
  trend?: "up" | "stable" | "calibrated";
  detail: string;
};

export type AdaptiveStep = {
  id: string;
  phase: "Learn" | "Practice" | "Adapt";
  title: string;
  description: string;
  duration: string;
  chapterId?: string;
  mode?: "text" | "audio" | "mindmap" | "quiz";
  actionLabel: string;
};

export type QuizQuestion = {
  id: string;
  kind: "multiple" | "truefalse" | "fill";
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  concept?: string;
};

export type Concept = {
  id: string;
  title: string;
  summary?: string;
  chunks: string[];
  steps: string[];
  keyTerms: string[];
  callout: string;
  checkpoint: string;
};

export type MindMapNode = {
  id: string;
  label: string;
  parent: string | null;
  kind: "root" | "branch" | "leaf";
  detail?: string;
};

export type AdaptedChapter = {
  id: string;
  title: string;
  subject: string;
  source: "demo" | "upload";
  rawText: string;
  summary?: string;
  keyPoints?: string[];
  concepts: Concept[];
  mindMap: MindMapNode[];
  quiz: QuizQuestion[];
  adaptationsApplied: string[];
  engine: "ai" | "fallback";
  createdAt: string;
};

export type ActivityEntry = {
  id: string;
  label: string;
  detail: string;
  at: string;
};

export type ReaderPrefs = {
  fontSize: "small" | "medium" | "large";
  lineSpacing: "normal" | "relaxed";
  density: "compact" | "comfortable" | "focused";
  dyslexiaFont: boolean;
  theme: "light" | "dark";
};

export type Reminder = { id: string; label: string; time: string; days: number[]; enabled: boolean; lastFired?: string };

export type EchoState = {
  reminders?: Reminder[];
  student: StudentInfo | null;
  profile: LearningProfile | null;
  chapters: AdaptedChapter[];
  activeChapterId: string | null;
  signals?: KnowledgeSignal[];
  nextStep?: AdaptiveStep;
  prefs: ReaderPrefs;
  activity: ActivityEntry[];
  stats: {
    chaptersCompleted: string[];
    streak: number;
    lastActiveDay?: string;
    focusSessions: number;
    quizScores: { chapter: string; score: number; total: number; at: string }[];
    formatUsage: Record<"text" | "audio" | "mindmap" | "quiz", number>;
  };
};

export const defaultPrefs: ReaderPrefs = {
  fontSize: "medium",
  lineSpacing: "relaxed",
  density: "comfortable",
  dyslexiaFont: false,
  theme: "dark",
};

export const defaultSignals: KnowledgeSignal[] = [
  {
    id: "sig-1",
    label: "Cognitive Scaffolding",
    category: "Cognitive",
    value: "Calibrated",
    trend: "up",
    detail: "Dynamic chunking active: 3-5 concept nodes per session for optimal working memory load.",
  },
  {
    id: "sig-2",
    label: "Visual Knowledge Synthesis",
    category: "Format",
    value: "High Affinity",
    trend: "up",
    detail: "Mind map navigation selected 64% of sessions; spatial concept mapping prioritized.",
  },
  {
    id: "sig-3",
    label: "Retrieval Accuracy",
    category: "Mastery",
    value: "88% Precision",
    trend: "up",
    detail: "High retention across Photosynthesis fundamentals and cognitive check-ins.",
  },
  {
    id: "sig-4",
    label: "Comprehension Pacing",
    category: "Pacing",
    value: "20 min Sprints",
    trend: "calibrated",
    detail: "Optimal session duration matched to peak focus endurance with gentle pulse intervals.",
  },
];

export const defaultNextStep: AdaptiveStep = {
  id: "step-photosynthesis-practice",
  phase: "Practice",
  title: "Photosynthesis: Light-Dependent Reactions Drill",
  description: "Test active recall on ATP generation, photolysis, and thylakoid membrane electron transport.",
  duration: "8 mins",
  chapterId: "demo-photosynthesis",
  mode: "quiz",
  actionLabel: "Launch Practice Drill",
};

export const defaultState: EchoState = {
  student: null,
  profile: null,
  chapters: [],
  activeChapterId: null,
  signals: defaultSignals,
  nextStep: defaultNextStep,
  prefs: defaultPrefs,
  activity: [],
  stats: {
    chaptersCompleted: [],
    streak: 1,
    focusSessions: 0,
    quizScores: [],
    formatUsage: { text: 0, audio: 0, mindmap: 0, quiz: 0 },
  },
};
