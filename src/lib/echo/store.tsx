import { useCallback, useEffect, useSyncExternalStore } from "react";
import { defaultState, type EchoState } from "./types";

const KEY = "echolearn.state.v1";
let state: EchoState = defaultState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...defaultState, ...(JSON.parse(raw) as EchoState) };
  } catch {
    /* ignore corrupt storage */
  }
  state = withStreak(state);
  persist();
  emit();
}

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Daily streak: +1 if last visit was yesterday, reset to 1 after a missed day. */
export function withStreak(s: EchoState): EchoState {
  const today = dayKey();
  const last = s.stats.lastActiveDay;
  if (last === today) return s;
  let streak = 1;
  if (last) {
    const diff = Math.round((new Date(today).getTime() - new Date(last).getTime()) / 86400000);
    streak = diff === 1 ? (s.stats.streak || 0) + 1 : 1;
  }
  return { ...s, stats: { ...s.stats, streak, lastActiveDay: today } };
}

/** Replace the whole state (used when loading a signed-in learner's saved progress). */
export function replaceEcho(next: EchoState) {
  state = withStreak({ ...defaultState, ...next, stats: { ...defaultState.stats, ...next.stats } });
  hydrated = true;
  persist();
  emit();
}

export function subscribeEcho(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked */
  }
}

export function setEcho(updater: (prev: EchoState) => EchoState) {
  state = updater(state);
  persist();
  emit();
}

export function getEcho() {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useEcho(): EchoState {
  useEffect(() => {
    load();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => defaultState,
  );
}

export function useHydrated() {
  const echo = useEcho();
  return { echo, ready: hydrated };
}

export function useLogActivity() {
  return useCallback((label: string, detail: string) => {
    setEcho((prev) => ({
      ...prev,
      activity: [
        { id: crypto.randomUUID(), label, detail, at: new Date().toISOString() },
        ...prev.activity,
      ].slice(0, 12),
    }));
  }, []);
}

export function trackFormat(format: "text" | "audio" | "mindmap" | "quiz") {
  setEcho((prev) => ({
    ...prev,
    stats: {
      ...prev.stats,
      formatUsage: { ...prev.stats.formatUsage, [format]: prev.stats.formatUsage[format] + 1 },
    },
  }));
}

export function resetEcho() {
  state = defaultState;
  persist();
  emit();
}
