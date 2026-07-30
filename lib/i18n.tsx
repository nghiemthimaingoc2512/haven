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
}

const dictionary: Record<Lang, Copy> = {
  vi: {
    brand: "Haven",
    tagline: "Nơi để đi về.",
    welcomeBody:
      "Không phải bác sĩ tâm lý. Không phải một người bạn giả vờ rảnh hơn thực tế. Chỉ là một nơi lắng nghe, ghi nhớ, và không bao giờ thấy phiền vì bạn.",
    welcomeCrisis:
      "Nếu bạn đang trong khủng hoảng, đây không phải là nơi phù hợp — hãy liên hệ đường dây nóng hỗ trợ tâm lý hoặc số cấp cứu tại nơi bạn sống. Còn nếu không, mình ở đây, và sẽ không đi đâu cả.",
    startTalking: "Bắt đầu nói",
    talkPlaceholder: "Nói ra điều bạn chưa từng nói — hoặc viết ra.",
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
    processingListening: "Haven đang lắng nghe…",
    processingReflecting: "Đang suy ngẫm…",
    reflectionHeading: "Suy ngẫm hôm nay",
    savedLabel: "Đã lưu ✓",
    willRemember: "Mình sẽ ghi nhớ điều này.",
    firstConversation: "Đây là khởi đầu câu chuyện của bạn.",
    lastTime: "Lần trước bạn có nhắc đến",
    standoutLabel: "Một điều nổi bật:",
    viewHistory: "Xem lịch sử",
    newConversation: "Trò chuyện mới",
    historyTitle: "Lịch sử",
    historyToday: "Hôm nay",
    historyYesterday: "Hôm qua",
    historyThisWeek: "Tuần này",
    historyEarlier: "Trước đó",
    historyEmpty: "Chưa có cuộc trò chuyện nào.",
    backToTalk: "Quay lại trò chuyện",
    storyTitle: "Chòm sao của bạn",
    onboardingContinue: "Tiếp tục",
    onboardingNameTitle: "Haven nên gọi bạn là gì?",
    onboardingNamePlaceholder: "Ví dụ: Bảo, Linh, An…",
    onboardingLangTitle: "Ngôn ngữ bạn muốn dùng",
    onboardingEnter: "Vào Haven",
    navHome: "Trang chính",
    navTalk: "Thì thầm",
    navDiscover: "Cực quang",
    navMyStory: "Chòm sao",
    navMe: "Tôi",
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
    welcomeHomeBody: "Từ giờ, Haven sẽ ở đây — lắng nghe, ghi nhớ, và đi cùng bạn.",
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
  },
  en: {
    brand: "Haven",
    tagline: "Somewhere to go.",
    welcomeBody:
      "Not a therapist. Not a friend pretending to be more available than they are. Just somewhere that listens, remembers, and won't get tired of you.",
    welcomeCrisis:
      "If you're in crisis, this isn't the right place — please contact a crisis line (988 in the US) or emergency services instead. Otherwise, I'm here, and I'm not going anywhere.",
    startTalking: "Start talking",
    talkPlaceholder: "Say the thing you haven't said yet — or write it.",
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
    processingListening: "Haven is listening…",
    processingReflecting: "Reflecting…",
    reflectionHeading: "Today's reflection",
    savedLabel: "Saved ✓",
    willRemember: "I'll remember this.",
    firstConversation: "This is the beginning of your story.",
    lastTime: "Last time you mentioned",
    standoutLabel: "One thing that stood out:",
    viewHistory: "View history",
    newConversation: "New conversation",
    historyTitle: "History",
    historyToday: "Today",
    historyYesterday: "Yesterday",
    historyThisWeek: "This week",
    historyEarlier: "Earlier",
    historyEmpty: "No conversations yet.",
    backToTalk: "Back to talking",
    storyTitle: "Your Constellation",
    onboardingContinue: "Continue",
    onboardingNameTitle: "What should Haven call you?",
    onboardingNamePlaceholder: "Alex, Emma, Bao…",
    onboardingLangTitle: "Preferred language",
    onboardingEnter: "Enter Haven",
    navHome: "Home",
    navTalk: "Whisper",
    navDiscover: "Aurora",
    navMyStory: "Constellation",
    navMe: "Me",
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
    welcomeHomeBody: "From now on, Haven will be here — listening, remembering, and growing alongside you.",
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
