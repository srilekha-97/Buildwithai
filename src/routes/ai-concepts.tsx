import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, CheckCircle2, ChevronDown, Database, Network, Target, Zap } from "lucide-react";
import { AppShell } from "@/components/echo/shell";

export const Route = createFileRoute("/ai-concepts")({ component: AIConceptsPage });

type Topic = { id: string; title: string; icon: React.ReactNode; ideas: string[]; example: string };
const TOPICS: Topic[] = [
  { id: "ai-ml-dl", title: "AI, Machine Learning & Deep Learning", icon: <Brain className="size-5" />, ideas: ["AI is the broad field of making machines perform intelligent tasks.", "Machine Learning lets systems learn patterns from data.", "Deep Learning uses multi-layer neural networks."], example: "A spam filter can learn from examples of spam and normal emails." },
  { id: "data", title: "Data & Features", icon: <Database className="size-5" />, ideas: ["Data is the information used to learn patterns.", "Features are useful input variables given to a model.", "Good, relevant features can improve predictions."], example: "For traffic prediction, speed, vehicle count, hour and weather can be features." },
  { id: "types", title: "Types of Machine Learning", icon: <Target className="size-5" />, ideas: ["Supervised learning uses labelled data.", "Unsupervised learning discovers patterns without labels.", "Reinforcement learning learns through rewards and penalties."], example: "Predicting exam marks from past labelled records is supervised learning." },
  { id: "neural", title: "Neural Networks", icon: <Network className="size-5" />, ideas: ["Neural networks contain connected layers of artificial neurons.", "Weights are adjusted during training.", "Multiple layers can learn increasingly complex patterns."], example: "An image classifier can learn edges, shapes and then complete objects." },
  { id: "training", title: "Training, Validation & Testing", icon: <Zap className="size-5" />, ideas: ["Training data is used to learn model parameters.", "Validation data helps tune choices during development.", "Test data estimates performance on unseen examples."], example: "Keeping a test set separate prevents you from tuning directly to the final evaluation data." },
  { id: "overfit", title: "Overfitting & Generalisation", icon: <CheckCircle2 className="size-5" />, ideas: ["Overfitting means memorising training patterns too closely.", "Generalisation means performing well on new data.", "More data, regularisation and simpler models can reduce overfitting."], example: "A model scoring 99% on training data but 70% on new data may be overfitting." },
];

function AIConceptsPage() {
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(TOPICS[0].id);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem("eduadapt_ai_topics") || "[]")); } catch {} }, []);
  function complete(id: string) { const next = done.includes(id) ? done : [...done, id]; setDone(next); localStorage.setItem("eduadapt_ai_topics", JSON.stringify(next)); }
  return <AppShell><div className="mx-auto max-w-4xl space-y-6">
    <div><p className="text-sm font-semibold text-primary">AI LEARNING MODULE</p><h1 className="mt-1 text-3xl font-bold">AI Concepts</h1><p className="mt-2 text-muted-foreground">Beginner-friendly concepts to build your AI foundation step by step.</p></div>
    <div className="rounded-2xl border bg-card p-4"><div className="flex justify-between text-sm"><span>Learning progress</span><span>{done.length}/{TOPICS.length} completed</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(done.length / TOPICS.length) * 100}%` }} /></div></div>
    <div className="space-y-3">{TOPICS.map((t) => <div key={t.id} className="rounded-2xl border bg-card overflow-hidden"><button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setOpen(open === t.id ? null : t.id)}><span className="flex items-center gap-3 font-semibold">{t.icon}{t.title}</span><ChevronDown className={`size-5 transition-transform ${open === t.id ? "rotate-180" : ""}`} /></button>{open === t.id && <div className="border-t px-5 pb-5 pt-4"><ul className="space-y-2 text-sm text-muted-foreground">{t.ideas.map((x) => <li key={x}>• {x}</li>)}</ul><div className="mt-4 rounded-xl bg-muted/50 p-4 text-sm"><strong>Simple example:</strong> {t.example}</div><button onClick={() => complete(t.id)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{done.includes(t.id) ? "Completed ✓" : "Mark concept complete"}</button></div>}</div>)}</div>
  </div></AppShell>;
}
