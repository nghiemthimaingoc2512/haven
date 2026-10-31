"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, type Lang } from "@/lib/i18n";
import { useProfile, completeOnboarding } from "@/lib/profile";
import { useTheme, setTheme, type ThemePreference } from "@/lib/theme";
import { useHydrated } from "@/lib/hydrated";
import { Moon } from "@/components/mascot/Moon";

// Language comes first so an English speaker never has to read the name
// prompt in Vietnamese; the name is optional - it's only used to say hello.
type Step = "welcome" | "language" | "name" | "appearance" | "home";
const STEP_ORDER: Step[] = ["welcome", "language", "name", "appearance", "home"];

const LANG_OPTIONS: { value: Lang; code: string; label: string; sub: string }[] = [
  { value: "vi", code: "VI", label: "Tiếng Việt", sub: "Haven sẽ nói chuyện bằng tiếng Việt" },
  { value: "en", code: "EN", label: "English", sub: "Haven will talk to you in English" },
];

function SunGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M17 3a9 9 0 1 0 4 15.5A7.5 7.5 0 0 1 17 3Z" />
    </svg>
  );
}

function AutoGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const APPEARANCE_OPTIONS: { value: ThemePreference; glyph: React.ReactNode }[] = [
  { value: "light", glyph: <SunGlyph /> },
  { value: "dark", glyph: <MoonGlyph /> },
  { value: "system", glyph: <AutoGlyph /> },
];

export default function OnboardingPage() {
  const { lang, setLang, t } = useLanguage();
  const profile = useProfile();
  const theme = useTheme();
  const hydrated = useHydrated();
  const router = useRouter();

  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");

  // Already onboarded (returning visit) - go straight home. Wait for the real
  // stored profile; the server snapshot always says "not onboarded".
  useEffect(() => {
    if (hydrated && profile.onboarded) router.replace("/home");
  }, [hydrated, profile.onboarded, router]);

  if (!hydrated || profile.onboarded) return null;

  const appearanceLabel: Record<ThemePreference, string> = {
    light: t.themeLight,
    dark: t.themeDark,
    system: t.themeSystem,
  };

  const stepIndex = STEP_ORDER.indexOf(step);
  const goNext = () => setStep(STEP_ORDER[Math.min(stepIndex + 1, STEP_ORDER.length - 1)]);
  const goBack = () => setStep(STEP_ORDER[Math.max(stepIndex - 1, 0)]);

  const handleEnter = () => {
    completeOnboarding(name);
    router.push("/home");
  };

  const primaryBtn = "haven-cta rounded-full bg-primary px-8 py-3 text-white hover:bg-primary-hover";
  const ghostBtn = "rounded-full px-5 py-3 text-sm text-muted transition-colors hover:text-ink";

  return (
    <main className="haven-moonlight relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="animate-twinkle absolute left-[15%] top-[18%] h-1.5 w-1.5 rounded-full bg-secondary"
      />
      <div
        aria-hidden="true"
        className="animate-twinkle absolute right-[20%] top-[28%] h-1 w-1 rounded-full bg-accent-pink"
        style={{ animationDelay: "1s" }}
      />
      <div
        aria-hidden="true"
        className="animate-twinkle absolute left-[30%] top-[12%] h-1 w-1 rounded-full bg-soft-blue"
        style={{ animationDelay: "1.8s" }}
      />

      {/* Step dots - the welcome and final screens don't count as steps */}
      {step !== "welcome" && step !== "home" && (
        <div className="absolute top-8 flex gap-2" aria-hidden="true">
          {(["language", "name", "appearance"] as Step[]).map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${s === step ? "w-6 bg-primary" : "w-1.5 bg-line"}`}
            />
          ))}
        </div>
      )}

      <div key={step} className="animate-rise relative w-full max-w-xl text-center">
        {step === "welcome" && (
          <div className="flex flex-col items-center">
            <Moon size={104} sway priority />
            <h1 className="mt-6 font-serif text-5xl text-ink">{t.brand}</h1>
            <p className="mt-2 font-serif text-xl italic text-secondary">{t.tagline}</p>
            <div className="mt-6 max-w-md space-y-3 text-[0.95rem] leading-relaxed text-muted">
              <p>{t.welcomeBody}</p>
              <p className="text-sm">{t.welcomeCrisis}</p>
            </div>
            <button type="button" onClick={goNext} className={`mt-8 ${primaryBtn}`}>
              {t.onboardingContinue}
            </button>
          </div>
        )}

        {step === "language" && (
          <div className="flex flex-col items-center">
            <Moon size={72} priority />
            <h1 className="mt-6 font-serif text-3xl text-ink">{t.onboardingLangTitle}</h1>
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              {LANG_OPTIONS.map((option) => {
                const selected = lang === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLang(option.value)}
                    aria-pressed={selected}
                    aria-label={option.label}
                    className={`haven-surface flex flex-1 items-center gap-4 rounded-2xl px-5 py-5 text-left transition-transform hover:-translate-y-0.5 ${
                      selected ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-sans text-sm font-semibold ${
                        selected ? "bg-primary text-white" : "bg-lavender text-ink"
                      }`}
                    >
                      {option.code}
                    </span>
                    <span>
                      <span className="block font-serif text-lg text-ink">{option.label}</span>
                      <span className="block text-xs text-muted">{option.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex items-center gap-3">
              <button type="button" onClick={goBack} className={ghostBtn}>
                {t.onboardingBack}
              </button>
              <button type="button" onClick={goNext} className={primaryBtn}>
                {t.onboardingContinue}
              </button>
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="flex flex-col items-center">
            <Moon size={72} priority />
            <h1 className="mt-6 font-serif text-3xl text-ink">{t.onboardingNameTitle}</h1>
            <p className="mt-2 text-sm text-muted">{t.onboardingNameHint}</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goNext();
              }}
              placeholder={t.onboardingNamePlaceholder}
              maxLength={40}
              autoFocus
              className="haven-surface mt-8 w-full rounded-2xl px-6 py-4 text-center text-2xl text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-10 flex items-center gap-3">
              <button type="button" onClick={goBack} className={ghostBtn}>
                {t.onboardingBack}
              </button>
              <button type="button" onClick={goNext} className={name.trim() ? primaryBtn : ghostBtn}>
                {name.trim() ? t.onboardingContinue : t.onboardingSkip}
              </button>
            </div>
          </div>
        )}

        {step === "appearance" && (
          <div className="flex flex-col items-center">
            <Moon size={72} priority />
            <h1 className="mt-6 font-serif text-3xl text-ink">{t.onboardingAppearanceTitle}</h1>
            <div className="mt-8 flex w-full gap-3">
              {APPEARANCE_OPTIONS.map((option) => {
                const selected = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    aria-pressed={selected}
                    className={`haven-surface flex flex-1 flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center transition-transform hover:-translate-y-0.5 ${
                      selected ? "ring-2 ring-primary text-primary" : "text-muted"
                    }`}
                  >
                    {option.glyph}
                    <span className="text-sm text-ink">{appearanceLabel[option.value]}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex items-center gap-3">
              <button type="button" onClick={goBack} className={ghostBtn}>
                {t.onboardingBack}
              </button>
              <button type="button" onClick={goNext} className={primaryBtn}>
                {t.onboardingContinue}
              </button>
            </div>
          </div>
        )}

        {step === "home" && (
          <div className="flex flex-col items-center">
            <Moon size={104} sway priority />
            <h1 className="mt-6 font-serif text-3xl text-ink">
              {name.trim()
                ? lang === "vi"
                  ? `Chào ${name.trim()}, mừng bạn về nhà.`
                  : `Hi ${name.trim()}, welcome home.`
                : t.welcomeHomeGreeting}
            </h1>
            <p className="mt-3 max-w-sm leading-relaxed text-ink/80">{t.welcomeHomeBody}</p>
            <button type="button" onClick={handleEnter} className={`mt-10 ${primaryBtn}`}>
              {t.onboardingEnter}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
