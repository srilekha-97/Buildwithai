import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Flame, BookOpen, Target, Timer, LogOut } from "lucide-react";
import { AppShell } from "@/components/echo/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setEcho, useEcho } from "@/lib/echo/store";
import {
  getLocalProfile,
  saveLocalProfile,
  signOutLocal,
} from "@/lib/local-auth";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My account — EduAdapt" },
      {
        name: "description",
        content: "Your EduAdapt profile, learning stats and preferences.",
      },
      { property: "og:title", content: "My account — EduAdapt" },
      {
        property: "og:description",
        content: "Your EduAdapt profile and learning stats.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = Route.useRouteContext();
  const echo = useEcho();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const existingProfile = getLocalProfile(user.id);
  const [name, setName] = useState(
    existingProfile.display_name || user.name || "",
  );
  const [grade, setGrade] = useState(existingProfile.grade || "");
  const [avatar, setAvatar] = useState(existingProfile.avatar_url || "");

  function save() {
    saveLocalProfile(user.id, {
      display_name: name,
      grade,
      avatar_url: avatar,
    });

    setEcho((p) =>
      p.student
        ? { ...p, student: { ...p.student, name, level: grade } }
        : p,
    );

    toast.success("Profile saved");
  }

  function signOut() {
    qc.clear();
    signOutLocal();
    navigate({ to: "/auth", replace: true });
  }

  const s = echo.stats;
  const acc = s.quizScores.length
    ? Math.round(
        (s.quizScores.reduce((a, q) => a + q.score / q.total, 0) /
          s.quizScores.length) *
          100,
      )
    : 0;

  const initials = (name || user.email || "?").slice(0, 1).toUpperCase();

  return (
    <AppShell showToolbar={false}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border bg-card p-6">
          <div className="flex items-center gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="size-20 rounded-full object-cover"
              />
            ) : (
              <div className="grid size-20 place-items-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{name || "Learner"}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="block text-sm font-medium">
              Name
              <Input
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="block text-sm font-medium">
              Grade / level
              <Input
                className="mt-1"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </label>

            <label className="block text-sm font-medium">
              Avatar image link (optional)
              <Input
                className="mt-1"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://…"
              />
            </label>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={save}>Save profile</Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Flame, label: "Day streak", value: `${s.streak} 🔥` },
              {
                icon: BookOpen,
                label: "Chapters done",
                value: s.chaptersCompleted.length,
              },
              { icon: Target, label: "Quiz accuracy", value: `${acc}%` },
              { icon: Timer, label: "Focus sessions", value: s.focusSessions },
            ].map((c) => (
              <div key={c.label} className="rounded-3xl border bg-card p-5">
                <c.icon className="size-5 text-primary" />
                <p className="mt-2 text-2xl font-bold">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h2 className="font-semibold">Learning profile</h2>
            {echo.profile ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {echo.profile.summary}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't done the learning check-in yet.
              </p>
            )}
            <Button asChild variant="outline" className="mt-4">
              <Link to="/assessment">
                {echo.profile ? "Retake check-in" : "Start check-in"}
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Your progress is saved locally on this device for this demo.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
