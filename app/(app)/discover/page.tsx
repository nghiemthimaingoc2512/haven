"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  beginAurora,
  advanceAurora,
  autoAdvanceAurora,
  starterPrompts,
  type AuroraState,
} from "@/lib/aurora";
import { Moon } from "@/components/mascot/Moon";

interface Message {
  role: "user" | "aurora";
  text: string;
}

/**
 * Aurora is a reflective coach, not an essay-writer: the conversation moves
 * through seven real phases (Understand, Clarify, Explore, Challenge
 * assumptions, Reflect, Generate insight, Create action) as an actual
 * back-and-forth thread, one short message at a time - never a form, never a
 * report dumped in one go. The first four phases each ask one real question
 * and wait; the last three are Aurora thinking out loud in short beats once
 * there's nothing left to ask.
 */
export default function AuroraPage() {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<AuroraState | null>(null);
  const [awaitingReply, setAwaitingReply] = useState(false);
  const [done, setDone] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft]);

  const pushAurora = (text: string) => setMessages((prev) => [...prev, { role: "aurora", text }]);

  // Reflect and Insight are statements, not questions - once Aurora reaches
  // one, she keeps talking in short beats (with a real typing pause between
  // each) until Action is reached, with no user input needed in between.
  const runAutoChain = (fromState: AuroraState) => {
    setTyping(true);
    window.setTimeout(() => {
      const turn = autoAdvanceAurora(fromState, lang);
      pushAurora(turn.message);
      setState(turn.state);
      setTyping(false);
      if (turn.done) {
        setDone(true);
      } else if (turn.awaitingReply) {
        setAwaitingReply(true);
      } else {
        runAutoChain(turn.state);
      }
    }, 900);
  };

  const startConversation = (problem: string) => {
    const trimmed = problem.trim();
    if (!trimmed) return;
    setMessages([{ role: "user", text: trimmed }]);
    setDraft("");
    setDone(false);
    setTyping(true);
    window.setTimeout(() => {
      const turn = beginAurora(trimmed, lang);
      pushAurora(turn.message);
      setState(turn.state);
      setTyping(false);
      setAwaitingReply(turn.awaitingReply);
    }, 900);
  };

  const sendReply = (reply: string) => {
    if (!state || !awaitingReply) return;
    const trimmed = reply.trim();
    if (trimmed) setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setDraft("");
    setAwaitingReply(false);
    setTyping(true);
    window.setTimeout(() => {
      const turn = advanceAurora(state, trimmed, lang);
      pushAurora(turn.message);
      setState(turn.state);
      setTyping(false);
      if (turn.done) {
        setDone(true);
      } else if (turn.awaitingReply) {
        setAwaitingReply(true);
      } else {
        runAutoChain(turn.state);
      }
    }, 900);
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    if (!state) startConversation(draft);
    else sendReply(draft);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const reset = () => {
    setMessages([]);
    setState(null);
    setAwaitingReply(false);
    setDone(false);
    setTyping(false);
    setDraft("");
  };

  const hasConversation = messages.length > 0;
  const composerActive = !state || awaitingReply;

  return (
    <div className="haven-aurora relative flex min-h-full flex-1 flex-col overflow-hidden px-6 py-10">
      <div aria-hidden="true" className="animate-twinkle absolute left-[10%] top-10 text-lg text-star">
        ✦
      </div>
      <div
        aria-hidden="true"
        className="animate-twinkle absolute right-[15%] top-24 text-sm text-star"
        style={{ animationDelay: "1.2s" }}
      >
        ✦
      </div>
      <div
        aria-hidden="true"
        className="animate-twinkle absolute left-[25%] top-40 text-xs text-accent-pink"
        style={{ animationDelay: "2s" }}
      >
        ✦
      </div>

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="flex items-center gap-3">
          <Moon size={44} sway priority />
          <div>
            <h1 className="font-serif text-3xl text-ink">{t.navDiscover}</h1>
            <p className="text-secondary">{t.auroraIntro}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {!hasConversation ? (
            <div className="flex flex-1 flex-col justify-end gap-4 py-8">
              <p className="text-xs uppercase tracking-wide text-muted">{t.auroraTryPrompt}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {starterPrompts(lang).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => startConversation(prompt)}
                    className="haven-surface animate-rise rounded-2xl px-5 py-4 text-left text-sm text-ink transition-transform hover:-translate-y-0.5"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 py-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "aurora" && <Moon size={28} animate={false} />}
                  <div
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-[1.05rem] leading-relaxed ${
                      m.role === "user" ? "bg-primary text-white" : "haven-surface text-ink"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-end gap-2 justify-start">
                  <Moon size={28} animate={false} />
                  <div className="haven-surface rounded-2xl px-4 py-3 text-sm italic text-muted">{t.auroraTyping}</div>
                </div>
              )}
              {done && (
                <div className="flex justify-center pt-2">
                  <button type="button" onClick={reset} className="text-sm text-primary hover:opacity-70">
                    {t.auroraNewQuestion}
                  </button>
                </div>
              )}
              <div ref={threadEndRef} />
            </div>
          )}
        </div>

        {composerActive && (
          <div className="mx-auto w-full max-w-2xl pb-2 pt-4">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasConversation ? t.auroraReplyPlaceholder : t.auroraPlaceholder}
              rows={1}
              autoComplete="off"
              spellCheck={false}
              autoFocus
              className="haven-surface w-full resize-none overflow-hidden rounded-2xl px-5 py-4 text-[1.05rem] leading-relaxed text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-2 flex items-center justify-between">
              {hasConversation ? (
                <button type="button" onClick={() => sendReply("")} className="text-sm text-muted hover:text-ink">
                  {t.auroraSkip}
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim()}
                className={`haven-cta rounded-full px-5 py-2 text-sm ${
                  draft.trim() ? "bg-primary text-white hover:bg-primary-hover" : "cursor-not-allowed bg-line text-muted"
                }`}
              >
                {t.send}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
