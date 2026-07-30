export {};

declare global {
  interface SpeechRecognitionResultItem {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionResultEntry {
    readonly length: number;
    readonly isFinal: boolean;
    item(index: number): SpeechRecognitionResultItem;
    [index: number]: SpeechRecognitionResultItem;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResultEntry;
    [index: number]: SpeechRecognitionResultEntry;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onresult:
      | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown)
      | null;
    onerror:
      | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown)
      | null;
    onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }

  interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
  }

  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
