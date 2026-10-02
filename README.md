# EchoLearn

EchoLearn is an adaptive learning companion that reshapes study material around a learner's reading, focus, sequencing, visual, and chunking preferences. It identifies preferences and areas of difficulty; it does not provide medical diagnoses.

## Run locally

You need Node.js 20+ and npm (or Bun).

```sh
npm i
npm run dev
```

Open `http://localhost:8080` in your browser. The included demo works without an API key.

## Optional AI adaptation

Copy `.env.example` to `.env.local` and add a supported key. Without one, EchoLearn automatically uses its local demo adaptation engine.

## Two-minute demo

1. Open the home page and choose **Explore Demo**.
2. Pick either Photosynthesis or the Indian Independence Movement.
3. Switch among Simplified Text, Listen, Mind Map, and Quick Recall Quiz.
4. Open the reading toolbar to change text size, spacing, density, font, or theme.
5. Visit Progress to see learning-format and quiz insights.

## Main features

- Non-diagnostic learning-preference assessment
- PDF, image OCR, and pasted-text input
- Adaptive summaries and concept chunks
- Audio playback, interactive mind maps, quizzes, and focus breaks
- Local browser persistence for the MVP

Built with TanStack Start, React, TypeScript, Tailwind CSS, Tesseract.js, PDF.js, and Recharts.
