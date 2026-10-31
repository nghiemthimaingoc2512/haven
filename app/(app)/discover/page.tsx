"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { saveMemory, createMemoryId, useMemories } from "@/lib/storage";
import { generateReflection } from "@/lib/reflection";
import {
  beginAurora,
  advanceAurora,
  autoAdvanceAurora,
  starterPrompts,
  type AuroraState,
} from "@/lib/aurora";
import {
  AiUnavailableError,
  companionContext,
  requestReflection,
  streamCompanion,
  type ChatMessage,
} from "@/lib/ai/client";
import { Moon } from "@/components/mascot/Moon";

const DRAFT_KEY = "haven:aurora:thread";

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function readDraftThread(): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        Boolean(m) && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    );
  } catch {
    return [];
  }
}

function writeDraftThread(messages: ChatMessage[]) {
  try {
    if (messages.length === 0) window.sessionStorage.removeItem(DRAFT_KEY);
    else window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(messages));
  } catch {
    // session storage unavailable
  }
}

/** Renders **bold** labels from the summary without pulling in a markdown lib. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Aurora is a thinking partner: one short message at a time, one question
 * per turn, until the user asks for a summary. Replies stream from
 * /api/aurora; without an API key the old rule-based state machine takes
 * over so the page still works offline.
 */
export default function AuroraPage() {
  const { lang, t } = useLanguage();
  const profile = useProfile();
  const memories = useMemories();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>(readDraftThread);
  const [streamingReply, setStreamingReply] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [errorLine, setErrorLine] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  // Only used on the no-API-key fallback path.
  const [ruleState, setRuleState] = useState<AuroraState | null>(null);
  const [ruleDone, setRuleDone] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    writeDraftThread(messages);
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streamingReply]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [draft]);

  const hasConversation = messages.length > 0;
  const hasExchange = messages.some((m) => m.role === "assistant");
  const isReplying = streamingReply !== null;
  const canSend = draft.trim().length > 0 && !isReplying && !ruleDone;

  // Fallback: walk the old deterministic state machine. Reflect/insight/
  // action beats chain automatically, mirroring the previous page.
  const runRuleEngine = (userText: string, fromState: AuroraState | null, base: ChatMessage[]) => {
    const turns: string[] = [];
    let turn = fromState ? advanceAurora(fromState, userText, lang) : beginAurora(userText, lang);
    turns.push(turn.message);
    while (!turn.done && !turn.awaitingReply) {
      turn = autoAdvanceAurora(turn.state, lang);
      if (turn.message) turns.push(turn.message);
    }
    setRuleState(turn.state);
    setRuleDone(turn.done);
    setMessages([...base, { role: "assistant", content: turns.join("\n\n") }]);
  };

  const sendMessage = useCallback(
    async (raw: string) => {
      const userText = raw.trim();
      if (!userText || isReplying) return;
      const nextMessages: ChatMessage[] = [...messages, { role: "user", content: userText }];
      setMessages(nextMessages);
      setDraft("");
      setErrorLine(null);
      setStreamingReply("");

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const reply = await streamCompanion(
          "/api/aurora",
          { lang, messages: nextMessages, context: companionContext(profile.name, memories, lang) },
          setStreamingReply,
          controller.signal,
        );
        setMessages([...nextMessages, { role: "assistant", content: reply }]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (err instanceof AiUnavailableError && err.reason === "no_api_key") {
          runRuleEngine(userText, ruleState, nextMessages);
        } else {
          setMessages(messages);
          setDraft(userText);
          setErrorLine(t.aiUnavailable);
        }
      } finally {
        setStreamingReply(null);
        abortRef.current = null;
      }
    },
    // runRuleEngine is recreated each render but only touches state setters + lang
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, isReplying, lang, profile.name, memories, ruleState, t.aiUnavailable],
  );

  const handleFinish = useCallback(async () => {
    if (isReplying || !hasExchange) return;
    setSummarizing(true);
    setErrorLine(null);
    setStreamingReply("");

    let summary: string;
    try {
      summary = await streamCompanion(
        "/api/aurora",
        { lang, messages, context: companionContext(profile.name, memories, lang), mode: "summarize" },
        setStreamingReply,
      );
    } catch (err) {
      if (err instanceof AiUnavailableError && err.reason === "no_api_key") {
        // Rule engine already delivered its action plan as the last message.
        summary = messages[messages.length - 1]?.content ?? "";
      } else {
        setStreamingReply(null);
        setSummarizing(false);
        setErrorLine(t.aiUnavailable);
        return;
      }
    }

    const userOnly = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
    let meta;
    try {
      meta = await requestReflection(lang, messages);
    } catch {
      meta = generateReflection(userOnly, lang);
    }

    saveMemory({
      id: createMemoryId(),
      createdAt: new Date().toISOString(),
      lang,
      transcript: messages
        .map((m) => `${m.role === "user" ? (lang === "vi" ? "Bạn" : "You") : lang === "vi" ? "Cực Quang" : "Aurora"}: ${m.content}`)
        .join("\n"),
      reflection: summary,
      standout: meta.standout,
      emotion: meta.emotionKey,
      emotionKey: meta.emotionKey,
      intensity: meta.intensity,
      confidence: meta.confidence,
      topics: meta.topics,
      people: meta.people,
      source: "aurora",
    });
    writeDraftThread([]);
    router.push("/reflection");
  }, [isReplying, hasExchange, lang, messages, profile.name, memories, router, t.aiUnavailable]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(draft);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamingReply(null);
    setSummarizing(false);
    setErrorLine(null);
    setDraft("");
    setRuleState(null);
    setRuleDone(false);
    writeDraftThread([]);
  };

  return (
    <div className="haven-aurora relative flex min-h-full flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div aria-hidden="true" className="animate-twinkle absolute left-[10%] top-10 text-lg text-star">
        ✦
      </div>
      <div aria-hidden="true" className="animate-twinkle absolute right-[15%] top-24 text-sm text-star" style={{ animationDelay: "1.2s" }}>
        ✦
      </div>
      <div aria-hidden="true" className="animate-twinkle absolute left-[25%] top-40 text-xs text-accent-pink" style={{ animationDelay: "2s" }}>
        ✦
      </div>

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Moon size={40} sway priority />
            <div>
              <h1 className="font-serif text-2xl text-ink">{t.navDiscover}</h1>
              <p className="text-xs text-muted">{t.auroraIntro}</p>
            </div>
          </div>
          {hasConversation && !summarizing && (
            <button type="button" onClick={reset} className="text-xs text-muted hover:text-ink">
              {t.auroraNewQuestion}
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {!hasConversation ? (
            <div className="flex flex-1 flex-col justify-center gap-4 py-8">
              <p className="text-center font-serif text-xl text-ink">{t.auroraPlaceholder}</p>
              <p className="text-center text-xs uppercase tracking-wide text-muted">{t.auroraTryPrompt}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {starterPrompts(lang).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="haven-surface animate-rise rounded-2xl px-5 py-4 text-left text-sm text-ink transition-transform hover:-translate-y-0.5"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-3 py-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && <Moon size={28} animate={false} />}
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[1.02rem] leading-relaxed ${
                      m.role === "user" ? "rounded-br-md bg-primary text-white" : "haven-surface rounded-bl-md text-ink"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isReplying && (
                <div className="flex items-end gap-2 justify-start">
                  <Moon size={28} animate={false} />
                  <div className="haven-surface max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md px-4 py-3 text-[1.02rem] leading-relaxed text-ink">
                    {summarizing && <p className="mb-1 text-xs uppercase tracking-wide text-muted">{t.auroraSummaryLabel}</p>}
                    {streamingReply ? <RichText text={streamingReply} /> : <span className="text-sm italic text-muted">{t.auroraTyping}</span>}
                  </div>
                </div>
              )}
              <div ref={threadEndRef} />
            </div>
          )}
        </div>

        {!summarizing && (
          <div className="sticky bottom-20 md:bottom-4">
            {errorLine && <p className="mb-2 text-center text-sm text-signal">{errorLine}</p>}

            {hasExchange && (
              <div className="mb-2 flex items-center justify-end gap-2">
                <span className="hidden text-xs text-muted sm:inline">{t.auroraFinishHint}</span>
                <button
                  type="button"
                  onClick={() => void handleFinish()}
                  disabled={isReplying}
                  className="haven-surface rounded-full px-4 py-2 text-sm text-primary transition-colors hover:bg-lavender/60 disabled:opacity-50"
                >
                  {t.auroraFinish}
                </button>
              </div>
            )}

            <div className="haven-surface rounded-3xl px-4 py-3">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasConversation ? t.auroraReplyPlaceholder : t.auroraPlaceholder}
                rows={1}
                autoComplete="off"
                spellCheck={false}
                disabled={ruleDone}
                className="block w-full resize-none bg-transparent px-1 py-1 text-[1.1rem] leading-relaxed text-ink placeholder:text-muted/70 focus:outline-none disabled:opacity-60"
              />
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="hidden text-xs text-muted sm:inline">{t.talkHintEnter}</span>
                <button
                  type="button"
                  onClick={() => void sendMessage(draft)}
                  disabled={!canSend}
                  className={`haven-cta flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ${
                    canSend ? "bg-primary text-white hover:bg-primary-hover" : "cursor-not-allowed bg-line text-muted"
                  }`}
                >
                  {t.send}
                  <SendIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
