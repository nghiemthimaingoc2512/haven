import type { Lang } from "@/lib/i18n";
import type { EmotionKey, Intensity } from "@/lib/emotions";
import {
  DIMINISHERS,
  EMOTION_LEXICON,
  INTENSIFIERS,
  INTENT_LEXICON,
  NEGATORS,
  PEOPLE_LEXICON,
  PRONOUN_FLIPS,
  QUESTION_MARKERS,
  STOPWORDS,
  TOPIC_LEXICON,
  type IntentKey,
  type TopicKey,
} from "@/lib/mind/lexicon";
import {
  bareToken,
  findTermTokens,
  splitSentences,
  termTokens,
  tokenizeText,
  trimPunct,
  type TokenizedText,
} from "@/lib/mind/normalize";

/**
 * Turns one message into everything the dialogue engines need: scored
 * emotions with evidence, topics, people, intents, and a sentence worth
 * echoing back. The output is explainable: every score points at the words
 * that produced it.
 */

export type Register = "heavy" | "light" | "neutral";

export interface Scored<K extends string> {
  key: K;
  score: number;
  /** The user's own words (original spelling) that produced the score. */
  evidence: string[];
}

export interface Analysis {
  lang: Lang;
  text: string;
  sentences: string[];
  wordCount: number;
  emotions: Scored<EmotionKey>[];
  primaryEmotion: EmotionKey;
  intensity: Intensity;
  confidence: number;
  register: Register;
  topics: Scored<TopicKey>[];
  primaryTopic: TopicKey | null;
  people: string[];
  intents: Set<IntentKey>;
  isQuestion: boolean;
  decision: { a: string; b: string } | null;
  /** The most charged statement, flipped to "bạn/you" and ready to embed. Never truncated. */
  detail: string | null;
  /** The same statement in the user's own words, for quoting. */
  quote: string | null;
  /** A short phrase in the user's own words. */
  keyPhrase: string | null;
}

const HEAVY: Set<EmotionKey> = new Set(["sad", "anxious", "worried", "frustrated", "angry", "overwhelmed"]);
const LIGHT: Set<EmotionKey> = new Set(["happy", "calm", "peaceful", "hopeful", "inspired"]);

// What "not X" means where a negation still carries signal.
const NEGATED_AS: Partial<Record<EmotionKey, [EmotionKey, number]>> = {
  happy: ["sad", 0.6],
  calm: ["anxious", 0.5],
  peaceful: ["anxious", 0.4],
  sad: ["calm", 0.4],
  anxious: ["calm", 0.4],
  worried: ["calm", 0.3],
};

/** Which topic a mentioned person belongs to - also keeps {person} on topic in templates. */
export const PEOPLE_TOPIC: Record<string, TopicKey> = {
  "sếp": "work", "đồng nghiệp": "work", "khách hàng": "work",
  "mẹ": "family", "bố": "family", "bố mẹ": "family", "chồng": "family", "vợ": "family", "anh trai": "family", "chị gái": "family", "em": "family", "con": "family",
  "người yêu": "love",
  "bạn thân": "friends", "bạn": "friends", "bạn cùng phòng": "friends",
  "thầy cô": "study",
  "bác sĩ": "health",
  "your boss": "work", "your coworkers": "work", "a client": "work",
  "your mom": "family", "your dad": "family", "your parents": "family", "your husband": "family", "your wife": "family", "your brother": "family", "your sister": "family", "your kids": "family",
  "your partner": "love",
  "your best friend": "friends", "your friends": "friends", "your roommate": "friends",
  "your teacher": "study",
  "the doctor": "health",
};

// "mệt muốn chết" / "đói muốn chết" is everyday hyperbole, not a crisis. "buồn"
// is deliberately NOT here: when in doubt the engine takes it seriously.
const HYPERBOLE_BEFORE_DIE = new Set(["met", "doi", "nong", "lanh", "khat", "vui", "cuoi", "ngon", "so", "chan", "ngan", "tuc", "nho", "dau", "thich", "ngai", "hoi"]);

interface CompiledEntry<K extends string> {
  key: K;
  tokens: string[];
  weight: number;
}

function compile<K extends string>(entries: Array<{ key: K; terms: string[]; weight?: number }>): CompiledEntry<K>[] {
  const out: CompiledEntry<K>[] = [];
  for (const e of entries) {
    for (const term of e.terms) {
      const tokens = termTokens(term);
      if (tokens.length) out.push({ key: e.key, tokens, weight: e.weight ?? 1 });
    }
  }
  // Longest first, so an overlap resolves to the most specific term.
  return out.sort((a, b) => b.tokens.length - a.tokens.length);
}

const compiledCache = new Map<unknown, unknown>();
function compiled<K extends string>(entries: Array<{ key: K; terms: string[]; weight?: number }>): CompiledEntry<K>[] {
  let c = compiledCache.get(entries) as CompiledEntry<K>[] | undefined;
  if (!c) {
    c = compile(entries);
    compiledCache.set(entries, c);
  }
  return c;
}

function windowHas(tokens: string[], from: number, to: number, list: string[]): boolean {
  const lo = Math.max(0, from);
  const slice = tokens.slice(lo, Math.min(tokens.length, to));
  return list.some((term) => findTermTokens(slice, termTokens(term)).length > 0);
}

function scan<K extends string>(
  sentences: TokenizedText[],
  entries: Array<{ key: K; terms: string[]; weight?: number }>,
  lang: Lang,
  emotional: boolean,
): Map<K, Scored<K>> {
  const result = new Map<K, Scored<K>>();
  const add = (key: K, delta: number, evidence: string) => {
    const cur = result.get(key) ?? { key, score: 0, evidence: [] };
    cur.score += delta;
    if (evidence && !cur.evidence.includes(evidence)) cur.evidence.push(evidence);
    result.set(key, cur);
  };

  for (const s of sentences) {
    const covered = new Array<boolean>(s.tokens.length).fill(false);
    for (const { key, tokens, weight } of compiled(entries)) {
      for (const start of findTermTokens(s.tokens, tokens)) {
        const end = start + tokens.length;
        if (covered.slice(start, end).some(Boolean)) continue;
        covered.fill(true, start, end);

        const phrase = s.words.slice(start, end).join(" ");
        let delta = weight * (1 + 0.15 * (tokens.length - 1));

        if (emotional) {
          // Two tokens back: "không buồn" flips, "không biết sao buồn" doesn't.
          if (windowHas(s.tokens, start - 2, start, NEGATORS[lang])) {
            const flip = NEGATED_AS[key as unknown as EmotionKey];
            if (flip) add(flip[0] as unknown as K, flip[1] * weight, phrase);
            continue;
          }
          const intensified =
            windowHas(s.tokens, start - 2, start, INTENSIFIERS[lang]) ||
            windowHas(s.tokens, end, end + 2, INTENSIFIERS[lang]);
          const diminished =
            windowHas(s.tokens, start - 2, start, DIMINISHERS[lang]) ||
            windowHas(s.tokens, end, end + 2, DIMINISHERS[lang]);
          if (intensified) delta *= 1.6;
          else if (diminished) delta *= 0.6;
        }
        add(key, delta, phrase);
      }
    }
  }
  return result;
}

function isCrisis(sentences: TokenizedText[], lang: Lang): boolean {
  for (const s of sentences) {
    for (const { key, tokens } of compiled(INTENT_LEXICON[lang])) {
      if (key !== "crisis") continue;
      for (const start of findTermTokens(s.tokens, tokens)) {
        const isDieIdiom = lang === "vi" && tokens.join(" ") === "muốn chết";
        const prev = start > 0 ? bareToken(s.tokens[start - 1]) : "";
        if (!(isDieIdiom && HYPERBOLE_BEFORE_DIE.has(prev))) return true;
      }
    }
  }
  return false;
}

function flipPronouns(text: string, lang: Lang): string {
  let out = text;
  for (const [re, rep] of PRONOUN_FLIPS[lang]) out = out.replace(re, rep);
  return out;
}

function wordCountOf(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function detectDecision(text: string, lang: Lang): { a: string; b: string } | null {
  const parts = lang === "vi" ? text.split(/\s+hay\s+là\s+|\s+hay\s+(?!là\s)/i) : text.split(/\s+or\s+/i);
  if (parts.length !== 2) return null;
  // "A không? Hay là B": the split leaves punctuation at the end of the left side.
  const left = trimPunct(parts[0].split(/[,.;:!?]/).map((x) => x.trim()).filter(Boolean).pop() ?? "");
  const right = trimPunct(parts[1].split(/[,.;:!?]/)[0] ?? "");
  // Strip the lead-in so the options read as choices rather than clauses.
  const a = trimPunct(left.replace(/^.*?\b(nên|should i|should|whether to|whether i)\s+/i, "").replace(/\s*(không|nhỉ|nhé)\s*$/i, ""));
  const b = trimPunct(right.replace(/\s*(không|nhỉ|nhé)\s*$/i, "").replace(/^(là|nên|should i)\s+/i, ""));
  const wa = wordCountOf(a);
  const wb = wordCountOf(b);
  if (!a || !b || wa > 10 || wb > 10) return null;
  // "hay" also means "often" ("hay trì hoãn"), so Vietnamese needs a phrase on both sides.
  if (lang === "vi" && (wa < 2 || wb < 2)) return null;
  return { a, b };
}

/**
 * The clause carrying the most emotion, among statements only - echoing a
 * question back ("bạn có nên...") reads wrong. Returns null rather than
 * truncating: a cut-off echo looks far more broken than no echo at all.
 */
function pickEchoClause(sentences: string[], lang: Lang): string | null {
  let best: string | null = null;
  let bestScore = -1;
  for (const sentence of sentences) {
    if (/\?\s*$/.test(sentence)) continue;
    for (const raw of sentence.split(/,\s+|;\s+|\s+-\s+/)) {
      const clause = trimPunct(raw);
      const wc = wordCountOf(clause);
      if (wc < 3 || wc > 18) continue;
      const toks = tokenizeText(clause);
      const emo = scan([toks], EMOTION_LEXICON[lang], lang, true);
      const topic = scan([toks], TOPIC_LEXICON[lang], lang, false);
      const people = scan([toks], PEOPLE_LEXICON[lang].map((p) => ({ key: p.label, terms: p.terms })), lang, false);
      const score =
        [...emo.values()].reduce((n, e) => n + e.score, 0) * 2 +
        [...topic.values()].reduce((n, e) => n + e.score, 0) * 0.5 +
        people.size +
        wc * 0.02;
      if (score > bestScore) {
        bestScore = score;
        best = clause;
      }
    }
  }
  return best;
}

const knownTokens: Partial<Record<Lang, Set<string>>> = {};
function isKnownWord(token: string, lang: Lang): boolean {
  let known = knownTokens[lang];
  if (!known) {
    known = new Set(STOPWORDS[lang]);
    const add = (terms: string[]) => {
      for (const t of terms) for (const tok of termTokens(t)) known!.add(bareToken(tok));
    };
    for (const e of EMOTION_LEXICON[lang]) add(e.terms);
    for (const e of TOPIC_LEXICON[lang]) add(e.terms);
    for (const e of PEOPLE_LEXICON[lang]) add(e.terms);
    knownTokens[lang] = known;
  }
  return known.has(bareToken(token));
}

/** Lower-cases the first letter for embedding mid-sentence, unless it looks like a name ("Linh giận..."). */
function embedForm(clause: string, lang: Lang): string {
  const first = clause.split(/\s+/)[0] ?? "";
  if (!first) return clause;
  if (lang === "en" && first === "you") return clause;
  const token = first.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  return isKnownWord(token, lang) ? clause.charAt(0).toLowerCase() + clause.slice(1) : clause;
}

export function analyze(text: string, lang: Lang): Analysis {
  const sentences = splitSentences(text);
  // Clauses, not sentences: "buồn lắm, không dám nói" must not let "lắm" boost "không dám".
  const tokenized = sentences.flatMap((s) => s.split(/[,;]\s+/)).map(tokenizeText);
  const wordCount = tokenized.reduce((n, s) => n + s.words.length, 0);

  const emotionMap = scan(tokenized, EMOTION_LEXICON[lang], lang, true);
  const emotions = [...emotionMap.values()].sort((a, b) => b.score - a.score);
  const top = emotions[0] ?? null;
  const second = emotions[1] ?? null;

  const intentMap = scan(tokenized, INTENT_LEXICON[lang], lang, false);
  const intents = new Set<IntentKey>(intentMap.keys());
  intents.delete("crisis");
  if (isCrisis(tokenized, lang)) intents.add("crisis");

  const trimmed = text.trim();
  const isQuestion =
    /[?？]\s*$/.test(trimmed) ||
    tokenized.some((s) => QUESTION_MARKERS[lang].some((m) => findTermTokens(s.tokens, termTokens(m)).length > 0));
  if (isQuestion) intents.add("question");

  const decision = detectDecision(text, lang);
  if (decision && (isQuestion || intents.has("ask_advice"))) intents.add("decision");
  const realDecision = intents.has("decision") ? decision : null;

  // A greeting only counts when the message is basically just a greeting.
  if (intents.has("greeting") && wordCount > 5) intents.delete("greeting");

  let primaryEmotion: EmotionKey = top && top.score >= 0.5 ? top.key : "neutral";
  if (primaryEmotion === "neutral" && intents.has("good_news")) primaryEmotion = "happy";
  const topScore = top?.score ?? 0;
  const intensity: Intensity = topScore >= 2.2 ? "high" : topScore >= 1 ? "medium" : "low";
  const margin = top && second ? Math.min(1, (top.score - second.score) / top.score) : 1;
  const evidenceCount = top?.evidence.length ?? 0;
  const confidence =
    primaryEmotion === "neutral" ? 0.4 : Math.min(0.9, 0.45 + evidenceCount * 0.12 + margin * 0.15);
  const register: Register = HEAVY.has(primaryEmotion) ? "heavy" : LIGHT.has(primaryEmotion) ? "light" : "neutral";
  if (register === "heavy" && !isQuestion) intents.add("venting");

  const peopleMap = scan(tokenized, PEOPLE_LEXICON[lang].map((p) => ({ key: p.label, terms: p.terms })), lang, false);
  const people = [...peopleMap.values()].sort((a, b) => b.score - a.score).map((p) => p.key);

  const topicMap = scan(tokenized, TOPIC_LEXICON[lang], lang, false);
  for (const person of people) {
    const topic = PEOPLE_TOPIC[person];
    if (!topic) continue;
    const cur = topicMap.get(topic) ?? { key: topic, score: 0, evidence: [] };
    cur.score += 0.8;
    topicMap.set(topic, cur);
  }
  const daily = topicMap.get("daily");
  if (daily) daily.score *= 0.4; // "hôm nay", "ăn" are weak on their own
  const topics = [...topicMap.values()].filter((t) => t.score >= 0.4).sort((a, b) => b.score - a.score);
  const primaryTopic = topics[0]?.key ?? null;

  const quote = pickEchoClause(sentences, lang);
  const detail = quote ? embedForm(flipPronouns(quote, lang), lang) : null;

  // An emotion word makes a useless echo ("Mệt - kể thêm đi?"); the question should be about what caused it.
  const emotionWords = new Set(emotions.flatMap((e) => e.evidence).flatMap((p) => tokenizeText(p).tokens.map(bareToken)));
  let keyPhrase: string | null = null;
  const topicEvidence = topics.find((t) => t.key !== "daily" && t.evidence.length > 0)?.evidence[0];
  if (topicEvidence) keyPhrase = topicEvidence;
  if (!keyPhrase) {
    let best = "";
    for (const s of tokenized) {
      s.tokens.forEach((tok, i) => {
        if (tok.length >= 3 && !STOPWORDS[lang].has(bareToken(tok)) && !emotionWords.has(bareToken(tok)) && s.words[i].length > best.length) best = s.words[i];
      });
    }
    keyPhrase = best || null;
  }
  if (keyPhrase) keyPhrase = trimPunct(keyPhrase.toLowerCase());

  return {
    lang,
    text,
    sentences,
    wordCount,
    emotions,
    primaryEmotion,
    intensity,
    confidence,
    register,
    topics,
    primaryTopic,
    people,
    intents,
    isQuestion,
    decision: realDecision,
    detail,
    quote,
    keyPhrase,
  };
}

/** A short thanks / goodbye / "I feel better" / hello, carrying nothing heavy of its own. */
export function isSocialTurn(a: Analysis): boolean {
  const social = a.intents.has("thanks") || a.intents.has("closing") || a.intents.has("feel_better") || a.intents.has("greeting");
  return social && a.wordCount <= 14 && !(a.register === "heavy" && a.intensity !== "low");
}

/** One picture of a whole conversation; later turns weigh a little more, since people move on. */
export function analyzeConversation(allMessages: string[], lang: Lang): Analysis {
  // "ok cảm ơn, đỡ hơn rồi" closes a conversation; it doesn't describe it. Left
  // in, it turns a day of being blamed unfairly into a memory labelled "calm".
  const substantive = allMessages.filter((m) => !isSocialTurn(analyze(m, lang)));
  const userMessages = substantive.length > 0 ? substantive : allMessages;
  const merged = analyze(userMessages.join("\n"), lang);
  if (userMessages.length < 2) return merged;
  const perTurn = userMessages.map((m) => analyze(m, lang));
  const weighted = new Map<EmotionKey, number>();
  perTurn.forEach((a, i) => {
    const w = 0.6 + (0.4 * i) / (perTurn.length - 1);
    for (const e of a.emotions) weighted.set(e.key, (weighted.get(e.key) ?? 0) + e.score * w);
  });
  merged.emotions = merged.emotions
    .map((e) => ({ ...e, score: weighted.get(e.key) ?? e.score }))
    .sort((a, b) => b.score - a.score);
  const top = merged.emotions[0];
  if (top && top.score >= 0.5) {
    merged.primaryEmotion = top.key;
    merged.register = HEAVY.has(top.key) ? "heavy" : LIGHT.has(top.key) ? "light" : "neutral";
    merged.intensity = top.score >= 3 ? "high" : top.score >= 1.3 ? "medium" : "low";
    merged.confidence = Math.min(0.9, 0.45 + top.evidence.length * 0.1);
  }
  return merged;
}
