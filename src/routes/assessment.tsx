import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/echo/shell";
import { NonDiagnosticNotice } from "@/components/echo/notice";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { assessmentQuestions, buildProfile } from "@/lib/echo/assessment";
import { setEcho, useEcho } from "@/lib/echo/store";
import type { LearningProfile, SupportLevel } from "@/lib/echo/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Learning check-in — EduAdapt" },
      {
        name: "description",
        content:
          "Ten friendly questions that map your reading, focus and sequencing preferences. Preferences, never diagnoses.",
      },
      { property: "og:title", content: "Learning check-in — EduAdapt" },
      {
        property: "og:description",
        content: "Ten friendly questions that shape how EduAdapt presents every chapter to you.",
      },
    ],
  }),
  component: Assessment,
});

const LEVEL_STYLES: Record<SupportLevel, string> = {
  High: "bg-primary text-primary-foreground",
  Medium: "bg-accent text-accent-foreground",
  Low: "bg-muted text-muted-foreground",
};

function ProfileCard({ profile }: { profile: LearningProfile }) {
  const rows: { label: string; value: SupportLevel }[] = [
    { label: "Reading support", value: profile.reading },
    { label: "Focus support", value: profile.focus },
    { label: "Sequencing support", value: profile.sequencing },
    { label: "Visual support", value: profile.visual },
    { label: "Chunking preference", value: profile.chunking },
  ];
  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle2 className="size-5" />
        <h2 className="text-xl font-semibold">Your learning profile</h2>
      </div>
      <p className="mt-2 text-muted-foreground">{profile.summary}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
            <span className="text-sm">{row.label}</span>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", LEVEL_STYLES[row.value])}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium">What EduAdapt will do for you</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {profile.adaptations.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-primary">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Assessment() {
  const navigate = useNavigate();
  const { student } = useEcho();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState<LearningProfile | null>(null);

  const question = assessmentQuestions[index]!;
  const total = assessmentQuestions.length;

  const choose = (optionIndex: number) => {
    const next = { ...answers, [question.id]: optionIndex };
    setAnswers(next);
    if (index + 1 < total) {
      window.setTimeout(() => setIndex(index + 1), 180);
    } else {
      const built = buildProfile(next);
      setProfile(built);
      setEcho((prev) => ({
        ...prev,
        profile: built,
        activity: [
          {
            id: crypto.randomUUID(),
            label: "Learning profile created",
            detail: built.summary,
            at: new Date().toISOString(),
          },
          ...prev.activity,
        ].slice(0, 12),
      }));
    }
  };

  if (profile) {
    return (
      <AppShell showFocus={false}>
        <div className="mx-auto max-w-2xl space-y-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            All done{student?.name ? `, ${student.name}` : ""}
          </p>
          <ProfileCard profile={profile} />
          <NonDiagnosticNotice />
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate({ to: "/dashboard" })}>
              Go to my dashboard <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: "/upload" })}>
              Adapt a chapter now
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showFocus={false}>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>Preferences, not diagnoses</span>
        </div>
        <Progress value={((index + 1) / total) * 100} className="mt-3" />

        <div className="mt-8 rounded-3xl border bg-card p-6">
          <span className="text-3xl" aria-hidden="true">
            {question.emoji}
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{question.prompt}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{question.helper}</p>

          <div className="mt-6 grid gap-2.5">
            {question.options.map((option, i) => (
              <button
                key={option.label}
                type="button"
                onClick={() => choose(i)}
                className={cn(
                  "rounded-2xl border px-4 py-3.5 text-left transition-colors",
                  answers[question.id] === i
                    ? "border-primary bg-primary/10"
                    : "hover:border-primary/50 hover:bg-muted",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {index > 0 && (
          <Button variant="ghost" className="mt-5" onClick={() => setIndex(index - 1)}>
            <ArrowLeft className="size-4" /> Previous question
          </Button>
        )}
      </div>
    </AppShell>
  );
}
