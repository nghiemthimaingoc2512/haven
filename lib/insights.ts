"use client";

import { useSyncExternalStore } from "react";
import type { Memory } from "@/lib/storage";
import type { EmotionKey } from "@/lib/emotions";

export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

function periodFromHour(hour: number): DayPeriod {
  if (hour >= 6 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function subscribeNever(): () => void {
  return () => {};
}

function getPeriodSnapshot(): DayPeriod {
  return periodFromHour(new Date().getHours());
}

function getServerPeriodSnapshot(): DayPeriod {
  // Neutral, deterministic default for SSR/first paint — the server can't
  // know the visitor's local time. Corrected immediately after mount.
  return "morning";
}

/** The visitor's local time-of-day period, resolved client-side only. */
export function useDayPeriod(): DayPeriod {
  return useSyncExternalStore(
    subscribeNever,
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

/** Real, derived summary of the last 7 days — not fabricated. */
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
