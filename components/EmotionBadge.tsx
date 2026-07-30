import type { Lang } from "@/lib/i18n";
import { EMOTION_TAXONOMY, getEmotionLabel, type EmotionKey } from "@/lib/emotions";

const BG_CLASS: Record<string, string> = {
  "accent-pink": "bg-accent-pink/50",
  "soft-blue": "bg-soft-blue/50",
  lavender: "bg-lavender/50",
  muted: "bg-line",
  "night-indigo": "bg-night-indigo/20",
  secondary: "bg-secondary/35",
  primary: "bg-primary/20",
};

interface EmotionBadgeProps {
  emotionKey: EmotionKey;
  lang: Lang;
  confidence?: number;
  confidenceLabel?: string;
  className?: string;
}

export function EmotionBadge({
  emotionKey,
  lang,
  confidence,
  confidenceLabel,
  className,
}: EmotionBadgeProps) {
  const def = EMOTION_TAXONOMY[emotionKey];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-ink ${BG_CLASS[def.color]} ${className ?? ""}`}
    >
      <span aria-hidden="true">{def.icon}</span>
      {getEmotionLabel(emotionKey, lang)}
      {typeof confidence === "number" && (
        <span className="text-xs text-muted">
          · {confidenceLabel ? `${confidenceLabel} ` : ""}
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
}
