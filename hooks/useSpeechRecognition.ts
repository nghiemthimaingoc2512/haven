"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

function subscribeToNothing() {
  // support never changes over a session's lifetime - nothing to subscribe to
  return () => {};
}

function getSupportSnapshot(): boolean {
  return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

function getServerSupportSnapshot(): boolean {
  // unknown on the server; resolved on the client before first paint of any
  // state that depends on it
  return true;
}

export type SpeechRecognitionStatus =
  | "idle"
  | "listening"
  | "paused"
  | "permission-denied"
  | "unsupported"
  | "network-error";

interface UseSpeechRecognitionOptions {
  locale?: string;
  onFinalResult?: (text: string) => void;
  onInterimResult?: (text: string) => void;
}

interface UseSpeechRecognitionResult {
  status: SpeechRecognitionStatus;
  isSupported: boolean;
  start: () => void;
  pause: () => void;
  stop: () => void;
}

/**
 * Wraps the browser Web Speech API. Owns nothing about the transcript itself -
 * it only reports final and interim chunks upward, so the caller stays the
 * single source of truth for the document (and can freely let the person
 * edit it by hand at any time).
 */
export function useSpeechRecognition({
  locale = "vi-VN",
  onFinalResult,
  onInterimResult,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionResult {
  const [status, setStatus] = useState<SpeechRecognitionStatus>("idle");
  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    getSupportSnapshot,
    getServerSupportSnapshot,
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldBeListeningRef = useRef(false);
  const onFinalResultRef = useRef(onFinalResult);
  const onInterimResultRef = useRef(onInterimResult);
  const localeRef = useRef(locale);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  useEffect(() => {
    onInterimResultRef.current = onInterimResult;
  }, [onInterimResult]);

  const getRecognition = useCallback((): SpeechRecognition | null => {
    if (recognitionRef.current) return recognitionRef.current;
    if (typeof window === "undefined") return null;

    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return null;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = localeRef.current;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          const trimmed = text.trim();
          if (trimmed) onFinalResultRef.current?.(trimmed);
        } else {
          interim += text;
        }
      }
      onInterimResultRef.current?.(interim.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (
        event.error === "not-allowed" ||
        event.error === "permission-denied" ||
        event.error === "service-not-allowed"
      ) {
        shouldBeListeningRef.current = false;
        setStatus("permission-denied");
        return;
      }
      if (event.error === "network") {
        shouldBeListeningRef.current = false;
        setStatus("network-error");
        return;
      }
      if (event.error === "no-speech" || event.error === "aborted") {
        // benign - silence or an intentional stop; onend decides what happens next
        return;
      }
      shouldBeListeningRef.current = false;
      setStatus("idle");
    };

    recognition.onend = () => {
      onInterimResultRef.current?.("");
      if (shouldBeListeningRef.current) {
        // the browser ends a session on its own after a stretch of silence even
        // in continuous mode - restart quietly so talking feels uninterrupted
        window.setTimeout(() => {
          if (!shouldBeListeningRef.current) return;
          try {
            recognition.start();
          } catch {
            // already starting - ignore
          }
        }, 50);
      }
    };

    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const start = useCallback(() => {
    const recognition = getRecognition();
    if (!recognition) {
      setStatus("unsupported");
      return;
    }
    // pick up a language change even on an already-created instance
    recognition.lang = localeRef.current;
    shouldBeListeningRef.current = true;
    try {
      recognition.start();
      setStatus("listening");
    } catch {
      // already listening - ignore
    }
  }, [getRecognition]);

  const pause = useCallback(() => {
    shouldBeListeningRef.current = false;
    recognitionRef.current?.stop();
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    shouldBeListeningRef.current = false;
    recognitionRef.current?.stop();
    setStatus("idle");
  }, []);

  useEffect(() => {
    return () => {
      shouldBeListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    status: isSupported ? status : "unsupported",
    isSupported,
    start,
    pause,
    stop,
  };
}
