import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(30),
});

function localReply(question: string): string {
  const q = question.toLowerCase();
  if (/\b(hi|hello|hey)\b/.test(q)) return "Hi! I'm EduAdapt AI. Ask me about AI, machine learning, study tips, or any concept you're learning.";
  if (/artificial intelligence|\bai\b/.test(q)) return "AI (Artificial Intelligence) is the field of making computers perform tasks that normally require human intelligence, such as understanding language, recognising patterns, and making decisions.";
  if (/machine learning|\bml\b/.test(q)) return "Machine Learning is a part of AI where a model learns patterns from data instead of being explicitly programmed for every rule. A simple example is predicting whether an email is spam from past labelled emails.";
  if (/deep learning|\bdl\b|neural network/.test(q)) return "Deep Learning uses neural networks with multiple layers to learn complex patterns. It is widely used for images, speech, language, and recommendation systems.";
  if (/overfitting/.test(q)) return "Overfitting happens when a model learns the training data too closely, including noise, and then performs poorly on new data. More data, regularisation, simpler models, or early stopping can help.";
  if (/supervised|unsupervised|reinforcement/.test(q)) return "Supervised learning uses labelled examples, unsupervised learning finds patterns in unlabelled data, and reinforcement learning learns actions through rewards and penalties.";
  if (/study|concentration|focus|distract/.test(q)) return "Try a 25-minute focused study block, remove notifications, study one small concept at a time, then take a 5-minute break. EduAdapt's Focus Pulse can help structure breaks.";
  if (/quiz|practice/.test(q)) return "Practice is strongest when you actively recall the answer. Try a short quiz, review mistakes, and repeat the difficult concepts later.";
  return "I can help with AI concepts, machine learning, study strategies, quizzes, and EduAdapt features. Try asking: 'What is machine learning?' or 'Explain overfitting simply.'";
}

export const askHelper = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key =
      process.env["EDUADAPT_LLM_API_KEY"] ??
      process.env["ECHOLEARN_LLM_API_KEY"] ??
      process.env["LOVABLE_API_KEY"];

    if (!key) return { reply: localReply(data.messages[data.messages.length - 1].content) };

    const system = `You are EduAdapt AI, the intelligent, supportive learning co-pilot inside EduAdapt: Personalised AI Learning for Every Learner. Help with study paths, academic concepts, Upload, Reader, Progress, Report, Reminders, Account and Focus Pulse. Be concise, clear, encouraging, and structured.`;
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          reasoning_effort: "low",
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });
      if (res.status === 429) return { reply: "Lots of people are asking right now — please try again in a moment." };
      if (res.status === 402) return { reply: "The AI helper is out of credits for now." };
      if (!res.ok) return { reply: localReply(data.messages[data.messages.length - 1].content) };
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return { reply: json.choices?.[0]?.message?.content ?? localReply(data.messages[data.messages.length - 1].content) };
    } catch {
      return { reply: localReply(data.messages[data.messages.length - 1].content) };
    }
  });
