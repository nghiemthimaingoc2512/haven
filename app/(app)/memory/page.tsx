"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLanguage, type Copy, type Lang } from "@/lib/i18n";
import { useMemories, type Memory } from "@/lib/storage";
import { Moon } from "@/components/mascot/Moon";
import { EmotionBadge } from "@/components/EmotionBadge";

function formatDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString();
}

function DiaryEntry({ memory, lang, t }: { memory: Memory; lang: Lang; t: Copy }) {
  return (
    <div id={memory.id} className="haven-surface animate-rise scroll-mt-24 rounded-2xl px-6 py-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted">{formatDate(memory.createdAt, lang)}</span>
        {memory.emotionKey && (
          <EmotionBadge
            emotionKey={memory.emotionKey}
            lang={lang}
            confidence={memory.confidence}
            confidenceLabel={t.confidenceLabel}
          />
        )}
      </div>
      <p className="mt-3 whitespace-pre-line font-serif text-lg leading-relaxed text-ink">{memory.reflection}</p>
      {memory.standout && <p className="mt-2 font-serif italic text-secondary">{memory.standout}</p>}
    </div>
  );
}

/**
 * The diary - every reflection Whisper has ever offered back, read as a
 * journal. This is distinct from Growing Sky on purpose: Growing Sky is the
 * long-term growth path; this page is for reading what was actually said.
 */
export default function MemoryPage() {
  const { lang, t } = useLanguage();
  const memories = useMemories();

  const { today, earlier } = useMemo(() => {
    const today: Memory[] = [];
    const earlier: Memory[] = [];
    for (const m of memories) (isToday(m.createdAt) ? today : earlier).push(m);
    return { today, earlier };
  }, [memories]);

  return (
    <div className="min-h-full px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <Moon size={40} priority />
          <div>
            <h1 className="font-serif text-3xl text-ink">{t.memoryTitle}</h1>
            <p className="text-sm text-muted">{t.memorySubtitle}</p>
          </div>
        </div>

        {memories.length === 0 ? (
          <div className="haven-surface animate-rise mt-8 flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
            <Moon size={56} />
            <p className="font-serif text-lg text-ink">{t.memoryEmptyTitle}</p>
            <p className="text-muted">{t.memoryEmptyBody}</p>
            <Link
              href="/talk"
              className="haven-cta mt-2 rounded-full bg-primary px-6 py-3 text-sm text-white hover:bg-primary-hover"
            >
              {t.memoryEmptyCta}
            </Link>
          </div>
        ) : (
          <>
            {today.length > 0 && (
              <section className="mt-8">
                <p className="text-xs uppercase tracking-wide text-muted">{t.memoryToday}</p>
                <div className="mt-3 space-y-4">
                  {today.map((m) => (
                    <DiaryEntry key={m.id} memory={m} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            )}

            {earlier.length > 0 && (
              <section className="mt-8">
                <p className="text-xs uppercase tracking-wide text-muted">{t.memoryEarlier}</p>
                <div className="mt-3 space-y-4">
                  {earlier.map((m) => (
                    <DiaryEntry key={m.id} memory={m} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
