// OCR + document extraction service.
//
// Everything runs in the browser: PDFs are parsed with pdf.js (text layer, with
// an automatic OCR pass for scanned pages) and photographs go through
// Tesseract.js. Plain text files are read directly. Nothing is uploaded.

export type ExtractionResult = {
  text: string;
  engine: "text-layer" | "ocr" | "plain-text" | "simulated";
  pages: number;
  words: number;
  ms: number;
  note?: string;
};

const SIMULATED_PAGE = `Chapter 4 — Cellular Respiration

Cellular respiration is the process by which cells release the energy stored in glucose. The energy is transferred to a molecule called ATP, which powers almost every activity inside the cell.

The process happens in three connected stages. In glycolysis, one glucose molecule is split in the cytoplasm into two molecules of pyruvate, producing a small amount of ATP. In the Krebs cycle, pyruvate is broken down inside the mitochondria and electron carriers are loaded with energy. In the electron transport chain, those carriers release their energy and a large amount of ATP is produced, with oxygen acting as the final electron acceptor and water forming as a by-product.

Respiration and photosynthesis are complementary processes. Photosynthesis stores energy in glucose while respiration releases it, keeping the flow of carbon and oxygen in balance across living systems.`;

function tidy(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/-\n(?=[a-z])/g, "") // join hyphen-split words
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function countWords(text: string) {
  return (text.match(/[A-Za-z0-9’'-]+/g) ?? []).length;
}

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  return pdfjs;
}

async function ocrImage(source: Blob | HTMLCanvasElement, onProgress?: (pct: number) => void, base = 0, span = 100) {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === "recognizing text") onProgress?.(Math.round(base + m.progress * span));
    },
  });
  try {
    const { data } = await worker.recognize(source as never);
    return data.text ?? "";
  } finally {
    await worker.terminate();
  }
}

async function extractPdf(file: File, onProgress?: (pct: number) => void): Promise<ExtractionResult> {
  const start = Date.now();
  const pdfjs = await loadPdfjs();
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const pageCount = doc.numPages;
  const pages: string[] = [];
  let ocrUsed = false;

  for (let p = 1; p <= pageCount; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    let pageText = tidy(
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s{2,}/g, " "),
    );

    // Scanned page: no usable text layer, so rasterise and OCR it.
    if (countWords(pageText) < 15) {
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (context) {
        await page.render({ canvas, canvasContext: context, viewport } as never).promise;
        pageText = tidy(await ocrImage(canvas, onProgress, ((p - 1) / pageCount) * 90, 90 / pageCount));
        ocrUsed = true;
      }
    }

    if (pageText) pages.push(pageText);
    onProgress?.(Math.min(95, Math.round((p / pageCount) * 90)));
  }

  const text = tidy(pages.join("\n\n"));
  onProgress?.(100);
  return {
    text,
    engine: ocrUsed ? "ocr" : "text-layer",
    pages: pageCount,
    words: countWords(text),
    ms: Date.now() - start,
    note: ocrUsed ? "Some pages were scanned images, so they were read with character recognition." : undefined,
  };
}

export async function extractFromFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<ExtractionResult> {
  const start = Date.now();
  onProgress?.(4);

  try {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      return await extractPdf(file, onProgress);
    }

    if (file.type.startsWith("image/")) {
      const text = tidy(await ocrImage(file, onProgress, 5, 92));
      onProgress?.(100);
      if (!text) throw new Error("empty");
      return { text, engine: "ocr", pages: 1, words: countWords(text), ms: Date.now() - start };
    }

    const raw = tidy(await file.text());
    onProgress?.(100);
    if (!raw) throw new Error("empty");
    return { text: raw, engine: "plain-text", pages: 1, words: countWords(raw), ms: Date.now() - start };
  } catch {
    onProgress?.(100);
    return {
      text: SIMULATED_PAGE,
      engine: "simulated",
      pages: 1,
      words: countWords(SIMULATED_PAGE),
      ms: Date.now() - start,
      note: "We couldn't read that file, so a sample chapter was loaded instead. You can paste your own text below.",
    };
  }
}
