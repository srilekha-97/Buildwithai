import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/echo/shell";
import { useEcho } from "@/lib/echo/store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress & analytics — EduAdapt" },
      { name: "description", content: "See which learning formats you use, how chapters are progressing and how quiz scores trend." },
      { property: "og:title", content: "Progress & analytics — EduAdapt" },
      { property: "og:description", content: "Format usage, chapter completion, quiz history and focus sessions." },
    ],
  }),
  component: ProgressPage,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"];

function ProgressPage() {
  const { stats, chapters } = useEcho();

  const rawUsage = stats.formatUsage;
  const totalUsage = Object.values(rawUsage).reduce((a, b) => a + b, 0);
  const usage = (
    totalUsage > 0
      ? [
          { name: "Simplified text", value: rawUsage.text },
          { name: "Audio", value: rawUsage.audio },
          { name: "Mind maps", value: rawUsage.mindmap },
          { name: "Quizzes", value: rawUsage.quiz },
        ]
      : [
          { name: "Simplified text", value: 42 },
          { name: "Audio", value: 28 },
          { name: "Mind maps", value: 20 },
          { name: "Quizzes", value: 10 },
        ]
  ).filter((entry) => entry.value > 0);

  const completion = chapters.map((chapter) => ({
    name: chapter.title.slice(0, 16),
    completion: stats.chaptersCompleted.includes(chapter.id) ? 100 : 45,
  }));

  const scores = stats.quizScores.map((entry, i) => ({
    name: `Quiz ${i + 1}`,
    score: Math.round((entry.score / entry.total) * 100),
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Progress & analytics</h1>
          <p className="mt-1 text-muted-foreground">How you learn, in numbers.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border bg-card p-5">
            <p className="text-2xl font-semibold">{chapters.length}</p>
            <p className="text-sm text-muted-foreground">Chapters adapted</p>
          </div>
          <div className="rounded-3xl border bg-card p-5">
            <p className="text-2xl font-semibold">{stats.chaptersCompleted.length}</p>
            <p className="text-sm text-muted-foreground">Chapters completed</p>
          </div>
          <div className="rounded-3xl border bg-card p-5">
            <p className="text-2xl font-semibold">{stats.focusSessions}</p>
            <p className="text-sm text-muted-foreground">Focus resets taken</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border bg-card p-6">
            <h2 className="font-semibold">Format usage</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={usage} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                    {usage.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-1.5 text-sm text-muted-foreground">
              {usage.map((entry, i) => (
                <li key={entry.name} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h2 className="font-semibold">Chapter completion</h2>
            <div className="mt-4 h-64">
              {completion.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="completion" fill="var(--color-chart-1)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Adapt a chapter to see completion here.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 lg:col-span-2">
            <h2 className="font-semibold">Quiz score history</h2>
            <div className="mt-4 h-64">
              {scores.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="var(--color-chart-2)" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Take a recall quiz to start your score history.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
