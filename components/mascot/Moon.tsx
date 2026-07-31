"use client";

import Image from "next/image";
import { useDayPeriod } from "@/lib/insights";

export type MoonState = "auto" | "awake" | "sleeping";

interface MoonProps {
  /** Rendered size in px (square). */
  size?: number;
  /** "auto" (default) follows real local time — awake before 9pm, sleeping after. */
  state?: MoonState;
  /** Floating/breathing wrapper animation. Never applied to the artwork itself. */
  animate?: boolean;
  /** Soft blurred halo behind the mascot. Dimmer + tinted differently at night. */
  glow?: boolean;
  /** Very subtle wrapper sway, on top of the breathing animation. Used sparingly (hero moments). */
  sway?: boolean;
  /** Pass through to next/image — set for the single above-the-fold instance per page. */
  priority?: boolean;
  className?: string;
}

/**
 * Haven's single mascot implementation. Always renders the official artwork
 * from public/mascot/processed/ via next/image — never redrawn, never an
 * emoji stand-in. Every other component in the app should import this one;
 * there is no second mascot implementation anywhere in the codebase.
 *
 * Day/night is driven by the same useDayPeriod() clock the rest of the app
 * uses (see lib/insights.ts) so the mascot, the greeting copy, and the
 * background all cross the 9pm boundary together.
 */
export function Moon({
  size = 64,
  state = "auto",
  animate = true,
  glow = true,
  sway = false,
  priority = false,
  className,
}: MoonProps) {
  const period = useDayPeriod();
  const isSleeping = state === "auto" ? period === "night" : state === "sleeping";

  const src = isSleeping ? "/mascot/processed/moon-sleeping.png" : "/mascot/processed/moon-awake.png";
  const alt = isSleeping ? "Haven, sleeping" : "Haven, awake";

  const breatheClass = animate ? (isSleeping ? "animate-mascot-breathe-slow" : "animate-mascot-breathe") : "";
  const swayClass = sway && animate ? "animate-mascot-sway" : "";

  return (
    <span
      className={`relative inline-flex items-center justify-center ${breatheClass} ${swayClass} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="animate-glow-pulse absolute inset-0 rounded-full blur-xl"
          style={{
            background: isSleeping ? "var(--night-glow)" : "var(--secondary)",
            opacity: isSleeping ? 0.35 : 0.55,
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="relative select-none"
        style={{ width: size, height: size, objectFit: "contain" }}
        draggable={false}
      />
    </span>
  );
}
