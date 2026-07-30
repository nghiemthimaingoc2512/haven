"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useSpeechRecognition,
  type SpeechRecognitionStatus,
} from "@/hooks/useSpeechRecognition";
import { useLanguage, speechLocale, type Copy } from "@/lib/i18n";
import { generateReflection } from "@/lib/reflection";
import { saveMemory, createMemoryId } from "@/lib/storage";
import { Waveform } from "@/components/Waveform";
import { Moon } from "@/components/Moon";

type Mode = "voice" | "text";
type Phase = "composing" | "processing";

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="18" />
    </svg>
  );
}

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <line x1="6" y1="10" x2="6" y2="10" />
      <line x1="10" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="14" y2="10" />
      <line x1="18" y1="10" x2="18" y2="10" />
      <line x1="6" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
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

export default function TalkPage() {
  return (
    <Suspense fallback={null}>
      <TalkPageInner />
    </Suspense>
  );
}

function TalkPageInner() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "text" ? "text" : "voice",
  );
  const [phase, setPhase] = useState<Phase>("composing");
  const [processingStep, setProcessingStep] = useState<"listening" | "reflecting">("listening");
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const appendFinal = useCallback((chunk: string) => {
    setText((prev) => (prev ? `${prev} ${chunk}` : chunk));
  }, []);

  const { status, start, pause, stop } = useSpeechRecognition({
    locale: speechLocale[lang],
    onFinalResult: appendFinal,
    onInterimResult: setInterimText,
  });

  // recording duration ticks only while actually listening, and holds while paused
  useEffect(() => {
    if (status === "listening") {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const displayValue = interimText
    ? text
      ? `${text} ${interimText}`
      : interimText
    : text;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [displayValue, mode]);

  useEffect(() => {
    if (mode === "text") textareaRef.current?.focus();
  }, [mode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === "listening") pause();
    setInterimText("");
    setText(e.target.value);
  };

  const handleMicClick = () => {
    if (status === "listening") {
      pause();
    } else {
      start();
    }
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    if (status === "listening") pause();
    setMode(next);
  };

  const handleCancel = () => {
    stop();
    setText("");
    setInterimText("");
    setElapsedSeconds(0);
  };

  const wordCount = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).length,
    [text],
  );
  const hasContent = text.trim().length > 0;
  const hasMeaningfulContent = wordCount >= 3;

  const handleFinish = useCallback(() => {
    if (!hasMeaningfulContent) return;
    stop();
    setPhase("processing");
    setProcessingStep("listening");

    window.setTimeout(() => {
      setProcessingStep("reflecting");
      window.setTimeout(() => {
        const generated = generateReflection(text.trim(), lang);
        saveMemory({
          id: createMemoryId(),
          createdAt: new Date().toISOString(),
          lang,
          transcript: text.trim(),
          reflection: generated.reflection,
          standout: generated.standout,
          emotion: generated.emotion,
          topics: generated.topics,
          people: generated.people,
        });
        // /reflection reads storage fresh on mount — memories[0] is this
        // session, memories[1] (if any) is what "last time" refers to.
        router.push("/reflection");
      }, 900);
    }, 900);
  }, [hasMeaningfulContent, lang, stop, text, router]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mode !== "text") return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFinish();
    }
  };

  const micDisabled = status === "unsupported";
  const showTroubleMessage =
    status === "permission-denied" ||
    status === "network-error" ||
    status === "unsupported";
  const showWaveform = status === "listening" || status === "paused";

  if (phase === "processing") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <Moon mood="curious" size={72} float />
        <p key={processingStep} className="animate-rise mt-6 font-serif text-2xl text-secondary">
          {processingStep === "listening" ? t.processingListening : t.processingReflecting}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col px-6 py-6">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-2xl">
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={handleTextChange}
            onKeyDown={handleTextareaKeyDown}
            placeholder={t.talkPlaceholder}
            rows={1}
            autoComplete="off"
            spellCheck={false}
            className="w-full resize-none overflow-hidden bg-transparent text-[1.35rem] leading-relaxed text-ink placeholder:text-line focus:outline-none"
            autoFocus
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4 pb-6">
        <div className="flex items-center gap-1 rounded-full border border-line p-1 text-sm">
          <button
            type="button"
            onClick={() => switchMode("voice")}
            aria-pressed={mode === "voice"}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
              mode === "voice" ? "bg-primary text-paper" : "text-muted hover:text-ink"
            }`}
          >
            <MicIcon className="h-3.5 w-3.5" />
            {t.voiceModeLabel}
          </button>
          <button
            type="button"
            onClick={() => switchMode("text")}
            aria-pressed={mode === "text"}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
              mode === "text" ? "bg-primary text-paper" : "text-muted hover:text-ink"
            }`}
          >
            <KeyboardIcon className="h-3.5 w-3.5" />
            {t.textModeLabel}
          </button>
        </div>

        {mode === "voice" ? (
          <>
            {showTroubleMessage && (
              <div className="max-w-sm text-center text-sm text-muted">
                <p>{statusCaption(status, t)}</p>
                {(status === "permission-denied" || status === "network-error") && (
                  <a
                    href={typeof window !== "undefined" ? window.location.href : "/talk"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-secondary underline underline-offset-2"
                  >
                    {t.openInBrowser}
                  </a>
                )}
              </div>
            )}

            {showWaveform && (
              <div className="flex flex-col items-center gap-1.5">
                <Waveform active={status === "listening"} />
                <span className="font-sans text-xs tabular-nums text-muted">
                  {formatDuration(elapsedSeconds)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={handleCancel}
                className={`text-sm text-muted transition-opacity hover:text-ink ${
                  hasContent ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={handleMicClick}
                disabled={micDisabled}
                aria-label={status === "listening" ? t.statusPaused : t.statusIdle}
                className={`flex h-16 w-16 items-center justify-center rounded-full border transition-all ${
                  status === "listening"
                    ? "mic-glow border-primary bg-primary text-paper"
                    : micDisabled
                      ? "cursor-not-allowed border-line text-line"
                      : "border-line text-ink hover:border-primary hover:text-primary"
                }`}
              >
                {status === "listening" ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <MicIcon className="h-6 w-6" />
                )}
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className={`text-sm text-primary transition-opacity hover:opacity-70 ${
                  hasMeaningfulContent ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {t.finishReflection}
              </button>
            </div>

            {!showTroubleMessage && (
              <p className="text-sm text-muted">{statusCaption(status, t)}</p>
            )}
          </>
        ) : (
          <div className="flex w-full max-w-2xl flex-col items-center gap-2">
            <div className="flex w-full items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className={`text-sm text-muted transition-opacity hover:text-ink ${
                  hasContent ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={!hasMeaningfulContent}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm transition-opacity ${
                  hasMeaningfulContent
                    ? "bg-primary text-paper hover:opacity-90"
                    : "cursor-not-allowed bg-line text-muted"
                }`}
              >
                {t.send}
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted">
              {lang === "vi"
                ? "Enter để gửi · Shift+Enter để xuống dòng"
                : "Enter to send · Shift+Enter for a new line"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
