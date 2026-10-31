"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/i18n";
import type { EmotionKey, Intensity } from "@/lib/emotions";

export interface Memory {
  id: string;
  createdAt: string; // ISO timestamp
  lang: Lang;
  transcript: string;
  reflection: string;
  standout: string | null;
  emotion: string;
  // optional: absent on memories saved before the emotion taxonomy existed
  emotionKey?: EmotionKey;
  intensity?: Intensity;
  confidence?: number;
  topics: string[];
  people: string[];
  // optional: which companion the memory came from (absent = Whisper)
  source?: "whisper" | "aurora";
}

const STORAGE_KEY = "haven:memories:v1";

/**
 * Drop the in-memory snapshot cache after storage was wiped, so the next
 * read doesn't hand back the stale parsed array.
 */
export function resetMemoriesCache(): void {
  cachedRaw = undefined;
  cachedParsed = [];
}

function isMemory(value: unknown): value is Memory {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    typeof m.createdAt === "string" &&
    typeof m.transcript === "string" &&
    typeof m.reflection === "string"
  );
}

/** All saved memories, newest first. Empty array on the server or if storage is unavailable/corrupt. */
export function getAllMemories(): Memory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMemory);
  } catch {
    return [];
  }
}

export function saveMemory(memory: Memory): void {
  if (typeof window === "undefined") return;
  const all = getAllMemories();
  all.unshift(memory);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage full or unavailable - nothing recoverable to do here
  }
}

export function createMemoryId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// --- Reactive read for components (useSyncExternalStore) ---
//
// A plain effect + setState here would re-render one extra time on every
// mount (flagged by this repo's stricter hooks lint) and wouldn't pick up
// changes written from another tab. useSyncExternalStore is the correct
// primitive for "read a value that lives outside React." The snapshot is
// cached by the raw string so unchanged storage returns the same array
// reference - required for useSyncExternalStore to avoid re-render loops.

let cachedRaw: string | null | undefined = undefined;
let cachedParsed: Memory[] = [];

function getMemoriesSnapshot(): Memory[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedParsed;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedParsed = Array.isArray(parsed) ? parsed.filter(isMemory) : [];
  } catch {
    cachedParsed = [];
  }
  return cachedParsed;
}

const EMPTY_MEMORIES: Memory[] = [];

function getServerMemoriesSnapshot(): Memory[] {
  // must return the same reference every call - a fresh [] here breaks
  // useSyncExternalStore's equality check and loops
  return EMPTY_MEMORIES;
}

function subscribeToMemories(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/** Reactive list of saved memories, newest first - updates if another tab writes to storage. */
export function useMemories(): Memory[] {
  return useSyncExternalStore(
    subscribeToMemories,
    getMemoriesSnapshot,
    getServerMemoriesSnapshot,
  );
}
