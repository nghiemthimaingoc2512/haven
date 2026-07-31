import type { Lang } from "@/lib/i18n";

export type EmotionKey =
  | "happy"
  | "calm"
  | "peaceful"
  | "neutral"
  | "sad"
  | "worried"
  | "anxious"
  | "frustrated"
  | "angry"
  | "overwhelmed"
  | "hopeful"
  | "inspired";

export type EmotionColor =
  | "accent-pink"
  | "soft-blue"
  | "lavender"
  | "muted"
  | "night-indigo"
  | "secondary"
  | "primary";

interface EmotionDefinition {
  icon: string;
  color: EmotionColor;
  labelVi: string;
  labelEn: string;
}

/**
 * Fixed emotional taxonomy. This is a gentle reflection, never a diagnosis —
 * see the confidence score attached to each detection, which is derived from
 * how many real keyword matches supported it, not a fabricated number.
 */
export const EMOTION_TAXONOMY: Record<EmotionKey, EmotionDefinition> = {
  happy: { icon: "😊", color: "accent-pink", labelVi: "Vui vẻ", labelEn: "Happy" },
  calm: { icon: "🙂", color: "soft-blue", labelVi: "Bình tĩnh", labelEn: "Calm" },
  peaceful: { icon: "😌", color: "lavender", labelVi: "Yên bình", labelEn: "Peaceful" },
  neutral: { icon: "🤍", color: "muted", labelVi: "Bình thường", labelEn: "Neutral" },
  sad: { icon: "😔", color: "night-indigo", labelVi: "Buồn", labelEn: "Sad" },
  worried: { icon: "😟", color: "secondary", labelVi: "Lo lắng", labelEn: "Worried" },
  anxious: { icon: "😣", color: "secondary", labelVi: "Bồn chồn", labelEn: "Anxious" },
  frustrated: { icon: "😤", color: "night-indigo", labelVi: "Khó chịu", labelEn: "Frustrated" },
  angry: { icon: "😡", color: "night-indigo", labelVi: "Tức giận", labelEn: "Angry" },
  overwhelmed: { icon: "😭", color: "night-indigo", labelVi: "Quá tải", labelEn: "Overwhelmed" },
  hopeful: { icon: "🥹", color: "accent-pink", labelVi: "Hy vọng", labelEn: "Hopeful" },
  inspired: { icon: "✨", color: "primary", labelVi: "Truyền cảm hứng", labelEn: "Inspired" },
};

export function getEmotionLabel(key: EmotionKey, lang: Lang): string {
  return lang === "vi" ? EMOTION_TAXONOMY[key].labelVi : EMOTION_TAXONOMY[key].labelEn;
}

/**
 * A rough -2..+2 pleasantness score per emotion, used only to draw trend
 * lines/averages — never shown to the user as a raw number, and never a
 * substitute for the actual detected emotion + confidence.
 */
export const EMOTION_VALENCE: Record<EmotionKey, number> = {
  overwhelmed: -2,
  angry: -2,
  anxious: -1.5,
  sad: -1.5,
  frustrated: -1,
  worried: -1,
  neutral: 0,
  calm: 1,
  peaceful: 1,
  hopeful: 1.5,
  happy: 2,
  inspired: 2,
};

export type Intensity = "low" | "medium" | "high";

export function getIntensityLabel(intensity: Intensity, lang: Lang): string {
  const labels: Record<Lang, Record<Intensity, string>> = {
    vi: { low: "Nhẹ", medium: "Vừa", high: "Mạnh" },
    en: { low: "Mild", medium: "Moderate", high: "Strong" },
  };
  return labels[lang][intensity];
}
