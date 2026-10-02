import { useEffect, useRef, useState } from "react";
import { Timer, Wind, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setEcho, useEcho } from "@/lib/echo/store";
import { cn } from "@/lib/utils";

const PHASES = [
  { label: "Breathe in", seconds: 4, scale: "scale-100" },
  { label: "Hold", seconds: 4, scale: "scale-100" },
  { label: "Breathe out", seconds: 6, scale: "scale-50" },
] as const;

function BreathingOverlay({ onClose }: { onClose: () => void }) {
  const [remaining, setRemaining] = useState(60);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseLeft, setPhaseLeft] = useState<number>(PHASES[0]!.seconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          onClose();
          return 0;
        }
        return r - 1;
      });
      setPhaseLeft((left) => {
        if (left > 1) return left - 1;
        setPhaseIndex((i) => (i + 1) % PHASES.length);
        return PHASES[(phaseIndex + 1) % PHASES.length]!.seconds;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [onClose, phaseIndex]);

  const phase = PHASES[phaseIndex]!;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background/95 backdrop-blur">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 rounded-full border p-2 text-muted-foreground hover:text-foreground"
        aria-label="Skip the reset"
      >
        <X className="size-4" />
      </button>
      <p className="text-sm tracking-widest text-muted-foreground uppercase">60-second reset</p>
      <div className="relative flex size-64 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/10" />
        <div
          className={cn(
            "absolute inset-4 rounded-full border-4 border-primary/50 bg-primary/20 transition-transform duration-[4000ms] ease-in-out",
            phase.scale,
          )}
        />
        <div className="relative text-center">
          <p className="text-2xl font-semibold">{phase.label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{phaseLeft}s</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{remaining}s left · you can skip any time</p>
      <Button variant="outline" onClick={onClose}>
        Resume learning
      </Button>
    </div>
  );
}

/** Adaptive focus timer with gentle, dismissible prompts. */
export function FocusPulse() {
  const { profile } = useEcho();
  const [seconds, setSeconds] = useState(0);
  const [prompt, setPrompt] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const nextPromptAt = useRef(0);

  const intervalMinutes = profile?.focus === "High" ? 12 : profile?.focus === "Medium" ? 18 : 25;

  useEffect(() => {
    nextPromptAt.current = intervalMinutes * 60;
  }, [intervalMinutes]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (next >= nextPromptAt.current) {
          setPrompt(true);
          nextPromptAt.current = next + intervalMinutes * 60;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [intervalMinutes]);

  const minutes = Math.floor(seconds / 60);

  const startReset = () => {
    setPrompt(false);
    setBreathing(true);
    setEcho((prev) => ({
      ...prev,
      stats: { ...prev.stats, focusSessions: prev.stats.focusSessions + 1 },
    }));
  };

  return (
    <>
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border bg-card/90 px-3.5 py-2 text-xs shadow-lg backdrop-blur">
        <Timer className="size-4 text-primary" />
        <span className="font-medium">Focus Pulse</span>
        <span className="text-muted-foreground">
          {minutes}m {seconds % 60}s
        </span>
        <button
          onClick={startReset}
          className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary hover:bg-primary/20"
        >
          Reset now
        </button>
      </div>

      {prompt && (
        <div className="fixed right-5 bottom-5 z-40 w-80 rounded-2xl border bg-card p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <Wind className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                You&apos;ve been learning for {minutes} minutes. Would you like a 60-second reset?
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={startReset}>
                  Yes, reset me
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPrompt(false)}>
                  Keep going
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {breathing && <BreathingOverlay onClose={() => setBreathing(false)} />}
    </>
  );
}
