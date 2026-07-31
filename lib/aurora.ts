import type { Lang } from "@/lib/i18n";

export interface AuroraResponse {
  situation: string;
  hypotheses: string[];
  rootCauseQuestion: string;
  framework: string;
  optionsDetected: [string, string] | null;
  tradeoffs: string[];
  recommendation: string;
  actionPlan: string[];
  reflectionPrompt: string;
}

/**
 * Aurora is a consultant, not a listener: it never jumps straight to advice.
 * This mock still does real (if simple) analysis — pattern/keyword matching,
 * an actual "A or B" split — rather than pretending to reason about it. The
 * real model integration replaces this function; the UI contract stays the
 * same. Four canonical ambiguous complaints get a hand-built hypothesis set
 * (mirroring the product doc's worked examples); anything else gets a
 * generic hypothesis set keyed off the same decision/planning/general split
 * already used for options detection.
 */

const DECISION_WORDS_VI = ["nên", "quyết định", "chọn", "hay là"];
const DECISION_WORDS_EN = ["should i", "decide", "choose", "decision"];
const PLANNING_WORDS_VI = ["kế hoạch", "dự định", "lộ trình", "mục tiêu"];
const PLANNING_WORDS_EN = ["plan", "planning", "goal", "roadmap"];

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function detectOptions(text: string, lang: Lang): [string, string] | null {
  const splitter = lang === "vi" ? / hay | hay là /i : / or /i;
  const parts = text.split(splitter);
  if (parts.length !== 2) return null;
  const a = parts[0].trim().split(/[,.?!]/).pop()?.trim();
  const b = parts[1].trim().split(/[,.?!]/)[0]?.trim();
  if (!a || !b || a.length > 40 || b.length > 40) return null;
  // "hay" is also the Vietnamese adverb for "often" ("hay trì hoãn" = "often
  // procrastinate"), not just "or" — a real A-or-B option is a multi-word
  // phrase, not a single leftover pronoun, so require both sides to clear a
  // minimum word count before treating this as a genuine comparison.
  if (wordCount(a) < 2 || wordCount(b) < 2) return null;
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

type PatternKey = "procrastination" | "quit-job" | "need-money" | "feel-failure";

const PATTERN_KEYWORDS: Record<PatternKey, Record<Lang, string[]>> = {
  procrastination: {
    vi: ["trì hoãn"],
    en: ["procrastinat"],
  },
  "quit-job": {
    vi: ["nghỉ việc", "bỏ việc"],
    en: ["quit my job", "quit job", "leave my job"],
  },
  "need-money": {
    vi: ["cần thêm tiền", "cần nhiều tiền hơn", "thiếu tiền"],
    en: ["need more money", "need money"],
  },
  "feel-failure": {
    vi: ["mình là một thất bại", "cảm thấy thất bại", "mình thất bại"],
    en: ["feel like a failure", "i'm a failure", "i am a failure"],
  },
};

function detectPattern(text: string, lang: Lang): PatternKey | null {
  const lower = text.toLowerCase();
  for (const key of Object.keys(PATTERN_KEYWORDS) as PatternKey[]) {
    if (PATTERN_KEYWORDS[key][lang].some((w) => lower.includes(w))) return key;
  }
  return null;
}

interface StageContent {
  situation: string;
  hypotheses: string[];
  rootCauseQuestion: string;
  framework: string;
}

const PATTERN_CONTENT_VI: Record<PatternKey, StageContent> = {
  procrastination: {
    situation: "Bạn đang thấy mình cứ trì hoãn một việc quan trọng.",
    hypotheses: [
      "Sợ thất bại?",
      "Cầu toàn — muốn làm hoàn hảo nên chưa dám bắt đầu?",
      "Kiệt sức, không còn năng lượng?",
      "Thiếu rõ ràng về việc cần làm?",
      "Mệt mỏi vì phải quyết định quá nhiều thứ khác?",
      "Có một xung đột giữa việc này và điều bạn thực sự muốn?",
    ],
    rootCauseQuestion: "Trong những khả năng trên, điều nào nghe gần đúng nhất với bạn?",
    framework: "Trì hoãn thường là vấn đề cảm xúc, không phải vấn đề quản lý thời gian.",
  },
  "quit-job": {
    situation: "Bạn đang cân nhắc việc nghỉ công việc hiện tại.",
    hypotheses: [
      "Thu nhập cao hơn?",
      "Học hỏi được nhiều hơn?",
      "Bớt căng thẳng, cân bằng cuộc sống tốt hơn?",
      "Muốn chuyển hướng sự nghiệp?",
      "Muốn học lên cao?",
    ],
    rootCauseQuestion: "Trước khi đánh giá việc nghỉ việc, điều nào trong số này quan trọng nhất với bạn?",
    framework: "Định nghĩa rõ thành công trước, rồi mới đánh giá lựa chọn.",
  },
  "need-money": {
    situation: "Bạn đang cảm thấy cần thêm tiền.",
    hypotheses: [
      "Vấn đề dòng tiền, chứ không phải tổng thu nhập?",
      "Lo âu tài chính nhiều hơn là thiếu hụt thực tế?",
      "Lối sống đang tăng nhanh hơn thu nhập?",
      "Cấu trúc nợ đang gây áp lực?",
      "Cần một kế hoạch tài sản dài hạn hơn?",
      "Chi phí cơ hội của lựa chọn hiện tại?",
    ],
    rootCauseQuestion: "Đây có thật sự là vấn đề thu nhập, hay là một trong những điều trên?",
    framework: "Đây có thể không phải là vấn đề thu nhập — hãy nhìn sâu hơn triệu chứng bề mặt.",
  },
  "feel-failure": {
    situation: "Bạn đang cảm thấy mình là một thất bại.",
    hypotheses: [
      "Bạn đang so sánh mình với một tiêu chuẩn không thực tế?",
      "Một sự việc gần đây đang bị khái quát thành cả con người bạn?",
      "Bạn đang đánh giá bản thân qua kỳ vọng của người khác?",
    ],
    rootCauseQuestion: "Điều gì khiến bạn kết luận mình thất bại — và đó có phải là bằng chứng khách quan không?",
    framework: "Tách bạch bằng chứng thực tế khỏi cảm xúc đang chi phối bạn.",
  },
};

const PATTERN_CONTENT_EN: Record<PatternKey, StageContent> = {
  procrastination: {
    situation: "You're finding yourself putting off something important.",
    hypotheses: [
      "Fear of failure?",
      "Perfectionism — not starting because it won't be perfect?",
      "Burnout?",
      "Lack of clarity about what to actually do?",
      "Decision fatigue from too many other choices?",
      "An identity conflict with what you actually want?",
    ],
    rootCauseQuestion: "Which of these feels closest to true for you?",
    framework: "Procrastination is usually an emotional problem, not a time-management one.",
  },
  "quit-job": {
    situation: "You're weighing whether to leave your current job.",
    hypotheses: [
      "Higher income?",
      "Better learning?",
      "Less stress, better balance?",
      "A career pivot?",
      "Graduate school?",
    ],
    rootCauseQuestion: "Before evaluating resignation — which of these outcomes matters most to you?",
    framework: "Define success first, then evaluate the options against it.",
  },
  "need-money": {
    situation: "You're feeling like you need more money.",
    hypotheses: [
      "A cash-flow problem, not an income problem?",
      "Financial anxiety more than an actual shortfall?",
      "Lifestyle inflation outpacing income?",
      "A debt structure that's creating pressure?",
      "A need for longer-term wealth planning?",
      "The opportunity cost of your current choices?",
    ],
    rootCauseQuestion: "Is this actually an income problem, or one of these instead?",
    framework: "This may not be an income problem — worth looking past the surface symptom.",
  },
  "feel-failure": {
    situation: "You're feeling like a failure right now.",
    hypotheses: [
      "You're measuring yourself against an unrealistic standard?",
      "One recent event is being generalized into your whole identity?",
      "You're evaluating yourself by someone else's expectations?",
    ],
    rootCauseQuestion: "What evidence makes you conclude you're a failure — and is it objective?",
    framework: "Separate the actual evidence from the emotion driving this conclusion.",
  },
};

const GENERIC_VI: Record<"decision" | "planning" | "general", StageContent> = {
  decision: {
    situation: "Bạn đang đứng trước một quyết định và chưa chắc nên đi hướng nào.",
    hypotheses: [
      "Bạn đang thiếu thông tin quan trọng để quyết định?",
      "Nỗi sợ chọn sai đang cản trở bạn nhiều hơn là chính quyết định?",
      "Kỳ vọng của người khác đang lấn át điều bạn thực sự muốn?",
      "Có nhiều hơn một quyết định đang bị gộp làm một?",
    ],
    rootCauseQuestion: "Trong những khả năng trên, điều nào nghe gần đúng nhất?",
    framework: "Khung ra quyết định theo giá trị cốt lõi.",
  },
  planning: {
    situation: "Bạn đang muốn lên kế hoạch cho điều gì đó nhưng chưa rõ nên bắt đầu từ đâu.",
    hypotheses: [
      "Mục tiêu cuối cùng chưa đủ rõ ràng?",
      "Có quá nhiều bước khiến bạn choáng ngợp?",
      "Kế hoạch phụ thuộc vào điều bạn không kiểm soát được?",
      "Bạn đang lên kế hoạch cho điều người khác muốn, không phải điều bạn muốn?",
    ],
    rootCauseQuestion: "Điều nào đang thực sự cản trở bạn bắt đầu?",
    framework: "Khung chia nhỏ mục tiêu thành bước hành động.",
  },
  general: {
    situation: "Bạn đang cảm thấy mắc kẹt với điều này.",
    hypotheses: [
      "Đây có thể là vấn đề thiếu thông tin?",
      "Cảm xúc đang chi phối nhiều hơn bạn nghĩ?",
      "Có một nỗi sợ âm thầm đang ảnh hưởng đến điều này?",
      "Kỳ vọng không thực tế đang tạo áp lực?",
    ],
    rootCauseQuestion: "Điều nào trong số này nghe gần đúng nhất với bạn?",
    framework: "Khung xác định nguyên nhân gốc rễ.",
  },
};

const GENERIC_EN: Record<"decision" | "planning" | "general", StageContent> = {
  decision: {
    situation: "You're facing a decision and aren't sure which way to go.",
    hypotheses: [
      "You're missing key information to decide?",
      "Fear of choosing wrong is louder than the decision itself?",
      "Someone else's expectations are drowning out what you actually want?",
      "More than one decision is being bundled into one?",
    ],
    rootCauseQuestion: "Which of these feels closest to true?",
    framework: "A values-first decision framework.",
  },
  planning: {
    situation: "You want to plan something but aren't sure where to start.",
    hypotheses: [
      "The end goal isn't clear enough yet?",
      "Too many steps at once feels overwhelming?",
      "The plan depends on something outside your control?",
      "You're planning for what someone else wants, not what you want?",
    ],
    rootCauseQuestion: "What's actually stopping you from starting?",
    framework: "A goal-to-action breakdown framework.",
  },
  general: {
    situation: "You're feeling stuck on this.",
    hypotheses: [
      "This might be a missing-information problem?",
      "Emotion is driving more of this than you'd expect?",
      "A quiet fear is shaping this more than you'd like?",
      "An unrealistic expectation is creating the pressure?",
    ],
    rootCauseQuestion: "Which of these feels closest to true for you?",
    framework: "A root-cause framework.",
  },
};

function tradeoffsFor(
  type: "decision" | "planning" | "general",
  options: [string, string] | null,
  context: string,
  lang: Lang,
): string[] {
  const contextLine = context.trim()
    ? lang === "vi"
      ? [`Bạn vừa nhắc đến: "${context.trim()}" — điều đó ảnh hưởng thế nào đến hướng bạn chọn?`]
      : [`You mentioned: "${context.trim()}" — how does that shape which way you lean?`]
    : [];

  if (options) {
    const [a, b] = options;
    return [
      ...(lang === "vi"
        ? [
            `${a} có thể mang lại điều gì mà ${b} không có?`,
            `${b} có thể mang lại điều gì mà ${a} không có?`,
            "Lựa chọn nào khiến bạn thấy nhẹ nhõm hơn khi tưởng tượng một năm sau?",
          ]
        : [
            `What might ${a} give you that ${b} doesn't?`,
            `What might ${b} give you that ${a} doesn't?`,
            "Which choice feels lighter when you imagine it a year from now?",
          ]),
      ...contextLine,
    ];
  }
  if (type === "planning") {
    return [
      ...(lang === "vi"
        ? [
            "Bước nào trong kế hoạch này thực sự phụ thuộc vào người khác?",
            "Nếu tuần này không hoàn hảo, điều gì vẫn được coi là tiến bộ?",
            "Bạn đang lên kế hoạch cho điều mình muốn, hay điều mình nghĩ nên muốn?",
          ]
        : [
            "Which part of this plan actually depends on someone else?",
            "If this week isn't perfect, what would still count as progress?",
            "Are you planning for what you want, or what you think you should want?",
          ]),
      ...contextLine,
    ];
  }
  return [
    ...(lang === "vi"
      ? [
          "Điều gì thực sự quan trọng với bạn trong chuyện này?",
          "Nếu một người bạn thân đang ở vị trí của bạn, bạn sẽ khuyên họ điều gì?",
          "Có nỗi sợ nào đang âm thầm ảnh hưởng đến điều này không?",
        ]
      : [
          "What actually matters to you here?",
          "If a close friend were in your position, what would you tell them?",
          "Is there a quiet fear shaping this more than you'd like?",
        ]),
    ...contextLine,
  ];
}

function actionPlanFor(
  type: "decision" | "planning" | "general",
  options: [string, string] | null,
  lang: Lang,
): string[] {
  if (options) {
    const [a, b] = options;
    return lang === "vi"
      ? [
          `Chọn 1 tiêu chí quan trọng nhất để so sánh ${a} và ${b}.`,
          "Đặt một mốc thời gian cụ thể để quyết định — đừng để nó treo vô thời hạn.",
        ]
      : [
          `Pick the single most important criterion to compare ${a} vs ${b}.`,
          "Set a real deadline to decide — don't let it hang indefinitely.",
        ];
  }
  if (type === "planning") {
    return lang === "vi"
      ? ["Chọn 1 bước nhỏ có thể làm trong 48 giờ tới.", "Xác định điều gì có thể cản trở kế hoạch này."]
      : ["Pick one small step you can take in the next 48 hours.", "Name what's most likely to block this plan."];
  }
  return lang === "vi"
    ? ["Viết ra 3 điều bạn thực sự muốn trong chuyện này.", "Chọn 1 hành động nhỏ để thử trong tuần này."]
    : ["Write down 3 things you actually want here.", "Pick one small action to try this week."];
}

const RECOMMENDATION_VI =
  "Thử viết ra 3 điều bạn thực sự muốn trong chuyện này — không phải điều người khác mong đợi ở bạn.";
const RECOMMENDATION_EN =
  "Try writing down 3 things you actually want here — not what you think others expect of you.";

const REFLECTION_PROMPT_VI = "Sau cuộc trò chuyện này, điều gì rõ ràng hơn với bạn so với lúc bắt đầu?";
const REFLECTION_PROMPT_EN = "After this conversation, what's clearer to you than when you started?";

/**
 * Aurora's consultant pipeline: Situation → Hypotheses → Root-cause question
 * → Framework → Options (if any) → Trade-offs → Recommendation → Action
 * plan → Reflection. Never skips straight to advice — hypotheses only get
 * skipped when the input already names concrete options to compare, since
 * at that point the ambiguity to resolve is which option, not what the
 * underlying issue even is.
 */
export function generateAdvice(question: string, context: string, goal: string, lang: Lang): AuroraResponse {
  const type = detectQueryType(question, lang);
  const options = detectOptions(question, lang);
  const pattern = detectPattern(question, lang);

  let stage: StageContent;
  if (pattern) {
    stage = (lang === "vi" ? PATTERN_CONTENT_VI : PATTERN_CONTENT_EN)[pattern];
  } else if (options) {
    const [a, b] = options;
    stage = {
      situation: lang === "vi" ? `Bạn đang cân nhắc giữa ${a} và ${b}.` : `You're weighing ${a} against ${b}.`,
      hypotheses: [],
      rootCauseQuestion:
        lang === "vi"
          ? "Điều gì thực sự quan trọng với bạn khi so sánh hai lựa chọn này?"
          : "What actually matters most to you in this comparison?",
      framework: lang === "vi" ? "Khung so sánh lựa chọn theo giá trị dài hạn." : "A long-term value comparison framework.",
    };
  } else {
    stage = (lang === "vi" ? GENERIC_VI : GENERIC_EN)[type];
  }

  const tradeoffs = tradeoffsFor(type, options, context, lang);
  const actionPlan = actionPlanFor(type, options, lang);
  const reflectionPrompt = lang === "vi" ? REFLECTION_PROMPT_VI : REFLECTION_PROMPT_EN;

  const base = lang === "vi" ? RECOMMENDATION_VI : RECOMMENDATION_EN;
  const goalLine = goal.trim()
    ? lang === "vi"
      ? ` Hãy giữ mục tiêu này trong đầu: "${goal.trim()}".`
      : ` Keep this goal in mind: "${goal.trim()}".`
    : "";
  const recommendation = base + goalLine;

  return {
    situation: stage.situation,
    hypotheses: stage.hypotheses,
    rootCauseQuestion: stage.rootCauseQuestion,
    framework: stage.framework,
    optionsDetected: options,
    tradeoffs,
    recommendation,
    actionPlan,
    reflectionPrompt,
  };
}

export function starterPrompts(lang: Lang): string[] {
  return lang === "vi"
    ? [
        "Mình hay trì hoãn công việc quan trọng.",
        "Mình nên ở lại công việc hiện tại hay chuyển việc mới?",
        "Mình cảm thấy mình là một thất bại.",
        "Mình muốn lên kế hoạch cho điều gì đó mới.",
      ]
    : [
        "I keep procrastinating on something important.",
        "Should I stay at my current job or take a new one?",
        "I feel like a failure.",
        "I want to plan something new.",
      ];
}
