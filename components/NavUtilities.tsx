"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useTheme, setTheme } from "@/lib/theme";
import { Moon } from "@/components/mascot/Moon";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <ellipse cx="10" cy="10" rx="3.2" ry="7.5" />
      <line x1="2.5" y1="10" x2="17.5" y2="10" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="10" cy="10" r="3.6" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="10" y1="16" x2="10" y2="18" />
      <line x1="2" y1="10" x2="4" y2="10" />
      <line x1="16" y1="10" x2="18" y2="10" />
      <line x1="4.5" y1="4.5" x2="5.8" y2="5.8" />
      <line x1="14.2" y1="14.2" x2="15.5" y2="15.5" />
      <line x1="4.5" y1="15.5" x2="5.8" y2="14.2" />
      <line x1="14.2" y1="5.8" x2="15.5" y2="4.5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M14.5 2.5A8 8 0 1 0 17.5 15 6.5 6.5 0 0 1 14.5 2.5Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <line x1="10" y1="9" x2="10" y2="14" />
      <circle cx="10" cy="6.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="14" x2="17" y2="14" />
      <circle cx="7" cy="6" r="1.6" fill="var(--paper)" />
      <circle cx="13" cy="10" r="1.6" fill="var(--paper)" />
      <circle cx="9" cy="14" r="1.6" fill="var(--paper)" />
    </svg>
  );
}

const UTILITY_BTN = "flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-line/60 hover:text-ink";

/** Global utilities — lighter weight than the main nav pills, always reachable regardless of viewport. */
export function NavUtilities() {
  const { lang, setLang, t } = useLanguage();
  const theme = useTheme();
  const [aboutOpen, setAboutOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLang(lang === "vi" ? "en" : "vi")}
        aria-label={t.navLanguageLabel}
        className={`${UTILITY_BTN} w-auto gap-1 px-2`}
      >
        <GlobeIcon />
        <span className="text-[0.65rem] font-medium">{lang.toUpperCase()}</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={t.navThemeLabel}
        className={UTILITY_BTN}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </button>

      <button type="button" onClick={() => setAboutOpen(true)} aria-label={t.navAboutLabel} className={UTILITY_BTN}>
        <InfoIcon />
      </button>

      <Link href="/me" aria-label={t.navSettings} className={UTILITY_BTN}>
        <SettingsIcon />
      </Link>

      {aboutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.navAboutLabel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-6 backdrop-blur-sm"
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="haven-surface animate-rise max-w-xs rounded-3xl px-7 py-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Moon size={48} />
            <p className="mt-4 font-serif text-xl text-ink">{t.brand}</p>
            <p className="mt-1 font-serif italic text-secondary">{t.tagline}</p>
            <p className="mt-4 text-xs text-muted">{t.navAboutBody}</p>
            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              className="haven-cta mt-5 rounded-full bg-primary px-5 py-2 text-sm text-white hover:bg-primary-hover"
            >
              {t.constellationClose}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
