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

/** Inlined into a pre-hydration <script> in app/layout.tsx — keep in sync with readStoredTheme/applyToDom above. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
