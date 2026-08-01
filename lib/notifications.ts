"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "haven:notifications";

let current = false;
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function getSnapshot(): boolean {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    current = readStored();
  }
  return current;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function setNotifications(on: boolean): void {
  current = on;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // ignore - preference just won't persist this session
  }
  for (const listener of listeners) listener();
}

export function useNotifications(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
