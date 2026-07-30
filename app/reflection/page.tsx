"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useMemories } from "@/lib/storage";

export default function ReflectionPage() {
  const { t } = useLanguage();
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
        <p className="max-w-sm text-center font-serif text-xl text-muted">
          {t.historyEmpty}
        </p>
        <Link
          href="/talk"
          className="mt-6 text-sm text-harbor underline underline-offset-2"
        >
          {t.newConversation}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-col px-6 py-10">
      <header className="flex w-full items-center justify-between">
        <span className="font-serif text-sm text-muted">{t.brand}</span>
        <Link href="/history" className="text-sm text-muted hover:text-ink">
          {t.viewHistory}
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-xl">
          {isFirstEver && (
            <p className="animate-rise mb-6 text-center font-serif italic text-harbor">
              {t.firstConversation}
            </p>
          )}

          {previous && previous.topics[0] && (
            <p className="animate-rise mb-6 text-center text-sm text-muted">
              {t.lastTime} &ldquo;{previous.topics[0]}&rdquo;.
            </p>
          )}

          <div className="animate-rise rounded-lg border border-mist bg-paper-raised px-8 py-10">
            <p className="text-xs uppercase tracking-wide text-muted">
              {t.reflectionHeading}
            </p>

            <p className="mt-4 font-serif text-xl leading-relaxed text-ink">
              {latest.reflection}
            </p>

            {latest.standout && (
              <div className="mt-6 border-t border-mist pt-4">
                <p className="text-sm font-medium text-harbor">
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
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/talk" className="text-sm text-ember hover:opacity-70">
              {t.newConversation}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
