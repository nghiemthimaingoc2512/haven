"use client";

import type { Lang } from "@/lib/i18n";
import type { Memory } from "@/lib/storage";
import type { CompanionContext } from "@/lib/ai/prompts";

/**
 * Browser-side callers for the /api routes. Every helper throws
 * `AiUnavailableError` on any failure (no key, rate limit, network) so the
 * pages can fall back to the old rule-based engine in one place and keep
 * the app usable without a backend.
 */

export class AiUnavailableError extends Error {
  readonly reason: string;
  constructor(reason: string) {
    super(`AI unavailable: ${reason}`);
    this.name = "AiUnavailableError";
    this.reason = reason;
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function reasonFrom(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? `http_${res.status}`;
  } catch {
    return `http_${res.status}`;
  }
}

/** Builds the per-request context block from what the browser knows. */
export function companionContext(name: string, memories: Memory[], lang: Lang): CompanionContext {
  const now = new Date();
  return {
    name: name || undefined,
    localTime: now.toLocaleString(lang === "vi" ? "vi-VN" : "en-US", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    }),
    recentMemories: memories.slice(0, 4).map((m) => ({
      date: new Date(m.createdAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US"),
      reflection: m.reflection,
      topics: m.topics,
    })),
  };
}

/**
 * Streams one companion turn. `onDelta` receives the text so far (not just
 * the chunk) so callers can set state directly. Resolves to the full reply.
 */
export async function streamCompanion(
  path: "/api/whisper" | "/api/aurora",
  body: { lang: Lang; messages: ChatMessage[]; context: CompanionContext; mode?: "summarize" },
  onDelta: (textSoFar: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new AiUnavailableError("network");
  }
  if (!res.ok || !res.body) throw new AiUnavailableError(await reasonFrom(res));

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onDelta(text);
  }
  text += decoder.decode();
  const trimmed = text.trim();
  if (!trimmed) throw new AiUnavailableError("empty");
  onDelta(trimmed);
  return trimmed;
}

export interface ReflectionResult {
  reflection: string;
  standout: string | null;
  emotionKey: Memory["emotionKey"] & string;
  intensity: NonNullable<Memory["intensity"]>;
  confidence: number;
  topics: string[];
  people: string[];
}

/** Asks the server to turn a finished conversation into one memory. */
export async function requestReflection(lang: Lang, messages: ChatMessage[]): Promise<ReflectionResult> {
  let res: Response;
  try {
    res = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, messages }),
    });
  } catch {
    throw new AiUnavailableError("network");
  }
  if (!res.ok) throw new AiUnavailableError(await reasonFrom(res));
  const data = (await res.json()) as Partial<ReflectionResult>;
  if (typeof data.reflection !== "string" || typeof data.emotionKey !== "string") {
    throw new AiUnavailableError("malformed");
  }
  return {
    reflection: data.reflection,
    standout: typeof data.standout === "string" ? data.standout : null,
    emotionKey: data.emotionKey,
    intensity: data.intensity ?? "medium",
    confidence: typeof data.confidence === "number" ? data.confidence : 0.7,
    topics: Array.isArray(data.topics) ? data.topics : [],
    people: Array.isArray(data.people) ? data.people : [],
  };
}
