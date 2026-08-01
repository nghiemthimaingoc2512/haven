import type { Lang } from "@/lib/i18n";

type QueryType = "decision" | "planning" | "general";

/**
 * Aurora is a reflective coach, not an essay-writer: she never dumps a full
 * report. This mock still does real (if simple) analysis - pattern/keyword
 * matching, an actual "A or B" split - rather than pretending to reason
 * about it. The real model integration replaces the phase content
 * functions below; the turn-by-turn contract stays the same.
 *
 * The conversation is a real state machine across seven phases - Understand,
 * Clarify, Explore, Challenge assumptions, Reflect, Generate insight, Create
 * action - each phase a genuine turn that echoes the user's actual prior
 * answer back in, never a fabricated claim of understanding. The first four
 * phases each end in one question and wait for a real reply; the last three
 * (Reflect, Insight, Action) are short consecutive statements - no more
 * question left to ask, Aurora is wrapping up what was actually said.
 *
 * Twelve situation patterns get a hand-built, evidence-grounded hypothesis
 * set - each hypothesis is specific to that situation, the way a consultant
 * who actually listened would offer possibilities, not a fortune-teller's
 * generic psychology. Critically: when nothing matches, Aurora does NOT fall
 * back to a generic hypothesis list. Guessing psychology with no grounding
 * is exactly the failure mode this is designed to avoid - instead it asks a
 * real clarifying question first, the same way a consultant says "I need to
 * understand more before I can offer possibilities" rather than pretending
 * to already know.
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
  // procrastinate"), not just "or" - a real A-or-B option is a multi-word
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

type PatternKey =
  | "procrastination"
  | "quit-job"
  | "need-money"
  | "feel-failure"
  | "living-alone"
  | "breakup"
  | "job-loss"
  | "family-conflict"
  | "health-scare"
  | "grief"
  | "relocation"
  | "friendship-fading";

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
  "living-alone": {
    vi: ["bạn cùng phòng", "dọn ra", "dọn đi", "sống một mình", "ở một mình"],
    en: ["roommate moved out", "moved out", "living alone", "live alone", "on my own now"],
  },
  breakup: {
    vi: ["chia tay"],
    en: ["broke up", "breakup", "we broke up"],
  },
  "job-loss": {
    vi: ["mất việc", "bị sa thải", "cho nghỉ việc", "thất nghiệp"],
    en: ["lost my job", "got laid off", "got fired", "laid off"],
  },
  "family-conflict": {
    vi: ["cãi nhau với bố mẹ", "cãi nhau với gia đình", "mâu thuẫn gia đình", "mâu thuẫn với bố mẹ"],
    en: ["fighting with my parents", "family conflict", "argument with my family", "fighting with my family"],
  },
  "health-scare": {
    vi: ["bác sĩ nói", "kết quả xét nghiệm", "chẩn đoán", "mới đi khám"],
    en: ["diagnosed", "doctor said", "test results", "health scare"],
  },
  grief: {
    vi: ["qua đời", "mất đi", "đám tang"],
    en: ["passed away", "passed away recently", "funeral", "lost someone"],
  },
  relocation: {
    vi: ["chuyển đến thành phố mới", "chuyển thành phố", "mới chuyển nhà"],
    en: ["moved to a new city", "relocating", "just moved", "moved to a new"],
  },
  "friendship-fading": {
    vi: ["bạn thân xa cách", "tình bạn phai nhạt", "không còn thân như trước"],
    en: ["drifting apart", "friendship fading", "we're not close anymore", "growing apart"],
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
      "Cầu toàn - muốn làm hoàn hảo nên chưa dám bắt đầu?",
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
    framework: "Đây có thể không phải là vấn đề thu nhập - hãy nhìn sâu hơn triệu chứng bề mặt.",
  },
  "feel-failure": {
    situation: "Bạn đang cảm thấy mình là một thất bại.",
    hypotheses: [
      "Bạn đang so sánh mình với một tiêu chuẩn không thực tế?",
      "Một sự việc gần đây đang bị khái quát thành cả con người bạn?",
      "Bạn đang đánh giá bản thân qua kỳ vọng của người khác?",
    ],
    rootCauseQuestion: "Điều gì khiến bạn kết luận mình thất bại - và đó có phải là bằng chứng khách quan không?",
    framework: "Tách bạch bằng chứng thực tế khỏi cảm xúc đang chi phối bạn.",
  },
  "living-alone": {
    situation: "Bạn vừa trải qua một thay đổi lớn - từ sống cùng người khác sang sống một mình.",
    hypotheses: [
      "Bạn đang cảm thấy cô đơn?",
      "Bạn lo về việc phải gánh chi phí một mình?",
      "Việc nhà và trách nhiệm hàng ngày bỗng dưng tăng gấp đôi?",
      "Căn nhà giờ cảm thấy trống trải về mặt cảm xúc?",
      "Thay đổi này gợi nhắc đến một trải nghiệm khác trong quá khứ?",
    ],
    rootCauseQuestion: "Điều nào nghe gần đúng nhất với bạn?",
    framework: "Một thay đổi hoàn cảnh sống thường mang theo nhiều lớp cảm xúc khác nhau - hãy tách chúng ra trước khi tìm giải pháp.",
  },
  breakup: {
    situation: "Bạn vừa trải qua một cuộc chia tay.",
    hypotheses: [
      "Bạn đang tiếc nuối những gì đã mất, hay lo lắng về việc phải bắt đầu lại?",
      "Có một phần thói quen hàng ngày giờ bỗng trống rỗng?",
      "Bạn đang tự hỏi mình đã sai ở đâu?",
      "Nỗi sợ cô đơn lớn hơn nỗi buồn về người đó?",
    ],
    rootCauseQuestion: "Điều nào đang chiếm nhiều tâm trí bạn nhất lúc này?",
    framework: "Chia tay thường gộp chung nhiều loại mất mát khác nhau - đáng để tách ra mới biết mình đang thực sự đau vì điều gì.",
  },
  "job-loss": {
    situation: "Bạn vừa mất công việc của mình.",
    hypotheses: [
      "Lo lắng về tài chính trước mắt?",
      "Cảm giác bị từ chối, dù lý do có thể không liên quan đến năng lực?",
      "Mất đi một phần bản sắc gắn với công việc đó?",
      "Không chắc bước tiếp theo là gì?",
    ],
    rootCauseQuestion: "Trong những điều trên, điều gì đang nặng nề nhất với bạn ngay lúc này?",
    framework: "Mất việc thường là một cú sốc tài chính và một cú sốc bản sắc cùng lúc - hai vấn đề cần hai hướng giải quyết khác nhau.",
  },
  "family-conflict": {
    situation: "Bạn vừa có mâu thuẫn với gia đình.",
    hypotheses: [
      "Đây là một bất đồng cụ thể, hay một căng thẳng đã âm ỉ từ lâu?",
      "Bạn cảm thấy không được lắng nghe hơn là không đồng ý?",
      "Có một kỳ vọng cũ từ gia đình mà bạn đang cố thoát ra?",
      "Bạn lo về việc mối quan hệ này sẽ ra sao sau chuyện này?",
    ],
    rootCauseQuestion: "Cái nào nghe gần với điều bạn đang cảm thấy nhất?",
    framework: "Mâu thuẫn gia đình thường không chỉ về chuyện vừa xảy ra - đáng để phân biệt sự việc cụ thể với căng thẳng nền phía sau.",
  },
  "health-scare": {
    situation: "Bạn vừa nhận được một tin tức sức khỏe khiến bạn lo lắng.",
    hypotheses: [
      "Nỗi sợ về điều chưa biết lớn hơn chính kết quả?",
      "Bạn đang lo cho những người phụ thuộc vào bạn?",
      "Bạn chưa có đủ thông tin để biết mức độ nghiêm trọng thực sự?",
      "Điều này đang buộc bạn nhìn lại những ưu tiên khác trong cuộc sống?",
    ],
    rootCauseQuestion: "Điều gì đang chiếm tâm trí bạn nhiều nhất - nỗi sợ, hay sự không chắc chắn?",
    framework: "Trước khi lo xa, đáng để tách rõ điều bạn đã biết chắc và điều vẫn còn là phỏng đoán.",
  },
  grief: {
    situation: "Bạn vừa mất đi một người quan trọng với mình.",
    hypotheses: [
      "Bạn cần không gian để cảm nhận, hơn là để giải quyết điều gì?",
      "Có điều gì đó chưa nói hết mà giờ bạn đang mang theo?",
      "Bạn lo về việc phải tiếp tục cuộc sống như thể không có gì xảy ra?",
    ],
    rootCauseQuestion: "Ngay lúc này, bạn cần điều gì nhất - được lắng nghe, hay một điều gì đó cụ thể hơn?",
    framework: "Đây không phải là một vấn đề cần giải quyết ngay - hãy để mình chậm lại trước.",
  },
  relocation: {
    situation: "Bạn vừa chuyển đến một nơi ở mới.",
    hypotheses: [
      "Bạn đang nhớ những mối quan hệ và sự quen thuộc ở nơi cũ?",
      "Áp lực phải xây dựng lại mọi thứ từ đầu - bạn bè, thói quen, nơi chốn?",
      "Bạn đang tự hỏi liệu quyết định chuyển đến đây có đúng không?",
    ],
    rootCauseQuestion: "Điều nào đang nặng nề nhất với bạn lúc này?",
    framework: "Một nơi ở mới thường đi kèm nhiều mất mát nhỏ trước khi có điều gì mới thay thế - bình thường nếu cảm giác này chưa qua ngay.",
  },
  "friendship-fading": {
    situation: "Bạn đang cảm thấy một tình bạn quan trọng đang xa cách dần.",
    hypotheses: [
      "Có một sự kiện cụ thể đã tạo ra khoảng cách này?",
      "Đây là kết quả tự nhiên của việc cuộc sống hai người thay đổi?",
      "Bạn lo mình là người duy nhất cố gắng giữ mối quan hệ này?",
    ],
    rootCauseQuestion: "Điều nào nghe gần đúng nhất với những gì đang xảy ra?",
    framework: "Tình bạn phai nhạt hiếm khi có một nguyên nhân duy nhất - đáng để xem đây là một sự kiện cụ thể hay một xu hướng dần dần.",
  },
};

const PATTERN_CONTENT_EN: Record<PatternKey, StageContent> = {
  procrastination: {
    situation: "You're finding yourself putting off something important.",
    hypotheses: [
      "Fear of failure?",
      "Perfectionism - not starting because it won't be perfect?",
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
    rootCauseQuestion: "Before evaluating resignation - which of these outcomes matters most to you?",
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
    framework: "This may not be an income problem - worth looking past the surface symptom.",
  },
  "feel-failure": {
    situation: "You're feeling like a failure right now.",
    hypotheses: [
      "You're measuring yourself against an unrealistic standard?",
      "One recent event is being generalized into your whole identity?",
      "You're evaluating yourself by someone else's expectations?",
    ],
    rootCauseQuestion: "What evidence makes you conclude you're a failure - and is it objective?",
    framework: "Separate the actual evidence from the emotion driving this conclusion.",
  },
  "living-alone": {
    situation: "You've just been through a real change - from living with someone to living on your own.",
    hypotheses: [
      "You're feeling lonely?",
      "You're worried about carrying costs alone now?",
      "Daily responsibilities suddenly doubled?",
      "The place feels emotionally empty?",
      "This change is echoing another experience from before?",
    ],
    rootCauseQuestion: "Which of these feels closest to what's actually going on?",
    framework: "A change in living situation usually carries more than one kind of loss - worth separating them before looking for a fix.",
  },
  breakup: {
    situation: "You've just been through a breakup.",
    hypotheses: [
      "You're grieving what's lost, or dreading having to start over?",
      "A piece of your daily routine now feels empty?",
      "You're replaying where it went wrong?",
      "The fear of being alone is bigger than the sadness about them?",
    ],
    rootCauseQuestion: "Which of these is taking up the most space in your head right now?",
    framework: "A breakup usually bundles several different losses together - worth separating them to know what you're actually grieving.",
  },
  "job-loss": {
    situation: "You've just lost your job.",
    hypotheses: [
      "Worry about money in the near term?",
      "A feeling of rejection, even if the reason had nothing to do with your work?",
      "Losing a part of your identity that was tied to that job?",
      "Not knowing what the next step even is?",
    ],
    rootCauseQuestion: "Of those, which one feels heaviest right now?",
    framework: "Job loss is usually a financial shock and an identity shock at the same time - they need two different responses.",
  },
  "family-conflict": {
    situation: "You've just had a conflict with your family.",
    hypotheses: [
      "Is this one specific disagreement, or a tension that's been building for a while?",
      "You feel unheard more than you disagree?",
      "There's an old expectation from your family you're trying to break free of?",
      "You're worried about what this means for the relationship going forward?",
    ],
    rootCauseQuestion: "Which of these feels closest to what you're actually feeling?",
    framework: "Family conflict is rarely only about what just happened - worth separating the specific incident from the tension underneath it.",
  },
  "health-scare": {
    situation: "You've just received health news that's worrying you.",
    hypotheses: [
      "Fear of the unknown is bigger than the result itself?",
      "You're worried about the people who depend on you?",
      "You don't have enough information yet to know how serious this actually is?",
      "This is forcing you to reconsider other priorities in your life?",
    ],
    rootCauseQuestion: "What's occupying the most space right now - the fear, or the uncertainty?",
    framework: "Before catastrophizing, it's worth separating what you actually know from what's still just a guess.",
  },
  grief: {
    situation: "You've just lost someone important to you.",
    hypotheses: [
      "You need space to feel this, more than to solve anything?",
      "There's something unsaid that you're carrying now?",
      "You're worried about having to keep going as if nothing happened?",
    ],
    rootCauseQuestion: "Right now, what do you need most - to be heard, or something more specific?",
    framework: "This isn't a problem to solve right now - let's slow down first.",
  },
  relocation: {
    situation: "You've just moved somewhere new.",
    hypotheses: [
      "You're missing the relationships and familiarity from before?",
      "The pressure of rebuilding everything from scratch - friends, routines, a sense of place?",
      "You're second-guessing whether the move itself was the right call?",
    ],
    rootCauseQuestion: "Which of these feels heaviest right now?",
    framework: "A new place usually comes with several small losses before anything new replaces them - it's normal if that hasn't passed yet.",
  },
  "friendship-fading": {
    situation: "You're feeling an important friendship drift away.",
    hypotheses: [
      "Was there a specific moment that created this distance?",
      "Is this just what happens when two lives change at different paces?",
      "You're worried you're the only one still trying?",
    ],
    rootCauseQuestion: "Which of these feels closest to what's actually happening?",
    framework: "Friendships rarely fade for just one reason - worth figuring out if this is one event or a slow drift.",
  },
};

// No pattern matched and no options were detected - there isn't enough
// grounded signal to offer hypotheses honestly. A real consultant says "I
// need to understand more" here instead of guessing psychology. These are
// the only genuinely open-ended clarifying questions in the system - they
// ask, they never claim to already know what's going on.
const CLARIFYING_QUESTION_VI: Record<"decision" | "planning" | "general", string> = {
  decision: "Điều gì khiến quyết định này khó nhất - là quá ít lựa chọn, hay quá nhiều lựa chọn?",
  planning: "Bạn đã hình dung rõ đích đến chưa, hay chính bước đầu tiên mới là điều mơ hồ nhất?",
  general: "Nếu phải chọn một câu để mô tả điều đang khó nhất lúc này, bạn sẽ nói gì?",
};

const CLARIFYING_QUESTION_EN: Record<"decision" | "planning" | "general", string> = {
  decision: "What makes this decision hardest - too few options, or too many?",
  planning: "Do you already know the destination clearly, or is the first step the unclear part?",
  general: "If you had to name the single hardest part of this right now, what would you say?",
};

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
          "Đặt một mốc thời gian cụ thể để quyết định - đừng để nó treo vô thời hạn.",
        ]
      : [
          `Pick the single most important criterion to compare ${a} vs ${b}.`,
          "Set a real deadline to decide - don't let it hang indefinitely.",
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
  "Thử viết ra 3 điều bạn thực sự muốn trong chuyện này - không phải điều người khác mong đợi ở bạn.";
const RECOMMENDATION_EN =
  "Try writing down 3 things you actually want here - not what you think others expect of you.";

const REFLECTION_PROMPT_VI = "Sau cuộc trò chuyện này, điều gì rõ ràng hơn với bạn so với lúc bắt đầu?";
const REFLECTION_PROMPT_EN = "After this conversation, what's clearer to you than when you started?";

// Strips a trailing ./!/? before echoing a reply back in quotes, so it never
// reads as double punctuation (`"...trước.".`) once wrapped in its own
// closing quote and sentence.
function quoteReply(reply: string): string {
  return reply.trim().replace(/[.!?]+$/, "");
}

// A short lead-in Aurora says once, before the first real question - never
// repeated, never padded into a paragraph.
function openingLine(pattern: PatternKey | null, options: [string, string] | null, lang: Lang): string {
  if (pattern) return (lang === "vi" ? PATTERN_CONTENT_VI : PATTERN_CONTENT_EN)[pattern].situation;
  if (options) {
    const [a, b] = options;
    return lang === "vi" ? `Bạn đang cân nhắc giữa ${a} và ${b}.` : `You're weighing ${a} against ${b}.`;
  }
  return lang === "vi" ? "Mình đang nghe đây." : "I'm listening.";
}

function understandQuestion(
  pattern: PatternKey | null,
  options: [string, string] | null,
  type: QueryType,
  lang: Lang,
): string {
  if (pattern) return (lang === "vi" ? PATTERN_CONTENT_VI : PATTERN_CONTENT_EN)[pattern].rootCauseQuestion;
  if (options) {
    return lang === "vi"
      ? "Điều gì thực sự quan trọng với bạn khi so sánh hai lựa chọn này?"
      : "What actually matters most to you in this comparison?";
  }
  return (lang === "vi" ? CLARIFYING_QUESTION_VI : CLARIFYING_QUESTION_EN)[type];
}

function clarifyQuestion(
  options: [string, string] | null,
  understandReply: string,
  lang: Lang,
): string {
  const reply = quoteReply(understandReply);
  if (options) {
    const [a, b] = options;
    return lang === "vi"
      ? `Giữa ${a} và ${b}, điều gì đang kéo bạn về một phía hơn?`
      : `Between ${a} and ${b}, what's actually pulling you toward one over the other?`;
  }
  if (!reply) {
    return lang === "vi" ? "Điều đó bắt đầu từ khi nào?" : "When did this start?";
  }
  return lang === "vi"
    ? `Bạn vừa nói: "${reply}". Điều đó bắt đầu từ khi nào, hay đây là cảm giác mới gần đây?`
    : `You just said: "${reply}". When did this start, or is it something newer?`;
}

function exploreQuestion(type: QueryType, options: [string, string] | null, clarifyReply: string, lang: Lang): string {
  const reply = quoteReply(clarifyReply);
  const lead = reply
    ? lang === "vi"
      ? `Bạn vừa nói: "${reply}". `
      : `You just said: "${reply}". `
    : "";
  if (options) {
    return (
      lead +
      (lang === "vi"
        ? "Nếu bạn tưởng tượng mỗi lựa chọn một năm từ bây giờ, điều gì khác nhau nhất?"
        : "If you picture each option a year from now, what's most different?")
    );
  }
  if (type === "planning") {
    return (
      lead +
      (lang === "vi"
        ? "Phần nào của kế hoạch này khiến bạn thấy chắc chắn nhất, và phần nào còn mơ hồ?"
        : "Which part of this plan feels most solid, and which part still feels foggy?")
    );
  }
  return (
    lead +
    (lang === "vi"
      ? "Khi điều này xảy ra, nó ảnh hưởng thế nào đến những việc khác trong ngày của bạn?"
      : "When this happens, how does it ripple into the rest of your day?")
  );
}

function challengeQuestion(type: QueryType, options: [string, string] | null, exploreReply: string, lang: Lang): string {
  const reply = quoteReply(exploreReply);
  const lead = reply
    ? lang === "vi"
      ? `Bạn vừa nói: "${reply}". `
      : `You just said: "${reply}". `
    : "";
  if (options) {
    return (
      lead +
      (lang === "vi"
        ? "Ai nói với bạn rằng đây phải là một lựa chọn đúng-sai duy nhất?"
        : "Who says this has to be a single right-or-wrong call?")
    );
  }
  if (type === "decision") {
    return (
      lead +
      (lang === "vi"
        ? "Điều gì sẽ khác nếu bạn không cần phải quyết định hoàn hảo ngay lần đầu?"
        : "What would be different if you didn't have to get this decision perfectly right the first time?")
    );
  }
  return (
    lead +
    (lang === "vi"
      ? "Nếu giả định đó không hoàn toàn đúng thì sao?"
      : "What if that assumption isn't entirely true?")
  );
}

function reflectStatement(
  pattern: PatternKey | null,
  understandReply: string,
  challengeReply: string,
  lang: Lang,
): string {
  const start = quoteReply(understandReply);
  const end = quoteReply(challengeReply);
  const summary =
    start && end
      ? lang === "vi"
        ? `Bạn bắt đầu với "${start}", và giờ bạn nhận ra "${end}".`
        : `You started with "${start}", and now you're noticing "${end}".`
      : lang === "vi"
        ? "Cảm ơn bạn đã chia sẻ tất cả những điều đó."
        : "Thank you for sharing all of that.";

  if (!pattern) return summary;

  const hypotheses = (lang === "vi" ? PATTERN_CONTENT_VI : PATTERN_CONTENT_EN)[pattern].hypotheses;
  if (hypotheses.length === 0) return summary;
  const patternLine =
    lang === "vi" ? `Mình để ý thấy một khả năng: ${hypotheses[0]}` : `Here's a pattern I'm noticing: ${hypotheses[0]}`;
  return `${summary} ${patternLine}`;
}

function insightStatement(lang: Lang): string {
  return lang === "vi" ? RECOMMENDATION_VI : RECOMMENDATION_EN;
}

function actionStatement(type: QueryType, options: [string, string] | null, lang: Lang): string {
  const steps = actionPlanFor(type, options, lang);
  const numbered = steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
  const reflection = lang === "vi" ? REFLECTION_PROMPT_VI : REFLECTION_PROMPT_EN;
  return `${numbered}\n\n${reflection}`;
}

export type AuroraPhase =
  | "understand"
  | "clarify"
  | "explore"
  | "challenge"
  | "reflect"
  | "insight"
  | "action";

export interface AuroraState {
  /** The phase whose question/statement was just shown to the user. */
  phase: AuroraPhase;
  type: QueryType;
  options: [string, string] | null;
  pattern: PatternKey | null;
  understandReply: string;
  clarifyReply: string;
  exploreReply: string;
  challengeReply: string;
}

export interface AuroraTurn {
  /** Aurora's message for this turn - may be multi-line for the final action step. */
  message: string;
  state: AuroraState;
  /** True while this message ends in a real question waiting on the user. */
  awaitingReply: boolean;
  /** True once the action phase has been shown - the 7 phases are complete. */
  done: boolean;
}

/**
 * Opens the conversation: phase 1, Understand. A short lead-in (the
 * situation, grounded in a matched pattern or the user's own words) plus one
 * real question. Never a paragraph, never a hypothesis dump up front.
 */
export function beginAurora(problem: string, lang: Lang): AuroraTurn {
  const trimmed = problem.trim();
  const type = detectQueryType(trimmed, lang);
  const options = detectOptions(trimmed, lang);
  const pattern = detectPattern(trimmed, lang);

  const lead = openingLine(pattern, options, lang);
  const question = understandQuestion(pattern, options, type, lang);

  return {
    message: `${lead} ${question}`,
    state: {
      phase: "understand",
      type,
      options,
      pattern,
      understandReply: "",
      clarifyReply: "",
      exploreReply: "",
      challengeReply: "",
    },
    awaitingReply: true,
    done: false,
  };
}

/**
 * Advances the conversation by one phase, given the user's reply to the
 * question the current phase just asked. Understand/Clarify/Explore/
 * Challenge each consume a reply and produce the next question. Reflect and
 * Insight are statements with no question, so the UI auto-advances through
 * them without waiting on input - see reachesAction/needsAutoAdvance below.
 */
export function advanceAurora(state: AuroraState, reply: string, lang: Lang): AuroraTurn {
  const trimmed = reply.trim();
  switch (state.phase) {
    case "understand": {
      const nextState: AuroraState = { ...state, understandReply: trimmed, phase: "clarify" };
      return {
        message: clarifyQuestion(state.options, trimmed, lang),
        state: nextState,
        awaitingReply: true,
        done: false,
      };
    }
    case "clarify": {
      const nextState: AuroraState = { ...state, clarifyReply: trimmed, phase: "explore" };
      return {
        message: exploreQuestion(state.type, state.options, trimmed, lang),
        state: nextState,
        awaitingReply: true,
        done: false,
      };
    }
    case "explore": {
      const nextState: AuroraState = { ...state, exploreReply: trimmed, phase: "challenge" };
      return {
        message: challengeQuestion(state.type, state.options, trimmed, lang),
        state: nextState,
        awaitingReply: true,
        done: false,
      };
    }
    case "challenge": {
      const nextState: AuroraState = { ...state, challengeReply: trimmed, phase: "reflect" };
      return {
        message: reflectStatement(state.pattern, state.understandReply, trimmed, lang),
        state: nextState,
        awaitingReply: false,
        done: false,
      };
    }
    default:
      return autoAdvanceAurora(state, lang);
  }
}

/**
 * Advances through the three closing statement-only phases (Reflect ->
 * Insight -> Action) with no user reply needed - the conversation already
 * has everything it's going to get, this is Aurora wrapping up out loud in
 * short beats rather than one long dump.
 */
export function autoAdvanceAurora(state: AuroraState, lang: Lang): AuroraTurn {
  switch (state.phase) {
    case "reflect": {
      const nextState: AuroraState = { ...state, phase: "insight" };
      return { message: insightStatement(lang), state: nextState, awaitingReply: false, done: false };
    }
    case "insight": {
      const nextState: AuroraState = { ...state, phase: "action" };
      return {
        message: actionStatement(state.type, state.options, lang),
        state: nextState,
        awaitingReply: false,
        done: true,
      };
    }
    default:
      return { message: "", state, awaitingReply: false, done: true };
  }
}

export function starterPrompts(lang: Lang): string[] {
  return lang === "vi"
    ? [
        "Mình hay trì hoãn công việc quan trọng.",
        "Mình nên ở lại công việc hiện tại hay chuyển việc mới?",
        "Mình cảm thấy mình là một thất bại.",
        "Bạn cùng phòng của mình mới dọn ra. Giờ mình sống một mình.",
      ]
    : [
        "I keep procrastinating on something important.",
        "Should I stay at my current job or take a new one?",
        "I feel like a failure.",
        "My roommate moved out. Now I live alone.",
      ];
}
