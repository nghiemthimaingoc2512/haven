"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  openConversation,
  continueConversation,
  starterPrompts,
  type AuroraOpening,
  type AuroraFollowUp,
} from "@/lib/aurora";
import { Moon } from "@/components/mascot/Moon";

export default function AuroraPage() {
  const { lang, t } = useLanguage();
  const [problem, setProblem] = useState("");
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("");
  const [submitted, setSubmitted] = useState<{ problem: string; context: string; goal: string } | null>(null);
  const [opening, setOpening] = useState<AuroraOpening | null>(null);
  const [rootCauseReply, setRootCauseReply] = useState("");
  const [followUp, setFollowUp] = useState<AuroraFollowUp | null>(null);

  const ask = (text: string, ctx = context, g = goal) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitted({ problem: trimmed, context: ctx, goal: g });
    setOpening(openConversation(trimmed, lang));
  };

  const respondToRootCause = (reply: string) => {
    if (!opening || !submitted) return;
    setFollowUp(
      continueConversation(opening.type, opening.optionsDetected, submitted.context, submitted.goal, reply, lang),
    );
  };

  const reset = () => {
    setProblem("");
    setContext("");
    setGoal("");
    setSubmitted(null);
    setOpening(null);
    setRootCauseReply("");
    setFollowUp(null);
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

        {!opening ? (
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
            {/* Problem, as given */}
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

            {/* Aurora speaks first — situation, then hypotheses, then a real question */}
            <div className="haven-surface rounded-2xl bg-star/15 px-6 py-6">
              <div className="flex items-start gap-3">
                <Moon size={36} />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">{t.auroraSituationLabel}</p>
                  <p className="mt-2 font-serif text-xl leading-relaxed text-ink">{opening.situation}</p>
                </div>
              </div>
            </div>

            {opening.hypotheses.length > 0 && (
              <div className="haven-surface rounded-2xl px-6 py-6">
                <p className="text-xs uppercase tracking-wide text-muted">{t.auroraHypothesesLabel}</p>
                <ul className="mt-3 space-y-2">
                  {opening.hypotheses.map((h) => (
                    <li key={h} className="flex gap-2 text-ink/90">
                      <span aria-hidden="true" className="text-accent-pink">
                        ✦
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="haven-surface rounded-2xl px-6 py-5">
              <p className="text-xs uppercase tracking-wide text-muted">{t.auroraFrameworkLabel}</p>
              <p className="mt-1 text-ink/90">{opening.framework}</p>
            </div>

            {opening.optionsDetected && (
              <div className="haven-surface rounded-2xl px-6 py-5">
                <p className="text-xs uppercase tracking-wide text-muted">{t.auroraOptionsLabel}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {opening.optionsDetected.map((opt) => (
                    <span key={opt} className="rounded-full bg-secondary/25 px-3 py-1 text-sm text-ink">
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Aurora waits for a real answer before continuing — the conversation actually pauses here */}
            {!followUp ? (
              <div className="haven-surface animate-rise rounded-2xl px-6 py-6">
                <p className="font-serif italic text-secondary">{opening.rootCauseQuestion}</p>
                <textarea
                  value={rootCauseReply}
                  onChange={(e) => setRootCauseReply(e.target.value)}
                  placeholder={t.auroraReplyPlaceholder}
                  rows={2}
                  autoFocus
                  className="mt-3 w-full resize-none rounded-xl bg-transparent text-ink placeholder:text-muted focus:outline-none"
                />
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => respondToRootCause(rootCauseReply)}
                    disabled={!rootCauseReply.trim()}
                    className={`haven-cta rounded-full px-5 py-2 text-sm ${
                      rootCauseReply.trim()
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "cursor-not-allowed bg-line text-muted"
                    }`}
                  >
                    {t.auroraContinue}
                  </button>
                  <button
                    type="button"
                    onClick={() => respondToRootCause("")}
                    className="text-sm text-muted hover:text-ink"
                  >
                    {t.auroraSkip}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {rootCauseReply.trim() && (
                  <div className="haven-surface rounded-2xl px-6 py-5">
                    <p className="text-xs uppercase tracking-wide text-muted">{t.auroraYourReplyLabel}</p>
                    <p className="mt-1 text-ink/90">{rootCauseReply}</p>
                  </div>
                )}

                <div className="haven-surface rounded-2xl px-6 py-6">
                  <p className="text-xs uppercase tracking-wide text-muted">{t.auroraTradeoffsLabel}</p>
                  <ul className="mt-3 space-y-2">
                    {followUp.tradeoffs.map((c) => (
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
                  <p className="mt-2 text-ink">{followUp.recommendation}</p>
                </div>

                <div className="haven-surface rounded-2xl px-6 py-6">
                  <p className="text-xs uppercase tracking-wide text-muted">{t.auroraActionPlanLabel}</p>
                  <ul className="mt-3 space-y-2">
                    {followUp.actionPlan.map((step, i) => (
                      <li key={step} className="flex gap-3 text-ink/90">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-center font-serif italic text-secondary">{followUp.reflectionPrompt}</p>

                <div className="flex justify-center">
                  <button type="button" onClick={reset} className="text-sm text-primary hover:opacity-70">
                    {t.auroraNewQuestion}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
