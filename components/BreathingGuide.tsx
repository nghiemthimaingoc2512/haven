"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

const PHASES = [
  { key: "in", ms: 4000 },
  { key: "hold", ms: 2000 },
  { key: "out", ms: 4000 },
] as const;

const PHASE_LABEL: Record<(typeof PHASES)[number]["key"], { vi: string; en: string }> = {
  in: { vi: "Hít vào…", en: "Breathe in…" },
  hold: { vi: "Giữ…", en: "Hold…" },
  out: { vi: "Thở ra…", en: "Breathe out…" },
};

export function BreathingGuide({ onClose }: { onClose: () => void }) {
  const { lang, t } = useLanguage();
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const phase = PHASES[phaseIndex];
    const timer = window.setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, phase.ms);
    return () => window.clearTimeout(timer);
  }, [phaseIndex]);

  const phase = PHASES[phaseIndex];
  const scale = phase.key === "in" ? "scale-100" : phase.key === "hold" ? "scale-100" : "scale-50";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-ink/50 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        aria-hidden="true"
        className={`h-40 w-40 rounded-full bg-gradient-to-br from-secondary to-primary opacity-80 transition-transform ease-in-out ${scale}`}
        style={{ transitionDuration: `${phase.ms}ms` }}
      />
      <p className="font-serif text-2xl text-white">
        {lang === "vi" ? PHASE_LABEL[phase.key].vi : PHASE_LABEL[phase.key].en}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="text-sm text-white/70 hover:text-white"
      >
        {t.constellationClose}
      </button>
    </div>
  );
}
