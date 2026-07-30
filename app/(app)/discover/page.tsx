"use client";

import { useLanguage } from "@/lib/i18n";
import { Moon } from "@/components/Moon";

export default function DiscoverPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <Moon mood="curious" size={72} float />
      <h1 className="mt-4 font-serif text-2xl text-ink">{t.navDiscover}</h1>
      <p className="mt-2 text-muted">{t.comingSoon}</p>
    </div>
  );
}
