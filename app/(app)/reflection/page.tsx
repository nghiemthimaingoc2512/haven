"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useMemories } from "@/lib/storage";
import { Moon } from "@/components/mascot/Moon";
import { EmotionBadge } from "@/components/EmotionBadge";

/**
 * Shown right after a conversation is ended and saved: the one memory that
 * came out of it. Lives inside the (app) group so the nav stays reachable -
 * the old standalone page trapped people with a single tiny link.
 */
export default function ReflectionPage() {
  const { lang, t } = useLanguage();
  const memories = useMemories();
  const latest = memories[0] ?? null;
  const previous = memories[1] ?? null;
  const isFirstEver = memories.length === 1;

  const [savedState, setSavedState] = useState<"remembering" | "saved">("remembering");

  useEffect(() => {
    if (!latest) return;
    const timer = window.setTimeout(() => setSavedState("saved"), 1000);
    return () => window.clearTimeout(timer);
  }, [latest]);

  if (!latest) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-16 text-center">
        <div className="haven-surface animate-rise flex w-full flex-col items-center gap-4 rounded-3xl px-6 py-16">
          <Moon size={56} priority />
          <p className="font-serif text-lg text-ink">{t.emptyMemoriesTitle}</p>
          <p className="text-muted">{t.emptyMemoriesBody}</p>
          <Link
            href="/talk"
            className="haven-cta mt-2 rounded-full bg-primary px-6 py-3 text-sm text-white hover:bg-primary-hover"
          >
            {t.startTalking}
          </Link>
        </div>
      </div>
    );
  }

  const fromAurora = latest.source === "aurora";

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-10">
      {isFirstEver && (
        <p className="animate-rise mb-6 text-center font-serif italic text-secondary">{t.firstConversation}</p>
      )}

      {!isFirstEver && previous && previous.topics[0] && (
        <p className="animate-rise mb-6 text-center text-sm text-muted">
          {t.lastTime} &ldquo;{previous.topics[0]}&rdquo;.
        </p>
      )}

      <div className="animate-rise haven-surface rounded-3xl px-8 py-10">
        <div className="flex items-center gap-3">
          <Moon size={40} priority />
          <p className="text-xs uppercase tracking-wide text-muted">
            {fromAurora ? t.auroraSummaryLabel : t.reflectionHeading}
          </p>
        </div>

        <p className="mt-5 whitespace-pre-line font-serif text-xl leading-relaxed text-ink">{latest.reflection}</p>

        {latest.standout && (
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-xs uppercase tracking-wide text-secondary">{t.standoutLabel}</p>
            <p className="mt-1 font-serif italic text-ink/90">{latest.standout}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-line pt-5 text-center">
          {latest.emotionKey && (
            <EmotionBadge
              emotionKey={latest.emotionKey}
              lang={lang}
              confidence={latest.confidence}
              confidenceLabel={t.confidenceLabel}
            />
          )}
          <p className={`text-sm transition-colors ${savedState === "saved" ? "text-secondary" : "text-muted"}`}>
            {savedState === "remembering" ? t.willRemember : `${t.savedLabel} ✓`}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={fromAurora ? "/discover" : "/talk"}
          className="haven-cta rounded-full bg-primary px-6 py-3 text-sm text-white hover:bg-primary-hover"
        >
          {fromAurora ? t.auroraNewQuestion : t.newConversation}
        </Link>
        <Link href="/memory" className="rounded-full px-5 py-3 text-sm text-muted hover:text-ink">
          {t.memoryTitle}
        </Link>
        <Link href="/home" className="rounded-full px-5 py-3 text-sm text-muted hover:text-ink">
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}
