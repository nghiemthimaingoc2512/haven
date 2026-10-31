import type { Lang } from "@/lib/i18n";
import { analyze, PEOPLE_TOPIC, type Analysis } from "@/lib/mind/analyze";
import { KNOWLEDGE, type TopicKnowledge } from "@/lib/mind/knowledge";
import type { TopicKey } from "@/lib/mind/lexicon";
import { pick, type Slots } from "@/lib/mind/template";

export interface Turn {
  role: "user" | "assistant";
  content: string;
}

export interface MindContext {
  name?: string;
  /** Topic labels of recent saved memories, newest first. */
  pastTopics?: string[];
}

/** Short messages that close a topic rather than open one. */
const CASUAL_MAX_WORDS = 14;

/** The person to name in a template: prefers someone who belongs to the topic. */
export function personFor(analysis: Analysis, topic: TopicKey | null): string | null {
  const onTopic = analysis.people.find((p) => PEOPLE_TOPIC[p] === topic);
  if (onTopic) return onTopic;
  // Generic topics (self, future...) can name anyone; a work line can't name "mẹ".
  const owned = new Set(Object.values(PEOPLE_TOPIC));
  return topic && owned.has(topic) ? null : (analysis.people[0] ?? null);
}

/** What the whole conversation is mostly about, earlier turns winning ties. */
export function dominantTopic(analyses: Analysis[]): TopicKey | null {
  const totals = new Map<TopicKey, number>();
  for (const x of analyses) {
    for (const t of x.topics) if (t.key !== "daily") totals.set(t.key, (totals.get(t.key) ?? 0) + t.score);
  }
  let best: TopicKey | null = null;
  let bestScore = 0;
  for (const [key, score] of totals) {
    if (score > bestScore) {
      best = key;
      bestScore = score;
    }
  }
  return best ?? carriedTopic(analyses);
}

/** Topic of this message, or the most recent one in the conversation. */
export function carriedTopic(analyses: Analysis[]): TopicKey | null {
  for (let i = analyses.length - 1; i >= 0; i--) {
    const specific = analyses[i].topics.find((t) => t.key !== "daily");
    if (specific) return specific.key;
  }
  for (let i = analyses.length - 1; i >= 0; i--) {
    if (analyses[i].primaryTopic) return analyses[i].primaryTopic;
  }
  return null;
}

function topicCount(analyses: Analysis[], topic: TopicKey): number {
  return analyses.filter((a) => a.topics.some((t) => t.key === topic)).length;
}

function join(...parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * One Whisper reply, computed from the whole conversation so far. Rules run
 * in priority order - safety first, then social moments, then direct
 * questions, then the ordinary case of someone telling their day - and every
 * reply is built from a real signal in what they wrote.
 */
export function whisperReply(history: Turn[], lang: Lang, ctx: MindContext = {}): string {
  const kb = KNOWLEDGE[lang];
  const userTurns = history.filter((t) => t.role === "user").map((t) => t.content);
  const used = history.filter((t) => t.role === "assistant").map((t) => t.content);
  const latestText = userTurns[userTurns.length - 1] ?? "";
  const analyses = userTurns.map((m) => analyze(m, lang));
  const a = analyses[analyses.length - 1] ?? analyze("", lang);
  const conversationText = userTurns.join("\n");
  const turnIndex = userTurns.length - 1;
  const seed = `${latestText}#${turnIndex}`;

  const topic = carriedTopic(analyses);
  const person = personFor(a, topic) ?? (topic ? personFor(analyses.find((x) => x.people.length > 0) ?? a, topic) : null);
  const topicKb: TopicKnowledge | null = topic ? kb.topics[topic] : null;

  const slots: Slots = {
    detail: a.detail,
    phrase: a.keyPhrase,
    person,
    name: ctx.name,
    a: a.decision?.a,
    b: a.decision?.b,
    topic: topicKb?.label,
  };
  const opts = { slots, conversationText, used, seed };
  const choose = (bank: string[]) => pick(bank, opts);
  // When they name someone, advice that involves that person answers them better.
  const chooseSuggestion = (k: TopicKnowledge) =>
    (a.people.length > 0 ? choose(k.suggestions.filter((l) => l.includes("{person}"))) : null) ?? choose(k.suggestions);

  // --- 1. Safety always wins, and the tone stays gentle on the turn after.
  if (a.intents.has("crisis")) {
    return used.includes(kb.general.crisis)
      ? (choose(kb.emotions.sad.stay) ?? kb.emotions.neutral.stay[0])
      : kb.general.crisis;
  }
  if (used[used.length - 1] === kb.general.crisis) {
    return join(choose(kb.emotions.sad.stay), lang === "vi" ? "Bạn kể tiếp được không?" : "Can you tell me a bit more?");
  }

  // --- 2. Social moments, only when the message isn't also carrying something heavy.
  const short = a.wordCount <= CASUAL_MAX_WORDS;
  const carryingWeight = a.register === "heavy" && a.intensity !== "low";
  if (a.intents.has("about_haven")) return choose(kb.general.aboutHaven) ?? kb.general.aboutHaven[0];
  if (a.intents.has("greeting") && !carryingWeight) {
    const past = turnIndex === 0 ? ctx.pastTopics?.[0] : undefined;
    const line = past
      ? pick(kb.general.greetingReturning, { ...opts, slots: { ...slots, topic: past } })
      : choose(kb.general.greeting);
    if (line) return line;
  }
  if (short && !carryingWeight) {
    if (a.intents.has("feel_better")) return choose(kb.general.feelBetter) ?? kb.general.feelBetter[0];
    if (a.intents.has("closing")) return choose(kb.general.closing) ?? kb.general.closing[0];
    if (a.intents.has("thanks")) return choose(kb.general.thanks) ?? kb.general.thanks[0];
  }

  // --- 3. Direct questions get answered, not deflected into another question.
  if (a.intents.has("decision") && a.decision) {
    const lead = choose(kb.general.decisionLead);
    const suggestion = topicKb ? chooseSuggestion(topicKb) : null;
    const lean = choose(kb.topics.future.reframes);
    const follow = choose(kb.topics.future.followUps);
    return join(lead, suggestion ?? lean, suggestion ? null : follow);
  }
  if (a.intents.has("ask_advice") || a.intents.has("ask_opinion")) {
    const suggestion = topicKb ? chooseSuggestion(topicKb) : null;
    if (suggestion) {
      const lead = choose(kb.general.adviceLead);
      return join(lead, suggestion);
    }
    const insight = topicKb ? choose(topicKb.observations) : null;
    return join(insight, choose(kb.general.adviceGeneric));
  }

  // --- 4. Someone telling their day. Acknowledge what they feel, then one move.
  const voice = kb.emotions[a.primaryEmotion];
  // Echoing their sentence every turn sounds like a parrot: first turn, then every third.
  const mayEcho = turnIndex % 3 === 0;
  const ackBank = mayEcho ? voice.ack : voice.ack.filter((l) => !l.includes("{detail}"));
  const feltAck = choose(ackBank) ?? choose(voice.ack.filter((l) => !l.includes("{detail}")));
  // "Rồi, kể tiếp đi." in front of a question just contradicts it; a neutral ack only stands alone.
  const ack = a.primaryEmotion === "neutral" ? null : feltAck;

  // Too strong for a question: stay with them.
  if (a.register === "heavy" && a.intensity === "high") {
    const stay = choose(voice.stay);
    if (stay) return join(ack, stay);
  }

  // A real recurrence, on the exact turn it becomes one.
  if (topic && topic !== "daily" && turnIndex > 0 && topicCount(analyses, topic) === 2 && a.topics.some((t) => t.key === topic)) {
    const notice = choose(kb.general.noticeRecurring);
    if (notice) return join(ack, notice);
  }

  // Something they told Haven in an earlier conversation.
  if (turnIndex === 0 && topicKb && ctx.pastTopics?.includes(topicKb.label)) {
    const remembered = choose(kb.general.rememberPast);
    if (remembered) return join(ack, remembered);
  }

  if (a.register === "light") {
    const light = choose(kb.general.lightFollowUps);
    return join(ack, light);
  }

  // Never two questions in a row: if the last reply asked, offer a thought instead.
  const lastAsked = /\?\s*$/.test(used[used.length - 1] ?? "");
  if (topicKb) {
    const thought = choose(topicKb.observations);
    const ask = choose(topicKb.followUps);
    const move = lastAsked ? (thought ?? ask) : (ask ?? thought);
    if (move) return join(ack, move);
  }

  const grounded = lastAsked ? choose(kb.general.groundedObservations) : choose(kb.general.groundedFollowUps);
  const hasRealPhrase = (a.keyPhrase?.length ?? 0) >= 3;
  const probe = a.register === "heavy" && !lastAsked ? choose(kb.general.heavyProbes) : null;
  const closing = probe ?? (hasRealPhrase ? grounded : null) ?? choose(kb.general.openInvites);
  return join(ack, closing) || (feltAck ?? kb.general.openInvites[0]);
}

/** Human, non-technical invitations to start talking. */
export function talkStarters(lang: Lang): string[] {
  return lang === "vi"
    ? [
        "Hôm nay có một chuyện mình muốn kể…",
        "Dạo này mình thấy hơi mệt…",
        "Có điều này làm mình vui…",
        "Mình đang nghĩ về một người…",
      ]
    : [
        "Something happened today…",
        "I've been feeling a bit tired lately…",
        "Something made me happy…",
        "I keep thinking about someone…",
      ];
}
