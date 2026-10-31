"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { saveMemory, createMemoryId } from "@/lib/storage";
import { auroraReply, auroraStarters, auroraSummary } from "@/lib/mind/aurora";
import { generateMemory } from "@/lib/mind/memory";
import type { Turn } from "@/lib/mind/whisper";
import { Moon } from "@/components/mascot/Moon";

const DRAFT_KEY = "haven:aurora:thread";

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function readDraftThread(): Turn[] {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is Turn =>
        Boolean(m) && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    );
  } catch {
    return [];
  }
}

function writeDraftThread(messages: Turn[]) {
  try {
    if (messages.length === 0) window.sessionStorage.removeItem(DRAFT_KEY);
    else window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(messages));
  } catch {
    // session storage unavailable
  }
}

/**
 * Aurora is a thinking partner: one short message at a time, one question
 * per turn, until the user asks for a summary. Replies come from the local
 * engine in lib/mind/aurora.ts.
 */
export default function AuroraPage() {
  const { lang, t } = useLanguage();
  const profile = useProfile();
  const router = useRouter();

  // The (app) layout only renders children after hydration, so reading
  // sessionStorage in the initializer can't mismatch the server.
  const [messages, setMessages] = useState<Turn[]>(readDraftThread);
  const [isReplying, setIsReplying] = useState(false);
  const [draft, setDraft] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const replyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    writeDraftThread(messages);
  }, [messages]);

  useEffect(
    () => () => {
      if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isReplying]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [draft]);

  const hasConversation = messages.length > 0;
  const hasExchange = messages.some((m) => m.role === "assistant");
  const canSend = draft.trim().length > 0 && !isReplying;

  const sendMessage = useCallback(
    (raw: string) => {
      const userText = raw.trim();
      if (!userText || isReplying) return;
      const nextMessages: Turn[] = [...messages, { role: "user", content: userText }];
      setMessages(nextMessages);
      setDraft("");
      setIsReplying(true);

      const reply = auroraReply(nextMessages, lang, { name: profile.name });
      replyTimerRef.current = window.setTimeout(() => {
        setMessages([...nextMessages, { role: "assistant", content: reply }]);
        setIsReplying(false);
        replyTimerRef.current = null;
      }, Math.min(1400, 450 + reply.length * 6));
    },
    [messages, isReplying, lang, profile.name],
  );

  const handleFinish = useCallback(() => {
    if (isReplying || !hasExchange) return;
    const userOnly = messages.filter((m) => m.role === "user").map((m) => m.content);
    const speaker = lang === "vi" ? "Cực Quang" : "Aurora";
    const you = lang === "vi" ? "Bạn" : "You";
    saveMemory({
      id: createMemoryId(),
      createdAt: new Date().toISOString(),
      lang,
      transcript: messages.map((m) => `${m.role === "user" ? you : speaker}: ${m.content}`).join("\n"),
      ...generateMemory(userOnly, lang),
      // The summary replaces the Whisper-style reflection; the emotion and topic labels stay.
      reflection: auroraSummary(messages, lang, { name: profile.name }),
      standout: null,
      source: "aurora",
    });
    writeDraftThread([]);
    router.push("/reflection");
  }, [isReplying, hasExchange, lang, messages, profile.name, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(draft);
    }
  };

  const reset = () => {
    if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = null;
    setMessages([]);
    setIsReplying(false);
    setDraft("");
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
          {hasConversation && (
            <button type="button" onClick={reset} className="shrink-0 text-xs text-muted hover:text-ink">
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
                {auroraStarters(lang).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
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
                  <div className="haven-surface rounded-2xl rounded-bl-md px-4 py-3 text-sm italic text-muted">{t.auroraTyping}</div>
                </div>
              )}
              <div ref={threadEndRef} />
            </div>
          )}
        </div>

        <div className="sticky bottom-20 md:bottom-4">
          {hasExchange && (
            <div className="mb-2 flex items-center justify-end gap-2">
              <span className="hidden text-xs text-muted sm:inline">{t.auroraFinishHint}</span>
              <button
                type="button"
                onClick={handleFinish}
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
              className="block w-full resize-none bg-transparent px-1 py-1 text-[1.1rem] leading-relaxed text-ink placeholder:text-muted/70 focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="hidden text-xs text-muted sm:inline">{t.talkHintEnter}</span>
              <button
                type="button"
                onClick={() => sendMessage(draft)}
                disabled={!canSend}
                className={`haven-cta ml-auto flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ${
                  canSend ? "bg-primary text-white hover:bg-primary-hover" : "cursor-not-allowed bg-line text-muted"
                }`}
              >
                {t.send}
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
