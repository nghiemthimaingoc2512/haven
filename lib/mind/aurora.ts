import type { Lang } from "@/lib/i18n";
import { analyze, type Analysis } from "@/lib/mind/analyze";
import { KNOWLEDGE } from "@/lib/mind/knowledge";
import { pick, type Slots } from "@/lib/mind/template";
import { textHasTerm } from "@/lib/mind/normalize";
import { dominantTopic, personFor, type MindContext, type Turn } from "@/lib/mind/whisper";

const JUST_LISTEN: Record<Lang, string[]> = {
  vi: ["chỉ muốn nói", "chỉ muốn kể", "chỉ cần nghe", "không cần lời khuyên", "không cần giải quyết", "nghe mình thôi", "muốn được nghe"],
  en: ["just want to talk", "just need to vent", "just listen", "don't need advice", "don't want advice", "just want to be heard"],
};

function join(...parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const UNKNOWN: Record<Lang, string[]> = {
  vi: ["không biết", "chưa biết", "chịu", "không rõ", "chắc vậy"],
  en: ["don't know", "not sure", "no idea", "dunno"],
};

function firstDecision(analyses: Analysis[]): { a: string; b: string } | null {
  return analyses.find((x) => x.decision)?.decision ?? null;
}

function buildSlots(analyses: Analysis[], ctx: MindContext, lang: Lang): { slots: Slots; a: Analysis } {
  const a = analyses[analyses.length - 1];
  const topic = dominantTopic(analyses);
  const withPeople = [...analyses].reverse().find((x) => x.people.length > 0);
  const decision = firstDecision(analyses);
  // The line worth quoting is the most charged one in the whole talk, not the
  // latest answer - which may well be "không biết nữa".
  const substantive = analyses.filter((x) => x.wordCount >= 4 && !UNKNOWN[lang].some((t) => textHasTerm(x.text, t)));
  const quoted = analyze(substantive.map((x) => x.text).join("\n"), lang).quote;
  return {
    a,
    slots: {
      detail: a.detail,
      phrase: a.keyPhrase,
      person: withPeople ? personFor(withPeople, topic) : null,
      name: ctx.name,
      a: decision?.a,
      b: decision?.b,
      topic: topic ? KNOWLEDGE[lang].topics[topic].label : null,
      quote: quoted,
    },
  };
}

/**
 * One Aurora turn. Where Whisper follows, Aurora leads: the number of answers
 * so far decides the stage (understand, clarify, explore, challenge, reflect),
 * and each stage is one move built on what they actually said. After the
 * stages run out she keeps asking grounded questions until they end the talk.
 */
export function auroraReply(history: Turn[], lang: Lang, ctx: MindContext = {}): string {
  const kb = KNOWLEDGE[lang];
  const userTurns = history.filter((t) => t.role === "user").map((t) => t.content);
  const used = history.filter((t) => t.role === "assistant").map((t) => t.content);
  const analyses = userTurns.map((m) => analyze(m, lang));
  const stage = userTurns.length - 1;
  const conversationText = userTurns.join("\n");
  const latest = userTurns[userTurns.length - 1] ?? "";
  const { slots, a } = buildSlots(analyses, ctx, lang);
  const opts = { slots, conversationText, used, seed: `${latest}#${stage}` };
  const choose = (bank: string[]) => pick(bank, opts);
  const topic = dominantTopic(analyses);
  const topicKb = topic ? kb.topics[topic] : null;

  if (a.intents.has("crisis")) {
    return used.includes(kb.general.crisis)
      ? (choose(kb.emotions.sad.stay) ?? kb.emotions.neutral.stay[0])
      : kb.general.crisis;
  }
  if (a.intents.has("about_haven")) {
    return lang === "vi"
      ? "Mình là Cực Quang, một phần của Haven. Mình là chương trình chứ không phải người thật, nên chỉ giúp bạn nghĩ cho rõ, còn quyết định là của bạn."
      : "I'm Aurora, part of Haven. I'm a program, not a real person, so I can only help you think it through. The decision stays yours.";
  }
  if (JUST_LISTEN[lang].some((t) => textHasTerm(latest, t))) {
    return choose(kb.aurora.wantToBeHeard) ?? kb.aurora.wantToBeHeard[0];
  }
  if (a.intents.has("thanks") && a.wordCount <= 10) {
    return choose(kb.general.thanks) ?? kb.general.thanks[0];
  }

  // Whatever the stage, an answer that says "I don't know" or "I'm afraid" gets met first.
  if (stage >= 1 && stage <= 3) {
    if (a.wordCount <= 8 && UNKNOWN[lang].some((t) => textHasTerm(latest, t))) {
      const unknown = choose(kb.aurora.reactUnknown);
      if (unknown) return unknown;
    }
    if (a.primaryEmotion === "anxious") {
      const fear = choose(kb.aurora.reactFear);
      if (fear) return fear;
    }
  }

  const decision = slots.a && slots.b;
  switch (stage) {
    case 0: {
      // The decision question already names both options; saying them twice reads like a form.
      if (decision) return choose(kb.aurora.clarifyDecision) ?? kb.aurora.understandDecision[0];
      const question = (topicKb ? choose(topicKb.auroraOpeners) : null) ?? choose(kb.aurora.clarifyGoal);
      return join(choose(kb.aurora.understand), question);
    }
    case 1: {
      const react = a.quote ? pick(kb.aurora.reactAnswer, { ...opts, slots: { ...slots, quote: a.quote } }) : null;
      return join(react, choose(kb.aurora.clarifyGoal) ?? choose(kb.aurora.explore));
    }
    case 2:
      return join(choose(kb.aurora.explore));
    case 3: {
      const reframe = topicKb ? choose(topicKb.reframes) : null;
      return reframe ?? join(choose(kb.aurora.challengeGeneric));
    }
    case 4: {
      const reflect = choose(kb.aurora.reflectLead) ?? choose(kb.aurora.reflectNoQuote);
      return join(reflect, choose(kb.aurora.insightGeneric));
    }
    case 5: {
      // Steps for a two-way decision are about the decision, whatever the topic.
      const step =
        (decision ? choose(kb.topics.future.steps) : null) ??
        (topicKb ? choose(topicKb.steps) : null) ??
        choose(kb.aurora.stepGeneric);
      return lang === "vi"
        ? join("Nếu phải chọn một bước nhỏ:", step, "Bạn thấy làm được không?")
        : join("If you had to pick one small step:", step, "Does that feel doable?");
    }
    default:
      return (
        (topicKb ? choose(topicKb.followUps) : null) ??
        choose(kb.general.groundedFollowUps) ??
        choose(kb.general.openInvites) ??
        kb.general.openInvites[0]
      );
  }
}

/** The closing three-part summary, plain text so the journal can show it as is. */
export function auroraSummary(history: Turn[], lang: Lang, ctx: MindContext = {}): string {
  const kb = KNOWLEDGE[lang];
  const userTurns = history.filter((t) => t.role === "user").map((t) => t.content);
  const analyses = userTurns.map((m) => analyze(m, lang));
  const conversationText = userTurns.join("\n");
  const { slots } = buildSlots(analyses, ctx, lang);
  const opts = { slots, conversationText, used: [], seed: conversationText };
  const topic = dominantTopic(analyses);
  const topicKb = topic ? kb.topics[topic] : null;

  const clear = pick(kb.aurora.clearQuote, opts) ?? pick(kb.aurora.clearGeneric, opts) ?? kb.aurora.clearGeneric[0];
  const open = pick(kb.aurora.stillOpenGeneric, opts) ?? kb.aurora.stillOpenGeneric[0];
  const step =
    (slots.a && slots.b ? pick(kb.topics.future.steps, opts) : null) ??
    (topicKb ? pick(topicKb.steps, opts) : null) ??
    pick(kb.aurora.stepGeneric, opts) ??
    kb.aurora.stepGeneric[0];

  return [
    `${kb.aurora.summaryClear}: ${clear}`,
    `${kb.aurora.summaryOpen}: ${open}`,
    `${kb.aurora.summaryStep}: ${step}`,
  ].join("\n\n");
}

export function auroraStarters(lang: Lang): string[] {
  return KNOWLEDGE[lang].aurora.starters;
}
