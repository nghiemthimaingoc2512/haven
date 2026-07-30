import type { Lang } from "@/lib/i18n";
import type { Memory } from "@/lib/storage";

export type ConstellationCategory =
  | "dreams"
  | "career"
  | "healing"
  | "family"
  | "travel"
  | "friends"
  | "growth"
  | "love";

export type ConstellationColor =
  | "star"
  | "soft-blue"
  | "accent-pink"
  | "secondary"
  | "lavender"
  | "primary";

interface CategoryDefinition {
  icon: string;
  labelVi: string;
  labelEn: string;
  color: ConstellationColor;
  // normalized 0-100 position of this category's "galaxy" center
  center: { x: number; y: number };
}

export const CONSTELLATION_CATEGORIES: Record<ConstellationCategory, CategoryDefinition> = {
  dreams: { icon: "🌠", labelVi: "Giấc mơ", labelEn: "Dreams", color: "star", center: { x: 50, y: 14 } },
  career: { icon: "💼", labelVi: "Sự nghiệp", labelEn: "Career", color: "soft-blue", center: { x: 82, y: 32 } },
  healing: { icon: "🩹", labelVi: "Chữa lành", labelEn: "Healing", color: "accent-pink", center: { x: 74, y: 72 } },
  family: { icon: "🏡", labelVi: "Gia đình", labelEn: "Family", color: "secondary", center: { x: 48, y: 88 } },
  travel: { icon: "🧭", labelVi: "Du lịch", labelEn: "Travel", color: "lavender", center: { x: 20, y: 72 } },
  friends: { icon: "🤝", labelVi: "Bạn bè", labelEn: "Friends", color: "primary", center: { x: 18, y: 32 } },
  growth: { icon: "🌱", labelVi: "Trưởng thành", labelEn: "Growth", color: "soft-blue", center: { x: 50, y: 50 } },
  love: { icon: "💗", labelVi: "Tình yêu", labelEn: "Love", color: "accent-pink", center: { x: 65, y: 50 } },
};

const TOPIC_TO_CATEGORY: Record<string, ConstellationCategory> = {
  "công việc": "career",
  work: "career",
  "gia đình": "family",
  family: "family",
  "tình cảm": "love",
  relationship: "love",
  "sức khỏe": "healing",
  health: "healing",
  "tương lai": "dreams",
  future: "dreams",
  "bạn bè": "friends",
  friend: "friends",
  "du lịch": "travel",
  travel: "travel",
  "cuộc sống": "growth",
  life: "growth",
};

export function getMemoryCategory(memory: Memory): ConstellationCategory {
  const topic = memory.topics[0];
  return (topic && TOPIC_TO_CATEGORY[topic]) || "growth";
}

export function getCategoryLabel(category: ConstellationCategory, lang: Lang): string {
  const def = CONSTELLATION_CATEGORIES[category];
  return lang === "vi" ? def.labelVi : def.labelEn;
}

/** Stable string hash (djb2) — same input always produces the same output, so star layout never jitters between renders. */
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash);
}

export interface StarPosition {
  x: number;
  y: number;
  size: number;
  twinkleDelay: number;
}

/** Deterministic position within a memory's category "galaxy" — jitter derived from the memory's own id, not randomness. */
export function computeStarPosition(memory: Memory): StarPosition {
  const category = getMemoryCategory(memory);
  const center = CONSTELLATION_CATEGORIES[category].center;
  const h = hashString(memory.id);

  const angle = (h % 360) * (Math.PI / 180);
  const radius = 6 + (h % 13); // 6-18 units out from the category center
  const x = Math.min(96, Math.max(4, center.x + Math.cos(angle) * radius));
  const y = Math.min(96, Math.max(4, center.y + Math.sin(angle) * radius));

  const size = 3 + (h % 4); // 3-6px
  const twinkleDelay = (h % 40) / 10; // 0-4s

  return { x, y, size, twinkleDelay };
}
