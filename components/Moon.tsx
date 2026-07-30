import { useId } from "react";

export type MoonMood = "smiling" | "sleeping" | "curious";

interface MoonProps {
  mood?: MoonMood;
  size?: number;
  glow?: boolean;
  float?: boolean;
  sparkle?: boolean;
  className?: string;
}

/**
 * Haven's mascot. Used consistently across onboarding, greetings, loading /
 * processing states, empty states, and Night Mode — never a one-off
 * illustration. Face color is fixed (--moon-face) rather than themed, so it
 * stays legible against the lavender gradient in both light and dark mode.
 */
export function Moon({
  mood = "smiling",
  size = 64,
  glow = true,
  float = false,
  sparkle = false,
  className,
}: MoonProps) {
  const gradientId = `moon-body-${useId()}`;
  const eyesBlink = mood !== "sleeping";

  return (
    <span
      className={`relative inline-flex items-center justify-center ${float ? "animate-float" : ""} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="animate-glow-pulse absolute inset-0 rounded-full blur-xl"
          style={{ background: "var(--secondary)", opacity: 0.55 }}
        />
      )}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="relative"
        role="img"
        aria-label={
          mood === "sleeping" ? "Haven, sleeping" : "Haven, listening"
        }
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--lavender)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

        {sparkle && (
          <path
            d="M53 10 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6 Z"
            fill="var(--accent-pink)"
            opacity="0.9"
          />
        )}

        {/* Crescent silhouette: a large outer arc minus a smaller offset arc. */}
        <path
          d="M32 6 A26 26 0 1 0 32 58 A20 20 0 1 1 32 6 Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="21" cy="18" r="4" fill="white" opacity="0.35" />

        {mood === "sleeping" ? (
          <>
            <ellipse cx="18" cy="35" rx="4" ry="2.5" fill="var(--accent-pink)" opacity="0.7" />
            <ellipse cx="33" cy="37" rx="4" ry="2.5" fill="var(--accent-pink)" opacity="0.7" />
            <path
              d="M14 28 q4 -4 8 0"
              stroke="var(--moon-face)"
              strokeWidth="2.3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M28 30 q4 -4 8 0"
              stroke="var(--moon-face)"
              strokeWidth="2.3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M19 41 q6 3.5 13 0"
              stroke="var(--moon-face)"
              strokeWidth="2.3"
              strokeLinecap="round"
              fill="none"
            />
            <text x="38" y="14" fontSize="8" fill="var(--moon-face)" opacity="0.55">
              z
            </text>
          </>
        ) : (
          <>
            <ellipse cx="16" cy="34" rx="3.5" ry="2.2" fill="var(--accent-pink)" opacity="0.6" />
            <ellipse cx="31" cy="36" rx="3.5" ry="2.2" fill="var(--accent-pink)" opacity="0.6" />
            <circle
              cx="18"
              cy="28"
              r="2.3"
              fill="var(--moon-face)"
              className={eyesBlink ? "animate-blink" : ""}
            />
            <circle
              cx="32"
              cy="30"
              r="2.3"
              fill="var(--moon-face)"
              className={eyesBlink ? "animate-blink" : ""}
              style={{ animationDelay: "0.08s" }}
            />
            {mood === "curious" ? (
              <circle cx="24" cy="40" r="2.2" fill="var(--moon-face)" />
            ) : (
              <path
                d="M15 37 q9 7 18 0"
                stroke="var(--moon-face)"
                strokeWidth="2.3"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </>
        )}
      </svg>
    </span>
  );
}
