import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { askHelper } from "@/lib/chat.functions";
import { Button } from "@/components/ui/button";
import { EduAdaptMark } from "./logo";

type Msg = { role: "user" | "assistant"; content: string };

/** Floating help chat. History lives only in memory for this visit. */
export function ChatWidget() {
  const ask = useServerFn(askHelper);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm EduAdapt AI 👋 Your personalised learning co-pilot. Ask me anything about your study material, key concepts, or how to adapt your learning path.",
    },
  ]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const { reply } = await ask({ data: { messages: next.slice(1).slice(-20) } });
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, something went wrong. Try again?" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-primary/30 bg-card shadow-2xl">
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary to-accent px-4 py-3 text-primary-foreground">
            <div className="grid size-8 place-items-center rounded-lg bg-background/90 p-0.5">
              <EduAdaptMark size={26} />
            </div>
            <div className="flex-1">
              <p className="font-semibold leading-tight">EduAdapt AI</p>
              <p className="text-xs opacity-90">Personalised Learning Co-pilot</p>
            </div>
            <button aria-label="Close help" onClick={() => setOpen(false)}>
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground" : "mr-8 whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-3 py-2"}>
                {m.content}
              </div>
            ))}
            {busy && <div className="mr-8 flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Thinking…</div>}
            <div ref={end} />
          </div>
          <form className="flex gap-2 border-t p-2" onSubmit={(e) => { e.preventDefault(); void send(); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" className="flex-1 rounded-full border bg-background px-3 text-sm" />
            <Button size="icon" type="submit" disabled={busy} aria-label="Send"><Send className="size-4" /></Button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open help chat"
        className="fixed bottom-4 right-4 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}
