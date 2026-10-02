import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function NonDiagnosticNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground",
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
      <p>
        <span className="font-semibold text-foreground">Privacy & Personalisation Notice.</span>{" "}
        EduAdapt identifies learning representations, cognitive signals, and areas where extra scaffolding helps. Your responses and study materials stay on this device in your browser — nothing is shared or sold.
      </p>
    </div>
  );
}
