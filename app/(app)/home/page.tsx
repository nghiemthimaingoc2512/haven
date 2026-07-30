"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { useMemories } from "@/lib/storage";
import { useDayPeriod, computeStreak } from "@/lib/insights";
import { getTide, useDailyQuote } from "@/lib/tides";
import { Moon } from "@/components/Moon";
import { EmotionBadge } from "@/components/EmotionBadge";

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
  const streak = computeStreak(memories);
  const latest = memories[0] ?? null;
  const quote = useDailyQuote(lang);
  const tide = getTide(latest?.emotion ?? null, lang);

  const greeting = {
    morning: t.homeGreetingMorning,
    afternoon: t.homeGreetingAfternoon,
    evening: t.homeGreetingEvening,
    night: t.homeGreetingNight,
  }[period];

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      {/* Hero */}
      <div className="haven-moonlight animate-rise relative overflow-hidden rounded-3xl px-8 py-10 text-center">
        <div
          aria-hidden="true"
          className="animate-drift absolute left-6 top-8 h-8 w-20 rounded-full bg-white/50 blur-md"
        />
        <div
          aria-hidden="true"
          className="animate-drift absolute right-8 top-16 h-6 w-16 rounded-full bg-white/40 blur-md"
          style={{ animationDelay: "2s" }}
        />
        <Moon mood="smiling" size={88} float />
        <p className="mt-5 font-serif text-3xl text-ink">
          {greeting}
          {profile.name ? `, ${profile.name}` : ""}.
        </p>
        <p className="mt-1 text-secondary">{t.heroQuestion}</p>
      </div>

      {/* Today's Tide */}
      <div className={`haven-surface animate-rise mt-6 rounded-2xl px-6 py-6 ${TIDE_BG[tide.color]}`}>
        <p className="text-xs uppercase tracking-wide text-muted">
          {t.todaysTide}
        </p>
        <p className="mt-2 font-serif text-2xl text-ink">{tide.name}</p>
        <p className="mt-1 text-sm text-ink/80">{tide.description}</p>
        {latest?.emotionKey && (
          <EmotionBadge
            emotionKey={latest.emotionKey}
            lang={lang}
            className="mt-3 bg-card/60"
          />
        )}
      </div>

      {/* Glow of the Day */}
      <div className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-6">
        <p className="text-xs uppercase tracking-wide text-muted">
          ✨ {t.glowOfDay}
        </p>
        <p className="mt-2 font-serif text-lg leading-relaxed text-ink">
          {tide.glow}
        </p>
      </div>

      {/* Continue Your Journey */}
      <p className="mt-8 text-xs uppercase tracking-wide text-muted">
        {t.continueJourney}
      </p>
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
            <p className="mt-2 line-clamp-2 font-serif text-lg text-ink">
              {latest.reflection}
            </p>
          ) : (
            <p className="mt-2 font-serif text-lg text-ink">
              {t.emptyMemoriesTitle}
            </p>
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

      {streak >= 1 && (
        <div className="haven-surface mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-secondary">
          🪴 {streak} {t.streakSuffix}
        </div>
      )}

      <p className="animate-rise mt-10 text-center font-serif italic text-muted">
        “{quote}”
      </p>
    </div>
  );
}
