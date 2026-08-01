"use client";

import { useSyncExternalStore } from "react";

export interface Profile {
  name: string;
  onboarded: boolean;
}

const STORAGE_KEY = "haven:profile";
const DEFAULT_PROFILE: Profile = { name: "", onboarded: false };

// Same useSyncExternalStore pattern as lib/i18n.tsx and lib/storage.ts -
// deterministic default on the server/first paint, corrected immediately
// after mount, same-tab updates broadcast through a plain listener set
// rather than a setState-in-effect this repo's hooks lint flags.
let current: Profile = DEFAULT_PROFILE;
let hydrated = false;
const listeners = new Set<() => void>();

function readStoredProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as Record<string, unknown>).name === "string" &&
      typeof (parsed as Record<string, unknown>).onboarded === "boolean"
    ) {
      return parsed as Profile;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_PROFILE;
}

function notify() {
  for (const listener of listeners) listener();
}

function getSnapshot(): Profile {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    current = readStoredProfile();
  }
  return current;
}

function getServerSnapshot(): Profile {
  return DEFAULT_PROFILE;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function persist(next: Profile) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // preference just won't persist this session
  }
  notify();
}

export function completeOnboarding(name: string): void {
  persist({ name: name.trim(), onboarded: true });
}

/**
 * There's no real auth in this local-only prototype, so "sign out" means
 * what it honestly can here: return to onboarding. It never touches
 * memories or settings - only re-entering the app is required, nothing is
 * deleted. (Full data deletion is a separate, explicit action on Me.)
 */
export function signOut(): void {
  persist({ ...current, onboarded: false });
}

export function useProfile(): Profile {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
