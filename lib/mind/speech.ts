import type { Lang } from "@/lib/i18n";
import { STOPWORDS } from "@/lib/mind/lexicon";
import { bareToken, cleanToken } from "@/lib/mind/normalize";

/**
 * Repairs what the browser's speech recognizer hears. Web Speech listens in a
 * single language, so an English word inside a Vietnamese sentence comes back
 * as whatever Vietnamese syllables sound closest ("Product Owner" -> "có đáp
 * un"). We can't change what it hears, only fix the text afterwards:
 *
 *  1. what this person has corrected before (learned, kept on their device)
 *  2. known mishearings, the ambiguous ones gated on context so that a real
 *     "bill" (hoá đơn) stays a bill
 *  3. among the recognizer's alternatives, prefer one that makes more sense
 *
 * The built-in list can only hold what we've thought of, so learning is what
 * actually covers an individual's accent and vocabulary.
 */

interface SpeechRule {
  heard: string[];
  to: string;
  /** Only when the sentence is about building/tech. */
  tech?: boolean;
  /** Only right after one of these words. */
  after?: string[];
}

const TECH_CONTEXT = [
  "xây dựng", "sản phẩm", "ứng dụng", "phần mềm", "app", "code", "lập trình", "website", "web",
  "công nghệ", "tính năng", "công cụ", "tool", "test", "deploy", "dự án", "startup", "server", "model", "chatbot", "game",
];

// "bill", "ai" are real words, hence the gates. The multi-word ones are
// nonsense in Vietnamese, so matching them is safe without context.
const RULES_VI: SpeechRule[] = [
  { heard: ["có đáp un", "có đắp un", "cót đáp un", "pro đắc ao nơ", "prô đắc ao nơ", "product ao nơ", "pro đắc ô nơ", "product ô nơ"], to: "Product Owner" },
  { heard: ["pro đắc men nơ", "prô đắc men nơ", "product men nơ", "pro đắc ma nơ giơ", "product ma nơ giơ"], to: "Product Manager" },
  { heard: ["aiibull", "aibull", "ai bull"], to: "AI build", tech: true },
  { heard: ["bill", "biu", "bin", "bưu"], to: "build", tech: true },
  { heard: ["ai"], to: "AI", tech: true, after: ["bằng", "dùng", "về", "công cụ", "app", "mô hình", "ứng dụng", "sản phẩm"] },
  { heard: ["đét lai", "đết lai", "đẹt lai"], to: "deadline" },
  { heard: ["phít bách", "phi bách", "phít bắc"], to: "feedback" },
  { heard: ["đi ploi", "đi bloi", "đi plôi"], to: "deploy", tech: true },
  { heard: ["mắc két tinh", "mác két tinh"], to: "marketing" },
  { heard: ["kê pi ai", "ca pê i"], to: "KPI" },
  { heard: ["lít đờ", "lít đơ"], to: "leader" },
  { heard: ["on lai"], to: "online" },
  { heard: ["ốp lai"], to: "offline" },
  { heard: ["tét"], to: "test", tech: true },
];

const RULES: Record<Lang, SpeechRule[]> = { vi: RULES_VI, en: [] };

/** Words that make an alternative more plausible than the recognizer's top pick. */
const PLAUSIBLE_TERMS = ["build", "ai", "product", "owner", "manager", "deadline", "feedback", "deploy", "marketing", "kpi", "leader", "team", "app", "test", "project", "design", "code"];

export interface LearnedEntry {
  to: string;
  count: number;
}
export type LearnedMap = Record<string, LearnedEntry>;

function tokensOf(s: string): string[] {
  return s.split(/\s+/).filter(Boolean);
}

function keyOf(words: string[]): string {
  return words.map(cleanToken).join(" ");
}

function hasContext(tokens: string[]): boolean {
  const joined = ` ${tokens.join(" ")} `;
  return TECH_CONTEXT.some((t) => joined.includes(` ${t} `));
}

/** Replaces `heard` with `to` across the words, keeping punctuation and a leading capital. */
function replacePhrase(words: string[], heard: string[], to: string, accept: (i: number) => boolean): string[] {
  const out: string[] = [];
  for (let i = 0; i < words.length; ) {
    const window = words.slice(i, i + heard.length);
    if (window.length === heard.length && window.every((w, j) => cleanToken(w) === heard[j]) && accept(i)) {
      const first = window[0];
      const trailing = /[^\p{L}\p{N}]+$/u.exec(window[window.length - 1])?.[0] ?? "";
      const startsUpper = first.charAt(0) !== first.charAt(0).toLowerCase();
      out.push((startsUpper ? to.charAt(0).toUpperCase() + to.slice(1) : to) + trailing);
      i += heard.length;
    } else {
      out.push(words[i]);
      i += 1;
    }
  }
  return out;
}

function isActive(entry: LearnedEntry, key: string): boolean {
  return entry.count >= needsConfirmations(key, entry.to);
}

/** Applies learned corrections, then the built-in rules. */
export function correctTranscript(text: string, lang: Lang, learned: LearnedMap = {}): string {
  let words = tokensOf(text);
  if (words.length === 0) return text.trim();

  const entries = Object.entries(learned).sort((a, b) => b[0].split(" ").length - a[0].split(" ").length);
  for (const [key, entry] of entries) {
    if (isActive(entry, key)) words = replacePhrase(words, key.split(" "), entry.to, () => true);
  }

  const contextual = hasContext(words.map(cleanToken));
  for (const rule of RULES[lang]) {
    if (rule.tech && !contextual) continue;
    for (const phrase of rule.heard) {
      const heard = phrase.split(" ").map(cleanToken);
      const input = words;
      words = replacePhrase(input, heard, rule.to, (i) => {
        if (!rule.after) return true;
        return rule.after.some((a) => {
          const parts = a.split(" ").map(cleanToken);
          const prev = input.slice(Math.max(0, i - parts.length), i).map(cleanToken);
          return prev.length === parts.length && parts.every((p, k) => prev[k] === p);
        });
      });
    }
  }
  return words.join(" ");
}

/** Chooses among the recognizer's alternatives, keeping its top pick unless another is clearly more plausible. */
export function pickBestTranscript(alternatives: string[], lang: Lang, learned: LearnedMap = {}): string {
  const fixed = alternatives.map((a) => a.trim()).filter(Boolean).map((a) => correctTranscript(a, lang, learned));
  if (fixed.length === 0) return "";
  const score = (s: string) => {
    const toks = tokensOf(s).map(cleanToken);
    return toks.filter((t) => PLAUSIBLE_TERMS.includes(t)).length;
  };
  let best = 0;
  for (let i = 1; i < fixed.length; i++) if (score(fixed[i]) > score(fixed[best])) best = i;
  return fixed[best];
}

// --- learning from what the person corrects ----------------------------------

function similarity(a: string, b: string): number {
  const x = bareToken(a.toLowerCase());
  const y = bareToken(b.toLowerCase());
  const longest = Math.max(x.length, y.length);
  if (longest === 0) return 1;
  let prev = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i++) {
    const cur = [i];
    for (let j = 1; j <= y.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return 1 - prev[y.length] / longest;
}

/**
 * How many times a fix must be seen before it's applied. People also edit to
 * change what they MEANT ("buồn" -> "vui"), and that must never become a rule
 * that rewrites their feelings. So only a fix that sounds alike, or a term
 * deliberately typed with capitals, counts the first time; anything else has
 * to be repeated.
 */
function needsConfirmations(key: string, to: string): number {
  if (similarity(key, to) >= 0.5) return 1;
  const words = tokensOf(to);
  if (words.every((w) => /^[A-Z][A-Za-z0-9]*$/.test(w))) return 1;
  return 2;
}

interface Hunk {
  heard: string[];
  to: string[];
}

/** Word-level diff: the changed stretches between what was heard and what was kept. */
function diffHunks(before: string[], after: string[]): Hunk[] {
  const a = before.map(cleanToken);
  const b = after.map(cleanToken);
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const hunks: Hunk[] = [];
  let cur: Hunk | null = null;
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      if (cur) hunks.push(cur);
      cur = null;
      i += 1;
      j += 1;
    } else {
      cur ??= { heard: [], to: [] };
      if (j < b.length && (i === a.length || lcs[i][j + 1] >= lcs[i + 1][j])) {
        cur.to.push(after[j]);
        j += 1;
      } else {
        cur.heard.push(before[i]);
        i += 1;
      }
    }
  }
  if (cur) hunks.push(cur);
  return hunks;
}

const MAX_WORDS = 200;
const MAX_LEARNED = 200;

/** Records the corrections between the voice transcript and what they kept. Pure: returns a new map. */
export function learnFromEdit(heardText: string, keptText: string, lang: Lang, learned: LearnedMap): LearnedMap {
  const before = tokensOf(heardText);
  const after = tokensOf(keptText);
  if (before.length === 0 || after.length === 0 || before.length > MAX_WORDS || after.length > MAX_WORDS) return learned;

  // A rewrite isn't a correction: most of the sentence has to have survived.
  const hunks = diffHunks(before, after);
  const changed = hunks.reduce((n, h) => n + h.heard.length, 0);
  if (changed / before.length > 0.5) return learned;

  const next: LearnedMap = { ...learned };
  for (const { heard, to } of hunks) {
    if (heard.length === 0 || to.length === 0 || heard.length > 5 || to.length > 5) continue;
    const key = keyOf(heard);
    if (heard.length === 1 && STOPWORDS[lang].has(bareToken(cleanToken(heard[0])))) continue;
    const value = to.map((w) => w.replace(/^[,.;:!?…]+|[,.;:!?…]+$/g, "")).join(" ");
    if (!key.trim() || !value || keyOf(tokensOf(value)) === key) continue;
    const prior = next[key];
    next[key] = { to: value, count: prior && prior.to === value ? prior.count + 1 : 1 };
  }
  const keys = Object.keys(next);
  if (keys.length > MAX_LEARNED) for (const k of keys.slice(0, keys.length - MAX_LEARNED)) delete next[k];
  return next;
}

// --- storage, on this device only ---------------------------------------------

const STORAGE_KEY = "haven:speech:learned:v1";

export function readLearned(lang: Lang): LearnedMap {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY}:${lang}`);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as LearnedMap) : {};
  } catch {
    return {};
  }
}

export function writeLearned(lang: Lang, learned: LearnedMap): void {
  try {
    window.localStorage.setItem(`${STORAGE_KEY}:${lang}`, JSON.stringify(learned));
  } catch {
    // storage full or unavailable - it just won't remember this one
  }
}

export function rememberEdit(heardText: string, keptText: string, lang: Lang): void {
  if (heardText.trim() === keptText.trim()) return;
  writeLearned(lang, learnFromEdit(heardText, keptText, lang, readLearned(lang)));
}

/** Corrections already in effect, for the Settings list. */
export function activeCorrections(learned: LearnedMap): Array<{ heard: string; to: string }> {
  return Object.entries(learned)
    .filter(([key, entry]) => isActive(entry, key))
    .map(([heard, entry]) => ({ heard, to: entry.to }));
}
