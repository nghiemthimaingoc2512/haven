"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { useTheme, setTheme, type ThemePreference } from "@/lib/theme";
import { useNotifications, setNotifications } from "@/lib/notifications";
import { getAllMemories, useMemories } from "@/lib/storage";
import { Moon } from "@/components/mascot/Moon";
import { EmotionInsights } from "@/components/EmotionInsights";

const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];
const LANG_OPTIONS: { value: Lang; flag: string; label: string }[] = [
  { value: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { value: "en", flag: "🇺🇸", label: "English" },
];

const APP_VERSION = "Alpha 0.3";

function SettingCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-6">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      {children}
    </div>
  );
}

export default function MePage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const profile = useProfile();
  const theme = useTheme();
  const notifications = useNotifications();
  const memories = useMemories();
  const [exported, setExported] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const themeLabel: Record<ThemePreference, string> = {
    light: t.themeLight,
    dark: t.themeDark,
    system: t.themeSystem,
  };

  const handleExport = () => {
    const data = JSON.stringify(getAllMemories(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "haven-memories.json";
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  const handleDeleteAll = () => {
    try {
      window.localStorage.clear();
    } catch {
      // ignore
    }
    router.push("/");
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-10">
      <div className="flex items-center gap-3">
        <Moon size={40} glow={false} />
        <h1 className="font-serif text-3xl text-ink">{t.navMe}</h1>
      </div>

      <SettingCard label={t.profileLabel}>
        <p className="mt-2 font-serif text-xl text-ink">{profile.name || "—"}</p>
      </SettingCard>

      <SettingCard label={t.languageLabel}>
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
      </SettingCard>

      <SettingCard label={t.themeLabel}>
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
      </SettingCard>

      <SettingCard label={t.meNotifications}>
        <button
          type="button"
          onClick={() => setNotifications(!notifications)}
          aria-pressed={notifications}
          className={`mt-3 flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
            notifications ? "bg-primary" : "bg-line"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white transition-transform ${
              notifications ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </SettingCard>

      <SettingCard label={t.meAiMemory}>
        <p className="mt-2 text-ink/90">{t.meAiMemoryBody}</p>
        <p className="mt-2 text-sm text-secondary">{memories.length}</p>
      </SettingCard>

      <div className="mt-4">
        <EmotionInsights memories={memories} />
      </div>

      <SettingCard label={t.mePrivacy}>
        <p className="mt-2 text-ink/90">{t.mePrivacyBody}</p>
      </SettingCard>

      <SettingCard label={t.meExport}>
        <button
          type="button"
          onClick={handleExport}
          className="haven-cta mt-3 rounded-full bg-primary px-5 py-2 text-sm text-white hover:bg-primary-hover"
        >
          {t.meExport}
        </button>
        {exported && <p className="mt-2 text-sm text-secondary">{t.meExportDone}</p>}
      </SettingCard>

      <SettingCard label={t.meDeleteData}>
        {confirmingDelete ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-signal">{t.meDeleteConfirm}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDeleteAll}
                className="rounded-full bg-signal px-4 py-2 text-sm text-white"
              >
                {t.meDeleteData}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-full border border-line px-4 py-2 text-sm text-muted"
              >
                {t.meDeleteCancel}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="mt-3 text-sm text-signal hover:opacity-70"
          >
            {t.meDeleteData}
          </button>
        )}
      </SettingCard>

      <SettingCard label={t.meAbout}>
        <p className="mt-2 text-ink/90">{t.tagline}</p>
        <p className="mt-3 text-xs text-muted">
          {t.meVersion}: {APP_VERSION}
        </p>
        <p className="mt-1 text-xs text-muted">{t.meSupportBody}</p>
      </SettingCard>
    </div>
  );
}
