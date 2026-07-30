"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { generateAdvice, starterPrompts, type AuroraResponse } from "@/lib/aurora";

export default function AuroraPage() {
  const { lang, t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<AuroraResponse | null>(null);

  const ask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setResponse(generateAdvice(trimmed, lang));
  };

  const reset = () => {
    setQuestion("");
    setResponse(null);
  };

  return (
    <div className="haven-aurora relative min-h-full overflow-hidden px-6 py-10">
      <div aria-hidden="true" className="animate-twinkle absolute left-[10%] top-10 text-lg text-star">
        ✦
      </div>
      <div
        aria-hidden="true"
        className="animate-twinkle absolute right-[15%] top-24 text-sm text-star"
        style={{ animationDelay: "1.2s" }}
      >
        ✦
      </div>
      <div
        aria-hidden="true"
        className="animate-twinkle absolute left-[25%] top-40 text-xs text-accent-pink"
        style={{ animationDelay: "2s" }}
      >
        ✦
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <h1 className="font-serif text-3xl text-ink">{t.navDiscover}</h1>
        <p className="mt-1 text-secondary">{t.auroraIntro}</p>

        {!response ? (
          <div className="mt-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(question);
              }}
              className="flex flex-col gap-3"
            >
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.auroraPlaceholder}
                rows={3}
                className="haven-surface w-full resize-none rounded-2xl px-5 py-4 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!question.trim()}
                className={`haven-cta self-end rounded-full px-6 py-2.5 text-sm ${
                  question.trim()
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "cursor-not-allowed bg-line text-muted"
                }`}
              >
                {t.auroraSend}
              </button>
            </form>

            <p className="mt-8 text-xs uppercase tracking-wide text-muted">
              {t.auroraTryPrompt}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {starterPrompts(lang).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => ask(prompt)}
                  className="haven-surface animate-rise rounded-2xl px-5 py-4 text-left text-sm text-ink transition-transform hover:-translate-y-0.5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-rise mt-8 space-y-4">
            <div className="haven-surface rounded-2xl px-6 py-5">
              <p className="text-xs uppercase tracking-wide text-muted">
                {question}
              </p>
            </div>

            <div className="haven-surface rounded-2xl bg-star/15 px-6 py-6">
              <p className="text-xs uppercase tracking-wide text-muted">
                {t.auroraReframeLabel}
              </p>
              <p className="mt-2 font-serif text-xl leading-relaxed text-ink">
                {response.reframe}
              </p>
            </div>

            <div className="haven-surface rounded-2xl px-6 py-6">
              <p className="text-xs uppercase tracking-wide text-muted">
                {t.auroraConsiderLabel}
              </p>
              <ul className="mt-3 space-y-2">
                {response.considerations.map((c) => (
                  <li key={c} className="flex gap-2 text-ink/90">
                    <span aria-hidden="true" className="text-accent-pink">
                      ✦
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="haven-surface rounded-2xl bg-accent-pink/15 px-6 py-6">
              <p className="text-xs uppercase tracking-wide text-muted">
                {t.auroraNextStepLabel}
              </p>
              <p className="mt-2 text-ink">{response.nextStep}</p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="text-sm text-primary hover:opacity-70"
            >
              {t.auroraNewQuestion}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
