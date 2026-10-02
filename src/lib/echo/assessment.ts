import type { LearningProfile, SupportLevel } from "./types";

export type Dimension = "reading" | "focus" | "sequencing" | "visual" | "chunking";

export type AssessmentQuestion = {
  id: string;
  emoji: string;
  prompt: string;
  helper: string;
  options: { label: string; scores: Partial<Record<Dimension, number>> }[];
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    emoji: "📚",
    prompt: "When you open a page full of dense text, what usually happens?",
    helper: "There is no wrong answer — we are learning your preferences.",
    options: [
      { label: "I read it comfortably", scores: { reading: 0 } },
      { label: "The lines feel crowded", scores: { reading: 2, visual: 1 } },
      { label: "I lose my place often", scores: { reading: 2, focus: 1 } },
      { label: "I skim and hope for the best", scores: { reading: 1, chunking: 1 } },
    ],
  },
  {
    id: "q2",
    emoji: "⏱️",
    prompt: "How long can you study before your attention drifts?",
    helper: "Think about a normal study evening.",
    options: [
      { label: "40+ minutes", scores: { focus: 0 } },
      { label: "About 25 minutes", scores: { focus: 1 } },
      { label: "About 10 minutes", scores: { focus: 2, chunking: 1 } },
      { label: "Just a few minutes", scores: { focus: 3, chunking: 2 } },
    ],
  },
  {
    id: "q3",
    emoji: "🔤",
    prompt: "How do you feel about long, technical words?",
    helper: "Vocabulary load affects how we simplify wording.",
    options: [
      { label: "I enjoy them", scores: { reading: 0 } },
      { label: "Fine with a definition nearby", scores: { reading: 1 } },
      { label: "They slow me down a lot", scores: { reading: 2 } },
      { label: "I often re-read them several times", scores: { reading: 3 } },
    ],
  },
  {
    id: "q4",
    emoji: "🧩",
    prompt: "A process has 7 stages. What helps you most?",
    helper: "This tells us how much sequencing scaffolding to add.",
    options: [
      { label: "A flowing paragraph", scores: { sequencing: 0 } },
      { label: "A short summary first", scores: { sequencing: 1, chunking: 1 } },
      { label: "Clearly numbered steps", scores: { sequencing: 3 } },
      { label: "A diagram of the order", scores: { sequencing: 2, visual: 2 } },
    ],
  },
  {
    id: "q5",
    emoji: "🎧",
    prompt: "If you could hear your chapter read aloud, would you use it?",
    helper: "Audio is one of four learning modes in EchoLearn.",
    options: [
      { label: "Rarely, I prefer reading", scores: { reading: 0 } },
      { label: "Sometimes for revision", scores: { reading: 1 } },
      { label: "Yes, most of the time", scores: { reading: 2 } },
      { label: "Always — listening is easiest", scores: { reading: 3, visual: 1 } },
    ],
  },
  {
    id: "q6",
    emoji: "🖼️",
    prompt: "Which explanation sticks with you longest?",
    helper: "Guides how much visual structure we build.",
    options: [
      { label: "A written explanation", scores: { visual: 0 } },
      { label: "A spoken explanation", scores: { visual: 1 } },
      { label: "A labelled diagram", scores: { visual: 3 } },
      { label: "A mind map of connections", scores: { visual: 3, sequencing: 1 } },
    ],
  },
  {
    id: "q7",
    emoji: "🔔",
    prompt: "What happens with background noise or notifications?",
    helper: "Helps us tune Focus Pulse reminders.",
    options: [
      { label: "I barely notice", scores: { focus: 0 } },
      { label: "Mildly distracting", scores: { focus: 1 } },
      { label: "I lose my thread quickly", scores: { focus: 2 } },
      { label: "I need total quiet", scores: { focus: 3 } },
    ],
  },
  {
    id: "q8",
    emoji: "✂️",
    prompt: "Would you rather read one long section or six short ones?",
    helper: "Chunk size shapes your reading view.",
    options: [
      { label: "One long section", scores: { chunking: 0 } },
      { label: "Two or three sections", scores: { chunking: 1 } },
      { label: "Six short sections", scores: { chunking: 3 } },
      { label: "As small as possible", scores: { chunking: 3, focus: 1 } },
    ],
  },
  {
    id: "q9",
    emoji: "🗂️",
    prompt: "When revising, what do you make first?",
    helper: "Reveals your natural organising style.",
    options: [
      { label: "Nothing, I just re-read", scores: { sequencing: 0 } },
      { label: "Highlighted key lines", scores: { visual: 1, reading: 1 } },
      { label: "A numbered checklist", scores: { sequencing: 3 } },
      { label: "A branching diagram", scores: { visual: 2, sequencing: 1 } },
    ],
  },
  {
    id: "q10",
    emoji: "🌤️",
    prompt: "After 20 minutes of study, what would help you keep going?",
    helper: "Sets your Focus Pulse rhythm.",
    options: [
      { label: "Nothing, I keep going", scores: { focus: 0 } },
      { label: "A quick stretch", scores: { focus: 1 } },
      { label: "A 60-second breathing reset", scores: { focus: 2 } },
      { label: "A longer break", scores: { focus: 3, chunking: 1 } },
    ],
  },
];

const maxima: Record<Dimension, number> = { reading: 10, focus: 12, sequencing: 8, visual: 9, chunking: 9 };

function level(score: number, max: number): SupportLevel {
  const ratio = score / max;
  if (ratio >= 0.55) return "High";
  if (ratio >= 0.28) return "Medium";
  return "Low";
}

export function buildProfile(answers: Record<string, number>): LearningProfile {
  const totals: Record<Dimension, number> = { reading: 0, focus: 0, sequencing: 0, visual: 0, chunking: 0 };
  for (const q of assessmentQuestions) {
    const picked = answers[q.id];
    if (picked === undefined) continue;
    const opt = q.options[picked];
    if (!opt) continue;
    for (const [dim, value] of Object.entries(opt.scores)) {
      totals[dim as Dimension] += value ?? 0;
    }
  }

  const profile = {
    reading: level(totals.reading, maxima.reading),
    focus: level(totals.focus, maxima.focus),
    sequencing: level(totals.sequencing, maxima.sequencing),
    visual: level(totals.visual, maxima.visual),
    chunking: level(totals.chunking, maxima.chunking),
  };

  const adaptations: string[] = [];
  if (profile.reading !== "Low") adaptations.push("Simpler wording with key terms highlighted");
  if (profile.chunking !== "Low" || profile.focus !== "Low")
    adaptations.push("Shorter content chunks with micro-checkpoints");
  if (profile.sequencing !== "Low") adaptations.push("Numbered step-by-step structure");
  if (profile.visual !== "Low") adaptations.push("Mind map view of how ideas connect");
  if (profile.focus === "High") adaptations.push("Focus Pulse breaks every 15–18 minutes");
  if (adaptations.length === 0) adaptations.push("Balanced layout with optional supports available");

  const summary = `You learn best with ${
    profile.chunking === "Low" ? "steady sections" : "small, digestible pieces"
  }, ${profile.visual === "Low" ? "clear wording" : "visual structure"}${
    profile.sequencing === "Low" ? "" : " and an explicit order of steps"
  }. EchoLearn will present every chapter this way for you.`;

  return { ...profile, summary, adaptations, createdAt: new Date().toISOString() };
}
