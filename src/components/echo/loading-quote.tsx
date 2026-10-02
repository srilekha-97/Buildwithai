import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { EduAdaptMark } from "./logo";

export const QUOTES = [
  "Every expert was once a beginner.",
  "Small steps every day add up to big results.",
  "Your brain is growing every time you try.",
  "It's okay to learn at your own pace.",
  "Mistakes are proof that you are trying.",
  "You don't have to be perfect to make progress.",
  "Curiosity is your superpower.",
  "One page at a time — you've got this!",
  "Believe you can, and you're halfway there.",
  "Learning is a journey, not a race.",
];

export function LoadingQuote({ label = "Getting things ready…" }: { label?: string }) {
  const [i, setI] = useState(() => Math.floor(Math.random() * QUOTES.length));
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % QUOTES.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border bg-gradient-to-br from-primary/10 to-accent/20 p-6 text-center">
      <div className="animate-bounce">
        <EduAdaptMark size={56} />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p key={i} className="flex items-center gap-2 text-base font-semibold text-foreground animate-in fade-in duration-700">
        <Sparkles className="size-4 text-accent-foreground" /> “{QUOTES[i]}”
      </p>
    </div>
  );
}

export function Splash() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background/95 px-6 backdrop-blur-sm">
      <LoadingQuote label="Preparing your personalised learning space…" />
    </div>
  );
}
