import { useEffect } from "react";
import { toast } from "sonner";
import { getEcho, setEcho } from "@/lib/echo/store";

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Checks homework reminders every 20s while EchoLearn is open. */
export function ReminderWatcher() {
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const today = dayKey(now);
      const due = (getEcho().reminders ?? []).filter(
        (r) => r.enabled && r.time === hhmm && r.days.includes(now.getDay()) && r.lastFired !== today,
      );
      if (!due.length) return;
      due.forEach((r) => {
        toast(`⏰ Homework time: ${r.label}`, { description: "You've got this — one small step at a time!", duration: 15000 });
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("EduAdapt — Homework time", { body: r.label, icon: "/favicon.svg" });
        }
      });
      const ids = new Set(due.map((r) => r.id));
      setEcho((p) => ({ ...p, reminders: (p.reminders ?? []).map((r) => (ids.has(r.id) ? { ...r, lastFired: today } : r)) }));
    };
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);
  return null;
}
