import type { Lang } from "@/lib/i18n";
import type { EmotionKey, Intensity } from "@/lib/emotions";
import { analyze, analyzeConversation } from "@/lib/mind/analyze";
import { KNOWLEDGE } from "@/lib/mind/knowledge";
import { STOPWORDS } from "@/lib/mind/lexicon";
import { bareToken, tokenizeText } from "@/lib/mind/normalize";
import { pick } from "@/lib/mind/template";

export interface GeneratedMemory {
  reflection: string;
  standout: string | null;
  emotion: EmotionKey;
  emotionKey: EmotionKey;
  intensity: Intensity;
  confidence: number;
  topics: string[];
  people: string[];
}

/** The content word repeated most across the conversation, if any repeats at all. */
function repeatedWord(text: string, lang: Lang): string | null {
  const counts = new Map<string, { count: number; word: string }>();
  const { tokens, words } = tokenizeText(text);
  tokens.forEach((tok, i) => {
    const bare = bareToken(tok);
    if (bare.length < 3 || STOPWORDS[lang].has(bare)) return;
    const cur = counts.get(bare) ?? { count: 0, word: words[i].toLowerCase() };
    cur.count += 1;
    counts.set(bare, cur);
  });
  let best: { count: number; word: string } | null = null;
  for (const c of counts.values()) if (c.count >= 3 && (!best || c.count > best.count)) best = c;
  return best?.word ?? null;
}

/** Turns a finished conversation into the one memory that gets saved. */
export function generateMemory(userMessages: string[], lang: Lang): GeneratedMemory {
  const kb = KNOWLEDGE[lang];
  const conversationText = userMessages.join("\n");
  const a = analyzeConversation(userMessages, lang);
  const slots = {
    detail: a.detail,
    quote: a.quote,
    person: a.people[0] ?? null,
    phrase: repeatedWord(conversationText, lang),
  };
  const opts = { slots, conversationText, used: [] as string[], seed: conversationText };

  const withDetail = { heavy: kb.reflect.heavy, light: kb.reflect.light, neutral: kb.reflect.neutral }[a.register];
  const plain = { heavy: kb.reflect.heavyPlain, light: kb.reflect.lightPlain, neutral: kb.reflect.neutralPlain }[a.register];
  const lastTurn = analyze(userMessages[userMessages.length - 1] ?? "", lang);
  const endedLighter = a.register === "heavy" && lastTurn.intents.has("feel_better");
  const reflection = [pick(withDetail, opts) ?? pick(plain, opts) ?? plain[0], endedLighter ? kb.reflect.endedLighter[0] : null]
    .filter(Boolean)
    .join(" ");

  // Standout must add something: a real repetition, the central person, or
  // (only with enough material) a line they said that the reflection didn't use.
  const standout =
    (slots.phrase ? pick(kb.reflect.standoutRepeat, opts) : null) ??
    (slots.person && userMessages.length >= 2 ? pick(kb.reflect.standoutPerson, opts) : null) ??
    (a.quote && userMessages.length >= 3 ? pick(kb.reflect.standoutQuote, opts) : null);

  const topics = a.topics
    .filter((t) => t.key !== "daily" || a.topics.length === 1)
    .slice(0, 3)
    .map((t) => kb.topics[t.key].label);
  if (topics.length === 0) topics.push(kb.reflect.fallbackTopic);

  return {
    reflection,
    standout,
    emotion: a.primaryEmotion,
    emotionKey: a.primaryEmotion,
    intensity: a.intensity,
    confidence: a.confidence,
    topics,
    people: a.people,
  };
}
