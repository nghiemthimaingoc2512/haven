import { useId } from "react";

export type MoonMood = "smiling" | "sleeping" | "curious";

interface MoonProps {
  mood?: MoonMood;
  size?: number;
  glow?: boolean;
  float?: boolean;
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
  className,
}: MoonProps) {
  const gradientId = `moon-body-${useId()}`;

  return (
    <span
      className={`relative inline-flex items-center justify-center ${float ? "animate-float" : ""} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-xl"
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
            <stop offset="0%" stopColor="var(--secondary)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill={`url(#${gradientId})`} />
        <circle cx="21" cy="17" r="4.5" fill="white" opacity="0.35" />

        {mood === "sleeping" ? (
          <>
            <path
              d="M19 30 q5 -5 10 0"
              stroke="var(--moon-face)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M35 30 q5 -5 10 0"
              stroke="var(--moon-face)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M24 42 q8 4 16 0"
              stroke="var(--moon-face)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <text
              x="46"
              y="16"
              fontSize="9"
              fill="var(--moon-face)"
              opacity="0.6"
            >
              z
            </text>
          </>
        ) : mood === "curious" ? (
          <>
            <circle cx="24" cy="30" r="2.5" fill="var(--moon-face)" />
            <circle cx="40" cy="30" r="2.5" fill="var(--moon-face)" />
            <circle cx="32" cy="41" r="2.5" fill="var(--moon-face)" />
          </>
        ) : (
          <>
            <circle cx="24" cy="30" r="2.5" fill="var(--moon-face)" />
            <circle cx="40" cy="30" r="2.5" fill="var(--moon-face)" />
            <path
              d="M22 39 q10 8 20 0"
              stroke="var(--moon-face)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </span>
  );
}
