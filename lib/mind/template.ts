import { capitalizeSentences, hashString, textHasTerm } from "@/lib/mind/normalize";

export interface Slots {
  detail?: string | null;
  phrase?: string | null;
  person?: string | null;
  name?: string | null;
  a?: string | null;
  b?: string | null;
  topic?: string | null;
  quote?: string | null;
}

const CONDITION_RE = /^\[if:([^\]]+)\]\s*/;
const SLOT_RE = /\{(\w+)\}/g;

/**
 * Fills one template, or returns null when it can't honestly be used: a slot
 * has no value, or its `[if:...]` condition isn't met by what the user wrote.
 */
export function render(template: string, slots: Slots, conversationText: string): string | null {
  let body = template;
  const cond = CONDITION_RE.exec(template);
  if (cond) {
    const terms = cond[1].split("|");
    if (!terms.some((t) => textHasTerm(conversationText, t))) return null;
    body = template.slice(cond[0].length);
  }
  let missing = false;
  const filled = body.replace(SLOT_RE, (_, name: string) => {
    const value = slots[name as keyof Slots];
    if (!value) missing = true;
    return value ?? "";
  });
  return missing ? null : capitalizeSentences(filled);
}

export interface PickOptions {
  slots: Slots;
  conversationText: string;
  /** Replies already given in this conversation - nothing is ever said twice. */
  used: string[];
  seed: string;
}

/**
 * Deterministic pick that skips anything unusable or already said. The seed
 * varies the starting point so different messages land on different lines.
 */
export function pick(bank: string[], opts: PickOptions): string | null {
  if (bank.length === 0) return null;
  const start = hashString(opts.seed) % bank.length;
  for (let i = 0; i < bank.length; i++) {
    const line = render(bank[(start + i) % bank.length], opts.slots, opts.conversationText);
    if (line && !opts.used.some((u) => u.includes(line))) return line;
  }
  return null;
}
