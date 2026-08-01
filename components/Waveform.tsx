const BAR_COUNT = 5;

/**
 * A calm, decorative "listening" indicator - not driven by real microphone
 * amplitude. Wiring up true audio analysis (Web Audio API + AnalyserNode) is
 * a meaningfully larger undertaking than this stage of the product needs;
 * what matters here is the felt sense of being listened to, not literal
 * signal visualization.
 */
export function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-6 items-end gap-1" aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <span
          key={i}
          className={`w-1 h-6 origin-bottom rounded-full ${
            active ? "animate-wave bg-primary" : "bg-line"
          }`}
          style={
            active
              ? { animationDelay: `${i * 0.11}s` }
              : { transform: "scaleY(0.3)" }
          }
        />
      ))}
    </div>
  );
}
