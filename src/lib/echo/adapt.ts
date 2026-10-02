// Adaptive content engine.
//
// adaptChapter() is the single entry point used by the UI. It asks the server
// for an LLM adaptation (only available when an API key is configured) and
// otherwise falls back to the fully offline rule-based engine below, so the
// product works identically without any external service.

import type { AdaptedChapter, Concept, LearningProfile, MindMapNode, QuizQuestion } from "./types";

const STOP_WORDS = new Set(
  "the a an and or of to in is are was were be been being that this these those it its as for with from by on at into which their there they them we you your our not can will would should could has have had also more most other such than then when while about between during over under after before each many some any but if because so however therefore thus only very much both all one two three new used using use make made get given give across within per".split(
    " ",
  ),
);

// Plain-language swaps used when the learner asks for reading support.
const SIMPLER_WORDS: [RegExp, string][] = [
  [/\butilis[ez]e?d?\b/gi, "used"],
  [/\bapproximately\b/gi, "about"],
  [/\bsubsequently\b/gi, "then"],
  [/\bconsequently\b/gi, "so"],
  [/\bnevertheless\b/gi, "even so"],
  [/\bin order to\b/gi, "to"],
  [/\bdemonstrates?\b/gi, "shows"],
  [/\bfacilitates?\b/gi, "helps"],
  [/\bnumerous\b/gi, "many"],
  [/\bcommence[sd]?\b/gi, "starts"],
  [/\bterminates?\b/gi, "ends"],
  [/\bobtain(ed|s)?\b/gi, "gets"],
  [/\brequires?\b/gi, "needs"],
  [/\bsufficient\b/gi, "enough"],
  [/\bprior to\b/gi, "before"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bin addition\b/gi, "also"],
];

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

function simplifyWording(sentence: string, profile: LearningProfile): string {
  if (profile.reading === "Low") return sentence;
  return SIMPLER_WORDS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), sentence);
}

function splitLong(sentence: string): string[] {
  // Split long sentences at natural joints so each chunk carries one idea.
  if (sentence.length <= 150) return [sentence];
  const parts = sentence
    .split(/,\s+(?=which|and|while|but|so|because|although|whereas)|;\s+/i)
    .map((p) => p.trim().replace(/^[,;]/, ""))
    .filter(Boolean);
  if (parts.length < 2) return [sentence];
  return parts.map((part, i) => {
    const needsStop = !/[.!?]$/.test(part);
    const capitalised = i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1);
    return needsStop ? `${capitalised}.` : capitalised;
  });
}

function wordCounts(text: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []) {
    if (STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
}

function keyTerms(text: string, limit: number, globalCounts?: Map<string, number>): string[] {
  const local = wordCounts(text);
  const scored = [...local.entries()].map(([word, count]) => {
    const global = globalCounts?.get(word) ?? count;
    // Favour words that matter here but are not generic across the chapter.
    return [word, count * (1 + count / (global + 1))] as [string, number];
  });
  return scored
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/** Simple extractive summary: pick the sentences that carry the most key words. */
function summarise(text: string, max: number, counts: Map<string, number>): string[] {
  const list = sentences(text);
  if (list.length <= max) return list;
  const scored = list.map((sentence, index) => {
    const words = sentence.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? [];
    const score =
      words.reduce((sum, w) => sum + (STOP_WORDS.has(w) ? 0 : (counts.get(w) ?? 0)), 0) /
        Math.max(8, words.length) +
      (index === 0 ? 1.5 : 0);
    return { sentence, index, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence);
}

function titleFor(paragraph: string, index: number, counts: Map<string, number>): string {
  const first = sentences(paragraph)[0] ?? `Concept ${index + 1}`;
  const subject = first.split(/\s+(?:is|are|was|were|began|refers|means|happens|occurs)\b/i)[0] ?? first;
  const candidate = (subject.length > 6 && subject.length < 70 ? subject : first.split(" ").slice(0, 8).join(" "))
    .replace(/[.,;:]$/, "")
    .trim();
  if (candidate.length > 4) return candidate.charAt(0).toUpperCase() + candidate.slice(1);
  const top = keyTerms(paragraph, 2, counts).join(" & ");
  return top ? top.charAt(0).toUpperCase() + top.slice(1) : `Concept ${index + 1}`;
}

function chunkSize(profile: LearningProfile): number {
  if (profile.chunking === "High" || profile.focus === "High") return 2;
  if (profile.chunking === "Medium" || profile.focus === "Medium") return 3;
  return 4;
}

/** Group raw text into balanced, concept-sized sections. */
function sections(rawText: string): string[] {
  const paragraphs = rawText
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);

  const merged: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.length < 180 && merged.length && merged[merged.length - 1]!.length < 700) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${paragraph}`;
    } else {
      merged.push(paragraph);
    }
  }

  // One long wall of text: split it evenly by sentences instead.
  if (merged.length <= 1) {
    const all = sentences(rawText);
    const target = Math.min(8, Math.max(3, Math.ceil(all.length / 5)));
    const out: string[] = [];
    for (let i = 0; i < all.length; i += target) out.push(all.slice(i, i + target).join(" "));
    return out.filter((s) => s.trim().length > 0).slice(0, 8);
  }

  return merged.slice(0, 8);
}

export function buildAdaptations(profile: LearningProfile): string[] {
  const applied = ["Structured concept-by-concept layout"];
  if (profile.reading !== "Low") applied.push("Simpler wording, key concepts highlighted");
  if (profile.chunking !== "Low" || profile.focus !== "Low") applied.push("Shorter content chunks");
  if (profile.focus !== "Low") applied.push("Micro-checkpoints and timer cues");
  if (profile.sequencing !== "Low") applied.push("Numbered step-by-step flow");
  if (profile.visual !== "Low") applied.push("Visual structure and mind map");
  return applied;
}

function shuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 7;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483647;
    const j = Math.abs(s) % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function trimTo(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function buildQuiz(concepts: Concept[], title: string): QuizQuestion[] {
  const quiz: QuizQuestion[] = [];
  const others = concepts.map((c) => c.summary || c.chunks[0] || c.title);

  concepts.slice(0, 3).forEach((concept, i) => {
    const correct = trimTo(concept.summary || concept.chunks[0] || concept.title, 130);
    const distractors = others
      .filter((_, idx) => idx !== i)
      .map((text) => trimTo(text, 130))
      .filter((text) => text !== correct)
      .slice(0, 2);
    while (distractors.length < 3) {
      distractors.push(
        [
          `${title} does not cover ${concept.keyTerms[0] ?? "this idea"} at all.`,
          `${concept.title} is only an example and has no effect on the rest of the chapter.`,
          "None of the ideas in this section are connected to each other.",
        ][distractors.length] as string,
      );
    }
    quiz.push({
      id: `q${i + 1}`,
      kind: "multiple",
      prompt: `Which statement best matches “${concept.title}”?`,
      options: shuffle([correct, ...distractors.slice(0, 3)], i + 3),
      answer: correct,
      explanation: `This section explains: ${trimTo(concept.summary || concept.chunks[0] || concept.title, 200)}`,
      concept: concept.title,
    });
  });

  const trueConcept = concepts[Math.min(1, concepts.length - 1)] ?? concepts[0];
  if (trueConcept) {
    const isTrue = true;
    quiz.push({
      id: "q4",
      kind: "truefalse",
      prompt: `True or false: ${trimTo(trueConcept.summary || trueConcept.chunks[0] || trueConcept.title, 160)}`,
      options: ["True", "False"],
      answer: isTrue ? "True" : "False",
      explanation: `This statement is taken directly from “${trueConcept.title}”.`,
      concept: trueConcept.title,
    });
  }

  const fillConcept = concepts[0];
  if (fillConcept) {
    const term = fillConcept.keyTerms[0] ?? "concept";
    const sourceSentence = fillConcept.chunks.find((c) => c.toLowerCase().includes(term)) ?? fillConcept.chunks[0] ?? "";
    const blanked = sourceSentence
      ? trimTo(sourceSentence.replace(new RegExp(`\\b${term}\\b`, "i"), "______"), 180)
      : "A central term in this chapter is ______.";
    const options = shuffle(
      [term, ...concepts.flatMap((c) => c.keyTerms).filter((t) => t !== term).slice(0, 3)],
      5,
    );
    quiz.push({
      id: "q5",
      kind: "fill",
      prompt: `Fill in the blank: ${blanked}`,
      options: options.length > 1 ? options : [term, "energy", "process", "system"],
      answer: term,
      explanation: `“${term}” is one of the most important words in “${fillConcept.title}”.`,
      concept: fillConcept.title,
    });
  }

  return quiz.slice(0, 5);
}

export function fallbackAdapt(
  rawText: string,
  profile: LearningProfile,
  meta: { title?: string; subject?: string; source?: "demo" | "upload" } = {},
): AdaptedChapter {
  const cleaned = rawText.replace(/\r/g, "").trim();
  const pool = sections(cleaned);
  const size = chunkSize(profile);
  const globalCounts = wordCounts(cleaned);

  const concepts: Concept[] = pool.map((paragraph, index) => {
    const simplified = sentences(paragraph)
      .map((s) => simplifyWording(s, profile))
      .flatMap(splitLong);
    const chunks: string[] = [];
    for (let i = 0; i < simplified.length; i += size) chunks.push(simplified.slice(i, i + size).join(" "));
    const summaryLines = summarise(paragraph, 2, globalCounts).map((s) => simplifyWording(s, profile));
    const title = titleFor(paragraph, index, globalCounts);
    return {
      id: `c${index + 1}`,
      title,
      summary: trimTo(summaryLines.join(" "), 260),
      chunks: chunks.length ? chunks : [paragraph],
      steps: simplified.slice(0, 5),
      keyTerms: keyTerms(paragraph, 4, globalCounts),
      callout: `Key idea: ${trimTo(summaryLines[0] ?? simplified[0] ?? paragraph, 180)}`,
      checkpoint: `Can you say in one sentence what “${title}” means?`,
    };
  });

  const title = meta.title ?? titleFor(pool[0] ?? "Your chapter", 0, globalCounts);
  const overview = summarise(cleaned, 3, globalCounts).map((s) => simplifyWording(s, profile));

  const mindMap: MindMapNode[] = [{ id: "root", label: title, parent: null, kind: "root" }];
  concepts.forEach((concept) => {
    mindMap.push({
      id: concept.id,
      label: concept.title,
      parent: "root",
      kind: "branch",
      detail: concept.summary,
    });
    concept.keyTerms.slice(0, 3).forEach((term, i) => {
      mindMap.push({
        id: `${concept.id}-${i}`,
        label: term,
        parent: concept.id,
        kind: "leaf",
        detail: concept.chunks.find((chunk) => chunk.toLowerCase().includes(term)),
      });
    });
  });

  return {
    id: crypto.randomUUID(),
    title,
    subject: meta.subject ?? "Your material",
    source: meta.source ?? "upload",
    rawText: cleaned,
    summary: overview.join(" "),
    keyPoints: concepts.slice(0, 5).map((c) => trimTo(c.summary || c.chunks[0] || c.title, 140)),
    concepts,
    mindMap,
    quiz: buildQuiz(concepts, title),
    adaptationsApplied: buildAdaptations(profile),
    engine: "fallback",
    createdAt: new Date().toISOString(),
  };
}

export async function adaptChapter(
  rawText: string,
  profile: LearningProfile,
  meta: { title?: string; subject?: string; source?: "demo" | "upload" } = {},
): Promise<AdaptedChapter> {
  const base = fallbackAdapt(rawText, profile, meta);
  try {
    const { adaptWithAI } = await import("../adapt.functions");
    const result = await adaptWithAI({ data: { rawText, profile } });
    if (result?.concepts?.length) {
      const concepts = result.concepts;
      const mindMap: MindMapNode[] = [{ id: "root", label: result.title || base.title, parent: null, kind: "root" }];
      concepts.forEach((concept) => {
        mindMap.push({
          id: concept.id,
          label: concept.title,
          parent: "root",
          kind: "branch",
          detail: concept.summary ?? concept.chunks[0],
        });
        concept.keyTerms.slice(0, 3).forEach((term, i) => {
          mindMap.push({
            id: `${concept.id}-${i}`,
            label: term,
            parent: concept.id,
            kind: "leaf",
            detail: concept.chunks.find((chunk) => chunk.toLowerCase().includes(term.toLowerCase())),
          });
        });
      });
      return {
        ...base,
        title: result.title || base.title,
        subject: meta.subject ?? result.subject ?? base.subject,
        summary: result.summary ?? base.summary,
        keyPoints: result.keyPoints?.length ? result.keyPoints : base.keyPoints,
        concepts,
        mindMap,
        quiz: result.quiz?.length ? result.quiz : base.quiz,
        engine: "ai",
      };
    }
  } catch {
    // No key configured or the model was unavailable — use the offline engine.
  }
  return base;
}
