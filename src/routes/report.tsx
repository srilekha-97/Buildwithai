import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, BookOpen, Flame, Printer, Target, Timer } from "lucide-react";
import { AppShell } from "@/components/echo/shell";
import { Button } from "@/components/ui/button";
import { useEcho } from "@/lib/echo/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Weekly report card — EduAdapt" },
      { name: "description", content: "A weekly learning report card for students and parents." },
      { property: "og:title", content: "Weekly report card — EduAdapt" },
      { property: "og:description", content: "Weekly student and parent learning summary." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

function grade(pct: number) {
  if (pct >= 90) return { g: "A+", msg: "Outstanding work!" };
  if (pct >= 75) return { g: "A", msg: "Great progress!" };
  if (pct >= 60) return { g: "B", msg: "Good effort — keep going!" };
  if (pct >= 40) return { g: "C", msg: "You're building skills step by step." };
  return { g: "—", msg: "Take a quiz to see your grade." };
}

function ReportPage() {
  const echo = useEcho();
  const [view, setView] = useState<"student" | "parent">("student");
  const weekAgo = Date.now() - 7 * 86400000;
  const quizzes = echo.stats.quizScores.filter((q) => new Date(q.at).getTime() >= weekAgo);
  const acts = echo.activity.filter((a) => new Date(a.at).getTime() >= weekAgo);
  const pct = quizzes.length ? Math.round((quizzes.reduce((a, q) => a + q.score / q.total, 0) / quizzes.length) * 100) : 0;
  const { g, msg } = grade(quizzes.length ? pct : -1);
  const fu = echo.stats.formatUsage;
  const fav = (Object.entries(fu) as [string, number][]).sort((a, b) => b[1] - a[1])[0];
  const name = echo.student?.name || "Learner";
  const start = new Date(weekAgo).toLocaleDateString();
  const end = new Date().toLocaleDateString();

  const stats = [
    { icon: Flame, label: "Day streak", value: echo.stats.streak },
    { icon: BookOpen, label: "Chapters done", value: echo.stats.chaptersCompleted.length },
    { icon: Target, label: "Quizzes this week", value: quizzes.length },
    { icon: Timer, label: "Focus breaks", value: echo.stats.focusSessions },
  ];

  return (
    <AppShell showToolbar={false}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="inline-flex rounded-full border bg-card p-1">
          {(["student", "parent"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("rounded-full px-4 py-1.5 text-sm capitalize", view === v && "bg-primary text-primary-foreground")}>{v} view</button>
          ))}
        </div>
        <Button variant="outline" onClick={() => window.print()}><Printer className="size-4" /> Print / Save PDF</Button>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary to-primary/70 p-6 text-primary-foreground">
          <div>
            <p className="text-sm opacity-80">Weekly report card · {start} – {end}</p>
            <h1 className="text-2xl font-bold">{name}{echo.student?.level ? ` · ${echo.student.level}` : ""}</h1>
          </div>
          <div className="grid size-20 place-items-center rounded-2xl bg-background text-3xl font-black text-primary">{g}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-muted/60 p-4">
              <s.icon className="size-5 text-primary" />
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {view === "student" ? (
          <div className="space-y-4 px-6 pb-6">
            <div className="flex items-center gap-3 rounded-2xl bg-accent/30 p-4">
              <Award className="size-8 text-primary" />
              <div><p className="font-semibold">{msg}</p><p className="text-sm text-muted-foreground">Quiz accuracy this week: {pct}%</p></div>
            </div>
            <h2 className="font-semibold">Quiz results</h2>
            {quizzes.length ? quizzes.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-40 truncate text-sm">{q.chapter}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${(q.score / q.total) * 100}%` }} /></div>
                <span className="text-sm font-medium">{q.score}/{q.total}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">No quizzes this week. <Link to="/learn" className="text-primary underline">Try one now</Link>.</p>}
          </div>
        ) : (
          <div className="space-y-4 px-6 pb-6 text-sm">
            <h2 className="text-base font-semibold">Summary for parents & guardians</h2>
            <p>This week, {name} completed <b>{quizzes.length}</b> quiz{quizzes.length === 1 ? "" : "zes"} with an average accuracy of <b>{pct}%</b>, kept a <b>{echo.stats.streak}-day</b> learning streak, and logged <b>{acts.length}</b> learning activities.</p>
            <p>Preferred way to learn: <b>{fav && fav[1] > 0 ? fav[0] : "not enough data yet"}</b>.</p>
            {echo.profile && <p>Support in use: {echo.profile.adaptations.slice(0, 4).join(", ")}.</p>}
            <div className="rounded-2xl bg-muted/60 p-4">
              <p className="font-medium">How you can help at home</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Celebrate effort and the streak, not just scores.</li>
                <li>Encourage short, regular sessions with breaks.</li>
                <li>Ask them to explain one idea they learned this week.</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">EduAdapt personalises learning representations and tracks cognitive progress.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
