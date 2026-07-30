"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/i18n";

export interface Tide {
  name: string;
  color: "soft-blue" | "secondary" | "accent-pink" | "primary" | "muted";
  description: string;
  glow: string;
}

interface TideContent {
  name: string;
  description: string;
  glow: string;
}

const TIDES_VI: Record<string, TideContent> = {
  "gentle-waves": {
    name: "Sóng Dịu Dàng",
    description: "Có chút xao động, nhưng vẫn đang nhẹ nhàng trôi qua.",
    glow: "Không sao nếu hôm nay chưa yên. Bạn vẫn đang đi tiếp, từng chút một.",
  },
  "quiet-sky": {
    name: "Bầu Trời Lặng",
    description: "Mọi thứ như đang lắng lại, chậm rãi hơn thường ngày.",
    glow: "Nghỉ ngơi cũng là một cách để tiến về phía trước.",
  },
  "golden-sunrise": {
    name: "Bình Minh Vàng",
    description: "Có gì đó ấm áp và nhẹ nhõm trong bạn hôm nay.",
    glow: "Hãy giữ lấy cảm giác này một chút lâu hơn — bạn xứng đáng với nó.",
  },
  "moonlit-calm": {
    name: "Ánh Trăng Yên Bình",
    description: "Một sự tĩnh lặng dịu dàng, như ánh trăng đêm.",
    glow: "Bạn không cần phải rực rỡ mỗi ngày. Yên bình cũng đủ đẹp rồi.",
  },
  "drifting-clouds": {
    name: "Mây Trôi",
    description: "Cảm xúc cứ trôi qua, không đọng lại quá lâu.",
    glow: "Những đám mây rồi cũng sẽ trôi đi. Bạn không phải giữ chúng lại.",
  },
};

const TIDES_EN: Record<string, TideContent> = {
  "gentle-waves": {
    name: "Gentle Waves",
    description: "A little unsettled, but moving gently through.",
    glow: "It's okay if today isn't calm yet. You're still moving forward, a little at a time.",
  },
  "quiet-sky": {
    name: "Quiet Sky",
    description: "Things feel still — slower than usual.",
    glow: "Resting is still a way of moving forward.",
  },
  "golden-sunrise": {
    name: "Golden Sunrise",
    description: "Something warm and a little lighter today.",
    glow: "Let yourself hold onto this a bit longer — you've earned it.",
  },
  "moonlit-calm": {
    name: "Moonlit Calm",
    description: "A soft stillness, like moonlight.",
    glow: "You don't have to shine every day. Quiet is beautiful too.",
  },
  "drifting-clouds": {
    name: "Drifting Clouds",
    description: "Feelings passing through, not settling too long.",
    glow: "The clouds will drift on. You don't have to hold onto them.",
  },
};

const TIDE_COLOR: Record<string, Tide["color"]> = {
  "gentle-waves": "soft-blue",
  "quiet-sky": "secondary",
  "golden-sunrise": "accent-pink",
  "moonlit-calm": "primary",
  "drifting-clouds": "muted",
};

const EMOTION_TO_TIDE: Record<string, string> = {
  "kiệt sức": "quiet-sky",
  exhausted: "quiet-sky",
  "buồn bã": "drifting-clouds",
  sad: "drifting-clouds",
  "lo lắng": "gentle-waves",
  anxious: "gentle-waves",
  "cô đơn": "quiet-sky",
  lonely: "quiet-sky",
  "khó chịu": "drifting-clouds",
  frustrated: "drifting-clouds",
  "nhẹ nhõm": "golden-sunrise",
  relieved: "golden-sunrise",
};

/** Maps a memory's real, already-detected emotion onto a Today's Tide card. */
export function getTide(emotion: string | null, lang: Lang): Tide {
  const key = (emotion && EMOTION_TO_TIDE[emotion]) || "moonlit-calm";
  const content = (lang === "vi" ? TIDES_VI : TIDES_EN)[key];
  return { name: content.name, description: content.description, glow: content.glow, color: TIDE_COLOR[key] };
}

const QUOTES_VI = [
  "Bạn không cần phải ổn mọi lúc. Bạn chỉ cần ở đây.",
  "Mỗi đêm là một cơ hội để bắt đầu lại, nhẹ nhàng hơn.",
  "Được lắng nghe là một điều nhỏ, nhưng lại thay đổi mọi thứ.",
  "Chậm lại không có nghĩa là bạn đang thụt lùi.",
  "Bạn đã đi được xa hơn bạn nghĩ.",
];

const QUOTES_EN = [
  "You don't have to be okay all the time. You just have to be here.",
  "Every night is a chance to begin again, a little more gently.",
  "Being heard is a small thing that changes everything.",
  "Slowing down doesn't mean falling behind.",
  "You've come further than you think.",
];

function dayOfYear(date: Date): number {
  return Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  );
}

function subscribeNever(): () => void {
  return () => {};
}

function getDayIndexSnapshot(): number {
  return dayOfYear(new Date());
}

function getServerDayIndexSnapshot(): number {
  // deterministic default until the client resolves the real local date
  return 0;
}

/** Same quote for everyone on a given calendar day — deterministic, resolved client-side. */
export function useDailyQuote(lang: Lang): string {
  const index = useSyncExternalStore(
    subscribeNever,
    getDayIndexSnapshot,
    getServerDayIndexSnapshot,
  );
  const quotes = lang === "vi" ? QUOTES_VI : QUOTES_EN;
  return quotes[index % quotes.length];
}
