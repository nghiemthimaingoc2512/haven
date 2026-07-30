"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "haven:dream-journal";

let cachedRaw: string | null | undefined = undefined;
let cachedValue = "";

function getSnapshot(): string {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = raw ?? "";
  return cachedValue;
}

function getServerSnapshot(): string {
  return "";
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useDreamJournal(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveDreamJournal(text: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, text);
  } catch {
    // ignore — just won't persist this session
  }
}
