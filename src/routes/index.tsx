import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Headphones,
  Layers,
  Lightbulb,
  ListOrdered,
  Network,
  Play,
  RotateCw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EduAdaptLogo } from "@/components/echo/logo";
import { setEcho } from "@/lib/echo/store";
import { demoProfile, sampleChapters } from "@/lib/echo/samples";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduAdapt — Personalised AI Learning for Every Learner" },
      {
        name: "description",
        content:
          "EduAdapt solves the one-size-fits-all education crisis with a real-time diagnostic cognitive loop: Learn, Practice, and Adapt tailored to your level, preferred formats, and pace.",
      },
      { property: "og:title", content: "EduAdapt — Personalised AI Learning for Every Learner" },
      {
        property: "og:description",
        content:
          "PS-03 Positioned · Closed-loop adaptive learning companion with dynamic knowledge graphs, multimodal formats, and learner agency.",
      },
    ],
  }),
  component: Landing,
});

export function Landing() {
  const navigate = useNavigate();

  const startDemo = () => {
    setEcho((prev) => ({
      ...prev,
      student: prev.student ?? {
        name: "Guest Learner",
        level: "Intermediate",
        aiLevel: "Intermediate",
        goal: "Master AI & Machine Learning Foundations",
        formats: ["Simplified text & concept chunks", "Interactive mind maps", "Active recall diagnostic quizzes"],
        sessionMinutes: 25,
      },
      profile: prev.profile ?? demoProfile,
      chapters: [
        ...sampleChapters(prev.profile ?? demoProfile),
        ...prev.chapters.filter((c) => c.source !== "demo"),
      ],
      activeChapterId: "demo-photosynthesis",
    }));
    navigate({ to: "/learn" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <EduAdaptLogo showCaption={false} />
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={startDemo} className="border-primary/40 hover:border-primary">
              <Play className="size-3 mr-1 fill-current text-primary" /> Live Demo
            </Button>
            <Button size="sm" asChild className="font-semibold shadow-sm">
              <Link to="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section: PS-03 Positioning & Caption */}
      <section className="echo-grain relative border-b border-border/60 overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>PS-03 Positioned · Personalised AI Learning for Every Learner</span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Education that adapts to you,{" "}
              <span className="gold-gradient-text">not the other way around.</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              EduAdapt transforms static, rigid learning material into a real-time diagnostic cognitive loop. Calibrated to your AI fluency, preferred modalities, and optimal pace.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="lg" asChild className="font-semibold px-7 shadow-md">
                <Link to="/onboarding">
                  Start Your Adaptive Journey <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={startDemo} className="border-primary/40 hover:border-primary">
                Explore Instant Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> No pre-requisite testing
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> Learner always in control
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> 100% private local storage
              </div>
            </div>
          </div>

          {/* Interactive Hero Showcase Card */}
          <div className="rounded-3xl border border-primary/30 bg-card/90 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-xl bg-primary/20 text-primary">
                  <Brain className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cognitive Architecture</p>
                  <p className="text-sm font-semibold text-foreground">Real-Time Transformation</p>
                </div>
              </div>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                Active Loop
              </span>
            </div>

            <div className="mt-5 space-y-3.5">
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Source Material</span>
                  <span className="text-[10px] text-muted-foreground">Dense text / PDF</span>
                </div>
                <p className="mt-1 font-serif text-sm font-medium text-foreground line-clamp-2">
                  "Photosynthesis converts light energy into chemical energy stored in glucose via thylakoid light-dependent and stroma light-independent Calvin cycle cascades..."
                </p>
              </div>

              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Wand2 className="size-3" /> EduAdapt Cognitive Scaffolding
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5">
                  <div className="flex items-center gap-2 text-primary">
                    <Network className="size-4" />
                    <span className="text-xs font-bold">Mind Map Graph</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Spatial concept nodes mapping light energy to ATP generation.
                  </p>
                </div>
                <div className="rounded-2xl border border-accent/40 bg-accent/15 p-3.5">
                  <div className="flex items-center gap-2 text-accent-foreground">
                    <Target className="size-4" />
                    <span className="text-xs font-bold">Adaptive Drill</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Active recall quiz tailored to your current AI level.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/60 p-3 text-xs">
              <span className="text-muted-foreground">Modes enabled:</span>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <span>Text</span> • <span>Audio</span> • <span>Mind Map</span> • <span>Quiz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section (PS-03 Core Problem Breakdown) */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">The Core Problem</span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why one-size-fits-all education fails modern learners
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Conventional educational tools treat learners as identical consumers of linear text, creating cognitive fatigue and disengagement.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-destructive/40 transition-colors">
            <span className="grid size-11 place-items-center rounded-2xl bg-destructive/15 text-destructive font-bold text-lg">
              01
            </span>
            <h3 className="mt-4 text-xl font-bold text-foreground">Rigid, Monolithic Curricula</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every learner is forced through the same pacing and vocabulary, regardless of whether they need intuitive foundational analogies or accelerated technical depth.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-destructive/40 transition-colors">
            <span className="grid size-11 place-items-center rounded-2xl bg-destructive/15 text-destructive font-bold text-lg">
              02
            </span>
            <h3 className="mt-4 text-xl font-bold text-foreground">Passive Consumption Overload</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Dense walls of static text exceed working memory limits. Without spatial mind maps, chunking, or audio narration, retention decays exponentially.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-destructive/40 transition-colors">
            <span className="grid size-11 place-items-center rounded-2xl bg-destructive/15 text-destructive font-bold text-lg">
              03
            </span>
            <h3 className="mt-4 text-xl font-bold text-foreground">Zero Real-Time Diagnostic Feedback</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Feedback typically occurs weeks later via high-stakes exams. Misconceptions remain undetected during daily study when they could be corrected instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section (EduAdapt's Cognitive Architecture) */}
      <section className="border-y border-border/60 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">The EduAdapt Solution</span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A closed-loop cognitive engine for true personalization
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                EduAdapt bridges the gap between raw information and deep mental representation. By decomposing material into dynamic concept primitives, every chapter adapts to the learner's cognitive profile in real time.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: "Dynamic Concept Decomposition",
                    desc: "Restructures complex textbook pages into structured, bite-sized digestible chunks.",
                  },
                  {
                    title: "Multimodal Knowledge Synthesis",
                    desc: "Offers synchronous access to simplified text, concept graphs, audio narration, and quizzes.",
                  },
                  {
                    title: "Active Retrieval Diagnostics",
                    desc: "Verifies comprehension with low-stakes micro-drills that pinpoint weak points.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-border/80 bg-background/80 p-3.5">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Graphic */}
            <div className="rounded-3xl border border-primary/30 bg-card p-6 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Cognitive Feedback Architecture</p>
              <div className="mt-5 space-y-4">
                {[
                  { step: "01", name: "Semantic Ingestion", detail: "PDF / Textbook OCR / Text input parsed into knowledge primitives" },
                  { step: "02", name: "Cognitive Profile Matching", detail: "Calibrates chunk size, reading density, and AI fluency level" },
                  { step: "03", name: "Multimodal Generation", detail: "Simultaneously compiles text, interactive mind maps, and audio" },
                  { step: "04", name: "Continuous Diagnostic Loop", detail: "Active recall performance recalibrates subsequent chapter scaffolding" },
                ].map((st, i) => (
                  <div key={st.step}>
                    <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                        {st.step}
                      </span>
                      <div>
                        <p className="font-bold text-sm text-foreground">{st.name}</p>
                        <p className="text-xs text-muted-foreground">{st.detail}</p>
                      </div>
                    </div>
                    {i < 3 && <div className="ml-8 h-4 w-px bg-primary/30 my-0.5" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Adaptive Path (Prompt requirement) */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Continuous Growth</span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Adaptive Learning Path
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            From initial baseline calibration to advanced concept synthesis, see how EduAdapt guides your journey.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "Phase 1",
              title: "AI Fluency Calibration",
              body: "Select Beginner, Intermediate, or Advanced baseline to calibrate explanation depth and jargon thresholds.",
              icon: Compass,
            },
            {
              step: "Phase 2",
              title: "Modal Scaffolding",
              body: "Chapter material is rewritten into structured chunks with synchronized audio and interactive concept graphs.",
              icon: Layers,
            },
            {
              step: "Phase 3",
              title: "Active Retrieval",
              body: "Diagnostic recall checkpoints measure retention without grading pressure or time anxiety.",
              icon: Target,
            },
            {
              step: "Phase 4",
              title: "Mastery Calibration",
              body: "System refines future chunk density and unlocks higher-level synthetic problem challenges.",
              icon: TrendingUp,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.step} className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-2xl bg-primary/15 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-mono font-bold text-muted-foreground">{card.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                  Automated Calibration ✓
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Learn → Practice → Adapt Cycle (Prompt requirement) */}
      <section className="border-y border-border/60 bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Core Mechanism</span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Learn → Practice → Adapt
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              The three-phase cognitive loop that turns passive information consumption into enduring mental models.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">1. Learn</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Ingest content in the representation that suits your cognitive strengths: visual mind maps, focused paragraph chunks, audio streams, or sequential steps.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Multi-modal formatting</li>
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Key term glossary callouts</li>
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Adjustable density & typography</li>
              </ul>
            </div>

            <div className="rounded-3xl border-2 border-primary/50 bg-card p-7 shadow-md relative">
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground uppercase">
                Active Retrieval
              </span>
              <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Target className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">2. Practice</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Immediate, low-stakes retrieval drills consolidate memories into long-term circuits, identifying subtle blindspots before they compound.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Instant diagnostic checkpoints</li>
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Targeted explanations for mistakes</li>
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Zero penalty or stressful grading</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
              <div className="grid size-12 place-items-center rounded-2xl bg-accent/20 text-accent-foreground">
                <Sparkles className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">3. Adapt</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                EduAdapt AI interprets comprehension telemetry, dynamically recalibrating vocabulary depth, concept scaffolding, and future recommendations.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Automatic chunk size tuning</li>
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Modality weight recalibration</li>
                <li className="flex items-center gap-2"><Check className="size-3 text-primary" /> Personalized next learning steps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Learner-Control Messaging (Crucial Requirement) */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-8 lg:p-12 shadow-md">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                <UserCheck className="size-3.5" /> Learner Sovereignty Guarantee
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                You are in complete control of your learning.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Traditional adaptive software behaves like an opaque black box, dictating what you must do and locking you into arbitrary paths. EduAdapt is built on an uncompromising principle: <b>The learner remains the pilot.</b>
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                EduAdapt AI serves as an empowering, transparent co-pilot. You can override difficulty thresholds, toggle formats on demand, customize your session duration, and inspect every recommendation.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" asChild className="font-semibold">
                  <Link to="/onboarding">Experience Learner Control</Link>
                </Button>
                <Button size="lg" variant="outline" onClick={startDemo}>
                  Try the Demo
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-background/80 p-5 text-xs shadow-inner">
              <p className="font-bold text-foreground text-sm flex items-center gap-2">
                <Sliders className="size-4 text-primary" /> Your Learner Agency Controls
              </p>
              <div className="space-y-2 pt-2 text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span>Modality Switching:</span>
                  <span className="font-semibold text-foreground">Instant 1-click toggle</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span>Pacing & Session Timer:</span>
                  <span className="font-semibold text-foreground">Customizable (15-60m)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span>AI Baseline Fluency:</span>
                  <span className="font-semibold text-foreground">Beginner / Inter / Adv</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Algorithmic Transparency:</span>
                  <span className="font-semibold text-primary">Fully visible signals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas from Submitted Idea */}
      <section className="border-t border-border/60 bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Core Innovations</span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Focus areas from our submitted idea
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Engineered specifically to solve PS-03 through cognitive ergonomics and real-time adaptation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Layers className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-foreground">Cognitive Chunking</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Decomposes dense technical literature to fit human working memory capacity (3-5 concepts per chunk).
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-2xl bg-accent/20 text-accent-foreground">
                <Network className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-foreground">Spatial Knowledge Graphs</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Transforms linear arguments into intuitive spatial network graphs showing clear dependency relationships.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Zap className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-foreground">Continuous Diagnosis</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Diagnoses comprehension bottlenecks in real time during the reading session rather than days later.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-2xl bg-accent/20 text-accent-foreground">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-foreground">Empowered Autonomy</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Learners retain complete authority to calibrate their goals, session duration, and preferred formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reading Controls & Final CTA */}
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-16">

        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-card to-primary/10 p-8 text-center sm:p-12 shadow-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase">
            <Sparkles className="size-3.5" /> Start Learning Now
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to experience education designed for your mind?
          </h2>
          <p className="mt-2 max-w-xl mx-auto text-sm text-muted-foreground">
            Configure your AI baseline in 60 seconds — and receive every chapter shaped for how you learn best.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild className="font-semibold px-8 shadow-sm">
              <Link to="/onboarding">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" onClick={startDemo} className="border-primary/40 hover:border-primary">
              Explore Demo Chapters
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <EduAdaptLogo size="sm" asLink={false} />
          <p>
            EduAdapt · Personalised AI Learning for Every Learner · PS-03 Solution
          </p>
          <div className="flex gap-4">
            <Link to="/onboarding" className="hover:text-primary transition-colors">Onboarding</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/learn" className="hover:text-primary transition-colors">Reader</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
