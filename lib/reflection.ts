import type { Lang } from "@/lib/i18n";
import type { EmotionKey, Intensity } from "@/lib/emotions";

export interface GeneratedReflection {
  reflection: string;
  standout: string | null;
  emotion: string;
  emotionKey: EmotionKey;
  intensity: Intensity;
  confidence: number;
  topics: string[];
  people: string[];
}

/**
 * Stands in for the real AI pipeline (see docs/11-product-prd.md §2.3).
 * Everything here is genuine, simple text analysis — word frequency, keyword
 * matching — not a real understanding of what was said. It is deliberately
 * kept honest about that: confidence and intensity are derived from how many
 * real keyword matches supported the detection, not fabricated numbers.
 */

const STOPWORDS_VI = new Set([
  "và", "là", "của", "có", "không", "một", "những", "cho", "với", "này",
  "đã", "rất", "mình", "tôi", "bạn", "thì", "cũng", "vậy", "nên", "nữa",
  "ra", "đi", "lại", "về", "được", "như", "khi", "nếu", "nhưng", "the",
  "hôm", "nay", "là", "để", "mà", "còn", "sẽ", "đang", "đó", "gì", "ở",
]);

const STOPWORDS_EN = new Set([
  "the", "and", "a", "to", "of", "in", "is", "it", "that", "i", "you",
  "was", "for", "on", "with", "as", "be", "this", "have", "not", "are",
  "but", "my", "me", "so", "just", "at", "an", "or", "if", "we", "do",
]);

// internal bucket -> fixed emotion taxonomy key (see lib/emotions.ts)
const EMOTION_KEY_BY_BUCKET: Record<string, EmotionKey> = {
  "kiệt sức": "overwhelmed",
  exhausted: "overwhelmed",
  "buồn bã": "sad",
  sad: "sad",
  "lo lắng": "anxious",
  anxious: "anxious",
  "cô đơn": "sad",
  lonely: "sad",
  "khó chịu": "frustrated",
  frustrated: "frustrated",
  "nhẹ nhõm": "calm",
  relieved: "calm",
};

const EMOTION_KEYWORDS_VI: Array<[string[], string]> = [
  [["mệt", "mệt mỏi", "kiệt sức"], "kiệt sức"],
  [["buồn", "buồn bã"], "buồn bã"],
  [["lo", "lo lắng", "lo âu"], "lo lắng"],
  [["cô đơn", "một mình"], "cô đơn"],
  [["tức", "giận", "khó chịu"], "khó chịu"],
  [["vui", "hạnh phúc", "nhẹ nhõm"], "nhẹ nhõm"],
];

const EMOTION_KEYWORDS_EN: Array<[string[], string]> = [
  [["tired", "exhausted", "drained"], "exhausted"],
  [["sad", "down", "upset"], "sad"],
  [["anxious", "worried", "anxiety"], "anxious"],
  [["lonely", "alone"], "lonely"],
  [["angry", "frustrated", "annoyed"], "frustrated"],
  [["happy", "relieved", "good"], "relieved"],
];

const TOPIC_KEYWORDS_VI: Array<[string[], string]> = [
  [["công việc", "sếp", "đồng nghiệp", "deadline"], "công việc"],
  [["gia đình", "mẹ", "bố", "ba", "chị", "anh", "em"], "gia đình"],
  [["người yêu", "bạn trai", "bạn gái", "tình yêu", "chia tay"], "tình cảm"],
  [["sức khỏe", "ốm", "bệnh", "ngủ"], "sức khỏe"],
  [["tương lai", "dự định", "kế hoạch"], "tương lai"],
];

const TOPIC_KEYWORDS_EN: Array<[string[], string]> = [
  [["work", "job", "boss", "deadline", "coworker"], "work"],
  [["family", "mom", "dad", "sister", "brother", "parents"], "family"],
  [["relationship", "boyfriend", "girlfriend", "breakup", "partner"], "relationship"],
  [["health", "sick", "sleep", "tired"], "health"],
  [["future", "plan", "planning"], "future"],
];

const PEOPLE_KEYWORDS_VI = ["mẹ", "bố", "ba", "chị", "anh", "em", "bạn thân", "sếp", "đồng nghiệp", "người yêu"];
const PEOPLE_KEYWORDS_EN = ["mom", "dad", "sister", "brother", "friend", "boss", "coworker", "partner"];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function findStandoutWord(text: string, lang: Lang): string | null {
  const stopwords = lang === "vi" ? STOPWORDS_VI : STOPWORDS_EN;
  const counts = new Map<string, number>();
  for (const word of tokenize(text)) {
    if (word.length < 2 || stopwords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 1;
  for (const [word, count] of counts) {
    if (count > bestCount) {
      best = word;
      bestCount = count;
    }
  }
  return best;
}

interface KeywordMatch {
  label: string;
  matchedKeywordCount: number;
}

/** Returns each matching bucket's label plus how many of its own keywords actually matched — the real signal behind confidence/intensity. */
function matchKeywordsWithStrength(
  text: string,
  table: Array<[string[], string]>,
): KeywordMatch[] {
  const lower = text.toLowerCase();
  const matches: KeywordMatch[] = [];
  for (const [keywords, label] of table) {
    const matchedKeywordCount = keywords.filter((k) => lower.includes(k)).length;
    if (matchedKeywordCount > 0) matches.push({ label, matchedKeywordCount });
  }
  return matches;
}

const REFLECTION_LINES_VI: Record<string, string> = {
  "kiệt sức": "Có vẻ như hôm nay là một ngày nặng nề, và bạn đã một mình gánh khá nhiều thứ.",
  "buồn bã": "Điều bạn vừa chia sẻ nghe thật không dễ dàng.",
  "lo lắng": "Có vẻ như có điều gì đó cứ quanh quẩn trong đầu bạn mãi không thôi.",
  "cô đơn": "Nghe như bạn đã giữ điều này một mình khá lâu rồi.",
  "khó chịu": "Có vẻ như điều đó thực sự làm bạn khó chịu.",
  "nhẹ nhõm": "Nghe có vẻ như hôm nay nhẹ nhàng hơn một chút với bạn.",
  default: "Cảm ơn bạn đã dành thời gian nói ra điều này.",
};

const REFLECTION_LINES_EN: Record<string, string> = {
  exhausted: "Today sounds like it's been heavy, and you've been carrying a lot of it alone.",
  sad: "What you just shared doesn't sound easy.",
  anxious: "It sounds like something has been circling in your mind.",
  lonely: "It sounds like you've been holding this by yourself for a while.",
  frustrated: "That sounds like it really got to you.",
  relieved: "Today sounds like it was a little lighter.",
  default: "Thank you for taking the time to say this.",
};

const LISTENED_PREFIX_VI = "Mình đã lắng nghe hết rồi.";
const LISTENED_PREFIX_EN = "I've been listening. I heard everything.";
const CLOSING_VI = "Cảm ơn bạn đã tin tưởng chia sẻ điều này.";
const CLOSING_EN = "Thank you for trusting me with this.";

export function generateReflection(transcript: string, lang: Lang): GeneratedReflection {
  const emotionMatches = matchKeywordsWithStrength(
    transcript,
    lang === "vi" ? EMOTION_KEYWORDS_VI : EMOTION_KEYWORDS_EN,
  ).sort((a, b) => b.matchedKeywordCount - a.matchedKeywordCount);

  const topMatch = emotionMatches[0] ?? null;
  const emotion = topMatch?.label ?? (lang === "vi" ? "đang suy ngẫm" : "reflective");
  const emotionKey: EmotionKey = topMatch ? (EMOTION_KEY_BY_BUCKET[topMatch.label] ?? "neutral") : "neutral";

  // confidence/intensity are derived from real signal strength: how many of a
  // bucket's own keywords matched, never a fabricated number
  const strength = topMatch?.matchedKeywordCount ?? 0;
  const confidence = topMatch ? Math.min(0.55 + strength * 0.15, 0.92) : 0.45;
  const intensity: Intensity = strength >= 2 ? "high" : strength === 1 ? "medium" : "low";

  const topics = matchKeywordsWithStrength(transcript, lang === "vi" ? TOPIC_KEYWORDS_VI : TOPIC_KEYWORDS_EN).map(
    (m) => m.label,
  );
  if (topics.length === 0) topics.push(lang === "vi" ? "cuộc sống" : "life");

  const peopleList = lang === "vi" ? PEOPLE_KEYWORDS_VI : PEOPLE_KEYWORDS_EN;
  const lower = transcript.toLowerCase();
  const people = peopleList.filter((p) => lower.includes(p));

  const standoutWord = findStandoutWord(transcript, lang);
  const standout = standoutWord
    ? lang === "vi"
      ? `Bạn nhắc đến "${standoutWord}" vài lần. Có thể điều đó đáng để ý.`
      : `You mentioned "${standoutWord}" a few times. Maybe that's worth noticing.`
    : null;

  const lines = lang === "vi" ? REFLECTION_LINES_VI : REFLECTION_LINES_EN;
  const line = lines[emotion] ?? lines.default;
  const prefix = lang === "vi" ? LISTENED_PREFIX_VI : LISTENED_PREFIX_EN;
  const closing = lang === "vi" ? CLOSING_VI : CLOSING_EN;

  const reflection = [prefix, line, closing].join(" ");

  return { reflection, standout, emotion, emotionKey, intensity, confidence, topics, people };
}
