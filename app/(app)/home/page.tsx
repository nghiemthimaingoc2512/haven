"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { useMemories } from "@/lib/storage";
import { useDayPeriod, computeStreak, getWeeklySummary, getWhisperGreeting } from "@/lib/insights";
import { getTide, useDailyQuote } from "@/lib/tides";
import { computeMiniTrail } from "@/lib/constellation";
import { getEmotionLabel, EMOTION_TAXONOMY } from "@/lib/emotions";
import { Moon } from "@/components/mascot/Moon";
import { EmotionBadge } from "@/components/EmotionBadge";
import { EmotionInsights } from "@/components/EmotionInsights";
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
  const [showBreathing, setShowBreathing] = useState(false);

  const greeting = {
    morning: t.homeGreetingMorning,
    afternoon: t.homeGreetingAfternoon,
    evening: t.homeGreetingEvening,
    night: t.homeGreetingNight,
  }[period];

  // A real callback to the last conversation when there's one worth making —
  // never a random line. Falls back to the plain time-of-day greeting below.
  const whisperGreeting = getWhisperGreeting(memories, lang);

  const previewTrail = computeMiniTrail(memories);

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
          <Moon size={104} sway priority />
          {whisperGreeting ? (
            <p className="mt-5 font-serif text-2xl leading-relaxed text-ink">
              {profile.name ? `${profile.name}, ` : ""}
              {whisperGreeting}
            </p>
          ) : (
            <>
              <p className="mt-5 font-serif text-3xl text-ink">
                {greeting}
                {profile.name ? `, ${profile.name}` : ""}.
              </p>
              <p className="mt-1 text-secondary">
                {isNight ? t.nightWindDown : ""} {t.heroQuestion}
              </p>
            </>
          )}
        </div>

        {/* Whisper's Home: the conversation comes before anything else */}
        <Link
          href="/talk"
          className="haven-cta animate-rise mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-center font-serif text-lg text-white hover:bg-primary-hover"
        >
          {t.homeContinueConversation}
        </Link>

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
                href="/memory"
                className="haven-surface animate-rise rounded-2xl px-6 py-6 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">🌌</span>
                <p className="mt-2 font-serif text-lg text-ink">{t.nightReadMemories}</p>
              </Link>

              <Link
                href="/talk"
                className="haven-surface animate-rise rounded-2xl px-6 py-6 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">🕯️</span>
                <p className="mt-2 font-serif text-lg text-ink">{t.homeQuickTalk}</p>
              </Link>
            </div>

            <p className="animate-rise mt-6 text-center text-sm text-secondary">
              {t.breatheTogetherLine}
            </p>
          </>
        ) : (
          <>
            {/* Today's Tide */}
            {/* Memory from previous days — a real callback, not a widget */}
            {latest ? (
              <Link
                href="/memory"
                className="haven-surface animate-rise mt-4 block rounded-2xl px-6 py-6 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm text-muted">🌌 {t.savedMemory}</span>
                <p className="mt-2 line-clamp-2 font-serif text-lg text-ink">{latest.reflection}</p>
              </Link>
            ) : (
              <div className="haven-surface animate-rise mt-4 flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center">
                <Moon size={56} />
                <p className="font-serif text-lg text-ink">{t.emptyMemoriesTitle}</p>
                <p className="text-sm text-muted">{t.emptyMemoriesBody}</p>
              </div>
            )}

            {/* Today's Story */}
            <div className={`haven-surface animate-rise mt-4 rounded-2xl px-6 py-6 ${TIDE_BG[tide.color]}`}>
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

            {memories.length > 0 && (
              <div className="mt-4">
                <EmotionInsights memories={memories} compact />
              </div>
            )}

            {/* The other world — reachable, but never competing with the conversation above */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/talk"
                className="haven-surface animate-rise rounded-2xl px-5 py-4 transition-transform hover:-translate-y-0.5"
              >
                <p className="font-serif text-lg text-ink">{t.navTalk}</p>
                <p className="mt-1 text-sm text-muted">{t.homeWhisperCardBody}</p>
              </Link>
              <Link
                href="/discover"
                className="haven-aurora animate-rise rounded-2xl px-5 py-4 transition-transform hover:-translate-y-0.5"
              >
                <p className="font-serif text-lg text-ink">{t.navDiscover}</p>
                <p className="mt-1 text-sm text-ink/70">{t.homeAuroraCardBody}</p>
              </Link>
            </div>

            {/* Universe Preview — a short stretch of the same winding path, not scattered dots */}
            {previewTrail.length > 0 && (
              <Link
                href="/story"
                className="haven-surface animate-rise mt-4 block rounded-2xl px-6 py-5 transition-transform hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-wide text-muted">
                  🌌 {t.constellationPreviewLabel}
                </p>
                <svg viewBox="0 0 100 30" className="mt-3 h-10 w-full">
                  <polyline
                    points={previewTrail.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    className="stroke-star"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  {previewTrail.map((p) => (
                    <circle key={p.memory.id} cx={p.x} cy={p.y} r="1.4" className="fill-star" />
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
