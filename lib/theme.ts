"use client";

import { useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "haven:theme";
const DEFAULT_THEME: ThemePreference = "system";

let current: ThemePreference = DEFAULT_THEME;
let hydrated = false;
const listeners = new Set<() => void>();

function readStoredTheme(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_THEME;
}

function applyToDom(theme: ThemePreference) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function notify() {
  for (const listener of listeners) listener();
}

function getSnapshot(): ThemePreference {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    current = readStoredTheme();
  }
  return current;
}

function getServerSnapshot(): ThemePreference {
  return DEFAULT_THEME;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function setTheme(next: ThemePreference): void {
  current = next;
  applyToDom(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // preference just won't persist this session
  }
  notify();
}

export function useTheme(): ThemePreference {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeToSystemDark(callback: () => void): () => void {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** Whether the page is actually dark right now - resolves "system" against the OS. */
export function useIsDarkTheme(theme: ThemePreference): boolean {
  const systemDark = useSyncExternalStore(
    subscribeToSystemDark,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
  return theme === "dark" || (theme === "system" && systemDark);
}

/**
 * Forget the in-memory preference after storage was wiped ("delete all
 * data"), so the next read starts from the default instead of a stale cache.
 */
export function resetTheme(): void {
  current = DEFAULT_THEME;
  hydrated = false;
  applyToDom(DEFAULT_THEME);
  notify();
}

/** Inlined into a pre-hydration <script> in app/layout.tsx - keep in sync with readStoredTheme/applyToDom above. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
