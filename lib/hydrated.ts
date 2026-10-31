"use client";

import { useSyncExternalStore } from "react";

function subscribeNever(): () => void {
  return () => {};
}

/**
 * `false` during SSR and the hydration render, `true` from the first
 * client render onward. Every store in lib/ (profile, theme, lang) serves a
 * deterministic default as its server snapshot, so any effect that reacts to
 * those values - most importantly the onboarding redirect in app/(app)/layout
 * - must wait for this flag, or it acts on the default instead of the real
 * stored value.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
