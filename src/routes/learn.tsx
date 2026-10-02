import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  ListChecks,
  Pause,
  Play,
  Square,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/echo/shell";
import { MindMap } from "@/components/echo/mind-map";
import { readingAttrs } from "@/components/echo/prefs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setEcho, trackFormat, useEcho } from "@/lib/echo/store";
import { pauseSpeech, resumeSpeech, speak, speechSupported, stopSpeech } from "@/lib/echo/tts";
import { cn } from "@/lib/utils";
import type { AdaptedChapter } from "@/lib/echo/types";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learning reader — EduAdapt" },
      { name: "description", content: "Read, listen, map and recall the same chapter in four adaptive modes." },
      { property: "og:title", content: "Learning reader — EduAdapt" },
      { property: "og:description", content: "Simplified text, audio narration, mind map and recall quiz." },
    ],
  }),
  component: Reader,
});

function AdaptationBanner({ chapter }: { chapter: AdaptedChapter }) {
  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5">
      <p className="flex items-center gap-2 font-semibold text-primary">
        <Sparkles className="size-4" /> EduAdapt personalized this chapter for you
      </p>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {chapter.adaptationsApplied.map((item) => (
          <li key={item} className="rounded-full bg-card px-3 py-1 text-muted-foreground">
            ✓ {item}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Adapted by the {chapter.engine === "ai" ? "AI engine" : "built-in offline engine"} · presentation
        changes only, the source meaning is preserved.
      </p>
    </div>
  );
}

function TextMode({ chapter }: { chapter: AdaptedChapter }) {
  const { prefs, profile } = useEcho();
  const [index, setIndex] = useState(0);
  const concept = chapter.concepts[index];
  const total = chapter.concepts.length;

  useEffect(() => {
    trackFormat("text");
  }, [chapter.id]);

  if (!concept) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Concept {index + 1} of {total}
        </span>
        <span>{chapter.subject}</span>
      </div>
      <Progress value={((index + 1) / total) * 100} />

      <article className="rounded-3xl border bg-card p-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {profile?.sequencing === "High" ? `${index + 1}. ` : ""}
          {concept.title}
        </h2>
        <div {...readingAttrs(prefs)} className={cn(readingAttrs(prefs).className, "mt-4")}>
          {concept.chunks.map((chunk, i) => (
            <p key={i}>{chunk}</p>
          ))}
        </div>

        {concept.steps.length > 0 && profile?.sequencing !== "Low" && (
          <ol className="mt-6 space-y-2 rounded-2xl bg-muted/60 p-4 text-sm">
            {concept.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}

        <p className="mt-5 rounded-2xl border-l-4 border-accent bg-accent/15 p-4 text-sm">
          {concept.callout}
        </p>

        {concept.keyTerms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {concept.keyTerms.map((term) => (
              <span key={term} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {term}
              </span>
            ))}
          </div>
        )}

        <p className="mt-5 text-sm text-muted-foreground">🔎 Checkpoint: {concept.checkpoint}</p>
      </article>

      <div className="flex justify-between">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ChevronLeft className="size-4" /> Previous
        </Button>
        {index + 1 < total ? (
          <Button onClick={() => setIndex(index + 1)}>
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={() =>
              setEcho((prev) => ({
                ...prev,
                stats: {
                  ...prev.stats,
                  chaptersCompleted: prev.stats.chaptersCompleted.includes(chapter.id)
                    ? prev.stats.chaptersCompleted
                    : [...prev.stats.chaptersCompleted, chapter.id],
                },
              }))
            }
          >
            Mark chapter complete
          </Button>
        )}
      </div>
    </div>
  );
}

function AudioMode({ chapter }: { chapter: AdaptedChapter }) {
  const [state, setState] = useState<"idle" | "speaking" | "paused">("idle");
  const [rate, setRate] = useState(1);
  const [conceptIndex, setConceptIndex] = useState(0);
  const concept = chapter.concepts[conceptIndex];
  const text = useMemo(
    () => (concept ? `${concept.title}. ${concept.chunks.join(" ")}` : ""),
    [concept],
  );

  useEffect(() => {
    trackFormat("audio");
    return () => stopSpeech();
  }, [chapter.id]);

  const supported = speechSupported();

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Now narrating · Concept {conceptIndex + 1} of {chapter.concepts.length}
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{concept?.title}</h2>

        <div className="mt-6 flex h-16 items-end justify-center gap-1.5">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-2 rounded-full bg-primary/70",
                state === "speaking" ? "echo-bar" : "opacity-30",
              )}
              style={{ height: `${25 + ((i * 37) % 60)}%`, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        <p className="mt-6 rounded-2xl bg-muted/60 p-4 text-sm leading-relaxed">{text}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              if (state === "paused") {
                resumeSpeech();
                setState("speaking");
                return;
              }
              speak(text, rate, () => setState("idle"));
              setState("speaking");
            }}
            disabled={!supported}
          >
            <Play className="size-4" /> {state === "paused" ? "Resume" : "Play"}
          </Button>
          <Button
            variant="outline"
            disabled={state !== "speaking"}
            onClick={() => {
              pauseSpeech();
              setState("paused");
            }}
          >
            <Pause className="size-4" /> Pause
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              stopSpeech();
              setState("idle");
            }}
          >
            <Square className="size-4" /> Stop
          </Button>
          <div className="ml-auto flex rounded-full bg-muted p-0.5 text-sm">
            {[0.75, 1, 1.25].map((option) => (
              <button
                key={option}
                onClick={() => setRate(option)}
                className={cn(
                  "rounded-full px-3 py-1",
                  rate === option ? "bg-card shadow-sm" : "text-muted-foreground",
                )}
              >
                {option}x
              </button>
            ))}
          </div>
        </div>

        {!supported && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your browser does not support speech playback — try Chrome, Edge or Safari.
          </p>
        )}

        <div className="mt-5 flex justify-between">
          <Button
            variant="ghost"
            disabled={conceptIndex === 0}
            onClick={() => {
              stopSpeech();
              setState("idle");
              setConceptIndex(conceptIndex - 1);
            }}
          >
            <ChevronLeft className="size-4" /> Previous
          </Button>
          <Button
            variant="ghost"
            disabled={conceptIndex + 1 >= chapter.concepts.length}
            onClick={() => {
              stopSpeech();
              setState("idle");
              setConceptIndex(conceptIndex + 1);
            }}
          >
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function norm(value: string | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/[.,!?;:"“”']/g, "").replace(/\s+/g, " ");
}

function isCorrect(q: { answer: string }, given: string | undefined) {
  return norm(given) !== "" && norm(given) === norm(q.answer);
}

function QuizMode({ chapter }: { chapter: AdaptedChapter }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackFormat("quiz");
  }, [chapter.id]);

  const score = chapter.quiz.filter((q) => isCorrect(q, answers[q.id])).length;

  const submit = () => {
    setSubmitted(true);
    setEcho((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        quizScores: [
          ...prev.stats.quizScores,
          { chapter: chapter.title, score, total: chapter.quiz.length, at: new Date().toISOString() },
        ],
      },
      activity: [
        {
          id: crypto.randomUUID(),
          label: "Recall quiz completed",
          detail: `${chapter.title} · ${score}/${chapter.quiz.length}`,
          at: new Date().toISOString(),
        },
        ...prev.activity,
      ].slice(0, 12),
    }));
  };

  return (
    <div className="space-y-4">
      {chapter.quiz.map((question, i) => (
        <div key={question.id} className="rounded-3xl border bg-card p-6">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            Question {i + 1} · {question.kind === "truefalse" ? "True / False" : question.kind === "fill" ? "Fill in the blank" : "Multiple choice"}
          </p>
          <h3 className="mt-2 text-lg font-medium">{question.prompt}</h3>
          {question.kind === "fill" && (
            <input
              type="text"
              disabled={submitted}
              value={answers[question.id] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
              placeholder="Type the missing word, or pick one below"
              aria-label="Your answer"
              className={cn(
                "mt-4 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary",
                submitted && (isCorrect(question, answers[question.id]) ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10"),
              )}
            />
          )}
          <div className="mt-4 grid gap-2">
            {question.options.map((option) => {
              const chosen = norm(answers[question.id]) === norm(option);
              const correct = norm(option) === norm(question.answer);
              return (
                <button
                  key={option}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                    !submitted && chosen && "border-primary bg-primary/10",
                    !submitted && !chosen && "hover:bg-muted",
                    submitted && correct && "border-primary bg-primary/10",
                    submitted && chosen && !correct && "border-destructive bg-destructive/10",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p
              className={cn(
                "mt-3 rounded-2xl p-3 text-sm",
                isCorrect(question, answers[question.id])
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isCorrect(question, answers[question.id]) ? "Correct. " : `Answer: ${question.answer}. `}
              {question.explanation}
            </p>
          )}
        </div>
      ))}

      {submitted ? (
        <div className="rounded-3xl border bg-card p-6 text-center">
          <p className="text-3xl font-semibold">
            {score}/{chapter.quiz.length}
          </p>
          <p className="mt-1 text-muted-foreground">
            {score === chapter.quiz.length
              ? "Every one correct — this chapter has landed."
              : "Nice work. Revisit the explanations above, then try the mind map view."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Try again
          </Button>
        </div>
      ) : (
        <Button size="lg" onClick={submit} disabled={chapter.quiz.some((q) => !norm(answers[q.id]))}>
          Check my answers
        </Button>
      )}
    </div>
  );
}

function Reader() {
  const { chapters, activeChapterId } = useEcho();
  const chapter = chapters.find((c) => c.id === activeChapterId) ?? chapters[0];

  if (!chapter) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg rounded-3xl border bg-card p-8 text-center">
          <h1 className="text-2xl font-semibold">No chapter loaded yet</h1>
          <p className="mt-2 text-muted-foreground">
            Upload your own material, or load the ready-made demo chapters from the dashboard.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild>
              <Link to="/upload">Upload a chapter</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{chapter.subject}</p>
            <h1 className="text-3xl font-semibold tracking-tight">{chapter.title}</h1>
          </div>
          {chapters.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {chapters.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setEcho((prev) => ({ ...prev, activeChapterId: option.id }))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    option.id === chapter.id ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  {option.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <AdaptationBanner chapter={chapter} />

        <Tabs defaultValue="text">
          <TabsList>
            <TabsTrigger value="text">
              <BookOpen className="size-4" /> Simplified text
            </TabsTrigger>
            <TabsTrigger value="audio">
              <Headphones className="size-4" /> Listen
            </TabsTrigger>
            <TabsTrigger value="map">
              <Brain className="size-4" /> Mind map
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <ListChecks className="size-4" /> Recall quiz
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="mt-5">
            <TextMode chapter={chapter} />
          </TabsContent>
          <TabsContent value="audio" className="mt-5">
            <AudioMode chapter={chapter} />
          </TabsContent>
          <TabsContent value="map" className="mt-5">
            <MindMap nodes={chapter.mindMap} />
          </TabsContent>
          <TabsContent value="quiz" className="mt-5">
            <QuizMode chapter={chapter} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
