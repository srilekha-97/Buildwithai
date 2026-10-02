// Thin wrapper around the browser Web Speech API so reader components stay simple.

export type SpeechState = "idle" | "speaking" | "paused";

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, rate: number, onEnd?: () => void, onBoundary?: (charIndex: number) => void) {
  if (!speechSupported()) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.onend = () => onEnd?.();
  utterance.onboundary = (event) => onBoundary?.(event.charIndex);
  window.speechSynthesis.speak(utterance);
  return true;
}

export function pauseSpeech() {
  if (speechSupported()) window.speechSynthesis.pause();
}

export function resumeSpeech() {
  if (speechSupported()) window.speechSynthesis.resume();
}

export function stopSpeech() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
