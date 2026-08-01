"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { useDayPeriod } from "@/lib/insights";

export type MoonState = "auto" | "awake" | "sleeping";

interface MoonProps {
  /** Rendered size in px (square). */
  size?: number;
  /** "auto" (default) follows real local time. Only affects animation timing - never the artwork's appearance. */
  state?: MoonState;
  /** Floating/breathing wrapper animation (position only - translate/scale, never a visual filter). */
  animate?: boolean;
  /** Very subtle wrapper sway, on top of the breathing animation. Used sparingly (hero moments). */
  sway?: boolean;
  /** Pass through to next/image - set for the single above-the-fold instance per page. */
  priority?: boolean;
  className?: string;
}

/**
 * Haven's single mascot implementation, per docs/brand/HAVEN_BRAND.md -
 * always renders public/brand/derived/haven-moon.png (derived, via
 * scripts/derive-brand-assets.mjs, from the permanent master at
 * public/brand/master/haven-moon-master.png, which is never redrawn,
 * regenerated, or replaced). Every other component in the app imports this
 * one; there is no second mascot implementation anywhere in the codebase.
 *
 * Per HAVEN_BRAND.md's rendering rules: the artwork is rendered exactly as
 * exported - no opacity/blur/brightness/saturation/grayscale/tint/overlay/
 * blend-mode/backdrop-filter/glow/halo/drop-shadow. The mascot already
 * contains its own lighting; nothing here may modify its appearance. The
 * wrapper may still move (breathe/sway - position, not appearance), and
 * `state` only changes how fast it moves, never how it looks.
 *
 * If the artwork fails to load (missing asset, network hiccup), this never
 * falls through to a broken-image icon - it shows a simplified vector
 * placeholder instead, purely as a last-resort "avatar unavailable" state.
 */
export function Moon({
  size = 64,
  state = "auto",
  animate = true,
  sway = false,
  priority = false,
  className,
}: MoonProps) {
  const period = useDayPeriod();
  const isSleeping = state === "auto" ? period === "night" : state === "sleeping";
  const [failed, setFailed] = useState(false);
  const maskId = useId();

  const breatheClass = animate ? (isSleeping ? "animate-mascot-breathe-slow" : "animate-mascot-breathe") : "";
  const swayClass = sway && animate ? "animate-mascot-sway" : "";

  return (
    <span
      className={`relative inline-flex items-center justify-center ${breatheClass} ${swayClass} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {failed ? (
        <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label="Haven" className="relative">
          <defs>
            <linearGradient id={`${maskId}-body`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--lavender)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
            <mask id={`${maskId}-crescent`}>
              <rect width="64" height="64" fill="white" />
              <circle cx="40" cy="19" r="21" fill="black" />
            </mask>
          </defs>
          <circle cx="32" cy="32" r="24" fill={`url(#${maskId}-body)`} mask={`url(#${maskId}-crescent)`} />
          <ellipse cx="17" cy="40" rx="4" ry="2.6" fill="var(--accent-pink)" opacity="0.8" />
          {!isSleeping ? (
            <>
              <circle cx="21" cy="33" r="2.4" fill="var(--moon-face)" />
              <circle cx="34" cy="37" r="2.4" fill="var(--moon-face)" />
              <circle cx="20" cy="32" r="0.7" fill="white" />
              <path d="M18 45 q8 6 16 0" stroke="var(--moon-face)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d="M17 34 q4 -3 8 0" stroke="var(--moon-face)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <path d="M30 38 q4 -3 8 0" stroke="var(--moon-face)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <path d="M20 46 q6 3.5 13 0" stroke="var(--moon-face)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            </>
          )}
        </svg>
      ) : (
        <Image
          src="/brand/derived/haven-moon.png"
          alt="Haven"
          width={size}
          height={size}
          priority={priority}
          className="relative select-none"
          style={{ width: size, height: size, objectFit: "contain" }}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
