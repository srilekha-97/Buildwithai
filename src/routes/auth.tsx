import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/echo/shell";
import { EduAdaptMark } from "@/components/echo/logo";
import { getCurrentUser, signInLocal, signUpLocal } from "@/lib/local-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — EduAdapt" },
      {
        name: "description",
        content:
          "Sign in or create your EduAdapt account to save your personalised learning progress.",
      },
      { property: "og:title", content: "Sign in — EduAdapt" },
      {
        property: "og:description",
        content: "Save your streaks, chapters and reports across devices.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getCurrentUser()) {
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "in") {
        const result = await signInLocal(email, password);

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Signed in successfully!");
          navigate({ to: "/dashboard" });
        }
      } else {
        const result = await signUpLocal(email, password, name);

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Account created successfully!");
          navigate({ to: "/dashboard" });
        }
      }
    } finally {
      setBusy(false);
    }
  }

  function google() {
    toast.info("Google sign-in requires the cloud/Supabase setup. Use email and password for this local demo.");
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-primary via-primary/90 to-background p-10 text-primary-foreground md:flex">
        <Logo />
        <div>
          <div className="mb-6 grid size-24 place-items-center rounded-3xl bg-background/25 p-2 shadow-lg backdrop-blur">
            <EduAdaptMark size={64} />
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Personalised AI Learning for Every Learner.
          </h2>
          <p className="mt-3 text-lg opacity-90">
            Save your streaks, chapters and weekly reports on this device.
          </p>
        </div>
        <p className="text-sm opacity-80">
          “Small steps every day add up to big results.”
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="md:hidden">
            <Logo />
          </div>

          <>
            <div>
              <h1 className="text-2xl font-bold">
                {mode === "in" ? "Welcome back!" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "in"
                  ? "Sign in to continue learning."
                  : "It only takes a minute."}
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={google}
              type="button"
            >
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "up" && (
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Password (6+ characters)"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={busy}>
                {busy
                  ? "Please wait…"
                  : mode === "in"
                    ? "Sign in"
                    : "Create account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "in"
                ? "New to EduAdapt? "
                : "Already have an account? "}
              <button
                className="font-semibold text-primary"
                type="button"
                onClick={() => setMode(mode === "in" ? "up" : "in")}
              >
                {mode === "in" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </>
        </div>
      </div>
    </div>
  );
}
