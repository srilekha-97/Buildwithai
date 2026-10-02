import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlarmClock, Bell, Trash2 } from "lucide-react";
import { AppShell } from "@/components/echo/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setEcho, useEcho } from "@/lib/echo/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Homework reminders — EduAdapt" },
      { name: "description", content: "Set friendly study-time alarms that remind you to learn." },
      { property: "og:title", content: "Homework reminders — EduAdapt" },
      { property: "og:description", content: "Set friendly study-time alarms in EduAdapt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RemindersPage,
});

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function RemindersPage() {
  const echo = useEcho();
  const reminders = echo.reminders ?? [];
  const [label, setLabel] = useState("Maths homework");
  const [time, setTime] = useState("17:00");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);

  async function add() {
    if (!label.trim() || !days.length) { toast.error("Add a name and pick at least one day."); return; }
    if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission();
    setEcho((p) => ({ ...p, reminders: [...(p.reminders ?? []), { id: crypto.randomUUID(), label: label.trim(), time, days, enabled: true }] }));
    toast.success(`Reminder set for ${time}`);
  }

  return (
    <AppShell showToolbar={false}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border bg-gradient-to-br from-accent/30 to-primary/10 p-6">
          <AlarmClock className="size-10 text-primary" />
          <h1 className="mt-3 text-2xl font-bold">Homework alarms</h1>
          <p className="mt-1 text-sm text-muted-foreground">We'll nudge you when it's time to study. Keep EduAdapt open in a tab for alerts.</p>
          <div className="mt-5 space-y-3">
            <label className="block text-sm font-medium">What's it for?<Input className="mt-1" value={label} onChange={(e) => setLabel(e.target.value)} /></label>
            <label className="block text-sm font-medium">Time<Input type="time" className="mt-1" value={time} onChange={(e) => setTime(e.target.value)} /></label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d, i) => (
                <button key={d} onClick={() => setDays((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
                  className={cn("rounded-full border px-3 py-1 text-sm", days.includes(i) ? "bg-primary text-primary-foreground" : "bg-background")}>{d}</button>
              ))}
            </div>
            <Button onClick={add}><Bell className="size-4" /> Add reminder</Button>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold">Your reminders</h2>
          {!reminders.length && <p className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground">No reminders yet. Add one to build a study habit! 🌱</p>}
          {reminders.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-3xl border bg-card p-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 font-bold text-primary">{r.time}</div>
              <div className="flex-1">
                <p className="font-medium">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.days.sort().map((d) => DAYS[d]).join(", ")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEcho((p) => ({ ...p, reminders: (p.reminders ?? []).map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)) }))}>
                {r.enabled ? "On" : "Off"}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setEcho((p) => ({ ...p, reminders: (p.reminders ?? []).filter((x) => x.id !== r.id) }))}><Trash2 className="size-4" /></Button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
