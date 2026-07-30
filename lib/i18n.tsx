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
    statusIdle: "Chạm để nói",
    statusListening: "Đang lắng nghe…",
    statusPaused: "Đã tạm dừng — chạm để tiếp tục",
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
    statusIdle: "Tap to talk",
    statusListening: "Listening…",
    statusPaused: "Paused — tap to continue",
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
