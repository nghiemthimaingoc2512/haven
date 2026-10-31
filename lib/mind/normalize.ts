/**
 * Text normalisation shared by the whole engine.
 *
 * Vietnamese is the hard part here: stripping tone marks merges unrelated
 * words ("rối"/"rồi", "nhớ"/"nhỏ", "má"/"mà", "đau"/"đâu"). So matching is
 * two-tier: a word the user typed WITH marks must match a term exactly; only
 * a word typed WITHOUT marks falls back to comparing bare forms - that keeps
 * "minh buon qua" working without "rồi" ever reading as "rối".
 */

const DIACRITIC_RE = /[̀-ͯ]/g;

export function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(DIACRITIC_RE, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/** Lower-cased, NFC, keeping tone marks; everything but letters/digits removed. */
export function cleanToken(word: string): string {
  return word
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

/** Tone-free form of a clean token. */
export function bareToken(token: string): string {
  return stripDiacritics(token);
}

export function hasMarks(token: string): boolean {
  return bareToken(token) !== token;
}

/**
 * Bare forms that are extremely common Vietnamese function words. Typed
 * without marks they are far more likely to be the function word than the
 * lexicon term ("roi" = rồi, not rối), so a lone untoned token never
 * matches a one-word term with this bare form. Multi-word terms still match.
 */
const AMBIGUOUS_BARE = new Set([
  "roi", "nho", "con", "thi", "ma", "nha", "da", "dau", "so", "hai", "vay", "mat",
  "an", "la", "co", "toi", "ban", "ba", "me", "bo", "em", "anh", "chi", "cay", "no",
  "tui", "lo", "gia", "mua", "ngu", "yeu", "chan", "mong", "tuc", "gian", "om", "run",
  "ha", "hay", "cha", "cau", "di", "cuoi", "tot", "thu", "cang", "nan", "duoc",
]);

/** Does a user token match one token of a lexicon term? */
export function tokenMatches(userToken: string, termToken: string, multiWordTerm: boolean): boolean {
  if (userToken === termToken) return true;
  if (hasMarks(userToken)) return false; // typed with marks: must be exact
  if (bareToken(termToken) !== userToken) return false;
  return multiWordTerm || !AMBIGUOUS_BARE.has(userToken);
}

export interface TokenizedText {
  words: string[]; // original spelling, outer punctuation trimmed
  tokens: string[]; // cleaned, aligned 1:1 with words
}

export function tokenizeText(text: string): TokenizedText {
  const words: string[] = [];
  const tokens: string[] = [];
  for (const raw of text.split(/\s+/)) {
    const token = cleanToken(raw);
    if (!token) continue;
    words.push(trimPunct(raw));
    tokens.push(token);
  }
  return { words, tokens };
}

/** A lexicon term split into clean tokens, ready for matching. */
export function termTokens(term: string): string[] {
  return term.split(/\s+/).map(cleanToken).filter(Boolean);
}

/** Start indexes where `term` occurs in `tokens`. */
export function findTermTokens(tokens: string[], term: string[]): number[] {
  const hits: number[] = [];
  if (term.length === 0) return hits;
  const multi = term.length > 1;
  for (let i = 0; i + term.length <= tokens.length; i++) {
    let ok = true;
    for (let j = 0; j < term.length; j++) {
      if (!tokenMatches(tokens[i + j], term[j], multi)) {
        ok = false;
        break;
      }
    }
    if (ok) hits.push(i);
  }
  return hits;
}

/** Whole-text convenience check used by template conditions. */
export function textHasTerm(text: string, term: string): boolean {
  return findTermTokens(tokenizeText(text).tokens, termTokens(term)).length > 0;
}

/** Splits on sentence punctuation and newlines, keeping the original text. */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Deterministic hash for stable-but-varied template picks. */
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/** Capitalises the first letter of the text and of every sentence inside it. */
export function capitalizeSentences(s: string): string {
  return s.replace(/(^|[.!?…]\s+)(["“]?)(\p{L})/gu, (_, lead: string, quote: string, ch: string) => `${lead}${quote}${ch.toUpperCase()}`);
}

/** Trims outer punctuation so a quoted fragment reads cleanly. */
export function trimPunct(s: string): string {
  return s.replace(/^[\s,.;:!?…"'“”()-]+|[\s,.;:!?…"'“”()-]+$/g, "");
}
