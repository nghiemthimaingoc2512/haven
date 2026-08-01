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
  talkPlaceholder: string;
  finishReflection: string;
  cancel: string;
  send: string;
  switchToTyping: string;
  switchToVoice: string;
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
  historyTitle: string;
  historyToday: string;
  historyYesterday: string;
  historyThisWeek: string;
  historyEarlier: string;
  historyEmpty: string;
  backToTalk: string;
  storyTitle: string;
  onboardingContinue: string;
  onboardingNameTitle: string;
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
  homeGreetingAfternoon: string;
  homeGreetingEvening: string;
  homeGreetingNight: string;
  homeQuickTalk: string;
  homeQuickWrite: string;
  homeRecentMemoryLabel: string;
  homeNoMemoryYet: string;
  comingSoon: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  profileLabel: string;
  languageLabel: string;
  streakSuffix: string;
  onboardingAppearanceTitle: string;
  onboardingAuto: string;
  welcomeHomeGreeting: string;
  welcomeHomeBody: string;
  heroQuestion: string;
  todaysTide: string;
  glowOfDay: string;
  continueJourney: string;
  lastConversation: string;
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
  auroraSend: string;
  auroraProblemLabel: string;
  auroraContextLabel: string;
  auroraContextPlaceholder: string;
  auroraGoalLabel: string;
  auroraGoalPlaceholder: string;
  auroraSituationLabel: string;
  auroraHypothesesLabel: string;
  auroraFrameworkLabel: string;
  auroraOptionsLabel: string;
  auroraTradeoffsLabel: string;
  auroraRecommendationLabel: string;
  auroraActionPlanLabel: string;
  auroraReflectionLabel: string;
  auroraNewQuestion: string;
  auroraTryPrompt: string;
  auroraReplyPlaceholder: string;
  auroraYourReplyLabel: string;
  auroraContinue: string;
  auroraSkip: string;
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
  meNotifications: string;
  meAiMemory: string;
  meAiMemoryBody: string;
  mePrivacy: string;
  mePrivacyBody: string;
  meExport: string;
  meExportDone: string;
  meDeleteData: string;
  meDeleteConfirm: string;
  meDeleteCancel: string;
  meAbout: string;
  meVersion: string;
  meSupport: string;
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
}

const dictionary: Record<Lang, Copy> = {
  vi: {
    brand: "Haven",
    tagline: "Nơi để đi về.",
    welcomeBody:
      "Không phải bác sĩ tâm lý. Haven là hai người bạn: Thì thầm lắng nghe chuyện mỗi ngày của bạn, Cực quang giúp bạn suy nghĩ rõ ràng hơn khi cần quyết định. Cả hai luôn ở đây, không bao giờ thấy phiền vì bạn.",
    welcomeCrisis:
      "Nếu bạn đang trong khủng hoảng, đây không phải là nơi phù hợp — hãy liên hệ đường dây nóng hỗ trợ tâm lý hoặc số cấp cứu tại nơi bạn sống. Còn nếu không, mình ở đây, và sẽ không đi đâu cả.",
    startTalking: "Bắt đầu nói",
    talkPlaceholder: "Kể cho mình nghe hôm nay của bạn thế nào — chuyện gì cũng được.",
    finishReflection: "Xong",
    cancel: "Hủy",
    send: "Gửi",
    switchToTyping: "Chuyển sang gõ chữ",
    switchToVoice: "Chuyển sang giọng nói",
    voiceModeLabel: "Giọng nói",
    textModeLabel: "Gõ chữ",
    openInBrowser: "Mở trong trình duyệt",
    statusIdle: "Mình ở đây.",
    statusListening: "Đang lắng nghe…",
    statusPaused: "Tạm dừng một chút — chạm khi bạn sẵn sàng.",
    statusPermissionDenied:
      "Micro chưa được cho phép ở đây. Nếu bạn đang xem bản xem trước nhúng, hãy mở Haven trong một tab trình duyệt thật để dùng giọng nói — hoặc kiểm tra quyền micro trong cài đặt trình duyệt. Bạn vẫn có thể gõ chữ.",
    statusNetworkError:
      "Có sự cố kết nối — chạm để thử lại, hoặc tiếp tục viết.",
    statusUnsupported: "Trình duyệt này chưa hỗ trợ giọng nói. Hãy gõ thay.",
    processingListening: "Thì thầm đang lắng nghe…",
    processingReflecting: "Đang suy ngẫm…",
    reflectionHeading: "Một điều đáng nhớ",
    savedLabel: "Đã lưu ✓",
    willRemember: "Mình sẽ ghi nhớ điều này.",
    firstConversation: "Đây là khởi đầu câu chuyện của bạn.",
    lastTime: "Lần trước bạn có nhắc đến",
    standoutLabel: "Một điều nổi bật:",
    viewHistory: "Những câu chuyện đã qua",
    newConversation: "Trò chuyện mới",
    historyTitle: "Lịch sử",
    historyToday: "Hôm nay",
    historyYesterday: "Hôm qua",
    historyThisWeek: "Tuần này",
    historyEarlier: "Trước đó",
    historyEmpty: "Chưa có cuộc trò chuyện nào.",
    backToTalk: "Quay lại trò chuyện",
    storyTitle: "Bầu trời trưởng thành",
    onboardingContinue: "Tiếp tục",
    onboardingNameTitle: "Haven nên gọi bạn là gì?",
    onboardingNamePlaceholder: "Ví dụ: Bảo, Linh, An…",
    onboardingLangTitle: "Ngôn ngữ bạn muốn dùng",
    onboardingEnter: "Vào Haven",
    navHome: "Tổ ấm",
    navTalk: "Thì thầm",
    navDiscover: "Cực quang",
    navMyStory: "Bầu trời",
    navMe: "Tôi",
    navAriaLabel: "Điều hướng chính",
    navProfile: "Hồ sơ",
    navSettings: "Cài đặt",
    navSignOut: "Đăng xuất",
    navLanguageLabel: "Đổi ngôn ngữ",
    navThemeLabel: "Đổi giao diện",
    navAboutLabel: "Giới thiệu Haven",
    navAboutBody: "Đây là bản dùng thử — chưa có kênh hỗ trợ chính thức.",
    homeGreetingMorning: "Chào buổi sáng",
    homeGreetingAfternoon: "Chào buổi chiều",
    homeGreetingEvening: "Chào buổi tối",
    homeGreetingNight: "Đêm khuya rồi",
    homeQuickTalk: "Bắt đầu nói",
    homeQuickWrite: "Viết ra",
    homeRecentMemoryLabel: "Một điều mình còn nhớ",
    homeNoMemoryYet: "Chưa có điều gì để nhớ lại — hãy bắt đầu cuộc trò chuyện đầu tiên.",
    comingSoon: "Sắp có.",
    themeLabel: "Giao diện",
    themeLight: "Sáng",
    themeDark: "Tối",
    themeSystem: "Theo hệ thống",
    profileLabel: "Tên",
    languageLabel: "Ngôn ngữ",
    streakSuffix: "ngày liên tiếp",
    onboardingAppearanceTitle: "Chọn giao diện bạn thích",
    onboardingAuto: "Tự động",
    welcomeHomeGreeting: "Chào mừng bạn về nhà.",
    welcomeHomeBody: "Thì thầm sẽ lắng nghe bạn mỗi ngày. Cực quang sẽ giúp bạn suy nghĩ rõ ràng hơn khi cần quyết định.",
    heroQuestion: "Trái tim bạn tối nay thế nào?",
    todaysTide: "Nhịp cảm xúc hôm nay",
    glowOfDay: "Ánh sáng nhỏ hôm nay",
    continueJourney: "Tiếp tục hành trình",
    lastConversation: "Cuộc trò chuyện gần nhất",
    savedMemory: "Một điều đã lưu giữ",
    emptyMemoriesTitle: "Chưa có điều gì để nhớ lại.",
    emptyMemoriesBody: "Mình rất mong được ghi nhớ câu chuyện đầu tiên của chúng ta.",
    nightPromptTitle: "Khuya rồi đấy.",
    nightPromptBody: "Bạn có muốn Haven dịu lại một chút cho buổi tối không? Đây là lúc tốt để chậm lại.",
    nightPromptAccept: "Chuyển sang chế độ đêm",
    nightPromptLater: "Để sau",
    confidenceLabel: "Mức độ chắc chắn",
    savedToJourney: "Đã lưu vào hành trình cảm xúc của bạn.",
    auroraIntro: "Mình ở đây để cùng bạn suy nghĩ.",
    auroraPlaceholder: "Bạn đang phân vân điều gì?",
    auroraSend: "Cùng nghĩ nhé",
    auroraReplyPlaceholder: "Bạn nghĩ sao?",
    auroraYourReplyLabel: "Bạn đã nói",
    auroraContinue: "Tiếp tục",
    auroraSkip: "Bỏ qua, cứ tiếp tục",
    auroraProblemLabel: "Vấn đề",
    auroraContextLabel: "Bối cảnh (không bắt buộc)",
    auroraContextPlaceholder: "Có gì phía sau chuyện này mà đáng để biết không?",
    auroraGoalLabel: "Mục tiêu (không bắt buộc)",
    auroraGoalPlaceholder: "Một kết quả tốt sẽ trông như thế nào?",
    auroraSituationLabel: "Tình huống",
    auroraHypothesesLabel: "Vài giả thuyết đáng cân nhắc",
    auroraFrameworkLabel: "Cách tiếp cận",
    auroraOptionsLabel: "Các lựa chọn",
    auroraTradeoffsLabel: "Đánh đổi cần cân nhắc",
    auroraRecommendationLabel: "Đây là điều mình thấy",
    auroraActionPlanLabel: "Kế hoạch hành động",
    auroraReflectionLabel: "Để suy ngẫm thêm",
    auroraNewQuestion: "Hỏi điều khác",
    auroraTryPrompt: "Hoặc thử một trong số này:",
    constellationEmpty: "Bầu trời vẫn còn trống. Mỗi cuộc trò chuyện sẽ trở thành một ngôi sao.",
    constellationFilterAll: "Tất cả",
    constellationZoomIn: "Phóng to",
    constellationZoomOut: "Thu nhỏ",
    constellationClose: "Đóng",
    constellationNowLabel: "Bạn đang ở đây",
    nightWindDown: "Cùng nhau chậm lại nhé.",
    nightRitualTitle: "Nghi thức buổi tối",
    nightBreathing: "Hãy cùng thở nhé",
    nightReadMemories: "Đọc lại ký ức hôm nay",
    weeklyReflectionLabel: "Suy ngẫm tuần này",
    weeklyReflectionBody: "Tuần này bạn đã trò chuyện",
    constellationPreviewLabel: "Xem trước bầu trời trưởng thành",
    meNotifications: "Thông báo",
    meAiMemory: "Điều mình nhớ về bạn",
    meAiMemoryBody: "Thì thầm ghi nhớ những gì bạn chia sẻ để hiểu bạn hơn theo thời gian. Bạn có thể xem hoặc xoá bất cứ lúc nào trong Bầu trời trưởng thành.",
    mePrivacy: "Quyền riêng tư",
    mePrivacyBody: "Mọi dữ liệu hiện được lưu trực tiếp trên thiết bị của bạn — không có máy chủ, không chia sẻ với bên thứ ba.",
    meExport: "Xuất dữ liệu",
    meExportDone: "Đã tải xuống.",
    meDeleteData: "Xoá toàn bộ dữ liệu",
    meDeleteConfirm: "Bạn chắc chứ? Điều này sẽ xoá toàn bộ ký ức đã lưu.",
    meDeleteCancel: "Không, giữ lại",
    meAbout: "Về Haven",
    meVersion: "Phiên bản",
    meSupport: "Hỗ trợ",
    meSupportBody: "Đây là bản dùng thử — chưa có kênh hỗ trợ chính thức.",
    carryAloneLine: "Chuyện gì cũng được — vui, buồn, hay chỉ một khoảnh khắc nhỏ trong ngày.",
    breatheTogetherLine: "Hãy cùng thở nhé.",
    emotionInsightsTitle: "Hành trình cảm xúc",
    emotionAverageMood: "Tâm trạng trung bình (30 ngày)",
    emotionStreakLabel: "Ngày liên tiếp",
    emotionWeeklyTrend: "8 tuần gần đây",
    emotionMoodCalendar: "Lịch tâm trạng tháng này",
    emotionNoDataYet: "Chưa có đủ dữ liệu để hiển thị.",
    homeWhisperCardBody: "Người bạn luôn lắng nghe bạn mỗi ngày.",
    homeAuroraCardBody: "Người cố vấn giúp bạn suy nghĩ rõ ràng hơn.",
    homeContinueConversation: "Tiếp tục cuộc trò chuyện",
    constellationGrowthSince: "khoảnh khắc trong vùng này, từ",
    constellationGrowthSingle: "Đây là khoảnh khắc đầu tiên của bạn trong vùng này.",
    memoryTitle: "Nhật ký của bạn",
    memorySubtitle: "Những điều bạn đã chia sẻ với Thì thầm, được giữ lại nguyên vẹn.",
    memoryToday: "Hôm nay",
    memoryEarlier: "Trước đó",
    memoryEmptyTitle: "Chưa có trang nhật ký nào.",
    memoryEmptyBody: "Trò chuyện với Thì thầm để bắt đầu trang đầu tiên.",
    memoryEmptyCta: "Bắt đầu trò chuyện",
    constellationSubtitle: "Mỗi cuộc trò chuyện trở thành một vì sao. Đây là bầu trời của sự trưởng thành của bạn.",
    constellationFirstStar: "✨ Bạn vừa thắp sáng ngôi sao đầu tiên trong bầu trời của mình.",
    constellationMilestoneStreak: "ngày liên tiếp",
    constellationMilestoneStars: "vì sao",
    constellationMilestoneThreads: "chòm sao đã hình thành",
    constellationNextMilestone: "cuộc trò chuyện nữa đến mốc tiếp theo",
    constellationBeginCta: "Bắt đầu cuộc trò chuyện đầu tiên",
  },
  en: {
    brand: "Haven",
    tagline: "Somewhere to go.",
    welcomeBody:
      "Not a therapist. Haven is two companions: Whisper listens to your everyday, Aurora helps you think clearly when you need to decide. Both are always here, and neither will get tired of you.",
    welcomeCrisis:
      "If you're in crisis, this isn't the right place — please contact a crisis line (988 in the US) or emergency services instead. Otherwise, I'm here, and I'm not going anywhere.",
    startTalking: "Start talking",
    talkPlaceholder: "Tell me about your day — anything at all.",
    finishReflection: "Done",
    cancel: "Cancel",
    send: "Send",
    switchToTyping: "Switch to typing",
    switchToVoice: "Switch to voice",
    voiceModeLabel: "Voice",
    textModeLabel: "Type",
    openInBrowser: "Open in browser",
    statusIdle: "I'm here.",
    statusListening: "Listening…",
    statusPaused: "Paused for a moment — tap whenever you're ready.",
    statusPermissionDenied:
      "Microphone isn't enabled here. If you're viewing an embedded preview, open Haven in a real browser tab to use voice — or check your microphone permission in browser settings. You can still type.",
    statusNetworkError:
      "Connection trouble — tap to try again, or keep writing.",
    statusUnsupported:
      "Voice isn't available in this browser. Type instead.",
    processingListening: "Whisper is listening…",
    processingReflecting: "Reflecting…",
    reflectionHeading: "Something worth remembering",
    savedLabel: "Saved ✓",
    willRemember: "I'll remember this.",
    firstConversation: "This is the beginning of your story.",
    lastTime: "Last time you mentioned",
    standoutLabel: "One thing that stood out:",
    viewHistory: "The stories we've lived",
    newConversation: "New conversation",
    historyTitle: "History",
    historyToday: "Today",
    historyYesterday: "Yesterday",
    historyThisWeek: "This week",
    historyEarlier: "Earlier",
    historyEmpty: "No conversations yet.",
    backToTalk: "Back to talking",
    storyTitle: "Growing Sky",
    onboardingContinue: "Continue",
    onboardingNameTitle: "What should Haven call you?",
    onboardingNamePlaceholder: "Alex, Emma, Bao…",
    onboardingLangTitle: "Preferred language",
    onboardingEnter: "Enter Haven",
    navHome: "Nest",
    navTalk: "Whisper",
    navDiscover: "Aurora",
    navMyStory: "Growing Sky",
    navMe: "Me",
    navAriaLabel: "Main navigation",
    navProfile: "Profile",
    navSettings: "Settings",
    navSignOut: "Sign out",
    navLanguageLabel: "Change language",
    navThemeLabel: "Change appearance",
    navAboutLabel: "About Haven",
    navAboutBody: "This is a prototype — there's no official support channel yet.",
    homeGreetingMorning: "Good morning",
    homeGreetingAfternoon: "Good afternoon",
    homeGreetingEvening: "Good evening",
    homeGreetingNight: "It's late",
    homeQuickTalk: "Start talking",
    homeQuickWrite: "Write",
    homeRecentMemoryLabel: "Something I still remember",
    homeNoMemoryYet: "Nothing to remember yet — start your first conversation.",
    comingSoon: "Coming soon.",
    themeLabel: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    profileLabel: "Name",
    languageLabel: "Language",
    streakSuffix: "days in a row",
    onboardingAppearanceTitle: "Choose your appearance",
    onboardingAuto: "Auto",
    welcomeHomeGreeting: "Welcome home.",
    welcomeHomeBody: "Whisper will listen to your everyday. Aurora will help you think clearly when you need to decide.",
    heroQuestion: "How is your heart tonight?",
    todaysTide: "Today's Tide",
    glowOfDay: "Glow of the Day",
    continueJourney: "Continue Your Journey",
    lastConversation: "Last Conversation",
    savedMemory: "A Saved Memory",
    emptyMemoriesTitle: "No memories yet.",
    emptyMemoriesBody: "I'm excited to remember our first story together.",
    nightPromptTitle: "It's getting late.",
    nightPromptBody: "Would you like Haven to become a little quieter for the night? This is a good time to slow down.",
    nightPromptAccept: "Switch to Night Mode",
    nightPromptLater: "Maybe later",
    confidenceLabel: "How sure I am",
    savedToJourney: "Saved to your emotional journey.",
    auroraIntro: "I'm here to think alongside you.",
    auroraPlaceholder: "What are you weighing right now?",
    auroraSend: "Let's think together",
    auroraReplyPlaceholder: "What do you think?",
    auroraYourReplyLabel: "You said",
    auroraContinue: "Continue",
    auroraSkip: "Skip, just continue",
    auroraProblemLabel: "Problem",
    auroraContextLabel: "Context (optional)",
    auroraContextPlaceholder: "Any background that matters here?",
    auroraGoalLabel: "Goal (optional)",
    auroraGoalPlaceholder: "What would a good outcome look like?",
    auroraSituationLabel: "Situation",
    auroraHypothesesLabel: "A few hypotheses worth testing",
    auroraFrameworkLabel: "Approach",
    auroraOptionsLabel: "Options",
    auroraTradeoffsLabel: "Trade-offs to weigh",
    auroraRecommendationLabel: "Here's what I see",
    auroraActionPlanLabel: "Action plan",
    auroraReflectionLabel: "Worth reflecting on",
    auroraNewQuestion: "Ask something else",
    auroraTryPrompt: "Or try one of these:",
    constellationEmpty: "The sky is still empty. Every conversation becomes a star.",
    constellationFilterAll: "All",
    constellationZoomIn: "Zoom in",
    constellationZoomOut: "Zoom out",
    constellationClose: "Close",
    constellationNowLabel: "You are here",
    nightWindDown: "Let's slow down together.",
    nightRitualTitle: "Night Ritual",
    nightBreathing: "Let's breathe together",
    nightReadMemories: "Read today's memories",
    weeklyReflectionLabel: "This week's reflection",
    weeklyReflectionBody: "You've talked this week",
    constellationPreviewLabel: "Preview your growing sky",
    meNotifications: "Notifications",
    meAiMemory: "What I remember about you",
    meAiMemoryBody: "Whisper remembers what you share to understand you better over time. You can view or delete anything anytime in Growing Sky.",
    mePrivacy: "Privacy",
    mePrivacyBody: "Everything is currently stored directly on your device — no server, nothing shared with third parties.",
    meExport: "Export data",
    meExportDone: "Downloaded.",
    meDeleteData: "Delete all data",
    meDeleteConfirm: "Are you sure? This will delete every saved memory.",
    meDeleteCancel: "No, keep it",
    meAbout: "About Haven",
    meVersion: "Version",
    meSupport: "Support",
    meSupportBody: "This is a prototype — there's no official support channel yet.",
    carryAloneLine: "Anything goes — happy, sad, or just a small moment from your day.",
    breatheTogetherLine: "Let's breathe together.",
    emotionInsightsTitle: "Emotional Journey",
    emotionAverageMood: "Average mood (30 days)",
    emotionStreakLabel: "Day streak",
    emotionWeeklyTrend: "Last 8 weeks",
    emotionMoodCalendar: "This month's mood calendar",
    emotionNoDataYet: "Not enough data to show yet.",
    homeWhisperCardBody: "The friend who's always listening.",
    homeAuroraCardBody: "The consultant who helps you think clearly.",
    homeContinueConversation: "Continue our conversation",
    constellationGrowthSince: "moments in this area, since",
    constellationGrowthSingle: "This is your first moment in this area.",
    memoryTitle: "Your Journal",
    memorySubtitle: "Everything you've shared with Whisper, kept exactly as it was.",
    memoryToday: "Today",
    memoryEarlier: "Earlier",
    memoryEmptyTitle: "No pages yet.",
    memoryEmptyBody: "Talk to Whisper to start your first page.",
    memoryEmptyCta: "Start talking",
    constellationSubtitle: "Every conversation becomes a star. This is the sky of your growth.",
    constellationFirstStar: "✨ You just lit the first star in your sky.",
    constellationMilestoneStreak: "day streak",
    constellationMilestoneStars: "stars",
    constellationMilestoneThreads: "constellations formed",
    constellationNextMilestone: "more conversations to your next milestone",
    constellationBeginCta: "Begin your first conversation",
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
    // localStorage unavailable — fall through to the default
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
  }, []);

  const setLang = useCallback((next: Lang) => {
    commitLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — preference just won't persist this session
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
