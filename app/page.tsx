"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, type Lang } from "@/lib/i18n";
import { useProfile, completeOnboarding } from "@/lib/profile";
import { useTheme, setTheme, type ThemePreference } from "@/lib/theme";
import { Moon } from "@/components/mascot/Moon";

type Step = "welcome" | "name" | "language" | "appearance" | "home";

const APPEARANCE_OPTIONS: { value: ThemePreference; icon: string }[] = [
  { value: "light", icon: "☀️" },
  { value: "dark", icon: "🌙" },
  { value: "system", icon: "🌗" },
];

export default function OnboardingPage() {
  const { lang, setLang, t } = useLanguage();
  const profile = useProfile();
  const theme = useTheme();
  const router = useRouter();

  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");

  // Already onboarded (returning visit) — go straight home.
  useEffect(() => {
    if (profile.onboarded) router.replace("/home");
  }, [profile.onboarded, router]);

  if (profile.onboarded) return null;

  const appearanceLabel: Record<ThemePreference, string> = {
    light: t.themeLight,
    dark: t.themeDark,
    system: t.onboardingAuto,
  };

  const handleEnter = () => {
    completeOnboarding(name);
    router.push("/home");
  };

  return (
    <main className="haven-moonlight relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-24">
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

      <div className="animate-rise relative w-full max-w-xl text-center">
        {step === "welcome" && (
          <div className="flex flex-col items-center">
            <Moon size={104} sway priority />
            <h1 className="mt-6 font-serif text-5xl text-ink">{t.brand}</h1>
            <p className="mt-2 font-serif text-xl italic text-secondary">
              {t.tagline}
            </p>
            <div className="mt-6 max-w-sm space-y-2 text-sm text-muted">
              <p>{t.welcomeBody}</p>
              <p>{t.welcomeCrisis}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("name")}
              className="mt-8 haven-cta rounded-full bg-primary px-8 py-3 text-white hover:bg-primary-hover"
            >
              {t.onboardingContinue}
            </button>
          </div>
        )}

        {step === "name" && (
          <div className="flex flex-col items-center">
            <Moon size={72} />
            <h1 className="mt-6 font-serif text-3xl text-ink">
              {t.onboardingNameTitle}
            </h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) setStep("language");
              }}
              placeholder={t.onboardingNamePlaceholder}
              autoFocus
              className="haven-surface mt-8 w-full rounded-2xl px-6 py-4 text-center text-2xl text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setStep("language")}
              disabled={!name.trim()}
              className={`mt-10 rounded-full px-8 py-3 transition-colors ${
                name.trim()
                  ? "haven-cta bg-primary text-white hover:bg-primary-hover"
                  : "cursor-not-allowed bg-line text-muted"
              }`}
            >
              {t.onboardingContinue}
            </button>
          </div>
        )}

        {step === "language" && (
          <div className="flex flex-col items-center">
            <h1 className="font-serif text-3xl text-ink">
              {t.onboardingLangTitle}
            </h1>
            <div className="mt-8 flex w-full gap-4">
              {(
                [
                  { value: "vi" as Lang, flag: "🇻🇳", label: "Tiếng Việt" },
                  { value: "en" as Lang, flag: "🇺🇸", label: "English" },
                ]
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLang(option.value)}
                  aria-pressed={lang === option.value}
                  className={`haven-surface flex-1 rounded-2xl px-6 py-6 text-center transition-transform hover:-translate-y-0.5 ${
                    lang === option.value ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <span className="text-3xl">{option.flag}</span>
                  <p className="mt-2 text-ink">{option.label}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep("appearance")}
              className="mt-10 haven-cta rounded-full bg-primary px-8 py-3 text-white hover:bg-primary-hover"
            >
              {t.onboardingContinue}
            </button>
          </div>
        )}

        {step === "appearance" && (
          <div className="flex flex-col items-center">
            <h1 className="font-serif text-3xl text-ink">
              {t.onboardingAppearanceTitle}
            </h1>
            <div className="mt-8 flex w-full gap-3">
              {APPEARANCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  aria-pressed={theme === option.value}
                  className={`haven-surface flex-1 rounded-2xl px-4 py-6 text-center transition-transform hover:-translate-y-0.5 ${
                    theme === option.value ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <p className="mt-2 text-sm text-ink">
                    {appearanceLabel[option.value]}
                  </p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep("home")}
              className="mt-10 haven-cta rounded-full bg-primary px-8 py-3 text-white hover:bg-primary-hover"
            >
              {t.onboardingContinue}
            </button>
          </div>
        )}

        {step === "home" && (
          <div className="flex flex-col items-center">
            <Moon size={104} sway />
            <h1 className="mt-6 font-serif text-3xl text-ink">
              {t.welcomeHomeGreeting}
            </h1>
            <p className="mt-3 max-w-sm text-ink/80">
              {name ? `${name}, ` : ""}
              {t.welcomeHomeBody}
            </p>
            <button
              type="button"
              onClick={handleEnter}
              className="mt-10 haven-cta rounded-full bg-primary px-8 py-3 text-white hover:bg-primary-hover"
            >
              {t.onboardingEnter}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
