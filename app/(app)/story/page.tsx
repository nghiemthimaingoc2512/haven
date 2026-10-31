"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import { useMemories, type Memory } from "@/lib/storage";
import { computeStreak } from "@/lib/insights";
import {
  CONSTELLATION_CATEGORIES,
  computeConstellationSummaries,
  computePathLayout,
  getCategoryLabel,
  getMemoryCategory,
  type ConstellationCategory,
  type ConstellationColor,
} from "@/lib/constellation";
import { Moon } from "@/components/mascot/Moon";
import { EmotionBadge } from "@/components/EmotionBadge";

// A filter is only useful once there's real variety to filter between -
// with one or two categories present it's just confusing chrome.
const MIN_CATEGORIES_FOR_FILTER = 3;

const STAR_MILESTONES = [5, 10, 25, 50, 100, 200];

function nextStarMilestone(count: number): number | null {
  return STAR_MILESTONES.find((m) => m > count) ?? null;
}

const CATEGORY_LIST = Object.keys(CONSTELLATION_CATEGORIES) as ConstellationCategory[];

// Literal class names so Tailwind's static scanner can find them - a
// template-interpolated `fill-${color}` would never be generated.
const FILL_CLASS: Record<ConstellationColor, string> = {
  star: "fill-star",
  "soft-blue": "fill-soft-blue",
  "accent-pink": "fill-accent-pink",
  secondary: "fill-secondary",
  lavender: "fill-lavender",
  primary: "fill-primary",
};

const STROKE_CLASS: Record<ConstellationColor, string> = {
  star: "stroke-star",
  "soft-blue": "stroke-soft-blue",
  "accent-pink": "stroke-accent-pink",
  secondary: "stroke-secondary",
  lavender: "stroke-lavender",
  primary: "stroke-primary",
};

function formatDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayOnly(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

// A real, grounded title for the detail modal - the memory's own detected
// topic if it has one, otherwise the category it was sorted into. Never a
// fabricated headline.
function deriveMemoryTitle(memory: Memory, lang: Lang): string {
  const topic = memory.topics[0];
  if (topic) return lang === "vi" ? `Về ${topic}` : `On ${topic}`;
  return getCategoryLabel(getMemoryCategory(memory), lang);
}

// Deterministic decorative background stars - ambiance only, never tied to
// a real memory, so they're clearly distinct from the path itself.
function backgroundTwinkles(height: number) {
  const count = Math.max(12, Math.round(height / 22));
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 2654435761) % 1000;
    return {
      x: (seed % 97) + 1,
      y: ((seed * 7) % Math.max(1, Math.round(height))) + 4,
      delay: (seed % 40) / 10,
      size: 0.35 + (seed % 3) * 0.15,
    };
  });
}

export default function StoryPage() {
  const { lang, t } = useLanguage();
  const memories = useMemories();
  const [filter, setFilter] = useState<ConstellationCategory | "all">("all");
  const [zoom, setZoom] = useState(1);
  const [openMemory, setOpenMemory] = useState<Memory | null>(null);

  const activeCategories = useMemo(() => {
    const set = new Set<ConstellationCategory>();
    for (const m of memories) set.add(getMemoryCategory(m));
    return set;
  }, [memories]);

  const layout = useMemo(() => computePathLayout(memories, zoom), [memories, zoom]);
  const streak = computeStreak(memories);
  const nextMilestone = nextStarMilestone(memories.length);
  const twinkles = useMemo(() => backgroundTwinkles(layout.height), [layout.height]);
  const summaries = useMemo(() => computeConstellationSummaries(memories), [memories]);

  const daysReflected = useMemo(
    () => new Set(memories.map((m) => new Date(m.createdAt).toDateString())).size,
    [memories],
  );
  const insightsDiscovered = useMemo(() => memories.filter((m) => m.standout).length, [memories]);

  // Real growth-over-time for whatever category the open memory belongs to -
  // count plus the earliest moment in that category, not a fabricated arc.
  const openMemoryGrowth = useMemo(() => {
    if (!openMemory) return null;
    const category = getMemoryCategory(openMemory);
    const inCategory = memories.filter((m) => getMemoryCategory(m) === category);
    if (inCategory.length < 2) return { count: 1, firstDate: null };
    const oldest = inCategory.reduce((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? a : b));
    return { count: inCategory.length, firstDate: formatDate(oldest.createdAt, lang) };
  }, [openMemory, memories, lang]);

  return (
    <div className="haven-night-sky min-h-full px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <Moon size={40} priority />
          <div>
            <h1 className="font-serif text-3xl text-ink">{t.storyTitle}</h1>
            <p className="text-sm text-muted">{t.constellationSubtitle}</p>
          </div>
        </div>

        {memories.length === 0 ? (
          <div className="haven-surface animate-rise mt-8 flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
            <span
              aria-hidden="true"
              className="animate-glow-pulse h-3 w-3 rounded-full bg-star shadow-[0_0_16px_6px_rgba(255,233,168,0.5)]"
            />
            <Moon size={56} />
            <p className="text-muted">{t.constellationEmpty}</p>
            <Link
              href="/talk"
              className="haven-cta mt-2 rounded-full bg-primary px-6 py-3 text-sm text-white hover:bg-primary-hover"
            >
              {t.constellationBeginCta}
            </Link>
          </div>
        ) : (
          <>
            {memories.length === 1 && (
              <p className="animate-rise mt-4 text-center font-serif italic text-secondary">
                {t.constellationFirstStar}
              </p>
            )}

            {/* Milestones - real numbers, not fabricated gamification */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="haven-surface rounded-full px-3 py-1.5">
                ✨ {memories.length} {t.constellationMilestoneStars}
              </span>
              {streak >= 1 && (
                <span className="haven-surface rounded-full px-3 py-1.5">
                  🪴 {streak} {t.constellationMilestoneStreak}
                </span>
              )}
              {layout.threads.length > 0 && (
                <span className="haven-surface rounded-full px-3 py-1.5">
                  🌌 {layout.threads.length} {t.constellationMilestoneThreads}
                </span>
              )}
              {daysReflected >= 1 && (
                <span className="haven-surface rounded-full px-3 py-1.5">
                  📆 {daysReflected} {t.constellationDaysReflected}
                </span>
              )}
              {insightsDiscovered >= 1 && (
                <span className="haven-surface rounded-full px-3 py-1.5">
                  💡 {insightsDiscovered} {t.constellationInsightsDiscovered}
                </span>
              )}
              {nextMilestone && (
                <span className="rounded-full px-3 py-1.5 opacity-60">
                  {nextMilestone - memories.length} {t.constellationNextMilestone} ({nextMilestone} {t.constellationMilestoneStars})
                </span>
              )}
            </div>

            {/* Constellation summary cards - one real card per recurring theme (2+ moments), never fabricated */}
            {summaries.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wide text-muted">{t.constellationYourConstellations}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {summaries.map((summary) => {
                    const def = CONSTELLATION_CATEGORIES[summary.category];
                    return (
                      <button
                        key={summary.category}
                        type="button"
                        onClick={() => setFilter(summary.category)}
                        className="haven-surface animate-rise rounded-2xl px-5 py-4 text-left transition-transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-2">
                          <span aria-hidden="true">{def.icon}</span>
                          <span className="font-serif text-lg text-ink">{getCategoryLabel(summary.category, lang)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {summary.count} {t.constellationGrowthSince} {formatDayOnly(summary.firstDate, lang)}
                        </p>
                        {summary.dominantEmotion && (
                          <div className="mt-2">
                            <span className="text-xs text-muted">{t.constellationEmotionalTrend}: </span>
                            <EmotionBadge emotionKey={summary.dominantEmotion} lang={lang} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category filter - shown once there's variety, or whenever a
                filter is active so "All" is always reachable; dims the path, never removes it */}
            {(activeCategories.size >= MIN_CATEGORIES_FOR_FILTER || filter !== "all") && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    filter === "all" ? "bg-primary text-white" : "haven-surface text-muted"
                  }`}
                >
                  {t.constellationFilterAll}
                </button>
                {CATEGORY_LIST.filter((c) => activeCategories.has(c)).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilter(category)}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                      filter === category ? "bg-primary text-white" : "haven-surface text-muted"
                    }`}
                  >
                    {CONSTELLATION_CATEGORIES[category].icon} {getCategoryLabel(category, lang)}
                  </button>
                ))}
              </div>
            )}

            {/* Zoom - a real relayout (more or less space between stars), not a CSS trick */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
                aria-label={t.constellationZoomOut}
                className="haven-surface h-8 w-8 rounded-full text-ink"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(2)))}
                aria-label={t.constellationZoomIn}
                className="haven-surface h-8 w-8 rounded-full text-ink"
              >
                +
              </button>
            </div>

            {/* The path - one continuous winding journey, tall enough to scroll into */}
            <div className="haven-surface animate-rise mt-4 overflow-hidden rounded-3xl px-2 py-6">
              <svg
                viewBox={`0 0 100 ${layout.height}`}
                style={{ width: "100%", aspectRatio: `100 / ${layout.height}`, display: "block" }}
              >
                {twinkles.map((tw, i) => (
                  <circle
                    key={i}
                    cx={tw.x}
                    cy={tw.y}
                    r={tw.size}
                    className="animate-twinkle-slow fill-line"
                    style={{ animationDelay: `${tw.delay}s` }}
                  />
                ))}

                {/* Faint threads linking recurring themes across time */}
                {layout.threads.map((thread) => (
                  <polyline
                    key={thread.category}
                    points={thread.points}
                    fill="none"
                    className={STROKE_CLASS[CONSTELLATION_CATEGORIES[thread.category].color]}
                    strokeWidth="0.25"
                    strokeDasharray="0.6 1.4"
                    opacity={filter === "all" || filter === thread.category ? 0.4 : 0.08}
                  />
                ))}

                {/* The path itself - glow layer, then a crisp line on top */}
                <path d={layout.pathD} fill="none" className="stroke-secondary" strokeWidth="2.2" opacity="0.25" strokeLinecap="round" />
                <path d={layout.pathD} fill="none" className="stroke-star" strokeWidth="0.5" opacity="0.85" strokeLinecap="round" />

                {/* "You are here" */}
                <circle cx={layout.nowPoint.x} cy={layout.nowPoint.y} r="1.6" className="animate-glow-pulse fill-star" />
                <circle cx={layout.nowPoint.x} cy={layout.nowPoint.y} r="3.2" className="fill-star" opacity="0.18" />
                <text
                  x={layout.nowPoint.x}
                  y={layout.nowPoint.y - 5}
                  textAnchor="middle"
                  fontSize="2.6"
                  className="fill-ink"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t.constellationNowLabel}
                </text>

                {/* Waypoint labels - where a new theme begins, read oldest to newest */}
                {layout.waypoints.map((w, i) => {
                  const label = `${CONSTELLATION_CATEGORIES[w.category].icon} ${getCategoryLabel(w.category, lang)}`;
                  const dimmed = filter !== "all" && filter !== w.category;
                  const tx = w.side === "right" ? w.x + 4.5 : w.x - 4.5;
                  return (
                    <text
                      key={`${w.category}-${i}`}
                      x={tx}
                      y={w.y + 1}
                      textAnchor={w.side === "right" ? "start" : "end"}
                      fontSize="2.4"
                      className={dimmed ? "fill-muted" : "fill-ink"}
                      opacity={dimmed ? 0.3 : 0.85}
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {label}
                    </text>
                  );
                })}

                {/* Stars - one per memory, sitting exactly on the path */}
                {layout.stars.map((star, i) => {
                  const color = CONSTELLATION_CATEGORIES[star.category].color;
                  const dimmed = filter !== "all" && filter !== star.category;
                  return (
                    <circle
                      key={star.memory.id}
                      cx={star.x}
                      cy={star.y}
                      r={dimmed ? 0.9 : 1.5}
                      className={`animate-twinkle cursor-pointer ${FILL_CLASS[color]}`}
                      style={{ animationDelay: `${(i % 5) * 0.6}s` }}
                      opacity={dimmed ? 0.25 : 1}
                      onClick={() => setOpenMemory(star.memory)}
                    >
                      <title>{star.memory.reflection}</title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </>
        )}
      </div>

      {openMemory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6 backdrop-blur-sm"
          onClick={() => setOpenMemory(null)}
        >
          <div
            className="haven-surface animate-rise max-w-md rounded-3xl px-7 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted">
                {CONSTELLATION_CATEGORIES[getMemoryCategory(openMemory)].icon}{" "}
                {getCategoryLabel(getMemoryCategory(openMemory), lang)} ·{" "}
                {formatDate(openMemory.createdAt, lang)}
              </span>
              <button
                type="button"
                onClick={() => setOpenMemory(null)}
                aria-label={t.constellationClose}
                className="text-muted hover:text-ink"
              >
                ✕
              </button>
            </div>
            <Moon size={36} className="mt-4" />
            <p className="mt-3 font-serif text-xl text-ink">{deriveMemoryTitle(openMemory, lang)}</p>
            <p className="mt-2 leading-relaxed text-ink/90">{openMemory.reflection}</p>
            {openMemory.standout && (
              <p className="mt-3 font-serif italic text-secondary">{openMemory.standout}</p>
            )}
            {openMemory.emotionKey && (
              <div className="mt-3">
                <EmotionBadge
                  emotionKey={openMemory.emotionKey}
                  lang={lang}
                  confidence={openMemory.confidence}
                  confidenceLabel={t.confidenceLabel}
                />
              </div>
            )}
            {openMemoryGrowth && (
              <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
                {openMemoryGrowth.firstDate
                  ? `${openMemoryGrowth.count} ${t.constellationGrowthSince} ${openMemoryGrowth.firstDate}`
                  : t.constellationGrowthSingle}
              </p>
            )}
            <Link
              href={`/memory#${openMemory.id}`}
              className="mt-4 inline-block text-sm text-primary hover:opacity-70"
            >
              {t.constellationViewFull}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
