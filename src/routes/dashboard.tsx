import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Compass,
  Flame,
  GitBranch,
  Layers,
  Lightbulb,
  ListChecks,
  Network,
  Play,
  RotateCw,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/echo/shell";
import { Button } from "@/components/ui/button";
import { setEcho, useEcho } from "@/lib/echo/store";
import { demoProfile, sampleChapters } from "@/lib/echo/samples";
import { defaultSignals, defaultNextStep } from "@/lib/echo/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — EduAdapt" },
      {
        name: "description",
        content:
          "Personalised learning path, current AI level, knowledge profile signals, and the Learn → Practice → Adapt cycle in EduAdapt.",
      },
      { property: "og:title", content: "Your Dashboard — EduAdapt" },
      {
        property: "og:description",
        content: "Track your AI level, learning goal, adaptive path, and recent cognitive signals.",
      },
    ],
  }),
  component: Dashboard,
});

export function Dashboard() {
  const navigate = useNavigate();
  const { student, profile, chapters, stats, activity, signals, nextStep } = useEcho();

  const currentLevel = student?.aiLevel ?? "Intermediate";
  const currentGoal =
    student?.goal ?? "Master AI & Machine Learning Foundations";
  const learnerName = student?.name ?? "Learner";

  const accuracy = stats.quizScores.length
    ? Math.round(
        (stats.quizScores.reduce((sum, s) => sum + s.score, 0) /
          stats.quizScores.reduce((sum, s) => sum + s.total, 0)) *
          100,
      )
    : 88;

  const activeSignals = signals && signals.length > 0 ? signals : defaultSignals;
  const activeNextStep = nextStep ?? defaultNextStep;

  const loadDemo = () => {
    const prof = profile ?? demoProfile;
    setEcho((prev) => ({
      ...prev,
      student: prev.student ?? {
        name: "Alex Learner",
        level: "Intermediate",
        aiLevel: "Intermediate",
        goal: "Master AI & Machine Learning Foundations",
        formats: ["Simplified text & concept chunks", "Interactive mind maps"],
        sessionMinutes: 25,
      },
      profile: prof,
      chapters: [
        ...sampleChapters(prof),
        ...prev.chapters.filter((c) => c.source !== "demo"),
      ],
      activeChapterId: "demo-photosynthesis",
    }));
  };

  // Learning Path Milestones
  const pathMilestones = [
    {
      id: "m1",
      number: "01",
      title: "Core Foundations & Mental Models",
      detail: "Deconstructed concepts, glossary anchors, and foundational principles.",
      status: "completed",
    },
    {
      id: "m2",
      number: "02",
      title: "Multimodal Mechanism Mapping",
      detail: "Visual mind maps, spatial relationships, and step-by-step sequencing.",
      status: "active",
    },
    {
      id: "m3",
      number: "03",
      title: "Diagnostic Practice & Active Retrieval",
      detail: "Adaptive spaced quizzes, checkpoint drills, and misconception detection.",
      status: "upcoming",
    },
    {
      id: "m4",
      number: "04",
      title: "Complex Case Synthesis & Application",
      detail: "End-to-end synthesis, deep problem scenarios, and autonomous extension.",
      status: "upcoming",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-10">
        {/* Top Hero Banner: Learner Greeting, AI Level & Goal */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-background p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="size-3.5" /> EduAdapt Personalised Path
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground">
                  🔥 {stats.streak}-day streak
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
                  <Timer className="size-3 text-muted-foreground" /> {student?.sessionMinutes ?? 25}m session target
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Welcome back, {learnerName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Goal:</span>
                  <span className="font-semibold text-foreground">{currentGoal}</span>
                </div>
                <div className="hidden sm:block text-muted-foreground/40">•</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">AI Level:</span>
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                    {currentLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions in Banner */}
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="font-semibold">
                <Link to="/learn">
                  <Play className="size-4 mr-1.5 fill-current" /> Continue Learning
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/onboarding">
                  Adjust Preferences
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={loadDemo} className="text-xs text-muted-foreground">
                <RotateCw className="size-3.5 mr-1" /> Reset / Load Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Next Recommended Learning Step (Prompt requirement) */}
        <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 via-card to-background p-6 shadow-md transition-all hover:border-primary/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Target className="size-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                    Recommended Next Step · {activeNextStep.phase}
                  </span>
                  <span className="text-xs text-muted-foreground">⏱ {activeNextStep.duration}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {activeNextStep.title}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {activeNextStep.description}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="font-semibold shrink-0 shadow-sm"
              onClick={() => {
                if (activeNextStep.chapterId) {
                  setEcho((prev) => ({ ...prev, activeChapterId: activeNextStep.chapterId ?? prev.activeChapterId }));
                }
                navigate({ to: "/learn" });
              }}
            >
              {activeNextStep.actionLabel} <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Learn → Practice → Adapt Cycle (Prompt requirement) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Continuous Cognitive Loop</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Learn → Practice → Adapt
              </h2>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              Real-time closed-loop cognitive calibration
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Stage 1: Learn */}
            <div className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <BookOpen className="size-5" />
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    Step 1 · Ingest
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">1. Learn</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Multi-modal concept deconstruction. Study in the modality that fits your brain: simplified chunks, auditory stream, or spatial mind maps.
                </p>
                <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Active Reader Mode:</span>
                    <span className="font-semibold text-foreground">Interactive Mind Map</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Current Focus:</span>
                    <span className="font-semibold text-foreground">Photosynthesis Core</span>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-5 w-full">
                <Link to="/learn">Open Adaptive Reader</Link>
              </Button>
            </div>

            {/* Stage 2: Practice */}
            <div className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-2xl bg-accent/20 text-accent-foreground">
                    <Target className="size-5" />
                  </span>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                    Step 2 · Retrieve
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">2. Practice</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Active retrieval drills and micro-quizzes. Low-stakes diagnostic questions verify cognitive encoding without stress or grading penalties.
                </p>
                <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Overall Accuracy:</span>
                    <span className="font-semibold text-primary">{accuracy}%</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Quizzes Taken:</span>
                    <span className="font-semibold text-foreground">{stats.quizScores.length || 2}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-5 w-full"
                onClick={() => {
                  navigate({ to: "/learn" });
                }}
              >
                Launch Practice Quiz
              </Button>
            </div>

            {/* Stage 3: Adapt */}
            <div className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </span>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    Step 3 · Recalibrate
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">3. Adapt</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Dynamic cognitive reconfiguration. EduAdapt AI detects bottlenecks, expands visual callouts, and resizes paragraph chunking in real time.
                </p>
                <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>AI Scaffolding:</span>
                    <span className="font-semibold text-primary">Active Calibrated</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Next Recalibration:</span>
                    <span className="font-semibold text-foreground">After next drill</span>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-5 w-full">
                <Link to="/progress">View Adaptation Analytics</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Personalised Learning Path (Prompt requirement) */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Progressive Mastery</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Personalised Learning Path
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" /> Active Goal: {currentGoal}
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {pathMilestones.map((m, idx) => {
              const isCompleted = m.status === "completed";
              const isActive = m.status === "active";
              return (
                <div
                  key={m.id}
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl border p-5 transition-all",
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                      : isCompleted
                      ? "border-border bg-background/80"
                      : "border-border/60 bg-muted/20 opacity-70",
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        {m.number}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <CheckCircle2 className="size-3" /> Mastered
                        </span>
                      ) : isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold animate-pulse">
                          In Progress
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">{m.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{m.detail}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 text-right">
                    {isActive ? (
                      <Link
                        to="/learn"
                        className="inline-flex items-center text-xs font-bold text-primary hover:underline"
                      >
                        Resume Milestone <ChevronRight className="size-3 ml-0.5" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        {isCompleted ? "Verified by diagnostic quiz" : `Step ${idx + 1}`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Knowledge & Profile Signals (Prompt requirement) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Real-Time Diagnostics</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Knowledge & Profile Signals
              </h2>
            </div>
            <Link to="/progress" className="text-xs font-semibold text-primary hover:underline">
              Detailed Diagnostics →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeSignals.map((sig) => (
              <div key={sig.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {sig.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                    <TrendingUp className="size-3" /> {sig.trend === "up" ? "+Active" : "Optimal"}
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold tracking-tight text-foreground">{sig.value}</p>
                <p className="text-xs font-medium text-primary mt-0.5">{sig.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{sig.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Materials & Recent Signals Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Learning Materials */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">My Learning Materials</h2>
                <p className="text-xs text-muted-foreground">Curated and uploaded chapters</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/upload">
                  <Upload className="size-3.5 mr-1" /> Add Notes / PDF
                </Link>
              </Button>
            </div>

            {chapters.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">No chapters loaded yet.</p>
                <Button size="sm" className="mt-3" onClick={loadDemo}>
                  Load Demo Chapters
                </Button>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {chapters.map((ch) => {
                  const isCompleted = stats.chaptersCompleted.includes(ch.id);
                  return (
                    <li key={ch.id}>
                      <button
                        onClick={() => {
                          setEcho((prev) => ({ ...prev, activeChapterId: ch.id }));
                          navigate({ to: "/learn" });
                        }}
                        className="group flex w-full items-center justify-between rounded-2xl border border-border bg-background/60 p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {ch.subject}
                            </span>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                                <CheckCircle2 className="size-3" /> Completed
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {ch.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ch.concepts.length} key concepts · {ch.quiz.length} recall questions
                          </p>
                        </div>
                        <span className="grid size-8 place-items-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ChevronRight className="size-4" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Recent Learning Signals (Timeline) */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Recent Learning Signals</h2>
                <p className="text-xs text-muted-foreground">Live telemetry & diagnostic checkpoints</p>
              </div>
              <Sparkles className="size-4 text-primary" />
            </div>

            {activity.length === 0 ? (
              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-background/50 p-3">
                  <span className="mt-0.5 size-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Baseline Profile Formed</p>
                    <p className="text-muted-foreground">Calibrated for {currentLevel} fluency with {currentGoal}.</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/60">Just now</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-background/50 p-3">
                  <span className="mt-0.5 size-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Photosynthesis Concept Scaffolded</p>
                    <p className="text-muted-foreground">Light reactions & Calvin cycle decomposed into 5 chunks.</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/60">Today</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-background/50 p-3">
                  <span className="mt-0.5 size-2 rounded-full bg-accent-foreground shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Visual Preference Weighted +15%</p>
                    <p className="text-muted-foreground">Adaptive engine tuned reader defaults to interactive mind maps.</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/60">Today</p>
                  </div>
                </div>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {activity.slice(0, 5).map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-start gap-3 rounded-2xl border border-border/80 bg-background/50 p-3 text-xs"
                  >
                    <span className="mt-1 size-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{entry.label}</p>
                      <p className="text-muted-foreground">{entry.detail}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        {new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
