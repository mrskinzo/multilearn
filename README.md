# Multilearn

An AI-powered learning companion that transforms any notes or textbook content into multiple formats — audio summaries, mind maps, flashcards, quizzes, and multi-style explanations — so students can engage with material in the way that works best for them.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript) ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![AI](https://img.shields.io/badge/AI-Claude-purple)

🌐 **Live demo:** [www.christi.io](https://www.christi.io)

---

## The Problem

Most students learn by re-reading notes — one of the least effective study strategies. The research is clear: active recall, spaced repetition, and varied encoding (reading, listening, visual) dramatically improve retention. But creating flashcards, quizzes, and summaries from raw notes is time-consuming, so students skip it.

Multilearn automates the conversion of any text into multiple learning formats in seconds, removing the friction between having notes and actually studying effectively.

---

## Features

| Format | What It Does |
|---|---|
| 🎧 Audio Summary | Converts notes to a concise spoken summary |
| 🗺️ Mind Map | Visualises key concepts and their relationships |
| 🃏 Flashcards | Generates Q&A cards for active recall practice |
| 📝 Quiz | Creates MCQ and short-answer questions with answers |
| 🔄 Multi-style Explanations | Re-explains content as a story, analogy, or ELI5 |

---

## Architecture

```
[User pastes notes / textbook text]
              ↓
     [Next.js API Route]
              ↓
     [Claude (Anthropic)]
              ↓
    ┌─────────────────────┐
    │  Format Router       │
    │  ├── audio-summary  │
    │  ├── mind-map       │
    │  ├── flashcards     │
    │  ├── quiz           │
    │  └── explanations  │
    └─────────────────────┘
              ↓
    [Rendered output in UI]
```

The app is a **Next.js 15** project with server-side API routes calling Claude. Each output format uses a dedicated system prompt tuned to produce structured, pedagogically useful content.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| AI | Claude (Anthropic) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Getting Started

```bash
git clone https://github.com/mrskinzo/multilearn.git
cd multilearn
npm install
```

Copy the environment template:

```bash
cp .env.local.example .env.local
```

Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── api/          # Server-side routes for each AI format
│   ├── components/   # UI components (input, output cards, tabs)
│   └── page.tsx      # Main app entry
├── lib/              # Claude API helpers and prompt templates
└── types/            # TypeScript interfaces
```

---

## What's Next

- [ ] Save and revisit previous study sessions
- [ ] Spaced repetition scheduling for flashcard review
- [ ] PDF and image upload (OCR → study materials)
- [ ] Difficulty adjustment for quiz generation
- [ ] Export flashcards to Anki
