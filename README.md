# Haven

An AI companion for reflection, emotional clarity and personal growth. Two companions live inside it: **Whisper** (Thì Thầm) listens to your everyday, **Aurora** (Cực Quang) helps you think clearly when you need to decide.

Live: https://havenmind-ai.vercel.app

## Getting started

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI setup

Whisper and Aurora reply through Claude via three route handlers:

| Route | What it does |
| --- | --- |
| `POST /api/whisper` | One Whisper turn, streamed as plain text |
| `POST /api/aurora` | One Aurora turn (or the closing summary with `mode: "summarize"`), streamed |
| `POST /api/reflect` | Turns a finished conversation into one saved memory (structured JSON) |

Prompts live in `lib/ai/prompts.ts`; the shared server glue in `lib/ai/server.ts`; the browser callers in `lib/ai/client.ts`.

Environment variables (see `.env.example`):

- `ANTHROPIC_API_KEY` – required for real replies. Without it every route answers `503 no_api_key` and the app falls back to the old keyword engine in `lib/reflection.ts` / `lib/aurora.ts`, so local development still works.
- `HAVEN_AI_MODEL` – optional, defaults to `claude-opus-5-5`. Set `claude-sonnet-5-5` or `claude-haiku-5-5` to lower cost.

On Vercel, add the variables under **Project → Settings → Environment Variables** and redeploy.

## Data

There is no account and no database. Memories, profile and settings live in the browser's `localStorage`; an in-progress conversation lives in `sessionStorage` until it is ended and saved. Conversation text is sent to Anthropic only to generate replies.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build (also typechecks)
- `npm run lint` – ESLint
- `npm run brand:derive` – regenerate mascot/brand assets from `docs/brand`
