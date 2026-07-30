"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { useMemories } from "@/lib/storage";
import { useDayPeriod, computeStreak, getWeeklySummary } from "@/lib/insights";
import { getTide, useDailyQuote } from "@/lib/tides";
import { computeStarPosition } from "@/lib/constellation";
import { getEmotionLabel, EMOTION_TAXONOMY } from "@/lib/emotions";
import { useDreamJournal, saveDreamJournal } from "@/lib/dreamJournal";
import { Moon } from "@/components/Moon";
import { EmotionBadge } from "@/components/EmotionBadge";
import { BreathingGuide } from "@/components/BreathingGuide";

const TIDE_BG: Record<string, string> = {
  "soft-blue": "bg-soft-blue/40",
  secondary: "bg-secondary/30",
  "accent-pink": "bg-accent-pink/40",
  primary: "bg-primary/20",
  muted: "bg-line",
};

export default function HomePage() {
  const { lang, t } = useLanguage();
  const profile = useProfile();
  const memories = useMemories();
  const period = useDayPeriod();
  const isNight = period === "night";
  const streak = computeStreak(memories);
  const latest = memories[0] ?? null;
  const quote = useDailyQuote(lang);
  const tide = getTide(latest?.emotion ?? null, lang);
  const weekly = getWeeklySummary(memories);
  const dreamNote = useDreamJournal();
  const [showBreathing, setShowBreathing] = useState(false);
  const [showDreamInput, setShowDreamInput] = useState(false);
  const [dreamDraft, setDreamDraft] = useState(dreamNote);

  const greeting = {
    morning: t.homeGreetingMorning,
    afternoon: t.homeGreetingAfternoon,
    evening: t.homeGreetingEvening,
    night: t.homeGreetingNight,
  }[period];

  const previewStars = memories.slice(0, 6).map((m) => ({
    memory: m,
    pos: computeStarPosition(m),
  }));

  return (
    <div className={`min-h-full ${isNight ? "haven-night-sky" : ""}`}>
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        {/* Hero */}
        <div className="haven-moonlight animate-rise relative overflow-hidden rounded-3xl px-8 py-10 text-center">
          <div
            aria-hidden="true"
            className={`absolute left-6 top-8 h-8 w-20 rounded-full bg-white/50 blur-md ${isNight ? "animate-drift-slow" : "animate-drift"}`}
          />
          <div
            aria-hidden="true"
            className={`absolute right-8 top-16 h-6 w-16 rounded-full bg-white/40 blur-md ${isNight ? "animate-drift-slow" : "animate-drift"}`}
            style={{ animationDelay: "2s" }}
          />
          {isNight && (
            <>
              <div aria-hidden="true" className="animate-twinkle-slow absolute left-[20%] top-6 text-star">
                ✦
              </div>
              <div
                aria-hidden="true"
                className="animate-twinkle-slow absolute right-[22%] top-12 text-xs text-star"
                style={{ animationDelay: "1.5s" }}
              >
                ✦
              </div>
            </>
          )}
          <Moon mood={isNight ? "sleeping" : "smiling"} size={88} float />
          <p className="mt-5 font-serif text-3xl text-ink">
            {greeting}
            {profile.name ? `, ${profile.name}` : ""}.
          </p>
          <p className="mt-1 text-secondary">
            {isNight ? t.nightWindDown : ""} {t.heroQuestion}
          </p>
        </div>

        {isNight ? (
          <>
            {/* Night Ritual */}
            <p className="mt-8 text-xs uppercase tracking-wide text-muted">
              🌙 {t.nightRitualTitle}
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowBreathing(true)}
                className="haven-surface animate-rise rounded-2xl px-6 py-6 text-left transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">🌬️</span>
                <p className="mt-2 font-serif text-lg text-ink">{t.nightBreathing}</p>
              </button>

              <Link
                href="/story"
                className="haven-surface animate-rise rounded-2xl px-6 py-6 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">🌌</span>
                <p className="mt-2 font-serif text-lg text-ink">{t.nightReadMemories}</p>
              </Link>

              <button
                type="button"
                onClick={() => setShowDreamInput((v) => !v)}
                className="haven-surface animate-rise rounded-2xl px-6 py-6 text-left transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">💭</span>
                <p className="mt-2 font-serif text-lg text-ink">{t.nightDreamJournal}</p>
              </button>

              <Link
                href="/talk"
                className="haven-surface animate-rise rounded-2xl px-6 py-6 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">🕯️</span>
                <p className="mt-2 font-serif text-lg text-ink">{t.homeQuickTalk}</p>
              </Link>
            </div>

            {showDreamInput && (
              <div className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-5">
                <textarea
                  value={dreamDraft}
                  onChange={(e) => setDreamDraft(e.target.value)}
                  onBlur={() => saveDreamJournal(dreamDraft)}
                  rows={3}
                  placeholder={t.nightDreamJournal}
                  className="w-full resize-none rounded-xl bg-transparent text-ink placeholder:text-muted focus:outline-none"
                />
              </div>
            )}

            <p className="animate-rise mt-6 text-center text-sm text-secondary">
              {t.breatheTogetherLine}
            </p>
          </>
        ) : (
          <>
            {/* Today's Tide */}
            <div className={`haven-surface animate-rise mt-6 rounded-2xl px-6 py-6 ${TIDE_BG[tide.color]}`}>
              <p className="text-xs uppercase tracking-wide text-muted">{t.todaysTide}</p>
              <p className="mt-2 font-serif text-2xl text-ink">{tide.name}</p>
              <p className="mt-1 text-sm text-ink/80">{tide.description}</p>
              {latest?.emotionKey && (
                <EmotionBadge emotionKey={latest.emotionKey} lang={lang} className="mt-3 bg-card/60" />
              )}
            </div>

            {/* Glow of the Day */}
            <div className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-6">
              <p className="text-xs uppercase tracking-wide text-muted">✨ {t.glowOfDay}</p>
              <p className="mt-2 font-serif text-lg leading-relaxed text-ink">{tide.glow}</p>
            </div>

            {/* Continue Your Journey */}
            <p className="mt-8 text-xs uppercase tracking-wide text-muted">{t.continueJourney}</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Link
                href="/talk"
                className="haven-surface animate-rise rounded-2xl px-6 py-6 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">💬 {t.lastConversation}</span>
                <p className="mt-2 font-serif text-lg text-ink">{t.homeQuickTalk}</p>
              </Link>
              <Link
                href="/story"
                className="haven-surface animate-rise rounded-2xl px-6 py-6 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">🌌 {t.savedMemory}</span>
                {latest ? (
                  <p className="mt-2 line-clamp-2 font-serif text-lg text-ink">{latest.reflection}</p>
                ) : (
                  <p className="mt-2 font-serif text-lg text-ink">{t.emptyMemoriesTitle}</p>
                )}
              </Link>
            </div>

            {!latest && (
              <div className="haven-surface animate-rise mt-6 flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center">
                <Moon mood="curious" size={56} />
                <p className="font-serif text-lg text-ink">{t.emptyMemoriesTitle}</p>
                <p className="text-sm text-muted">{t.emptyMemoriesBody}</p>
              </div>
            )}

            {/* Weekly Reflection */}
            {weekly.count > 0 && (
              <div className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-6">
                <p className="text-xs uppercase tracking-wide text-muted">
                  {t.weeklyReflectionLabel}
                </p>
                <p className="mt-2 text-ink">
                  {t.weeklyReflectionBody} {weekly.count}{" "}
                  {weekly.dominantEmotion && (
                    <>
                      · {EMOTION_TAXONOMY[weekly.dominantEmotion].icon}{" "}
                      {getEmotionLabel(weekly.dominantEmotion, lang)}
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Constellation Preview */}
            {previewStars.length > 0 && (
              <Link
                href="/story"
                className="haven-surface animate-rise mt-4 block rounded-2xl px-6 py-5 transition-transform hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-wide text-muted">
                  🌌 {t.constellationPreviewLabel}
                </p>
                <svg viewBox="0 0 100 30" className="mt-3 h-10 w-full">
                  {previewStars.map(({ memory, pos }) => (
                    <circle key={memory.id} cx={pos.x} cy={(pos.y / 100) * 30} r="1.4" className="fill-star" />
                  ))}
                </svg>
              </Link>
            )}

            {streak >= 1 && (
              <div className="haven-surface mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-secondary">
                🪴 {streak} {t.streakSuffix}
              </div>
            )}

            <p className="animate-rise mt-10 text-center font-serif italic text-muted">
              “{quote}”
            </p>
          </>
        )}
      </div>

      {showBreathing && <BreathingGuide onClose={() => setShowBreathing(false)} />}
    </div>
  );
}
