"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useSpeechRecognition,
  type SpeechRecognitionStatus,
} from "@/hooks/useSpeechRecognition";
import { useLanguage, speechLocale, type Copy } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { saveMemory, createMemoryId, useMemories } from "@/lib/storage";
import { whisperReply, talkStarters, type Turn } from "@/lib/mind/whisper";
import { generateMemory } from "@/lib/mind/memory";
import { correctTranscript, pickBestTranscript, readLearned, rememberEdit } from "@/lib/mind/speech";
import { Waveform } from "@/components/Waveform";
import { Moon } from "@/components/mascot/Moon";

type Mode = "voice" | "text";
type Phase = "composing" | "ending";

const DRAFT_KEY = "haven:talk:thread";

type ChatMessage = Turn;

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className={className} aria-hidden="true">
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="18" />
    </svg>
  );
}

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function statusCaption(status: SpeechRecognitionStatus, t: Copy): string {
  switch (status) {
    case "listening":
      return t.statusListening;
    case "paused":
      return t.statusPaused;
    case "permission-denied":
      return t.statusPermissionDenied;
    case "network-error":
      return t.statusNetworkError;
    case "unsupported":
      return t.statusUnsupported;
    case "idle":
    default:
      return t.statusIdle;
  }
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
    // session storage unavailable - the thread just won't survive a reload
  }
}

export default function TalkPage() {
  return (
    <Suspense fallback={null}>
      <TalkPageInner />
    </Suspense>
  );
}

/**
 * Whisper is an ongoing conversation: each message is one turn, the local
 * engine in lib/mind replies, and the thread keeps going until the user
 * chooses to end it. Ending turns the whole transcript into one saved memory.
 */
function TalkPageInner() {
  const { lang, t } = useLanguage();
  const profile = useProfile();
  const memories = useMemories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "voice" ? "voice" : "text");
  const [phase, setPhase] = useState<Phase>("composing");
  const [endingStep, setEndingStep] = useState<"listening" | "reflecting">("listening");
  // The (app) layout only renders children after hydration, so reading
  // sessionStorage in the initializer can't mismatch the server.
  const [messages, setMessages] = useState<ChatMessage[]>(readDraftThread);
  const [isReplying, setIsReplying] = useState(false);
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const replyTimerRef = useRef<number | null>(null);
  const textRef = useRef("");
  // What the voice produced, before any hand edits - comparing it with what
  // they finally keep is how Haven learns their corrections.
  const heardRef = useRef<string | null>(null);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  const commitLearning = useCallback(() => {
    if (heardRef.current !== null) rememberEdit(heardRef.current, textRef.current, lang);
    heardRef.current = null;
  }, [lang]);

  const appendFinal = useCallback(
    (chunk: string, alternatives: string[]) => {
      // Edits made before this new chunk are finished, so learn them now.
      commitLearning();
      const fixed = pickBestTranscript(alternatives.length ? alternatives : [chunk], lang, readLearned(lang));
      const prev = textRef.current;
      const next = prev ? `${prev} ${fixed}` : fixed;
      textRef.current = next;
      heardRef.current = next;
      setText(next);
    },
    [commitLearning, lang],
  );

  const handleInterim = useCallback(
    (chunk: string) => setInterimText(chunk ? correctTranscript(chunk, lang, readLearned(lang)) : ""),
    [lang],
  );

  const { status, start, pause, stop } = useSpeechRecognition({
    locale: speechLocale[lang],
    onFinalResult: appendFinal,
    onInterimResult: handleInterim,
  });

  useEffect(() => {
    writeDraftThread(messages);
  }, [messages]);

  useEffect(
    () => () => {
      if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
    },
    [],
  );

  // recording duration ticks only while actually listening, and holds while paused
  useEffect(() => {
    if (status === "listening") {
      intervalRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const displayValue = interimText ? (text ? `${text} ${interimText}` : interimText) : text;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    el.style.overflowY = el.scrollHeight > 200 ? "auto" : "hidden";
  }, [displayValue, mode]);

  useEffect(() => {
    if (mode === "text") textareaRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isReplying]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === "listening") pause();
    setInterimText("");
    setText(e.target.value);
  };

  const handleMicClick = () => {
    if (status === "listening") pause();
    else start();
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    if (status === "listening") pause();
    setMode(next);
  };

  const handleClearDraft = () => {
    stop();
    heardRef.current = null;
    setText("");
    setInterimText("");
    setElapsedSeconds(0);
  };

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const hasContent = text.trim().length > 0;
  const canSend = wordCount >= 1 && !isReplying;
  const hasConversation = messages.length > 0;
  const hasExchange = messages.some((m) => m.role === "assistant");

  const handleSendTurn = useCallback(() => {
    if (!canSend) return;
    stop();
    commitLearning();
    const userText = text.trim();
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: userText }];

    setMessages(nextMessages);
    setText("");
    setInterimText("");
    setElapsedSeconds(0);
    setIsReplying(true);

    // The reply is instant; a short pause scaled to its length keeps it from feeling like a form.
    const reply = whisperReply(nextMessages, lang, {
      name: profile.name,
      pastTopics: memories.slice(0, 5).flatMap((m) => m.topics.slice(0, 1)),
    });
    replyTimerRef.current = window.setTimeout(() => {
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
      setIsReplying(false);
      replyTimerRef.current = null;
    }, Math.min(1400, 450 + reply.length * 6));
  }, [canSend, text, stop, commitLearning, messages, lang, profile.name, memories]);

  // Ends the whole conversation - the real reflection pipeline runs on
  // everything that was actually said, not just the last line.
  const handleEndConversation = useCallback(() => {
    stop();
    const pending = text.trim();
    const finalMessages: ChatMessage[] = pending ? [...messages, { role: "user", content: pending }] : messages;
    if (!finalMessages.some((m) => m.role === "user")) return;

    setPhase("ending");
    setEndingStep("listening");

    const transcript = finalMessages
      .map((m) => `${m.role === "user" ? (lang === "vi" ? "Bạn" : "You") : lang === "vi" ? "Thì Thầm" : "Whisper"}: ${m.content}`)
      .join("\n");
    const userOnly = finalMessages.filter((m) => m.role === "user").map((m) => m.content);

    const generated = generateMemory(userOnly, lang);
    window.setTimeout(() => setEndingStep("reflecting"), 800);
    window.setTimeout(() => {
      saveMemory({
        id: createMemoryId(),
        createdAt: new Date().toISOString(),
        lang,
        transcript,
        ...generated,
        source: "whisper",
      });
      writeDraftThread([]);
      router.push("/reflection");
    }, 1600);
  }, [messages, text, stop, lang, router]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendTurn();
    }
  };

  const micDisabled = status === "unsupported";
  const showTroubleMessage =
    status === "permission-denied" || status === "network-error" || status === "unsupported";
  const showWaveform = status === "listening" || status === "paused";

  if (phase === "ending") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <Moon size={80} sway priority />
        <p key={endingStep} className="animate-rise mt-6 font-serif text-2xl text-secondary">
          {endingStep === "listening" ? t.processingListening : t.processingReflecting}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        {/* Header: who you're talking to + the mode switch */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Moon size={40} priority animate={!hasConversation} />
            <div>
              <h1 className="font-serif text-2xl text-ink">{t.navTalk}</h1>
              <p className="text-xs text-muted">{t.talkSubtitle}</p>
            </div>
          </div>
          <div className="haven-surface flex items-center gap-1 rounded-full p-1 text-xs" role="group" aria-label={`${t.voiceModeLabel} / ${t.textModeLabel}`}>
            <button
              type="button"
              onClick={() => switchMode("text")}
              aria-pressed={mode === "text"}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 transition-colors ${
                mode === "text" ? "bg-primary text-white" : "text-muted hover:text-ink"
              }`}
            >
              <KeyboardIcon className="h-3.5 w-3.5" />
              {t.textModeLabel}
            </button>
            <button
              type="button"
              onClick={() => switchMode("voice")}
              aria-pressed={mode === "voice"}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 transition-colors ${
                mode === "voice" ? "bg-primary text-white" : "text-muted hover:text-ink"
              }`}
            >
              <MicIcon className="h-3.5 w-3.5" />
              {t.voiceModeLabel}
            </button>
          </div>
        </div>

        {/* Thread */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {!hasConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
              <Moon size={status === "listening" ? 120 : 96} sway={status === "listening"} priority />
              <p className="animate-rise max-w-sm text-sm text-muted">{t.carryAloneLine}</p>
              {mode === "text" && !hasContent && (
                <div className="flex w-full max-w-xl flex-wrap justify-center gap-2">
                  {talkStarters(lang).map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => {
                        setText(prompt);
                        textareaRef.current?.focus();
                      }}
                      className="haven-surface animate-rise rounded-full px-4 py-2 text-sm text-ink transition-transform hover:-translate-y-0.5"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
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
                    <span className="text-sm italic text-muted">{t.talkTyping}</span>
                  </div>
                </div>
              )}
              <div ref={threadEndRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="sticky bottom-20 md:bottom-4">
          {hasExchange && (
            <div className="mb-2 flex items-center justify-end gap-2">
              <span className="hidden text-xs text-muted sm:inline">{t.finishReflectionHint}</span>
              <button
                type="button"
                onClick={handleEndConversation}
                disabled={isReplying}
                className="haven-surface rounded-full px-4 py-2 text-sm text-primary transition-colors hover:bg-lavender/60 disabled:opacity-50"
              >
                {t.finishReflection}
              </button>
            </div>
          )}

          <div className="haven-surface rounded-3xl px-4 py-3">
            <textarea
              ref={textareaRef}
              value={displayValue}
              onChange={handleTextChange}
              onKeyDown={handleTextareaKeyDown}
              placeholder={t.talkPlaceholder}
              rows={1}
              autoComplete="off"
              spellCheck={false}
              className="block w-full resize-none bg-transparent px-1 py-1 text-[1.1rem] leading-relaxed text-ink placeholder:text-muted/70 focus:outline-none"
            />

            {mode === "voice" ? (
              <div className="mt-2 flex flex-col items-center gap-3 border-t border-line pt-3">
                {showWaveform && (
                  <div className="flex items-center gap-3">
                    <Waveform active={status === "listening"} />
                    <span className="font-sans text-xs tabular-nums text-muted">{formatDuration(elapsedSeconds)}</span>
                  </div>
                )}
                <div className="flex w-full items-center justify-between">
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className={`text-sm text-muted transition-opacity hover:text-ink ${hasContent ? "opacity-100" : "pointer-events-none opacity-0"}`}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleMicClick}
                    disabled={micDisabled}
                    aria-label={status === "listening" ? t.statusPaused : t.statusIdle}
                    className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all ${
                      status === "listening"
                        ? "mic-glow border-primary bg-primary text-white"
                        : micDisabled
                          ? "cursor-not-allowed border-line text-line"
                          : "border-line text-ink hover:border-primary hover:text-primary"
                    }`}
                  >
                    {status === "listening" ? <PauseIcon className="h-6 w-6" /> : <MicIcon className="h-6 w-6" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTurn}
                    disabled={!canSend}
                    className={`haven-cta flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                      canSend ? "bg-primary text-white hover:bg-primary-hover" : "cursor-not-allowed bg-line text-muted"
                    }`}
                  >
                    {t.send}
                    <SendIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className={`text-center text-xs ${showTroubleMessage ? "text-signal" : "text-muted"}`}>{statusCaption(status, t)}</p>
                {hasContent && !showTroubleMessage && <p className="text-center text-xs text-muted">{t.speechFixHint}</p>}
              </div>
            ) : (
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="hidden text-xs text-muted sm:inline">{t.talkHintEnter}</span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className={`text-sm text-muted transition-opacity hover:text-ink ${hasContent ? "opacity-100" : "pointer-events-none opacity-0"}`}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTurn}
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
            )}
          </div>

          {!hasConversation && (
            <p className="mt-3 text-center text-xs text-muted">
              <Link href="/discover" className="underline underline-offset-2 hover:text-ink">
                {t.homeAuroraCardBody}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
