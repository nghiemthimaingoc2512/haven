import type { Lang } from "@/lib/i18n";

export interface AuroraResponse {
  reframe: string;
  considerations: string[];
  nextStep: string;
  optionsDetected: [string, string] | null;
}

/**
 * Aurora is a different job than Whisper: not listening, but thinking
 * alongside someone. This mock still does real (if simple) analysis — it
 * looks for an actual "A or B" comparison in what was typed — rather than
 * pretending to reason about it. The real model integration replaces this
 * function; the UI contract around it stays the same.
 */

const DECISION_WORDS_VI = ["nên", "quyết định", "chọn", "hay là"];
const DECISION_WORDS_EN = ["should i", "decide", "choose", "decision"];
const PLANNING_WORDS_VI = ["kế hoạch", "dự định", "lộ trình", "mục tiêu"];
const PLANNING_WORDS_EN = ["plan", "planning", "goal", "roadmap"];

function detectOptions(text: string, lang: Lang): [string, string] | null {
  const splitter = lang === "vi" ? / hay | hay là /i : / or /i;
  const parts = text.split(splitter);
  if (parts.length !== 2) return null;
  const a = parts[0].trim().split(/[,.?!]/).pop()?.trim();
  const b = parts[1].trim().split(/[,.?!]/)[0]?.trim();
  if (!a || !b || a.length > 40 || b.length > 40) return null;
  return [a, b];
}

function detectQueryType(text: string, lang: Lang): "decision" | "planning" | "general" {
  const lower = text.toLowerCase();
  const decisionWords = lang === "vi" ? DECISION_WORDS_VI : DECISION_WORDS_EN;
  const planningWords = lang === "vi" ? PLANNING_WORDS_VI : PLANNING_WORDS_EN;
  if (decisionWords.some((w) => lower.includes(w))) return "decision";
  if (planningWords.some((w) => lower.includes(w))) return "planning";
  return "general";
}

const REFRAME_VI = {
  decision: "Nếu bỏ qua nỗi sợ chọn sai, phần nào trong bạn đã biết câu trả lời?",
  planning: "Nếu chỉ được làm một bước nhỏ trong tuần này, bạn sẽ chọn bước nào?",
  general: "Điều gì khiến bạn cảm thấy mắc kẹt nhất lúc này?",
};

const REFRAME_EN = {
  decision: "If you set aside the fear of choosing wrong, what part of you already knows the answer?",
  planning: "If you could only take one small step this week, which would it be?",
  general: "What makes this feel stuck right now, specifically?",
};

function considerationsFor(
  type: "decision" | "planning" | "general",
  options: [string, string] | null,
  lang: Lang,
): string[] {
  if (options) {
    const [a, b] = options;
    return lang === "vi"
      ? [
          `${a} có thể mang lại điều gì mà ${b} không có?`,
          `${b} có thể mang lại điều gì mà ${a} không có?`,
          "Lựa chọn nào khiến bạn thấy nhẹ nhõm hơn khi tưởng tượng một năm sau?",
        ]
      : [
          `What might ${a} give you that ${b} doesn't?`,
          `What might ${b} give you that ${a} doesn't?`,
          "Which choice feels lighter when you imagine it a year from now?",
        ];
  }
  if (type === "planning") {
    return lang === "vi"
      ? [
          "Bước nào trong kế hoạch này thực sự phụ thuộc vào người khác?",
          "Nếu tuần này không hoàn hảo, điều gì vẫn được coi là tiến bộ?",
          "Bạn đang lên kế hoạch cho điều mình muốn, hay điều mình nghĩ nên muốn?",
        ]
      : [
          "Which part of this plan actually depends on someone else?",
          "If this week isn't perfect, what would still count as progress?",
          "Are you planning for what you want, or what you think you should want?",
        ];
  }
  return lang === "vi"
    ? [
        "Điều gì thực sự quan trọng với bạn trong chuyện này?",
        "Nếu một người bạn thân đang ở vị trí của bạn, bạn sẽ khuyên họ điều gì?",
        "Có nỗi sợ nào đang âm thầm ảnh hưởng đến điều này không?",
      ]
    : [
        "What actually matters to you here?",
        "If a close friend were in your position, what would you tell them?",
        "Is there a quiet fear shaping this more than you'd like?",
      ];
}

const NEXT_STEP_VI =
  "Thử viết ra 3 điều bạn thực sự muốn trong chuyện này — không phải điều người khác mong đợi ở bạn.";
const NEXT_STEP_EN =
  "Try writing down 3 things you actually want here — not what you think others expect of you.";

export function generateAdvice(question: string, lang: Lang): AuroraResponse {
  const type = detectQueryType(question, lang);
  const options = detectOptions(question, lang);
  const reframe = (lang === "vi" ? REFRAME_VI : REFRAME_EN)[type];
  const considerations = considerationsFor(type, options, lang);
  const nextStep = lang === "vi" ? NEXT_STEP_VI : NEXT_STEP_EN;

  return { reframe, considerations, nextStep, optionsDetected: options };
}

export function starterPrompts(lang: Lang): string[] {
  return lang === "vi"
    ? [
        "Mình chưa biết nên làm gì tiếp theo.",
        "Giúp mình so sánh hai lựa chọn.",
        "Mình cần một góc nhìn khác về chuyện này.",
        "Mình muốn lên kế hoạch cho điều gì đó mới.",
      ]
    : [
        "I don't know what to do next.",
        "Help me compare two options.",
        "I need another perspective on this.",
        "I want to plan something new.",
      ];
}
