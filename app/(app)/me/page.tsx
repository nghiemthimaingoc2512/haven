"use client";

import { useState } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import { useProfile, updateName, resetProfile } from "@/lib/profile";
import { useTheme, setTheme, resetTheme, type ThemePreference } from "@/lib/theme";
import { getAllMemories, useMemories, resetMemoriesCache } from "@/lib/storage";
import { Moon } from "@/components/mascot/Moon";
import { EmotionInsights } from "@/components/EmotionInsights";

const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];
const LANG_OPTIONS: { value: Lang; code: string; label: string }[] = [
  { value: "vi", code: "VI", label: "Tiếng Việt" },
  { value: "en", code: "EN", label: "English" },
];

const APP_VERSION = "Beta 0.4";

function SettingCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="haven-surface animate-rise mt-4 rounded-2xl px-6 py-6">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      {children}
    </section>
  );
}

const PILL = "rounded-full border px-4 py-2 text-sm transition-colors";
const PILL_ON = "border-primary bg-primary/10 text-ink";
const PILL_OFF = "border-line text-muted hover:text-ink";

export default function MePage() {
  const { lang, setLang, t } = useLanguage();
  const profile = useProfile();
  const theme = useTheme();
  const memories = useMemories();
  const [exported, setExported] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.name);

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
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoking synchronously cancels the download in Firefox/Safari.
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setExported(true);
  };

  const handleSaveName = () => {
    updateName(nameDraft);
    setEditingName(false);
  };

  const handleDeleteAll = () => {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch {
      // ignore
    }
    // Every store caches its value in module scope - clear those too, then
    // do a full navigation so nothing stale survives.
    resetMemoriesCache();
    resetTheme();
    resetProfile();
    window.location.assign("/");
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-10">
      <div className="flex items-center gap-3">
        <Moon size={40} priority />
        <h1 className="font-serif text-3xl text-ink">{t.navMe}</h1>
      </div>

      <SettingCard label={t.profileLabel}>
        {editingName ? (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") setEditingName(false);
              }}
              maxLength={40}
              autoFocus
              placeholder={t.onboardingNamePlaceholder}
              className="haven-surface flex-1 rounded-full px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveName}
                className="haven-cta rounded-full bg-primary px-5 py-2 text-sm text-white hover:bg-primary-hover"
              >
                {t.profileSave}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNameDraft(profile.name);
                  setEditingName(false);
                }}
                className={`${PILL} ${PILL_OFF}`}
              >
                {t.meDeleteCancel.split(",")[0]}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="font-serif text-xl text-ink">{profile.name || "—"}</p>
            <button
              type="button"
              onClick={() => {
                setNameDraft(profile.name);
                setEditingName(true);
              }}
              className="text-sm text-primary hover:opacity-70"
            >
              {t.profileEdit}
            </button>
          </div>
        )}
      </SettingCard>

      <SettingCard label={t.languageLabel}>
        <div className="mt-3 flex flex-wrap gap-2">
          {LANG_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLang(option.value)}
              aria-pressed={lang === option.value}
              className={`${PILL} flex items-center gap-2 ${lang === option.value ? PILL_ON : PILL_OFF}`}
            >
              <span className="font-sans text-[0.65rem] font-semibold tracking-wide">{option.code}</span>
              {option.label}
            </button>
          ))}
        </div>
      </SettingCard>

      <SettingCard label={t.themeLabel}>
        <div className="mt-3 flex flex-wrap gap-2">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              aria-pressed={theme === option}
              className={`${PILL} ${theme === option ? PILL_ON : PILL_OFF}`}
            >
              {themeLabel[option]}
            </button>
          ))}
        </div>
      </SettingCard>

      <SettingCard label={t.meAiMemory}>
        <p className="mt-2 text-ink/90">{t.meAiMemoryBody}</p>
        <p className="mt-3 text-sm text-secondary">
          <span className="font-serif text-xl text-ink">{memories.length}</span> {t.meMemoryCount}
        </p>
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
          <div className="mt-3 space-y-3">
            <p className="text-sm text-signal">{t.meDeleteConfirm}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDeleteAll}
                className="rounded-full bg-signal px-4 py-2 text-sm text-white hover:opacity-90"
              >
                {t.meDeleteData}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className={`${PILL} ${PILL_OFF}`}
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
        <p className="mt-2 font-serif italic text-ink/90">{t.tagline}</p>
        <p className="mt-3 text-xs text-muted">
          {t.meVersion}: {APP_VERSION}
        </p>
        <p className="mt-1 text-xs text-muted">{t.meSupportBody}</p>
      </SettingCard>
    </div>
  );
}
