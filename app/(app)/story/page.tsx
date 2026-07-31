"use client";

import { useMemo, useState } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import { useMemories, type Memory } from "@/lib/storage";
import {
  CONSTELLATION_CATEGORIES,
  computeStarPosition,
  getCategoryLabel,
  getMemoryCategory,
  type ConstellationCategory,
  type ConstellationColor,
} from "@/lib/constellation";
import { Moon } from "@/components/mascot/Moon";

const CATEGORY_LIST = Object.keys(CONSTELLATION_CATEGORIES) as ConstellationCategory[];

// Literal class names so Tailwind's static scanner can find them — a
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

export default function StoryPage() {
  const { lang, t } = useLanguage();
  const memories = useMemories();
  const [filter, setFilter] = useState<ConstellationCategory | "all">("all");
  const [zoom, setZoom] = useState(1);
  const [openMemory, setOpenMemory] = useState<Memory | null>(null);

  const visible = filter === "all" ? memories : memories.filter((m) => getMemoryCategory(m) === filter);

  const activeCategories = useMemo(() => {
    const set = new Set<ConstellationCategory>();
    for (const m of memories) set.add(getMemoryCategory(m));
    return set;
  }, [memories]);

  // faint lines connecting each category's stars, oldest to newest
  const connections = useMemo(() => {
    const byCategory = new Map<ConstellationCategory, Memory[]>();
    for (const m of visible) {
      const cat = getMemoryCategory(m);
      const list = byCategory.get(cat) ?? [];
      list.push(m);
      byCategory.set(cat, list);
    }
    const lines: { category: ConstellationCategory; points: string }[] = [];
    for (const [category, list] of byCategory) {
      if (list.length < 2) continue;
      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const points = sorted
        .map((m) => {
          const p = computeStarPosition(m);
          return `${p.x},${p.y}`;
        })
        .join(" ");
      lines.push({ category, points });
    }
    return lines;
  }, [visible]);

  return (
    <div className="haven-night-sky min-h-full px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <Moon size={40} glow={false} />
          <h1 className="font-serif text-3xl text-ink">{t.storyTitle}</h1>
        </div>

        {memories.length === 0 ? (
          <div className="haven-surface animate-rise mt-8 flex flex-col items-center gap-3 rounded-2xl px-6 py-10 text-center">
            <Moon size={56} />
            <p className="text-muted">{t.constellationEmpty}</p>
          </div>
        ) : (
          <>
            {/* Category filter */}
            <div className="mt-6 flex flex-wrap gap-2">
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

            {/* Zoom controls */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                aria-label={t.constellationZoomOut}
                className="haven-surface h-8 w-8 rounded-full text-ink"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                aria-label={t.constellationZoomIn}
                className="haven-surface h-8 w-8 rounded-full text-ink"
              >
                +
              </button>
            </div>

            {/* Star field */}
            <div className="haven-surface animate-rise mt-4 aspect-square w-full overflow-hidden rounded-3xl">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full transition-transform duration-500"
                style={{ transform: `scale(${zoom})` }}
              >
                {connections.map((line) => (
                  <polyline
                    key={line.category}
                    points={line.points}
                    fill="none"
                    className={STROKE_CLASS[CONSTELLATION_CATEGORIES[line.category].color]}
                    strokeWidth="0.3"
                    opacity="0.35"
                  />
                ))}
                {visible.map((memory) => {
                  const pos = computeStarPosition(memory);
                  const category = getMemoryCategory(memory);
                  const color = CONSTELLATION_CATEGORIES[category].color;
                  return (
                    <circle
                      key={memory.id}
                      cx={pos.x}
                      cy={pos.y}
                      r={pos.size / 4}
                      className={`animate-twinkle cursor-pointer ${FILL_CLASS[color]}`}
                      style={{ animationDelay: `${pos.twinkleDelay}s` }}
                      onClick={() => setOpenMemory(memory)}
                    >
                      <title>{memory.reflection}</title>
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
            <Moon size={36} glow={false} className="mt-4" />
            <p className="mt-3 font-serif text-lg leading-relaxed text-ink">
              {openMemory.reflection}
            </p>
            {openMemory.standout && (
              <p className="mt-3 font-serif italic text-secondary">{openMemory.standout}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
