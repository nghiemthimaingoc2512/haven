"use client";

import Link from "next/link";
import { useLanguage, type Copy, type Lang } from "@/lib/i18n";
import { useMemories, type Memory } from "@/lib/storage";

interface Group {
  label: string;
  items: Memory[];
}

function groupMemories(memories: Memory[], t: Copy): Group[] {
  const now = Date.now();
  const buckets: { today: Memory[]; yesterday: Memory[]; week: Memory[]; earlier: Memory[] } = {
    today: [],
    yesterday: [],
    week: [],
    earlier: [],
  };
  for (const m of memories) {
    const diffDays = Math.floor(
      (now - new Date(m.createdAt).getTime()) / (24 * 60 * 60 * 1000),
    );
    if (diffDays <= 0) buckets.today.push(m);
    else if (diffDays === 1) buckets.yesterday.push(m);
    else if (diffDays < 7) buckets.week.push(m);
    else buckets.earlier.push(m);
  }
  const groups: Group[] = [];
  if (buckets.today.length) groups.push({ label: t.historyToday, items: buckets.today });
  if (buckets.yesterday.length)
    groups.push({ label: t.historyYesterday, items: buckets.yesterday });
  if (buckets.week.length) groups.push({ label: t.historyThisWeek, items: buckets.week });
  if (buckets.earlier.length) groups.push({ label: t.historyEarlier, items: buckets.earlier });
  return groups;
}

function formatTime(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleTimeString(lang === "vi" ? "vi-VN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const { lang, t } = useLanguage();
  const memories = useMemories();
  const groups = groupMemories(memories, t);

  return (
    <main className="flex min-h-full flex-col px-6 py-10">
      <header className="flex w-full items-center justify-between">
        <span className="font-serif text-sm text-muted">{t.brand}</span>
        <Link href="/talk" className="text-sm text-muted hover:text-ink">
          {t.backToTalk}
        </Link>
      </header>

      <div className="mx-auto w-full max-w-xl flex-1 py-10">
        <h1 className="font-serif text-3xl text-ink">{t.historyTitle}</h1>

        {groups.length === 0 && (
          <p className="mt-8 text-muted">{t.historyEmpty}</p>
        )}

        <div className="mt-8 space-y-10">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="text-xs uppercase tracking-wide text-muted">
                {group.label}
              </h2>
              <ul className="mt-3 divide-y divide-mist">
                {group.items.map((memory) => (
                  <li key={memory.id} className="py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs tabular-nums text-muted">
                        {formatTime(memory.createdAt, lang)}
                      </span>
                      <span className="text-xs text-harbor">{memory.emotion}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 font-serif text-ink/90">
                      {memory.reflection}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
