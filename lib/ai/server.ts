import Anthropic from "@anthropic-ai/sdk";
import type { Lang } from "@/lib/i18n";
import { contextBlock, type CompanionContext } from "@/lib/ai/prompts";

/**
 * Server-side glue shared by the three API routes. The model is configurable
 * so cost can be tuned from Vercel without a deploy; `claude-opus-5-5` is the
 * default. Every route degrades gracefully: when no key is configured the
 * client falls back to the old rule-based engine, so local dev without a key
 * still works.
 */

export const MODEL = process.env.HAVEN_AI_MODEL ?? "claude-opus-5-5";

export const MAX_MESSAGES = 40;
export const MAX_MESSAGE_CHARS = 4000;

let client: Anthropic | null = null;

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export function isLang(value: unknown): value is Lang {
  return value === "vi" || value === "en";
}

/** Validates and trims the chat history a client sent; null when it's unusable. */
export function sanitizeMessages(value: unknown): Anthropic.MessageParam[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) return null;
  const out: Anthropic.MessageParam[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!text) continue;
    out.push({ role, content: text });
  }
  if (out.length === 0 || out[0].role !== "user") return null;
  return out;
}

export function sanitizeContext(value: unknown): CompanionContext {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  const ctx: CompanionContext = {};
  if (typeof raw.name === "string" && raw.name.trim()) ctx.name = raw.name.trim().slice(0, 40);
  if (typeof raw.localTime === "string") ctx.localTime = raw.localTime.slice(0, 40);
  if (Array.isArray(raw.recentMemories)) {
    ctx.recentMemories = raw.recentMemories
      .filter((m): m is Record<string, unknown> => Boolean(m) && typeof m === "object")
      .slice(0, 5)
      .map((m) => ({
        date: typeof m.date === "string" ? m.date.slice(0, 20) : "",
        reflection: typeof m.reflection === "string" ? m.reflection.slice(0, 400) : "",
        topics: Array.isArray(m.topics) ? m.topics.filter((x): x is string => typeof x === "string").slice(0, 3) : [],
      }))
      .filter((m) => m.reflection);
  }
  return ctx;
}

/** Static system prompt first (cacheable), per-request context after. */
export function buildSystem(staticPrompt: string, lang: Lang, ctx: CompanionContext): Anthropic.TextBlockParam[] {
  const blocks: Anthropic.TextBlockParam[] = [
    { type: "text", text: staticPrompt, cache_control: { type: "ephemeral" } },
  ];
  const dynamic = contextBlock(lang, ctx);
  if (dynamic) blocks.push({ type: "text", text: dynamic });
  return blocks;
}

/** Pipes only the text deltas of a message stream to the browser as plain text. */
export function textStreamResponse(stream: ReturnType<Anthropic["messages"]["stream"]>): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(""));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

export function noKeyResponse(): Response {
  return Response.json({ error: "no_api_key" }, { status: 503 });
}

export function badRequest(): Response {
  return Response.json({ error: "bad_request" }, { status: 400 });
}

export function apiErrorResponse(err: unknown): Response {
  if (err instanceof Anthropic.RateLimitError) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  if (err instanceof Anthropic.AuthenticationError) {
    return Response.json({ error: "bad_api_key" }, { status: 503 });
  }
  if (err instanceof Anthropic.APIError) {
    return Response.json({ error: "upstream", status: err.status }, { status: 502 });
  }
  return Response.json({ error: "unknown" }, { status: 500 });
}
