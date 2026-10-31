import type { Lang } from "@/lib/i18n";
import type { EmotionKey } from "@/lib/emotions";
import type { TopicKey } from "@/lib/mind/lexicon";
import { KNOWLEDGE_VI } from "@/lib/mind/knowledge.vi";
import { KNOWLEDGE_EN } from "@/lib/mind/knowledge.en";

/**
 * The "database" the companions draw from. Every line is a template; slots
 * are filled from the analysis of what the user actually wrote:
 *   {detail}  - the pronoun-flipped focus sentence ("bạn bị mắng trước cả team")
 *   {phrase}  - a short key phrase in their words ("sếp", "deadline")
 *   {person}  - a person they mentioned ("mẹ", "my boss")
 *   {name}    - their name, when known
 *   {a} {b}   - the two sides of a decision
 *   {topic}   - the topic label
 * A template that needs a slot the analysis can't fill is skipped, never
 * rendered with a blank - that's what keeps replies grounded.
 *
 * A line that asserts something specific starts with a condition,
 * `[if:mắng|nói trước mặt] ...`, and is only eligible when the user actually
 * used one of those words. Without it the engine would confidently tell
 * someone about a breakup they never mentioned.
 */

export interface TopicKnowledge {
  label: string;
  /** Follow-up questions specific to the topic. */
  followUps: string[];
  /** Observations - no question mark; used when the user needs room, not prodding. */
  observations: string[];
  /** Practical, modest suggestions - only when advice or an opinion is asked for. */
  suggestions: string[];
  /** Aurora: a gentle challenge to a common assumption in this area. */
  reframes: string[];
  /** Aurora: small, concrete next steps. */
  steps: string[];
  /** Aurora: the first clarifying question. */
  auroraOpeners: string[];
}

export interface EmotionVoice {
  /** Acknowledgements. May use {detail}; variants without it are the fallback. */
  ack: string[];
  /** Quiet companionship lines for heavy moments - no question. */
  stay: string[];
}

export interface GeneralBank {
  greeting: string[];
  greetingReturning: string[]; // {topic}
  thanks: string[];
  closing: string[];
  feelBetter: string[];
  crisis: string;
  aboutHaven: string[];
  /** When they ask for advice but nothing topical matched. */
  adviceGeneric: string[];
  /** Leads before a suggestion. */
  adviceLead: string[];
  opinionLead: string[];
  /** Follow-ups that only need {phrase}. */
  groundedFollowUps: string[];
  /** Observations that only need {phrase}. */
  groundedObservations: string[];
  /** Nothing matched at all - invite more, differently each time. */
  openInvites: string[];
  /** Something heavy, but no idea yet what caused it. */
  heavyProbes: string[];
  noticeRecurring: string[]; // {topic}
  noticePerson: string[]; // {person}
  rememberPast: string[]; // {topic}
  decisionLead: string[]; // {a} {b}
  /** A light "tell me more" for small, happy things. */
  lightFollowUps: string[];
  /** Pure "keep going" responses when the user writes a lot (long share). */
  longShareAck: string[];
}

export interface AuroraBank {
  understand: string[]; // {detail}
  understandDecision: string[]; // {a} {b}
  clarifyGoal: string[];
  clarifyDecision: string[]; // {a} {b}
  explore: string[];
  challengeGeneric: string[];
  reflectLead: string[]; // {quote}
  reflectNoQuote: string[];
  insightGeneric: string[];
  summaryClear: string;
  summaryOpen: string;
  summaryStep: string;
  clearGeneric: string[];
  clearQuote: string[]; // {quote}
  /** Reacting to what their last answer actually was. */
  reactFear: string[];
  reactUnknown: string[];
  reactAnswer: string[]; // {quote}
  stillOpenGeneric: string[];
  stepGeneric: string[];
  wantToBeHeard: string[];
  starters: string[];
}

export interface ReflectBank {
  heavy: string[]; // {detail}
  light: string[]; // {detail}
  neutral: string[]; // {detail}
  /** Used when no sentence is clean enough to echo. */
  heavyPlain: string[];
  lightPlain: string[];
  neutralPlain: string[];
  /** Appended when a heavy conversation ended with them feeling lighter. */
  endedLighter: string[];
  standoutRepeat: string[]; // {phrase}
  standoutPerson: string[]; // {person}
  standoutQuote: string[]; // {quote}
  fallbackTopic: string;
}

export interface Knowledge {
  topics: Record<TopicKey, TopicKnowledge>;
  emotions: Record<EmotionKey, EmotionVoice>;
  general: GeneralBank;
  aurora: AuroraBank;
  reflect: ReflectBank;
}

export const KNOWLEDGE: Record<Lang, Knowledge> = {
  vi: KNOWLEDGE_VI,
  en: KNOWLEDGE_EN,
};
