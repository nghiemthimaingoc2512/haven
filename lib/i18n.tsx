"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type Lang = "vi" | "en";

const STORAGE_KEY = "haven:lang";

export const speechLocale: Record<Lang, string> = {
  vi: "vi-VN",
  en: "en-US",
};

export interface Copy {
  brand: string;
  tagline: string;
  welcomeBody: string;
  welcomeCrisis: string;
  startTalking: string;
  talkSubtitle: string;
  talkPlaceholder: string;
  talkHintEnter: string;
  finishReflection: string;
  finishReflectionHint: string;
  talkTyping: string;
  aiUnavailable: string;
  cancel: string;
  send: string;
  voiceModeLabel: string;
  textModeLabel: string;
  openInBrowser: string;
  statusIdle: string;
  statusListening: string;
  statusPaused: string;
  statusPermissionDenied: string;
  statusNetworkError: string;
  statusUnsupported: string;
  processingListening: string;
  processingReflecting: string;
  reflectionHeading: string;
  savedLabel: string;
  willRemember: string;
  firstConversation: string;
  lastTime: string;
  standoutLabel: string;
  viewHistory: string;
  newConversation: string;
  backHome: string;
  storyTitle: string;
  onboardingContinue: string;
  onboardingBack: string;
  onboardingSkip: string;
  onboardingNameTitle: string;
  onboardingNameHint: string;
  onboardingNamePlaceholder: string;
  onboardingLangTitle: string;
  onboardingEnter: string;
  navHome: string;
  navTalk: string;
  navDiscover: string;
  navMyStory: string;
  navMe: string;
  navAriaLabel: string;
  navProfile: string;
  navSettings: string;
  navSignOut: string;
  navLanguageLabel: string;
  navThemeLabel: string;
  navAboutLabel: string;
  navAboutBody: string;
  homeGreetingMorning: string;
  homeGreetingNoon: string;
  homeGreetingAfternoon: string;
  homeGreetingEvening: string;
  homeGreetingNight: string;
  heroQuestionMorning: string;
  heroQuestionNoon: string;
  heroQuestionAfternoon: string;
  heroQuestionEvening: string;
  heroQuestionNight: string;
  homeQuickTalk: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  profileLabel: string;
  profileEdit: string;
  profileSave: string;
  languageLabel: string;
  streakSuffix: string;
  onboardingAppearanceTitle: string;
  welcomeHomeGreeting: string;
  welcomeHomeBody: string;
  todaysTide: string;
  glowOfDay: string;
  savedMemory: string;
  emptyMemoriesTitle: string;
  emptyMemoriesBody: string;
  nightPromptTitle: string;
  nightPromptBody: string;
  nightPromptAccept: string;
  nightPromptLater: string;
  confidenceLabel: string;
  savedToJourney: string;
  auroraIntro: string;
  auroraPlaceholder: string;
  auroraTyping: string;
  auroraNewQuestion: string;
  auroraTryPrompt: string;
  auroraReplyPlaceholder: string;
  auroraFinish: string;
  auroraFinishHint: string;
  auroraSummaryLabel: string;
  constellationEmpty: string;
  constellationFilterAll: string;
  constellationZoomIn: string;
  constellationZoomOut: string;
  constellationClose: string;
  constellationNowLabel: string;
  nightWindDown: string;
  nightRitualTitle: string;
  nightBreathing: string;
  nightReadMemories: string;
  weeklyReflectionLabel: string;
  weeklyReflectionBody: string;
  constellationPreviewLabel: string;
  meAiMemory: string;
  meAiMemoryBody: string;
  meMemoryCount: string;
  mePrivacy: string;
  mePrivacyBody: string;
  meExport: string;
  meExportDone: string;
  meDeleteData: string;
  meDeleteConfirm: string;
  meDeleteCancel: string;
  meAbout: string;
  meVersion: string;
  meSupportBody: string;
  carryAloneLine: string;
  breatheTogetherLine: string;
  emotionInsightsTitle: string;
  emotionAverageMood: string;
  emotionStreakLabel: string;
  emotionWeeklyTrend: string;
  emotionMoodCalendar: string;
  emotionNoDataYet: string;
  homeWhisperCardBody: string;
  homeAuroraCardBody: string;
  homeContinueConversation: string;
  homeStartConversation: string;
  constellationGrowthSince: string;
  constellationGrowthSingle: string;
  memoryTitle: string;
  memorySubtitle: string;
  memoryToday: string;
  memoryEarlier: string;
  memoryEmptyTitle: string;
  memoryEmptyBody: string;
  memoryEmptyCta: string;
  constellationSubtitle: string;
  constellationFirstStar: string;
  constellationMilestoneStreak: string;
  constellationMilestoneStars: string;
  constellationMilestoneThreads: string;
  constellationNextMilestone: string;
  constellationBeginCta: string;
  constellationDaysReflected: string;
  constellationInsightsDiscovered: string;
  constellationYourConstellations: string;
  constellationEmotionalTrend: string;
  constellationViewFull: string;
}

const dictionary: Record<Lang, Copy> = {
  vi: {
    brand: "Haven",
    tagline: "Nơi để đi về.",
    welcomeBody:
      "Haven không phải bác sĩ tâm lý, mà là hai người bạn: Thì Thầm lắng nghe chuyện mỗi ngày của bạn, còn Cực Quang giúp bạn suy nghĩ rõ ràng hơn khi cần quyết định. Cả hai luôn ở đây và không bao giờ thấy phiền vì bạn.",
    welcomeCrisis:
      "Nếu bạn đang trong khủng hoảng hoặc có ý nghĩ làm hại bản thân, Haven không phải nơi phù hợp - hãy gọi 115 (cấp cứu) hoặc một đường dây hỗ trợ tâm lý tại nơi bạn sống. Còn nếu không, mình ở đây, và sẽ không đi đâu cả.",
    startTalking: "Bắt đầu trò chuyện",
    talkSubtitle: "Người bạn lắng nghe mọi điều trong ngày của bạn.",
    talkPlaceholder: "Hôm nay của bạn thế nào? Kể gì cũng được.",
    talkHintEnter: "Enter để gửi · Shift+Enter để xuống dòng",
    finishReflection: "Kết thúc & lưu lại",
    finishReflectionHint: "Thì Thầm sẽ tóm tắt và giữ lại cuộc trò chuyện này.",
    talkTyping: "Thì Thầm đang viết…",
    aiUnavailable: "Mình đang mất kết nối một chút. Bạn thử gửi lại giúp mình nhé.",
    cancel: "Xoá",
    send: "Gửi",
    voiceModeLabel: "Nói",
    textModeLabel: "Gõ chữ",
    openInBrowser: "Mở trong trình duyệt",
    statusIdle: "Chạm vào micro để nói.",
    statusListening: "Đang lắng nghe…",
    statusPaused: "Tạm dừng - chạm micro để nói tiếp.",
    statusPermissionDenied:
      "Micro chưa được cho phép. Hãy kiểm tra quyền micro trong cài đặt trình duyệt, hoặc chuyển sang gõ chữ.",
    statusNetworkError: "Có sự cố kết nối - chạm để thử lại, hoặc chuyển sang gõ chữ.",
    statusUnsupported: "Trình duyệt này chưa hỗ trợ giọng nói. Bạn gõ chữ nhé.",
    processingListening: "Thì Thầm đang đọc lại tất cả…",
    processingReflecting: "Đang viết lại điều đáng nhớ…",
    reflectionHeading: "Điều đáng nhớ hôm nay",
    savedLabel: "Đã lưu vào Nhật ký",
    willRemember: "Mình sẽ ghi nhớ điều này.",
    firstConversation: "Đây là khởi đầu câu chuyện của bạn.",
    lastTime: "Lần trước bạn có nhắc đến",
    standoutLabel: "Một điều nổi bật",
    viewHistory: "Xem hành trình",
    newConversation: "Trò chuyện tiếp",
    backHome: "Về trang chủ",
    storyTitle: "Hành trình của bạn",
    onboardingContinue: "Tiếp tục",
    onboardingBack: "Quay lại",
    onboardingSkip: "Bỏ qua",
    onboardingNameTitle: "Haven nên gọi bạn là gì?",
    onboardingNameHint: "Chỉ để xưng hô cho thân mật. Bạn có thể bỏ qua.",
    onboardingNamePlaceholder: "Ví dụ: Bảo, Linh, An…",
    onboardingLangTitle: "Bạn muốn dùng ngôn ngữ nào?",
    onboardingEnter: "Vào Haven",
    navHome: "Trang chủ",
    navTalk: "Thì Thầm",
    navDiscover: "Cực Quang",
    navMyStory: "Hành trình",
    navMe: "Cài đặt",
    navAriaLabel: "Điều hướng chính",
    navProfile: "Hồ sơ & cài đặt",
    navSettings: "Cài đặt",
    navSignOut: "Về màn hình chào",
    navLanguageLabel: "Đổi ngôn ngữ",
    navThemeLabel: "Đổi giao diện sáng / tối",
    navAboutLabel: "Giới thiệu Haven",
    navAboutBody: "Đây là bản dùng thử - chưa có kênh hỗ trợ chính thức.",
    homeGreetingMorning: "Chào buổi sáng",
    homeGreetingNoon: "Chào buổi trưa",
    homeGreetingAfternoon: "Chào buổi chiều",
    homeGreetingEvening: "Chào buổi tối",
    homeGreetingNight: "Khuya rồi",
    heroQuestionMorning: "Sáng nay bạn thức dậy với cảm giác thế nào?",
    heroQuestionNoon: "Nửa ngày đã qua, bạn thấy sao rồi?",
    heroQuestionAfternoon: "Hôm nay của bạn đang trôi qua thế nào?",
    heroQuestionEvening: "Hôm nay có điều gì bạn muốn kể không?",
    heroQuestionNight: "Trước khi ngủ, trong lòng bạn đang có gì?",
    homeQuickTalk: "Nói một chút",
    themeLabel: "Giao diện",
    themeLight: "Sáng",
    themeDark: "Tối",
    themeSystem: "Theo hệ thống",
    profileLabel: "Tên của bạn",
    profileEdit: "Đổi tên",
    profileSave: "Lưu",
    languageLabel: "Ngôn ngữ",
    streakSuffix: "ngày liên tiếp",
    onboardingAppearanceTitle: "Bạn thích giao diện nào?",
    welcomeHomeGreeting: "Chào mừng bạn về nhà.",
    welcomeHomeBody:
      "Thì Thầm sẽ lắng nghe bạn mỗi ngày. Cực Quang sẽ cùng bạn suy nghĩ khi cần quyết định. Mọi thứ bạn chia sẻ đều được giữ riêng tư.",
    todaysTide: "Nhịp cảm xúc hôm nay",
    glowOfDay: "Một điều nhỏ cho hôm nay",
    savedMemory: "Điều đáng nhớ gần nhất",
    emptyMemoriesTitle: "Chưa có ký ức nào.",
    emptyMemoriesBody: "Kể cho Thì Thầm nghe một chuyện hôm nay - mình sẽ giữ lại cho bạn.",
    nightPromptTitle: "Khuya rồi đấy.",
    nightPromptBody: "Bạn có muốn Haven dịu lại một chút cho buổi tối không? Đây là lúc tốt để chậm lại.",
    nightPromptAccept: "Chuyển sang chế độ đêm",
    nightPromptLater: "Để sau",
    confidenceLabel: "Mức độ chắc chắn",
    savedToJourney: "Đã thêm vào hành trình cảm xúc của bạn.",
    auroraIntro: "Người bạn giúp bạn suy nghĩ rõ ràng khi cần quyết định.",
    auroraPlaceholder: "Bạn đang phân vân điều gì?",
    auroraTyping: "Cực Quang đang suy nghĩ…",
    auroraReplyPlaceholder: "Trả lời Cực Quang…",
    auroraFinish: "Kết thúc & tóm tắt",
    auroraFinishHint: "Cực Quang sẽ gom lại điều bạn đã thấy rõ và bước tiếp theo.",
    auroraSummaryLabel: "Tóm tắt",
    auroraNewQuestion: "Hỏi chuyện khác",
    auroraTryPrompt: "Hoặc bắt đầu từ một trong những điều này",
    constellationEmpty: "Bầu trời vẫn còn trống. Mỗi cuộc trò chuyện sẽ trở thành một ngôi sao.",
    constellationFilterAll: "Tất cả",
    constellationZoomIn: "Phóng to",
    constellationZoomOut: "Thu nhỏ",
    constellationClose: "Đóng",
    constellationNowLabel: "Bạn đang ở đây",
    nightWindDown: "Cùng nhau chậm lại nhé.",
    nightRitualTitle: "Nghi thức buổi tối",
    nightBreathing: "Hít thở cùng nhau",
    nightReadMemories: "Đọc lại nhật ký",
    weeklyReflectionLabel: "Tuần này",
    weeklyReflectionBody: "Bạn đã trò chuyện",
    constellationPreviewLabel: "Hành trình của bạn",
    meAiMemory: "Điều Haven nhớ về bạn",
    meAiMemoryBody:
      "Thì Thầm và Cực Quang dùng những ký ức gần đây để hiểu bạn hơn qua thời gian. Bạn có thể đọc lại trong Nhật ký, hoặc xoá toàn bộ ở bên dưới.",
    meMemoryCount: "ký ức đã lưu",
    mePrivacy: "Quyền riêng tư",
    mePrivacyBody:
      "Ký ức và cài đặt được lưu ngay trên thiết bị của bạn, không có tài khoản. Nội dung trò chuyện được gửi tới dịch vụ AI (Anthropic) chỉ để tạo phản hồi, không dùng cho mục đích nào khác.",
    meExport: "Xuất dữ liệu",
    meExportDone: "Đã tải xuống.",
    meDeleteData: "Xoá toàn bộ dữ liệu",
    meDeleteConfirm: "Bạn chắc chứ? Toàn bộ ký ức và cài đặt sẽ bị xoá khỏi thiết bị này.",
    meDeleteCancel: "Không, giữ lại",
    meAbout: "Về Haven",
    meVersion: "Phiên bản",
    meSupportBody: "Đây là bản dùng thử - chưa có kênh hỗ trợ chính thức.",
    carryAloneLine: "Chuyện gì cũng được - vui, buồn, hay chỉ một khoảnh khắc nhỏ trong ngày.",
    breatheTogetherLine: "Hãy cùng thở nhé.",
    emotionInsightsTitle: "Hành trình cảm xúc",
    emotionAverageMood: "Tâm trạng trung bình (30 ngày)",
    emotionStreakLabel: "Ngày liên tiếp",
    emotionWeeklyTrend: "8 tuần gần đây",
    emotionMoodCalendar: "Lịch tâm trạng tháng này",
    emotionNoDataYet: "Chưa có đủ dữ liệu để hiển thị.",
    homeWhisperCardBody: "Kể chuyện trong ngày, được lắng nghe thật lòng.",
    homeAuroraCardBody: "Gỡ rối một quyết định đang khiến bạn phân vân.",
    homeContinueConversation: "Trò chuyện với Thì Thầm",
    homeStartConversation: "Bắt đầu trò chuyện đầu tiên",
    constellationGrowthSince: "khoảnh khắc ở vùng này, từ",
    constellationGrowthSingle: "Đây là khoảnh khắc đầu tiên của bạn trong vùng này.",
    memoryTitle: "Nhật ký",
    memorySubtitle: "Những điều bạn đã chia sẻ, được giữ lại nguyên vẹn.",
    memoryToday: "Hôm nay",
    memoryEarlier: "Trước đó",
    memoryEmptyTitle: "Chưa có trang nhật ký nào.",
    memoryEmptyBody: "Trò chuyện với Thì Thầm để bắt đầu trang đầu tiên.",
    memoryEmptyCta: "Bắt đầu trò chuyện",
    constellationSubtitle: "Mỗi cuộc trò chuyện là một vì sao. Đây là bầu trời bạn đang tự thắp lên.",
    constellationFirstStar: "✨ Bạn vừa thắp ngôi sao đầu tiên trên bầu trời của mình.",
    constellationMilestoneStreak: "ngày liên tiếp",
    constellationMilestoneStars: "vì sao",
    constellationMilestoneThreads: "chòm sao đã hình thành",
    constellationNextMilestone: "cuộc trò chuyện nữa đến mốc tiếp theo",
    constellationBeginCta: "Bắt đầu cuộc trò chuyện đầu tiên",
    constellationDaysReflected: "ngày đã suy ngẫm",
    constellationInsightsDiscovered: "điều nổi bật đã khám phá",
    constellationYourConstellations: "Các chòm sao của bạn",
    constellationEmotionalTrend: "Xu hướng cảm xúc",
    constellationViewFull: "Xem toàn bộ cuộc trò chuyện",
  },
  en: {
    brand: "Haven",
    tagline: "Somewhere to come home to.",
    welcomeBody:
      "Haven isn't a therapist. It's two companions: Whisper listens to your everyday, and Aurora helps you think clearly when you need to decide. Both are always here, and neither will ever get tired of you.",
    welcomeCrisis:
      "If you're in crisis or thinking about hurting yourself, Haven isn't the right place - please call 988 (US) or your local emergency number or crisis line. Otherwise, I'm here, and I'm not going anywhere.",
    startTalking: "Start a conversation",
    talkSubtitle: "The friend who listens to everything in your day.",
    talkPlaceholder: "How was your day? Anything goes.",
    talkHintEnter: "Enter to send · Shift+Enter for a new line",
    finishReflection: "End & save",
    finishReflectionHint: "Whisper will sum this up and keep it for you.",
    talkTyping: "Whisper is writing…",
    aiUnavailable: "I lost the connection for a moment. Could you send that again?",
    cancel: "Clear",
    send: "Send",
    voiceModeLabel: "Speak",
    textModeLabel: "Type",
    openInBrowser: "Open in browser",
    statusIdle: "Tap the microphone to speak.",
    statusListening: "Listening…",
    statusPaused: "Paused - tap the microphone to continue.",
    statusPermissionDenied:
      "The microphone isn't allowed yet. Check the microphone permission in your browser settings, or switch to typing.",
    statusNetworkError: "Connection trouble - tap to try again, or switch to typing.",
    statusUnsupported: "Voice isn't available in this browser. Typing works just as well.",
    processingListening: "Whisper is reading it all back…",
    processingReflecting: "Writing down what's worth remembering…",
    reflectionHeading: "Worth remembering today",
    savedLabel: "Saved to your Journal",
    willRemember: "I'll remember this.",
    firstConversation: "This is the beginning of your story.",
    lastTime: "Last time you mentioned",
    standoutLabel: "One thing that stood out",
    viewHistory: "See your journey",
    newConversation: "Keep talking",
    backHome: "Back home",
    storyTitle: "Your journey",
    onboardingContinue: "Continue",
    onboardingBack: "Back",
    onboardingSkip: "Skip",
    onboardingNameTitle: "What should Haven call you?",
    onboardingNameHint: "Just so we can talk like friends. You can skip this.",
    onboardingNamePlaceholder: "Alex, Emma, Bao…",
    onboardingLangTitle: "Which language would you like?",
    onboardingEnter: "Enter Haven",
    navHome: "Home",
    navTalk: "Whisper",
    navDiscover: "Aurora",
    navMyStory: "Journey",
    navMe: "Settings",
    navAriaLabel: "Main navigation",
    navProfile: "Profile & settings",
    navSettings: "Settings",
    navSignOut: "Back to welcome",
    navLanguageLabel: "Change language",
    navThemeLabel: "Toggle light / dark",
    navAboutLabel: "About Haven",
    navAboutBody: "This is a prototype - there's no official support channel yet.",
    homeGreetingMorning: "Good morning",
    homeGreetingNoon: "Good afternoon",
    homeGreetingAfternoon: "Good afternoon",
    homeGreetingEvening: "Good evening",
    homeGreetingNight: "It's late",
    heroQuestionMorning: "How did you wake up feeling today?",
    heroQuestionNoon: "Half the day is gone - how are you doing?",
    heroQuestionAfternoon: "How is your day going so far?",
    heroQuestionEvening: "Anything from today you'd like to tell me?",
    heroQuestionNight: "Before you sleep, what's on your heart?",
    homeQuickTalk: "Talk for a bit",
    themeLabel: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    profileLabel: "Your name",
    profileEdit: "Change name",
    profileSave: "Save",
    languageLabel: "Language",
    streakSuffix: "days in a row",
    onboardingAppearanceTitle: "Which look do you prefer?",
    welcomeHomeGreeting: "Welcome home.",
    welcomeHomeBody:
      "Whisper will listen to your everyday. Aurora will think things through with you when you need to decide. Everything you share stays private.",
    todaysTide: "Today's tide",
    glowOfDay: "A small thing for today",
    savedMemory: "Most recent memory",
    emptyMemoriesTitle: "No memories yet.",
    emptyMemoriesBody: "Tell Whisper one thing about today - I'll keep it for you.",
    nightPromptTitle: "It's getting late.",
    nightPromptBody: "Would you like Haven to become a little quieter for the night? This is a good time to slow down.",
    nightPromptAccept: "Switch to Night Mode",
    nightPromptLater: "Maybe later",
    confidenceLabel: "How sure I am",
    savedToJourney: "Added to your emotional journey.",
    auroraIntro: "The friend who helps you think clearly when you need to decide.",
    auroraPlaceholder: "What are you weighing right now?",
    auroraTyping: "Aurora is thinking…",
    auroraReplyPlaceholder: "Reply to Aurora…",
    auroraFinish: "End & summarize",
    auroraFinishHint: "Aurora will gather what became clear and your next step.",
    auroraSummaryLabel: "Summary",
    auroraNewQuestion: "Ask something else",
    auroraTryPrompt: "Or start from one of these",
    constellationEmpty: "The sky is still empty. Every conversation becomes a star.",
    constellationFilterAll: "All",
    constellationZoomIn: "Zoom in",
    constellationZoomOut: "Zoom out",
    constellationClose: "Close",
    constellationNowLabel: "You are here",
    nightWindDown: "Let's slow down together.",
    nightRitualTitle: "Night ritual",
    nightBreathing: "Breathe together",
    nightReadMemories: "Read your journal",
    weeklyReflectionLabel: "This week",
    weeklyReflectionBody: "You've talked",
    constellationPreviewLabel: "Your journey",
    meAiMemory: "What Haven remembers about you",
    meAiMemoryBody:
      "Whisper and Aurora use your recent memories to understand you better over time. You can read them in your Journal, or delete everything below.",
    meMemoryCount: "memories saved",
    mePrivacy: "Privacy",
    mePrivacyBody:
      "Memories and settings live on your device - there is no account. Conversation text is sent to an AI service (Anthropic) only to generate replies, and for nothing else.",
    meExport: "Export data",
    meExportDone: "Downloaded.",
    meDeleteData: "Delete all data",
    meDeleteConfirm: "Are you sure? Every memory and setting will be removed from this device.",
    meDeleteCancel: "No, keep it",
    meAbout: "About Haven",
    meVersion: "Version",
    meSupportBody: "This is a prototype - there's no official support channel yet.",
    carryAloneLine: "Anything goes - happy, sad, or just a small moment from your day.",
    breatheTogetherLine: "Let's breathe together.",
    emotionInsightsTitle: "Emotional journey",
    emotionAverageMood: "Average mood (30 days)",
    emotionStreakLabel: "Day streak",
    emotionWeeklyTrend: "Last 8 weeks",
    emotionMoodCalendar: "This month's mood calendar",
    emotionNoDataYet: "Not enough data to show yet.",
    homeWhisperCardBody: "Tell your day to someone who truly listens.",
    homeAuroraCardBody: "Untangle a decision that's on your mind.",
    homeContinueConversation: "Talk to Whisper",
    homeStartConversation: "Start your first conversation",
    constellationGrowthSince: "moments in this area, since",
    constellationGrowthSingle: "This is your first moment in this area.",
    memoryTitle: "Journal",
    memorySubtitle: "Everything you've shared, kept exactly as it was.",
    memoryToday: "Today",
    memoryEarlier: "Earlier",
    memoryEmptyTitle: "No pages yet.",
    memoryEmptyBody: "Talk to Whisper to start your first page.",
    memoryEmptyCta: "Start a conversation",
    constellationSubtitle: "Every conversation is a star. This is the sky you're lighting up.",
    constellationFirstStar: "✨ You just lit the first star in your sky.",
    constellationMilestoneStreak: "day streak",
    constellationMilestoneStars: "stars",
    constellationMilestoneThreads: "constellations formed",
    constellationNextMilestone: "more conversations to your next milestone",
    constellationBeginCta: "Begin your first conversation",
    constellationDaysReflected: "days reflected",
    constellationInsightsDiscovered: "insights discovered",
    constellationYourConstellations: "Your constellations",
    constellationEmotionalTrend: "Emotional trend",
    constellationViewFull: "View full conversation",
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// A plain effect + setState here would fight this repo's stricter hooks lint
// (the same cascading-render concern as the speech-recognition support
// check) and wouldn't react to a language change made in another tab.
// useSyncExternalStore is the correct primitive: it renders the deterministic
// default during SSR/first paint, then corrects from the real stored value
// immediately after, without a hydration mismatch.
let currentLang: Lang = "vi";
const listeners = new Set<() => void>();

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "vi" || stored === "en") return stored;
  } catch {
    // localStorage unavailable - fall through to the default
  }
  return "vi";
}

function getLangSnapshot(): Lang {
  return currentLang;
}

function getServerLangSnapshot(): Lang {
  return "vi";
}

function subscribeToLang(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function commitLang(next: Lang) {
  currentLang = next;
  if (typeof document !== "undefined") document.documentElement.lang = next;
  for (const listener of listeners) listener();
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeToLang,
    getLangSnapshot,
    getServerLangSnapshot,
  );

  // Resolve the real stored preference once, right after mount (module-level
  // guard keeps this a no-op on later re-renders or additional providers).
  useEffect(() => {
    const stored = readStoredLang();
    if (stored !== currentLang) commitLang(stored);
    else document.documentElement.lang = stored;
  }, []);

  const setLang = useCallback((next: Lang) => {
    commitLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore - preference just won't persist this session
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionary[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
