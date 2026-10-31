"use client";

import { useSyncExternalStore } from "react";
import type { Memory } from "@/lib/storage";
import type { Lang } from "@/lib/i18n";
import { EMOTION_VALENCE, type EmotionKey } from "@/lib/emotions";

export type DayPeriod = "morning" | "noon" | "afternoon" | "evening" | "night";

// Vietnamese splits the day one step finer than English: 11:00-13:59 is
// "buổi trưa", which "buổi chiều" (afternoon) would get wrong.
function periodFromHour(hour: number): DayPeriod {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 14) return "noon";
  if (hour >= 14 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

// Re-check once a minute so a tab left open crosses into the next period.
function subscribeToClock(callback: () => void): () => void {
  const id = window.setInterval(callback, 60_000);
  return () => window.clearInterval(id);
}

function getPeriodSnapshot(): DayPeriod {
  return periodFromHour(new Date().getHours());
}

function getServerPeriodSnapshot(): DayPeriod {
  // Neutral, deterministic default for SSR/first paint - the server can't
  // know the visitor's local time. Corrected immediately after mount.
  return "morning";
}

/** The visitor's local time-of-day period, resolved client-side only. */
export function useDayPeriod(): DayPeriod {
  return useSyncExternalStore(
    subscribeToClock,
    getPeriodSnapshot,
    getServerPeriodSnapshot,
  );
}

/** Consecutive days (including today) with at least one saved memory. */
export function computeStreak(memories: Memory[]): number {
  if (memories.length === 0) return 0;
  const days = new Set(memories.map((m) => new Date(m.createdAt).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface WeeklySummary {
  count: number;
  dominantEmotion: EmotionKey | null;
}

/** Real, derived summary of the last 7 days - not fabricated. */
export function getWeeklySummary(memories: Memory[]): WeeklySummary {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = memories.filter((m) => new Date(m.createdAt).getTime() >= weekAgo);

  const counts = new Map<EmotionKey, number>();
  for (const m of thisWeek) {
    if (!m.emotionKey) continue;
    counts.set(m.emotionKey, (counts.get(m.emotionKey) ?? 0) + 1);
  }
  let dominantEmotion: EmotionKey | null = null;
  let best = 0;
  for (const [key, count] of counts) {
    if (count > best) {
      best = count;
      dominantEmotion = key;
    }
  }

  return { count: thisWeek.length, dominantEmotion };
}

export interface MoodCalendarDay {
  day: number;
  emotionKey: EmotionKey | null;
}

/** One cell per day of the given month - the day's first-logged emotion, or null if nothing was saved that day. */
export function getMoodCalendar(memories: Memory[], monthDate: Date = new Date()): MoodCalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay = new Map<number, EmotionKey>();
  for (const m of memories) {
    if (!m.emotionKey) continue;
    const d = new Date(m.createdAt);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    // memories are newest-first; keep the first one seen per day
    if (!byDay.has(d.getDate())) byDay.set(d.getDate(), m.emotionKey);
  }

  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    emotionKey: byDay.get(i + 1) ?? null,
  }));
}

export interface MoodTrendWeek {
  avgValence: number | null;
  count: number;
}

/** Average mood valence per week, oldest to newest - the data behind a trend graph. */
export function getMoodTrend(memories: Memory[], weeks = 8): MoodTrendWeek[] {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const points: MoodTrendWeek[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const end = now - w * weekMs;
    const start = end - weekMs;
    const valences = memories
      .filter((m) => {
        const t = new Date(m.createdAt).getTime();
        return t >= start && t < end && m.emotionKey;
      })
      .map((m) => EMOTION_VALENCE[m.emotionKey as EmotionKey]);
    const avgValence = valences.length ? valences.reduce((a, b) => a + b, 0) / valences.length : null;
    points.push({ avgValence, count: valences.length });
  }

  return points;
}

/** Average mood valence over the last N days, or null if nothing was logged. */
export function getAverageMood(memories: Memory[], days = 30): number | null {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const valences = memories
    .filter((m) => new Date(m.createdAt).getTime() >= since && m.emotionKey)
    .map((m) => EMOTION_VALENCE[m.emotionKey as EmotionKey]);
  if (valences.length === 0) return null;
  return valences.reduce((a, b) => a + b, 0) / valences.length;
}

/**
 * A greeting derived from the actual last conversation - never a random
 * pick. Returns null when there's no meaningful callback to make (no
 * memories yet, or the gap since last time is too ordinary to remark on),
 * in which case the caller falls back to the plain time-of-day greeting.
 */
export function getWhisperGreeting(memories: Memory[], lang: Lang): string | null {
  if (memories.length === 0) return null;
  const latest = memories[0];
  const daysSince = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 86_400_000);
  const topic = latest.topics[0];

  if (daysSince === 0) {
    return lang === "vi"
      ? "Mình vẫn đang nghĩ về điều bạn vừa chia sẻ lúc nãy."
      : "I'm still thinking about what you shared earlier.";
  }
  if (daysSince === 1 && topic) {
    return lang === "vi"
      ? `Hôm qua bạn có nhắc đến ${topic}. Hôm nay thế nào rồi?`
      : `Yesterday you mentioned ${topic}. How's it going today?`;
  }
  if (daysSince >= 3) {
    return lang === "vi"
      ? "Lâu rồi mình chưa nghe tin bạn. Dạo này thế nào?"
      : "It's been a little while since I heard from you. How have you been?";
  }
  return null;
}

/** A friendly icon + label for a valence score - never the raw number, which would read as clinical. */
export function describeValence(avg: number | null, lang: Lang): { icon: string; label: string } {
  if (avg === null) return { icon: "🤍", label: lang === "vi" ? "Chưa có dữ liệu" : "Not enough data yet" };
  if (avg >= 1.2) return { icon: "✨", label: lang === "vi" ? "Rất tích cực" : "Very positive" };
  if (avg >= 0.4) return { icon: "🙂", label: lang === "vi" ? "Tích cực" : "Positive" };
  if (avg > -0.4) return { icon: "🤍", label: lang === "vi" ? "Trung tính" : "Neutral" };
  if (avg > -1.2) return { icon: "😟", label: lang === "vi" ? "Hơi nặng nề" : "A bit heavy" };
  return { icon: "😔", label: lang === "vi" ? "Nặng nề" : "Heavy" };
}
