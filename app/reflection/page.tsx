"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useMemories } from "@/lib/storage";
import { Moon } from "@/components/mascot/Moon";
import { EmotionBadge } from "@/components/EmotionBadge";

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
      <main className="flex min-h-full flex-col items-center justify-center px-6 py-24">
        <Moon size={64} />
        <p className="mt-4 max-w-sm text-center font-serif text-xl text-muted">
          {t.emptyMemoriesBody}
        </p>
        <Link
          href="/talk"
          className="mt-6 text-sm text-secondary underline underline-offset-2"
        >
          {t.newConversation}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-col px-6 py-10">
      <header className="flex w-full items-center justify-between">
        <span className="flex items-center gap-1.5 font-serif text-sm text-muted">
          <Moon size={18} glow={false} animate={false} />
          {t.brand}
        </span>
        <Link href="/story" className="text-sm text-muted hover:text-ink">
          {t.viewHistory}
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-xl">
          {isFirstEver && (
            <p className="animate-rise mb-6 text-center font-serif italic text-secondary">
              {t.firstConversation}
            </p>
          )}

          {previous && previous.topics[0] && (
            <p className="animate-rise mb-6 text-center text-sm text-muted">
              {t.lastTime} &ldquo;{previous.topics[0]}&rdquo;.
            </p>
          )}

          <div className="animate-rise haven-surface rounded-2xl px-8 py-10">
            <div className="flex items-center gap-3">
              <Moon size={40} glow={false} />
              <p className="text-xs uppercase tracking-wide text-muted">
                {t.reflectionHeading}
              </p>
            </div>

            <p className="mt-4 font-serif text-xl leading-relaxed text-ink">
              {latest.reflection}
            </p>

            {latest.standout && (
              <div className="mt-6 border-t border-line pt-4">
                <p className="text-sm font-medium text-secondary">
                  {t.standoutLabel}
                </p>
                <p className="mt-1 font-serif italic text-ink/90">
                  {latest.standout}
                </p>
              </div>
            )}

            <p className="mt-8 text-sm text-muted">
              {savedState === "remembering" ? t.willRemember : t.savedLabel}
            </p>

            {savedState === "saved" && latest.emotionKey && (
              <div className="animate-rise mt-4 flex flex-col items-center gap-2 border-t border-line pt-4 text-center">
                <EmotionBadge
                  emotionKey={latest.emotionKey}
                  lang={lang}
                  confidence={latest.confidence}
                  confidenceLabel={t.confidenceLabel}
                />
                <p className="text-xs text-muted">{t.savedToJourney}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/talk" className="text-sm text-primary hover:opacity-70">
              {t.newConversation}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
