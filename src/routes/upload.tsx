import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Image as ImageIcon, Loader2, Type, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { LoadingQuote } from "@/components/echo/loading-quote";
import { AppShell } from "@/components/echo/shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractFromFile } from "@/lib/echo/ocr";
import { adaptChapter } from "@/lib/echo/adapt";
import { setEcho, useEcho } from "@/lib/echo/store";
import { demoProfile } from "@/lib/echo/samples";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload & adapt a chapter — EduAdapt" },
      { name: "description", content: "Upload a PDF, photograph a textbook page, or paste text — EduAdapt personalises it to your cognitive profile." },
      { property: "og:title", content: "Upload & adapt a chapter — EduAdapt" },
      { property: "og:description", content: "PDF, photo or pasted text in — an adapted, multi-format chapter out." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const { profile } = useEcho();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [adapting, setAdapting] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setExtracting(true);
    setProgress(0);
    const result = await extractFromFile(file, setProgress);
    setText(result.text);
    setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ""));
    setExtracting(false);
    toast.success(`Text extracted (${result.engine === "simulated" ? "simulated OCR" : "text layer"})`);
  };

  const adapt = async () => {
    if (text.trim().length < 60) {
      toast.error("Add a little more text so EduAdapt has something to adapt.");
      return;
    }
    setAdapting(true);
    const active = profile ?? demoProfile;
    const chapter = await adaptChapter(text, active, {
      title: title.trim() || undefined,
      subject: "Your material",
      source: "upload",
    });
    setEcho((prev) => ({
      ...prev,
      profile: prev.profile ?? active,
      chapters: [chapter, ...prev.chapters],
      activeChapterId: chapter.id,
      activity: [
        {
          id: crypto.randomUUID(),
          label: "Chapter adapted",
          detail: `${chapter.title} · ${chapter.concepts.length} concepts`,
          at: new Date().toISOString(),
        },
        ...prev.activity,
      ].slice(0, 12),
    }));
    setAdapting(false);
    navigate({ to: "/learn" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Upload & scan content</h1>
          <p className="mt-1 text-muted-foreground">
            Bring in any chapter. EduAdapt rebuilds it around your profile.
          </p>
        </div>

        <Tabs defaultValue="pdf">
          <TabsList>
            <TabsTrigger value="pdf">
              <FileText className="size-4" /> PDF
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="size-4" /> Photo
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="size-4" /> Paste text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="mt-4">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl border border-dashed bg-card p-10 text-center">
              <FileText className="size-7 text-primary" />
              <span className="font-medium">Choose a PDF or text file</span>
              <span className="text-sm text-muted-foreground">We read the text layer where available.</span>
              <input
                type="file"
                accept=".pdf,.txt,.md,text/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          </TabsContent>

          <TabsContent value="image" className="mt-4">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl border border-dashed bg-card p-10 text-center">
              <ImageIcon className="size-7 text-primary" />
              <span className="font-medium">Photograph a textbook page</span>
              <span className="text-sm text-muted-foreground">
                Character recognition runs in your browser — the image never leaves this device.
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <p className="text-sm text-muted-foreground">Paste your chapter into the editor below.</p>
          </TabsContent>
        </Tabs>

        {extracting && (
          <div className="rounded-3xl border bg-card p-6">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Loader2 className="size-4 animate-spin text-primary" /> Extracting text…
            </p>
            <Progress value={progress} className="mt-3" />
            <div className="mt-4"><LoadingQuote label="Reading your pages…" /></div>
          </div>
        )}
        {adapting && <LoadingQuote label="EduAdapt is adapting this chapter for you…" />}

        <div className="space-y-3 rounded-3xl border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Extracted text (editable)</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter title (optional)"
              className="rounded-full border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder="Paste or edit your chapter text here…"
          />
          <Button size="lg" onClick={adapt} disabled={adapting}>
            {adapting ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            {adapting ? "Adapting for you…" : "Adapt this content"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
