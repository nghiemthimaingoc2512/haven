"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { useDayPeriod } from "@/lib/insights";
import { Moon } from "@/components/Moon";

interface NavItem {
  href: string;
  label: (t: ReturnType<typeof useLanguage>["t"]) => string;
  emoji: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: (t) => t.navHome, emoji: "🌙" },
  { href: "/talk", label: (t) => t.navTalk, emoji: "💬" },
  { href: "/discover", label: (t) => t.navDiscover, emoji: "✨" },
  { href: "/story", label: (t) => t.navMyStory, emoji: "🌌" },
  { href: "/me", label: (t) => t.navMe, emoji: "👤" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const period = useDayPeriod();
  const isNight = period === "night";

  return (
    <div className="flex min-h-full flex-col">
      {/* Desktop: top nav */}
      <header className="haven-surface sticky top-0 z-20 mx-4 mt-4 hidden items-center justify-between rounded-full px-6 py-3 md:flex">
        <Link href="/home" className="flex items-center gap-2 font-serif text-lg text-ink">
          <Moon mood={isNight ? "sleeping" : "smiling"} size={26} glow={false} />
          {t.brand}
        </Link>
        <nav className="flex items-center gap-1" aria-label={t.navHome}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-secondary/40 text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.label(t)}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex flex-1 flex-col pb-24 md:pb-0">{children}</main>

      {/* Mobile: bottom nav */}
      <nav
        aria-label={t.navHome}
        className="haven-surface fixed inset-x-3 bottom-3 z-20 flex items-center justify-between rounded-full px-2 py-2 md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={item.label(t)}
              className={`flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[0.65rem] transition-colors ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <span aria-hidden="true" className="text-lg">
                {item.emoji}
              </span>
              {item.label(t)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
