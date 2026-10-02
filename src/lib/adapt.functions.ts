import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Optional LLM adaptation. When no key is configured the function returns null
// and the client uses the offline rule-based engine instead.
const InputSchema = z.object({
  rawText: z.string().min(20),
  profile: z.object({
    reading: z.string(),
    focus: z.string(),
    sequencing: z.string(),
    visual: z.string(),
    chunking: z.string(),
  }),
});

const ConceptSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  chunks: z.array(z.string()),
  steps: z.array(z.string()),
  keyTerms: z.array(z.string()),
  callout: z.string(),
  checkpoint: z.string(),
});

const QuizSchema = z.object({
  id: z.string(),
  kind: z.enum(["multiple", "truefalse", "fill"]),
  prompt: z.string(),
  options: z.array(z.string()),
  answer: z.string(),
  explanation: z.string(),
  concept: z.string().optional(),
});

const OutputSchema = z.object({
  title: z.string(),
  subject: z.string().optional(),
  summary: z.string().optional(),
  keyPoints: z.array(z.string()).optional(),
  concepts: z.array(ConceptSchema),
  quiz: z.array(QuizSchema).optional(),
});

export type AiAdaptation = z.infer<typeof OutputSchema>;

export const adaptWithAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AiAdaptation | null> => {
    const key =
      process.env["EDUADAPT_LLM_API_KEY"] ??
      process.env["ECHOLEARN_LLM_API_KEY"] ??
      process.env["LOVABLE_API_KEY"];
    if (!key) return null;

    const system = `You are EduAdapt's cognitive adaptation engine. You personalize study material into a real-time diagnostic learning journey for individual learners.
Learner support profile: reading=${data.profile.reading}, focus=${data.profile.focus}, sequencing=${data.profile.sequencing}, visual=${data.profile.visual}, chunking=${data.profile.chunking}.
High reading support: clearer vocabulary and digestible paragraphs. High focus/chunking: focused concept chunks plus a checkpoint question. High sequencing: explicit numbered steps and structural logic.
Write a faithful, plain-language summary of the source: never invent facts.
Return JSON only: {"title":string,"subject":string,"summary":string,"keyPoints":string[],"concepts":[{"id":string,"title":string,"summary":string,"chunks":string[],"steps":string[],"keyTerms":string[],"callout":string,"checkpoint":string}],"quiz":[{"id":string,"kind":"multiple"|"truefalse"|"fill","prompt":string,"options":string[],"answer":string,"explanation":string,"concept":string}]}
Produce 4-8 concepts, a 2-3 sentence chapter summary, 3-5 key points, and exactly 5 quiz questions.`;

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          reasoning_effort: "low",
          messages: [
            { role: "system", content: system },
            { role: "user", content: data.rawText.slice(0, 12000) },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!response.ok) return null;
      const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) return null;
      return OutputSchema.parse(JSON.parse(content));
    } catch {
      return null;
    }
  });
