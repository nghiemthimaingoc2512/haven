"use client";

import { useState } from "react";
import { useDayPeriod } from "@/lib/insights";
import { useTheme, setTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/i18n";
import { Moon } from "@/components/mascot/Moon";

const PROMPT_KEY = "haven:nightModePromptDate";

function hasAskedToday(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PROMPT_KEY) === new Date().toDateString();
  } catch {
    return false;
  }
}

/**
 * Offers Night Mode once per day after 9pm local time — never forces it.
 * `show` is a pure derived value (period is already SSR-safe via
 * useDayPeriod, and short-circuits before the localStorage read), so there's
 * no effect/setState involved in deciding visibility at all.
 */
export function NightModePrompt() {
  const { t } = useLanguage();
  const period = useDayPeriod();
  const theme = useTheme();
  const [dismissed, setDismissed] = useState(false);

  const show =
    period === "night" && theme !== "dark" && !dismissed && !hasAskedToday();

  const rememberAskedToday = () => {
    try {
      window.localStorage.setItem(PROMPT_KEY, new Date().toDateString());
    } catch {
      // ignore — will just ask again next time
    }
  };

  const handleLater = () => {
    rememberAskedToday();
    setDismissed(true);
  };

  const handleAccept = () => {
    setTheme("dark");
    rememberAskedToday();
    setDismissed(true);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.nightPromptTitle}
      className="animate-rise fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-6 backdrop-blur-sm"
    >
      <div className="haven-surface max-w-sm rounded-3xl px-8 py-8 text-center">
        <Moon state="sleeping" size={64} />
        <p className="mt-4 font-serif text-xl text-ink">
          {t.nightPromptTitle}
        </p>
        <p className="mt-2 text-sm text-muted">{t.nightPromptBody}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="haven-cta rounded-full bg-primary px-6 py-3 text-white hover:bg-primary-hover"
          >
            {t.nightPromptAccept}
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="text-sm text-muted hover:text-ink"
          >
            {t.nightPromptLater}
          </button>
        </div>
      </div>
    </div>
  );
}
