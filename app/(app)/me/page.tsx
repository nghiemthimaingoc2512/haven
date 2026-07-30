"use client";

import { useLanguage, type Lang } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { useTheme, setTheme, type ThemePreference } from "@/lib/theme";

const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];
const LANG_OPTIONS: { value: Lang; flag: string; label: string }[] = [
  { value: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { value: "en", flag: "🇺🇸", label: "English" },
];

export default function MePage() {
  const { lang, setLang, t } = useLanguage();
  const profile = useProfile();
  const theme = useTheme();

  const themeLabel: Record<ThemePreference, string> = {
    light: t.themeLight,
    dark: t.themeDark,
    system: t.themeSystem,
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-10">
      <h1 className="font-serif text-3xl text-ink">{t.navMe}</h1>

      <div className="haven-surface animate-rise mt-8 rounded-2xl px-6 py-6">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t.profileLabel}
        </p>
        <p className="mt-2 font-serif text-xl text-ink">
          {profile.name || "—"}
        </p>
      </div>

      <div className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-6">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t.languageLabel}
        </p>
        <div className="mt-3 flex gap-2">
          {LANG_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLang(option.value)}
              aria-pressed={lang === option.value}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                lang === option.value
                  ? "border-primary bg-card text-ink"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              <span aria-hidden="true">{option.flag}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-6">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t.themeLabel}
        </p>
        <div className="mt-3 flex gap-2">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              aria-pressed={theme === option}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                theme === option
                  ? "border-primary bg-card text-ink"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {themeLabel[option]}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted">{t.comingSoon}</p>
    </div>
  );
}
