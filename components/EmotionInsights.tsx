import { useLanguage } from "@/lib/i18n";
import type { Memory } from "@/lib/storage";
import {
  computeStreak,
  describeValence,
  getAverageMood,
  getMoodCalendar,
  getMoodTrend,
} from "@/lib/insights";
import { EMOTION_TAXONOMY } from "@/lib/emotions";

function trendBarColor(avgValence: number | null): string {
  if (avgValence === null) return "bg-line";
  if (avgValence > 0.3) return "bg-star";
  if (avgValence < -0.3) return "bg-secondary";
  return "bg-line";
}

interface EmotionInsightsProps {
  memories: Memory[];
  compact?: boolean;
}

/**
 * Single shared emotion-tracking dashboard - average mood, streak, an
 * 8-week trend, and (in full mode) a mood calendar for the current month.
 * Used on Me (full) and Home (compact); Constellation shows per-memory
 * emotion inline on each star instead.
 */
export function EmotionInsights({ memories, compact = false }: EmotionInsightsProps) {
  const { lang, t } = useLanguage();
  const avgMood = getAverageMood(memories);
  const moodDisplay = describeValence(avgMood, lang);
  const streak = computeStreak(memories);
  const trend = getMoodTrend(memories, 8);
  const calendar = compact ? [] : getMoodCalendar(memories);

  return (
    <div className="haven-surface animate-rise rounded-2xl px-6 py-6">
      <p className="text-xs uppercase tracking-wide text-muted">{t.emotionInsightsTitle}</p>

      <div className="mt-3 flex items-center gap-6">
        <div>
          <p className="text-xs text-muted">{t.emotionAverageMood}</p>
          <p className="mt-1 font-serif text-lg text-ink">
            <span aria-hidden="true">{moodDisplay.icon}</span> {moodDisplay.label}
          </p>
        </div>
        {streak >= 1 && (
          <div>
            <p className="text-xs text-muted">{t.emotionStreakLabel}</p>
            <p className="mt-1 font-serif text-lg text-ink">🪴 {streak}</p>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-muted">{t.emotionWeeklyTrend}</p>
      <div className="mt-2 flex h-12 items-end gap-1.5">
        {trend.map((week, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${trendBarColor(week.avgValence)}`}
            style={{
              height: week.count === 0 ? "4px" : `${20 + Math.min(1, Math.abs(week.avgValence ?? 0) / 2) * 80}%`,
            }}
          />
        ))}
      </div>

      {!compact && (
        <>
          <p className="mt-6 text-xs text-muted">{t.emotionMoodCalendar}</p>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {calendar.map((cell) => (
              <div
                key={cell.day}
                className={`flex aspect-square items-center justify-center rounded-md text-xs ${
                  cell.emotionKey ? "bg-line" : "bg-line/30"
                }`}
                title={`${cell.day}${cell.emotionKey ? ` - ${EMOTION_TAXONOMY[cell.emotionKey].labelEn}` : ""}`}
              >
                {cell.emotionKey ? EMOTION_TAXONOMY[cell.emotionKey].icon : ""}
              </div>
            ))}
          </div>
        </>
      )}

      {memories.length === 0 && <p className="mt-4 text-sm text-muted">{t.emotionNoDataYet}</p>}
    </div>
  );
}
