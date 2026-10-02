import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Check,
  Clock,
  Compass,
  Headphones,
  Layers,
  ListChecks,
  Network,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/echo/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setEcho, useEcho } from "@/lib/echo/store";
import { demoProfile, sampleChapters } from "@/lib/echo/samples";
import { cn } from "@/lib/utils";
import type { AILevel } from "@/lib/echo/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Personalise your Learning Path — EduAdapt" },
      {
        name: "description",
        content:
          "Configure your AI baseline, learning goals, preferred multimodal formats, and session length for a personalized AI learning journey.",
      },
      { property: "og:title", content: "Personalise your Learning Path — EduAdapt" },
      {
        property: "og:description",
        content:
          "Set your AI level, learning goal, formats, and pace in 60 seconds with EduAdapt.",
      },
    ],
  }),
  component: Onboarding,
});

const AI_LEVELS: {
  id: AILevel;
  title: string;
  badge: string;
  desc: string;
  icon: typeof Sparkles;
}[] = [
  {
    id: "Beginner",
    title: "Beginner",
    badge: "Intuitive Foundations",
    desc: "Starting fresh with fundamentals. Clear analogies, visual mental models, and gentle cognitive scaffolding.",
    icon: Compass,
  },
  {
    id: "Intermediate",
    title: "Intermediate",
    badge: "Applied Depth",
    desc: "Solid foundational grasp. Ready for architectural mechanisms, practical concepts, and structured problem solving.",
    icon: Zap,
  },
  {
    id: "Advanced",
    title: "Advanced",
    badge: "Technical Rigor",
    desc: "Experienced learner. Deep technical trade-offs, edge-case evaluations, mathematical precision, and rapid synthesis.",
    icon: Brain,
  },
];

const CURATED_GOALS = [
  "Master AI & Machine Learning Foundations",
  "Accelerate Career Transition & Tech Upskilling",
  "Deepen Complex Technical Problem Solving",
  "Academic Exam & Concept Mastery",
  "Build Practical End-to-End AI Projects",
];

const FORMAT_OPTIONS = [
  {
    id: "Simplified text & concept chunks",
    label: "Simplified Text & Chunks",
    sub: "Bite-sized digestible paragraphs with key term callouts",
    icon: Layers,
  },
  {
    id: "Interactive mind maps",
    label: "Interactive Mind Maps",
    sub: "Visual relationship graphs showing how concepts connect",
    icon: Network,
  },
  {
    id: "Audio synthesized narration",
    label: "Audio Narration & Listening",
    sub: "Spoken walk-throughs for auditory comprehension",
    icon: Headphones,
  },
  {
    id: "Step-by-step scaffolding",
    label: "Step-by-Step Scaffolding",
    sub: "Sequenced cognitive checklists and process steps",
    icon: ListChecks,
  },
  {
    id: "Active recall diagnostic quizzes",
    label: "Active Recall Quizzes",
    sub: "Fast check-ins that solidify long-term retention",
    icon: Target,
  },
];

const DURATIONS = [
  { minutes: 15, label: "15 mins", tag: "Micro Sprint" },
  { minutes: 25, label: "25 mins", tag: "Standard Sprint" },
  { minutes: 45, label: "45 mins", tag: "Deep Session" },
  { minutes: 60, label: "60+ mins", tag: "Immersive Dive" },
];

function Onboarding() {
  const navigate = useNavigate();
  const { student, profile, chapters } = useEcho();

  const [name, setName] = useState(student?.name ?? "");
  const [aiLevel, setAiLevel] = useState<AILevel>(student?.aiLevel ?? "Beginner");
  const [selectedGoal, setSelectedGoal] = useState<string>(
    student?.goal ?? "Master AI & Machine Learning Foundations",
  );
  const [customGoal, setCustomGoal] = useState("");
  const [formats, setFormats] = useState<string[]>(
    student?.formats?.length
      ? student.formats
      : ["Simplified text & concept chunks", "Interactive mind maps", "Active recall diagnostic quizzes"],
  );
  const [duration, setDuration] = useState(student?.sessionMinutes ?? 25);

  const toggleFormat = (id: string) => {
    setFormats((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const activeGoal = customGoal.trim() || selectedGoal;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const activeProfile = profile ?? demoProfile;
    const initialChapters =
      chapters.length > 0 ? chapters : sampleChapters(activeProfile);

    setEcho((prev) => ({
      ...prev,
      student: {
        name: name.trim() || "Learner",
        level: aiLevel,
        aiLevel,
        goal: activeGoal,
        formats: formats.length > 0 ? formats : ["Simplified text & concept chunks", "Interactive mind maps"],
        sessionMinutes: duration,
      },
      profile: activeProfile,
      chapters: initialChapters,
      activeChapterId: prev.activeChapterId ?? initialChapters[0]?.id ?? "demo-photosynthesis",
      nextStep: {
        id: "next-start-learning",
        phase: "Learn",
        title: `${aiLevel} Core Module: ${initialChapters[0]?.title ?? "Photosynthesis Core"}`,
        description: `Aligned to your goal: "${activeGoal}". Custom-scaffolded for ${duration}-minute sessions.`,
        duration: `${duration} mins`,
        chapterId: initialChapters[0]?.id ?? "demo-photosynthesis",
        mode: "text",
        actionLabel: "Begin Chapter",
      },
    }));

    navigate({ to: "/dashboard" });
  };

  return (
    <AppShell showFocus={false}>
      <div className="mx-auto max-w-3xl space-y-10 py-4">
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> Personalised AI Calibration
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Shape your personalised learning path
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            EduAdapt adapts reading density, cognitive depth, and active recall drills to your current level and targets.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-10">
          {/* Learner Name */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <Label htmlFor="name" className="text-base font-semibold text-foreground">
              What should we call you?
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Your name helps EduAdapt AI personalize prompts, summaries, and check-ins.
            </p>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex, Maya, or Siddharth"
              className="mt-3 h-12 max-w-md rounded-2xl border-input text-base"
              required
            />
          </div>

          {/* Question 1: Current AI Level */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-base font-semibold text-foreground">
                1. Current AI Level
              </Label>
              <span className="text-xs font-medium text-primary">Calibrates cognitive depth</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose the baseline that best describes your current fluency. You can shift this anytime.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {AI_LEVELS.map((lvl) => {
                const Icon = lvl.icon;
                const isSelected = aiLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setAiLevel(lvl.id)}
                    className={cn(
                      "group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                        : "border-border bg-background/60 hover:border-primary/40 hover:bg-muted/50",
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "grid size-9 place-items-center rounded-xl transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:text-primary",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        {isSelected && (
                          <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-semibold text-foreground">{lvl.title}</h3>
                      <span className="inline-block mt-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {lvl.badge}
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {lvl.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: Learning Goal */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <Label className="text-base font-semibold text-foreground">
              2. What is your primary learning goal?
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Select one of our high-impact tracks or enter your bespoke objective.
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {CURATED_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal && !customGoal.trim();
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setCustomGoal("");
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                        : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="size-4 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border/60">
              <Label htmlFor="customGoal" className="text-xs font-medium text-muted-foreground">
                Or write your custom learning goal:
              </Label>
              <Input
                id="customGoal"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. Master Transformers and Multi-Agent Cognitive Architectures"
                className="mt-1.5 h-11 rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Question 3: Preferred Learning Formats */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-base font-semibold text-foreground">
                3. Preferred Learning Formats
              </Label>
              <span className="text-xs text-muted-foreground">Select all that apply</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              EduAdapt dynamically generates your materials into each enabled modality.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {FORMAT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isChecked = formats.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleFormat(opt.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                      isChecked
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border bg-background/60 hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl",
                        isChecked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                        {isChecked && <Check className="size-3.5 text-primary" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{opt.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 4: Session Duration */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-base font-semibold text-foreground">
                4. Typical Session Duration
              </Label>
              <span className="text-xs text-muted-foreground">Calibrates chunking density</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              How much time do you usually have per study session?
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DURATIONS.map((dur) => {
                const isSelected = duration === dur.minutes;
                return (
                  <button
                    key={dur.minutes}
                    type="button"
                    onClick={() => setDuration(dur.minutes)}
                    className={cn(
                      "flex flex-col items-center rounded-2xl border p-4 text-center transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                        : "border-border bg-background/60 hover:border-primary/40",
                    )}
                  >
                    <Clock
                      className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")}
                    />
                    <span className="mt-2 text-base font-bold text-foreground">{dur.label}</span>
                    <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                      {dur.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learner-Control Messaging */}
          <div className="flex items-start gap-4 rounded-3xl border border-primary/25 bg-gradient-to-r from-primary/10 via-accent/15 to-transparent p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/20 text-primary">
              <Sparkles className="size-5" />
            </span>
            <div className="text-sm">
              <p className="font-semibold text-foreground">Learner Autonomy Guarantee</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                You are always in the driver's seat. EduAdapt AI acts as your co-pilot, adapting to your preferences without rigid black boxes. You can adjust your pace, formats, and AI level at any moment.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Ready to begin: Your preferences will be saved locally.
            </p>
            <Button type="submit" size="lg" className="w-full font-semibold sm:w-auto px-8">
              Launch Personalised Dashboard <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
