import { useEffect } from "react";
import { Moon, Sun, Type, AlignJustify, LayoutPanelTop } from "lucide-react";
import { useEcho, setEcho } from "@/lib/echo/store";
import type { ReaderPrefs } from "@/lib/echo/types";
import { cn } from "@/lib/utils";

export function usePrefs() {
  const { prefs } = useEcho();
  const update = (patch: Partial<ReaderPrefs>) =>
    setEcho((prev) => ({ ...prev, prefs: { ...prev.prefs, ...patch } }));
  return { prefs, update };
}

/** Applies the learner's reading preferences to <html>. */
export function PrefsEffect() {
  const { prefs } = useEcho();
  useEffect(() => {
    const root = document.documentElement;
    root.dataset["echoSize"] = prefs.fontSize;
    root.dataset["echoSpacing"] = prefs.lineSpacing;
    root.dataset["echoDensity"] = prefs.density;
    root.classList.toggle("dark", prefs.theme === "dark");
  }, [prefs.theme, prefs.fontSize, prefs.lineSpacing, prefs.density]);
  return null;
}

export function readingAttrs(prefs: ReaderPrefs) {
  return {
    className: "echo-reading",
    "data-size": prefs.fontSize,
    "data-spacing": prefs.lineSpacing,
    "data-density": prefs.density,
  } as const;
}

function Segment<T extends string>({
  label,
  icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <div className="flex rounded-full bg-muted p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs transition-colors",
              value === option.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AccessibilityToolbar() {
  const { prefs, update } = usePrefs();

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border bg-card/80 px-4 py-3 backdrop-blur">
      <Segment
        label="Text"
        icon={<Type className="size-3.5" />}
        value={prefs.fontSize}
        options={[
          { value: "small", label: "S" },
          { value: "medium", label: "M" },
          { value: "large", label: "L" },
        ]}
        onChange={(fontSize) => update({ fontSize })}
      />
      <Segment
        label="Spacing"
        icon={<AlignJustify className="size-3.5" />}
        value={prefs.lineSpacing}
        options={[
          { value: "normal", label: "Normal" },
          { value: "relaxed", label: "Relaxed" },
        ]}
        onChange={(lineSpacing) => update({ lineSpacing })}
      />
      <Segment
        label="Density"
        icon={<LayoutPanelTop className="size-3.5" />}
        value={prefs.density}
        options={[
          { value: "compact", label: "Compact" },
          { value: "comfortable", label: "Comfortable" },
          { value: "focused", label: "Focused" },
        ]}
        onChange={(density) => update({ density })}
      />
      <button
        type="button"
        onClick={() => update({ theme: prefs.theme === "dark" ? "light" : "dark" })}
        className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Toggle light and dark mode"
      >
        {prefs.theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        {prefs.theme === "dark" ? "Light" : "Dark"}
      </button>
    </div>
  );
}
