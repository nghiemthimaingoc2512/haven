# Haven

An AI companion for reflection, emotional clarity and personal growth. Two companions live inside it: **Whisper** (Thì Thầm) listens to your everyday, **Aurora** (Cực Quang) helps you think clearly when you need to decide.

Live: https://havenmind-ai.vercel.app

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How Haven thinks

Haven has no AI service, API key or server: replies come from a rule-based engine in `lib/mind` that runs entirely in the browser.

| File | What it does |
| --- | --- |
| `normalize.ts` | Tokens and matching. Marked words must match exactly; unmarked input falls back to the bare form, so "rồi" never reads as "rối" |
| `lexicon.ts` | Vocabulary: emotions, topics, people, intents, negators, intensifiers |
| `analyze.ts` | Turns a message into scored emotions with evidence, topics, people, intents, decisions, a sentence to echo |
| `knowledge.{vi,en}.ts` | Everything the companions can say, per topic and emotion |
| `template.ts` | Fills slots and skips a line that can't be used honestly (`[if:...]` conditions, missing slots, already said) |
| `whisper.ts` / `aurora.ts` | The conversation policies: safety first, then social moments, direct questions, then the ordinary case |
| `memory.ts` | Turns a finished conversation into one saved memory |

To make Haven understand more, add terms to `lexicon.ts` and lines to `knowledge.*.ts`, then run `npm run test:mind`. It's a large set of rules, not a language model: it recognises what it has been taught and can't reason about anything else.

## Data

There is no account and no database. Memories, profile and settings live in the browser's `localStorage`; an in-progress conversation lives in `sessionStorage` until it is ended and saved. Nothing you write leaves the device, except that voice input may go through the browser's own speech service.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build (also typechecks)
- `npm run lint` – ESLint
- `npm run test:mind` – golden conversations for the engine
- `npm run brand:derive` – regenerate mascot/brand assets from `docs/brand`
