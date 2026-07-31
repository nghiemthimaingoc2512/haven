"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { generateAdvice, starterPrompts, type AuroraResponse } from "@/lib/aurora";
import { Moon } from "@/components/mascot/Moon";

export default function AuroraPage() {
  const { lang, t } = useLanguage();
  const [problem, setProblem] = useState("");
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("");
  const [submitted, setSubmitted] = useState<{ problem: string; context: string; goal: string } | null>(null);
  const [response, setResponse] = useState<AuroraResponse | null>(null);

  const ask = (text: string, ctx = context, g = goal) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitted({ problem: trimmed, context: ctx, goal: g });
    setResponse(generateAdvice(trimmed, ctx, g, lang));
  };

  const reset = () => {
    setProblem("");
    setContext("");
    setGoal("");
    setSubmitted(null);
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
        <div className="flex items-center gap-3">
          <Moon size={44} sway priority />
          <div>
            <h1 className="font-serif text-3xl text-ink">{t.navDiscover}</h1>
            <p className="text-secondary">{t.auroraIntro}</p>
          </div>
        </div>

        {!response ? (
          <div className="mt-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(problem);
              }}
              className="flex flex-col gap-5"
            >
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">{t.auroraProblemLabel}</label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder={t.auroraPlaceholder}
                  rows={3}
                  className="haven-surface mt-2 w-full resize-none rounded-2xl px-5 py-4 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-muted">{t.auroraContextLabel}</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={t.auroraContextPlaceholder}
                  rows={2}
                  className="haven-surface mt-2 w-full resize-none rounded-2xl px-5 py-4 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-muted">{t.auroraGoalLabel}</label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={t.auroraGoalPlaceholder}
                  rows={2}
                  className="haven-surface mt-2 w-full resize-none rounded-2xl px-5 py-4 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={!problem.trim()}
                className={`haven-cta self-end rounded-full px-6 py-2.5 text-sm ${
                  problem.trim()
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
                  onClick={() => ask(prompt, context, goal)}
                  className="haven-surface animate-rise rounded-2xl px-5 py-4 text-left text-sm text-ink transition-transform hover:-translate-y-0.5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-rise mt-8 space-y-4">
            {/* Problem */}
            <div className="haven-surface rounded-2xl px-6 py-5">
              <p className="text-xs uppercase tracking-wide text-muted">{t.auroraProblemLabel}</p>
              <p className="mt-1 text-ink">{submitted?.problem}</p>
            </div>

            {/* Context + Goal, only if the user actually gave them — real input, not fabricated stages */}
            {(submitted?.context || submitted?.goal) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {submitted?.context && (
                  <div className="haven-surface rounded-2xl px-6 py-5">
                    <p className="text-xs uppercase tracking-wide text-muted">{t.auroraContextLabel}</p>
                    <p className="mt-1 text-ink/90">{submitted.context}</p>
                  </div>
                )}
                {submitted?.goal && (
                  <div className="haven-surface rounded-2xl px-6 py-5">
                    <p className="text-xs uppercase tracking-wide text-muted">{t.auroraGoalLabel}</p>
                    <p className="mt-1 text-ink/90">{submitted.goal}</p>
                  </div>
                )}
              </div>
            )}

            {/* Options, if detected */}
            {response.optionsDetected && (
              <div className="haven-surface rounded-2xl px-6 py-5">
                <p className="text-xs uppercase tracking-wide text-muted">{t.auroraOptionsLabel}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {response.optionsDetected.map((opt) => (
                    <span key={opt} className="rounded-full bg-secondary/25 px-3 py-1 text-sm text-ink">
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI reasoning, with the mascot beside it as the thoughtful companion speaking */}
            <div className="haven-surface rounded-2xl bg-star/15 px-6 py-6">
              <div className="flex items-start gap-3">
                <Moon size={36} glow={false} />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">{t.auroraReasoningLabel}</p>
                  <p className="mt-2 font-serif text-xl leading-relaxed text-ink">{response.reasoning}</p>
                </div>
              </div>
            </div>

            <div className="haven-surface rounded-2xl px-6 py-6">
              <p className="text-xs uppercase tracking-wide text-muted">{t.auroraConsiderLabel}</p>
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
              <p className="text-xs uppercase tracking-wide text-muted">{t.auroraRecommendationLabel}</p>
              <p className="mt-2 text-ink">{response.recommendation}</p>
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
