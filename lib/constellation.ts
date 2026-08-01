import type { Lang } from "@/lib/i18n";
import type { Memory } from "@/lib/storage";
import type { EmotionKey } from "@/lib/emotions";

export type ConstellationCategory =
  | "growth"
  | "love"
  | "career"
  | "family"
  | "health"
  | "dreams"
  | "stress"
  | "joy";

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
}

export const CONSTELLATION_CATEGORIES: Record<ConstellationCategory, CategoryDefinition> = {
  growth: { icon: "🌱", labelVi: "Trưởng thành", labelEn: "Growth", color: "star" },
  love: { icon: "💗", labelVi: "Tình yêu", labelEn: "Love", color: "accent-pink" },
  career: { icon: "💼", labelVi: "Sự nghiệp", labelEn: "Career", color: "soft-blue" },
  family: { icon: "🏡", labelVi: "Gia đình", labelEn: "Family", color: "secondary" },
  health: { icon: "🩹", labelVi: "Sức khỏe", labelEn: "Health", color: "accent-pink" },
  dreams: { icon: "🌠", labelVi: "Giấc mơ", labelEn: "Dreams", color: "star" },
  stress: { icon: "🌧️", labelVi: "Căng thẳng", labelEn: "Stress", color: "primary" },
  joy: { icon: "✨", labelVi: "Niềm vui", labelEn: "Joy", color: "lavender" },
};

// Real life-topic signal (from lib/reflection.ts's keyword detection) maps
// straight to a category. Not every topic has an obvious category - those
// fall through to the emotion-based check below.
const TOPIC_TO_CATEGORY: Record<string, ConstellationCategory> = {
  "công việc": "career",
  work: "career",
  "gia đình": "family",
  family: "family",
  "tình cảm": "love",
  relationship: "love",
  "sức khỏe": "health",
  health: "health",
  "tương lai": "dreams",
  future: "dreams",
  "cuộc sống": "growth",
  life: "growth",
};

// When the topic doesn't resolve to a category, fall back to the memory's
// own detected emotion - also real signal, never fabricated.
const STRESS_EMOTIONS = new Set<EmotionKey>(["anxious", "worried", "frustrated", "overwhelmed", "angry"]);
const JOY_EMOTIONS = new Set<EmotionKey>(["happy", "hopeful", "inspired", "peaceful", "calm"]);

export function getMemoryCategory(memory: Memory): ConstellationCategory {
  const topic = memory.topics[0];
  const mapped = topic ? TOPIC_TO_CATEGORY[topic] : undefined;
  if (mapped) return mapped;

  if (memory.emotionKey) {
    if (STRESS_EMOTIONS.has(memory.emotionKey)) return "stress";
    if (JOY_EMOTIONS.has(memory.emotionKey)) return "joy";
  }

  return "growth";
}

export function getCategoryLabel(category: ConstellationCategory, lang: Lang): string {
  const def = CONSTELLATION_CATEGORIES[category];
  return lang === "vi" ? def.labelVi : def.labelEn;
}

// --- Path layout ---------------------------------------------------------
//
// The Universe is one continuous, winding path through the sky - not a
// scatter of nodes. Every memory sits ON the path, in real chronological
// order (newest at the top, where the user lands; oldest at the bottom,
// reached by scrolling down into their history). Nothing here is random:
// the curve is a deterministic wave, and each star's position is a direct
// function of its place in the sequence.

const CENTER_X = 50;
const AMPLITUDE = 24;
const TOP_PADDING = 46;
const BOTTOM_PADDING = 40;

export interface PathStar {
  memory: Memory;
  x: number;
  y: number;
  category: ConstellationCategory;
}

export interface PathWaypoint {
  x: number;
  y: number;
  category: ConstellationCategory;
  side: "left" | "right";
}

export interface ConstellationThread {
  category: ConstellationCategory;
  points: string;
}

export interface PathLayout {
  /** Every memory's position on the path, newest first (matches useMemories()'s order). */
  stars: PathStar[];
  /** The smooth SVG path 'd' running from "now" down through every star. */
  pathD: string;
  /** ViewBox height - width is always 100. */
  height: number;
  /** Where "now" sits - the path always starts here, above the newest star. */
  nowPoint: { x: number; y: number };
  /** First star of each new category run, oldest-to-newest reading order - these get labels, the way Duolingo labels stages of the climb. */
  waypoints: PathWaypoint[];
  /** Faint secondary threads linking same-category stars that aren't adjacent on the path - the "related conversations form a constellation" pattern. */
  threads: ConstellationThread[];
}

/**
 * Lays every memory out along one winding path. `spacingScale` is Universe's
 * real zoom control - it changes how far apart stars actually are (a true
 * relayout), not just a CSS scale trick.
 */
export function computePathLayout(memories: Memory[], spacingScale = 1): PathLayout {
  const ySpacing = 58 * spacingScale;
  const amplitude = AMPLITUDE;

  const stars: PathStar[] = memories.map((memory, i) => ({
    memory,
    x: CENTER_X + Math.sin(i * 0.85) * amplitude,
    y: TOP_PADDING + i * ySpacing,
    category: getMemoryCategory(memory),
  }));

  const nowPoint = { x: CENTER_X, y: TOP_PADDING - 26 };
  const height = TOP_PADDING + Math.max(0, stars.length - 1) * ySpacing + BOTTOM_PADDING;

  // Smooth cubic-bezier path from "now" through every star, oldest star last.
  let pathD = `M ${nowPoint.x} ${nowPoint.y}`;
  let prev = nowPoint;
  for (const star of stars) {
    const midY = (prev.y + star.y) / 2;
    pathD += ` C ${prev.x} ${midY}, ${star.x} ${midY}, ${star.x} ${star.y}`;
    prev = star;
  }

  // Waypoints: walk oldest-to-newest (reverse of the newest-first array) so
  // "a new run starts" reads the way a life actually unfolds.
  const waypoints: PathWaypoint[] = [];
  for (let i = stars.length - 1; i >= 0; i--) {
    const olderIndex = i + 1;
    const isRunStart = olderIndex >= stars.length || stars[olderIndex].category !== stars[i].category;
    if (isRunStart) {
      waypoints.push({
        x: stars[i].x,
        y: stars[i].y,
        category: stars[i].category,
        side: stars[i].x >= CENTER_X ? "right" : "left",
      });
    }
  }

  // Threads: same category, oldest to newest, only when there's an actual
  // recurring pattern (2+ moments) worth showing as its own constellation.
  const byCategory = new Map<ConstellationCategory, PathStar[]>();
  for (let i = stars.length - 1; i >= 0; i--) {
    const s = stars[i];
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }
  const threads: ConstellationThread[] = [...byCategory.entries()]
    .filter(([, list]) => list.length >= 2)
    .map(([category, list]) => ({
      category,
      points: list.map((s) => `${s.x},${s.y}`).join(" "),
    }));

  return { stars, pathD, height, nowPoint, waypoints, threads };
}

export interface MiniTrailPoint {
  memory: Memory;
  x: number;
  y: number;
}

export interface ConstellationSummary {
  category: ConstellationCategory;
  count: number;
  firstDate: string;
  latestDate: string;
  /** The most-frequent real emotionKey among this category's memories - null when none carry one, never guessed. */
  dominantEmotion: EmotionKey | null;
}

/**
 * One real summary card per recurring theme (2+ memories sharing a
 * category) - the same "constellation" grouping as `threads` above, but
 * carrying the actual count/date-span/dominant-emotion instead of just SVG
 * points. Everything here is derived, never invented: the emotion is
 * whichever real emotionKey appears most often in that group, not a
 * flattering guess.
 */
export function computeConstellationSummaries(memories: Memory[]): ConstellationSummary[] {
  const byCategory = new Map<ConstellationCategory, Memory[]>();
  for (const memory of memories) {
    const category = getMemoryCategory(memory);
    const list = byCategory.get(category) ?? [];
    list.push(memory);
    byCategory.set(category, list);
  }

  const summaries: ConstellationSummary[] = [];
  for (const [category, list] of byCategory) {
    if (list.length < 2) continue;
    const sorted = [...list].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const emotionCounts = new Map<EmotionKey, number>();
    for (const memory of list) {
      if (!memory.emotionKey) continue;
      emotionCounts.set(memory.emotionKey, (emotionCounts.get(memory.emotionKey) ?? 0) + 1);
    }
    let dominantEmotion: EmotionKey | null = null;
    let topCount = 0;
    for (const [key, count] of emotionCounts) {
      if (count > topCount) {
        topCount = count;
        dominantEmotion = key;
      }
    }

    summaries.push({
      category,
      count: list.length,
      firstDate: sorted[0].createdAt,
      latestDate: sorted[sorted.length - 1].createdAt,
      dominantEmotion,
    });
  }

  return summaries.sort((a, b) => b.count - a.count);
}

/** A small horizontal teaser of the path - used for Home's preview card. Same wave, sideways. */
export function computeMiniTrail(memories: Memory[], count = 6): MiniTrailPoint[] {
  const recent = memories.slice(0, count);
  const n = Math.max(1, recent.length - 1);
  // oldest-to-newest, left-to-right
  return [...recent].reverse().map((memory, i) => ({
    memory,
    x: 6 + (i / n) * 88,
    y: 15 + Math.sin(i * 1.1) * 10,
  }));
}
