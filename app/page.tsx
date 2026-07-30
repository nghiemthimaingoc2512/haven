"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function WelcomePage() {
  const { lang, setLang, t } = useLanguage();

  return (
    <main className="relative flex min-h-full flex-col items-center justify-center px-6 py-24">
      <div className="absolute right-6 top-6 flex gap-3 text-sm text-muted">
        <button
          type="button"
          onClick={() => setLang("vi")}
          className={lang === "vi" ? "text-ink" : "hover:text-ink"}
        >
          VI
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={lang === "en" ? "text-ink" : "hover:text-ink"}
        >
          EN
        </button>
      </div>

      <div className="w-full max-w-xl">
        <h1 className="font-serif text-5xl text-ink">{t.brand}</h1>
        <p className="mt-2 font-serif text-xl italic text-harbor">
          {t.tagline}
        </p>

        <div className="mt-10 space-y-4 text-[1.05rem] leading-relaxed text-ink/90">
          <p>{t.welcomeBody}</p>
          <p className="text-muted">{t.welcomeCrisis}</p>
        </div>

        <Link
          href="/talk"
          className="mt-12 inline-flex items-center justify-center rounded-full bg-ember px-7 py-3 text-paper transition-opacity hover:opacity-90"
        >
          {t.startTalking}
        </Link>
      </div>
    </main>
  );
}
