import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AccessibilityToolbar } from "./prefs";
import { FocusPulse } from "./focus-pulse";
import { EduAdaptLogo, Logo } from "./logo";

export { EduAdaptLogo, Logo };

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/learn", label: "Reader" },
  { to: "/upload", label: "Upload" },
  { to: "/progress", label: "Progress" },
  { to: "/report", label: "Report" },
  { to: "/reminders", label: "Reminders" },
  { to: "/account", label: "Account" },
  { to: "/ai-concepts", label: "AI Concepts" },
] as const;

export function AppShell({
  children,
  showToolbar = true,
  showFocus = true,
}: {
  children: ReactNode;
  showToolbar?: boolean;
  showFocus?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Logo />
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-primary/10 text-primary rounded-full px-3 py-1.5" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {showToolbar && (
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <AccessibilityToolbar />
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      {showFocus && <FocusPulse />}
    </div>
  );
}
